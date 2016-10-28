(function() {
  'use strict';

  window.Ractive.controllerInjection('texteditor', [
    '$i18nService', '$component', '$data', '$done',
  function texteditorController($i18nService, $component, $data, $done) {

    var HEADERS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
        CLEAN_KEEP_TAGS = [
          'a', 'i', 'p', 'br', 'img', 'label', 'ul', 'ol', 'li', 'code', 'pre', 'strong', 'b', 'em',
          'hr', 'h1', 'h2', 'h3', 'h4', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'blockquote', 'span'
        ];

    require('/public/vendor/tinymce/tinymce.js').then(function() {
      return require('/public/dropzone/dropzone.css');
    }).then(function() {
      return require('/public/vendor/prism.css');
    }).then(function() {
      return require('/public/texteditor/prism-plugins/prism-line-numbers.css');
    }).then(function() {
      return require('/public/vendor/tinymce/skins/texteditor/skin.min.css');
    }).then(function() {
      return require('/public/vendor/dropzone.js');
    })
    .then(function() {
      // jscs:disable requireCamelCaseOrUpperCaseIdentifiers

      window.Dropzone.autoDiscover = false;

      var Texteditor = $component({
            data: $.extend(true, {
              id: Math.floor(Math.random() * 1000000)
            }, $data || {}),

            content: function() {
              if (!this.editor) {
                return '';
              }

              return this.editor
                .getContent({
                  format: 'raw'
                })
                .replace(/contenteditable="true"/g, '')
                .trim();
            }
          }),
          _$el = {
            editor: $(Texteditor.el).find('.editor'),
            dropzoneTemplate: $(Texteditor.el).find('.dropzone-template'),
            dropzoneContentTemplate: $(Texteditor.el).find('.dropzone-content-template')
          },
          _selectorId = '#' + _$el.editor.attr('id'),
          _focused = false,
          _dataPlugins = $data && $data.plugins || '',
          _toolbar = [
            'undo redo | image cover media table sections templates | pagebreak hr charmap blockquote codesample fontawesome',
            [
              'bold italic underline strikethrough | forecolor backcolor',
              ' | alignleft aligncenter alignright | bullist numlist outdent indent',
              ' | formatselect link unlink | removeformat'
            ].join('')
          ];

      if ($data.toolbarremove) {
        $data.toolbarremove = $data.toolbarremove.replace(/[\s]+/g, '|');

        for (var i = 0; i < _toolbar.length; i++) {
          _toolbar[i] = _toolbar[i].replace(new RegExp('[^a-z0-1](' + $data.toolbarremove + ')[^a-z0-1]', 'gi'), ' ');
        }
      }

      for (var i = 0; i < _toolbar.length; i++) {
        _toolbar[i] = _toolbar[i].replace(/\s+/g, ' ');
      }

      if ($data.toolbaradd) {
        $data.toolbaradd = $data.toolbaradd.split(' ');

        for (var i = 0; i < $data.toolbaradd.length; i++) {
          var add = $data.toolbaradd[i].split('=');
          add[1] = add[1].split(':');

          add = {
            name: add[0],
            toolbarIndex: add[1][0],
            beforeIndex: add[1][1]
          };

          if (_toolbar[add.toolbarIndex]) {
            _toolbar[add.toolbarIndex] = _toolbar[add.toolbarIndex].split(' ');

            _toolbar[add.toolbarIndex].splice(add.beforeIndex, 0, add.name);

            _toolbar[add.toolbarIndex] = _toolbar[add.toolbarIndex].join(' ');
          }
        }
      }

      window.tinymce.init($.extend(true, {
        selector: _selectorId,
        skin: 'texteditor',
        content_css: [
          '/public/vendor/prism.css',
          '/public/vendor/plumes/plumes/plumes-icons.css',
          '/public/texteditor/texteditor-content.css'
        ],
        menubar: false,
        statusbar: false,
        relative_urls: false,
        convert_fonts_to_spans: true,
        paste_auto_cleanup_on_paste: true,
        toolbar_items_size: 'small',
        block_formats: 'HEADER 1=h1;HEADER 2=h2;HEADER 3=h3;HEADER 4=h4;PARAGRAPH=p',
        browser_spellcheck: true,
        paste_data_images: false,
        fontsize_formats: '1.7rem 2rem 2.5rem 3rem 4rem 5rem 6rem 7rem 8rem 9rem 10rem',
        fontsize_formats_fontawesome_default: '1.7rem',
        fontsize_formats_fontawesome_letter_spacing: {
          '1.7rem': '-0.2rem',
          '2rem': '-0.3rem',
          '2.5rem': '-0.3rem',
          '3rem': '-0.4rem',
          '4rem': '-0.5rem',
          '5rem': '-0.6rem',
          '6rem': '-0.8rem',
          '7rem': '-0.9rem',
          '8rem': '-1rem',
          '9rem': '-1.1rem',
          '10rem': '-1.3rem'
        },
        plugins: [
          'autoresize anchor hr paste link lists table image codesample prismlinenumbers sections templates',
          'charmap textcolor colorpicker media fontawesome noneditable cover pagebreak',
          _dataPlugins
        ].join(' '),
        extended_valid_elements: [
          'p[style|class]',
          'span[style|class]'
        ].join(','),
        table_appearance_options: false,
        table_advtab: false,
        table_cell_advtab: false,
        table_row_advtab: false,
        table_default_attributes: {
          border: 0,
          cellpadding: 0,
          cellspacing: 0
        },
        table_default_styles: {
          'margin-left': 'auto',
          'margin-right': 'auto'
        },
        table_class_list: [
          {title: 'Default', value: ''},
          {title: 'Default [Top header]', value: 'text-table-default-header'},
          {title: 'Default [Top/Left headers]', value: 'text-table-default-2-headers'},
          {title: 'Spreadsheet', value: 'text-table-grid'},
          {title: 'Spreadsheet [Top header]', value: 'text-table-grid-header'},
          {title: 'Spreadsheet [Top/Left headers]', value: 'text-table-grid-2-headers'},
          {title: 'Rectangle', value: 'text-table-rectangle'},
          {title: 'No style', value: 'text-table-no-style'}
        ],
        forecolor_cols: 7,
        forecolor_rows: 1,
        forecolor_map: [
          'ffffff', $i18nService._('White'),
          '333333', $i18nService._('Black'),
          'ff6600', $i18nService._('Orange'),
          '4CAF50', $i18nService._('Green'),
          'F44336', $i18nService._('Red'),
          '2196F3', $i18nService._('Blue')
        ],
        backcolor_cols: 6,
        backcolor_rows: 1,
        backcolor_map: [
          'FFF59D', $i18nService._('Yellow'),
          'FFD7E5', $i18nService._('Pink'),
          '64FFDA', $i18nService._('Green'),
          '84FFFF', $i18nService._('Blue'),
          'FFD180', $i18nService._('Orange')
        ],
        toolbar: _toolbar,

        file_picker_callback: function(callback) {
          var win = Texteditor.editor.windowManager.open({
            title: $i18nService._('File upload'),
            html: _$el.dropzoneTemplate.html(),
            width: 350,
            height: 200,
            buttons: [{
              text: $i18nService._('Cancel'),
              onclick: 'close'
            }]
          });

          var dropzone = new window.Dropzone('#' + win._id + ' .dropzone', {
            url: '/api/media',
            previewTemplate: _$el.dropzoneContentTemplate.html(),
            parallelUploads: 2,
            thumbnailHeight: 120,
            thumbnailWidth: 120,
            maxFilesize: 3,
            filesizeBase: 1000,
            maxFiles: 1,
            params: Texteditor.editor.filePickerParams || null
          });

          dropzone.on('success', function(file, res) {
            if (file && res && res.url) {
              setTimeout(function() {
                win.close();

                res = $.extend({
                  alt: res.name
                }, res);

                Texteditor.editor.filePickerResults = res;

                callback(res.url, res);
              }, 2000);
            }
          });
        },

        paste_preprocess: function(plugin, args) {
          args.content = _cleanCopyTags(args.content);
        },

        setup: function(editor) {
          Texteditor.editor = editor;
        }
      }, $data.config));

      function _addPlaceholder() {
        var placeholder = Texteditor.get('placeholder');

        if (placeholder) {
          Texteditor.set('isPlaceholder', true);
          Texteditor.editor.setContent('<!--placeholder--><p style="color: #aaa">' + placeholder + '</p>');
        }
      }

      function _cleanCopyTags(content) {
        content = content
          .replace(/id\=\"(.*?)\"/g, '')
          .replace(/data-id\=\"(.*?)\"/g, '')
          .replace(/(<.*?>)/gi, function(tag) {
            var match = tag.match(/^<\/?([\w-]+)/);

            return match && match.length > 1 && CLEAN_KEEP_TAGS.indexOf(match[1]) < 0 ? '' : tag;
          });

        return content;
      }

      function _removePlaceholder() {
        if (Texteditor.get('isPlaceholder')) {
          var content = Texteditor.content();
          if (content.indexOf('<!--placeholder-->') === 0) {
            Texteditor.editor.setContent('');
          }
          Texteditor.set('isPlaceholder', false);
        }
      }

      function _onFocus() {
        _focused = true;
        _removePlaceholder();
      }

      function _onBlur() {
        _focused = false;
        Texteditor.set('isPlaceholder', false);

        if (!Texteditor.content()) {
          _addPlaceholder();
        }
        else {
          _removePlaceholder();
        }
      }

      function _onChange(event) {
        var content = Texteditor.content();

        if (!_focused && !content) {
          _addPlaceholder();
        }
        else if (content.indexOf('<!--placeholder-->') !== 0) {
          _removePlaceholder();

          if (content) {
            var elements = [];
            if (event.element) {
              elements.push(event.element);
            }
            if (event.parents && event.parents.length > 1) {
              elements.push(event.parents[1]);
            }

            if (elements.length) {
              elements.forEach(function(element) {
                var $element = $(element),
                    id = $element.attr('data-id'),
                    emojiId = $element.attr('data-emoji'),
                    $doc = $(Texteditor.editor.dom.doc);

                if (emojiId) {
                  var $elements = $doc.find('[data-emoji="' + emojiId + '"]'),
                      elementsLength = $elements.length;

                  if (elementsLength > 1) {
                    $elements.each(function() {
                      if ($(this).parent().attr('data-mce-bogus') == 'all') {
                        elementsLength--;
                      }
                    });
                  }

                  if (elementsLength > 1) {
                    $element.removeAttr('data-emoji');
                  }
                }

                if (HEADERS.indexOf($element.prop('tagName').toLowerCase()) > -1) {
                  if (id) {
                    if ($doc.find(HEADERS.join('[data-id="' + id + '"], ') + '[data-id="' + id + '"]').length > 1) {
                      id = null;
                    }
                  }

                  if (!id) {
                    $element.attr('data-id', new Date().getTime().toString());
                  }
                }
                else if (id) {
                  $element.removeAttr('data-id');
                }
              });
            }
          }
        }

        Texteditor.fire('content', {
          content: content,
          element: event && event.element || null
        });
      }

      function _getTextNodes(node, nodeType, result) {
        var children = node.childNodes,
            nodeType = nodeType ? nodeType : 3,
            result = !result ? [] : result;

        if (node.nodeType == nodeType) {
          result.push(node);
        }

        for (var i = 0; i < children.length; i++) {
          result = _getTextNodes(children[i], nodeType, result);
        }

        return result;
      }

      function _initEditor() {
        Texteditor.editor.on('focus', _onFocus);
        Texteditor.editor.on('blur', _onBlur);
        Texteditor.editor.on('change NodeChange', _onChange);
        Texteditor.editor.on('keydown keyup', function() {
          Texteditor.editor.nodeChanged();
        });

        _onBlur();

        $done();
      }

      Texteditor.focusEnd = function() {
        Texteditor.editor.focus();

        var textnodes = _getTextNodes(Texteditor.editor.getBody().lastChild);
        if (textnodes && textnodes.length) {
          Texteditor.editor.selection.setCursorLocation(textnodes[textnodes.length - 1], textnodes[textnodes.length - 1].textContent.length);
        }
        else {
          Texteditor.editor.selection.setCursorLocation(null, 0);
        }
      };

      function _waitingEditior() {
        if (!Texteditor.editor) {
          setTimeout(_waitingEditior, 10);
        }
        else if (Texteditor.editor.initialized) {
          _initEditor();
        }
        else {
          Texteditor.editor.on('init', _initEditor);
        }
      }

      _waitingEditior();
    });

  }]);
})();
