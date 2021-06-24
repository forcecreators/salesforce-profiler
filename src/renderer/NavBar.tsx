/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable @typescript-eslint/no-useless-constructor */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable max-classes-per-file */

import React from 'react';
import NavBarTab from './NavBarTab';
import Workspace from './Workspace';
import NewIcon from '../css/icons/utility-sprite/svg/symbols.svg';
import AppIcon from '../../assets/icon.png';

class NavBarProps {
  onTabChange: (selectedId: string) => null;

  onOpenNew: () => null;

  onCloseTab: (selectedId: string) => null;

  workspace: Workspace;
}

export default class NavBar extends React.Component<NavBarProps> {
  focusTab(tabId: string) {
    this.props.onTabChange(tabId);
  }

  closeTab(tabId) {
    this.props.onCloseTab(tabId);
    this.props.onTabChange(null);
    return this;
  }

  openNew() {
    this.props.onOpenNew();
  }

  render() {
    const icon = NewIcon + '#add';
    const appIconSize = {
      height: '35px',
    };
    return (
      <div className="slds-context-bar slds-context-bar_tabs">
        <div className="slds-context-bar__primary">
          <span className="slds-context-bar__label-action slds-context-bar__app-name">
            <img src={AppIcon} style={appIconSize} />
            <span className="slds-truncate slds-p-left_small" title="App Name">
              Salesforce Profiler
            </span>
          </span>
          <div className="slds-context-bar__vertical-divider" />
          <div className="slds-context-bar__icon-action">
            <button
              type="button"
              className="slds-button slds-button_icon slds-button_icon-container slds-button_icon-small"
              title="Open a New Tab"
              onClick={this.openNew.bind(this)}
            >
              <svg className="slds-button__icon" aria-hidden="true">
                <use xlinkHref={icon} />
              </svg>
              <span className="slds-assistive-text">Open a New Tab</span>
            </button>
          </div>
        </div>
        <div className="slds-context-bar__secondary">
          <div className="slds-context-bar__vertical-divider" />
          <ul className="slds-grid" role="tablist">
            {Object.values(this.props.workspace.tabs).map((item) => {
              return (
                <NavBarTab
                  key={item.id}
                  config={item}
                  // eslint-disable-next-line eqeqeq
                  active={this.props.workspace.activeTabId == item.id}
                  onClick={this.focusTab.bind(this)}
                  onClose={this.closeTab.bind(this)}
                />
              );
            })}
          </ul>
        </div>
      </div>
    );
  }
}
