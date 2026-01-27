import os
from pathlib import Path
import dj_database_url

# =========================
# Base directory
# =========================
BASE_DIR = Path(__file__).resolve().parent.parent

# =========================
# Environment detection
# =========================
ON_RAILWAY = "RAILWAY_STATIC_URL" in os.environ

# =========================
# Security
# =========================
SECRET_KEY = os.environ.get(
    "SECRET_KEY",
    "ni@4=gb&$u*u3qxoqdnc9f-)zvfpy*pn&q-091m434&ranbwld"  # fallback for dev
)

DEBUG = not ON_RAILWAY

ALLOWED_HOSTS = [
    "localhost",
    "127.0.0.1",
    "buildmywebsites-production.up.railway.app",
]

# ======== Fix for Railway SSL / HTTPS redirect loop ========
USE_X_FORWARDED_HOST = True
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# =========================
# Application definition
# =========================
INSTALLED_APPS = [
    "corsheaders",

    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    "rest_framework",

    "website",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",

    "corsheaders.middleware.CorsMiddleware",

    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "buildmywebsite.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
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

WSGI_APPLICATION = "buildmywebsite.wsgi.application"

# =========================
# Database
# =========================
if ON_RAILWAY:
    DATABASES = {
        "default": dj_database_url.parse(
            os.environ.get("DATABASE_URL"),
            conn_max_age=600,
            ssl_require=True,
        )
    }
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }

# =========================
# Password validation
# =========================
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# =========================
# Custom User
# =========================
AUTH_USER_MODEL = "website.User"

AUTHENTICATION_BACKENDS = [
    "django.contrib.auth.backends.ModelBackend",
    "website.auth_website.EmailBackend",
    "website.backends.EmailBackend",
]

# =========================
# Django REST Framework
# =========================
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.TokenAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.AllowAny",
    ],
}

# =========================
# CORS (React on Vercel)
# =========================
CORS_ALLOWED_ORIGINS = [
    "https://buildmywebsites.vercel.app/",  # 🔁 replace with real Vercel URL
    "http://localhost:3000",
]

CORS_ALLOW_CREDENTIALS = True

# =========================
# CSRF trusted origins
# =========================
CSRF_TRUSTED_ORIGINS = [
    "https://buildmywebsites-production.up.railway.app",
    "https://buildmywebsites.vercel.app/",  # 🔁 replace with real Vercel URL
    "http://localhost:3000",
]

# =========================
# Static & Media files
# =========================
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

STATICFILES_STORAGE = (
    "whitenoise.storage.CompressedManifestStaticFilesStorage"
)

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

# =========================
# Internationalization
# =========================
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

# =========================
# Default primary key
# =========================
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# =========================s
# Production security
# =========================
SECURE_SSL_REDIRECT = ON_RAILWAY
SESSION_COOKIE_SECURE = ON_RAILWAY
CSRF_COOKIE_SECURE = ON_RAILWAY
