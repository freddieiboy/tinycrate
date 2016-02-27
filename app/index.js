import { render } from 'react-dom';
import App from './app'

import css from '!style!css!sass!./css/base.scss';
import '!style!css!sass!milligram/dist/milligram.css';

render(
  <App />,
  document.getElementById('content')
)
