/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable @typescript-eslint/no-useless-constructor */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable max-classes-per-file */

import ApexLogMetadata from './ApexLogMetadata';

const { workerData, parentPort } = require('worker_threads');

parentPort.postMessage('starting job with ' + workerData);

const metadata = new ApexLogMetadata(this.logPath).on(
  'progress',
  (value: number) => {
    console.log(value);
  }
);
await metadata.process();
