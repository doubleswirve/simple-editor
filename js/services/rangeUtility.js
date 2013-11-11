/**
 * Services to provide some shared utitlity functions
 * across directives
 */

editorApp.service('rangeUtility', [function(){

  /**
   * Set caret position within a specified node (node)
   * with an offset relative to that node
   */

  this.setCaret = function(node, offset){
    var charIndex = 0
      , nextCharIndex
      , len
      , delta;

    var range = document.createRange();

    var nodeStack = [node];

    range.setStart(node, 0);
    range.collapse(true);

    while (node = nodeStack.pop()) {
      if (3 === node.nodeType) {
        nextCharIndex = charIndex + node.length;
        if (offset >= charIndex && offset <= nextCharIndex) {
          delta = offset - charIndex;
          range.setStart(node, delta);
          range.setEnd(node, delta);
          break;
        }
        charIndex = nextCharIndex;
      } else {
        len = node.childNodes.length;
        while(len--) {
          nodeStack.push(node.childNodes[len]);
        }
      }
    }

    var userSelection = window.getSelection();
    userSelection.removeAllRanges();
    userSelection.addRange(range);
  };
}]);