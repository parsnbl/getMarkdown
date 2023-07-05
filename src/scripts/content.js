import { unified } from 'unified'
import rehypeRemark from 'rehype-remark'
import rehypeParse from 'rehype-parse'
import remarkStringify from 'remark-stringify'
import remarkGfm from 'remark-gfm'

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    
    if (request.target === 'content' && request.type === 'get-html-select') {
        let output = getSelectedHtml();
        output = convertRelativeURLsToAbsolute(output, document.URL)
        output = parseToMd(output)
        const msg = {
            type: 'send-html-select',
            target:'background',
            data: output
        }
        sendResponse(msg);
        //debug
        /*
        sendResponse({
            type: 'debug',
            target: 'background',
            data: {
                request: request,
                sender: sender
            }
        });
        */
    }
});


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

function parseToMd(text) {
    const result = unified()
        .use(rehypeParse)
        .use(rehypeRemark)
        .use(remarkGfm)
        .use(remarkStringify)
        .processSync(text);
    return result.value;
}

function convertRelativeURLsToAbsolute(htmlString, currentURL) {
    return htmlString.replaceAll(/href="(?!https:\/\/|http:\/\/)(.*)"/gi, "href="+currentURL+'$1"' )
}