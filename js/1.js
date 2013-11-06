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

        var ignoreReturn = (undefined !== attrs.ignoreReturn)
          , prevWasSpace = false;

        ngModel.$render = function(){
          el.html(ngModel.$viewValue || '');
        };

        el.bind('blur keyup change paste', function(evt){
          scope.$apply(read);
          scope.save();
        });

        el.bind('keypress', function(evt){
          /**
           * Ignore carriage returns if specified by the directive attribute
           */
          if (ignoreReturn && 13 === evt.which) {
            return evt.preventDefault();
          }

          if (32 === evt.which) {
            if (prevWasSpace) {
              return evt.preventDefault();
            }
            prevWasSpace = true;
          } else {
            prevWasSpace = false;
          }
        });

        function read(){
          var html = el.html().replace(/(?:&nbsp;)+/g, '');

          if ('<br>' === html) {
            html = '';
          }
          
          ngModel.$setViewValue(html);
        }
      }
    };
  }]);