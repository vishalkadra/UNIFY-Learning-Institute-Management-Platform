import { useState, useEffect } from "react";
import API, { getApiError } from "./api";
import { Building2, CalendarDays, GraduationCap, MapPin, Wallet } from "lucide-react";
import { Tilt3D, Reveal } from "./motion3d";


function Placements() {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDrive, setSelectedDrive] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    API.get("/placements/")
      .then((response) => {
        setDrives(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError(getApiError(error, "Could not load placements."));
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-vh-100">
      <div className="page-hero">
        <div className="container">
          <span className="page-hero__eyebrow">💼 Placement Drives</span>
          <h1>Placement Opportunities</h1>
          <p>Explore the latest campus drives and openings from our hiring partners.</p>
        </div>
      </div>

      <div className="container page-body">
        {error && <div className="alert alert-danger" role="alert">{error}</div>}
        {!error && <>
        {/* Cards */}
        <Reveal className="row g-4">
          {drives.map((drive) => (
            <div className="col-md-6 col-lg-4" key={drive.id}>
              <Tilt3D className="card drive-card h-100" maxTilt={7}>

                <div className="drive-card__head">
                  <span className="drive-card__logo" aria-hidden="true"><Building2 size={24} /></span>
                  <div>
                    <h4>{drive.company_name}</h4>
                    <p className="mb-0">{drive.role}</p>
                  </div>
                </div>

                <div className="card-body">

                  <div className="row g-3">

                    <div className="col-6">
                      <div className="fact">
                        <small className="fact__label"><Wallet size={13} aria-hidden="true" /> PACKAGE</small>
                        <h6 className="fact__value">{drive.package}</h6>
                      </div>
                    </div>

                    <div className="col-6">
                      <div className="fact">
                        <small className="fact__label"><GraduationCap size={13} aria-hidden="true" /> ELIGIBILITY</small>
                        <h6 className="fact__value">{drive.eligibility}</h6>
                      </div>
                    </div>

                    <div className="col-6">
                      <div className="fact">
                        <small className="fact__label"><CalendarDays size={13} aria-hidden="true" /> DATE</small>
                        <h6 className="fact__value">{drive.date}</h6>
                      </div>
                    </div>

                    <div className="col-6">
                      <div className="fact">
                        <small className="fact__label"><MapPin size={13} aria-hidden="true" /> LOCATION</small>
                        <h6 className="fact__value">{drive.location}</h6>
                      </div>
                    </div>

                  </div>

                  <hr />

                  {/* Short Description */}
                  <p className="text-muted mb-0">
                    {drive.company_description?.slice(0, 100)}...
                  </p>

                </div>

                <div className="card-footer bg-white border-0 pt-0 pb-4 px-4">
                  <button
                    className="btn btn-primary w-100"
                    onClick={() => setSelectedDrive(drive)}
                  >
                    View Opportunity
                  </button>
                </div>

              </Tilt3D>
            </div>
          ))}
        </Reveal>
        </>}
      </div>


      {/* ================= MODAL ================= */}

      {selectedDrive && (
        <div
          className="modal d-block"
          tabIndex="-1"
          role="dialog"
          aria-modal="true"
          aria-labelledby="drive-modal-title"
          style={{ backgroundColor: "rgba(8, 15, 35, 0.65)" }}
          onKeyDown={(e) => e.key === "Escape" && setSelectedDrive(null)}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">

              {/* Modal Header */}

              <div className="modal-header modal-head-brand">
                <div>
                  <h4 className="modal-title" id="drive-modal-title">
                    🏢 {selectedDrive.company_name}
                  </h4>

                  <p className="mb-0">
                    {selectedDrive.role}
                  </p>
                </div>

                <button
                  className="btn-close btn-close-white"
                  aria-label="Close"
                  onClick={() => setSelectedDrive(null)}
                ></button>
              </div>


              {/* Modal Body */}

              <div className="modal-body">

                <h4 className="mb-4">
                  💼 Opportunity Details
                </h4>


                <div className="row g-3">

                  <div className="col-md-6">
                    <div className="fact">
                      <small className="fact__label">💰 PACKAGE</small>
                      <h5 className="fact__value">{selectedDrive.package}</h5>
                    </div>
                  </div>


                  <div className="col-md-6">
                    <div className="fact">
                      <small className="fact__label">🎓 ELIGIBILITY</small>
                      <h5 className="fact__value">{selectedDrive.eligibility}</h5>
                    </div>
                  </div>


                  <div className="col-md-6">
                    <div className="fact">
                      <small className="fact__label">📅 DRIVE DATE</small>
                      <h5 className="fact__value">{selectedDrive.date}</h5>
                    </div>
                  </div>


                  <div className="col-md-6">
                    <div className="fact">
                      <small className="fact__label">📍 LOCATION</small>
                      <h5 className="fact__value">{selectedDrive.location}</h5>
                    </div>
                  </div>

                </div>


                {/* Company Description */}

                <h4 className="mt-5 mb-3">
                  🏢 About the Company
                </h4>

                <div className="fact fact--block">
                  <p
                    className="mb-0 text-break"
                    style={{ whiteSpace: "pre-wrap" }}
                  >
                    {selectedDrive.company_description}
                  </p>
                </div>

              </div>


              {/* Modal Footer */}

              <div className="modal-footer">
                <button
                  className="btn btn-primary w-100"
                  onClick={() => setSelectedDrive(null)}
                >
                  Close Details
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Placements;
