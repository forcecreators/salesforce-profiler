/* eslint-disable prettier/prettier */
/* eslint-disable class-methods-use-this */

import { dialog } from 'electron';
import constants from '../../constants';
import ApexLogMetadata from './ApexLogMetadata';

const { ipcMain } = require('electron');

export default class {
  event: Electron.IpcMainEvent;

  constructor(event: Electron.IpcMainEvent) {
    this.event = event;
  }

  public async open() {
    const result = await dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections'],
    });
    const filePath: string = result.filePaths[0];
    this.event.reply(
      constants.ipc.OPEN_NEW_LOG,
      constants.events.startProcessing(filePath)
    );
    new ApexLogMetadata(filePath)
      .on('progress', (value: number) => {
        this.event.reply(
          constants.ipc.OPEN_NEW_LOG,
          constants.events.progress(value)
        );
      })
      .on('complete', (metadata: ApexLogMetadata) => {
        this.event.reply(
          constants.ipc.OPEN_NEW_LOG,
          constants.events.processingComplete(filePath, metadata)
        );
      })
      .process();
  }
}
