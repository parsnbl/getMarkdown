/*
chrome.contextMenus.create(
  {
    id: "getMarkdown",
    title: "getMarkdown",
    contexts: ["selection"],
  },
  () => chrome.runtime.lastError,
); // ignore errors about an existing id

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  const response = await chrome.tabs.sendMessage(tab.id, {
    type: "get-html-select",
    target: "content",
    data: {},
  });
  console.log('Resp', response);
});
*/


export default class BackgroundModule {
  constructor() {
    this.setup();
    this.observe();
  }
  setup() {
    chrome.contextMenus.create(
      {
        id: "getMarkdown",
        title: "getMarkdown",
        contexts: ["selection"],
      },
      () => chrome.runtime.lastError,
    ); // ignore errors about an existing id
  }
  async observe() {
    chrome.contextMenus.onClicked.addListener((info, tab) => {
      console.log('context-menu payload','info', info, 'tab', tab);
      this.handleEvent(info, tab);
    
    });
  }

  async handleEvent(info, tab) {
    const response = await chrome.tabs.sendMessage(tab.id, {
      type: "get-html-select",
      target: "content",
      data: {},
    });
    console.log('Resp', response);
  }
}