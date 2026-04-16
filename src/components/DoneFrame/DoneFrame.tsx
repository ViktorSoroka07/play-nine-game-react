interface DoneFrameProps {
  doneStatus: string | null;
  resetGame: () => void;
}

export function DoneFrame({ doneStatus, resetGame }: DoneFrameProps) {
  return (
    <div className="well text-center">
      <h2>{doneStatus}</h2>
      <button onClick={resetGame} className="btn btn-default">
        Play Again
      </button>
    </div>
  );
}
