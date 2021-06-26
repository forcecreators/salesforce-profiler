/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
export class Argument {
  event: string;

  value: any;

  data: any;

  constructor(event: string, value: any, data: any) {
    this.event = event;
    this.value = value;
    this.data = data;
  }
}

const ipc = {
  OPEN_NEW_LOG: 'OPEN_NEW_LOG',
  READ_LOG_FILE: 'READ_LOG_FILE',
};

const eventTypes = {
  OPEN_PROCESSING_START: 'OPEN_PROCESSING_START',
  OPEN_PROCESSING_PROGRESS: 'OPEN_PROCESSING_PROGRESS',
  OPEN_PROCESSING_FINISHED: 'OPEN_PROCESSING_FINISHED',
};

const limitTypes = {
  soql_queries: 'soql_queries',
  soql_query_rows: 'soql_query_rows',
  dml_statements: 'dml_statements',
  dml_rows: 'dml_rows',
  dml_push_immediate: 'dml_push_immediate',
  cpu_time: 'cpu_time',
  heap_size: 'heap_size',
  callouts: 'callouts',
  future: 'future',
  queueable: 'queueable',
};

export default {
  ipc,
  eventTypes,
  limitTypes,
  events: {
    startProcessing: (logPath: string) => {
      return new Argument(eventTypes.OPEN_PROCESSING_START, logPath, null);
    },
    progress: (value: number) => {
      return new Argument(eventTypes.OPEN_PROCESSING_PROGRESS, value, null);
    },
    processingComplete: (logPath: string, metadata: any) => {
      return new Argument(
        eventTypes.OPEN_PROCESSING_FINISHED,
        logPath,
        JSON.stringify(metadata)
      );
    },
    debug: (value: string) => {
      return new Argument('DEBUG', value, null);
    },
  },
};
