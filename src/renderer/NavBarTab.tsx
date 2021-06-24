/* eslint-disable prettier/prettier */
/* eslint-disable prefer-template */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable @typescript-eslint/no-useless-constructor */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable max-classes-per-file */
import React from 'react';
import WorkspaceTab from './WorkspaceTab';

class NavBarTabProps {
  config: WorkspaceTab;

  active: boolean;

  onClick: (string) => null;

  onClose: (string) => null;
}

export default class NavBarTab extends React.Component<NavBarTabProps> {
  handleClick(e) {
    this.props.onClick(this.props.config.id);
  }

  handleClose(e) {
    this.props.onClose(this.props.config.id);
  }

  render() {
    const active =
      'slds-context-bar__item slds-context-bar__item_tab slds-is-active';
    const inactive = 'slds-context-bar__item slds-context-bar__item_tab';
    const ariaId = 'context-tab-id-' + this.props.config.id;
    return (
      <li
        onClick={this.handleClick.bind(this)}
        className={this.props.active ? active : inactive}
        role="presentation"
      >
        <a
          href="#"
          className="slds-context-bar__label-action"
          role="tab"
          title="Home"
          id={ariaId}
        >
          <span className="slds-truncate" title="Home">
            {this.props.config.title}
          </span>
        </a>

        <div className="slds-context-bar__icon-action slds-col_bump-left slds-p-left_none">
          <button
            type="button"
            onClick={this.handleClose.bind(this)}
            className="slds-button
                        slds-button_icon
                        slds-button_icon-current-color
                        slds-button_icon-container
                        slds-button_icon-x-small"
            title="Close Home"
          >
            <svg className="slds-button__icon" aria-hidden="true">
              <use xlinkHref="/assets/icons/utility-sprite/svg/symbols.svg#close" />
            </svg>
            <span className="slds-assistive-text">Close Home</span>
          </button>
        </div>
      </li>
    );
  }
}
