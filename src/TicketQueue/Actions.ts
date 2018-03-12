import { PaginationModelOptions } from 'ultimate-pagination';
import { Ticket } from './Model';
import { Action as PagerActions } from '../Pager/Actions';

export interface PayloadFulfilled {
  paginationModelOptions: PaginationModelOptions;
  tickets: Ticket[];
  newPage: number;
}

export interface PageActionFulfilled {
  type: 'PAGE_FULFILLED';
  payload: PayloadFulfilled;
}

export interface InitialAction {
  payload: OptionalPagerOptions;
  type: 'INITIAL_TICKETS';
}

export type Action =
  | InitialAction
  | PagerActions
  | PageActionFulfilled
  | { type: 'TOGGLE_TITLES_SEARCH', payload: boolean }
  | { type: 'TITLES_SEARCH', payload: string };

export interface OptionalPagerOptions {
  boundaryPagesRange?: number;
  siblingPagesRange?: number;
  hideEllipsis?: boolean;
  hidePreviousAndNextPageLinks?: boolean;
  hideFirstAndLastPageLinks?: boolean;
}

export const initialTickets = (payload: OptionalPagerOptions = {}): Action => ({
  payload,
  type: 'INITIAL_TICKETS',
});

export const pageFulfilled = (payload: PayloadFulfilled): Action => ({
  payload,
  type: 'PAGE_FULFILLED',
});

export const toggleTitlesSearch = (payload: boolean): Action => ({
  payload,
  type: 'TOGGLE_TITLES_SEARCH',
});

export const titleSearch = (payload: string): Action => ({
  payload,
  type: 'TITLES_SEARCH',
});
