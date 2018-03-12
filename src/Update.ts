import { Reducer, Store, combineReducers } from 'redux';
import { State } from './Model';
import { combineEpics, Epic } from 'redux-observable';
import { Observable } from 'rxjs/Observable';
import {
  ticketQueue, fetchInitialTicketsEpic, fetchFirstPageTicketsEpic,
  fetchPreviousPageTicketsEpic, fetchFirstEllipsisPageTicketsEpic,
  fetchSelectedPageTicketsEpic, fetchSecondEllipsisPageTicketsEpic,
  fetchNextPageTicketsEpic, fetchLastPageTicketsEpic,
} from './TicketQueue/Update';
import { Ticket, TicketQueue } from './TicketQueue/Model';
import { Action } from './TicketQueue/Actions';

export interface EpicDependencies {
  getJSON: (url: string) => Observable<{ tickets: Ticket[] }>;
  getPageCount: (url: string) => Observable<{ pageCount: number, tickets: Ticket[] }>;
}

export const rootReducer = combineReducers<State>({
  ticketQueue: ticketQueue as Reducer<TicketQueue>,
});

export const rootEpic:
  Epic<Action, Store<State>, EpicDependencies> =
  combineEpics<Action, Store<State>, EpicDependencies>(
    fetchInitialTicketsEpic,
    fetchFirstPageTicketsEpic,
    fetchPreviousPageTicketsEpic,
    fetchFirstEllipsisPageTicketsEpic,
    fetchSelectedPageTicketsEpic,
    fetchSecondEllipsisPageTicketsEpic,
    fetchNextPageTicketsEpic,
    fetchLastPageTicketsEpic,
  );
