from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings


# =========================
# Custom User Model
# =========================
class User(AbstractUser):
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=100, blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email


# =========================
# Service Model
# =========================
class Service(models.Model):
    SERVICE_TYPE = [
        ('bronze', 'Bronze'),
        ('gold', 'Gold'),
        ('platinum', 'Platinum'),
    ]

    CURRENCY_TYPE = [
        ('USD', 'USD'),
        ('TSH', 'TSH'),
        ('KSH', 'KSH'),
        ('UGX', 'UGX'),
    ]

    title = models.CharField(max_length=100)
    type = models.CharField(max_length=50, choices=SERVICE_TYPE)
    description = models.TextField()
    duration = models.CharField(max_length=50, default="2 days")  # 🔥 FIXED DURATION
    price = models.PositiveIntegerField()
    currency = models.CharField(max_length=10, choices=CURRENCY_TYPE, default="USD")

    def __str__(self):
        return f"{self.title} ({self.type})"


# =========================
# Service Images
# =========================
class ServiceImage(models.Model):
    service = models.ForeignKey(
        Service,
        related_name='images',
        on_delete=models.CASCADE
    )
    image = models.ImageField(upload_to='service_images/')
    caption = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"Image for {self.service.title}"


# =========================
# Orders
# =========================
class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    service = models.ForeignKey(Service, on_delete=models.CASCADE)
    description = models.TextField(blank=True, null=True)
    contact_phone = models.CharField(max_length=20, default='+255742461917')  # NEW: phone number
    document = models.FileField(upload_to='order_documents/', blank=True, null=True)  # NEW: optional file
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.full_name or self.user.email} - {self.service.title}"


class OrderFeedback(models.Model):
    order = models.OneToOneField(
        "Order",
        on_delete=models.CASCADE,
        related_name="feedback"
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )
    rating = models.PositiveSmallIntegerField()  # 1–5
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Feedback for Order #{self.order.id}"
