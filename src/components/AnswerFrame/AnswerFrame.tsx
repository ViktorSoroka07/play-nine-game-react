interface AnswerFrameProps {
  selectedNumbers: number[];
  unselectNumber: (number: number) => void;
}

export function AnswerFrame({ selectedNumbers, unselectNumber }: AnswerFrameProps) {
  return (
    <div id="answer-frame">
      <div className="well">
        {selectedNumbers.map((number) => (
          <button
            type="button"
            key={number}
            className="number"
            onClick={() => unselectNumber(number)}
            aria-label={`Unselect ${number}`}
          >
            {number}
          </button>
        ))}
      </div>
    </div>
  );
}
