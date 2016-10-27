(function() {
  'use strict';

  var tinymce = window.tinymce;

  tinymce.PluginManager.requireLangPack('sections');
  tinymce.PluginManager.add('sections', function(editor, pluginUrl) {

    var LAYOUTS = ['6-6', '4-4-4', '3-6-3', '3-9', '4-8', '9-3', '8-4'],

        _ = tinymce.util.I18n.translate,
        _addedCss = false,
        _numbers = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];

    function _insertSection(layout) {
      // jscs:disable requireCamelCaseOrUpperCaseIdentifiers

      var html = ['<div class="row" id="__mcenew">'];

      layout.split('-').forEach(function(number, i) {
        html.push('<div class="' + _numbers[parseInt(number, 10)] + ' columns' + '">column ' + (i + 1) + '</div>');
      });

      html.push('<div class="clear"></div>');
      html.push('</div>');

      editor.insertContent(html.join(''));

      var section = editor.dom.get('__mcenew');
      editor.dom.setAttrib(section, 'id', null);

      while (!editor.dom.is(section.parentNode, 'body')) {
        editor.dom.insertAfter(section, section.parentNode);
      }

      editor.selection.select($(section).find('div')[0]);
    }

    editor.addContextToolbar(
      function(element) {
        if (!editor.getBody().contains(element) || !tinymce.dom.DomQuery(element).hasClass('row')) {
          return false;
        }

        return true;
      },
      'backcolor'
    );

    editor.addButton('sections', {
      type: 'menubutton',
      tooltip: _('Responsive sections'),
      icon: 'none fa fa-pause',
      menu: LAYOUTS.map(function(layout) {
        return {
          classes: 'plugin-sections-section',
          style: 'background-image: url(\'' + pluginUrl + '/resources/' + layout + '.png\')',
          onclick: function() {
            _insertSection(layout);
          }
        };
      })
    });

    editor.on('init', function() {
      var linkElm;

      if (!_addedCss) {
        _addedCss = true;

        var linkElm = editor.dom.create('link', {
          rel: 'stylesheet',
          href: pluginUrl + '/css/sections.css'
        });

        document.getElementsByTagName('head')[0].appendChild(linkElm);
      }
    });
  });

})();
