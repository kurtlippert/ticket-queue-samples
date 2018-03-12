// tslint:disable:no-console

// react
import * as React from 'react';

// redux
import { connect } from 'react-redux';

// misc
import { TicketQueue } from './Model';
import { State } from '../Model';
// import { DetailsList, IDetailsListProps, buildColumns, IObjectWithKey, IColumn } from 'office-ui-fabric-react';
// import { DetailsList, IDetailsListProps, IColumn, buildColumns } from 'office-ui-fabric-react';
// import { DetailsList, IDetailsListProps, buildColumns } from 'office-ui-fabric-react';
// import { DetailsList, IDetailsListProps, IColumn, ActionButton, IButtonProps, IIconProps, SearchBox, ISearchBox } from 'office-ui-fabric-react';
import { DetailsList, IDetailsListProps, IColumn, ActionButton, IButtonProps, IIconProps, TextField, ITextFieldProps, ITextField } from 'office-ui-fabric-react';
import Pager from '../Pager';
import { style } from 'typestyle';
import { initializeIcons, IconNames } from 'office-ui-fabric-react/lib/Icons';
import { Dispatch } from 'redux';
import { toggleTitlesSearch, titleSearch, Action } from './Actions';
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

// const a = render(div({}, 'some div'), )

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
          minWidth: 100,
          name:
            queue.isSearchingTitles
            ? r(TextField as React.ComponentClass<ITextFieldProps>, {
                placeholder: 'Search ticket titles',
                value: queue.titleSearchText,
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
            : div({},
                span({}, `Title${queue.titleSearchText === '' ? '' : ` ("${queue.titleSearchText}")`}`),
                r(ActionButton as React.ComponentClass<IButtonProps>, {
                  iconProps: { iconName: IconNames.Zoom } as IIconProps,
                  className: style({ position: 'absolute', top: '-4px', right: 0 }),
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
          minWidth: 50,
          name: 'Status',
        },
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
          name: 'Assigned To',
        },
      ],
    }),
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
