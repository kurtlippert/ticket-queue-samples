// redux
import { Store } from 'redux';
import { Epic } from 'redux-observable';

// rxjs
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

// libs
import { getPaginationModel, PaginationModel } from 'ultimate-pagination';
import { ItemKeys, ITEM_KEYS } from 'ultimate-pagination/lib/ultimate-pagination-constants';

// components
import {
  Action,
  pageFulfilled,
  InitialAction,
  TitlesSearchAction,
  titleSearchFulfilled,
  initialTicketsFulfilled,
  statusFilterFulfilled,
} from './Actions';
import { initialTicketQueue, TicketQueue } from './Model';
import { State } from '../Model';
import { EpicDependencies } from '../Update';
import { SelectedPageAction } from '../Pager/Actions';
import { StatusFilterAction } from '../../lib/TicketQueue/Actions';

const getActivePage = (pager: PaginationModel) => {
  const { value = -1 } = pager.find((page) => page.isActive) || {};
  // tslint:disable-next-line:no-console
  if (value === -1) { console.error('could not find active page in pagination model'); }
  return value;
};

const getPreviousPage = (pager: PaginationModel) => {
  const activePage = getActivePage(pager);
  const previousPage = activePage - 1;
  return previousPage < 1 ? activePage : previousPage;
};

const getNextPage = (pager: PaginationModel, lastPage: number) => {
  const activePage = getActivePage(pager);
  const nextPage = activePage + 1;
  return nextPage > lastPage ? activePage : nextPage;
};

const getPageWithKey = (pager: PaginationModel, key: ItemKeys | number) => {
  const { value = -1 } = pager.find((page) => page.key === key) || {};
  // tslint:disable-next-line:no-console
  if (value === -1) { console.error(`could not find ${key} page in pagination model`); }
  return value;
};

const ticketEndpoint =
  (page: number = 1,
   getPageCount: boolean = false,
   titleFilter: string = '',
   statusFilter: string = '') =>
    `https://localhost:3003/tickets
      ?limit=10
      &page=${page}
      ${getPageCount ? '&getPageCount' : ''}
      &titleFilter=${titleFilter.replace(/\'/g, '').replace(/\s/g, '+')}
      &statusFilter=${statusFilter.replace(/\s/g, '+')}`
    .replace(/\s/g, '');

export const fetchInitialTicketsEpic:
  Epic<Action, Store<State>, EpicDependencies> =
  (action$, _, { getPageCount }) =>
    action$.ofType('INITIAL_TICKETS')
      .mergeMap((action) =>
        getPageCount(ticketEndpoint(1, true))
          .map((response) =>
            initialTicketsFulfilled({
              tickets: response.tickets,
              paginationModelOptions: {
                ...(action as InitialAction).payload,
                currentPage: 1,
                totalPages: response.pageCount,
              },
              newPage: 1,
              statuses: response.statuses,
            }),
          ),
      );

export const fetchFirstPageTicketsEpic:
  Epic<Action, Store<State>, EpicDependencies> =
  (action$, state, { getJSON }) =>
    action$.ofType('FIRST_PAGE')
      .mergeMap(() => {
        const queue = (state.getState() as any as State).ticketQueue;
        const paginationModelOptions = queue.PagerOptions;
        const titleSearchText = queue.titleSearchText;
        const statusFilterText = queue.statusFilterText;
        return getJSON(ticketEndpoint(1, false, titleSearchText, statusFilterText))
          .map((response) =>
            pageFulfilled({
              tickets: response.tickets,
              paginationModelOptions,
              newPage: 1,
            }),
          );
      });

export const fetchPreviousPageTicketsEpic:
  Epic<Action, Store<State>, EpicDependencies> =
  (action$, state, { getJSON }) =>
    action$.ofType('PREVIOUS_PAGE')
      .mergeMap(() => {
        const queue = (state.getState() as any as State).ticketQueue;
        const paginationModelOptions = queue.PagerOptions;
        const pager = getPaginationModel(paginationModelOptions);
        const previousPage = getPreviousPage(pager);
        const titleSearchText = queue.titleSearchText;
        const statusFilterText = queue.statusFilterText;
        return getJSON(ticketEndpoint(previousPage, false, titleSearchText, statusFilterText))
          .map((response) =>
            pageFulfilled({
              tickets: response.tickets,
              paginationModelOptions,
              newPage: previousPage,
            }),
        );
      });

export const fetchFirstEllipsisPageTicketsEpic:
  Epic<Action, Store<State>, EpicDependencies> =
  (action$, state, { getJSON }) =>
    action$.ofType('FIRST_ELLIPSIS')
      .mergeMap(() => {
        const queue = (state.getState() as any as State).ticketQueue;
        const paginationModelOptions = queue.PagerOptions;
        const pager = getPaginationModel(paginationModelOptions);
        const firstEllipsisPage = getPageWithKey(pager, ITEM_KEYS.FIRST_ELLIPSIS);
        const titleSearchText = queue.titleSearchText;
        const statusFilterText = queue.statusFilterText;
        return getJSON(ticketEndpoint(firstEllipsisPage, false, titleSearchText, statusFilterText))
          .map((response) =>
            pageFulfilled({
              tickets: response.tickets,
              paginationModelOptions,
              newPage: firstEllipsisPage,
            }),
        );
      });

export const fetchSelectedPageTicketsEpic:
  Epic<Action, Store<State>, EpicDependencies> =
  (action$, state, { getJSON }) =>
    action$.ofType('SELECTED_PAGE')
      .mergeMap((action) => {
        const queue = (state.getState() as any as State).ticketQueue;
        const paginationModelOptions = queue.PagerOptions;
        const selectedPage = (action as SelectedPageAction).payload;
        const titleSearchText = queue.titleSearchText;
        const statusFilterText = queue.statusFilterText;
        return getJSON(ticketEndpoint(selectedPage, false, titleSearchText, statusFilterText))
          .map((response) =>
            pageFulfilled({
              tickets: response.tickets,
              paginationModelOptions,
              newPage: selectedPage,
            }),
        );
      });

export const fetchSecondEllipsisPageTicketsEpic:
  Epic<Action, Store<State>, EpicDependencies> =
  (action$, state, { getJSON }) =>
    action$.ofType('SECOND_ELLIPSIS')
      .mergeMap(() => {
        const queue = (state.getState() as any as State).ticketQueue;
        const paginationModelOptions = queue.PagerOptions;
        const pager = getPaginationModel(paginationModelOptions);
        const secondEllipsisPage = getPageWithKey(pager, ITEM_KEYS.SECOND_ELLIPSIS);
        const titleSearchText = queue.titleSearchText;
        const statusFilterText = queue.statusFilterText;
        return getJSON(ticketEndpoint(secondEllipsisPage, false, titleSearchText, statusFilterText))
          .map((response) =>
            pageFulfilled({
              tickets: response.tickets,
              paginationModelOptions,
              newPage: secondEllipsisPage,
            }),
        );
      });

export const fetchNextPageTicketsEpic:
  Epic<Action, Store<State>, EpicDependencies> =
  (action$, state, { getJSON }) =>
    action$.ofType('NEXT_PAGE')
      .mergeMap(() => {
        const queue = (state.getState() as any as State).ticketQueue;
        const paginationModelOptions = queue.PagerOptions;
        const pager = getPaginationModel(paginationModelOptions);
        const nextPage = getNextPage(pager, paginationModelOptions.totalPages);
        const titleSearchText = queue.titleSearchText;
        const statusFilterText = queue.statusFilterText;
        return getJSON(ticketEndpoint(nextPage, false, titleSearchText, statusFilterText))
          .map((response) =>
            pageFulfilled({
              tickets: response.tickets,
              paginationModelOptions,
              newPage: nextPage,
            }),
        );
      });

export const fetchLastPageTicketsEpic:
  Epic<Action, Store<State>, EpicDependencies> =
  (action$, state, { getJSON }) =>
    action$.ofType('LAST_PAGE')
      .mergeMap(() => {
        const queue = (state.getState() as any as State).ticketQueue;
        const paginationModelOptions = queue.PagerOptions;
        const lastPage = paginationModelOptions.totalPages;
        const titleSearchText = queue.titleSearchText;
        const statusFilterText = queue.statusFilterText;
        return getJSON(ticketEndpoint(lastPage, false, titleSearchText, statusFilterText))
          .map((response) =>
            pageFulfilled({
              tickets: response.tickets,
              paginationModelOptions,
              newPage: lastPage,
            }),
        );
      });

export const fetchTicketsWithFilterEpic:
  Epic<Action, Store<State>, EpicDependencies> =
  (action$, state, { getPageCount }) =>
    action$.ofType('TITLES_SEARCH')
      .mergeMap((action) => {
        const queue = (state.getState() as any as State).ticketQueue;
        const paginationModelOptions = queue.PagerOptions;
        const searchTitle = (action as TitlesSearchAction).payload;
        const statusFilterText = queue.statusFilterText;
        return getPageCount(ticketEndpoint(1, true, searchTitle, statusFilterText))
          .map((response) =>
            titleSearchFulfilled({
              tickets: response.tickets,
              paginationModelOptions: {
                ...paginationModelOptions,
                totalPages: response.pageCount,
              },
              newPage: response.pageCount === 0 ? 0 : 1,
              searchTitle,
            }),
          );
      });

export const fetchTicketsWithStatusFilterEpic:
  Epic<Action, Store<State>, EpicDependencies> =
  (action$, state, { getPageCount }) =>
    action$.ofType('STATUS_FILTER')
      .mergeMap((action) => {
        const queue = (state.getState() as any as State).ticketQueue;
        const titleSearchText = queue.titleSearchText;
        const statusFilter = (action as StatusFilterAction).payload;
        return getPageCount(
          ticketEndpoint(1, true, titleSearchText, statusFilter))
          .map((response) =>
            statusFilterFulfilled({
              tickets: response.tickets,
              paginationModelOptions: {
                ...queue.PagerOptions,
                totalPages: response.pageCount,
              },
              newPage: response.pageCount === 0 ? 0 : 1,
              statusFilter,
            }),
          );
      });

export const ticketQueue =
  (state: TicketQueue = initialTicketQueue, action: Action): TicketQueue => {
    switch (action.type) {
      case 'INITIAL_TICKETS_FULFILLED':
        return {
          ...state,
          Tickets: action.payload.tickets,
          PagerOptions: {
            ...action.payload.paginationModelOptions,
            currentPage: action.payload.newPage,
          },
          statusFilterOptions: action.payload.statuses,
        };
      case 'PAGE_FULFILLED':
        return {
          ...state,
          Tickets: action.payload.tickets,
          PagerOptions: {
            ...action.payload.paginationModelOptions,
            currentPage: action.payload.newPage,
          },
        };
      case 'TOGGLE_TITLES_SEARCH':
        return {
          ...state,
          isSearchingTitles: action.payload,
        };
      case 'TITLES_SEARCH_FULFILLED':
        return {
          ...state,
          Tickets: action.payload.tickets,
          PagerOptions: {
            ...action.payload.paginationModelOptions,
            currentPage: action.payload.newPage,
          },
          titleSearchText: action.payload.searchTitle,
        };
      case 'TOGGLE_STATUS_FILTER':
        return {
          ...state,
          isFilteringStatus: action.payload,
        };
      case 'STATUS_FILTER_FULFILLED':
        return {
          ...state,
          Tickets: action.payload.tickets,
          PagerOptions: {
            ...action.payload.paginationModelOptions,
            currentPage: action.payload.newPage,
          },
          statusFilterText: action.payload.statusFilter,
        };
      default:
        return state;
    }
  };
