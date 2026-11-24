\# UNIFY – Learning \& Institute Management Platform



A full-stack web application designed to manage educational institutes, online courses, student enrollments, payments, and learning activities through a centralized platform.



\## 🚀 Project Overview



\*\*UNIFY\*\* is an Education and Institute Management Platform developed using Django REST Framework and React.js.



The platform provides separate functionalities for students, staff, and administrators. Students can explore courses, enroll in programs, make online payments, and access learning resources, while administrators can manage courses, users, enrollments, notifications, and other institute activities.



\## ✨ Key Features



\### 👨‍🎓 Student Features

\- User registration and login.

\- OTP-based verification and password recovery.

\- Browse available courses and course details.

\- Course enrollment.

\- Online course payments using Razorpay.

\- Access to enrolled course resources and online classes.

\- Notifications and announcements.

\- Submit complaints and queries.



\### 🛠️ Admin \& Staff Features

\- Admin dashboard and statistics.

\- Manage users and staff permissions.

\- Add, update, and delete courses.

\- Manage experts and placements.

\- Manage student enrollments.

\- Manage online classes.

\- Create and manage notifications.

\- Manage student complaints.



\### 🔐 Authentication \& Security

\- Token-based authentication.

\- Role-based access control.

\- Protected routes.

\- OTP verification.

\- Environment-based configuration for sensitive credentials.



\### 💳 Payment Integration

\- Razorpay payment gateway integration.

\- Order creation and payment verification.

\- Course enrollment management.



\## 🧰 Technologies Used



\### Frontend

\- React.js

\- JavaScript

\- HTML5

\- CSS3

\- Bootstrap

\- Vite



\### Backend

\- Python

\- Django

\- Django REST Framework

\- REST APIs



\### Database

\- MySQL



\### Payment Gateway

\- Razorpay



\### Tools

\- Git

\- GitHub

\- Visual Studio Code

\- Postman



\## 📂 Project Structure



```text

UNIFY/

│

├── Unify backend/

│   ├── Learning/

│   ├── MyApp/

│   ├── Unify/

│   │   ├── settings.py

│   │   ├── urls.py

│   │   └── wsgi.py

│   ├── manage.py

│   └── requirements.txt

│

├── Unify\_frontend/

│   ├── public/

│   ├── src/

│   ├── package.json

│   └── vite.config.js

│

└── .gitignore

```



\## ⚙️ Installation \& Setup



\### Prerequisites



Make sure you have installed:



\- Python

\- Node.js and npm

\- MySQL

\- Git



\### 1. Clone the Repository



```bash

git clone https://github.com/vishalkadra/UNIFY-Learning-Institute-Management-Platform.git

```



Navigate to the project directory:



```bash

cd UNIFY-Learning-Institute-Management-Platform

```



\### 2. Backend Setup



Navigate to the backend folder:



```bash

cd "Unify backend"

```



Create and activate a virtual environment:



```bash

python -m venv venv

```



Windows:



```bash

venv\\Scripts\\activate

```



Install dependencies:



```bash

pip install -r requirements.txt

```



\### 3. Environment Configuration



Create a `.env` file inside the `Unify backend` directory.



Add the following configuration:



```env

DJANGO\_SECRET\_KEY=your\_django\_secret\_key



EMAIL\_HOST\_PASSWORD=your\_email\_password



RAZORPAY\_KEY\_ID=your\_razorpay\_key\_id



RAZORPAY\_KEY\_SECRET=your\_razorpay\_key\_secret

```



Configure your MySQL database credentials in Django settings using environment variables.



\*\*Important:\*\* Never upload your `.env` file or expose secret credentials on GitHub.



\### 4. Database Migration



Run the following commands:



```bash

python manage.py makemigrations

python manage.py migrate

```



Create an administrator account:



```bash

python manage.py createsuperuser

```



Start the Django development server:



```bash

python manage.py runserver

```



Backend will run at:



`http://127.0.0.1:8000/`



\### 5. Frontend Setup



Open a new terminal and navigate to the frontend folder:



```bash

cd "Unify\_frontend"

```



Install dependencies:



```bash

npm install

```



Start the React development server:



```bash

npm run dev

```



Open the local frontend URL displayed in your terminal.



\## 🔗 GitHub Repository



\[UNIFY – Learning \& Institute Management Platform](https://github.com/vishalkadra/UNIFY-Learning-Institute-Management-Platform)



\## 👨‍💻 Developer



\*\*Vishal Kadra\*\*



Aspiring Python Full Stack Developer



Interested in developing modern, responsive, and user-friendly web applications using Python, Django, React.js, and MySQL.



\- GitHub: \[@vishalkadra](https://github.com/vishalkadra)

\- LinkedIn: \[Vishal Kadra](https://www.linkedin.com/in/vishal-kadra)



\---



⭐ If you find this project interesting, consider giving it a star!

