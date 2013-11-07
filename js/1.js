/**
 * Create the module
 */

angular.module('editorApp', [])
  .controller('PostCtrl', ['$scope', '$http', function($scope, $http){
    $http
      .get('data/post.json')
      .success(function(data){
        $scope.post = data;
      });

    $scope.save = function(){
      if ($scope.saving) return;

      $scope.saving = true;
      $http
        .post('ajax.php', $scope.post)
        .success(function(data){
          $scope.saving = false;
        });
    };

    $scope.saving = false;
  }])
  .directive('contenteditable', [function(){
    return {
      restrict: 'A',
      require: '?ngModel',
      link: function(scope, el, attrs, ngModel){
        if (!ngModel) return;

        /**
         * Some directives don't need returns (Hed/Dek)
         */
        var ignoreReturn = (undefined !== attrs.ignoreReturn);

        /**
         * Selection object for cursor position/highlighting
         */
        var userSelection;

        if (window.getSelection) {
          userSelection = window.getSelection();
        } else if (document.selection) {
          userSelection = document.selection.createRange();
        }

        ngModel.$render = function(){
          var val = ngModel.$viewValue || '';
          val = val
            .replace(/&nbsp;/g, '')
            .replace(/\s{2,}/g, ' ')
            .replace(/(?:(>)\s+)|(?:\s+(<))/g, function(match, p1, p2){
              return (p1 !== undefined ? p1 : p2);
            });
          el.html(val);
        };

        el.bind('blur keyup change paste', function(){
          scope.$apply(read);
          scope.save();
        });

        el.bind('keypress', function(evt){
          var node   = userSelection.focusNode
            , offset = userSelection.focusOffset
            , text   = userSelection.anchorNode.data
            , html   = userSelection.anchorNode.parentNode.innerHTML;
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
            /**
             * The caret focus was preceded by whitespace
             */
            if (' ' === text[offset - 1]) {
              return evt.preventDefault();
            }
            /**
             * The caret focus is right before a whitespace
             */
            if (' ' === text[offset] || '&nbsp;' === html.slice(offset - 1, offset + 6)) {
              evt.preventDefault();
              /**
               * Still move the caret one space ahead
               */
              userSelection.collapse(node, Math.min(node.length, offset + 1));
            }
          }

        });

        function read(){
          var html = el.html();

          if ('<br>' === html) {
            html = '';
          }
          
          ngModel.$setViewValue(html);
        }
      }
    };
  }]);