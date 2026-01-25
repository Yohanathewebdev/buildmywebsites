import os
from pathlib import Path
import dj_database_url

# =========================
# Paths
# =========================
BASE_DIR = Path(__file__).resolve().parent.parent

# =========================
# Core settings
# =========================
DEBUG = False
ALLOWED_HOSTS = ["*"]

# Django requires these
ROOT_URLCONF = "buildmywebsite.urls"       # <-- your urls.py location
WSGI_APPLICATION = "buildmywebsite.wsgi.application"

# =========================
# Database (PostgreSQL on Railway)
# =========================
DATABASES = {
    "default": dj_database_url.parse(
        os.environ.get("DATABASE_URL"),
        conn_max_age=600,
        ssl_require=True
    )
}

# =========================
# Media files (optional)
# =========================
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

# =========================
# Installed apps
# =========================
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",  # needed for admin & DRF browsable API
    "rest_framework",
    "website",  # your custom app
]

# =========================
# Middleware
# =========================
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

# =========================
# Custom User
# =========================
AUTH_USER_MODEL = "website.User"

# =========================
# Authentication Backends (custom)
# =========================
AUTHENTICATION_BACKENDS = [
    "django.contrib.auth.backends.ModelBackend",  # default
    "website.auth_website.EmailBackend",
    "website.backends.EmailBackend",
]

# =========================
# Django REST Framework
# =========================
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.SessionAuthentication",
        "rest_framework.authentication.TokenAuthentication",
    ],
}

# =========================
# Optional security (production)
# =========================
SECURE_SSL_REDIRECT = False
SESSION_COOKIE_SECURE = False
CSRF_COOKIE_SECURE = False
