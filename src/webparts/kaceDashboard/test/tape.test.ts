// import * as test from 'tape';

// import { rootEpic } from '../../../Update';
// import { ActionsObservable } from 'redux-observable';
// import 'rxjs/add/operator/toArray';
// import 'rxjs/add/observable/of';
// import { KaceInfoAction } from '../../../KaceInfo/Actions';
// import { KaceInfo } from '../../../KaceInfo/Model';
// import { Observable } from 'rxjs/Observable';

// type Test = test.Test;

// test('fetch kace machine info epic', (t: Test): void => {
//   const mockResponse = {
//     Machines: [
//       {
//         Id: '1',
//         User: 'test1',
//         Name: 'testName',
//         Os_name: 'testName_os',
//       },
//       {
//         Id: '2',
//         User: 'test2',
//         Name: 'testName2',
//         Os_name: 'testName_os2',
//       },
//     ],
//   } as KaceInfo;

//   const action$ = ActionsObservable.of({ type: 'FETCH_MACHINES' } as KaceInfoAction);
//   const store: any = null; // not needed for this epic
//   const dependencies = {
//     getJSON: (_: string) => Observable.of(mockResponse),
//   };

//   rootEpic(action$, store, dependencies)
//     .toArray()
//     .subscribe((actions) => {
//       t.deepEqual(actions, [{
//         type: 'FETCH_MACHINES_FULFILLED',
//         payload: mockResponse,
//       }]);
//     });

//   t.end();
// });
