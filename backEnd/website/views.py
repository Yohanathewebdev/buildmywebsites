from django.http import HttpResponse
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404

from rest_framework import generics, permissions
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework.views import APIView
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token

from .models import Service, Order, OrderFeedback
from .serializers import (
    EmailAuthTokenSerializer,
    ServicePublicSerializer,
    ServicePrivateSerializer,
    UserSerializer,
    UserCreateSerializer,
    OrderSerializer,
    OrderCreateSerializer,
    OrderFeedbackSerializer
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
# Admin: Toggle User Active / Disabled
# =====================================================
class AdminToggleUserView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def patch(self, request, pk):
        user = get_object_or_404(User, pk=pk)

        # 🔒 Protect admins
        if user.is_superuser or user.is_staff:
            return Response(
                {"detail": "Cannot modify admin account"},
                status=403
            )

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
        return (
            ServicePrivateSerializer
            if self.request.user.is_authenticated
            else ServicePublicSerializer
        )


class ServiceDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Service.objects.all()
    permission_classes = [IsAdminOrReadOnly]

    def get_serializer_class(self):
        return (
            ServicePrivateSerializer
            if self.request.user.is_authenticated
            else ServicePublicSerializer
        )


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
# Authentication (Token Login)
# =====================================================
class CustomAuthToken(ObtainAuthToken):
    serializer_class = EmailAuthTokenSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(
            data=request.data,
            context={"request": request}
        )
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data["user"]

        # 🔒 Block disabled users
        if not user.is_active:
            return Response(
                {"detail": "Account is disabled"},
                status=403
            )

        token, _ = Token.objects.get_or_create(user=user)

        return Response({
            "token": token.key,
            "user_id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "is_admin": user.is_staff or user.is_superuser,
        })


# =====================================================
# Orders (User + Admin)
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


class CreateOrderFeedbackView(generics.CreateAPIView):
    serializer_class = OrderFeedbackSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class AdminFeedbackListView(generics.ListAPIView):
    queryset = OrderFeedback.objects.all().select_related("order", "user")
    serializer_class = OrderFeedbackSerializer
    permission_classes = [permissions.IsAdminUser]
