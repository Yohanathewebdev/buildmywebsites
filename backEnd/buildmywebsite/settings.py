import os
from pathlib import Path
import dj_database_url

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
ALLOWED_HOSTS = ["*"] if ON_RAILWAY else ["localhost", "127.0.0.1"]

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
# Templates (
