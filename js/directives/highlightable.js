/**
 * Highlighting Tools (e.g., bolding, italic, etc.)
 */

editorApp.directive('highlightable', [function(){
  return {
    restrict: 'A',
    require: '?ngModel',
    transclude: true,
    templateUrl: 'js/templates/highlightable.html',
    link: function(scope, el, attrs, ngModel){
      if (!ngModel) return;

      var userSelection, range;

      var tempEl;

      if (window.getSelection) {
        userSelection = window.getSelection();
      } else if (document.selection) {
        userSelection = document.selection.createRange();
      }

      el.bind('mouseup keyup', function(){
        if ('Range' === userSelection.type) {
          range = userSelection.getRangeAt(0).cloneRange();
          range.collapse(false);

          tempEl = document.createElement('span');
          tempEl.id = 'temp-el';
          range.insertNode(tempEl);
          tempEl.parentNode.removeChild(tempEl);
          setTimeout(function(){

          }, 5000);
        }
      });
    }
  };
}]);
