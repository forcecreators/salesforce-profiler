/* eslint-disable class-methods-use-this */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-plusplus */
/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable @typescript-eslint/no-useless-constructor */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable max-classes-per-file */

import events from 'events';
import * as fs from 'fs';
import constants from '../../constants';
import ApexLogMetadataLine from './ApexLogMetadataLine';

/* nodes */
const blackList = /FLOW_START_INTERVIEW_LIMIT_USAGE/;
const whiteList =
  /LIMIT_USAGE|SOQL_EXECUTE_BEGIN|SOQL_EXECUTE_END|DML_BEGIN|DML_END|USER_INFO|EXECUTION_STARTED|CODE_UNIT_STARTED|METHOD_ENTRY|CODE_UNIT_FINISHED|METHOD_EXIT|FLOW_START_INTERVIEW_BEGIN|FLOW_START_INTERVIEW_END|WF_CRITERIA_BEGIN|WF_CRITERIA_END|WF_RULE_EVAL_BEGIN|WF_RULE_EVAL_END|WF_RULE_NOT_EVALUATED|FLOW_CREATE_INTERVIEW_END|FLOW_INTERVIEW_FINISHED|Number of/;
const startTagsWhitelist =
  /SOQL_EXECUTE_BEGIN|DML_BEGIN|CODE_UNIT_STARTED|METHOD_ENTRY|FLOW_START_INTERVIEW_BEGIN|WF_CRITERIA_BEGIN|WF_RULE_EVAL_BEGIN|FLOW_CREATE_INTERVIEW_END/;
const endTagsWhitelist =
  /SOQL_EXECUTE_END|DML_END|CODE_UNIT_FINISHED|METHOD_EXIT|FLOW_START_INTERVIEW_END|WF_CRITERIA_END|WF_RULE_EVAL_END|WF_RULE_NOT_EVALUATED|\|FLOW_INTERVIEW_FINISHED\|/;

/* types */
const apexTags = /METHOD_ENTRY|METHOD_EXIT/;
const workflowKeywords = /Workflow:/;
const workflowTags =
  /WF_CRITERIA_BEGIN|WF_CRITERIA_END|FLOW_START_INTERVIEW_BEGIN|FLOW_START_INTERVIEW_END|WF_RULE_EVAL_BEGIN|WF_RULE_EVAL_END|WF_RULE_NOT_EVALUATED|FLOW_CREATE_INTERVIEW_END|\|FLOW_INTERVIEW_FINISHED\|/;
const dmlTags = /DML_BEGIN|DML_END/;
const soqlTags = /SOQL_EXECUTE_BEGIN|SOQL_EXECUTE_END/;
const limitTags = /LIMIT_USAGE/;

export declare interface ProfileService extends events.EventEmitter {
  on(event: 'progress', listener: (value: number) => void): this;
  on(event: 'complete', listener: (metadata: ApexLogMetadata) => void): this;
}

export default class ApexLogMetadata extends events.EventEmitter {
  logPath: string;

  lastProgress: number;

  logLines: string[];

  lineMetadata: ApexLogMetadataLine[];

  parentTree: ApexLogMetadataLine[];

  rootIndexes: number[];

  limits: any;

  executionTime: number;

  constructor(logPath: string) {
    super();
    this.logPath = logPath;
    this.lastProgress = 0;
    const logFile = fs.readFileSync(this.logPath, 'utf8');
    this.logLines = logFile.split('\n');
    this.lineMetadata = [];
    this.parentTree = [];
    this.rootIndexes = [];
    this.limits = {};
  }

  public async process() {
    let index;
    for (index = 1; index < this.logLines.length; index++) {
      if (!this.shouldProcess(this.logLines[index])) continue;
      const parentIndex = this.parentTree.length - 1;
      const line = new ApexLogMetadataLine(
        index,
        parentIndex,
        this.logLines[index]
      );
      if (!line) continue;
      this.processLine(line);
      if (line.limitDetail) {
        if (!this.limits[line.limitDetail.name])
          this.limits[line.limitDetail.name] = [];
        this.limits[line.limitDetail.name].push(line.limitDetail);
      }
      this.reportProgress(index);
    }
    this.executionTime = ApexLogMetadataLine.LAST_REPORTED_TIME;
    this.emit('complete', this);
  }

  public shouldProcess(line: string) {
    return (
      !line.includes('FLOW_START_INTERVIEW_LIMIT_USAGE') &&
      whiteList.test(line) &&
      !line.includes('System.Type.equals')
    );
  }

  public processLine(line) {
    if (endTagsWhitelist.test(line.logLine) && this.parentTree.length > 0) {
      this.parentTree[0].endParent(line);
      this.lineMetadata[this.parentTree[0].index] = this.parentTree[0];
      this.parentTree.splice(0, 1);
    } else if (startTagsWhitelist.test(line.logLine)) {
      if (this.parentTree.length > 0) {
        this.parentTree[0].children.push(line.index);
      } else {
        this.rootIndexes.push(line.index);
      }
      this.parentTree.unshift(line);
      this.lineMetadata[line.index] = line;
    }
    return this;
  }

  private reportProgress(index: number) {
    const progress: number = Math.ceil((index / this.logLines.length) * 100);
    if (this.lastProgress !== progress) {
      this.emit('progress', progress);
    }
    this.lastProgress = progress;
  }
}
