import os
from pathlib import Path
import dj_database_url

BASE_DIR = Path(__file__).resolve().parent.parent

# =========================
# Core settings
# =========================
DEBUG = False
ALLOWED_HOSTS = ["*"]

# =========================
# Database (PostgreSQL on Railway)
# =========================
DATABASES = {
    'default': dj_database_url.parse(
        os.environ.get("DATABASE_URL"),  # Railway DATABASE_URL
        conn_max_age=600,
        ssl_require=True
    )
}

# =========================
# Static files (WhiteNoise)
# =========================
STATIC_URL = "/static/"
STATICFILES_DIRS = [BASE_DIR / "static"]  # optional, e.g., React build
STATIC_ROOT = BASE_DIR / "staticfiles"
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

# =========================
# Media files
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
    "django.contrib.staticfiles",
    "rest_framework",
    "website",  # your custom app
]

# =========================
# Middleware
# =========================
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",  # MUST be first for static files
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

# =========================
# Custom User Model
# =========================
AUTH_USER_MODEL = "website.User"

# =========================
# Authentication Backends (custom)
# =========================
# Make sure these files exist, otherwise Django will crash
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
# Other recommended production settings
# =========================
# Security
SECURE_SSL_REDIRECT = False  # can enable later with HTTPS
SESSION_COOKIE_SECURE = False
CSRF_COOKIE_SECURE = False
