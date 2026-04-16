import React from 'react';

export function DoneFrame({ doneStatus, resetGame }) {
  return (
    <div className="well text-center">
      <h2>{doneStatus}</h2>
      <button onClick={resetGame} className="btn btn-default">
        Play Again
      </button>
    </div>
  );
}
