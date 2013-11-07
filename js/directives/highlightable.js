/**
 * Highlighting Tools (e.g., bolding, italic, etc.)
 */

editorApp.directive('highlightable', [function(){
  return {
    restrict: 'A',
    require: '?ngModel',
    link: function(scope, el, attrs, ngModel){
      if (!ngModel) return;
    }
  };
}]);
