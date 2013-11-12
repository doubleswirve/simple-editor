/**
 * Editor App Module
 */

var editorApp = angular.module('editorApp', []);

/**
 * Pre-fetch some templates
 */

editorApp.run([
  '$http',
  '$templateCache',
  function($http, $templateCache){

    $http
      .get('js/templates/quote.html')
      .success(function(data){
        $templateCache.put('js/templates/quote.html', data);
      });

  }
]);