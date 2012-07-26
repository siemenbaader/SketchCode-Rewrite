// TODO: refactor the menu + all events into a clean state something
// TODO: there is some bug there... the menu stays.
// Editor TO JS mixins

// (function(exports) {

  // quick-fixes to make contentEditable formatting compile
  HTMLSpanElement.prototype.to_constructor = function() { return "document.createElement('span')"; };
  HTMLDivElement.prototype.to_constructor = function() { var i =  document.createElement("div"); i.innerText ; return i; };
  
  
  
  
  Text.prototype.to_js = function() { return this.wholeText; };
  Text.prototype.to_constructor = function() { return "document.createTextNode(" + JSON.stringify(this.wholeText) +")"; };
  
  HTMLBRElement.prototype.to_js = function() { return "\n" };
  HTMLBRElement.prototype.to_constructor = function() { return "document.createElement('br')" };
  
  HTMLElement.prototype.to_js = function() {
//     if(this.getAttribute['to_js']) {   // only defined for intentions
//       l(this);
      // must return some js string that can be evaled later, but with the right binding!
      
//       var fields = [1,2,3];
//       return "JS"//this.getAttribute['to_js'] + fields;
//     }
//     return "undef";
// 
/*    if(this.tagName == "intention") {
      var fields = $(this).find("field").toArray();
    }*/
//      
    var contents = $(this).contents().toArray();
    return contents.map(function(i) { return i.to_js() }).join("");
  };
  
  HTMLCollection.prototype.map = Array.prototype.map;


  function AutocompletionMenu(choices) {

    // Menu view
    var self = $("<dropdown_menu/>")[0];
    var index = 0; 
    var items;     
    var item_views;

    self.render = function( word_fragment ) {
      self.innerHTML = "";
      items = self.matching_choices_for( word_fragment);
      item_views = items.map( function(i) { return $("<item>" + i.menu_view + "</item>")[0] });       
      hilit_active_item();
      $(self).append( item_views );
    };

    function clear_active_item() {
      item_views[index].className = "";
    }

    function hilit_active_item() {
      item_views[index].className = "selected";
    }

    self.has_match_for = function(word_fragment) {
      return self.matching_choices_for( word_fragment ).length > 0;
    }

    self.matching_choices_for = function( word_fragment ) {
      return choices.filter( function(i) { return i.match_text === word_fragment });
    };

    self.down = function() {
      clear_active_item();
      index = Math.min (index + 1, items.length - 1);
      hilit_active_item();
    }

    self.up = function () {
      clear_active_item();
      index = Math.max (index - 1, 0);
      hilit_active_item();
    }
    self.choice = function() { return items[index].Entity(); };

    self.recalculate_matches_for = function( word_fragment ) {
      index = 0;
      
      self.render( word_fragment );
    };

    self.set_position = function( offset ) {
      self.style.position = "";
      self.style.top = "";
      self.style.left = "";

      $(self).offset( {left: offset['left'], top: offset['top'] + 15} ); 
    }
    return self;
  }

  function Cursor(editor) {
    
    var self = $("<cursor>|</cursor>")[0];

  //   editor.appendChild( self );

  //   self.update_dom_position = function() {
  //     $(self).remove();
  //     self.dom_range().insertNode( self );
  //   }


    self.position = function() {
      // this needle stuff will go away when the curser itself becomes a DOM element
      var needle = $("<span data-note='needle' />")
      var saved_sel = rangy.saveSelection();
      
      document.getSelection().getRangeAt(0).insertNode( needle[0] );
      var offset = needle.offset();
      needle.remove();
      rangy.restoreSelection(saved_sel);
      return offset;
    };

    self.doWithDomNeedle = function( lambda ){
      var saved_sel = rangy.saveSelection();
      if (saved_sel.rangeInfos[0].collapsed) {
        lambda( document.getElementById(saved_sel.rangeInfos[0].markerId));
      }
      rangy.restoreSelection(saved_sel);      
    }  

    self.word_under_range = function() {

      var saved_sel = rangy.saveSelection();

      var moving_sel = document.getSelection();

      moving_sel.modify("extend", "backward", "lineboundary");
      var line_range = moving_sel.getRangeAt(0);

      rangy.restoreSelection(saved_sel);
        
      var saved_sel = rangy.saveSelection();
      var moving_sel = document.getSelection();

      moving_sel.modify("extend", "backward", "word");
      var word_range = moving_sel.getRangeAt(0);
    
      rangy.restoreSelection(saved_sel);

      var word = word_range.toString();
      var line = line_range.toString();

      // The word API also looks at the line above. But we only want the current word on this line
      if (line_range.toString() === "") {
        return line_range;
      } else {
        return word_range;
      }
    };

    self.word_under = function() {
      return self.word_under_range().toString();    
    };

    self.insert_left = function( element ) {
      var needle = $("<span data-note='needle'/>")[0];

      self.dom_range().insertNode( needle );

      var parent = needle.parentNode;
      parent.insertBefore( element , needle );
      parent.removeChild( needle );
      self.move_after( element );

    };

    self.delete_current_word = function() {
      var r = self.word_under_range();
      r.deleteContents();
    };

    self.dom_range = function () {
      return document.getSelection().getRangeAt(0);
    };

    self.move_after = function( element ) {
      var sel = document.getSelection();
      var r = sel.getRangeAt(0);

      r.setStartAfter( element );
      r.setEndAfter( element );
      sel.removeAllRanges();
      sel.addRange( r ); // maybe this is not executed immediately; rangeCount === 0 after..
    };

    self.isNeedle = function() {
      var sel = rangy.getSelection();
      var range = sel.getRangeAt(0);
      return range.collapsed;
    };

    self.at_end_of_container = function() {
      var state;
      self.doWithDomNeedle( function(needle) {
        state = $(needle).parent().contents().last()[0] === needle;
      });
      return state;
    }

    self.prevElement = function() {
      var theElement;

      self.doWithDomNeedle( function(needle){
        var children = $(needle).parent().contents();
        var i = children.index( needle );
        var leftIndex = i - 1;
        theElement = children[ leftIndex ];
      });

      return theElement;
    };

    self.nextElement = function() {
      var theElement;

      self.doWithDomNeedle( function(needle){
        var children = $(needle).parent().contents();
        var i = children.index( needle );
        var rightIndex = i + 1;
        theElement = children[ rightIndex ];
      });

      return theElement;
    };


    self.selectElement = function( element ) {
      var r = rangy.createRange();
      r.selectNode( element );
      rangy.getSelection().setSingleRange(r);
    };

    return self;
  }

  function Editor( self, intentions ) {
  
    self.render = function(){ l("NOOP"); };

    self.import_plain_text = function( text ) {
      self.innerText = text;
    }

    self.set_content = function (serialized_objects) {
      try {
	var objects = eval(serialized_objects);
	window.objects = objects;
	objects.forEach( function(obj) { self.appendChild( obj ); } );
      } catch (err) {
	l(err);
	alert("Err reading file. Valid format? Check log.");
      }
      
    };
    
    // returns a serialized form of its object contents and their state for persistence
    self.get_content = function () { 
      return "[" +  self.childNodes.map( function(node) { return node.to_constructor(); } ).join(", ") + "]";
    };
    
    var cursor = Cursor( self );
    self.cursor = cursor;

    var menu = AutocompletionMenu( intentions );
    self.menu = menu;
    
    
    self.contentEditable = "true";
    self.setAttribute("spellcheck", "false");
    
    var normal_mode = {
      onkeydown: function(event) {

        if (event.keyIdentifier === "Enter") {
          // Browser requires two BR elements to display a line feed after the final element in a container
          if ( cursor.at_end_of_container() ) {
            cursor.insert_left( document.createElement('br'));
            cursor.insert_left( document.createElement('br'));
          } else {
            cursor.insert_left( document.createElement('br'));
          }

          event.preventDefault();
          return;
        }

        if (["Left", "Right", "Up", "Down"].includes(event.keyIdentifier)) {
          return;
        }
        
        // Do this after the browser has had the chance to rte the editor. Ask Ge.tt about this reactive style...
        window.setTimeout( function() {
          //cursor.update_dom_position();
          var w = cursor.word_under();
          
          if (menu.has_match_for( w ) ) {
            self.go_to_menu_mode();
          }
        }, 0);
      }
    };

    var menu_mode = {
      onkeydown: function(event) {

        if (event.keyIdentifier === "Up") { 
          menu.up();
          event.preventDefault();
          return;
        }
        
        if (event.keyIdentifier === "Down") {
          menu.down(); 
          event.preventDefault();
          return;
        }

        if (event.keyIdentifier === "Enter") { 
          cursor.delete_current_word();
          cursor.insert_left( menu.choice().view );
	  
          event.preventDefault();
          
          self.go_to_normal_mode();
          return;
        }

        if (["U+001B", "Left", "Right"].includes( event.keyIdentifier )) {
          self.go_to_normal_mode();
          return;
        }

        // Do this after the browser has had the chance to update the editor. Ask Ge.tt about this reactive style...
        window.setTimeout( function() {
            var w = cursor.word_under();

            if (! menu.has_match_for( w )) {
              self.go_to_normal_mode();
            } else {
              menu.recalculate_matches_for( w );
            }
        }, 0);
        // The event goes on for normal typing..
      }
    };

    self.mode = normal_mode;

    self.onkeydown = function (event) {
      var should_terminate = false;


      if (event.keyIdentifier === 'U+0008') {
        // Backspace inside content_editable field && cursor.leftMost in a the field 
        // -> just beep the input field

        cursor.doWithDomNeedle( function(needle){
          var field = $(needle).parent();
          field.get(0).normalize();
          // If needle is the first child of field
          if( field.contents()[0] === needle ) {
            event.preventDefault();
            beep(field[0]);
            should_terminate = true;
          }
        } )
        if( should_terminate) { return; } // No more key actions

        // ---------------
        // If right of a concept && no selection, select the concept

        if( cursor.isNeedle() && $(cursor.prevElement()).is('concept')) {
          cursor.selectElement( cursor.prevElement() )
          event.preventDefault();
          return;
        }



        // if a selection: just remove it (implemented by the browser)



      } else if (event.keyIdentifier === 'U+007F') {  //DEL
        
        cursor.doWithDomNeedle( function(needle){
          var field = $(needle).parent();
          field.get(0).normalize();

          // If needle is the last child of field, or if there is a (non-displayed) BR after the cursor needle
          var tail = _(field.contents()).slice(-2);

          if(( _(field.contents()).last() === needle ) || (tail[0] === needle & tail[1].tagName === 'BR')){
            event.preventDefault();
            beep(field.get(0));
            should_terminate = true;
          }
        } )
        if( should_terminate) { return; } // No more key actions

        // If BSP before a concept, select it
        if( cursor.isNeedle() && $(cursor.nextElement()).is('concept')) {
          cursor.selectElement( cursor.nextElement() )
          event.preventDefault();
          return;
        }

      } 
      
      self.mode.onkeydown(event);

      
      window.setTimeout( function(){ 
        self.normalize();
      }, 0)

    };


    self.go_to_menu_mode = function() {
      self.mode = menu_mode;
      menu.recalculate_matches_for( cursor.word_under() );
      self.appendChild( menu );
      menu.set_position( cursor.position() );
    };

    self.go_to_normal_mode = function() {
      self.removeChild(menu);
      self.mode = normal_mode;
    };
    return self;
  }

//   exports.Editor = Editor;

// }(window));
