// Top & bottom edge-blur bands (opacity + ground tint driven by useHomeMotion
// via #edgeTop/#edgeBot). Three stacked backdrop layers per edge ramp the blur.
export function EdgeBlur() {
  return (
    <>
      <div className="edge-blur top" id="edgeTop" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <div className="edge-blur bot" id="edgeBot" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
    </>
  );
}
