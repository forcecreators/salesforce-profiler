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
import VerticalNav from './VerticalNav';
import constants, { Argument } from '../constants';
import Summary from './views/Summary';
import RawLog from './views/RawLog';
import Limits from './views/Limits';

class ViewerProps {
  workspace: Workspace;
}

export default class Viewer extends React.Component<ViewerProps> {
  constructor(props) {
    super(props);
    this.state = {
      progress: 0,
      selectedViewId: 'summary',
    };
    window.api.onOpenEvent((_event: unknown, arg: Argument) => {
      switch (arg.event) {
        case constants.eventTypes.OPEN_PROCESSING_PROGRESS:
          this.setState({ progress: arg.value });
          break;
        default:
          break;
      }
    });
  }

  onViewChange(viewId) {
    this.setState({ selectedViewId: viewId });
  }

  getView() {
    const activeTab =
      this.props.workspace.tabs[this.props.workspace.activeTabId];
    switch (this.state.selectedViewId) {
      case 'summary':
        return <Summary metadata={activeTab.metadata} />;
        break;
      case 'raw-log':
        return <RawLog logPath={activeTab.metadata.logPath} />;
        break;
      default:
        return (
          <Limits
            inputs={
              activeTab.metadata.limits[constants.limitTypes.soql_queries]
            }
            executionTime={activeTab.metadata.executionTime}
          />
        );
    }
  }

  render() {
    const tab = this.props.workspace.tabs[this.props.workspace.activeTabId];
    if (!tab) return null;
    if (!tab.metadata) return <ProcessModal progress={this.state.progress} />;
    const navStyleProps = {
      height: 'calc(100% - 40px)',
    };
    const pageStyleProps = {
      height: '100%',
      background: 'white',
      padding: '20px 20px 20px 20px',
      float: 'left',
      width: 'calc(100% - 320px)',
    };
    return (
      <div style={navStyleProps}>
        <VerticalNav
          selectedId={this.state.selectedViewId}
          onViewChange={this.onViewChange.bind(this)}
        />
        <div style={pageStyleProps}>{this.getView()}</div>
      </div>
    );
  }
}
