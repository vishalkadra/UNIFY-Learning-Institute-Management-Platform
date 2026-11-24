# 🚀 UNIFY – Learning & Institute Management Platform

A full-stack Education and Institute Management Platform designed to simplify educational institute operations, course management, student enrollments, online payments, and learning activities through a centralized web application.

## 📌 Project Overview

**UNIFY** is a full-stack web application developed using **Django REST Framework** and **React.js**.

The platform provides dedicated functionalities for students, staff, and administrators, making it easier to manage courses, enrollments, online classes, notifications, and payments.

The application follows a frontend-backend architecture with REST API integration.

## ✨ Key Features

### 👨‍🎓 Student Features
- User registration and login.
- OTP-based verification and password recovery.
- Browse available courses and view course details.
- Enroll in available courses.
- Online course payments using Razorpay.
- Access online classes for purchased courses.
- View notifications and learning-related updates.
- Manage account information.

### 🛠️ Admin & Staff Features
- Dedicated admin and staff dashboards.
- Manage students and user accounts.
- Add, update, view, and delete courses.
- Manage student enrollments.
- Manage online classes.
- Send and manage notifications.
- View dashboard statistics.
- Manage placement information and complaints.

### 🔐 Authentication & Security
- Token-based authentication.
- Role-based access for students, staff, and administrators.
- OTP-based verification.
- Password management.
- Environment variables for sensitive configuration.

### 💳 Payment Integration
- Razorpay payment gateway integration.
- Online course payment functionality.
- Payment order creation and verification.
- Enrollment payment status management.

## 💻 Technologies Used

**Frontend**
- React.js
- JavaScript
- HTML5
- CSS3
- Bootstrap
- Vite

**Backend**
- Python
- Django
- Django REST Framework
- REST APIs

**Database**
- MySQL

**Payment Gateway**
- Razorpay

**Development Tools**
- Visual Studio Code
- Git
- GitHub
- Postman

## 📂 Project Structure

```text
UNIFY/
├── Unify backend/
│   ├── Unify/
│   ├── learning/
│   ├── manage.py
│   └── requirements.txt
├── Unify_frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md
```

## ⚙️ Installation & Setup

Follow these steps to run the project locally.

### 1. Clone the Repository

```bash
git clone https://github.com/vishalkadra/UNIFY-Learning-Institute-Management-Platform.git
```

### 2. Backend Setup

Navigate to the backend folder:

```bash
cd "UNIFY-Learning-Institute-Management-Platform/Unify backend"
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate the virtual environment on Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

### 3. Environment Configuration

Create a `.env` file inside the backend folder and configure the required environment variables.

These may include:
- Django secret key
- Database credentials
- Email configuration
- Razorpay API credentials

**Important:** Never upload your actual `.env` file or secret credentials to GitHub.

### 4. Database Setup

Configure your MySQL database and database credentials in Django settings.

Run migrations:

```bash
python manage.py makemigrations
python manage.py migrate
```

Create an administrator account:

```bash
python manage.py createsuperuser
```

Start the backend server:

```bash
python manage.py runserver
```

Backend URL:

```text
http://127.0.0.1:8000/
```

### 5. Frontend Setup

Open another terminal and navigate to the frontend folder:

```bash
cd "UNIFY-Learning-Institute-Management-Platform/Unify_frontend"
```

Install dependencies:

```bash
npm install
```

Start the frontend development server:

```bash
npm run dev
```

Open the local URL displayed in your terminal.

## 🔗 GitHub Repository

[UNIFY – Learning & Institute Management Platform](https://github.com/vishalkadra/UNIFY-Learning-Institute-Management-Platform)

## 👨‍💻 Developer

**Vishal Kadra**

Aspiring Python Full Stack Developer

Interested in developing modern, responsive, and user-friendly web applications using Python, Django, React.js, and MySQL.

- **GitHub:** [github.com/vishalkadra](https://github.com/vishalkadra)
- **LinkedIn:** [linkedin.com/in/vishal-kadra](https://www.linkedin.com/in/vishal-kadra/)

---

⭐ If you find this project interesting, consider giving it a star on GitHub!

**Thank you for visiting UNIFY!**