

DocType = {
  match_text: 'doctype',
  menu_view: '<b>HTML5 Doctype</b>',
  Entity: function() {
    var e = {};

    e.view = document.createElement('span');
    e.view.innerText = '<!DOCTYPE html>';
    e.view.setAttribute('contenteditable', 'false');
    e.view.setAttribute('style', 'background-color: blue;');
      
    e.view.to_js = function() { 
     return '<!DOCTYPE html>';
    }

    return e;
  }

}

// - expel to HTML file (more overview)
// - code function handlers into HTML
// - use 'this' reference to get data
//   - use data-id tags to ID elements with data

// - Knockout offers: 
//   - partial update
//   - massive data collection MODEL
//   - to solve: how to bind locally



function check_body(event) {
  var self_jq = $(event.srcElement).parents('.tag').first();
  var b = self_jq.children('[data-id=body]').first();

  if (_(b[0].childNodes).find( function(it){ return it.nodeName === 'BR' } )) {
    b.addClass( 'block');
  } else {
    b.removeClass( 'block');
  }
}

function focus_open_tag(event) {
  var self_jq = $(event.srcElement).parents('.tag').first();
  var open_tag_jq = self_jq.children('[data-id=open-tag]').first();
  open_tag_jq.focus();
}

function update_end_tag(event) {
  var self_jq = $(event.srcElement).parents('.tag');
  var end_tag_jq = self_jq.children('[data-id=close-tag]').first();
  end_tag_jq.text(event.srcElement.innerText);  
}

HtmlTag = {
match_text: 'tag',
  menu_view: '<b>HTML Tag</b>',
  Entity: function() {
    var e = {};

    var data = get(URL('html-tag.html'));
    var d = document.createElement('div');
    d.innerHTML = data;

    e.view = d.children[0];
    e.view.to_js = function() { 
     return 'tag';
    }

    return e;
  }
}




var StateChart = {
  match_text: "state",
  menu_view: '<b>State Chart</b>',
  Entity: function() {
    var e = {};

    e.fields = ['name', 'arguments', 'body'];

    e.view = $("<img src='state-chart.png'/>")[0];
    
    e.view.to_js = function() { 
     return '"state: RED"';
    }

    return e;
  }
};

 var Comment = {
    match_text: "comment",
    menu_view: "<comment>Comment </comment>    <span class='type'>  Comment</span>",
    Entity: function() {
      var e = {};
      e.view = $("<comment contenteditable='false'><b>// Comment</b><hr/> <field contenteditable='true'/><br></comment>")[0];
      e.view.setAttribute('to_js', 'function() {\
        var field = $(e.view).find("field")[0];\
        return "/*" + field.innerText + "*/";\
      }')
      e.view.to_constructor = function() { return 'Comment.Entity("foo").view' };
      return e;
    }
  }


  var DeclarationAssignment = {
    match_text: "var",
    menu_view: "<b>var</b> <field/> <b>=</b> <field/><b>;</b><span class='type'>  Declaration-Assignment</span>",
    Entity: function (name, value) {
      var e = {};
      if (!name) name = '';
      if (!value) value = '';
      
      e.fields  = [name , value];
      e.view    = $("<declaration-assignment contenteditable='false'><b>var</b> <field name='name' contenteditable='true'>" + name + "</field> <b>=</b> <field name='value' contenteditable='true'>" + value + "</field><b>;</b></declaration-assignment>")[0];
      
      e.view.to_js = e.to_js   = function() {
        var fields = $(e.view).find("field");
        // TODO: Now I just need to find a cleaner model of recursive to_js in everything that is inserted into the editor. no innerText
        return "var " + fields[0].to_js() + " = " + fields[1].to_js() + ";";
      };
      e.view.onclick = function() { IntentionInteractionWindowEditor( e.view ) };
      e.view.to_constructor = function() {
  var fields = $(e.view).find("field");
  return 'DeclarationAssignment.Entity("'+ fields[0].innerText + '","' + fields[1].innerText + '").view';   };
      
      return e;
    }
  };

  //TODO: make the views work with the cursor when they are plain text nodes; doc fragment etc so we can insert more lo-fi things as well
  var VarText = {
    match_text: "var",
    menu_view: 'var<span class="type">         text</span>',
    Entity: function() { 
      var e = {};
      e.fields = [];
      e.view = document.createTextNode('var');
      e.view.to_js = function () { return 'var' };
      return e;
//       {
//         fields: [],
//         view: document.createTextNode('var') //,
// //         to_javascript: function() { return "var"; }
//       };
    }
  }

var Fun =  {
  match_text: "function",
  menu_view: '<function><b>function</b> <field>&#160;</field>(<field>arg</field>) {<layouter contenteditable="true"><br>&#160;\n        </layouter>        <field contenteditable="true"> &#160; </field><br> }</function>',
  Entity: function() {
    var e = {};

    e.fields = ['name', 'arguments', 'body'];

    e.view = $("<function contenteditable='false'><b>function</b><field contenteditable='true'/>(<field contenteditable='true'/>) {<layouter contenteditable='true'><br>&#160;\n        </layouter>\n        <field contenteditable='true'/><br> }</function>" )[0];

    e.view.to_js = function() { 
      var fields = $(e.view).find("field");
      return "function " + fields[0].to_js() + "( " + fields[1].to_js() +" ) {\n  " + fields[2].to_js() + "\n}";
    }


    return e;
  }
}
