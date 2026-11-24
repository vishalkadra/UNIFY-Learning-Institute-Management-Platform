# Unify Learning Features

This addition keeps the existing MyApp authentication, course, complaint and other APIs intact.
A separate `Learning` app adds:
- Notifications with unread/read state
- Course enrollments
- Paid-course access control
- Online classes with upcoming/live/ended state
- Staff/admin management APIs
- Learning dashboard stats

## Backend
1. Activate your existing virtual environment.
2. Run:
   `python manage.py migrate`
3. Run:
   `python manage.py runserver`

New endpoints:
- `/learning/notifications/`
- `/learning/enrollments/`
- `/learning/classes/`
- `/learning/stats/`
- `/learning/summary/`

### Payment integration
The current frontend creates an enrollment as `pending`.
When Razorpay is added, after server-side payment verification, mark that enrollment as `paid`.
Only `paid` enrollments can see the corresponding course's online classes.

For local testing, staff/admin can use the Course Enrollments dashboard and click `Activate Access`.

## Frontend
1. `npm install`
2. `npm run dev`

The existing API base URL remains `http://127.0.0.1:8000`.
