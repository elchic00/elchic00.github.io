// Custom monogram logo for Andrew Alagna
// Overlapping A's design - sophisticated and personal

export const MonogramOverlap = ({
  className = "w-8 h-8",
}: {
  className?: string;
}) => {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* First A */}
      <text
        x="35"
        y="50"
        fontSize="56"
        fontWeight="700"
        fontFamily="Poppins, sans-serif"
        fill="currentColor"
        textAnchor="middle"
        dominantBaseline="central"
        opacity="0.6"
      >
        A
      </text>
      {/* Second A overlapping */}
      <text
        x="65"
        y="50"
        fontSize="56"
        fontWeight="700"
        fontFamily="Poppins, sans-serif"
        fill="currentColor"
        textAnchor="middle"
        dominantBaseline="central"
      >
        A
      </text>
    </svg>
  );
};
