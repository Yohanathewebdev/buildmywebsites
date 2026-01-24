from django.urls import path
from website import views
from rest_framework.urlpatterns import format_suffix_patterns
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', views.home, name='home'),  # normal homepage
    path('api/', views.api_root, name='api-root'),
    path("admin/dashboard/", views.AdminDashboardStatsView.as_view(), name="admin-dashboard"),
    # Services
    path('api/services/', views.ServiceList.as_view(), name='service-list'),
    path('api/services/<int:pk>/', views.ServiceDetail.as_view(), name='service-detail'),

    # Users
    path("admin/users/<int:pk>/toggle/",views.AdminToggleUserView.as_view()),

    path("users/", views.UserListView.as_view(), name="user-list"),
    path("users/register/", views.UserCreateView.as_view(), name="user-register"),
    path("users/<int:pk>/", views.UserDetailView.as_view(), name="user-detail"),
    path("users/login/", views.CustomAuthToken.as_view(), name="user-login"),

    # Orders
    path("orders/", views.OrderListView.as_view(), name="order-list"),          # Admin only
    path("orders/my/", views.MyOrdersView.as_view(), name="my-orders"),         # Logged-in user
    path("orders/create/", views.OrderCreateView.as_view(), name="order-create"),
    path("orders/<int:pk>/", views.OrderUpdateView.as_view(), name="order-update"),  # Admin only


    path(
    "orders/feedback/",
    views.CreateOrderFeedbackView.as_view(),
    name="order-feedback-create"
),
path(
    "admin/feedback/",
    views.AdminFeedbackListView.as_view(),
    name="admin-feedback-list"
),

]

urlpatterns = format_suffix_patterns(urlpatterns)

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
