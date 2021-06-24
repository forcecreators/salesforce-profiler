/* eslint-disable class-methods-use-this */
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable prettier/prettier */
/* eslint-disable prefer-template */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable @typescript-eslint/no-useless-constructor */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable max-classes-per-file */

import React from 'react';
import { FlameGraph } from 'react-flame-graph';
import FlameChart from 'flame-chart-js';

import Workspace from './workspace';
import ProcessModal from './ProcessModal';
import VerticalNav from './VerticalNav';
import constants, { Argument } from '../constants';
import ApexLogMetadata from '../../main/profiler/ApexLogMetadata';
import ApexLogMetadataLine from '../../main/profiler/ApexLogMetadataLine';
import { Linter } from 'eslint';

class SummaryProps {
  metadata: ApexLogMetadata;
}

export default class Summary extends React.Component<SummaryProps> {
  elementRoot: React.RefObject<unknown>;
  flameChart: FlameChart;

  constructor(props) {
    super(props);
    this.elementRoot = React.createRef();
    window.addEventListener('resize', this.onResize.bind(this));
  }

  componentDidMount() {
    const canvas = document.getElementById('canvas');
    canvas.width = this.elementRoot.current.offsetWidth;
    canvas.height = this.elementRoot.current.offsetHeight;
    console.log('canvas', canvas);
    console.log('roots', this.props.metadata);

    const data = this.renderStackTrace();
    const items = this.renderWaterfall();

    const intervals = {
      default: [
        {
          name: 'executing',
          color: 'rgb(207,196,152)',
          type: 'block',
          start: 'startTime',
          end: 'endTime',
        },
      ],
    };

    this.flameChart = new FlameChart({
      canvas, // mandatory
      data,
      waterfall: {
        items,
        intervals,
      },
      marks: [],
      colors: {},
      settings: {
        styles: {
          main: {
            blockHeight: 30,
            blockPaddingLeftRight: 4,
            backgroundColor: 'white',
            font: '12px sans-serif',
            fontColor: 'black',
            tooltipHeaderFontColor: 'black',
            tooltipBodyFontColor: '#688f45',
            tooltipBackgroundColor: 'white',
            headerHeight: 14,
            headerColor: 'rgba(112, 112, 112, 0.25)',
            headerStrokeColor: 'rgba(112, 112, 112, 0.5)',
            headerTitleLeftPadding: 16,
          },
          timeGrid: {
            color: 'rgb(126, 126, 126, 0.5)',
          },
          timeGridPlugin: {
            font: '12px sans-serif',
            fontColor: 'black',
          },
          timeframeSelectorPlugin: {
            font: '12px sans-serif',
            fontColor: 'black',
            overlayColor: 'rgba(112, 112, 112, 0.5)',
            graphStrokeColor: 'rgb(0, 0, 0, 0.2)',
            graphFillColor: 'rgb(0, 0, 0, 0.25)',
            bottomLineColor: 'rgb(0, 0, 0, 0.25)',
            knobColor: 'rgb(131, 131, 131)',
            knobSize: 10,
            height: 60,
            backgroundColor: 'white',
          },
          waterfallPlugin: {
            defaultHeight: this.elementRoot.current.offsetHeight / 2,
          },
          togglePlugin: {
            height: 25,
            color: 'rgb(202,202,202, 0.25)',
            strokeColor: 'rgb(138,138,138, 0.50)',
            dotsColor: 'rgb(97,97,97)',
            fontColor: 'black',
            font: '12px sans-serif',
            triangleWidth: 10,
            triangleHeight: 7,
            leftPadding: 10,
          },
        },
      },
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
    return this;
  }

  onResize() {
    if (this.flameChart && this.elementRoot.current) {
      this.flameChart.resize(
        this.elementRoot.current.offsetWidth,
        this.elementRoot.current.offsetHeight
      );
    }
  }

  buildFlameRecursively(index: number) {
    const line: ApexLogMetadataLine = this.props.metadata.lineMetadata[index];
    if (line.duration == 0 || !line) return;
    const element = {
      name: line.detail,
      start: line.time,
      duration: line.duration,
      type: 'task',
      children: [],
    };
    line.children.forEach((childIndex) => {
      const child = this.buildFlameRecursively(childIndex);
      if (child) element.children.push(child);
    });
    return element;
  }

  renderWaterfall() {
    const waterfall = [];
    this.props.metadata.lineMetadata.forEach((line) => {
      if (!line || line.duration === 0 || !line.time) return;
      waterfall.push({
        name: !line.detail ? '' : line.detail,
        intervals: 'default',
        color: 'rgb(207,180,81)',
        timing: {
          startTime: line.time,
          endTime: line.endTime,
        },
        meta: [],
      });
    });
    return waterfall;
  }

  renderStackTrace() {
    const data = [];
    this.props.metadata.rootIndexes.forEach((rootIndex) => {
      const child = this.buildFlameRecursively(rootIndex);
      if (child) data.push(child);
    });
    return data;
  }

  render() {
    const styleProps = {
      height: '100%',
    };
    return (
      <div ref={this.elementRoot} style={styleProps}>
        <canvas id="canvas" />
      </div>
    );
  }
}
