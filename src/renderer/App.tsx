/* eslint-disable react/jsx-no-bind */
/* eslint-disable prettier/prettier */
/* eslint-disable prefer-template */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable @typescript-eslint/no-useless-constructor */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable max-classes-per-file */

import React from 'react';
import NavBar from './NavBar';
import Viewer from './Viewer';
import Workspace from './workspace';
import constants, { Argument } from '../constants';
import './App.global.css';

class AppState {
  workspace: Workspace;
}

export default class App extends React.Component<unknown, AppState> {
  workspace: Workspace;

  constructor() {
    super({});

    this.workspace = new Workspace();
    this.state = {
      workspace: this.workspace,
    };

    window.api.onOpenEvent((_event: unknown, arg: Argument) => {
      switch (arg.event) {
        case constants.eventTypes.OPEN_PROCESSING_START:
          this.workspace.newTab(arg.value, arg.value, '');
          this.updateState();
          break;
        case constants.eventTypes.OPEN_PROCESSING_FINISHED:
          this.workspace.tabs[arg.value].metadata = JSON.parse(arg.data);
          this.updateState();
          break;
        default:
          break;
      }
    });
  }

  updateState() {
    this.setState({ workspace: this.workspace });
  }

  tabChanged(tabId) {
    this.workspace.activeTabId = tabId;
    this.updateState();
  }

  closeTab(tabId) {
    delete this.workspace.tabs[tabId];
  }

  openNew() {
    window.api.open();
    return this;
  }

  render() {
    return (
      <div>
        <NavBar
          workspace={this.state.workspace}
          onCloseTab={this.closeTab.bind(this)}
          onTabChange={this.tabChanged.bind(this)}
          onOpenNew={this.openNew.bind(this)}
        />
        <Viewer
          key={this.state.workspace.activeTabId}
          workspace={this.state.workspace}
        />
      </div>
    );
  }
}
