import { PaginationModelOptions } from 'ultimate-pagination';

export interface Ticket {
  Id: number;
  Title: string;
  Status: string;
  Time_Open: string;
  Category: string;
  Assigned_To: string;
  Submitter: string;
  CC_List: string;
}

export interface TicketQueue {
  Tickets: Ticket[];
  PagerOptions: PaginationModelOptions;
  isSearchingTitles: boolean;
  isFilteringStatus: boolean;
  titleSearchText: string;
  statusFilterText: string;
  statusFilterOptions: string[];
}

export const initialTicketQueue: TicketQueue = {
  Tickets: [],
  PagerOptions: {
    currentPage: 5,
    totalPages: 10,
  },
  isSearchingTitles: false,
  isFilteringStatus: false,
  titleSearchText: '',
  statusFilterText: '',
  statusFilterOptions: [],
};
