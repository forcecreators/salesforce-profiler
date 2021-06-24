import React from 'react';
import { render } from 'react-dom';
import App from './App';
import Workspace from './workspace';

const workspace = new Workspace();
render(
  <App workspace={workspace} key={workspace} />,
  document.getElementById('root')
);
