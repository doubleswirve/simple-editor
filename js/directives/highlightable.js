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
           * Obtain highlight tool template
           */

          var tooltipEl;

          var tooltipElHalfWidth
            , tooltipCmd;

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

              tooltipEl.bind('mousedown', function(evt){
                evt.preventDefault();

                tooltipCmd = evt.target.getAttribute('data-cmd');

                if ('bold' === tooltipCmd || 'italic' === tooltipCmd) {
                  document.execCommand(tooltipCmd);
                  scope.save();
                }
              });
            });

          /**
           * Handle highlighting events
           */

          var userSelection, range;

          var tempEl, tempElRect;

          var rect, rectTop, rectRight, rectLeft;

          if (window.getSelection) {
            userSelection = window.getSelection();
          } else if (document.selection) {
            userSelection = document.selection.createRange();
          }

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


                range     = userSelection.getRangeAt(0).cloneRange();
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
