// Helper
function $$(id) {
  return document.getElementById(id)
}

// Code under development
function load(filename) {
  var script = get(filename)
  eval.call(window, script)
}

function URL(str) {
  var self = { 
    string: str,
    exists: function() {
      'make a request & test if there is a resource at this URL'

      var req = new XMLHttpRequest()
      req.open('get', self.string, false)
      req.setRequestHeader("If-Modified-Since", "Sat, 1 Jan 2005 00:00:00 GMT");   // No caching
      req.send(null);

      if((req.status >= 200 && req.status < 300) || req.status == 304)
          return true;
      else
        return false;
    },

    basename: function() {
      var tokens = str.split('/');
      return (tokens[ tokens.length-1 ])
    },

    query_string: function() { return this.string.split("?")[1] || ""; },

    query_parameters: function() {
     
      var pairs = this.query_string().split("&").map(
        function(pair_string){
         var items = pair_string.split("=");
         return [ items[0],  items[1] ] ;
        }
      );

      var parameters = {};
      pairs.forEach( function( pair) {
        parameters[ pair[0] ] = pair[1];
      })

      return parameters;
    }
  }
  return self;
}


function blocking_ajax_request(url, method, data) {
  var req = new XMLHttpRequest()
  req.open(method, url.string, false)
  req.setRequestHeader("If-Modified-Since", "Sat, 1 Jan 2005 00:00:00 GMT");   // No caching
  req.send(data)
  return req.responseText
}

function put(url, data) {
  blocking_ajax_request(url, 'put', data)
}

function get(url) {
  return blocking_ajax_request(url, "get");
}
function del(url) {
  return blocking_ajax_request(url, "delete");
}
function post(url, data) {
  return blocking_ajax_request(url, "post", data);
}

// TODO: make these work with primitive types as well!
Array.prototype.includes = function(item) {
  return this.some( function(i) { return i === item; } );
};

// TODO: there is some strange behaviour when this is defined - maybe because it is onvoked tacitly by something on something I do not know...
// Object.prototype.is_any_of = function(list) {
//   return list.includes( this );
// };


Array.prototype.first = function() {
  return this[0];
};


Array.prototype.equals = function(other) {
  if (this.length != other.length)
    return false
    
  for(i = 0; i < this.length; i++) {
    if (this[i] != other[i])
      return false
  }
  return true
}

function l(data) {
  console.log(data);
  return data;
}

function beep( element ) {
  var beeper = $("<div style='position: absolute; background-color: red;'/>")
  beeper.offset( $(element).offset() ).height( $(element).height() ).width( $(element).width() )  ;

  $('body').append(beeper)
  window.setTimeout( function(){ beeper.remove(); }, 100 )
}

RegExp.escape = function(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

var eval_template = function(str) { 
  return str.replace(/#\{(.*)\}/, function(template, code) { return eval(code); });
};

//Templating Helpers
String.prototype.times = function(count) {
  var result = "";
  for (var i = 0; i < count; i++) {
    result += this;
  }
  return result;
};
String.prototype.x = String.prototype.times; //sugar

String.prototype.ends_with = function (s) {
  return this.length >= s.length && this.substr(this.length - s.length) == s;
}

NodeList.prototype.forEach = Array.prototype.forEach;
NodeList.prototype.map = Array.prototype.map;

function render_templates() {
  document.getElementsByTagName("eval").forEach( function(node) { node.innerHTML = eval(node.innerHTML) } );
}

function parse_document_fragment( html ) {
  var d = document.createDocumentFragment();
  
  $( html ).each( function(index, data) { d.appendChild(data); } );
  return d;
}


// Sugar functions to construct DOM elements more nicely

function DocumentFragment() {  // is this save??
  return document.createDocumentFragment();
}

function Node(html_constructor, text) {
  var node = $(html_constructor)[0];
  node.innerText = text;
  return node;
}

