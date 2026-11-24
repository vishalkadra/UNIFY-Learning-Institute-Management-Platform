# Unify Frontend – Learning Features

Added without changing the existing color system or existing API request formats:
- Notification bell in the top navbar
- Read/unread notifications
- Online Classes navbar/page
- Student access filtered by paid course enrollment
- Upcoming/live/ended class status
- Staff/admin pages for classes, notifications and enrollments
- Dashboard learning metrics
- Payment-ready course enrollment flow

The payment page intentionally does not pretend to process money. It creates a pending enrollment; Razorpay should verify payment on the backend and then activate the enrollment.
