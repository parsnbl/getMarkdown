
// does this need to be a webworker? need to access navigator for the clipboard

let contextMenuItem = {
    "id": "markDone",
    "title": "MarkDone",
    "contexts": ["selection"]
};

chrome.contextMenus.create(contextMenuItem,() => chrome.runtime.lastError); // ignore errors about an existing id

/*
chrome.runtime.onInstalled.addListener(()=>{
    chrome.contextMenus.create(contextMenuItem,() => chrome.runtime.lastError);
}); // ignore errors about an existing id
*/
/* Manifest 2 version
chrome.contextMenus.onClicked.addListener((info, tab) => {
    chrome.tabs.executeScript(tab.id, {
      code: `(${getSelectedHtml})()`,
      frameId: info.frameId,
      matchAboutBlank: true,
      runAt: 'document_start',
    }, data => {
      if (chrome.runtime.lastError) {
        alert('Error: ' + chrome.runtime.lastError.message);
      } else {
        prompt('HTML', data[0]);
      }
    });
  });
  */
 // Manifest 3 version
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  const response = await chrome.tabs.sendMessage(tab.id, {
    type: 'get-html-select',
    target: 'content',
    data: {}
  });
  console.log('Resp', response);
});
 /* Version where content is executed programmatically
 chrome.contextMenus.onClicked.addListener((info, tab) => {
    chrome.scripting.executeScript({
        target: {tabId : tab.id, frameIds : [info.frameId]},
        func: getSelectedHtml,
    }).then((data) => {
        if (chrome.runtime.lastError) {
          console.log('Error: ' + chrome.runtime.lastError.message);
        } else {
          console.log('HTML', data[0]);
        }});
  })
*/

  // this function's code will be executed as a content script in the web page
  function getSelectedHtml() {
    const sel = getSelection();
    let html;
    if (sel.rangeCount) {
      const div = document.createElement('div');
      div.appendChild(sel.getRangeAt(0).cloneContents());
      html = div.innerHTML;
    }
    return html || '';
  }

let headers = {}

let options = {
    method : "GET",
    mode: 'no-cors',
    headers: headers
}


let linkClickData = {
    "editable": false,
    "frameId": 0,
    "linkUrl": "https://developer.chrome.com/docs/extensions/mv3/manifest/version/",
    "menuItemId": "markDone",
    "pageUrl": "https://developer.chrome.com/docs/extensions/mv3/manifest/",
    "selectionText": "version"
}



async function getPageTitle(url) {
    const response = await fetch(url, options);
    let text = await response.text();
    let title = text.match(/<title>(.*)<\/title>/)[1];
    return title;
}

function replaceEncoding(text) {
    //currently just replaces &
    return text.replace(/&amp;/g, '&');
}

function markdownLink(title, url) {
    return `[${title}](${url})`;
}

async function linkHandler(clickData) {
    let url = clickData.linkUrl;
    let title = await getPageTitle(url);
    title = replaceEncoding(title);
    let link = markdownLink (title, url);
    console.log('link', link);
    try {
        navigator.clipboard.writeText(link)
    } catch (err) {
        console.log('err path', err);
    }
}
// When the browser action is clicked, `addToClipboard()` will use an offscreen
// document to write the value of `textToCopy` to the system clipboard.
/*chrome.action.onClicked.addListener(async () => {
    await addToClipboard(textToCopy);
  });
  */
  // Solution 1 - As of Jan 2023, service workers cannot directly interact with
  // the system clipboard using either `navigator.clipboard` or
  // `document.execCommand()`. To work around this, we'll create an offscreen
  // document and pass it the data we want to write to the clipboard.
  async function addToClipboard(value) {
    await chrome.offscreen.createDocument({
      url: 'offscreen.html',
      reasons: [chrome.offscreen.Reason.CLIPBOARD],
      justification: 'Write text to the clipboard.'
    });
  
    // Now that we have an offscreen document, we can dispatch the
    // message.
    chrome.runtime.sendMessage({
      type: 'copy-data-to-clipboard',
      target: 'offscreen-doc',
      data: value
    });
  }
  
  // Solution 2 – Once extension service workers can use the Clipboard API,
  // replace the offscreen document based implementation with something like this.
  async function addToClipboardV2(value) {
    navigator.clipboard.writeText(value);
  }

 