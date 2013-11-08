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
       * ngModel render function
       */

      ngModel.$render = function(){
        var val = ngModel.$viewValue || '';
        val = val
          .replace(/&nbsp;/g, ' ')
          .replace(/\s{2,}/g, ' ')
          .replace(/\s*(<\/?p>)\s*/g, function(match, p1){
            return p1;
          })
          .trim();
        el.html(val);
      };

      /**
       * Bind data and save to server
       */

      function read(){
        var html = el.html();

        if ('<br>' === html) {
          html = '';
        }
        
        ngModel.$setViewValue(html);
      }

      el.bind('blur change keyup paste', function(){
        scope.$apply(read);
        scope.save();
      });

      /**
       * Some directives don't need carriage returns (Hed/Dek)
       */
      var ignoreReturn = (undefined !== attrs.ignoreReturn);

      /**
       * Selection object for cursor position/highlighting
       */
      var userSelection;

      var range, preCaretRange;

      var parentNode
        , parentOffset
        , parentTextContent
        , eligibleParentNodes = [
          'H1', 'H2', 'P', 'LI'
        ];

      var focusNode, focusOffset;

      if (window.getSelection) {
        userSelection = window.getSelection();
      } else if (document.selection) {
        userSelection = document.selection.createRange();
      }

      function setCursor(parentNode, parentOffset) {
        parentOffset++;

        var charIndex = 0, nextCharIndex, len, delta;

        var range = document.createRange();
        range.setStart(parentNode, 0);
        range.collapse(true);

        var nodeStack = [parentNode], node;

        while (node = nodeStack.pop()) {
          if (3 === node.nodeType) {
            nextCharIndex = charIndex + node.length;
            if (parentOffset >= charIndex && parentOffset <= nextCharIndex) {
              delta = parentOffset - charIndex;
              range.setStart(node, delta);
              range.setEnd(node, delta);
              break;
            }
            charIndex = nextCharIndex;
          } else {
            len = node.childNodes.length;
            while(len--) {
              nodeStack.push(node.childNodes[len]);
            }
          }
        }

        userSelection.removeAllRanges();
        userSelection.addRange(range);
      }

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
          text = userSelection.anchorNode.data;
          html = userSelection.anchorNode.parentNode.innerHTML;

          /**
           * Obtain the focus node and the caret's relative offset
           */

          focusNode = userSelection.focusNode;
          focusOffset = userSelection.focusOffset;

          /**
           * Obtain an eligible parent node by traversing up while indexOf is -1
           */

          parentNode = userSelection.anchorNode.parentNode;

          while (!~eligibleParentNodes.indexOf(parentNode.tagName.toUpperCase())) {
            parentNode = parentNode.parentNode;
          }

          parentTextContent = parentNode.textContent;

          /**
           * Obtain selection range to determine offset relative to parent
           */

          range = userSelection.getRangeAt(0);
          preCaretRange = range.cloneRange();
          preCaretRange.selectNodeContents(parentNode);
          preCaretRange.setEnd(range.endContainer, range.endOffset);

          parentOffset = preCaretRange.toString().length;


          /**
           * The caret focus was preceded by whitespace or at beginning of parent
           */
          
          if (
            /\s+/g.test(parentTextContent[parentOffset - 1]) ||
            undefined === parentTextContent[parentOffset - 1]
          ) {
            return evt.preventDefault();
          }

          /**
           * The caret focus is right before a whitespace
           */

          if (/\s+/g.test(parentTextContent[parentOffset])) {
            evt.preventDefault();

            /**
             * Still move the caret one space ahead
             */

            setCursor(parentNode, parentOffset);
            /*
            focusOffset++;

            console.log(userSelection);
            console.log(userSelection.focusNode.nextSibling);
            console.log(userSelection.focusNode.parentNode.nextSibling);

            if (focusOffset > focusNode.length) {
              focusOffset = 0;
              if (undefined === focusNode.nextSibling) {
                focusNode = focusNode.parentNode.nextSibling;
              } else {
                focusNode = focusNode.nextSibling;
              }
            }
            userSelection.collapse(focusNode, focusOffset); */
          }
        }
      });
    }
  };
}]);