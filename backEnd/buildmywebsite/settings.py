import os
from pathlib import Path
import dj_database_url



SECRET_KEY = "ni@4=gb&$u*u3qxoqdnc9f-)zvfpy*pn&q-091m434&ranbwld"
# =========================
# Paths
# =========================
BASE_DIR = Path(__file__).resolve().parent.parent

# =========================
# Environment Detection
# =========================
ON_RAILWAY = os.environ.get("RAILWAY_ENV") == "production"

# =========================
# Core settings
# =========================
DEBUG = not ON_RAILWAY
ALLOWED_HOSTS = ['localhost', '127.0.0.1', 'buildmywebsites-production.up.railway.app']


ROOT_URLCONF = "buildmywebsite.urls"
WSGI_APPLICATION = "buildmywebsite.wsgi.application"

# =========================
# Database
# =========================
if ON_RAILWAY:
    # Production: Railway PostgreSQL
    DATABASES = {
        "default": dj_database_url.parse(
            os.environ.get("DATABASE_URL"),
            conn_max_age=600,
            ssl_require=True
        )
    }
else:
    # Local development: SQLite
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }

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
# Templates (needed for admin & DRF browsable API)
# =========================
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],  # optional for custom templates
        "APP_DIRS": True,                  # finds templates in apps automatically
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

# =========================
# Static & Media files
# =========================
STATIC_URL = "/static/"
# No STATICFILES_DIRS needed if React handles frontend
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

# =========================
# Custom User
# =========================
AUTH_USER_MODEL = "website.User"

# =========================
# Authentication Backends
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
# Security settings
# =========================
SECURE_SSL_REDIRECT = ON_RAILWAY
SESSION_COOKIE_SECURE = ON_RAILWAY
CSRF_COOKIE_SECURE = ON_RAILWAY
