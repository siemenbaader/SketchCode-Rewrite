/*
 Rangy, a cross-browser JavaScript range and selection library
 http://code.google.com/p/rangy/

 Copyright 2010, Tim Down
 Licensed under the MIT license.
 Version: 1.0b1
 Build date: 11 November 2010
*/
var rangy=function(){function p(f,w){var q=typeof f[w];return q=="function"||!!(q=="object"&&f[w])||q=="unknown"}function D(f,w){return!!(typeof f[w]=="object"&&f[w])}function F(f,w){return typeof f[w]!="undefined"}function v(f){return function(w,q){for(var E=q.length;E--;)if(!f(w,q[E]))return false;return true}}function z(f){window.alert("Rangy not supported in your browser. Reason: "+f);s.initialized=true;s.supported=false}function J(){if(!s.initialized){var f,w=false,q=false;if(p(document,"createRange")){f=
document.createRange();if(u(f,l)&&r(f,M))w=true;f.detach()}if((f=D(document,"body")?document.body:document.getElementsByTagName("body")[0])&&p(f,"createTextRange")){f=f.createTextRange();if(u(f,n)&&r(f,m))q=true}!w&&!q&&z("Neither Range nor TextRange are implemented");s.initialized=true;s.features={implementsDomRange:w,implementsTextRange:q};w=d.concat(e);q=0;for(f=w.length;q<f;++q)try{w[q](s)}catch(E){D(window,"console")&&p(window.console,"log")&&console.log("Init listener threw an exception. Continuing.",
E)}}}function G(f){this.name=f;this.supported=this.initialized=false}var M=["startContainer","startOffset","endContainer","endOffset","collapsed","commonAncestorContainer","START_TO_START","START_TO_END","END_TO_START","END_TO_END"],l=["setStart","setStartBefore","setStartAfter","setEnd","setEndBefore","setEndAfter","collapse","selectNode","selectNodeContents","compareBoundaryPoints","deleteContents","extractContents","cloneContents","insertNode","surroundContents","cloneRange","toString","detach"],
m=["boundingHeight","boundingLeft","boundingTop","boundingWidth","htmlText","text"],n=["collapse","compareEndPoints","duplicate","getBookmark","moveToBookmark","moveToElementText","parentElement","pasteHTML","select","setEndPoint"],u=v(p),x=v(D),r=v(F),s={initialized:false,supported:true,util:{isHostMethod:p,isHostObject:D,isHostProperty:F,areHostMethods:u,areHostObjects:x,areHostProperties:r,randomString:function(f){return f+ +new Date+"_"+(""+Math.random()).substr(2)}},features:{},modules:{},config:{alertOnWarn:false}};
s.fail=z;s.warn=function(f){f="Rangy warning: "+f;if(s.config.alertOnWarn)window.alert(f);else typeof window.console!="undefined"&&typeof window.console.log!="undefined"&&window.console.log(f)};s.init=J;var e=[],d=[];s.addInitListener=function(f){s.initialized?f(s):e.push(f)};G.prototype.fail=function(f){this.initialized=true;this.supported=false;throw Error("Module '"+this.name+"' failed to load: "+f);};G.prototype.createError=function(f){return Error("Error in Rangy "+this.name+" module: "+f)};
s.createModule=function(f,w){var q=new G(f);s.modules[f]=q;d.push(function(E){w(E,q);q.initialized=true;q.supported=true})};s.requireModules=function(f){for(var w=0,q=f.length,E,P;w<q;++w){P=f[w];E=s.modules[P];if(!E||!(E instanceof G))throw Error("Module '"+P+"' not found");if(!E.supported)throw Error("Module '"+P+"' not supported");}};var j=false;x=function(){if(!j){j=true;s.initialized||J()}};if(typeof window=="undefined")z("No window found");else if(typeof document=="undefined")z("No document found");
else{p(document,"addEventListener")&&document.addEventListener("DOMContentLoaded",x,false);if(p(window,"addEventListener"))window.addEventListener("load",x,false);else p(window,"attachEvent")?window.attachEvent("onload",x):z("Window does not have required addEventListener or attachEvent method");return s}}();
rangy.createModule("DomUtil",function(p,D){function F(e){for(var d=0;e=e.previousSibling;)d++;return d}function v(e,d){var j=[],f;for(f=e;f;f=f.parentNode)j.push(f);for(f=d;f;f=f.parentNode)if(s(j,f))return f;return null}function z(e,d,j){for(j=j?e:e.parentNode;j;){e=j.parentNode;if(e===d)return j;j=e}return null}function J(e){e=e.nodeType;return e==3||e==4||e==8}function G(e,d){var j=d.nextSibling,f=d.parentNode;j?f.insertBefore(e,j):f.appendChild(e);return e}function M(e){if(e.nodeType==9)return e;
else if(typeof e.ownerDocument!="undefined")return e.ownerDocument;else if(typeof e.document!="undefined")return e.document;else if(e.parentNode)return M(e.parentNode);else throw Error("getDocument: no document found for node");}function l(e){if(!e)return"[No node]";return J(e)?'"'+e.data+'"':e.nodeType==1?"<"+e.nodeName+(e.id?' id="'+e.id+'"':"")+">":e.nodeName}function m(e){this._next=this.root=e}function n(e,d){this.node=e;this.offset=d}function u(e){this.code=this[e];this.codeName=e;this.message=
"DOMException: "+this.codeName}var x=p.util;x.areHostMethods(document,["createDocumentFragment","createElement","createTextNode"])||D.fail("document missing a Node creation method");x.isHostMethod(document,"getElementsByTagName")||D.fail("document getElementsByTagName method");var r=document.createElement("div");x.areHostMethods(r,["insertBefore","appendChild","cloneNode"])||D.fail("Incomplete Element implementation");r=document.createTextNode("test");x.areHostMethods(r,["splitText","deleteData",
"insertData","appendData","cloneNode"])||D.fail("Incomplete Text Node implementation");var s=function(e,d){for(var j=e.length;j--;)if(e[j]===d)return true;return false};m.prototype={_current:null,hasNext:function(){return!!this._next},next:function(){var e=this._current=this._next,d;if(this._current)if(d=e.firstChild)this._next=d;else{for(d=null;e!==this.root&&!(d=e.nextSibling);)e=e.parentNode;this._next=d}return this._current},detach:function(){this._current=this._next=this.root=null}};n.prototype=
{equals:function(e){return this.node===e.node&this.offset==e.offset},inspect:function(){return"[DomPosition("+l(this.node)+":"+this.offset+")]"}};u.prototype={INDEX_SIZE_ERR:1,HIERARCHY_REQUEST_ERR:3,WRONG_DOCUMENT_ERR:4,NO_MODIFICATION_ALLOWED_ERR:7,NOT_FOUND_ERR:8,NOT_SUPPORTED_ERR:9,INVALID_STATE_ERR:11};u.prototype.toString=function(){return this.message};p.dom={arrayContains:s,getNodeIndex:F,getCommonAncestor:v,isAncestorOf:function(e,d,j){for(d=j?d:d.parentNode;d;)if(d===e)return true;else d=
d.parentNode;return false},getClosestAncestorIn:z,isCharacterDataNode:J,insertAfter:G,splitDataNode:function(e,d){var j;if(e.nodeType==3)j=e.splitText(d);else{j=e.cloneNode();j.deleteData(0,d);e.deleteData(0,e.length-d);G(j,e)}return j},getDocument:M,getWindow:function(e){e=M(e);if(typeof e.defaultView!="undefined")return e.defaultView;else if(typeof e.parentWindow!="undefined")return e.parentWindow;else throw Error("Cannot get a window object for node");},getBody:function(e){return x.isHostObject(e,
"body")?e.body:e.getElementsByTagName("body")[0]},comparePoints:function(e,d,j,f){var w;if(e==j)return d===f?0:d<f?-1:1;else if(w=z(j,e,true))return d<=F(w)?-1:1;else if(w=z(e,j,true))return F(w)<f?-1:1;else{d=v(e,j);e=e===d?d:z(e,d,true);j=j===d?d:z(j,d,true);if(e===j)throw Error("comparePoints got to case 4 and childA and childB are the same!");else{for(d=d.firstChild;d;){if(d===e)return-1;else if(d===j)return 1;d=d.nextSibling}throw Error("Should not be here!");}}},inspectNode:l,createIterator:function(e){return new m(e)},
DomPosition:n,DOMException:u}});
rangy.createModule("DomRange",function(p){function D(b,i){this.range=b;this.clonePartiallySelectedTextNodes=i;if(!b.collapsed){this.sc=b.startContainer;this.so=b.startOffset;this.ec=b.endContainer;this.eo=b.endOffset;var t=b.commonAncestorContainer;if(this.sc===this.ec&&a.isCharacterDataNode(this.sc)){this.isSingleCharacterDataNode=true;this._first=this._last=this._next=this.sc}else{this._first=this._next=this.sc===t&&!a.isCharacterDataNode(this.sc)?this.sc.childNodes[this.so]:a.getClosestAncestorIn(this.sc,
t,true);this._last=this.ec===t&&!a.isCharacterDataNode(this.ec)?this.ec.childNodes[this.eo-1]:a.getClosestAncestorIn(this.ec,t,true)}}}function F(b){this.code=this[b];this.codeName=b;this.message="RangeException: "+this.codeName}function v(b){return a.getDocument(b.startContainer)}function z(b,i,t){if(i=b._listeners[i])for(var y=0,H=i.length;y<H;++y)i[y].call(b,{target:b,args:t})}function J(b){return new h(b.parentNode,a.getNodeIndex(b))}function G(b){return new h(b.parentNode,a.getNodeIndex(b)+1)}
function M(b){return a.isCharacterDataNode(b)?b.length:b.childNodes?b.childNodes.length:0}function l(b,i,t){var y=b.nodeType==11?b.firstChild:b;if(a.isCharacterDataNode(i))t==i.length?a.insertAfter(b,i):i.parentNode.insertBefore(b,t==0?i:a.splitDataNode(i,t));else t>=i.childNodes.length?i.appendChild(b):i.insertBefore(b,i.childNodes[t]);return y}function m(b){for(var i,t,y=v(b.range).createDocumentFragment();t=b.next();){i=b.isPartiallySelectedSubtree();t=t.cloneNode(!i);if(i){i=b.getSubtreeIterator();
t.appendChild(m(i));i.detach(true)}if(t.nodeType==10)throw new k("HIERARCHY_REQUEST_ERR");y.appendChild(t)}return y}function n(b,i,t){var y,H;for(t=t||{stop:false};y=b.next();)if(b.isPartiallySelectedSubtree())if(i(y)===false){t.stop=true;return}else{y=b.getSubtreeIterator();n(y,i,t);y.detach(true);if(t.stop)return}else for(y=a.createIterator(y);H=y.next();)if(i(H)===false){t.stop=true;return}}function u(b){for(var i;b.next();)if(b.isPartiallySelectedSubtree()){i=b.getSubtreeIterator();u(i);i.detach(true)}else b.remove()}
function x(b){for(var i,t=v(b.range).createDocumentFragment(),y;i=b.next();){if(b.isPartiallySelectedSubtree()){i=i.cloneNode(false);y=b.getSubtreeIterator();i.appendChild(x(y));y.detach(true)}else b.remove();if(i.nodeType==10)throw new k("HIERARCHY_REQUEST_ERR");t.appendChild(i)}return t}function r(b,i,t){var y=!!(i&&i.length),H,S=!!t;if(y)H=RegExp("^("+i.join("|")+")$");var X=[];n(new D(b,false),function(Y){if((!y||H.test(Y.nodeType))&&(!S||t(Y)))X.push(Y)});return X}function s(b){return"["+(typeof b.getName==
"undefined"?"Range":b.getName())+"("+a.inspectNode(b.startContainer)+":"+b.startOffset+", "+a.inspectNode(b.endContainer)+":"+b.endOffset+")]"}function e(b,i,t){this.nodes=r(b,i,t);this._next=this.nodes[0];this._pointer=0}function d(b,i){return b.nodeType!=3&&(a.isAncestorOf(b,i.startContainer,true)||a.isAncestorOf(b,i.endContainer,true))}function j(b){return function(i,t){for(var y,H=t?i:i.parentNode;H;){y=H.nodeType;if(a.arrayContains(b,y))return H;H=H.parentNode}return null}}function f(b){for(var i;i=
b.parentNode;)b=i;return b}function w(b,i){if(na(b,i))throw new F("INVALID_NODE_TYPE_ERR");}function q(b){if(!b.startContainer)throw new k("INVALID_STATE_ERR");}function E(b,i){if(!a.arrayContains(i,b.nodeType))throw new F("INVALID_NODE_TYPE_ERR");}function P(b,i){if(i<0||i>(a.isCharacterDataNode(b)?b.length:b.childNodes.length))throw new k("INDEX_SIZE_ERR");}function Z(b,i){if(da(b,true)!==da(i,true))throw new k("WRONG_DOCUMENT_ERR");}function T(b){if(oa(b,true))throw new k("NO_MODIFICATION_ALLOWED_ERR");
}function U(b,i){if(!b)throw new k(i);}function K(b){if(!da(b.startContainer,true)||!da(b.endContainer,true)||!(b.startOffset<=(a.isCharacterDataNode(b.startContainer)?b.startContainer.length:b.startContainer.childNodes.length))||!(b.endOffset<=(a.isCharacterDataNode(b.endContainer)?b.endContainer.length:b.endContainer.childNodes.length)))throw Error("Range Range error: Range is no longer valid after DOM mutation ("+b.inspect()+")");}function V(b){b.START_TO_START=ea;b.START_TO_END=ha;b.END_TO_END=
pa;b.END_TO_START=ia;b.NODE_BEFORE=ja;b.NODE_AFTER=ka;b.NODE_BEFORE_AND_AFTER=la;b.NODE_INSIDE=fa}function A(b){V(b);V(b.prototype)}function W(b,i,t){function y(c,g){return function(o){q(this);E(o,C);E(f(o),N);o=(c?J:G)(o);(g?H:S)(this,o.node,o.offset)}}function H(c,g,o){var B=c.endContainer,L=c.endOffset;if(g!==c.startContainer||o!==this.startOffset){if(f(g)!=f(B)||a.comparePoints(g,o,B,L)==1){B=g;L=o}i(c,g,o,B,L)}}function S(c,g,o){var B=c.startContainer,L=c.startOffset;if(g!==c.endContainer||o!==
this.endOffset){if(f(g)!=f(B)||a.comparePoints(g,o,B,L)==-1){B=g;L=o}i(c,B,L,g,o)}}function X(c,g,o){if(g!==c.startContainer||o!==this.startOffset||g!==c.endContainer||o!==this.endOffset)i(c,g,o,g,o)}function Y(c){return function(){q(this);K(this);var g=this.startContainer,o=this.startOffset,B=this.commonAncestorContainer,L=new D(this,true);if(g!==B){g=a.getClosestAncestorIn(g,B,true);o=G(g);g=o.node;o=o.offset}n(L,T);L.reset();B=c(L);L.detach();i(this,g,o,g,o);return B}}b.prototype={attachListener:function(c,
g){this._listeners[c].push(g)},setStart:function(c,g){q(this);w(c,true);P(c,g);H(this,c,g)},setEnd:function(c,g){q(this);w(c,true);P(c,g);S(this,c,g)},setStartBefore:y(true,true),setStartAfter:y(false,true),setEndBefore:y(true,false),setEndAfter:y(false,false),collapse:function(c){q(this);K(this);c?i(this,this.startContainer,this.startOffset,this.startContainer,this.startOffset):i(this,this.endContainer,this.endOffset,this.endContainer,this.endOffset)},selectNodeContents:function(c){q(this);w(c,true);
i(this,c,0,c,M(c))},selectNode:function(c){q(this);w(c,false);E(c,C);var g=J(c);c=G(c);i(this,g.node,g.offset,c.node,c.offset)},compareBoundaryPoints:function(c,g){q(this);K(this);Z(this.startContainer,g.startContainer);var o=c==ia||c==ea?"start":"end",B=c==ha||c==ea?"start":"end";return a.comparePoints(this[o+"Container"],this[o+"Offset"],g[B+"Container"],g[B+"Offset"])},insertNode:function(c){q(this);K(this);E(c,O);T(this.startContainer);if(a.isAncestorOf(c,this.startContainer,true))throw new k("HIERARCHY_REQUEST_ERR");
this.setStartBefore(l(c,this.startContainer,this.startOffset))},cloneContents:function(){q(this);K(this);var c,g;if(this.collapsed)return v(this).createDocumentFragment();else{if(this.startContainer===this.endContainer&&a.isCharacterDataNode(this.startContainer)){c=this.startContainer.cloneNode(true);c.data=c.data.slice(this.startOffset,this.endOffset);g=v(this).createDocumentFragment();g.appendChild(c);return g}else{g=new D(this,true);c=m(g);g.detach()}return c}},extractContents:Y(x),deleteContents:Y(u),
surroundContents:function(c){q(this);K(this);T(this.startContainer);T(this.endContainer);E(c,aa);var g=new D(this,true),o=g._first&&d(g._first,this)||g._last&&d(g._last,this);g.detach();if(o)throw new F("BAD_BOUNDARYPOINTS_ERR");g=this.extractContents();if(c.hasChildNodes())for(;c.lastChild;)c.removeChild(c.lastChild);l(c,this.startContainer,this.startOffset);c.appendChild(g);this.selectNode(c)},cloneRange:function(){q(this);K(this);for(var c=new I(v(this)),g=ga.length,o;g--;){o=ga[g];c[o]=this[o]}return c},
detach:function(){t(this)},toString:function(){q(this);K(this);var c=this.startContainer;if(c===this.endContainer&&a.isCharacterDataNode(c))return c.nodeType==3||c.nodeType==4?c.data.slice(this.startOffset,this.endOffset):"";else{var g=[];c=new D(this,true);n(c,function(o){if(o.nodeType==3||o.nodeType==4)g.push(o.data)});c.detach();return g.join("")}},compareNode:function(c){q(this);K(this);var g=c.parentNode,o=a.getNodeIndex(c);if(!g)throw new k("NOT_FOUND_ERR");c=this.comparePoint(g,o);g=this.comparePoint(g,
o+1);return c<0?g>0?la:ja:g>0?ka:fa},comparePoint:function(c,g){q(this);K(this);U(c,"HIERARCHY_REQUEST_ERR");Z(c,this.startContainer);if(a.comparePoints(c,g,this.startContainer,this.startOffset)<0)return-1;else if(a.comparePoints(c,g,this.endContainer,this.endOffset)>0)return 1;return 0},createContextualFragment:function(c){q(this);var g=v(this),o=g.createElement("div");o.innerHTML=c;for(c=g.createDocumentFragment();g=o.firstChild;)c.appendChild(g);return c},intersectsNode:function(c){q(this);K(this);
U(c,"NOT_FOUND_ERR");if(a.getDocument(c)!==v(this))return false;var g=c.parentNode,o=a.getNodeIndex(c);U(g,"NOT_FOUND_ERR");c=a.comparePoints(g,o,this.startContainer,this.startOffset);g=a.comparePoints(g,o+1,this.endContainer,this.endOffset);return!(c<0&&g<0||c>0&&g>0)},isPointInRange:function(c,g){q(this);K(this);U(c,"HIERARCHY_REQUEST_ERR");Z(c,this.startContainer);return a.comparePoints(c,g,this.startContainer,this.startOffset)>=0&&a.comparePoints(c,g,this.endContainer,this.endOffset)<=0},intersectsRange:function(c){q(this);
K(this);if(v(c)!=v(this))throw new k("WRONG_DOCUMENT_ERR");return a.comparePoints(this.startContainer,this.startOffset,c.endContainer,c.endOffset)<0&&a.comparePoints(this.endContainer,this.endOffset,c.startContainer,c.startOffset)>0},containsNode:function(c,g){return g?this.intersectsNode(c):this.compareNode(c)==fa},containsNodeContents:function(c){return this.comparePoint(c,0)>=0&&this.comparePoint(c,M(c))<=0},splitBoundaries:function(){q(this);K(this);var c=this.startContainer,g=this.startOffset,
o=this.endContainer,B=this.endOffset,L=c===o;a.isCharacterDataNode(o)&&B<o.length&&a.splitDataNode(o,B);if(a.isCharacterDataNode(c)&&g>0){c=a.splitDataNode(c,g);if(L){B-=g;o=c}g=0}i(this,c,g,o,B)},normalizeBoundaries:function(){q(this);K(this);var c=this.startContainer,g=this.startOffset,o=this.endContainer,B=this.endOffset,L=function(R){var Q=R.nextSibling;if(Q&&Q.nodeType==R.nodeType){o=R;B=R.length;R.appendData(Q.data);Q.parentNode.removeChild(Q)}},ma=function(R){var Q=R.previousSibling;if(Q&&
Q.nodeType==R.nodeType){c=R;g=Q.length;R.insertData(0,Q.data);Q.parentNode.removeChild(Q);if(c==o){B+=g;o=c}}},ba=true;if(a.isCharacterDataNode(o))o.length==B&&L(o);else{if(B>0)(ba=o.childNodes[B-1])&&a.isCharacterDataNode(ba)&&L(ba);ba=!this.collapsed}if(ba)if(a.isCharacterDataNode(c))g==0&&ma(c);else{if(g<c.childNodes.length)(L=c.childNodes[g])&&a.isCharacterDataNode(L)&&ma(L)}else{c=o;g=B}i(this,c,g,o,B)},createNodeIterator:function(c,g){q(this);K(this);return new e(this,c,g)},getNodes:function(c,
g){q(this);K(this);return r(this,c,g)},collapseToPoint:function(c,g){q(this);K(this);w(c,true);P(c,g);X(this,c,g)},collapseBefore:function(c){q(this);this.setEndBefore(c);this.collapse(false)},collapseAfter:function(c){q(this);this.setStartAfter(c);this.collapse(true)},getName:function(){return"DomRange"},inspect:function(){return s(this)}};A(b)}function ca(b){b.collapsed=b.startContainer===b.endContainer&&b.startOffset===b.endOffset;b.commonAncestorContainer=b.collapsed?b.startContainer:a.getCommonAncestor(b.startContainer,
b.endContainer)}function $(b,i,t,y,H){var S=b.startContainer!==i||b.startOffset!==t,X=b.endContainer!==y||b.endOffset!==H;b.startContainer=i;b.startOffset=t;b.endContainer=y;b.endOffset=H;ca(b);z(b,"boundarychange",{startMoved:S,endMoved:X})}function I(b){this.startContainer=b;this.startOffset=0;this.endContainer=b;this.endOffset=0;this._listeners={boundarychange:[],detach:[]};ca(this)}p.requireModules(["DomUtil"]);var a=p.dom,h=a.DomPosition,k=a.DOMException;D.prototype={_current:null,_next:null,
_first:null,_last:null,isSingleCharacterDataNode:false,reset:function(){this._current=null;this._next=this._first},hasNext:function(){return!!this._next},next:function(){var b=this._current=this._next;if(b){this._next=b!==this._last?b.nextSibling:null;if(a.isCharacterDataNode(b)&&this.clonePartiallySelectedTextNodes){if(b===this.ec)(b=b.cloneNode(true)).deleteData(this.eo,b.length-this.eo);if(this._current===this.sc)(b=b.cloneNode(true)).deleteData(0,this.so)}}return b},remove:function(){var b=this._current,
i,t;if(a.isCharacterDataNode(b)&&(b===this.sc||b===this.ec)){i=b===this.sc?this.so:0;t=b===this.ec?this.eo:b.length;i!=t&&b.deleteData(i,t-i)}else b.parentNode&&b.parentNode.removeChild(b)},isPartiallySelectedSubtree:function(){return d(this._current,this.range)},getSubtreeIterator:function(){var b;if(this.isSingleCharacterDataNode){b=this.range.cloneRange();b.collapse()}else{b=new I(v(this.range));var i=this._current,t=i,y=0,H=i,S=M(i);if(a.isAncestorOf(i,this.sc,true)){t=this.sc;y=this.so}if(a.isAncestorOf(i,
this.ec,true)){H=this.ec;S=this.eo}$(b,t,y,H,S)}return new D(b,this.clonePartiallySelectedTextNodes)},detach:function(b){b&&this.range.detach();this.range=this._current=this._next=this._first=this._last=this.sc=this.so=this.ec=this.eo=null}};F.prototype={BAD_BOUNDARYPOINTS_ERR:1,INVALID_NODE_TYPE_ERR:2};F.prototype.toString=function(){return this.message};e.prototype={_current:null,hasNext:function(){return!!this._next},next:function(){this._current=this._next;this._next=this.nodes[++this._pointer];
return this._current},detach:function(){this._current=this._next=this.nodes=null}};var C=[1,3,4,5,7,8,10],N=[2,9,11],O=[1,3,4,5,7,8,10,11],aa=[1,3,4,5,7,8],da=j([9,11]),oa=j([5,6,10,12]),na=j([6,10,12]),ga=["startContainer","startOffset","endContainer","endOffset","collapsed","commonAncestorContainer"],ea=0,ha=1,pa=2,ia=3,ja=0,ka=1,la=2,fa=3;W(I,$,function(b){q(b);b.startContainer=b.startOffset=b.endContainer=b.endOffset=null;b.collapsed=b.commonAncestorContainer=null;z(b,"detach",null);b._listeners=
null});I.fromRange=function(b){var i=new I(v(b));$(i,b.startContainer,b.startOffset,b.endContainer,b.endOffset);return i};I.rangeProperties=ga;I.RangeIterator=D;I.DOMException=k;I.RangeException=F;I.copyComparisonConstants=A;I.createPrototypeRange=W;I.inspect=s;I.getRangeDocument=v;I.rangesEqual=function(b,i){return b.startContainer===i.startContainer&&b.startOffset===i.startOffset&&b.endContainer===i.endContainer&&b.endOffset===i.endOffset};I.getEndOffset=M;p.DomRange=I});
rangy.createModule("WrappedRange",function(p){function D(l,m,n,u){var x=l.duplicate();x.collapse(n);var r=x.parentElement();z.isAncestorOf(m,r,true)||(r=m);if(!r.canHaveHTML)return new J(r.parentNode,z.getNodeIndex(r));m=z.getDocument(r).createElement("span");var s,e=n?"StartToStart":"StartToEnd";do{r.insertBefore(m,m.previousSibling);x.moveToElementText(m)}while((s=x.compareEndPoints(e,l))>0&&m.previousSibling);e=m.nextSibling;if(s==-1&&e){x.setEndPoint(n?"EndToStart":"EndToEnd",l);if(/[\r\n]/.test(e.data)){r=
x.duplicate();n=r.text.replace(/\r\n/g,"\r").length;for(n=r.moveStart("character",n);r.compareEndPoints("StartToEnd",r)==-1;){n++;r.moveStart("character",1)}}else n=x.text.length;r=new J(e,n)}else{e=(u||!n)&&m.previousSibling;r=(n=(u||n)&&m.nextSibling)&&z.isCharacterDataNode(n)?new J(n,0):e&&z.isCharacterDataNode(e)?new J(e,e.length):new J(r,z.getNodeIndex(m))}m.parentNode.removeChild(m);return r}function F(l,m){var n,u,x=l.offset,r=z.getDocument(l.node),s=r.body.createTextRange(),e=z.isCharacterDataNode(l.node);
if(e){n=l.node;u=n.parentNode}else{n=l.node.childNodes;n=x<n.length?n[x]:null;u=l.node}r=r.createElement("span");r.innerHTML="&#ffef;";n?u.insertBefore(r,n):u.appendChild(r);s.moveToElementText(r);s.collapse(!m);u.removeChild(r);if(e)s[m?"moveStart":"moveEnd"]("character",x);return s}p.requireModules(["DomUtil","DomRange"]);var v,z=p.dom,J=z.DomPosition,G=p.DomRange;if(p.features.implementsDomRange)(function(){function l(d){for(var j=n.length,f;j--;){f=n[j];d[f]=d.nativeRange[f]}}var m,n=G.rangeProperties,
u,x;v=function(d){if(!d)throw Error("Range must be specified");this.nativeRange=d;l(this)};G.createPrototypeRange(v,function(d,j,f,w,q){var E=d.startContainer!==j||d.startOffset!=f;(d.endContainer!==w||d.endOffset!=q)&&d.setEnd(w,q);E&&d.setStart(j,f)},function(d){d.nativeRange.detach();d.detached=true;for(var j=n.length,f;j--;){f=n[j];d[f]=null}});m=v.prototype;m.selectNode=function(d){this.nativeRange.selectNode(d);l(this)};m.deleteContents=function(){this.nativeRange.deleteContents();l(this)};
m.extractContents=function(){var d=this.nativeRange.extractContents();l(this);return d};m.cloneContents=function(){return this.nativeRange.cloneContents()};m.surroundContents=function(d){this.nativeRange.surroundContents(d);l(this)};m.collapse=function(d){this.nativeRange.collapse(d);l(this)};m.cloneRange=function(){return new v(this.nativeRange.cloneRange())};m.refresh=function(){l(this)};m.toString=function(){return this.nativeRange.toString()};var r=document.createTextNode("test");z.getBody(document).appendChild(r);
var s=document.createRange();s.setStart(r,0);s.setEnd(r,0);try{s.setStart(r,1);u=true;m.setStart=function(d,j){this.nativeRange.setStart(d,j);l(this)};m.setEnd=function(d,j){this.nativeRange.setEnd(d,j);l(this)};x=function(d){return function(j){this.nativeRange[d](j);l(this)}}}catch(e){u=false;m.setStart=function(d,j){try{this.nativeRange.setStart(d,j)}catch(f){this.nativeRange.setEnd(d,j);this.nativeRange.setStart(d,j)}l(this)};m.setEnd=function(d,j){try{this.nativeRange.setEnd(d,j)}catch(f){this.nativeRange.setStart(d,
j);this.nativeRange.setEnd(d,j)}l(this)};x=function(d,j){return function(f){try{this.nativeRange[d](f)}catch(w){this.nativeRange[j](f);this.nativeRange[d](f)}l(this)}}}m.setStartBefore=x("setStartBefore","setEndBefore");m.setStartAfter=x("setStartAfter","setEndAfter");m.setEndBefore=x("setEndBefore","setStartBefore");m.setEndAfter=x("setEndAfter","setStartAfter");s.selectNodeContents(r);m.selectNodeContents=s.startContainer==r&&s.endContainer==r&&s.startOffset==0&&s.endOffset==r.length?function(d){this.nativeRange.selectNodeContents(d);
l(this)}:function(d){this.setStart(d,0);this.setEnd(d,G.getEndOffset(d))};s.selectNodeContents(r);s.setEnd(r,3);u=document.createRange();u.selectNodeContents(r);u.setEnd(r,4);u.setStart(r,2);m.compareBoundaryPoints=s.compareBoundaryPoints(s.START_TO_END,u)==-1&&s.compareBoundaryPoints(s.END_TO_START,u)==1?function(d,j){j=j.nativeRange||j;if(d==j.START_TO_END)d=j.END_TO_START;else if(d==j.END_TO_START)d=j.START_TO_END;return this.nativeRange.compareBoundaryPoints(d,j)}:function(d,j){return this.nativeRange.compareBoundaryPoints(d,
j.nativeRange||j)};z.getBody(document).removeChild(r);s.detach();u.detach()})();else if(p.features.implementsTextRange){v=function(l){this.textRange=l;this.refresh()};v.prototype=new G(document);v.prototype.refresh=function(){var l,m;m=this.textRange;l=m.parentElement();var n=m.duplicate(),u=n.getBookmark();n.collapse(true);m=n.parentElement();n.moveToBookmark(u);n.collapse(false);n=n.parentElement();m=m==n?m:z.getCommonAncestor(m,n);m=m==l?m:z.getCommonAncestor(l,m);if(this.textRange.compareEndPoints("StartToEnd",
this.textRange)==0)m=l=D(this.textRange,m,true,true);else{l=D(this.textRange,m,true,false);m=D(this.textRange,m,false,false)}this.setStart(l.node,l.offset);this.setEnd(m.node,m.offset)};v.rangeToTextRange=function(l){if(l.collapsed)return F(new J(l.startContainer,l.startOffset),true,true);else{var m=F(new J(l.startContainer,l.startOffset),true,false),n=F(new J(l.endContainer,l.endOffset),false,false);l=z.getDocument(l.startContainer).body.createTextRange();l.setEndPoint("StartToStart",m);l.setEndPoint("EndToEnd",
n);return l}};G.copyComparisonConstants(v);var M=function(){return this}();if(typeof M.Range=="undefined")M.Range=v}v.prototype.getName=function(){return"WrappedRange"};p.WrappedRange=v;p.createNativeRange=function(l){l=l||document;if(p.features.implementsDomRange)return l.createRange();else if(p.features.implementsTextRange)return l.body.createTextRange()};p.createRange=function(l){l=l||document;return new v(p.createNativeRange(l))};p.createRangyRange=function(l){l=l||document;return new G(l)}});
rangy.createModule("WrappedSelection",function(p,D){function F(a,h,k){var C=k?"end":"start";k=k?"start":"end";a.anchorNode=h[C+"Container"];a.anchorOffset=h[C+"Offset"];a.focusNode=h[k+"Container"];a.focusOffset=h[k+"Offset"]}function v(a){a.anchorNode=a.focusNode=null;a.anchorOffset=a.focusOffset=0;a.rangeCount=0;a.isCollapsed=true;a._ranges.length=0}function z(a){var h;if(a instanceof x){h=a._selectionNativeRange;if(!h){h=p.createNativeRange(n.getDocument(a.startContainer));h.setEnd(a.endContainer,
a.endOffset);h.setStart(a.startContainer,a.startOffset);a._selectionNativeRange=h;a.attachListener("detach",function(){this._selectionNativeRange=null})}}else if(a instanceof r)h=a.nativeRange;else if(window.Range&&a instanceof Range)h=a;return h}function J(a){a=a.getNodes();if(a.length!=1||a[0].nodeType!=1)throw Error("getSingleElementFromRange: range did not consist of a single element");return a[0]}function G(a){a._ranges.length=0;if(a.nativeSelection.type=="None")v(a);else{var h=a.nativeSelection.createRange();
a.rangeCount=h.length;for(var k,C=n.getDocument(h.item(0)),N=0;N<a.rangeCount;++N){k=p.createRange(C);k.selectNode(h.item(N));a._ranges.push(k)}a.isCollapsed=a.rangeCount==1&&a._ranges[0].collapsed;F(a,a._ranges[a.rangeCount-1],false)}}function M(a){this.nativeSelection=a;this._ranges=[];this.refresh()}function l(a,h){if(a.anchorNode&&n.getDocument(a.anchorNode)!==n.getDocument(h))throw new s("WRONG_DOCUMENT_ERR");}function m(a){var h=[],k=new e(a.anchorNode,a.anchorOffset),C=new e(a.focusNode,a.focusOffset),
N=typeof a.getName=="function"?a.getName():"Selection";if(typeof a.rangeCount!="undefined")for(var O=0,aa=a.rangeCount;O<aa;++O)h[O]=x.inspect(a.getRangeAt(O));return"["+N+"(Ranges: "+h.join(", ")+")(anchor: "+k.inspect()+", focus: "+C.inspect()+"]"}p.requireModules(["DomUtil","DomRange","WrappedRange"]);p.config.checkSelectionRanges=true;var n=p.dom,u=p.util,x=p.DomRange,r=p.WrappedRange,s=n.DOMException,e=n.DomPosition,d,j;if(p.util.isHostMethod(window,"getSelection"))d=function(a){return(a||window).getSelection()};
else if(p.util.isHostObject(document,"selection"))d=function(a){return(a||window).document.selection};else D.fail("No means of obtaining a selection object");p.getNativeSelection=d;var f=d(),w=p.createNativeRange(document),q=n.getBody(document),E=u.areHostObjects(f,u.areHostProperties(f,["anchorOffset","focusOffset"]));p.features.selectionHasAnchorAndFocus=E;var P=u.isHostMethod(f,"extend");p.features.selectionHasExtend=P;var Z=typeof f.rangeCount=="number";p.features.selectionHasRangeCount=Z;var T=
false,U=true;u.areHostMethods(f,["addRange","getRangeAt","removeAllRanges"])&&typeof f.rangeCount=="number"&&p.features.implementsDomRange&&function(){var a=q.appendChild(document.createTextNode("One")),h=q.appendChild(document.createTextNode("Two")),k=p.createNativeRange(document);k.selectNodeContents(a);var C=p.createNativeRange(document);C.selectNodeContents(h);f.removeAllRanges();f.addRange(k);f.addRange(C);T=f.rangeCount==2;f.removeAllRanges();a.parentNode.removeChild(a);h.parentNode.removeChild(h);
a=document.createElement("p");a.contentEditable=false;h=a.appendChild(document.createTextNode("test"));q.appendChild(a);k=p.createRange();k.collapseToPoint(h,1);f.addRange(k.nativeRange);U=f.rangeCount==1;f.removeAllRanges();q.removeChild(a)}();p.features.selectionSupportsMultipleRanges=T;p.features.collapsedNonEditableSelectionsSupported=U;var K=u.isHostProperty(f,"type"),V=false,A;if(q&&u.isHostMethod(q,"createControlRange")){A=q.createControlRange();if(u.areHostProperties(A,["item","add"]))V=true}p.features.implementsControlRange=
V;j=E?function(a){return a.anchorNode===a.focusNode&&a.anchorOffset===a.focusOffset}:function(a){return a.rangeCount?a.getRangeAt(a.rangeCount-1).collapsed:false};var W;if(u.isHostMethod(f,"getRangeAt"))W=function(a,h){try{return a.getRangeAt(h)}catch(k){return null}};else if(E)W=function(a){var h=n.getDocument(a.anchorNode);h=p.createRange(h);h.setStart(a.anchorNode,a.anchorOffset);h.setEnd(a.focusNode,a.focusOffset);if(h.collapsed!==this.isCollapsed){h.setStart(a.focusNode,a.focusOffset);h.setEnd(a.anchorNode,
a.anchorOffset)}return h};p.getSelection=function(a){a=a||window;var h=a._rangySelection;if(h)h.refresh();else{h=new M(d(a));a._rangySelection=h}return h};A=M.prototype;if(E&&u.areHostMethods(f,["removeAllRanges","addRange"])){A.removeAllRanges=function(){this.nativeSelection.removeAllRanges();v(this)};var ca=function(a,h){var k=x.getRangeDocument(h);k=p.createRange(k);k.collapseToPoint(h.endContainer,h.endOffset);a.nativeSelection.addRange(z(k));a.nativeSelection.extend(h.startContainer,h.startOffset);
a.refresh()};A.addRange=Z?function(a,h){if(h&&P)ca(this,a);else{var k;if(T)k=this.rangeCount;else{this.removeAllRanges();k=0}this.nativeSelection.addRange(z(a));this.rangeCount=this.nativeSelection.rangeCount;if(this.rangeCount==k+1){if(p.config.checkSelectionRanges)if((k=W(this.nativeSelection,this.rangeCount-1))&&!x.rangesEqual(k,a))a=k;this._ranges[this.rangeCount-1]=a;F(this,a,I(this.nativeSelection));this.isCollapsed=j(this)}else this.refresh()}}:function(a,h){if(h&&P)ca(this,a);else{this.nativeSelection.addRange(z(a));
this.refresh()}};A.setRanges=function(a){this.removeAllRanges();for(var h=0,k=a.length;h<k;++h)this.addRange(a[h])}}else if(u.isHostMethod(f,"empty")&&u.isHostMethod(w,"select")&&K&&V){A.removeAllRanges=function(){this.nativeSelection.empty();v(this)};A.addRange=function(a){if(this.nativeSelection.type=="Control"){var h=this.nativeSelection.createRange();a=J(a);var k=n.getDocument(h.item(0));k=n.getBody(k).createControlRange();for(var C=0,N=h.length;C<N;++C)k.add(h.item(C));k.add(a);k.select();G(this)}else{r.rangeToTextRange(a).select();
this._ranges[0]=a;this.rangeCount=1;this.isCollapsed=this._ranges[0].collapsed;F(this,a,false)}};A.setRanges=function(a){this.removeAllRanges();var h=a.length;if(h>1){var k=n.getDocument(a[0].startContainer);k=n.getBody(k).createControlRange();for(var C=0;C<h;++C)k.add(J(a[C]));k.select();G(this)}else h&&this.addRange(a[0])}}else{D.fail("No means of selecting a Range or TextRange was found");return false}A.getRangeAt=function(a){if(a<0||a>=this.rangeCount)throw new s("INDEX_SIZE_ERR");else return this._ranges[a]};
if(u.isHostMethod(f,"getRangeAt")&&typeof f.rangeCount=="number")A.refresh=function(){if(this._ranges.length=this.rangeCount=this.nativeSelection.rangeCount){for(var a=0,h=this.rangeCount;a<h;++a)this._ranges[a]=new p.WrappedRange(this.nativeSelection.getRangeAt(a));F(this,this._ranges[this.rangeCount-1],I(this.nativeSelection));this.isCollapsed=j(this)}else v(this)};else if(E&&typeof f.isCollapsed=="boolean"&&typeof w.collapsed=="boolean"&&p.features.implementsDomRange)A.refresh=function(){var a;
a=this.nativeSelection;if(a.anchorNode){a=W(a,0);this._ranges=[a];this.rangeCount=1;a=this.nativeSelection;this.anchorNode=a.anchorNode;this.anchorOffset=a.anchorOffset;this.focusNode=a.focusNode;this.focusOffset=a.focusOffset;this.isCollapsed=j(this)}else v(this)};else if(u.isHostMethod(f,"createRange")&&p.features.implementsTextRange)A.refresh=function(){var a=this.nativeSelection.createRange();if(this.nativeSelection.type=="Control")G(this);else if(a&&typeof a.text!="undefined"){a=new r(a);this._ranges=
[a];F(this,a,false);this.rangeCount=1;this.isCollapsed=a.collapsed}else v(this)};else{D.fail("No means of obtaining a Range or TextRange from the user's selection was found");return false}var $=function(a,h){var k=a.getAllRanges(),C=false;a.removeAllRanges();for(var N=0,O=k.length;N<O;++N)if(C||h!==k[N])a.addRange(k[N]);else C=true;a.rangeCount||v(a)};A.removeRange=K&&V?function(a){if(this.nativeSelection.type=="Control"){var h=this.nativeSelection.createRange();a=J(a);var k=n.getDocument(h.item(0));
k=n.getBody(k).createControlRange();for(var C,N=false,O=0,aa=h.length;O<aa;++O){C=h.item(O);if(C!==a||N)k.add(h.item(O));else N=true}k.select();G(this)}else $(this,a)}:function(a){$(this,a)};var I;if(E&&p.features.implementsDomRange){I=function(a){var h=false;if(a.anchorNode)h=n.comparePoints(a.anchorNode,a.anchorOffset,a.focusNode,a.focusOffset)==1;return h};A.isBackwards=function(){return I(this)}}else I=A.isBackwards=function(){return false};A.toString=function(){for(var a=[],h=0,k=this.rangeCount;h<
k;++h)a[h]=""+this._ranges[h];return a.join("")};A.collapse=function(a,h){l(this,a);var k=p.createRange(n.getDocument(a));k.collapseToPoint(a,h);this.removeAllRanges();this.addRange(k);this.isCollapsed=true};A.collapseToStart=function(){if(this.rangeCount){var a=this._ranges[0];this.collapse(a.startContainer,a.startOffset)}else throw new s("INVALID_STATE_ERR");};A.collapseToEnd=function(){if(this.rangeCount){var a=this._ranges[this.rangeCount-1];this.collapse(a.endContainer,a.endOffset)}else throw new s("INVALID_STATE_ERR");
};A.selectAllChildren=function(a){l(this,a);var h=p.createRange(n.getDocument(a));h.selectNodeContents(a);this.removeAllRanges();this.addRange(h)};A.deleteFromDocument=function(){if(this.rangeCount){var a=this.getAllRanges();this.removeAllRanges();for(var h=0,k=a.length;h<k;++h)a[h].deleteContents();this.addRange(a[k-1])}};A.getAllRanges=function(){return this._ranges.slice(0)};A.setSingleRange=function(a){this.setRanges([a])};A.containsNode=function(a,h){for(var k=0,C=this._ranges.length;k<C;++k)if(this._ranges[k].containsNode(a,
h))return true;return false};A.getName=function(){return"WrappedSelection"};A.inspect=function(){return m(this)};A.detach=function(){if(this.anchorNode)n.getWindow(this.anchorNode)._rangySelection=null};M.inspect=m;p.Selection=M});