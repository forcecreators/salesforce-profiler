/* eslint-disable promise/always-return */
/* eslint-disable promise/catch-or-return */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable prettier/prettier */
/* eslint-disable prefer-template */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable @typescript-eslint/no-useless-constructor */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable max-classes-per-file */

import React from 'react';
import { Line } from 'react-chartjs-2';

import { LimitDetail } from '../../main/profiler/ApexLogMetadataLine';

type LimitsProps = {
  inputs: LimitDetail[];
  executionTime: number;
};

export default class Limits extends React.Component<LimitsProps> {
  public render() {
    console.log(this.props.inputs);
    const data = {
      labels: [],
      datasets: [
        {
          fill: false,
          data: [],
          type: 'line',
        },
      ],
    };
    let options = {};
    if (this.props.inputs) {
      this.props.inputs.forEach((limitData: LimitDetail) => {
        data.datasets[0].data.push(limitData.current);
        data.labels.push(limitData.time);
      });

      options = {
        scales: {
          y: {
            min: 0,
            max: this.props.inputs[0].max,
          },
          x: {
            type: 'linear',
            min: 0,
            max: this.props.executionTime,
          },
        },
      };
    }

    console.log(data);
    return <Line data={data} options={options} />;
  }
}
