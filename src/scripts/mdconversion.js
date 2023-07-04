const test = `<h2>Download</h2>

<p><a href="http://daringfireball.net/projects/downloads/Markdown_1.0.1.zip">Markdown 1.0.1</a> (18 KB) — 17 Dec 2004</p>

<h2>Introduction</h2>

<p>Markdown is a text-to-HTML conversion tool for web writers. Markdown
allows you to write using an easy-to-read, easy-to-write plain text
format, then convert it to structurally valid XHTML (or HTML).</p>

<p>Thus, “Markdown” is two things: (1) a plain text formatting syntax;
and (2) a software tool, written in Perl, that converts the plain text
formatting to HTML. See the <a href="/projects/markdown/syntax">Syntax</a> page for details pertaining to
Markdown’s formatting syntax. You can try it out, right now, using the
online <a href="/projects/markdown/dingus">Dingus</a>.</p>

<p>The overriding design goal for Markdown’s formatting syntax is to make
it as readable as possible. The idea is that a Markdown-formatted
document should be publishable as-is, as plain text, without looking
like it’s been marked up with tags or formatting instructions. While
Markdown’s syntax has been influenced by several existing text-to-HTML
filters, the single biggest source of inspiration for Markdown’s
syntax is the format of plain text email.</p>

<p>The best way to get a feel for Markdown’s formatting syntax is simply
to look at a Markdown-formatted document. For example, you can view
the Markdown source for the article text on this page here:
<a href="http://daringfireball.net/projects/markdown/index.text">http://daringfireball.net/projects/markdown/index.text</a></p>

<p>(You can use this ‘.text’ suffix trick to view the Markdown source for
the content of each of the pages in this section, e.g. the
<a href="/projects/markdown/syntax.text">Syntax</a> and <a href="/projects/markdown/license.text">License</a> pages.)</p>

<p>Markdown is free software, available under a BSD-style open source
license. See the <a href="/projects/markdown/license">License</a> page for more information.</p>

<h2>Discussion List <a id="discussion-list"></a></h2><a id="discussion-list">

</a><p><a id="discussion-list">I’ve set up a public </a><a href="http://six.pairlist.net/mailman/listinfo/markdown-discuss">mailing list for discussion about Markdown</a>.
Any topic related to Markdown — both its formatting syntax and
its software — is fair game for discussion. Anyone who is interested
is welcome to join.</p>

<p>It’s my hope that the mailing list will lead to good ideas for future
improvements to Markdown.</p>`

let h1 = "<h1>Download</h1>"
let h2 = "<h2>Download</h2>"
let h3 = "<h3>Download</h3>"
let h4 = "<h4>Download</h4>"
let h5 = "<h5>Download</h5>"
let h6 = "<h6>Download</h6>"
let link = `<a href="http://six.pairlist.net/mailman/listinfo/markdown-discuss">mailing list for discussion about Markdown</a>`
//headers
h1.replace(/<h1>(.*)<\/h1>/g, '# $1')
h2.replace(/<h2>(.*)<\/h2>/g, '## $1')
h3.replace(/<h3>(.*)<\/h3>/g, '### $1')
h4.replace(/<h4>(.*)<\/h4>/g, '#### $1')
h5.replace(/<h5>(.*)<\/h5>/g, '##### $1')
h6.replace(/<h6>(.*)<\/h6>/g, '###### $1')
//a
link.replace(/<a href="(.+)">(.*)<\/a>/g, '[$2]($1)')

//review and replace using forEach for rulesz

function parseMd(md){
  
    //ul
    md = md.replace(/^\s*\n\*/gm, '<ul>\n*');
    md = md.replace(/^(\*.+)\s*\n([^\*])/gm, '$1\n</ul>\n\n$2');
    md = md.replace(/^\*(.+)/gm, '<li>$1</li>');
    
    //ol
    md = md.replace(/^\s*\n\d\./gm, '<ol>\n1.');
    md = md.replace(/^(\d\..+)\s*\n([^\d\.])/gm, '$1\n</ol>\n\n$2');
    md = md.replace(/^\d\.(.+)/gm, '<li>$1</li>');
    
    //blockquote
    md = md.replace(/^\>(.+)/gm, '<blockquote>$1</blockquote>');
    
    //h
    md = md.replace(/[\#]{6}(.+)/g, '<h6>$1</h6>');
    md = md.replace(/[\#]{5}(.+)/g, '<h5>$1</h5>');
    md = md.replace(/[\#]{4}(.+)/g, '<h4>$1</h4>');
    md = md.replace(/[\#]{3}(.+)/g, '<h3>$1</h3>');
    md = md.replace(/[\#]{2}(.+)/g, '<h2>$1</h2>');
    md = md.replace(/[\#]{1}(.+)/g, '<h1>$1</h1>');
    
    //alt h
    md = md.replace(/^(.+)\n\=+/gm, '<h1>$1</h1>');
    md = md.replace(/^(.+)\n\-+/gm, '<h2>$1</h2>');
    
    //images
    md = md.replace(/\!\[([^\]]+)\]\(([^\)]+)\)/g, '<img src="$2" alt="$1" />');
    
    //links
    md = md.replace(/[\[]{1}([^\]]+)[\]]{1}[\(]{1}([^\)\"]+)(\"(.+)\")?[\)]{1}/g, '<a href="$2" title="$4">$1</a>');
    
    //font styles
    md = md.replace(/[\*\_]{2}([^\*\_]+)[\*\_]{2}/g, '<b>$1</b>');
    md = md.replace(/[\*\_]{1}([^\*\_]+)[\*\_]{1}/g, '<i>$1</i>');
    md = md.replace(/[\~]{2}([^\~]+)[\~]{2}/g, '<del>$1</del>');
    
    //pre
    md = md.replace(/^\s*\n\`\`\`(([^\s]+))?/gm, '<pre class="$2">');
    md = md.replace(/^\`\`\`\s*\n/gm, '</pre>\n\n');
    
    //code
    md = md.replace(/[\`]{1}([^\`]+)[\`]{1}/g, '<code>$1</code>');
    
    //p
    md = md.replace(/^\s*(\n)?(.+)/gm, function(m){
      return  /\<(\/)?(h\d|ul|ol|li|blockquote|pre|img)/.test(m) ? m : '<p>'+m+'</p>';
    });
    
    //strip p from pre
    md = md.replace(/(\<pre.+\>)\s*\n\<p\>(.+)\<\/p\>/gm, '$1$2');
    
    return md;
    
  }
  
  var rawMode = true;
      mdEl = document.getElementById('markdown'),
      outputEl = document.getElementById('output-html'),
      parse = function(){
        outputEl[rawMode ? "innerText" : "innerHTML"] = parseMd(mdEl.innerText);
      };
  
  parse();
  mdEl.addEventListener('keyup', parse, false);
  
  //Raw mode trigger btn
  (function(){
  
    var trigger = document.getElementById('raw-switch'),
        status = trigger.getElementsByTagName('span')[0],
        updateStatus = function(){
          status.innerText = rawMode ? 'On' : 'Off';
        };
  
    updateStatus();
    trigger.addEventListener('click', function(e){
      e.preventDefault();
      rawMode = rawMode ? false : true;
      updateStatus();
      parse();
    }, false);
    
  }());