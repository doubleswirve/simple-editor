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

          scope.highlighted = false;

          $http
            .get('js/templates/highlightable.html')
            .success(function(data){
              tooltipEl = angular.element(data);
              el.parent().append(tooltipEl);
              $compile(tooltipEl)(scope);
            });

          /**
           * Handle highlighting events
           */

          var userSelection, range;

          var tempEl, tempElRect;

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


                range = userSelection.getRangeAt(0).cloneRange();
                range.collapse(false);

                tempEl = document.createElement('span');
                tempEl.id = 'temp-el';
                range.insertNode(tempEl);

                tempElRect = tempEl.getBoundingClientRect();
                tooltipEl.css({ top: tempElRect.top +'px', left: tempElRect.left + 'px' });

                tempEl.parentNode.removeChild(tempEl);
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
