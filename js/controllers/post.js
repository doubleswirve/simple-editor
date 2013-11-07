/**
 * Single Post Controller
 */

editorApp.controller('PostCtrl', ['$scope', '$http', function($scope, $http){
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
}]);