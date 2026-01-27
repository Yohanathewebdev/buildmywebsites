from django.contrib.auth import get_user_model, authenticate
from django.shortcuts import get_object_or_404
from django.http import HttpResponse

from rest_framework import generics, permissions, serializers
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token

from .models import Service, Order, OrderFeedback
from .serializers import (
    ServicePublicSerializer,
    ServicePrivateSerializer,
    UserSerializer,
    UserCreateSerializer,
    OrderSerializer,
    OrderCreateSerializer,
    OrderFeedbackSerializer,
)
from .permisions import IsAdminOrReadOnly

User = get_user_model()

# =====================================================
# Home
# =====================================================
def home(request):
    return HttpResponse("Welcome to BuildMyWebsite 🚀")


# =====================================================
# API Root
# =====================================================
@api_view(["GET"])
def api_root(request, format=None):
    return Response({
        "services": reverse("service-list", request=request, format=format),
        "users": reverse("user-list", request=request, format=format),
    })


# =====================================================
# Users
# =====================================================
class UserListView(generics.ListAPIView):
    queryset = User.objects.all().order_by("-date_joined")
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]


class UserCreateView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserCreateSerializer
    permission_classes = [permissions.AllowAny]


class UserDetailView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]


# =====================================================
# Email Login
# =====================================================
class EmailAuthTokenSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        try:
            user_obj = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid email or password")

        # Use username internally to authenticate
        user = authenticate(username=user_obj.username, password=password)
        if not user:
            raise serializers.ValidationError("Invalid email or password")

        if not user.is_active:
            raise serializers.ValidationError("Account is disabled")

        attrs["user"] = user
        return attrs


class CustomAuthToken(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = EmailAuthTokenSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]

        token, _ = Token.objects.get_or_create(user=user)

        return Response({
            "token": token.key,
            "user_id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "is_admin": user.is_staff or user.is_superuser,
        })


# =====================================================
# Admin: Toggle User Active / Disabled
# =====================================================
class AdminToggleUserView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def patch(self, request, pk):
        user = get_object_or_404(User, pk=pk)
        if user.is_superuser or user.is_staff:
            return Response({"detail": "Cannot modify admin account"}, status=403)
        user.is_active = not user.is_active
        user.save(update_fields=["is_active"])
        return Response({
            "id": user.id,
            "email": user.email,
            "is_active": user.is_active,
        })


# =====================================================
# Services
# =====================================================
class ServiceList(generics.ListCreateAPIView):
    queryset = Service.objects.all()
    permission_classes = [IsAdminOrReadOnly]

    def get_serializer_class(self):
        return ServicePrivateSerializer if self.request.user.is_authenticated else ServicePublicSerializer


class ServiceDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Service.objects.all()
    permission_classes = [IsAdminOrReadOnly]

    def get_serializer_class(self):
        return ServicePrivateSerializer if self.request.user.is_authenticated else ServicePublicSerializer


# =====================================================
# Orders
# =====================================================
class OrderCreateView(generics.CreateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class MyOrdersView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by("-created_at")


class OrderListView(generics.ListAPIView):
    queryset = Order.objects.all().order_by("-created_at")
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAdminUser]


class OrderUpdateView(generics.RetrieveUpdateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAdminUser]


class CreateOrderFeedbackView(generics.CreateAPIView):
    serializer_class = OrderFeedbackSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class AdminFeedbackListView(generics.ListAPIView):
    queryset = OrderFeedback.objects.all().select_related("order", "user")
    serializer_class = OrderFeedbackSerializer
    permission_classes = [permissions.IsAdminUser]


# =====================================================
# Admin Dashboard Stats
# =====================================================
class AdminDashboardStatsView(generics.GenericAPIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        return Response({
            "totalUsers": User.objects.count(),
            "totalServices": Service.objects.count(),
            "totalOrders": Order.objects.count(),
            "pendingOrders": Order.objects.filter(status="pending").count(),
            "completedOrders": Order.objects.filter(status="completed").count(),
        })
