import { screen } from '@testing-library/react';

export const getNumberButton = (number: number) => screen.getByRole('button', { name: `Number ${number}` });

export const getAllNumberButtons = () => screen.getAllByRole('button', { name: /Number \d/ });

export const getUnselectButton = (number: number) => screen.queryByRole('button', { name: `Unselect ${number}` });

export const getAllUnselectButtons = () => screen.queryAllByRole('button', { name: /Unselect \d/ });

export const getCheckAnswerButton = () => screen.getByRole('button', { name: 'Check answer' });

export const getAcceptAnswerButton = () => screen.queryByRole('button', { name: 'Accept answer' });

export const getRedrawButton = () => screen.getByRole('button', { name: 'Redraw' });

export const getStarsCount = () => {
  const starsLabel = screen.getByRole('img', { name: /Stars:/ }).getAttribute('aria-label') || '';

  return parseInt(starsLabel.split(':')[1]?.trim() || '0', 10);
};
