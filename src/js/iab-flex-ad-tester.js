/**
 * Copyright 2017 IAB. All rights reserved
 * @author chris cole
 *
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
 * Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

(function() {
	"use strict";
	
	var VERSION = "0.9";
	
	var iab = window.iab || {};
	
	var controlId = "IAB_FLEXAD_MENU",
		stylesheetId = "IAB_FLEXAD_STYLESHEET",
		elemSelectorId = 'iab-html-ad-Target';
	
	
	var flexAdSizes =
	[
		{ "sz": "2x1", "rat": "50%"},
		{ "sz": "4x1", "rat": "25%"},
		{ "sz": "6x1", "rat": "16.7%"},
		{ "sz": "8x1", "rat": "12.5%"},
		{ "sz": "1x1", "rat": "100%"},
		{ "sz": "1x2", "rat": "200%"},
		{ "sz": "1x3", "rat": "300%"},
		{ "sz": "1x4", "rat": "400%"},
		{ "sz": "9x16", "rat": "177.7%"}
	];

		
	var iabStyleSheet = null;
	

	var isFunc = function(fn){
		return typeof(fn) === 'function';
	}
	
	var isArray = function(ar){
		if(ar != null){
			if(typeof(ar) === 'object' && ar.length != undefined && !isNaN(parseInt(ar.length))){
				return true;
			}			
		}
		return false;
	}
	
	var IMG_LOGO = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAABQCAYAAADSm7GJAAAFf0lEQVR4AezBgQAAAACAoP2pF6kCAAAAAADgdu4vRKoqDuD42d3SzDaNVtI0Le+dsMVdd2YkpUKlrIgIJbSS6iXCFKO0CNEsQgQXsbSWiAj/IWT0UEQKgpQUgWSx1aKQkRhaGs3s7Loabu7unL4H7MHhznR+e/eOd2fODz53XwTB757rmT/nDm7ugbZUndM100/mUt4avJdLehtzSf8R7fsjoWLOBS413Wnf60x5X+VSvi5E6NPZFn8RVHy5wEUnl57a1Jn0MiZmMZ0pP8+feQkqplzgoDG3X+L9EhA1KPJALpmYAxVDLnDw6vWXm3i2WClfuxU8jKYz6R8UBWYV/5WeNgEqblzggGED1WPCSWRbEvOh4sYFDl7B/dLAXWlvIVTcuMABwy33N2ng7pSXhoobFzgwsLdduMnK6sWqDipuXOCgwDOnTjcbJ8EmawNUHLnARYZVud4urvfjH+kJ10LFkQtcZLRSNUTeUjJw0vtW/vLIvUyK1WRT/mx21Z/wQcM5E/XSDvswP5fpuXOvgooxF1gU+07/+rhtptwmy02FBXbjArvALvA1aLU0NsTfMQ8rsBFb8DqWYRbqUDgr0Wph9hAFrkETnsMGbEUrVuFB1GNYzhhoS5MhmXn4GH9Dl3AWO5HCf9MBbWF5yMAJtCEDXUIf9uNR1FZ74EZ8CQ2pvZhShsA3YgcGoIV+wtxqDfw8eqFDOIeeiANnoEMYwCbUVUvgGrRBR0geOHqfY2Q1BG6DrsLAxmeoq+TAy6CrOLDxZqUGTuC8C6zymF+JgfdBu8CGOoarKynwHGgX+DLPVlLgT6EhdQq70YrdOBmDwBnswSZsQwc0pI6iphICj0MftMAJPBzwD1CDh3D8CgTO4Kkiu+C70Q4tNLsSAj8NLdCOBpSaBnxfxsAn4aHUjMJeaIGNlRD4A2hL3bgFNjMJuTIE7kMaNjMav0Jb+qYSAn8Hbek1SGZtGQLvgGSWiN5qrYDAklXmQTI3lyHwvZDMCPRAWxo/3ANrS1kMZk5HHHgMpHMY2lLjcA58HbSl4xjMHIkwcB6ykb+pM6NaVnAPBjPZiFfwuIhX8B3DPXAmwt/mJuiIAy+EZOqFn3M3DPfAh6AttUEyb5ch8D5IZhW0pbOVsIt+F9rSP5gJm0mhN/rAolU8SXjHOoiS0900+YZs0n/GPK4KH+aS/uZs2n9AK1ULVQIXgRCBH4MW+B1NFrfmU9BlCtyN+yziHoEWeON/juwu5TRkV5Hjue1dMxItUMWYi7UQgetxAVrgPNYF/P/UgHU4fwXei76IzQHvtNVjBTLQQs3hTnJ657LpxCyoIOZiK+ynSbugIdWPDhxAB/pj8GlSHj/jC7SH+OJgOwKHW/D9rNy83Vls79SZ5ubRUIXMxVrIwC3Iu8+DL/MkAsccwTXxbBV78Jy5WAsZ2MxHcIGBH1Bb5GmCk000kaR3CKqQuVgbgsATkVMucD9mlbo9SwNzO89BFTIXa/LAgbMI+SoPvBZFJ9fiLZCvYP8CVCFzsTaE34teU8WBd6EGRce89JEGxjGoQuZia6iPrryKfJUF3o46i+eg1LKgzgg3WVvjsMkqnMfRDR1CBrmIAx+HDqEXL8ueSZZ4RRD3onmGN1Qhc7EV1enCidgjPbmHAWzD+DKcLhyFVvRCCx3AdIhGNzaOMDtjq8D8MkAFMRdbUZ8PbsQ7OGPxNdq3cPsVOB88EetxFLqETuzEXSrEdM2YMpZb9f4SK7eveFx54BAn/MUzDYvxAlZjKRYURA17wv9WtFoKmpuwAC9iNVZiCVpQN7TPJZv6BKt5L7H/vPSQuRP8fD+XvK0ZqhRzqVyOC+wCOy6w4wI7LrDjAjsusOMCu8COC+y4wI4L7ETuX0qdfsHy3hYcAAAAAElFTkSuQmCC";
	
	/**
	* @function
	* Log an error message
	*/
	var logErr = function(err){
		if(typeof(err) === 'string'){
			console.error('FlexAd Tester - ' + err);
			console.trace();
		}
		else
		{
			console.error(err);
		}
	}
	
	var enableDebug = true;
	var logDebug = function(msg){
		if(enableDebug){
			console.log(msg);
		}
	}
	
	/*
	* Static object collection of utility methods
	*/
	var util = {
		
		style: function(elem, styleObj){
			var k;
			var s = elem.style;
			
			for(k in styleObj){
				if(styleObj.hasOwnProperty(k)){
					s[k] = styleObj[k];
				}				
			}
			
		},
		
		/**
		* @function
		* Helper to define a css style rule.
		*
		*/
		addStyleRule: function(selector, style){
			var ss, rule, styleRule, st, index, len;
			if(iabStyleSheet == null){
				iabStyleSheet = createIabStylesheet();
			}
			
			var stringStyleRule = function(obj){
				var k;
				var sb = ['{'];
				for(k in obj){
					if(obj.hasOwnProperty(k)){
						sb.push(k, ": ", obj[k], "; ");
					}
				}
				sb.push('}');
				return sb.join('');				
			}
			
			st = typeof(style);
			ss = iabStyleSheet;
			if(st == 'string'){
				rule = selector + ' ' + style;
				styleRule = style;
			}
			else if(st == 'object'){
				styleRule = stringStyleRule(style);
				rule = selector + ' ' + styleRule;
			}
			
			len = ss.rules && ss.rules.length || 0;
			
			if(len > 0){
				len = len - 1; // ie fix
			}
			
			try{
				if("insertRule" in ss){
					ss.insertRule(rule, len); 
				}
				else if("addRule" in ss){
					ss.addRule(selector, styleRule, len); 
				}
			}
			catch(ex){
				logErr("Error defining style rule for " + selector);
				logErr(ex);
				try{
					len = len - 1; // ie fix again
					if("insertRule" in ss){
						ss.insertRule(rule, len); 
					}
					else if("addRule" in ss){
						ss.addRule(selector, styleRule, len); 
					}
				}
				catch(ex){
					logErr("Fatal error in try2 for style define");
				}
			}
		},
		
		/**
		* @function
		* Dynamically insert and execute javascript statments
		*
		*/
		injectScript: function(opts){
			var h = document.head,
				s;
			if(opts.src){
				s = util.makeElement('script', { attrs: opts});
				
				h.appendChild(s);

			}
			else if(opts.code){
				s = util.makeElement('script', { html: opts.code});
				h.appendChild(s);
			}
		},
		
		/**
		* @function
		* Helper function to make DOM elements.
		*/
		makeElement: function(tag, options){
			var opts = options || {};
			var k;
			
			var el = document.createElement(tag);
			if(opts.style){
				util.style(el, opts.style);
			}
			if(opts.attrs){
				for(k in opts.attrs){
					if(opts.attrs.hasOwnProperty(k)){
						el.setAttribute(k, opts.attrs[k]);
					}
				}
			}
			if(opts.html){
				el.innerHTML = opts.html;
			}
			
			return el;
		},
		
		/**
		* Shortcut method to document.querySelector. 
		* @param selector The CSS selector to use
		* @param el A DOM element. If unspecified the document object is used.
		*/
		qsel: function(selector, el){
			var elem = el || document;
			return elem.querySelector(selector);
		},
		
		/**
		* Shortcut method to document.querySelector. 
		* @param selector The CSS selector to use
		* @param el A DOM element. If unspecified the document object is used.
		*/
		qselHard: function(selector, el){
			var elem = el || document;
			if(selector.indexOf('#') == 0 && selector.indexOf(' ') == -1){
				var s = selector.substr(1);
				return util.byId(s);
			}
			return elem.querySelector(selector);
		},

		
		byId: function(id){
			return document.getElementById(id);
		},
		
		/**
		* Shortcut method to document.querySelectorAll. 
		* @param selector The CSS selector to use
		* @param el A DOM element. If unspecified the document object is used.
		*/
		qselA: function(selector, el){
			var elem = el || document;
			return elem.querySelectorAll(selector);
		},
		
		/**
		* Checks to see if el has the given css class name
		*/
		hasClass: function(className, el){
			var cn = el.className || '',
				items = cn.split(' ');
				
			for(i=0;i<items.length;i++){
				if(items[i] == className){
					return true;
				}
			}
			
			return false;
		},
		
		addClass: function(className, el){
			var cn = el.className || '';
			
			el.className = cn + ' ' + className;
			return el;
		},
		
		/**
		* @function
		* Remove a CSS class name
		*/
		removeClass: function(className, el){
			var i;
			var cn = el.className || '',
				items = cn.split(' '),
				clist = [];
				
			for(i=0;i<items.length;i++){
				if(items[i] == className){
					continue;
				}
				clist.push(items[i]);
			}
			
			el.className = clist.join(' ');
			return el;
		},
		
		/**
		* @function
		* Generate a random ID.
		* @param verifyDomUnique True to test the DOM for uniqueness before returning ID.
		*/
		randId: function(seed, verifyDomUnique){
			var min=55, max = 987634;
			var rand = Math.floor(Math.random() * (max-min) + min);
			var seed = seed || "iab-newId-";
			var id = seed + rand;
			
			if(verifyDomUnique){
				var el = util.byId(id);
				if(el == null){
					return id;
				}
				return util.randId(verifyDomUnique);
			}
			else{
				return id;
			}
		},

		
		/**
		* @function
		* Attach an event listener to an element
		*/
		
		off: function(eventName, element, fn){
			util.eventAction(eventName, false, element, fn);
		},
				
		on: function(eventName, element, fn, opts){
			util.eventAction(eventName, true, element, fn, opts);
		},

		eventAction: function(eventName, isAttach, element, fn, opts){
			var elem, elemList, i;
			if(!eventName || !element || !fn){
				logErr('invalid event listener attachment - bad element or function parameter');
				return;
			}
			
			if(typeof(element) === 'string'){
				elem = util.qselA(element);
			}
			else{
				elem = element;
			}
			
			if(isArray(elem)){
				elemList = elem;
			}
			
			if(elemList && elemList.length > 0){
				for(i=0;i<elemList.length;i++){
					elem = elemList[i];
					if(isAttach){
						elem.addEventListener(eventName, fn, opts);
					}
					else{
						elem.removeEventListener(eventName, fn);
					}
				}
			}
			else{			
				if(isAttach){
					elem.addEventListener(eventName, fn, opts);
				}
				else{
					elem.removeEventListener(eventName, fn);
				}
			}
		},
		
		/**
		* Attaches event to DOMContentLoaded, surrounded in a try/catch
		*/
		onDocReady: function(fn){
			if(isFunc(fn)){
				
				var execFn = function(evt){
					try{
						fn.call(null, evt);
					}
					catch(ex){
						logErr(ex);
					}					
				};
				
				if(document.readyState === 'complete'){
					execFn.call(null);
				}
				else{			
					document.addEventListener('DOMContentLoaded', execFn);
				}
			}
			else{
				logErr('IAB onDocReady: Invalid function registration for page ready');
			}
		}
		
		
	}
	/**
	* @function
	* Recursively search up the DOM tree to see if we are in a flex container
	* that is already registered as an ad slot.
	*/
	function searchFlexSlotElement(elem){
		var result = searchFlexSlotDown.call(this, elem);
		if(result.found){
			return result;
		}
		else{
			return searchFlexSlotUp.call(this, elem);
		}
	}
	
	function searchFlexSlotDown(elem){
		var i, n, kids, klm, rslt;
		var me = this;
		var adSlots = this.adSlots;
		
		var result = {
			found: false,
			slotKey: null,
			element: null,
			isDown: true
		}
		
		var adSlots = me.adSlots;
		
		if(elem == null || !elem.hasChildNodes()){
			logDebug('no kids');
			return result;
		}
		kids = elem.childNodes;
		
		var slotKey = elem.getAttribute('data-slotkey');
		if(slotKey != null){
			result.found = true;
			result.slotKey = slotKey;
			result.element = elem;
			result.adSlot = adSlots[slotKey];
			return result;
		}
		
		for(i=0;i<kids.length;i++){
			klm = kids[i];
			result = searchFlexSlotDown.call(this, klm);
			if(result.found){
				return result;
			}
		}
		
		logDebug('final down');
		return result;
	}
	
	function searchFlexSlotUp(elem){
		var i, n, parent;
		var adSlots = this.adSlots;

		
		var result = {
			found: false,
			slotKey: null,
			element: null
		}
		
		if(elem.parentNode == null || elem.tagName == 'BODY'){
			return result;
		}
		
		var slotKey = elem.getAttribute('data-slotkey');
		if(slotKey != null){
			result.found = true;
			result.slotKey = slotKey;
			result.element = elem;
			result.adSlot = adSlots[slotKey];
			
			return result;
		}
		
		return searchFlexSlotUp.call(this, elem.parentNode);
	}
	
	
	
	/**
	* @function
	* Event handler code to inject a DFP ad into the given location.
	* Grabs values from the popup form, verifies the targeted element exists
	* Then enters into logic flow for container and ad insertion or re-insertion
	*
	* This function is bound to the FlexAdTester instance
	*/
	function injectDfpSlot(){
		var el;
		var elemSelector = util.byId(elemSelectorId).value; // text field with Ad selector
		var adId = util.byId('iab-dfpSlotId').value;  // DFP system ad identifier
		var adSize = util.byId('iab-flexSlotSize').value; // Ad size dropdown
		var dfpSelect = util.byId('iab-dfpAdSelect');
		
		if(dfpSelect != null && dfpSelect.value != null){
			adId = dfpSelect.value;
		}
		
		var opts = {
			elementSelector: elemSelector,
			adSize: adSize,
			content: {
				type: 'dfp',
				dfpId: adId
			}
		};
		
		createOrUpdateAd.call(this, opts);
	}
	
	/**
	* @function
	* Resolves the target element, Identifies or inserts the ad slot, 
	* Adjusts slot size, then injects the ad code
	*
	* This function is bound to the FlexAdTester instance
	*/
	function createOrUpdateAd(opts){
		var me = this; // FlexAdTester instance
		var el,
			elemSelector = opts.elementSelector;
			
		var slotKey;
		
		el = util.qselHard(elemSelector);
		/*
		if(elemSelector.indexOf('#') == 0 && elemSelector.indexOf(' ') == -1){
			el = util.byId(elemSelector.substr(1));
		}
		if(!el){		
			el = util.qsel(elemSelector);
		}
		*/
		if(!el){
			logErr('Invalid element selector');
			return;
		}
		
		
		var flexSlot = searchFlexSlotElement.call(me, el);
		var a;
		logDebug(flexSlot);
		
		var adSlotObj = {};
		
		if(flexSlot.found){
			// Adjust all pointers in object.
			adSlotObj = flexSlot.adSlot;
			if(adSlotObj.size != opts.adSize){
				adSlotObj.newSize = opts.adSize;
				adSlotObj.oldSize = adSlotObj.size;
			}
		}
		else{
			adSlotObj = {
				selector : elemSelector, 
				key: util.randId("my-iab-ad", false),
				adtype: "flex",
				ad: {
					divid: util.randId(null, true)
				}
			}			
		}
		
		adSlotObj.size = opts.adSize;
		a = adSlotObj.ad;
		a.type = opts.content.type;
		if(a.type == 'dfp'){
			a.adid = opts.content.dfpId;
		}
		
		if(flexSlot.found){
			if(adSlotObj.newSize != null){
				adjustAdSlot.call(me, adSlotObj);
			}
			me.injectAd(adSlotObj);
		}
		else{
			// create slot
			me.createSlot(adSlotObj);
			// slotKey = ...
		}
		

	}
	
	function drawFloatingMenu(opts){
		var content = [
		'<div style="height: 44px;width:100%;border-bottom: 2px solid #ccc; margin:0;cursor:move;" class="iab-drag-handle" >',
		'<img src="', IMG_LOGO, '" style="height:44px;width:auto;margin-left:10px;" />', 
		'</div>'
		];
		
		var i, n, t, sz;
		var popc = [];
		var me = this; // hook to iab ad popup object
		var opts = opts || {},
			dfpAds = opts.dfpAds || []
		
		content.push('<div class="iab-popup-menu"><a href="javascript:void(0);">&#9776;</a></div>');
		
		var el = util.makeElement('div', {
			style: {
				"position": "fixed",
				"top" : "0",
				"left" : "50%",
				backgroundColor: "white",
				"overflow": "visible",
				minWidth: "50px",
				minHeight: "100px",
				border: "1px solid red",
				zIndex: 10000,
				boxShadow: "2px 1px 5px #ccc"
			},
			html: content.join('')
		});
		
		var elSel = [];
		var adTabs = [];
		adTabs.push('<div id="iab-flex-tab-control-wrap">',
		'<ul class="iab-tablist" role="tablist">');
		
		var tlist = [
			{label: "DFP", "active": true, tab: "#iab-flex-tab-control-wrap .iab-tab-dfp", "href": "#dfp"},
			{label: "Markup", tab: "#iab-flex-tab-control-wrap .iab-tab-markup", "href": "#markup"}
		]
		
		for(i=0;i<tlist.length;i++){
			t = tlist[i];
			adTabs.push('<li class="iab-tab ')
			if(t.active){
				adTabs.push(' active ');
			}
			adTabs.push('" role="presentation" >',
				'<a href="', t.href, '" class="iab-tablink" role="tab" data-target-tab="', t.tab, '" >', t.label, '</a>',
				'</li>\n');
		}
		adTabs.push('</ul>');
		
		elSel.push('<div class="iab-labelrow" style="margin-top:10px;"><label>Target Selector</label> ', 
		'<div class="iab-labeled-content"><input type="text" id="', elemSelectorId, '" value="" class="iab-formcontrol" placeholder="CSS Selector or DIV Id" /></div>',
		'<button type="button" class="iab-button" id="iab-ElemSelectToggle" />Toggle Element<br/> Selection</button>',		
		'</div>');
		
		elSel.push('<div class="iab-unit-size-selector">',
			'<fieldset class="iab-fieldset"><legend>Flex Container Size</legend>');
		elSel.push('<fieldset  class="injectradios iab-fieldset">',
			'<label style="margin-right:5px"><input type="checkbox" id="iab-chk-injectContainer" checked="checked" /> Inject Flex Container</label>',
			'<label><input type="checkbox" id="iab-chk-resizeContainer" checked="checked" /> Resize Existing Container</label>',
			'</fieldset>');
		
		elSel.push('<div><span class="iab-label">Unit Size</span><select class="iab-formcontrol" id="iab-flexSlotSize" ></select></div>');
		
		elSel.push('</fieldset></div>');

		// tab content
		
		//			'<button type="button" class="iab-btn iab-add-dfp">Inject Google DFP Scripts</div>',
		
		popc.push('<div class="iab-gradient"><div class="iab-popup-heading">Flex Ad SDK Tester</div>',
			'<div class="iab-popup-panelContents">',
			'<div class="iab-controls">',
			elSel.join(''),
			'<ul class="iab-adlist-toggles" ></ul>\n',
			'<div class="iab-placement-controls">',
			adTabs.join(''),
			'<div class="iab-tabcontent-wrap">',
			'	<div class="iab-tabcontent iab-tab-dfp" ><div class="iab-labeled-content iabctrl-dfp"></div></div>',
			'	<div class="iab-tabcontent iab-tab-markup" style="display:none;"><label>HTML</label><div class="iab-labeled-content iabctrl-html"></div></div>',
			'</div>\n',
			'</div>\n',
			'</div></div>');
		
		
		var popup = util.makeElement('div', {
			style: {
				"display": "none"
			},
			attrs: {
				"class": "iab-adControlDialog",
				"id": "IABadControlDialog"
			},
			html: popc.join('')			
		});
		
		el.appendChild(popup);
		
		/**
		* Toggle dialog display
		*/
		var toggleDlg = function(evt, popupDialog){
			var dlg = popupDialog || popup; // from closure
			var isVisible = dlg.style.display == 'block';
			if(isVisible){
				dlg.style.display = 'none';
			}
			else{
				dlg.style.display = 'block';
			}			
		}
		

		
		var dfpCtl = popup.querySelector('.iab-tabcontent-wrap .iabctrl-dfp');
		var dbuf = [];
		dbuf.push('<div class="iab-tab-panel">');
		dbuf.push('<div><span class="iab-label">DFP Slot Id</span>',
			'<input type="text" class="iab-formcontrol" id="iab-dfpSlotId" value="/3790/Flex1:1" /></div>');
		if(dfpAds && dfpAds.length > 0){
			dbuf.push('<div>or from dropdown<br/>\n<select class="iab-formcontrol" id="iab-dfpAdSelect">');
			dbuf.push('<option value="" selected="selected" style="color:#ccc;">Select Ad from list</option>');
			for(i=0;i<dfpAds.length;i++){
				dbuf.push('<option value="', dfpAds[i], '" >', dfpAds[i], '</option>');				
			}
			
			dbuf.push('</select></div>');
		}
		dbuf.push('<div><button type="button" class="iab-btn iab-bottom " id="iab-btnDfpAdd">Insert DFP</button></div>');
		dbuf.push('</div>');
		//flexAdSizes
		
		dfpCtl.innerHTML = dbuf.join('');
		
		var htmlCtl = popup.querySelector('.iab-tabcontent-wrap .iabctrl-html');
		var hbuf = [];
		hbuf.push('<label>HTML Content</label>');
		hbuf.push('<div><textarea style="width: 90%;height: 35px;" id="iab-htmlContent"></textarea></div>');
		hbuf.push('<label>Script</label>');
		hbuf.push('<div><textarea style="width: 90%;height: 35px;" id="iab-htmlScript"></textarea></div>');
		hbuf.push('<div><button type="button" class="iab-btn iab-bottom iab-ad-html" id="btnHtmlAdd">Insert Content</button></div>');
		
		
		htmlCtl.innerHTML = hbuf.join('');

		var toggleGrabBtn = util.qsel('#iab-ElemSelectToggle', popup);
		
		
		var flexSizeDrop = util.qsel('#iab-flexSlotSize', popup);
		var dropbuf = [];
		for(i=0;i<flexAdSizes.length;i++){
			sz = flexAdSizes[i].sz;
			dropbuf.push('<option value="', sz, '" >', sz, '</option>');
		}
		
		flexSizeDrop.innerHTML = dropbuf.join('');
		
		
		// attach handlers
		var dfpBtn = util.qsel('#iab-btnDfpAdd', popup);
		
		util.on('click', dfpBtn, function(evt){
			injectDfpSlot.call(me);
			toggleDlg(evt, popup);
		});
		
		/**
		* @function
		* Handle element selection for ad unit targeting
		*/
		var grabElement = function(evt){
			logDebug('grabElement ')
			var targ = evt.target;
			var prevbg = targ.style.backgroundColor;
			var id = targ.getAttribute('id');
			if(id == null){
				id = util.randId(null, true);
				targ.setAttribute('id', id);
			}
			
			targ.style.backgroundColor="red";
			unsetSelectToggle();
			setClickToggleListener(false);
			toggleDlg(evt, popup);

			
			setTimeout(function(){
				var txt = util.byId(elemSelectorId);
				targ.style.backgroundColor=prevbg;
				txt.value = '#' + id;
				txt.style.backgroundColor="red";
				txt.style.color="white";
				setTimeout(function(){
					txt.style.backgroundColor="white";
					txt.style.color="black";
				}, 500);
			}, 400);
		}
		
		
		var iframeClickMonitorId = 0;
		/**
		* @function
		* Monitor function for if user clicks on an iframe
		*/
		var iframeMonitor = function(){
			var elem = document.activeElement;
			var par, parId;
			if(elem && elem.tagName == 'IFRAME'){
				clearInterval(iframeClickMonitorId);
				par = elem.parentNode;
				parId = par.getAttribute('id');
				if(parId && parId.indexOf('google_ads_iframe') > -1 && parId.indexOf('__container__') > -1){
					par = par.parentNode;
				}
				grabElement({ target: par });
			}
		}
		
		/**
		* @function
		* toggle the click to pick functions on or off
		*/
		var setClickToggleListener = function(attach){
			var dom = document.body;
			//var iframes = util.qselA('iframe');
			
			if(attach){
				util.on('click', dom, grabElement);
				iframeClickMonitorId = setInterval(iframeMonitor, 100);
			}
			else{
				util.off('click', dom, grabElement);
				clearInterval(iframeClickMonitorId);
			}			
		}
		
		var unsetSelectToggle = function(){
			
			logDebug('unsetSelectToggle ')
			
			var b = toggleGrabBtn;
			b.setAttribute('data-active', null);
			util.removeClass('iab-active', b);
			util.removeClass('iab-clickselect-active', document.body);
		}
		
		//
		util.on('click', toggleGrabBtn, function(evt){
			var b = toggleGrabBtn;
			var state = b.getAttribute('data-active');
			if(state == "active"){
				unsetSelectToggle();
				setClickToggleListener(false);
			}
			else{
				setTimeout(function(){
					toggleDlg(evt, popup); // Hide dialog during selection
				}, 250);
				b.setAttribute('data-active', 'active');
				util.addClass('iab-active', b);
				setTimeout(function(){
					util.addClass('iab-clickselect-active', document.body);
					setClickToggleListener(true);
				}, 10);
			}
			
		});
		
		
		var htmlBtn = popup.querySelector('button.iab-ad-html');
		util.on('click', htmlBtn, function(evt){
			var sel = document.getElementById(elemSelectorId).value;
			var content = document.getElementById('iab-htmlContent').value;
			var scrip = document.getElementById('iab-htmlScript').value;
			
			var targ = document.querySelector(sel);
			targ.innerHTML = content;
			var tcn = targ.className;
			if(targ.style.display == 'none' || tcn.indexOf('hide') > -1 || tcn.indexOf('hidden') > -1){
				targ.style.display = 'block';
			}
			
			if(scrip && scrip.length > 0){			
				var test = document.createElement('script');
				test.innerHTML = scrip;
			}
			
			document.head.appendChild(test);
			
		});
		
		
		// Build a closure for the tab events
		(function(){
			var n;
			var tabs = popup.querySelectorAll('ul.iab-tablist > li.iab-tab');
			var tabLinks = popup.querySelectorAll('ul.iab-tablist > li.iab-tab > a.iab-tablink');
			var tabContents = popup.querySelectorAll('div.iab-tabcontent-wrap > div.iab-tabcontent');
			
			var hideTabs = function(){
				var i, t;
				for(i=0;i<tabContents.length;i++){
					t = tabContents[i];
					t.style.display = "none";
				}
			}
			
			var linkClick = function(evt){
				var n, className, atab;
				var ct = evt.currentTarget;
				var curTab = ct.parentElement;
				var targ = ct.getAttribute('data-target-tab');
				hideTabs();
				var tc = popup.querySelector(targ);
				tc.style.display = "block"
				
				if(curTab.className.indexOf('active') == -1){
					curTab.className += ' active';
				}
				
				for(n=0;n<tabs.length;n++){
					atab = tabs[n];
					className = atab.className;
					
					if(atab == curTab || className.indexOf('active') == -1){
						continue;
					}
					atab.classList.remove('active');					
				}
				
				evt.preventDefault();
				return false;
			}
			
			for(n=0;n<tabLinks.length;n++){
				tabLinks[n].addEventListener('click', linkClick);
			}
			
			
		})();
		
		
		document.body.appendChild(el);
		
		
		
		// check for being not at top.
		var ot = el.offsetTop;
		var menuRect = el.getBoundingClientRect();
		
		if(menuRect.top > 0){
			el.style.top = "-" + new String(menuRect.top - 5) + "px";
			el._topAdjust = menuRect.top;
		}
		
		wireDragMove(el, el.querySelector('.iab-drag-handle'));
		
		// wire toggle menu
		var toggleA = el.querySelector('.iab-popup-menu a');
		
		toggleA.addEventListener('click', function(evt){ toggleDlg(evt, popup); return false; });
		
		return el;
		
	}
	
	/**
	* @function
	* Inserts the Dfp support scripts if not already present.
	*/
	function insertDfpScripts(){
		var googTag = window.googletag;
		if(googTag != null){
			return;
		}
		
		util.injectScript({ src: 'https://www.googletagservices.com/tag/js/gpt.js', async: 'async'});
		util.injectScript({ code: 'var googletag = googletag || {}; googletag.cmd = googletag.cmd || [];'});
	}
	
	function wireDragMove(el, dragElem){
		
		el.inDrag = false;
		
		var handleDragStart = function(evt){
			el.inDrag = true;
			el.style.opacity = "0.6";
			el.style.borderWidth = "3px";
			el._dragoff = {
				x: evt.offsetX,
				y: evt.offsetY
			};
		}
		
		var handleDragging = function(evt){
			var top = evt.clientY;
			var left = evt.clientX;
			var adj = el._topAdjust || 0;
			var doff = el._dragoff || {x: 0, y:0},
				dx = doff.x,
				dy = doff.y;
				
				
			// Firefox does not implement the DnD API correctly, so no coordinates
			// https://bugzilla.mozilla.org/show_bug.cgi?id=505521
			if(top == 0 && left == 0){
				return;
			}
			
			
			top = top - adj - dy;
			left -= dx;
			
			el.style.left = new String(left) + 'px';
			el.style.top = new String(top) + 'px';
		}
		
		var handleDragEnd = function(evt){
			var top = evt.clientY;
			var left = evt.clientX;
			var adj = el._topAdjust || 0;
			var doff = el._dragoff || {x: 0, y:0},
				dx = doff.x,
				dy = doff.y;
			
			// Firefox does not implement the DnD API correctly, so no coordinates
			// https://bugzilla.mozilla.org/show_bug.cgi?id=505521
			
			el.inDrag = false;
			el.style.borderWidth = "1px";
			el.style.opacity = "1";
			// debugger;
			
			if(top == 0 && left == 0){
				left = (evt.screenX - window.screenX);
				top = (evt.screenY - window.screenY) - 60;
				if(top < 0){
					top = 10;
				}
				//return;
			}

				
			top = top - adj - dy;
			left -= dx;
			
			
			el.style.left = new String(left) + 'px';
			el.style.top = new String(top) + 'px';
			
		}
		
		
		dragElem.addEventListener('dragstart', handleDragStart);
		dragElem.addEventListener('dragend', handleDragEnd);
		dragElem.addEventListener('drag', handleDragging);
		
		
		// debugger;
		
	}

	/**
	* @function
	* Create a new stylesheet for our IAB style classes and append to the DOM.
	*/
	function createIabStylesheet(){
		
		var ss = document.getElementById(stylesheetId);
		if(ss != null){
			logDebug(ss.tagName);
			return ss.sheet;
		}
		else{
			ss = util.makeElement('style', { attrs: { type: "text/css", "id": stylesheetId}});
			// WebKit hack :(
			ss.appendChild(document.createTextNode(""));

			document.head.appendChild(ss);
			
			return ss.sheet;
		}
	}
	
		
	var styleRulesDone = false;
	
	/**
	* @function
	* Initialize and add our IAB style rules
	*/
	function initStyleRules(){
		if(styleRulesDone == true){
			return;
		}
		
		injectIabAdContainerStyleRules();
		injectIabFlexAdSDKStyleRules();
		
		styleRulesDone = true;
	}
	
	/**
	* @function
	* Inject style rules for the base set of flex ad containers.
	*/
	function injectIabAdContainerStyleRules(){
		
		util.addStyleRule('.iab-flexad', { "display": "block", "position": "relative" });
		util.addStyleRule('.iab-flexsizer', { "display": "block", "position": "relative", "z-index": "-1"});
		util.addStyleRule('.iab-flexad div.iab-adcontent', 
			{ 
				"display": "block", "position": "absolute", "left": "0", "right": "0", "top": "0", "bottom": "0", 
				"text-align": "center" 
			});
				
		var sizes = flexAdSizes;
		
		var i, sel, f;
		for(i=0;i<sizes.length;i++){
			f = sizes[i];
			sel = '.iab-flexsizer.flex-' + f.sz;
			util.addStyleRule(sel, { "width": "100%", "padding-top": f.rat});
		}
		
		// helper class to make ad units visible
		util.addStyleRule('.iab-flex-units-visible .iab-flexad', 
			{ 
				"border": "0.5px solid orange"
			});
	}
	
	
	/**
	* @function
	* Add CSS classes to support the IAB flex widget.
	*/
	function injectIabFlexAdSDKStyleRules(){
		
		util.addStyleRule('.iab-popup-menu', '{ text-align: center; font-size: 2em; font-weight: bold; }');
		
		util.addStyleRule('.iab-popup-menu a', { "text-decoration": "none", "color": "black"});
		
		util.addStyleRule('.iab-labelrow', { "margin-bottom": "10px"});
		util.addStyleRule('.iab-labelrow label', { "display": "inline-block", "font-weight": "bold"});
		
		util.addStyleRule('fieldset.iab-fieldset', {
			"font-size": "0.8em",
			"margin-bottom": "3px",
			"border-radius": "4px",
			"padding": "14px 4px",
			"border": "1px solid rgba(0,0,0,0.3)"
		});
		
		util.addStyleRule('.iab-label', 
		{
			"font-weight": "bold",
			"display": "inline-block",
			"margin-right": "5px",
			"line-height": "1.2em"
		});
		util.addStyleRule('.iab-button', 
		{ 
			"display": "inline-block", 		
			"padding": "6px 12px",
			"margin": "3px",
			"cursor": "pointer",
			"border-radius": "4px",
			"border": "1px solid #2e6da4",
			"background-color": "#337ab7",
			"color": "#fff"
		});
		
		util.addStyleRule('.iab-button.iab-active', 
		{ 
			"background": "#444",
			"color": "white"
		});
		
		util.addStyleRule('.iab-adControlDialog input, .iab-adControlDialog select',
		{
			"padding": "4px"
		});
		
		util.addStyleRule('.iab-adControlDialog select',
		{
			"padding": "4px",
			"min-width": "250px"
		});
		
		util.addStyleRule('.iab-formcontrol::placeholder', {
			"color": "#ccc",
			"font-style": "italic"
		});
		/*
		util.addStyleRule('.iab-formcontrol::-ms-input-placeholder', {
			"color": "#ccc",
			"font-style": "italic"
		});
		*/
		
		util.addStyleRule('.iab-gradient', {
			"background": "linear-gradient(99deg,  rgba(238,50,36,0.65) 0%,rgba(140,30,21,.10) 41%,rgba(0,0,0,0) 100%)"
		});
		
		util.addStyleRule('.iab-popup-panelContents', {
			"padding": "10px",
			"padding-top": "0"
		});
			
		
		util.addStyleRule('.iab-adControlDialog', {
			"position": "absolute",
			"z-index": "20",
			"width": "400px",
			"min-height": "150px",
			"border": "3px solid #EE3224",
			"border-radius": "5px",
			"background-color": "white",
			"box-shadow": "4px 4px 3px #888",
			"padding": "0"
		});
		
		util.addStyleRule('.iab-btn', {
			display: "inline-block",
			padding: "5px 10px",
			"margin-bottom": 0,
			"font-size": "11pt",
			"font-weight": "600",
			"color" : "#444",
			"line-height": "1.3",
			"text-align": "center",
			"white-space": "nowrap",
			"vertical-align": "middle",
			"-ms-touch-action": "manipulation",
			"touch-action": "manipulation",
			cursor: "pointer",
			"user-select": "none",
			"background-image": "none",
			"background-color": "#eee",
			"border": "1px solid #666",
			"border-radius": "4px",
		});
		util.addStyleRule('.iab-btn:hover', {
			"background-color": "#ffe",
			"color": "#000"
		});
		
		util.addStyleRule('.iab-btn.iab-bottom', {
			"position": "absolute",
			"bottom": "5px"
		});
		
		util.addStyleRule('.iab-popup-heading', {
			"background-color": "rgba(238,50,36,1)",
			"color": "#fff",
			"font-size": "1.2em",
			"font-weight": "bold",
			"padding": "10px"
		});
		
		// Tab control styles
		util.addStyleRule('ul.iab-tablist',
		{
			"margin-bottom": "15px",
			"border-bottom": "1px solid #ddd",
			"list-style": "none"
		});
		util.addStyleRule('ul.iab-tablist:before',
		{
			"display": "table",
			"content": " "
		});

		// 			"float": "left",

		util.addStyleRule('ul.iab-tablist > li.iab-tab',
		{
			"display": "inline-block",
			"text-align": "center",
			"margin-bottom": "-1px"
		});
		util.addStyleRule('ul.iab-tablist > li.iab-tab > a',
		{
			"margin-right": "2px",
			"line-height": 1.425,
			"border-radius": "4px 4px 0 0",
			"position": "relative",
			"display": "block",
			"padding": "10px 15px",
			"cursor": "pointer",
			"border": "1px solid transparent",
			"text-decoration": "none"
		});
		
		util.addStyleRule('ul.iab-tablist > li.iab-tab > a:hover',
		{
			"background-color": "#eee"
		});
		
		util.addStyleRule('ul.iab-tablist > li.iab-tab.active > a:hover, ul.iab-tablist > li.iab-tab.active > a',
		{
			"color": "black",
			"cursor": "default",
			"background-color": "#fff",
			"border": "1px solid #ddd",
			"border-bottom-color": "transparent"
		});
		
		util.addStyleRule('.iab-tabcontent', {
			"min-height": "150px",
			"padding": "10px",
			"padding-bottom": "40px",
			"margin-bottom": "5px",
			"margin-top": "-15px",
			"border-left": "1px solid #ddd",
			"border-right": "1px solid #ddd",
			"border-bottom": "1px solid #ddd",
			"position": "relative"
		});
		
		
		util.addStyleRule('.iab-clickselect-active iframe:hover', {
			  "background-color": "rgba(192,192,160,0.5)"
		});
		
		
		styleRulesDone = true;
	}
	
	
	function adSizer(obj){
		var t = obj.adtype || 'flex';
		if(t == 'flex'){
			return 'flex-' + obj.size;		
		}
		else{
			return '';
		}		
	}
	
	
	/**
	* @function
	* Adjust the ad slot for resize issues
	*/
	function adjustAdSlot(obj){
		var i, c, newClass = [];
		var anchor = util.qsel(obj.selector);
		var sizerElem, domSize, sizerCss;
		if(anchor == null){
			logErr('Invalid selector for slot: ' + obj.selector);
			return;
		}
		
		sizerElem = anchor.querySelector('div.iab-flexad > div.iab-flexsizer');
		sizerCss = sizerElem.className;
		if(sizerCss){
			sizerCss = sizerCss.split(' ');
		}
		else{
			return;
		}
		
		sizerElem.className = 'iab-flexsizer flex-' + obj.newSize;
		delete obj.newSize;
		delete obj.oldSize;
	}
	
	
	
	// =====================================================================================
	
	/**
	* @class
	* Flex ad tester SDK.
	*
	*/
	function FlexAdTester(options){
		var o = options;
		
		this.adSlots = {};
		
		/**
		* Release version number for this SDK.
		*/
		this.version = VERSION;
		
		/**
		* @function
		* Setup of the SDK
		*
		* @param options Object with settings for configuration of SDK
		*	{
		*		controls: true|false True to draw menu
		*		unitsVisible: true|false True to add style for drawing a border around flex units
		*		dfpAds: string array of DFP ad ids
		*		slots: array of objects Object definitions for ad units and ad slots to initialize
		*
		*/
		this.setup = function(options){
			var menu = document.getElementById(controlId);
			var dlg;
			var slots = options.slots, i, s;
			var bodyClass;
			var me = this;
			this.options = options
			
			initStyleRules();
			
			
			if(menu == null && options.controls){
				menu = drawFloatingMenu.call(me, options);
				dlg = menu.querySelector('div.iab-adControlDialog');
			}
			
			// add the slots
			if(slots){
				for(i=0;i<slots.length;i++){
					s = slots[i];
					//this.registerSlot(s, menu);
					this.createSlot(s);
				}
			}
			
			// Make ad units visible if specified
			if(options.unitsVisible){
				bodyClass = document.body.className;
				if(bodyClass == null){
					document.body.className = 'iab-flex-units-visible';
				}
				else{
					document.body.className += ' iab-flex-units-visible';
				}
			}
			
			/*
			var pauseVideo = function(){
				var vids = document.querySelectorAll('video');
				var i, v;
				for(i=0; i<vids.length; i++){
					v = vids[i];
					v.pause();
				}
			}
			
			var callPause = function(){
				pauseVideo();
				setTimeout(callPause, 3000);
			};
			
			setTimeout(callPause, 1500);
			*/
			
			return this;
		}
		
		/**
		* @function
		* Create a new ad slot with a wrapper.
		*/
		this.createSlot = function(obj){
			var buf = [];
			var ads = this.adSlots;
			var me = this;
			
			var anchor = util.qselHard(obj.selector);
			if(anchor == null){
				logErr('Invalid selector for slot: ' + obj.selector);
				return;
			}
			
			if(typeof(obj.key) !== 'string'){
				logErr('must specify a key in ad slot');
				return;
			}
			
			if(ads[obj.key] != null){
				logErr('ad key already defined: ' + obj.key);
				return;
			}
			
			ads[obj.key] = obj;
			
			buf.push('<div class="iab-flexad" data-slotkey="', obj.key, '" ><div class="iab-flexsizer ');
			buf.push(adSizer(obj));
			buf.push('" ></div><div class="iab-adcontent"></div></div>');
			
			anchor.innerHTML = buf.join('');
			obj.built = true;
			
			if(obj.ad != null){
				setTimeout(function(){
					me.injectAd(obj.ad, obj.key);
				}, 1);
			}
		}
		
		/**
		* @function
		* Inject an ad unit into the defined slot
		* @param adObj The ad object
		* @param slotKey Key corresponding to the ad slot target registered through createSlot
		*/
		this.injectAd = function(adObj, slotKey){
			var key = slotKey || adObj.key;
			var ads = this.adSlots;
			var obj = ads[key];
			var adActual = adObj;
			var googQryVal;
			
			if(adActual.ad != null){
				adActual = adActual.ad;
			}
			
			if(!obj){
				logErr('Unregistered ad key used: ' + slotKey);
				return;
			}
			
			var anchor = util.qselHard(obj.selector),
				el = util.qsel('.iab-adcontent', anchor),
				adEl, adPar;
				
			if(adActual.type == 'dfp'){
				insertDfpScripts();
				adEl = document.getElementById(adActual.divid);
				if(adEl == null && adActual.divid.indexOf('#') > -1){
					adActual.divid = adActual.divid.substr(adActual.divid.indexOf('#') + 1);
					adEl = document.getElementById(adActual.divid);
				}
				if(adEl == null){
					adEl = util.makeElement('div', { attrs: { id: adActual.divid }});
					el.appendChild(adEl);
				}
				else{
					adEl.innerHTML = ''; // clear existing content
				}
				
				// If existing DFP, delete it and create new DOM
				googQryVal = adEl.getAttribute('data-google-query-id');
				if(googQryVal != null){
					adPar = adEl.parentNode;
					adPar.removeChild(adEl);
					adActual.divid = util.randId('mynewAd-el', true);
					adEl = util.makeElement('div', { attrs: { id: adActual.divid }});
					el.appendChild(adEl);					
				}				
				
				
				var codeFn = function(){
					var code = [];
					
					code.push('googletag.cmd.push(function() {',
						'googletag.defineSlot("',
						adActual.adid,
						'", [1,1], "',
						adActual.divid,
						'").addService(googletag.pubads());',
						'googletag.pubads().enableSingleRequest();',
						'googletag.enableServices();',
					'});',
					'googletag.cmd.push(function() { googletag.display("', adActual.divid, '"); });'
					);
					
					util.injectScript({ code: code.join('')});
				}
				
				setTimeout(codeFn, 1);
			}
		}
	}
	
	
	function toggleAdControlDialog(){
		
		var dlg = util.qsel('#adControlDialog');
		if(util.hasClass('hidden', dlg)){
			util.removeClass('hidden', dlg);
		}
		else{
			util.addClass('hidden', dlg);
		}
	}
	
	
	function loadAdUrl(url, target){
		var elem = $('#' + target);
		var ifr = elem.find('iframe');
		var frame;
		elem.removeClass('hidden');
		
		if(ifr.length == 0){
			elem.append('<iframe scrolling="no" class="adFrame" style="width:100%;height:100%;position:absolute;left:0;top:0;"></iframe>');
			ifr = elem.find('iframe');			
		}
		
		ifr.attr('src', url);
	}
	
	/**
	* @function
	* Add the given function to the document.DOMContentLoaded.
	* This is equivalent to $document.ready in jQuery.
	*/
	function addLoader(fn){
		
		document.addEventListener("DOMContentLoaded", function(event) {
			try{
				fn.call(null, event);
			}
			catch(ex){
				logErr(ex);
			}
		});
	}
	
	iab.onReady = util.onDocReady; 
	
	iab.flexAds = new FlexAdTester();
	window.iab = iab;	
	
})();