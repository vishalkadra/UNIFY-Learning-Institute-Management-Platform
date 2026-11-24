import { useState } from "react";
import ComplaintForm from "./ComplaintForm";
import { Tilt3D, Reveal } from "./motion3d";
import {
  Briefcase,
  GraduationCap,
  Building2,
  Monitor,
  BookOpen,
  PhoneCall,
  Mail,
  Phone,
  ArrowRight,
  LifeBuoy,
} from "lucide-react";

const categories = [
  {
    type: "placement",
    title: "Placement Related Issues",
    description:
      "For placement, company drives, interview scheduling, or placement card related issues.",
    icon: Briefcase,
    iconColor: "#2563eb",
  },
  {
    type: "trainer",
    title: "Trainer Complaint",
    description:
      "Raise a complaint regarding trainer behaviour, teaching methodology, or class issues.",
    icon: GraduationCap,
    iconColor: "#8b5cf6",
  },
  {
    type: "management",
    title: "Management Complaint",
    description:
      "For complaints related to management, administration, fee receipts, or policies.",
    icon: Building2,
    iconColor: "#d97706",
  },
  {
    type: "hardware",
    title: "Hardware & Lab Complaint",
    description:
      "Report computer hardware failures, laboratory equipment, system, or internet problems.",
    icon: Monitor,
    iconColor: "#0284c7",
  },
  {
    type: "class",
    title: "Class / Course Complaint",
    description:
      "Raise an issue related to your current class, batch allocation, timetable, or course.",
    icon: BookOpen,
    iconColor: "#16a34a",
  },
];

function Faq() {
  const [activeType, setActiveType] = useState(null);

  const active = categories.find((c) => c.type === activeType);

  if (active) {
    return (
      <ComplaintForm
        type={active.type}
        heading={active.title}
        onBack={() => setActiveType(null)}
      />
    );
  }

  return (
    <div>
      {/* ---------- Page header ---------- */}
      <div className="page-hero text-center">
        <div className="container">
          <span className="page-hero__eyebrow">
            <LifeBuoy size={16} /> We're here to help
          </span>
          <h1>Help & Support Center</h1>
          <p className="mx-auto">
            Select a category below to raise a ticket, or reach out directly to
            our support team for immediate assistance.
          </p>
        </div>
      </div>

      {/* ---------- Support categories ---------- */}
      <section className="section">
        <div className="container">
          <Reveal className="row g-4">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <div className="col-md-6 col-lg-4" key={category.type}>
                  <Tilt3D className="ui-card d-flex flex-column" maxTilt={7}>
                    <div
                      className="icon-badge mb-3"
                      style={{
                        backgroundColor: `color-mix(in srgb, ${category.iconColor} 14%, transparent)`,
                        color: category.iconColor,
                      }}
                      aria-hidden="true"
                    >
                      <IconComponent size={26} />
                    </div>

                    <h5 className="mb-2">{category.title}</h5>
                    <p className="text-muted small mb-4 flex-grow-1" style={{ lineHeight: 1.6 }}>
                      {category.description}
                    </p>

                    <button
                      className="btn-brand-outline w-100"
                      onClick={() => setActiveType(category.type)}
                      style={{ height: 44 }}
                    >
                      Raise Ticket
                      <ArrowRight size={16} />
                    </button>
                  </Tilt3D>
                </div>
              );
            })}

            {/* Direct contact card */}
            <div className="col-md-6 col-lg-4">
              <Tilt3D className="ui-card d-flex flex-column" maxTilt={7}>
                <div
                  className="icon-badge mb-3"
                  style={{ backgroundColor: "color-mix(in srgb, #e11d48 14%, transparent)", color: "#e11d48" }}
                  aria-hidden="true"
                >
                  <PhoneCall size={26} />
                </div>

                <h5 className="mb-2">Contact Support</h5>
                <p className="text-muted small mb-3" style={{ lineHeight: 1.6 }}>
                  Reach out directly to our team via phone or email for immediate assistance.
                </p>

                <div className="d-flex flex-column gap-2 mb-4 flex-grow-1">
                  <div className="d-flex align-items-center gap-2 text-muted small">
                    <Phone size={15} className="text-primary" />
                    <span>Phone:</span>
                    <a href="tel:8718828288" className="text-dark fw-semibold text-decoration-none">
                      8718828288
                    </a>
                  </div>
                  <div className="d-flex align-items-center gap-2 text-muted small">
                    <Mail size={15} className="text-primary" />
                    <span>Email:</span>
                    <a href="mailto:akashtiwari@universal.in" className="text-dark fw-semibold text-decoration-none text-truncate">
                      akashtiwari@universal.in
                    </a>
                  </div>
                  <div className="d-flex align-items-center gap-2 text-muted small">
                    <Mail size={15} className="text-primary" />
                    <span>Email:</span>
                    <a href="mailto:akashtiwari@unify.in" className="text-dark fw-semibold text-decoration-none text-truncate">
                      akashtiwari@unify.in
                    </a>
                  </div>
                </div>

                <a
                  href="tel:8718828288"
                  className="btn-brand w-100"
                  style={{ height: 44 }}
                >
                  Call Support
                  <ArrowRight size={16} />
                </a>
              </Tilt3D>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

export default Faq;