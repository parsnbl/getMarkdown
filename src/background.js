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