/* eslint-disable react/prefer-stateless-function */
/* eslint-disable prettier/prettier */
/* eslint-disable prefer-template */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable @typescript-eslint/no-useless-constructor */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable max-classes-per-file */

import React from 'react';
import Workspace from './workspace';
import ProcessModal from './ProcessModal';
import constants, { Argument } from '../constants';

class VerticalNavProps {
  selectedId: string;

  onViewChange: (viewId: string) => null;
}

const navigationElements = {
  Overview: [
    {
      label: 'Summary',
      id: 'summary',
    },
    {
      label: 'Raw Log',
      id: 'raw-log',
    },
  ],
};

export default class VerticalNav extends React.Component<VerticalNavProps> {
  constructor(props) {
    super(props);
  }

  onMenuItemClick(event) {
    this.props.onViewChange(event.target.getAttribute('data-viewid'));
    return this;
  }

  render() {
    const styleProps: any = {
      width: '320px',
      'background-color': '#FAFAFB',
      height: '100%',
      float: 'left',
    };

    const navElementsToRender = [];
    Object.keys(navigationElements).forEach((groupName) => {
      navElementsToRender.push(
        <div className="slds-nav-vertical__section">
          <h2 id="entity-header" className="slds-nav-vertical__title">
            {groupName}
          </h2>
        </div>
      );

      Object.values(navigationElements[groupName]).forEach((groupItem) => {
        const groupItems = [];
        const liClass =
          groupItem.id === this.props.selectedId
            ? 'slds-nav-vertical__item slds-is-active'
            : 'slds-nav-vertical__item';
        groupItems.push(
          <li className={liClass} onClick={this.onMenuItemClick.bind(this)}>
            <span
              data-viewid={groupItem.id}
              className="slds-nav-vertical__action"
              aria-current="true"
            >
              {groupItem.label}
            </span>
          </li>
        );
        navElementsToRender.push(
          <ul aria-describedby="entity-header">{groupItems}</ul>
        );
      });
    });

    return (
      <div className="demo-only" style={styleProps}>
        <nav
          className="slds-nav-vertical slds-nav-vertical_shade"
          aria-label="Sub page"
        >
          {navElementsToRender}
        </nav>
      </div>
    );
  }
}
