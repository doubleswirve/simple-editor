/**
 * Service providing DOM-based helper functions 
 * that are used across directives
 */

editorApp.service('editorUtility', [function(){

  /**
   * Eligible container nodes. This is a constraint 
   * array to determine offset point for ranges. The 
   * goal is to keep the markup clean and the structure 
   * manageable.
   */

  this.eligibleContainerNodes = ['H1', 'H2', 'H3', 'P', 'LI', 'UL'];

  /**
   * Retrieve an eligible parent node relative to the
   * selection 
   */

  var i = 0;

  this.getContainerNode = function(selection){
    var anchorNode = selection.anchorNode
      , parentNode = anchorNode.parentNode;

    if (3 !== anchorNode.nodeType) return selection.focusNode;

    while (
      !~this.eligibleContainerNodes.indexOf(parentNode.tagName.toUpperCase())
    ) {
      parentNode = parentNode.parentNode;
    }

    return parentNode;
  };
}]);