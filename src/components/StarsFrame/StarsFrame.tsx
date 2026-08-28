import './StarsFrame.css';

interface StarsFrameProps {
  numberOfStars: number;
}

export function StarsFrame({ numberOfStars }: StarsFrameProps) {
  const stars = Array.from({ length: numberOfStars }, (_, index) => index + 1);

  return (
    <div className="stars-frame">
      <div className="well" role="img" aria-label={`Stars: ${numberOfStars}`}>
        {stars.map((star) => (
          <span key={star} className="glyphicon glyphicon-star" aria-hidden="true" />
        ))}
      </div>
    </div>
  );
}
