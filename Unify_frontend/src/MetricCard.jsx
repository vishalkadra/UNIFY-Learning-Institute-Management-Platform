import { Tilt3D } from "./motion3d";

function MetricCard({ icon: Icon, label, value, loading }) {
  return (
    <div className="col-6 col-md-4 col-lg-3">
      <Tilt3D className="ui-card metric-card" maxTilt={6}>
        <div className="d-flex align-items-center gap-3">
          {Icon && (
            <span className="icon-badge icon-badge--round" aria-hidden="true">
              <Icon size={22} />
            </span>
          )}
          <div>
            <p className="metric-value">{loading ? "-" : value}</p>
            <p className="mb-0 text-muted small">{label}</p>
          </div>
        </div>
      </Tilt3D>
    </div>
  );
}

export default MetricCard;
