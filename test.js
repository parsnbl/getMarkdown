import { unified } from "unified";
import rehypeRemark from "rehype-remark";
import rehypeParse from "rehype-parse";
import remarkStringify from "remark-stringify";
-gfm";

function parseToMd(text) {
  const result = unified()
    .use(rehypeParse)
    .use(rehypeRemark)

    .use(remarkStringify)
    .processSync(text);
  return result.value;
}

// Need to redo this to deal with bare URLs that are < >

async function fixBareUrls(mdText) {
  const urlPatt = /\[(.*)\]\((.*)\)/;
  const urls = mdText.match(new RegExp(urlPatt, "ig"));
  const cache = {};
  for (let i = 0; i < urls.length; i++) {
    const elem = urls[i];
    let vals = elem.match(new RegExp(urlPatt, "i"));
    let linkText = vals[1];
    let targetUrl = vals[2];
    if (!Object.hasOwn(cache, elem)) {
      if (linkText === targetUrl) {
        let title = await getPageTitle(targetUrl);
        if (title !== -1) {
          cache[elem] = `[${title}](${targetUrl})`;
        }
      }
    }
  }
  const finalRe = new RegExp(Object.keys(cache).join("|"), "gi");
  mdText = mdText.replace(finalRe, function (matched) {
    return cache[matched];
  });
}

async function getPageTitle(url) {
  const response = await fetch(url, {
    method: "GET",
    mode: "no-cors",
    headers: {},
  });
  if (!response.ok) {
    return -1;
  }
  let text = await response.text();
  let title = text.match(/<title>(.*)<\/title>/)[1];
  title = replaceEncoding(title);
  return title;
}

function replaceEncoding(text) {
  //currently just replaces &
  return text.replace(/&amp;/g, "&");
}

let examplePreParse = `<p>I see lots of suggested edits where a bare URL like <a href="http://www.example.org/" rel="nofollow noreferrer">http://www.example.org/</a> is replaced with text and a link like <a href="http://www.example.org/" rel="nofollow noreferrer">Example</a>.</p>

  <p>I personally don't find this necessary for simple URLs, and I actually like being able to plainly see where I'm going to be directed to by a link.  I realize that good browsers will assist me in knowing where the link will take me before I click it.  But I don't feel the need to obscure every URL behind link text, particularly if the link text is non-descriptive.</p>
  
  <p>For some longer, more cryptic or minified URLs, it helps if it's replaced with descriptive link text like <a href="http://www.example.org/unreadable/8fd1a07c85042d0a?a=1&amp;b=2" rel="nofollow noreferrer">example code at ExampleHub</a>.  But when reviewing edits, I'm very sensitive to whether or not the link text is an improvement over the bare URL.  Sometimes a great URL like <a href="http://www.example.org/how-to-do-something" rel="nofollow noreferrer">http://www.example.org/how-to-do-something</a> gets replaced with a link with poor text like just "<a href="http://www.example.org/how-to-do-something" rel="nofollow noreferrer">link</a>" or "<a href="http://www.example.org/how-to-do-something" rel="nofollow noreferrer">example.org</a>".</p>
  background.js-200a29fd.js:1 data <p>I see lots of suggested edits where a bare URL like <a href="http://www.example.org/" rel="nofollow noreferrer">http://www.example.org/</a> is replaced with text and a link like <a href="http://www.example.org/" rel="nofollow noreferrer">Example</a>.</p>
  
  <p>I personally don't find this necessary for simple URLs, and I actually like being able to plainly see where I'm going to be directed to by a link.  I realize that good browsers will assist me in knowing where the link will take me before I click it.  But I don't feel the need to obscure every URL behind link text, particularly if the link text is non-descriptive.</p>
  
  <p>For some longer, more cryptic or minified URLs, it helps if it's replaced with descriptive link text like <a href="http://www.example.org/unreadable/8fd1a07c85042d0a?a=1&amp;b=2" rel="nofollow noreferrer">example code at ExampleHub</a>.  But when reviewing edits, I'm very sensitive to whether or not the link text is an improvement over the bare URL.  Sometimes a great URL like <a href="http://www.example.org/how-to-do-something" rel="nofollow noreferrer">http://www.example.org/how-to-do-something</a> gets replaced with a link with poor text like just "<a href="http://www.example.org/how-to-do-something" rel="nofollow noreferrer">link</a>" or "<a href="http://www.example.org/how-to-do-something" rel="nofollow noreferrer">example.org</a>".</p>`;

let examplePostParse = `I see lots of suggested edits where a bare URL like <http://www.example.org/> is replaced with text and a link like [Example](http://www.example.org/).

  I personally don't find this necessary for simple URLs, and I actually like being able to plainly see where I'm going to be directed to by a link. I realize that good browsers will assist me in knowing where the link will take me before I click it. But I don't feel the need to obscure every URL behind link text, particularly if the link text is non-descriptive.
  
  For some longer, more cryptic or minified URLs, it helps if it's replaced with descriptive link text like [example code at ExampleHub](http://www.example.org/unreadable/8fd1a07c85042d0a?a=1\&b=2). But when reviewing edits, I'm very sensitive to whether or not the link text is an improvement over the bare URL. Sometimes a great URL like <http://www.example.org/how-to-do-something> gets replaced with a link with poor text like just "[link](http://www.example.org/how-to-do-something)" or "[example.org](http://www.example.org/how-to-do-something)".
  
  `;
let bareUrl = `<a href="http://www.example.org/" rel="nofollow noreferrer">http://www.example.org/</a>`;

console.log(parseToMd(bareUrl));
