/* eslint-disable react/prefer-stateless-function */
/* eslint-disable prettier/prettier */
/* eslint-disable prefer-template */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable @typescript-eslint/no-useless-constructor */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable max-classes-per-file */

import React from 'react';
import Workspace from './workspace';
import constants, { Argument } from '../constants';

class ProcessModalProps {
  progress: number;
}

export default class ProcessModal extends React.Component<ProcessModalProps> {
  constructor(props) {
    super(props);
  }

  render() {
    const styleProp = {
      width: this.props.progress + '%',
    };
    return (
      <div>
        <section
          role="dialog"
          aria-labelledby="modal-heading-01"
          aria-modal="true"
          aria-describedby="modal-content-id-1"
          className="slds-modal slds-fade-in-open"
        >
          <div className="slds-modal__container">
            <header className="slds-modal__header">
              <h2
                id="modal-heading-01"
                className="slds-modal__title slds-hyphenate"
              >
                Processing Log File
              </h2>
            </header>
            <div
              className="slds-modal__content slds-p-around_medium"
              id="modal-content-id-1"
            >
              <div>
                <div
                  className="slds-grid slds-grid_align-spread slds-p-bottom_x-small"
                  id="progress-bar-label-id-5"
                >
                  <span>Processing Log File</span>
                  <span aria-hidden="true">
                    <strong>{this.props.progress}% Complete</strong>
                  </span>
                </div>
                <div className="slds-progress-bar" role="progressbar">
                  <span
                    className="slds-progress-bar__value"
                    style={styleProp}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className="slds-backdrop slds-backdrop_open" />
      </div>
    );
  }
}
