/**
 * Contenteditable Directive (mimics Medium.com)
 */

editorApp.directive(
  'contenteditable', 
  [
    '$timeout', 
    'rangeUtility',
    'editorUtility',
    function($timeout, rangeUtility, editorUtility){
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

            var rgx = new RegExp(
              '\\s*<(\\/)?(' + 
              editorUtility.eligibleContainerNodes.join('|') +
              ')>\\s*',
              'gi'
            );

            var val = ngModel.$viewValue || '';

            val = val
              .replace(/&nbsp;/ig, ' ')
              .replace(/<br>/ig, ' ')
              .replace(/\s{2,}/g, ' ')
              .replace(rgx, function(match, p1, p2){
                if (p1) {
                  return '&nbsp;</' + p2 + '>';
                }
                return '<' + p2 + '>';
              })
              .trim();
            el.html(val);

            /**
             * Firefox needs some time to render the view
             */
            
            $timeout(function(){
              firstChild = el[0].firstChild;
            }, 0);
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

          var userSelection = rangeUtility.selection
            , range;

          var parentNode
            , parentOffset
            , parentTextContent;

          var focusNode;

          var keyCode;

          /**
           * Detect certain keyboard events
           */

          el.bind('keydown', function(evt){

            /**
             * Keep reminding Firefox who the first child is
             */

            firstChild = el[0].firstChild;

            keyCode = evt.which;

            /**
             * For now we are only concerned with carriage returns,
             * spaces and backspaces
             */
            
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
             * Obtain an eligible container node
             */

            parentNode = editorUtility.getContainerNode(userSelection);

            parentTextContent = parentNode.textContent;

            /**
             * Obtain selection range to determine offset relative to parent
             */

            range = userSelection.getRangeAt(0);
            parentOffset = rangeUtility.getOffsetRelativeTo(parentNode);

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
             * Mimic Medium's single whitespace policy
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
                
                rangeUtility.setCaret(parentNode, parentOffset + 1);
              }
            }
          });

          /**
           * Remove leading and trailing whitespaces resulting
           * from carriage returns
           */

          el.bind('keyup', function(evt){

            /**
             * Keep reminding firefox who the first child is
             * (see below)
             */

            firstChild = el[0].firstChild;

            if (13 !== keyCode) return true;

            /**
             * Reinitialize `firstChild` because Firefox clones
             * it on carriage returns, so it will otherwise point
             * to the new element
             */

            firstChild = el[0].firstChild;

            /**
             * Perform extra handling if carriage return produces
             * an empty text node
             */

            focusNode = userSelection.focusNode;

            if (3 !== focusNode.nodeType) return true;

            /**
             * Trim the text content (Chrome adds a &nbsp; to the
             * next line)
             */

            var textContent = focusNode.textContent = focusNode.textContent.trim();

            /**
             * Because the text node is empty, we need to grab its
             * parent and iterate over the children, adding a BR tag
             * if one is _not_ already present (Firefox adds a BR tag
             * automatically, sometimes...)
             */

            if ('' !== textContent) return true;

            var parent = focusNode.parentNode
              , child = parent.firstChild
              , hasBr = false;
            
            do {
              if (child.tagName && 'BR' === child.tagName.toUpperCase()) {
                hasBr = true;
                break;
              }
            } while(child = child.nextSibling);

            if (!hasBr) {
              parent.appendChild(document.createElement('br'));
            }

            /**
             * Finally we need to manually set the caret because changing
             * the text content and HTML will mess it up
             */
            
            range = document.createRange();
            range.setStart(parent, 0);
            range.collapse(true);
            userSelection.removeAllRanges();
            userSelection.addRange(range);
          });
        }
      };
    }
  ]
);