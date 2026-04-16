import { useCallback, useMemo, useReducer } from 'react';

import { getRandom, possibleCombinationSum } from '../../utils';
import { StarsFrame } from '../StarsFrame';
import { DoneFrame } from '../DoneFrame';
import { NumbersFrame } from '../NumbersFrame';
import { ButtonFrame } from '../ButtonFrame';
import { AnswerFrame } from '../AnswerFrame';

interface GameState {
  selectedNumbers: number[];
  numberOfStars: number;
  correct: boolean | null;
  usedNumbers: number[];
  redraws: number;
}

const getInitialState = (): GameState => ({
  selectedNumbers: [],
  numberOfStars: getRandom(),
  correct: null,
  usedNumbers: [],
  redraws: 5,
});

const reducer = (state: GameState, newState: Partial<GameState>): GameState => ({
  ...state,
  ...newState,
});

export function Game() {
  const [state, dispatch] = useReducer(reducer, undefined, getInitialState);

  const possibleSolutions = useCallback((usedNumbers: number[], numberOfStars: number): boolean => {
    const possibleNumbers: number[] = [];

    for (let number = 1; number <= 9; number++) {
      if (usedNumbers.indexOf(number) < 0) {
        possibleNumbers.push(number);
      }
    }

    return possibleCombinationSum(possibleNumbers, numberOfStars);
  }, []);

  const doneStatus = useMemo((): string | null => {
    if (state.usedNumbers.length === 9) {
      return 'Done. Nice!';
    }

    if (state.redraws === 0 && !possibleSolutions(state.usedNumbers, state.numberOfStars)) {
      return 'Game Over!';
    }

    return null;
  }, [possibleSolutions, state.numberOfStars, state.redraws, state.usedNumbers]);

  const resetGame = useCallback(() => {
    dispatch(getInitialState());
  }, []);

  const selectNumber = useCallback(
    (clickedNumber: number) => {
      if (state.selectedNumbers.indexOf(clickedNumber) < 0) {
        dispatch({
          selectedNumbers: state.selectedNumbers.concat(clickedNumber),
          correct: null,
        });
      }
    },
    [state.selectedNumbers]
  );

  const redraw = useCallback(() => {
    if (state.redraws) {
      dispatch({
        selectedNumbers: [],
        numberOfStars: getRandom(),
        correct: null,
        redraws: state.redraws - 1,
      });
    }
  }, [state.redraws]);

  const unselectNumber = useCallback(
    (clickedNumber: number) => {
      dispatch({
        selectedNumbers: state.selectedNumbers.filter((n) => n !== clickedNumber),
        correct: null,
      });
    },
    [state.selectedNumbers]
  );

  const acceptAnswer = useCallback(() => {
    const usedNumbers = state.usedNumbers.concat(state.selectedNumbers);

    dispatch({
      usedNumbers,
      selectedNumbers: [],
      correct: null,
      numberOfStars: getRandom(),
    });
  }, [state.selectedNumbers, state.usedNumbers]);

  const sumOfSelectedNumbers = useMemo(
    () => state.selectedNumbers.reduce((sum, currentNumber) => sum + currentNumber, 0),
    [state.selectedNumbers]
  );

  const checkAnswer = useCallback(() => {
    dispatch({ correct: state.numberOfStars === sumOfSelectedNumbers });
  }, [state.numberOfStars, sumOfSelectedNumbers]);

  return (
    <div id="game">
      <h2>Play Nine</h2>
      <hr />
      <div className="clearfix">
        <StarsFrame numberOfStars={state.numberOfStars} />
        <ButtonFrame
          selectedNumbers={state.selectedNumbers}
          correct={state.correct}
          checkAnswer={checkAnswer}
          acceptAnswer={acceptAnswer}
          redraw={redraw}
          redraws={state.redraws}
        />
        <AnswerFrame selectedNumbers={state.selectedNumbers} unselectNumber={unselectNumber} />
      </div>
      {doneStatus ? (
        <DoneFrame doneStatus={doneStatus} resetGame={resetGame} />
      ) : (
        <NumbersFrame
          selectedNumbers={state.selectedNumbers}
          selectNumber={selectNumber}
          usedNumbers={state.usedNumbers}
        />
      )}
    </div>
  );
}
