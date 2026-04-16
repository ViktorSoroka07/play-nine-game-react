interface StarsFrameProps {
  numberOfStars: number;
}

export function StarsFrame({ numberOfStars }: StarsFrameProps) {
  return (
    <div id="stars-frame">
      <div className="well" role="img" aria-label={`Stars: ${numberOfStars}`}>
        {Array.from({ length: numberOfStars }).map((_, index) => (
          <span key={index} className="glyphicon glyphicon-star" aria-hidden="true" />
        ))}
      </div>
    </div>
  );
}
