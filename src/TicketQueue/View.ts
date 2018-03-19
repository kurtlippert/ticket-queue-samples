// react
import * as React from 'react';

// redux
import { connect } from 'react-redux';

// misc
import { TicketQueue, Ticket } from './Model';
import { State } from '../Model';
import {
  DetailsList,
  IDetailsListProps,
  IColumn,
  ActionButton,
  IButtonProps,
  IIconProps,
  TextField,
  ITextFieldProps,
  ITextField,
  Dropdown,
  IDropdownProps,
  IDropdown,
  IDropdownOption,
  Icon,
  TooltipHost,
  ITooltipHostProps} from 'office-ui-fabric-react';
import Pager from '../Pager';
import { style } from 'typestyle';
import { initializeIcons, IconNames } from 'office-ui-fabric-react/lib/Icons';
import { Dispatch } from 'redux';
import { toggleTitlesSearch, titleSearch, Action, toggleStatusFilter, statusFilter } from './Actions';
import { debounce } from 'lodash';

initializeIcons();

export interface TicketQueueProps {
  queue: TicketQueue;
  dispatch: Dispatch<State>;
}

interface ColumnExtended extends IColumn {
  name: any;
}

const { div, span } = React.DOM;
const r = React.createElement;

const ticketQueue: React.SFC<TicketQueueProps> = ({ queue, dispatch }) =>
  div({},
    r(DetailsList as React.ComponentClass<IDetailsListProps>, {
      items: queue.Tickets,
      selectionMode: 0,
      columns: [
        {
          columnActionsMode: 1,
          fieldName: 'Title',
          isCollapsable: false,
          isGrouped: false,
          isMultiline: false,
          isResizable: true,
          isRowHeader: false,
          isSorted: false,
          isSortedDescending: false,
          key: 'Title',
          maxWidth: 300,
          minWidth: 110,
          onRender: (item: Ticket) =>
            span({ className: style({ cursor: 'default' }), title: item.Title }, item.Title),
          name:
            queue.isSearchingTitles
            ? r(TextField as React.ComponentClass<ITextFieldProps>, {
                placeholder: 'Search ticket titles',
                defaultValue: queue.titleSearchText,
                componentRef: (component: ITextField): void | {} => component ? component.focus() : {},
                onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>): void =>
                    (e.target as HTMLInputElement).select(),
                onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>): void => {
                  if (e.charCode === 13) {
                    dispatch(titleSearch((e.target as HTMLInputElement).value));
                    dispatch(toggleTitlesSearch(false));
                  }
                },
                onBlur: (): Action => dispatch(toggleTitlesSearch(false)),
                onChanged: debounce((newValue: string): Action => dispatch(titleSearch(newValue)), 500),
              } as ITextFieldProps)
            : div({
                className: style({
                  display: 'flex',
                  flexFlow: 'row nowrap',
                  maxWidth: '100%',
                })},
                span({}, `Title`),
                span({
                  className: style({
                    flex: 1,
                    whiteSpace: 'pre',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }),
                  title: queue.titleSearchText },
                  `${queue.titleSearchText === '' ? '' : ` ("${queue.titleSearchText}")`}`),
                r(ActionButton as React.ComponentClass<IButtonProps>, {
                  iconProps: { iconName: IconNames.Zoom } as IIconProps,
                  className: style({ whiteSpace: 'nowrap', top: '-4px', marginLeft: 'auto' }),
                  text: 'Search',
                  styles: {
                    label: style({ fontSize: '12px' }),
                    icon: style({ fontSize: '12px' }),
                  },
                  onClick: () => dispatch(toggleTitlesSearch(true)),
                }),
              ),
        } as ColumnExtended,
        {
          columnActionsMode: 1,
          fieldName: 'Status',
          isCollapsable: false,
          isGrouped: false,
          isMultiline: false,
          isResizable: true,
          isRowHeader: false,
          isSorted: false,
          isSortedDescending: false,
          key: 'Status',
          maxWidth: 300,
          minWidth: 110,
          name:
            queue.isFilteringStatus
            ? r(Dropdown as React.ComponentClass<IDropdownProps>, {
                componentRef: (component: IDropdown): void | {} => component ? component.focus(true) : {},
                placeHolder: 'Select status',
                options: [
                  { key: '', text: '' },
                  ...queue.statusFilterOptions.map((filterOptions) =>
                      ({ key: filterOptions.toLowerCase().replace(/\s/g, '_'), text: filterOptions })),
                ],
                onChanged: (option: IDropdownOption): Action => dispatch(statusFilter(option.text)),
                onBlur: (): Action => dispatch(toggleStatusFilter(false)),
                onDismiss: (): Action => dispatch(toggleStatusFilter(false)),
              })
            : div({
                className: style({
                  display: 'flex',
                  flexFlow: 'row nowrap',
                  maxWidth: '100%',
                })},
                span({}, 'Status'),
                span({
                  className: style({
                    flex: 1,
                    whiteSpace: 'pre',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }),
                  title: queue.statusFilterText },
                  `${queue.statusFilterText === '' ? '' : ` ("${queue.statusFilterText}")`}`),
                r(ActionButton as React.ComponentClass<IButtonProps>, {
                  iconProps: { iconName: IconNames.Filter } as IIconProps,
                  className: style({ whiteSpace: 'nowrap', top: '-4px', marginLeft: 'auto' }),
                  text: 'Filter',
                  styles: {
                    label: style({ fontSize: '12px' }),
                    icon: style({ fontSize: '12px' }),
                  },
                  onClick: () => dispatch(toggleStatusFilter(true)),
                }),
              ),
        } as ColumnExtended,
        {
          columnActionsMode: 1,
          fieldName: 'Time_Open',
          isCollapsable: false,
          isGrouped: false,
          isMultiline: false,
          isResizable: true,
          isRowHeader: false,
          isSorted: false,
          isSortedDescending: false,
          key: 'Time_Open',
          maxWidth: 300,
          minWidth: 100,
          name: 'Time Open',
        },
        {
          columnActionsMode: 1,
          fieldName: 'Assigned_To',
          isCollapsable: false,
          isGrouped: false,
          isMultiline: false,
          isResizable: true,
          isRowHeader: false,
          isSorted: false,
          isSortedDescending: false,
          key: 'Assigned_To',
          maxWidth: 300,
          minWidth: 100,
          name:
            div({},
              span({}, 'Assigned To '),
              r(TooltipHost as React.ComponentClass<ITooltipHostProps>, {
                  className: style({ marginLeft: '5px' }),
                  content:
                  `NOTE that if \'Angela Holland\' is assigned, check the CC List column.
                   More than likely, that will the party working the ticket.`,
                  calloutProps: { gapSpace: 15 },
                },
                span({ className: style({ verticalAlign: 'middle' }) },
                  r(Icon as React.ComponentClass<IIconProps>, {
                      className: style({
                        top: '1px',
                        position: 'absolute',
                        fontSize: '14px',
                        color: 'rgb(16, 110, 190)',
                      }),
                      iconName: IconNames.Info,
                    },
                  ),
                ),
              ),
            ),
        } as ColumnExtended,
        {
          columnActionsMode: 1,
          fieldName: 'CC_List',
          isCollapsable: false,
          isGrouped: false,
          isMultiline: false,
          isResizable: true,
          isRowHeader: false,
          isSorted: false,
          isSortedDescending: false,
          key: 'CC_List',
          maxWidth: 300,
          minWidth: 100,
          onRender: (item: Ticket) =>
            span({ className: style({ cursor: 'default' }), title: item.CC_List }, item.CC_List),
          name: 'CC List',
        },
      ],
    }),
    queue.Tickets.length === 0 && queue.titleSearchText !== ''
      ? span({ className: style({ display: 'inherit', textAlign: 'center' }) },
          `No ticket titles matching "${queue.titleSearchText}"`,
        )
      : '',
    r(Pager),
  );

interface StateProps {
  queue: TicketQueue;
}

interface DispatchProps {
  dispatch: Dispatch<State>;
}

const mapStateToTicketQueueProps = (state: State) => ({
  queue: state.ticketQueue,
});

const mapDispatchToTicketQueueProps = (dispatch: Dispatch<State>) => ({ dispatch });

export default connect<StateProps, DispatchProps, void, State>(
  mapStateToTicketQueueProps,
  mapDispatchToTicketQueueProps,
)(ticketQueue);
