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
            * Above the selection
        * ~~Async template~~
    * Basics
        * Bold, italic
    * Advanced
        * Pull quote
        * Advanced tooltip (semantic options)
* Only make Ajax request when content changes
* Cross-browser
    * Calling native `String.trim`
    * Using `window.getSelection`
