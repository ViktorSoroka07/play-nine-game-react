interface NumbersFrameProps {
  usedNumbers: number[];
  selectedNumbers: number[];
  selectNumber: (number: number) => void;
}

export function NumbersFrame({ usedNumbers, selectedNumbers, selectNumber }: NumbersFrameProps) {
  return (
    <div id="numbers-frame">
      <div className="well">
        {Array.from({ length: 9 })
          .map((_, i) => i + 1)
          .map((number) => {
            const isSelected = selectedNumbers.indexOf(number) >= 0;
            const isUsed = usedNumbers.indexOf(number) >= 0;
            const className = 'number selected-' + isSelected + ' used-' + isUsed;

            return (
              <button
                type="button"
                key={number}
                className={className}
                onClick={() => selectNumber(number)}
                disabled={isUsed}
                aria-pressed={isSelected}
                aria-label={`Number ${number}`}
              >
                {number}
              </button>
            );
          })}
      </div>
    </div>
  );
}
