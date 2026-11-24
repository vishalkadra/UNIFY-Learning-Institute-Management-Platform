import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import API, { getApiError } from "./api";

export default function PaymentPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");
  const [paid, setPaid] = useState(false);

  // Load Razorpay Checkout
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  };

  // Load Course
  useEffect(() => {
    API.get("/courses/")
      .then(({ data }) => {
        const courses = data.results || data || [];

        const found = courses.find(
          (x) => String(x.id) === String(id)
        );

        if (found) {
          setCourse(found);
        } else {
          setError("Course not found.");
        }
      })
      .catch((e) =>
        setError(getApiError(e, "Course could not be loaded."))
      )
      .finally(() => setLoading(false));
  }, [id]);

  // Start Payment
  const startPayment = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    setError("");
    setPaying(true);

    try {
      // Load Razorpay Script
      const loaded = await loadRazorpay();

      if (!loaded) {
        throw new Error("Razorpay checkout could not be loaded.");
      }

      // Create Razorpay Order
      const { data } = await API.post(
        "/learning/payments/create-order/",
        {
          course_id: Number(id),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Razorpay Checkout Options
      const options = {
        key: data.key_id,
        amount: data.amount,
        currency: data.currency,
        name: "Unify",
        description: course.name,
        order_id: data.order_id,

        handler: async function (response) {
          try {
            // Verify Payment
            const result = await API.post(
              "/learning/payments/verify/",
              {
                enrollment_id: data.enrollment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (result.data.status === "paid") {
              setPaid(true);
            } else {
              setError("Payment verification failed.");
            }
          } catch (e) {
            setError(
              getApiError(e, "Payment verification failed.")
            );
          } finally {
            setPaying(false);
          }
        },

        modal: {
          ondismiss: function () {
            setPaying(false);
          },
        },

        theme: {
          color: "#2563eb",
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", function (response) {
        setError(
          response.error.description || "Payment failed."
        );
        setPaying(false);
      });

      razorpay.open();

    } catch (e) {
      setError(
        getApiError(e, "Unable to start payment.")
      );
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          {error || "Course not found."}
        </div>
      </div>
    );
  }

  return (
    <div className="auth-shell">
      <div
        className="form-card"
        style={{ maxWidth: 620, width: "100%" }}
      >
        <div className="text-center">
          <span className="icon-badge icon-badge--lg auth-card-icon" aria-hidden="true">
            <ShieldCheck size={32} />
          </span>

          <h2 className="mb-1">
            Secure Course Payment
          </h2>

          <p className="text-muted">{course.name}</p>
        </div>

        <div className="pay-summary d-flex justify-content-between align-items-center my-4">
          <span>Total amount</span>

          <strong className="pay-summary__amount">
            ₹{Number(course.price || 0).toLocaleString("en-IN")}
          </strong>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {paid ? (
          <div className="alert alert-success" role="status">
            <h5 className="fw-bold">
              Payment Successful!
            </h5>

            Your course access has been activated.
          </div>
        ) : (
          <>
            <p className="text-muted small">
              Your payment is secured by Razorpay.
              Complete your payment to activate course access.
            </p>

            <button
              className="btn btn-primary btn-lg w-100"
              onClick={startPayment}
              disabled={paying}
            >
              {paying
                ? "Processing..."
                : "Continue to Payment"}
            </button>
          </>
        )}

        {paid ? (
          <button
            className="btn btn-primary w-100 mt-3"
            onClick={() => navigate("/Home")}
          >
            Go to Dashboard
          </button>
        ) : (
          <button
            className="btn btn-link w-100 mt-2"
            onClick={() => navigate(`/courses/${id}`)}
            disabled={paying}
          >
            Back to course
          </button>
        )}
      </div>
    </div>
  );
}