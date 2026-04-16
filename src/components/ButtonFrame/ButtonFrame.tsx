interface ButtonFrameProps {
  correct: boolean | null;
  acceptAnswer: () => void;
  redraw: () => void;
  redraws: number;
  selectedNumbers: number[];
  checkAnswer: () => void;
}

export function ButtonFrame({
  correct,
  acceptAnswer,
  redraw,
  redraws,
  selectedNumbers,
  checkAnswer,
}: ButtonFrameProps) {
  return (
    <div id="button-frame">
      {correct ? (
        <button className="btn btn-success btn-lg" onClick={acceptAnswer} aria-label="Accept answer">
          <span className="glyphicon glyphicon-ok" aria-hidden="true" />
        </button>
      ) : correct !== null ? (
        <button className="btn btn-danger btn-lg" disabled aria-label="Wrong answer">
          <span className="glyphicon glyphicon-remove" aria-hidden="true" />
        </button>
      ) : (
        <button
          className="btn btn-primary btn-lg"
          disabled={!selectedNumbers.length}
          onClick={checkAnswer}
          aria-label="Check answer"
        >
          =
        </button>
      )}
      <br />
      <br />
      <button className="btn btn-warning btn-xs" onClick={redraw} disabled={!redraws} aria-label="Redraw">
        <span className="glyphicon glyphicon-refresh" aria-hidden="true" />
        &nbsp;
        <span>{redraws}</span>
      </button>
    </div>
  );
}
