/* eslint-disable class-methods-use-this */
/* eslint-disable prefer-template */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-plusplus */
/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable @typescript-eslint/no-useless-constructor */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable max-classes-per-file */

const blackList = /FLOW_START_INTERVIEW_LIMIT_USAGE/;
const whiteList =
  /LIMIT_USAGE|SOQL_EXECUTE_BEGIN|SOQL_EXECUTE_END|DML_BEGIN|DML_END|USER_INFO|EXECUTION_STARTED|CODE_UNIT_STARTED|METHOD_ENTRY|CODE_UNIT_FINISHED|METHOD_EXIT|FLOW_START_INTERVIEW_BEGIN|FLOW_START_INTERVIEW_END|WF_CRITERIA_BEGIN|WF_CRITERIA_END|WF_RULE_EVAL_BEGIN|WF_RULE_EVAL_END|WF_RULE_NOT_EVALUATED|FLOW_CREATE_INTERVIEW_END|FLOW_INTERVIEW_FINISHED/;
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

export default class ApexLogMetadataLine {
  static EXECUTION_START: number;

  logLine: string;

  logLineSplit: string[];

  event: string;

  type: string;

  detail: string;

  index: number;

  children: number[];

  parentIndex: number;

  time: number;

  nano: number;

  duration: number;

  endTime: number;

  constructor(index: number, parentIndex: number, logLine: string) {
    this.index = index;
    this.parentIndex = parentIndex;
    this.logLine = logLine;
    this.logLineSplit = this.logLine.split('|', 2);
    this.children = [];
    const timeSplit = this.logLineSplit[0].split(' ');
    this.nano = parseInt(
      timeSplit[1].substring(1, timeSplit[1].length - 1),
      10
    );

    if (!ApexLogMetadataLine.EXECUTION_START) {
      ApexLogMetadataLine.EXECUTION_START = this.nanoToMs(this.nano);
    }

    this.time = this.nanoToMs(this.nano);

    this.classifyEvent();
    this.getDetailValue();
    this.classifyType();
  }

  private nanoToMs(nanoSeconds: number): number {
    return Math.floor(nanoSeconds / 1000000);
  }

  public endParent(endLine: ApexLogMetadataLine) {
    this.duration = endLine.time - this.time;
    this.endTime = endLine.time;
    return this;
  }

  private getDetailValue() {
    if (this.logLine.includes('__sfdc_trigger')) {
      this.detail = this.logLine.substring(
        this.logLine.lastIndexOf(' ') + 1,
        this.logLine.length
      );
      this.detail = this.detail.replace('__sfdc_trigger', '');
    } else if (this.event === 'WF_CRITERIA_BEGIN') {
      this.detail = this.logLine.split('|')[3];
    } else if (this.event === 'DML_BEGIN') {
      const lineDetails = this.logLine.split('|');
      this.detail =
        lineDetails[3] + ', ' + lineDetails[4] + ', ' + lineDetails[5];
    } else {
      this.detail = this.logLine.substring(
        this.logLine.lastIndexOf('|') + 1,
        this.logLine.length
      );
    }
  }

  private classifyEvent() {
    this.event = this.logLineSplit[1];
  }

  private classifyType() {
    if (apexTags.test(this.event) || this.logLine.includes('__sfdc_trigger')) {
      this.type = 'apex';
    } else if (
      workflowKeywords.test(this.detail) ||
      workflowTags.test(this.event)
    ) {
      this.type = 'workflow';
    } else if (dmlTags.test(this.event)) {
      this.type = 'dml';
    } else if (soqlTags.test(this.event)) {
      this.type = 'soql';
    } else if (this.event === 'LIMIT_USAGE') {
      this.type = 'limit';
      const lineDetails = this.logLine.split('|');
      //this.limitName = lineDetails[3];
      //this.limitCurrent = parseInt(lineDetails[4]);
      //this.limitMax = parseInt(lineDetails[5]);
    } else {
      this.type = 'other';
    }
  }
}
