import { createElement as r } from 'react';
import TicketQueue from './TicketQueue/View';

const App: React.SFC = () =>
  r('div', {},
    r(TicketQueue),
  );

export default App;
