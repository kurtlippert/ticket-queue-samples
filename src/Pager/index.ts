// react
import * as React from 'react';

// redux
import { Dispatch } from 'redux';
import { connect } from 'react-redux';

// libs
import { PaginationModelOptions } from 'ultimate-pagination';

// components
import { State } from '../Model';
import { PagerProps, Pager } from './View';

const mapStateToPagerProps = (state: State) => ({ paginationModelOptions: state.ticketQueue.PagerOptions });
const mapDispatchToPagerProps = (dispatch: Dispatch<State>) => ({ dispatch });

interface StateToPager {
  paginationModelOptions: PaginationModelOptions;
}

interface DispatchToPager {
  dispatch: Dispatch<State>;
}

export default connect<StateToPager, DispatchToPager, void, State>(
  mapStateToPagerProps,
  mapDispatchToPagerProps,
)(Pager as React.SFC<PagerProps>);
