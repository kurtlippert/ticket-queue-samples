import { Store, createStore, GenericStoreEnhancer } from 'redux';
import { State } from '../Model';
// import { saveState } from '../localStorage';
// import { loadState, saveState } from '../localStorage';
// import { throttle } from 'lodash';
import { rootReducer } from '../Update';
import { enableBatching } from 'redux-batched-actions';

const configureStore = (middlewares?: GenericStoreEnhancer) => {
  // const preloadedState: State = loadState();
  const store: Store<State> =
    createStore<State>(
      enableBatching(rootReducer),
      // preloadedState,
      middlewares,
    );

  // store.subscribe(throttle(() => {
  //   saveState({
  //     kaceInfo: store.getState().kaceInfo,
  //   });
  // }, 1000));

  return store;
};

export default configureStore;
