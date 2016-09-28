(function() {
  'use strict';

  var tinymce = window.tinymce;

  tinymce.PluginManager.requireLangPack('templates');
  tinymce.PluginManager.add('templates', function(editor) {

    var _ = tinymce.util.I18n.translate,
        _messageTemplate = [
          '<table id="__mcenew" class="text-templates {{cls}} mce-item-table" width="100%" border="0" cellpadding="0" cellspacing="0">',
            '<tbody>',
              '<tr>',
                '<td>',
                  '<span contenteditable="false" class="mceNonEditable fa {{icon}} text-templates-icon" style="{{style}}">&nbsp;</span>',
                  '<p class="text-templates-content">﻿{{message}}</p>',
                '</td>',
              '</tr>',
            '</tbody>',
          '</table>'
        ].join('');

    function _insertMessageTemplate(cls, icon, message) {
      // jscs:disable requireCamelCaseOrUpperCaseIdentifiers

      var fontSize = editor.settings.fontsize_formats_fontawesome_default || '1.7rem',
          letterSpacing = editor.settings.fontsize_formats_fontawesome_letter_spacing,
          styles = ['font-size: ' + fontSize];

      if (letterSpacing && letterSpacing[fontSize]) {
        styles.push('letter-spacing: ' + letterSpacing[fontSize]);
      }

      editor.insertContent(
        _messageTemplate
          .replace(/\{\{cls\}\}/g, cls)
          .replace(/\{\{icon\}\}/g, icon)
          .replace(/\{\{message\}\}/g, message)
          .replace(/\{\{style\}\}/g, styles.join(';'))
      );

      var template = editor.dom.get('__mcenew');
      editor.dom.setAttrib(template, 'id', null);

      while (!editor.dom.is(template.parentNode, 'body')) {
        editor.dom.insertAfter(template, template.parentNode);
      }

      editor.selection.select($(template).find('.text-templates-content')[0]);

      editor.fire('updateWinChartCount', {
        feature: 'wikiAddTemplates'
      });
    }

    editor.addButton('templates', {
      type: 'menubutton',
      text: _('Templates'),
      icon: 'none fa fa-bullhorn',
      menu: [{
        text: _('Information'),
        icon: 'none fa fa-info-circle',
        onclick: function() {
          _insertMessageTemplate('text-templates-info', 'fa-info-circle', _('Your message'));
        }
      }, {
        text: _('Success'),
        icon: 'none fa fa-check-circle',
        onclick: function() {
          _insertMessageTemplate('text-templates-success', 'fa-check-circle', _('Your success message'));
        }
      }, {
        text: _('Warning'),
        icon: 'none fa fa-exclamation-triangle',
        onclick: function() {
          _insertMessageTemplate('text-templates-warning', 'fa-exclamation-triangle', _('Your warning message'));
        }
      }, {
        text: _('Alert'),
        icon: 'none fa fa-exclamation-circle',
        onclick: function() {
          _insertMessageTemplate('text-templates-alert', 'fa-exclamation-circle', _('Your alert message'));
        }
      }]
    });

  });

})();
