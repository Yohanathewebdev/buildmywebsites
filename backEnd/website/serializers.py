from rest_framework import serializers
from django.contrib.auth import authenticate, get_user_model
from .models import Service, ServiceImage, Order
from .models import OrderFeedback

# =========================
# Service Serializers
# =========================

class ServiceImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceImage
        fields = ["id", "image", "caption"]


class ServicePublicSerializer(serializers.ModelSerializer):
    images = ServiceImageSerializer(many=True, read_only=True)

    class Meta:
        model = Service
        fields = [
            "id",
            "title",
            "type",
            "description",
            "duration",
            "price",
            "currency",
            "images",
        ]


class ServicePrivateSerializer(serializers.ModelSerializer):
    images = ServiceImageSerializer(many=True, read_only=True)

    class Meta:
        model = Service
        fields = [
            "id",
            "title",
            "type",
            "description",
            "duration",
            "price",
            "currency",
            "images",
        ]

# =========================
# User Serializers
# =========================

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "username", "full_name"]


class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["email", "username", "full_name", "password"]

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

# =========================
# Authentication Serializer
# =========================

class EmailAuthTokenSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        if not email or not password:
            raise serializers.ValidationError("Email and password are required.")

        # ✅ IMPORTANT FIX
        user = authenticate(
            request=self.context.get("request"),
            email=email,
            password=password
        )

        if not user:
            raise serializers.ValidationError("Invalid email or password.")

        attrs["user"] = user
        return attrs

# =========================
# Order Serializers
# =========================

class OrderSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    service = ServicePublicSerializer(read_only=True)

    class Meta:
        model = Order
        fields = "__all__"


class OrderCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = [
            "service",
            "contact_phone",
            "description",
            "document",
        ]
 

class OrderFeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderFeedback
        fields = [
            "id",
            "order",
            "rating",
            "comment",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]

    def validate(self, data):
        order = data["order"]
        request = self.context["request"]

        if order.user != request.user:
            raise serializers.ValidationError("Not your order")

        if order.status != "completed":
            raise serializers.ValidationError("Order not completed")

        if hasattr(order, "feedback"):
            raise serializers.ValidationError("Feedback already submitted")

        return data

   