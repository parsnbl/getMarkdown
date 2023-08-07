import { unified } from "unified";
import rehypeRemark from "rehype-remark";
import rehypeParse from "rehype-parse";
import remarkStringify from "remark-stringify";
import remarkGfm from "remark-gfm";


 export function parseToMd(text) {
    const result = unified()
      .use(rehypeParse)
      .use(rehypeRemark)
      .use(remarkGfm)
      .use(remarkStringify)
      .processSync(text);
    return result.value;
  }


  /*
const fs = require('fs');
let contents = fs.readFileSync('/Users/evan/Development/Projects/_chrome-extensions/getMarkdown/tests/Daring Fireball_ Markdown Syntax Documentation.html');
const parseToMd = await import('/Users/evan/Development/Projects/_chrome-extensions/getMarkdown/test2.js')
  */