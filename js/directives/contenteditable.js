/**
 * Contenteditable Directive (mimics Medium.com)
 */

editorApp.directive('contenteditable', [function(){
  return {
    restrict: 'A',
    require: '?ngModel',
    link: function(scope, el, attrs, ngModel){
      if (!ngModel) return;
      /**
       * Some directives don't need returns (Hed/Dek)
       */
      var ignoreReturn = (undefined !== attrs.ignoreReturn);

      /**
       * Selection object for cursor position/highlighting
       */
      var userSelection;

      var node, offset, text, html;

      if (window.getSelection) {
        userSelection = window.getSelection();
      } else if (document.selection) {
        userSelection = document.selection.createRange();
      }

      ngModel.$render = function(){
        var val = ngModel.$viewValue || '';
        val = val
          .replace(/&nbsp;/g, '')
          .replace(/\s{2,}/g, ' ')
          .replace(/(?:(>)\s+)|(?:\s+(<))/g, function(match, p1, p2){
            return (p1 !== undefined ? p1 : p2);
          })
          .trim();
        el.html(val);
      };

      function syncAndSave(){
        scope.$apply(read);
        scope.save();
      }

      /**
       * Bind data and save to server
       */

      el.bind('blur change keyup paste', syncAndSave);

      /**
       * Detect certain keyboard events
       */

      el.bind('keypress', function(evt){
        /**
         * Ignore carriage returns if specified by the directive attribute
         */
        if (ignoreReturn && 13 === evt.which) {
          return evt.preventDefault();
        }

        /**
         * Emulate Medium's single whitespace policy
         */
        if (32 === evt.which) {

          offset = userSelection.focusOffset;
          text   = userSelection.anchorNode.data;

          /**
           * The caret focus was preceded by whitespace
           */
          if (' ' === text[offset - 1]) {
            return evt.preventDefault();
          }

          html = userSelection.anchorNode.parentNode.innerHTML

          /**
           * The caret focus is right before a whitespace
           */
          if (' ' === text[offset] || '&nbsp;' === html.slice(offset - 1, offset + 6)) {
            evt.preventDefault();
            /**
             * Still move the caret one space ahead
             */
            node = userSelection.focusNode
            userSelection.collapse(node, Math.min(node.length, offset + 1));
          }
        }

      });

      function read(){
        var html = el.html();

        if ('<br>' === html) {
          html = '';
        }
        
        ngModel.$setViewValue(html);
      }
    }
  };
}]);