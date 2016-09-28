(function() {
  'use strict';

  var tinymce = window.tinymce;

  tinymce.PluginManager.requireLangPack('cover');
  tinymce.PluginManager.add('cover', function(editor) {

    var _ = tinymce.util.I18n.translate;

    function _openWindow() {
      var pSelected = editor.selection.getNode(),
          classes = 'mceNonEditable mceCover',
          data = {
            src: '',
            height: 300
          };

      editor.filePickerParams = {
        isPostContentFullWidthImage: true
      };

      if (!pSelected || pSelected.nodeName.toLowerCase() != 'p' || pSelected.getAttribute('class') != classes) {
        pSelected = null;
      }

      if (pSelected) {
        var styles = (pSelected.getAttribute('style') || '').split(';');

        styles.forEach(function(style) {
          style = style.split(':');

          if (!style || style.length < 2) {
            return;
          }

          if (style[0].trim() == 'background-image') {
            data.src = style[1]
              .replace('url(\'', '')
              .replace('\')', '')
              .trim();
          }

          if (style[0].trim() == 'height') {
            data.height = parseInt(style[1], 10);
          }
        });
      }

      var win = editor.windowManager.open({
        title: _('Insert/Edit Full width image'),
        data: data,
        body: [{
          name: 'src',
          type: 'filepicker',
          filetype: 'image',
          label: _('Source'),
          autofocus: true
        }, {
          label: _('Height'),
          name: 'height',
          type: 'textbox'
        }],
        onClose: function() {
          editor.filePickerParams = null;
        },
        onSubmit: function() {
          editor.filePickerParams = null;

          var data = win.toJSON(),
              src = data.src;

          delete data.src;

          data.height = parseInt(data.height, 10) || 300;

          var p = null;

          editor.focus();

          if (pSelected) {
            p = pSelected;
          }
          else {
            data.id = '__mcenew';
            editor.selection.setContent(editor.dom.createHTML('p', data));

            var p = editor.dom.get(data.id);
            editor.dom.setAttrib(p, 'id', null);

            while (!editor.dom.is(p.parentNode, 'body')) {
              editor.dom.insertAfter(p, p.parentNode);
            }

            p.innerHTML = '&nbsp;';

            editor.dom.setAttribs(p, {
              contenteditable: false,
              'class': classes
            });
          }

          editor.dom.setAttribs(p, {
            style: [
              'background-image: url(\'' + src + '\');',
              'height: ' + data.height + 'px;'
            ].join(' ')
          });

          editor.nodeChanged();
          editor.selection.select(p);

          editor.fire('updateWinChartCount', {
            feature: 'wikiAddFullWidthImage'
          });

          win.close();
        }
      });
    }

    editor.addButton('cover', {
      icon: 'none fa fa-ticket',
      tooltip: _('Insert/Edit Full width image'),
      stateSelector: 'p[class="mceNonEditable mceCover"]',
      onclick: _openWindow
    });

  });

})();
