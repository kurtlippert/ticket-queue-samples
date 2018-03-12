// react
import { createElement as r } from 'react';
import * as ReactDom from 'react-dom';

// spfx
import {
  Version,
} from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  WebPartContext,
} from '@microsoft/sp-webpart-base';

// App Component
import App from '../../View';

// redux
import { initialTickets } from '../../TicketQueue/Actions';
import configureStore from '../configureStore';
import { Provider } from 'react-redux';
import { createEpicMiddleware } from 'redux-observable';
import { Store, applyMiddleware } from 'redux';
import { State } from '../../Model';

// redux-observables
import { rootEpic, EpicDependencies } from '../../Update';

// rxjs
import { ajax } from 'rxjs/observable/dom/ajax';

export default class KaceDashboardWebPart extends BaseClientSideWebPart<{}> {
  // Define redux store
  private store: Store<State>;

  public getContext(): WebPartContext {
    return this.context;
  }

  // initialize store when webpart is constructed
  public constructor() {
    super();

    const epicMiddleware = createEpicMiddleware(rootEpic, {
      dependencies: {
        getJSON: ajax.getJSON,
        getPageCount: ajax.getJSON,
      } as EpicDependencies,
    });

    this.store = configureStore(applyMiddleware(epicMiddleware));
  }

  // using redux-react 'Provider' here in conjunction with the redux-react
  // Note that we have to give 'Provider' a single component.
  // So multiple components nested underneath are wrapped in divs
  public render(): void {

    const root =
      r(Provider, { store: this.store },
        r(App),
      );

    ReactDom.render(root, this.domElement);
  }

  protected onInit(): Promise<void> {
    // subscribe our store to the render function
    this.store.subscribe(this.render);

    this.store.dispatch(
      initialTickets({
        hideFirstAndLastPageLinks: true,
      }),
    );

    return super.onInit();
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
}
