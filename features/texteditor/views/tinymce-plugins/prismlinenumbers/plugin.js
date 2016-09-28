window.tinymce.PluginManager.add('prismlinenumbers', function(editor, pluginUrl) {
  'use strict';

  if (!window.tinyMCE.codesampleplugin || !window.tinyMCE.codesampleplugin.Prism) {
    return;
  }

  var Prism = window.tinyMCE.codesampleplugin.Prism;

  function loadCss() {
    editor.getDoc().getElementsByTagName('head')[0].appendChild(editor.dom.create('link', {
      rel: 'stylesheet',
      href: pluginUrl + '/css/prismlinenumbers.css'
    }));
  }

  editor.on('init', loadCss);

  Prism.hooks.add('complete', function(env) {
    if (!env.code) {
      return;
    }

    // works only for <code> wrapped inside <pre> (not inline)
    var pre = env.element;
    var clsReg = /\s*\bline-numbers\b\s*/;
    if (!pre || !/pre/i.test(pre.nodeName)) {
      return;
    }

    if (env.element.querySelector('.line-numbers-rows')) {
      // Abort if line numbers already exists
      return;
    }

    if (clsReg.test(env.element.className)) {
      // Remove the class "line-numbers" from the <code>
      env.element.className = env.element.className.replace(clsReg, '');
    }
    if (!clsReg.test(pre.className)) {
      // Add the class "line-numbers" to the <pre>
      pre.className += ' line-numbers';
    }

    var match = env.code.match(/\n(?!$)/g);
    var linesNum = match ? match.length + 1 : 1;
    var lineNumbersWrapper;

    var lines = new Array(linesNum + 1);
    lines = lines.join('<span></span>');

    lineNumbersWrapper = document.createElement('span');
    lineNumbersWrapper.className = 'line-numbers-rows';
    lineNumbersWrapper.innerHTML = lines;

    if (pre.hasAttribute('data-start')) {
      pre.style.counterReset = 'linenumber ' + (parseInt(pre.getAttribute('data-start'), 10) - 1);
    }

    env.element.appendChild(lineNumbersWrapper);

  });
});
