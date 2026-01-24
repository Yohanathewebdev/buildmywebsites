from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Service, ServiceImage, Order

# =========================
# Custom User Admin
# =========================
class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'username', 'full_name', 'is_staff', 'is_active')
    list_filter = ('is_staff', 'is_superuser', 'is_active')
    search_fields = ('email', 'username', 'full_name')
    ordering = ('email',)
    fieldsets = (
        (None, {'fields': ('email', 'username', 'full_name', 'password')}),
        ('Permissions', {'fields': ('is_staff', 'is_superuser', 'is_active', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'full_name', 'password1', 'password2', 'is_staff', 'is_active')}
        ),
    )

admin.site.register(User, UserAdmin)


# =========================
# Service Admin with Images
# =========================
class ServiceImageInline(admin.TabularInline):
    model = ServiceImage
    extra = 1

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('title', 'type', 'price', 'currency')  # remove 'duration'
    list_filter = ('type', 'currency')
    search_fields = ('title', 'description')
    inlines = [ServiceImageInline]


# =========================
# Order Admin
# =========================
@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'service', 'status', 'created_at')
    list_filter = ('status', 'service')
    search_fields = ('user__email', 'user__full_name', 'service__title')
    readonly_fields = ('created_at',)
