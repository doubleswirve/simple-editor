/**
 * Highlighting Tools (e.g., bolding, italic, etc.)
 */

editorApp.directive(
  'highlightable', 
  [
    '$compile', 
    '$timeout',
    '$http',
    'rangeUtility',
    function($compile, $timeout, $http, rangeUtility){
      return {
        restrict: 'A',
        link: function(scope, el, attrs){

          /**
           * Element must be editable
           */

          if (undefined === attrs.contenteditable) return;

          /**
           * Shared Selection and Range variables
           */

          var userSelection = rangeUtility.selection
            , range;

          var commonAncestor;

          /**
           * Obtain highlight tool template
           */

          var tooltipEl;

          var tooltipElHalfWidth, tooltipCmd;

          scope.highlighted = false;

          $http
            .get('js/templates/highlightable.html')
            .success(function(data){
              tooltipEl = angular.element(data);
              el.parent().append(tooltipEl);
              $compile(tooltipEl)(scope);

              var tooltipElRect = tooltipEl[0].getBoundingClientRect();

              tooltipElHalfWidth = (tooltipElRect.right - tooltipElRect.left) / 2;

              /**
               * Bind tooltip to mousedown because it gets called
               * before the other events
               */

              var node;

              tooltipEl.bind('mousedown', function(evt){
                evt.preventDefault();

                tooltipCmd = evt.target.getAttribute('data-cmd');

                /*
                if ('bold' === tooltipCmd || 'italic' === tooltipCmd) {
                  document.execCommand(tooltipCmd, false, null);
                } else if ('H2' === tooltipCmd || 'H3' === tooltipCmd) {
                  document.execCommand('formatBlock', false, tooltipCmd);
                }*/

                if ('bold' === tooltipCmd) {
                  var strong = document.createElement('strong');
                  strong.appendChild(range.extractContents());
                  range.insertNode(strong);
                } else if ('italic' === tooltipCmd) {
                  var em = document.createElement('em');
                  em.appendChild(range.extractContents());
                  range.insertNode(em);
                }
                
                scope.save();
              });
            });

          /**
           * Handle highlighting events
           */

          var rect, rectTop, rectRight, rectLeft;

          el.bind('mouseup keyup', function(){

            /**
             * Check to make sure selection has different
             * start and end values (i.e., something was
             * selected, not just a cursor)
             */

            if (!userSelection.isCollapsed) {

              /**
               * Store the current range for reference
               */

              range = userSelection.getRangeAt(0);

              /**
               * Check common ancestor so we don't apply styles
               * across main block level elements (this is another
               * convention ripped from Medium). Maybe this should
               * be altered to allow for multiline pull quotes?
               */

              commonAncestor = range.commonAncestorContainer;

              if (
                commonAncestor.tagName &&
                'DIV' === commonAncestor.tagName.toUpperCase()
              ) {
                return true;
              }

              /**
               * Get range rectange details so we know
               * where to place the tooltip
               */

              rect      = range.getBoundingClientRect();
              rectTop   = rect.top;
              rectRight = rect.right;
              rectLeft  = rect.left;

              /**
               * Use jqLite to establish the tooltip's position and
               * let Angular know to change the tooltip's class
               */

              tooltipEl.css({ 
                top: (rectTop - 70) +'px', 
                left: ((rectRight + rectLeft) / 2 - tooltipElHalfWidth ) + 'px' 
              });

              scope.highlighted = true;

            } else {
              scope.highlighted = false;
            }

            scope.$apply();
          });
          
          /**
           * Remove tooltip if it was shown
           */

          el.bind('blur', function(){
            if (scope.highlighted) {
              scope.highlighted = false;
              scope.$apply();
            }
          });
        }
      };
    }
  ]
);
