# buildmywebsites
A full-stack web application built with Django REST Framework and React for managing services, orders, users, and admin operations.

## Tech Stack

### Backend
- Django
- Django REST Framework
- Token Authentication
- SQLite (development)

### Frontend
- React
- React Router
- Bootstrap

## Features

### User
- User registration & login
- Browse available services
- Place new orders
- View personal orders
- Make payments

### Admin
- Secure admin authentication
- View platform statistics (users, services, orders)
- Manage services
- Manage and update order status

## Project Structure
buildmywebsites/
│
├── backend/ # Django REST API
├── frontend/ # React application
└── README.md

## Getting Started

## Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver

## Frontend
cd frontend
npm install
npm run dev


### Authentication
Token-based authentication (Django REST Framework)

Protected routes on frontend

### Status
This project is under active development and follows a CI-ready structure.

## Author
Yohana N. Julius


