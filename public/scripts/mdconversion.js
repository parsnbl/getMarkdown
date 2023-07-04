import {unified} from 'unified'
import rehypeParse from 'rehype-parse'
import rehypeRemark from 'rehype-remark'
import remarkStringify from 'remark-stringify'

import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import remarkGfm from 'remark-gfm'

export function parseMarkdown(file) {
    const output = unified()
        .use(rehypeParse) // Parse HTML to a syntax tree
        .use(rehypeRemark) // Turn HTML syntax tree to markdown syntax tree
        .use(remarkStringify) // Serialize HTML syntax tree
        .processSync(file);
    return output;
}
