/**
 * Highlighting Tools (e.g., bolding, italic, etc.)
 */

editorApp.directive('highlightable', ['$compile', '$timeout', function($compile, $timeout){
  return {
    restrict: 'A',
    link: function(scope, el, attrs){
      scope.highlighted = false;
      var tooltip = angular.element('<div ng-show="highlighted">Highlight Tools</div>');
      el.parent().append(tooltip);
      $compile(tooltip)(scope);

      var userSelection, range;

      var tempEl;

      if (window.getSelection) {
        userSelection = window.getSelection();
      } else if (document.selection) {
        userSelection = document.selection.createRange();
      }

      el.bind('mouseup keyup', function(){
        $timeout(function(){
          if ('Range' === userSelection.type) {
            scope.highlighted = true;
            scope.$apply();


            range = userSelection.getRangeAt(0).cloneRange();
            range.collapse(false);

            tempEl = document.createElement('span');
            tempEl.id = 'temp-el';
            range.insertNode(tempEl);
            tempEl.parentNode.removeChild(tempEl);
            setTimeout(function(){

            }, 5000);
          } else {
            scope.highlighted = false;
            scope.$apply();
          }
        });
      });
      
      el.bind('blur', function(){
        if (scope.highlighted) {
          scope.highlighted = false;
          scope.$apply();
        }
      });
    }
  };
}]);
