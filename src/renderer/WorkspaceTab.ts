import ApexLogMetadata from '../main/profiler/ApexLogMetadata';

/* eslint-disable prettier/prettier */
export default class {
  title: string;

  logPath: string;

  metadataPath: string;

  metadata: ApexLogMetadata;

  id: string;

  constructor(logPath: string, metadataPath: string) {
    this.title = logPath.replace(/^.*[\\\/]/, '');
    this.logPath = logPath;
    this.metadataPath = metadataPath;
    this.id = logPath;
  }
}
