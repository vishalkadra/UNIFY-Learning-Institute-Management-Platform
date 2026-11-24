import { useNavigate } from "react-router-dom";
import { Tilt3D } from "./motion3d";

function ActionCard({ icon: Icon, title, description, to, variant = "primary" }) {
  const navigate = useNavigate();

  return (
    <div className="col-md-6 col-lg-4">
      <Tilt3D className="ui-card d-flex flex-column" maxTilt={6}>
        {Icon && (
          <span className="icon-badge mb-3" aria-hidden="true">
            <Icon size={24} />
          </span>
        )}
        <h5>{title}</h5>
        <p className="text-muted flex-grow-1">{description}</p>
        <button className={`btn btn-${variant} mt-2 align-self-start`} onClick={() => navigate(to)}>
          Open
        </button>
      </Tilt3D>
    </div>
  );
}

export default ActionCard;
