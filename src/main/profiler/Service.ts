/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable @typescript-eslint/no-useless-constructor */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable max-classes-per-file */

import events from 'events';
import ApexLogMetadata from './ApexLogMetadata';

export declare interface ProfileService extends events.EventEmitter {
  on(event: 'progress', listener: (value: number) => void): this;
  on(event: 'complete', listener: () => void): this;
}
export default class Service extends events.EventEmitter {
  logPath: string;

  lastProgress: number;

  constructor(logPath: string) {
    super();
    this.logPath = logPath;
    this.lastProgress = 0;
  }

  public async run() {
    const metadata = await new ApexLogMetadata(this.logPath)
      .on('progress', (value: number) => {
        this.reportProgress(value);
      })
      .on('complete', () => {
        this.emit('complete');
      })
      .process();
  }

  private reportProgress(progress: number) {
    if (this.lastProgress !== progress) {
      this.emit('progress', progress);
    }
    this.lastProgress = progress;
  }
}
