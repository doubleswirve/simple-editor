/**
 * Highlighting Tools (e.g., bolding, italic, etc.)
 */

editorApp.directive(
  'highlightable', 
  [
    '$compile', 
    '$timeout',
    '$http',
    function($compile, $timeout, $http){
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

          var userSelection = window.getSelection()
            , range;

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

                var range = userSelection.getRangeAt(0);

                if ('bold' === tooltipCmd) {
                  node = document.createElement('strong');
                  node.appendChild(range.extractContents());
                  range.insertNode(node);
                } else if ('italic' === tooltipCmd) {
                  node = document.createElement('em');
                  node.appendChild(range.extractContents());
                  range.insertNode(node);
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
             * Use timeout for edge case when user clicks on
             * selection (it appears as Range at first although
             * really a Caret)
             */

            $timeout(function(){
              if ('Range' === userSelection.type) {
                scope.highlighted = true;
                scope.$apply();


                range     = userSelection.getRangeAt(0);
                rect      = range.getBoundingClientRect();
                rectTop   = rect.top;
                rectRight = rect.right;
                rectLeft  = rect.left;
                
                range.collapse(false);

                tooltipEl.css({ 
                  top: (rectTop - 70) +'px', 
                  left: ((rectRight + rectLeft) / 2 - tooltipElHalfWidth ) + 'px' 
                });
              } else {
                scope.highlighted = false;
                scope.$apply();
              }
            });
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
