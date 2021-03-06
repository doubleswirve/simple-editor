Simple Editor
=============

Goal: Create a rough sketch for a more involved editor.

[Live example](http://simple-editor.eu1.frbit.net/)

Features
--------

Some eventual features include:

* Drap and drop placement
    * Images, Video, Articles
    * Float left, right, centering
* Creation of pull-quotes
    * Float left, right
* Simple text customization
    * Bold, italic
* Citations
    * Inline superscript with corresponding sidebar content
* Captions
    * Pull into right sidebar

Todo
----

* Keyboard events
    * ~~No carriage returns option in directives~~
    * ~~No more than _single_ whitespace~~
        * ~~No `&nbsp;`~~
* Selection events
    * Prereqs
        * ~~Show/hide~~
            * Something smoother using CSS transitions
        * Positioning
            * ~~Rough placement~~
            * ~~Above the selection~~
        * ~~Async template~~
    * Basics
        * ~~Bold, italic~~
            * Maintain caret position after bold and italic
        * Add keyboard shortcuts
        * Remove whitespace during carriage return
        * ~~Fix Firefox caret positioning on carriage return ignores~~
        * Allow `H2` and `H3` to be undone via the tooltip
    * Advanced
        * Pull quote
        * Advanced tooltip (semantic options)
* Only make Ajax request when content changes
    * ~~Limit to 1 request per 3s~~
    * Still would like to only attempt requests when changes occur
* Confirmation upon leaving page when outstanding Ajax request
* Decide on Selection/Range utility design (see commit comment)
* Cross-browser
    * Calling native `String.trim`
    * Using `window.getSelection`
    * Using `Element.getBoundingClientRect`
    * Using `user-select` CSS property for tooltip items
    * Using `Element.getAttribute`
