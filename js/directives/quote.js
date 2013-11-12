editorApp.directive(
  'quote', 
  [
    '$http',
    '$templateCache',
    function($http, $templateCache){
      return {
        restrict: 'A',
        replace: true,
        template: $templateCache.get('js/templates/quote.html'),
        scope: { quote: '@' },
        link: function(scope, el, attrs){
          console.log('quote dir called!');
        }
      }
    }
  ]
);