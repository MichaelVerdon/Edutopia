const RotatedPattern = ({ id, link, size }) => (
    <svg style={{ height: 0 }}>
      <defs>
        <pattern id={id} patternUnits="objectBoundingBox" width="100%" height="100%" viewBox={`0 0 ${size.x} ${size.y}`}>
          <image href={link} width={size.x} height={size.y} />
        </pattern>
      </defs>
    </svg>
  );
  
  export default RotatedPattern;
  