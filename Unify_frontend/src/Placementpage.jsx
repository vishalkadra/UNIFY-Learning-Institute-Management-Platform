import ComplaintForm from "./ComplaintForm";

function Placementpage({ onBack }) {
  return (
    <ComplaintForm
      type="placement"
      heading="What's your query?"
      onBack={onBack}
    />
  );
}

export default Placementpage;
