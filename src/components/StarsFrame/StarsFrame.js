import React from 'react';

export function StarsFrame({ numberOfStars }) {
  return (
    <div id="stars-frame">
      <div className="well">
        {Array.from({ length: numberOfStars }).map((_, number) => (
          <span key={number} className="glyphicon glyphicon-star" />
        ))}
      </div>
    </div>
  );
}
