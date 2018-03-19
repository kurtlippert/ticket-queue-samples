import { PaginationModelOptions } from 'ultimate-pagination';
import { Ticket } from './Model';
import { Action as PagerActions } from '../Pager/Actions';

export interface PayloadFulfilled {
  paginationModelOptions: PaginationModelOptions;
  tickets: Ticket[];
  newPage: number;
}

export interface InitialPayloadFulfilled {
  paginationModelOptions: PaginationModelOptions;
  tickets: Ticket[];
  newPage: number;
  statuses: string[];
}

export interface PageActionFulfilled {
  type: 'PAGE_FULFILLED';
  payload: PayloadFulfilled;
}

export interface InitialAction {
  payload: OptionalPagerOptions;
  type: 'INITIAL_TICKETS';
}

export interface TitlesSearchAction {
  payload: string;
  type: 'TITLES_SEARCH';
}

export interface StatusFilterAction {
  payload: string;
  type: 'STATUS_FILTER';
}

export interface InitialActionFulfilled {
  payload: InitialPayloadFulfilled;
  type: 'INITIAL_TICKETS_FULFILLED';
}

export type Action =
  | InitialAction
  | InitialActionFulfilled
  | PagerActions
  | PageActionFulfilled
  | TitlesSearchAction
  | StatusFilterAction
  | { type: 'TOGGLE_TITLES_SEARCH', payload: boolean }
  | { type: 'TITLES_SEARCH_FULFILLED', payload: PayloadFulfilled & { searchTitle: string } }
  | { type: 'TOGGLE_STATUS_FILTER', payload: boolean }
  | { type: 'STATUS_FILTER_FULFILLED', payload: PayloadFulfilled & { statusFilter: string } };

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

export const initialTicketsFulfilled = (payload: InitialPayloadFulfilled): Action => ({
  payload,
  type: 'INITIAL_TICKETS_FULFILLED',
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

export const titleSearchFulfilled = (payload: PayloadFulfilled & { searchTitle: string }): Action => ({
  payload,
  type: 'TITLES_SEARCH_FULFILLED',
});

export const toggleStatusFilter = (payload: boolean): Action => ({
  payload,
  type: 'TOGGLE_STATUS_FILTER',
});

export const statusFilter = (payload: string): Action => ({
  payload,
  type: 'STATUS_FILTER',
});

export const statusFilterFulfilled = (payload: PayloadFulfilled & { statusFilter: string }): Action => ({
  payload,
  type: 'STATUS_FILTER_FULFILLED',
});
