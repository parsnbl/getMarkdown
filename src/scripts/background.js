chrome.contextMenus.create(
  {
    id: "getMarkdown",
    title: "getMarkdown",
    contexts: ["selection"],
  },
  () => chrome.runtime.lastError,
); // ignore errors about an existing id

chrome.contextMenus.onClicked.addListener(handleMessageContent);

async function handleMessageContent(info, tab) {
  const response = await chrome.tabs.sendMessage(tab.id, {
    type: "get-html-select",
    target: "content",
    data: {},
  });
  let data = response.data;
  // console.log('prefix data',data)
  //fixBareUrls(data);
  //console.log("data", data);
  await chrome.tabs.sendMessage(tab.id, {
    type: "copy-to-clipboard",
    target: "content",
    data: data,
  });
}
