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
       * Grab the first child so it cannot be deleted
       */

      var firstChild;

      /**
       * ngModel render function
       */

      ngModel.$render = function(){
        var val = ngModel.$viewValue || '';
        val = val
          .replace(/&nbsp;/g, ' ')
          .replace(/\s{2,}/g, ' ')
          .trim();
        el.html(val);

        firstChild = el[0].firstChild;
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

      var userSelection = window.getSelection()
        , range
        , preCaretRange;

      var parentNode
        , parentOffset
        , parentTextContent
        , eligibleParentNodes = [
          'H1', 'H2', 'P', 'LI'
        ];

      var focusNode, focusOffset;

      var keyCode;

      function setCursor(parentNode, parentOffset) {
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

      el.bind('keydown', function(evt){

        keyCode = evt.which;

        // TODO: maybe do an array check like below
        if (
          keyCode !== 13 &&
          keyCode !== 8 &&
          keyCode !== 32
        ) {
          return true;
        }

        /**
         * Ignore carriage returns if specified by the directive attribute
         */

        if (ignoreReturn && 13 === keyCode) {
          return evt.preventDefault();
        }

        /**
         * Obtain the focus node and the caret's relative offset
         */

        focusNode = userSelection.focusNode;
        focusOffset = userSelection.focusOffset;

        /**
         * Obtain an eligible parent node by traversing up while indexOf is -1
         */

        if (3 !== userSelection.anchorNode.nodeType) {
          parentNode = focusNode;
        } else{
          parentNode = userSelection.anchorNode.parentNode;

          while (!~eligibleParentNodes.indexOf(parentNode.tagName.toUpperCase())) {
            parentNode = parentNode.parentNode;
          }
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
         * Prevent backspace from deleting the first child node (e.g., We don't want
         * to delete the first P tag, because I don't think we're planning on having
         * a P tag button in the tooltip)
         */

        if (
          8 === keyCode &&
          !parentOffset &&
          parentNode === firstChild
        ) {
          return evt.preventDefault();
        }

        /**
         * Emulate Medium's single whitespace policy
         */

        if (32 === keyCode) {

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

          if (
            /\s+/g.test(parentTextContent[parentOffset]) &&
            parentOffset + 1 < parentTextContent.length
          ) {
            evt.preventDefault();

            /**
             * Still move the caret one space ahead
             */
            
            setCursor(parentNode, parentOffset + 1);
          }
        }
      });
    }
  };
}]);