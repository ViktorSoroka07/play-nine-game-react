import './ButtonFrame.css';

import type { AnswerStatus } from '../Game/Game';

interface ButtonFrameProps {
  answerStatus: AnswerStatus;
  acceptAnswer: () => void;
  redraw: () => void;
  redraws: number;
  selectedNumbers: number[];
  checkAnswer: () => void;
}

function AnswerButton({
  answerStatus,
  acceptAnswer,
  checkAnswer,
  selectedNumbers,
}: Pick<ButtonFrameProps, 'answerStatus' | 'acceptAnswer' | 'checkAnswer' | 'selectedNumbers'>) {
  if (answerStatus === 'correct') {
    return (
      <button className="btn btn-success btn-lg" onClick={acceptAnswer} aria-label="Accept answer">
        <span className="glyphicon glyphicon-ok" aria-hidden="true" />
      </button>
    );
  }

  if (answerStatus === 'wrong') {
    return (
      <button className="btn btn-danger btn-lg" disabled aria-label="Wrong answer">
        <span className="glyphicon glyphicon-remove" aria-hidden="true" />
      </button>
    );
  }

  return (
    <button
      className="btn btn-primary btn-lg"
      disabled={!selectedNumbers.length}
      onClick={checkAnswer}
      aria-label="Check answer"
    >
      =
    </button>
  );
}

export function ButtonFrame({
  answerStatus,
  acceptAnswer,
  redraw,
  redraws,
  selectedNumbers,
  checkAnswer,
}: ButtonFrameProps) {
  return (
    <div className="button-frame">
      <AnswerButton
        answerStatus={answerStatus}
        acceptAnswer={acceptAnswer}
        checkAnswer={checkAnswer}
        selectedNumbers={selectedNumbers}
      />
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
