import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import hero from "./assets/hero.png";
import Logo from "./Logo";
import { Reveal, Tilt3D } from "./motion3d";
import "./Landing.css";

/** Decorative stack of key technologies shown on the hero image. */
function TechCube3D() {
  const faces = ["React", "Python", "Java", "PHP"];
  return (
    <ul className="tech-chips" aria-hidden="true">
      {faces.map((label) => (
        <li className="tech-chip" key={label}>
          {label}
        </li>
      ))}
    </ul>
  );
}

const TECH_STACK = [
  "C / C++", "Java / J2EE", "Angular / Node", "Python / Django",
  "React Native", "PHP / WordPress", "HTML, CSS, JS & Bootstrap",
  "Data Science & ML", "Android / Flutter", "Data Structures & Algorithms",
  "Spring / Hibernate", "Oracle & AWS",
];

const USPS = [
  "Running successfully since 1994 — 29+ years in IT training",
  "Live project development exposure with our own software company, Ypsilon IT Solutions Pvt. Ltd.",
  "Certified, experienced trainers using the latest tools and techniques",
  "ISO 9001:2015 certified organisation",
  "Team of 100+ IT experts across all campuses",
  "Central India's largest IT training infrastructure",
  "100% placement assistance through a dedicated placement cell",
  "Daily objective & subjective question banks for campus-interview prep",
  "We don't just teach technology — we teach you how to actually write code",
];

const CAMPUSES = [
  {
    name: "Abhay Prashal Campus (Janjeerwala)",
    address: "Abhay Prashal, Race Course Road, Opp. IDA, Indore, MP 452003",
    phone: "0731-4066252, 2535381 · +91 7471128436",
    note: "8,000+ sq. ft. campus with 60+ systems, right at the heart of the city.",
  },
  {
    name: "Bhawarkua Campus",
    address: "160/3, Pipliyarao, AB Road, Bhawarkua, Opp. Vishnupuri I-Bus Stop, Indore 452014",
    phone: "0731-4986251, 4986252",
    note: "3,000+ sq. ft. campus with 50+ systems, in Indore's student hub.",
  },
  {
    name: "Vijay Nagar Campus",
    address: "Plot No. A66, Scheme 54, Vijay Nagar, Behind Giriraj Grand, Near Satya Sai Square, Indore 452010",
    phone: "0731-4074796 · +91 8962141437",
    note: "3,000+ sq. ft. campus with a 25+ system computer lab.",
  },
];

const REVIEWS = [
  {
    name: "Vasu Birla",
    text: "Completed MERN Stack training here — learnt a lot and got placed in the same technology. Great support from faculty right through the process.",
  },
  {
    name: "Nitin Kolte",
    text: "One of the best institutes in Indore. Faculty helped me at every stage of my learning, and I also got placed through the Universal placement cell.",
  },
  {
    name: "Harsh Tiwari",
    text: "2022 pass-out, now placed at Cognizant as an Engineer Trainee — all thanks to Universal Informatics' training and placement support.",
  },
  {
    name: "Sonal Soni",
    text: "Learnt C, C++, Java, Python and PHP here, along with placement sessions and weekly tests. The placement cell and faculty are always supportive.",
  },
];

function Landing() {
  const token = localStorage.getItem("token");

  return (
    <div className="landing-page">
      {/* ---------- Hero ---------- */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-6">
              <span className="hero-badge">🏅 29 Successful Years · ISO 9001:2015 Certified</span>
              <h1 className="hero-title mb-3">
                Central India's No.&nbsp;1 <span>Programming Institute</span>
              </h1>
              <p className="hero-sub mb-4">
                Unify by Universal Informatics brings you industry-relevant IT training,
                live project experience, and dedicated placement support — across our
                Abhay Prashal, Bhawarkua and Vijay Nagar campuses in Indore.
              </p>
              <div className="d-flex flex-wrap gap-3 hero-actions">
                <Link to="/course" className="btn btn-primary btn-lg">
                  Explore Courses
                </Link>
                {token ? (
                  <Link to="/Home" className="btn btn-outline-secondary btn-lg">
                    Go to my dashboard
                  </Link>
                ) : (
                  <Link to="/signup" className="btn btn-outline-secondary btn-lg">
                    Get started
                  </Link>
                )}
              </div>
            </div>
            <div className="col-lg-6">
              <div className="hero-3d-stage">
                <div className="hero-art">
                  <img src={hero} alt="Unify students" className="hero-img" />
                </div>
                <div className="hero-cube-badge">
                  <TechCube3D />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Stats strip ---------- */}
      <section className="stats-strip">
        <div className="container">
          <Reveal className="row g-4">
            <div className="col-6 col-md-3 stat-item">
              <div className="stat-number">29+</div>
              <div className="stat-label">Years of Excellence</div>
            </div>
            <div className="col-6 col-md-3 stat-item">
              <div className="stat-number">1 Lac+</div>
              <div className="stat-label">Students Trained</div>
            </div>
            <div className="col-6 col-md-3 stat-item">
              <div className="stat-number">35+</div>
              <div className="stat-label">Technical Trainers</div>
            </div>
            <div className="col-6 col-md-3 stat-item">
              <div className="stat-number">3</div>
              <div className="stat-label">Campuses in Indore</div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- Who we are ---------- */}
      <section className="section">
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <h2 className="section-title">Who We Are</h2>
              <p className="section-sub">
                Launched in 1994, Universal Informatics has spent 29 years building
                Central India's largest IT training ecosystem, with training programmes
                trusted by BE, B.Tech, MCA, BCA, B.Sc, M.Sc, B.Com and B.A. students as
                well as working professionals. Our 35+ in-house trainers bring live
                project experience and international certifications (including OCA, OCP
                and OCJP) into every batch, and we run 50+ IT training programmes as an
                official partner of Pearson VUE Testing and Oracle Workforce Development.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Programs / technologies ---------- */}
      <section className="section section-alt">
        <div className="container">
          <div className="text-center">
            <h2 className="section-title">Our Programs</h2>
            <p className="section-sub">
              From programming fundamentals to the latest frameworks, our curriculum is
              customised to your current skill level and available time — with live
              project work at every stage.
            </p>
          </div>
          <Reveal className="row g-3">
            {TECH_STACK.map((tech) => (
              <div className="col-6 col-md-4 col-lg-2" key={tech}>
                <Tilt3D className="tech-badge" maxTilt={16}>
                  {tech}
                </Tilt3D>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ---------- USP ---------- */}
      <section className="section">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-5">
              <h2 className="section-title">Why Choose Unify?</h2>
              <p className="text-muted">
                We back every batch with real infrastructure, real trainers and a real
                placement cell — not just a syllabus.
              </p>
            </div>
            <div className="col-lg-7">
              <Reveal className="usp-list-wrap">
                <ul className="usp-list">
                  {USPS.map((point) => (
                    <li key={point}>
                      <span className="usp-check">✓</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Campuses ---------- */}
      <section className="section section-alt">
        <div className="container">
          <div className="text-center">
            <h2 className="section-title">Our Campuses</h2>
            <p className="section-sub">
              Three fully-equipped campuses across Indore, each with modern computer
              labs and all the amenities you need to learn without distraction.
            </p>
          </div>
          <Reveal className="row g-4">
            {CAMPUSES.map((c) => (
              <div className="col-md-4" key={c.name}>
                <Tilt3D className="campus-card" maxTilt={8}>
                  <h5>{c.name}</h5>
                  <p className="text-muted small mb-2">{c.note}</p>
                  <p className="mb-1">
                    <strong>Address:</strong>{" "}
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="map-link"
                    >
                      {c.address} <MapPin size={14} aria-hidden="true" />
                    </a>
                  </p>
                  <p className="mb-0"><strong>Phone:</strong> {c.phone}</p>
                </Tilt3D>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ---------- Verticals ---------- */}
      <section className="section">
        <div className="container">
          <div className="text-center">
            <h2 className="section-title">Our Verticals</h2>
            <p className="section-sub">
              Beyond training, the Universal Informatics group runs its own software
              and placement businesses.
            </p>
          </div>
          <Reveal className="row g-4">
            <div className="col-md-6">
              <Tilt3D className="vertical-card v-1" maxTilt={7}>
                <h4>Ypsilon IT Solutions Pvt. Ltd.</h4>
                <ul>
                  <li>Mobile app development</li>
                  <li>Web development & design</li>
                  <li>Frontend & full-stack development</li>
                  <li>Hybrid app development</li>
                </ul>
              </Tilt3D>
            </div>
            <div className="col-md-6">
              <Tilt3D className="vertical-card v-2" maxTilt={7}>
                <h4>Universal Placement Consultancy Services</h4>
                <ul>
                  <li>Recruitment & manpower supply</li>
                  <li>Resume screening</li>
                  <li>Regular campus drives</li>
                  <li>Interview preparation & client relations</li>
                </ul>
              </Tilt3D>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- Online Portal ---------- */}
      <section className="section">
        <div className="container">
          <div className="portal-banner">
            <div className="row align-items-center g-4">
              <div className="col-lg-8">
                <h2 className="mb-2">Can't attend offline classes daily?</h2>
                <p className="mb-0 opacity-75">
                  Unify's own Online Portal has video courses covering every technology
                  we teach — at a very nominal charge — so you can expand your IT skills
                  at your own pace, whenever you have time.
                </p>
              </div>
              <div className="col-lg-4 text-lg-end">
                <Link to="/online-classes" className="btn btn-light btn-lg fw-semibold">
                  Explore Online Courses
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Reviews ---------- */}
      <section className="section section-alt">
        <div className="container">
          <div className="text-center">
            <h2 className="section-title">What Our Students Say</h2>
            <p className="section-sub">
              Rated 4.9 out of 5 across 500+ Google reviews from students and
              professionals we've trained and placed.
            </p>
          </div>
          <Reveal className="row g-4">
            {REVIEWS.map((r) => (
              <div className="col-md-6 col-lg-3" key={r.name}>
                <Tilt3D className="review-card" maxTilt={10}>
                  <div className="review-stars">★★★★★</div>
                  <p className="review-text">"{r.text}"</p>
                  <div className="review-author">— {r.name}</div>
                </Tilt3D>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="section">
        <div className="container">
          <div className="cta-banner">
            <h2 className="mb-3">Have a question about our courses?</h2>
            <p className="mb-4 opacity-75">
              Our team is happy to help you pick the right programme for your goals.
            </p>
            <Link to="/faq" className="btn btn-light btn-lg fw-semibold">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- Footer ---------- */}
      <footer className="site-footer">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-4">
              <Logo variant="on-dark" className="footer-logo" />
              <p>
                An ISO 9001:2015 certified organisation, training students and IT
                professionals since 1994 across our Indore campuses.
              </p>
              <div className="footer-social">
                <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">f</a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">ig</a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">in</a>
              </div>
            </div>

            <div className="col-6 col-md-2">
              <h6>Quick Links</h6>
              <ul>
                <li><Link to="/course">Courses</Link></li>
                <li><Link to="/placements">Placements</Link></li>
                <li><Link to="/experts">Experts & Backbone</Link></li>
                <li><Link to="/faq">FAQs & Contact</Link></li>
              </ul>
            </div>

            <div className="col-6 col-md-3">
              <h6>Mail Us</h6>
              <ul>
                <li><a href="mailto:info@universalinformatics.com">info@universalinformatics.com</a> (Enquiry)</li>
                <li><a href="mailto:jobs@universalinformatics.com">jobs@universalinformatics.com</a> (Placement)</li>
                <li><a href="mailto:inamaheshwari@universalinformatics.com">inamaheshwari@universalinformatics.com</a> (HRD)</li>
              </ul>
            </div>

            <div className="col-md-3">
              <h6>Helpline</h6>
              <p className="mb-1">
                <a href="tel:+917471128437">+91 7471128437</a>
              </p>
              <p>
                <a href="https://www.universalinformatics.com" target="_blank" rel="noreferrer">
                  www.universalinformatics.com
                </a>
              </p>
            </div>
          </div>

          <div className="footer-bottom">
            © {new Date().getFullYear()} Universal Informatics. All rights reserved. ·
            Abhay Prashal Campus · Bhawarkua Campus · Vijay Nagar Campus
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;