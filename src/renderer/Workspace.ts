/* eslint-disable prettier/prettier */
import WorkspaceTab from './WorkspaceTab';

export default class {
  tabs: WorkspaceTab[];

  activeTabId: string | null;

  constructor() {
    this.tabs = [];
  }

  newTab(title: string, logPath: string, metadataPath: string) {
    const tab = new WorkspaceTab(logPath, metadataPath);
    this.tabs[tab.id] = tab;
    this.activeTabId = tab.id;
  }

  setActiveTabId(activeTabId: string | null) {
    this.activeTabId = activeTabId;
  }
}
