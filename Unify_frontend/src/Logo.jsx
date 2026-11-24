import logoDark from "./assets/unify_logo.png";
import logoLight from "./assets/unify_logo_light.png";

/**
 * Unify logo. Renders the dark-text logo on light backgrounds and the
 * light-text logo on dark backgrounds (theme switches via CSS).
 * variant="on-dark" always uses the light-text logo (e.g. the footer).
 */
export default function Logo({ className = "", variant = "auto", alt = "Unify logo" }) {
  if (variant === "on-dark") {
    return <img src={logoLight} alt={alt} className={`logo ${className}`} />;
  }
  return (
    <>
      <img src={logoDark} alt={alt} className={`logo logo--for-light ${className}`} />
      <img src={logoLight} alt="" aria-hidden="true" className={`logo logo--for-dark ${className}`} />
    </>
  );
}
