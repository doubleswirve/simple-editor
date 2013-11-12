/**
 * Services to provide some shared utitlity functions
 * across directives
 */

editorApp.service('rangeUtility', [function(){

  /**
   * `window.getSelection` singleton
   */

  this.selection = window.getSelection();

  /**
   * Get range's relative offset
   */

  this.getOffsetRelativeTo = function(node, index){
    index = index === undefined ? 0 : index;

    var range = this.selection.getRangeAt(index)
      , preCaretRange = range.cloneRange();

    preCaretRange.selectNodeContents(node);
    preCaretRange.setEnd(range.endContainer, range.endOffset);

    return preCaretRange.toString().length;
  };

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
    
    this.selection.removeAllRanges();
    this.selection.addRange(range);
  };
}]);