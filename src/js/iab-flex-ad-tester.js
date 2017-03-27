/**
 * Copyright 2017 IAB. All rights reserved
 * @author chris cole
 */

(function() {
	
	var iab = window.iab || {};
	
	var controlId = "IAB_FLEXAD_MENU",
		stylesheetId = "IAB_FLEXAD_STYLESHEET";
	
	
	
	var iabStyleSheet = null;
	

	var isFunc = function(fn){
		return typeof(fn) === 'function';
	}
	
	var util = {
		
		style: function(elem, styleObj){
			var k;
			s = elem.style;
			
			for(k in styleObj){
				if(styleObj.hasOwnProperty(k)){
					s[k] = styleObj[k];
				}				
			}
			
		},
		
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
			
			
			
			if("insertRule" in ss){
				ss.insertRule(rule, len); 
			}
			else if("addRule" in ss){
				ss.addRule(selector, styleRule, len); 
			}			
		},
		
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
		* Attaches event to DOMContentLoaded, surrounded in a try/catch
		*/
		onDocReady: function(fn){
			if(isFunc(fn)){
				
				var execFn = function(evt){
					try{
						fn.call(null, evt);
					}
					catch(ex){
						console.error(ex);
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
				console.error('IAB onDocReady: Invalid function registration for page ready');
			}
		}
		
		
	}
	
	
	
	function drawFloatingMenu(){
		var content = [
		'<div style="height: 44px;width:100%;border-bottom: 2px solid #ccc; margin:0;cursor:move;" class="iab-drag-handle" >',
		'<img src="https://www.iab.com/wp-content/themes/iab/assets/img/iab-logo.png" style="height:44px;width:auto;margin-left:10px;" />', 
		'</div>'
		];
		
		var i, n, t;
		var popc = [];
		
		content.push('<div class="iab-popup-menu"><a href="#">&#9776;</a></div>');
		
		
		
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
		
		
		var adTabs = [];
		adTabs.push('<div id="iab-flex-tab-control-wrap">',
		'<ul class="iab-tablist" role="tablist">');
		
		var tlist = [
			{label: "DFP", "active": true, tab: "#iab-flex-tab-control-wrap .iab-tab-dfp", "href": "#dfp"},
			{label: "Markup", tab: "#iab-flex-tab-control-wrap .iab-tab-markup", "href": "#markup"},
			{label: "iFrame", tab: "#iab-flex-tab-control-wrap .iab-tab-iframe", "href": "#iframe"}
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
		
		// tab content
		
		
		
		popc.push('<div class="iab-popup-heading">Toggle to Enable Ad Placements</div>',
			'<div class="iab-controls">',
			'<button type="button" class="iab-btn iab-add-dfp">Inject Google DFP Scripts</div>',
			'<ul class="iab-adlist-toggles" ></ul>\n',
			'<div class="iab-placement-controls">',
			adTabs.join(''),
			'<div class="iab-tabcontent-wrap">',
			'	<div class="iab-tabcontent iab-tab-dfp" ><label>DFP</label><div class="iab-labeled-content iabctrl-dfp"></div></div>',
			'	<div class="iab-tabcontent iab-tab-markup" style="display:none;"><label>HTML</label><div class="iab-labeled-content iabctrl-html"></div></div>',
			'	<div class="iab-tabcontent iab-tab-iframe" style="display:none;"><label>HTML</label><div class="iab-labeled-content iabctrl-html"></div></div>',
			'</div>\n',
			'</div>');
		
		
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
		
		var htmlCtl = popup.querySelector('.iab-tabcontent-wrap .iabctrl-html');
		var hbuf = [];
		hbuf.push('<div class="iab-labelrow"><label>Target Selector</label> ', 
		'<label style="font-size:.8em;"><input type="checkbox" id="iab-ElemSelectToggle" />Click to Pick Element</label>',
		'<div class="iab-labeled-content"><input type="text" id="htmlTarget" value="#topBillboardAd" /></div>',
		'</div>');
		hbuf.push('<label>HTML Content</label>');
		hbuf.push('<div><textarea style="width: 90%;height: 35px;" id="iab-htmlContent"></textarea></div>');
		hbuf.push('<label>Script</label>');
		hbuf.push('<div><textarea style="width: 90%;height: 35px;" id="iab-htmlScript"></textarea></div>');
		hbuf.push('<div><button type="button" class="iab-btn iab-ad-html" id="btnHtmlAdd">Ad Content</button></div>');
		
		
		htmlCtl.innerHTML = hbuf.join('');
		
		// attach handlers
		var dfpScriptBtn = popup.querySelector('button.iab-add-dfp');
		dfpScriptBtn.addEventListener('click', function(evt){
			var h = document.head;
			var googTag = window.googletag;
			if(googTag != null){
				return;
			}
			
			var gptScript = util.makeElement('script', {
				attrs: {
					async: 'async',
					src: 'https://www.googletagservices.com/tag/js/gpt.js'
				}
			});
			h.appendChild(gptScript);
			
			h.appendChild(util.makeElement('script', {
					html: 'var googletag = googletag || {}; googletag.cmd = googletag.cmd || [];'			
				})
			);
		});
		
		var htmlBtn = popup.querySelector('button.iab-ad-html');
		htmlBtn.addEventListener('click', function(evt){
			var sel = document.getElementById('htmlTarget').value;
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
		
		var selectToggle = popup.querySelector('#iab-ElemSelectToggle');
		
		
		var togglePickHandler = function(evt){
			console.log(evt);
			
		};
		
		
		selectToggle.addEventListener('change', function(evt){
			togglePickHandler(evt);			
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
		menuRect = el.getBoundingClientRect();
		
		if(menuRect.top > 0){
			el.style.top = "-" + new String(menuRect.top - 5) + "px";
			el._topAdjust = menuRect.top;
		}
		
		wireDragMove(el, el.querySelector('.iab-drag-handle'));
		
		// wire toggle menu
		var toggleA = el.querySelector('.iab-popup-menu a');
		
		var toggleDlg = function(evt){
			var dlg = popup; // from closure
			var isVisible = dlg.style.display == 'block';
			if(isVisible){
				dlg.style.display = 'none';
			}
			else{
				dlg.style.display = 'block';
			}			
		}
		
		toggleA.addEventListener('click', function(evt){ toggleDlg(evt); return false; });
		
		return el;
		
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

	
	
	function createIabStylesheet(){
		
		var ss = document.getElementById(stylesheetId);
		if(ss != null){
			console.log(ss.tagName);
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
		
		util.addStyleRule('.iab-popup-menu', '{ text-align: center; font-size: 2em; font-weight: bold; }');
		
		util.addStyleRule('.iab-popup-menu a', { "text-decoration": "none", "color": "black"});
		
		util.addStyleRule('.iab-labelrow', { "margin-bottom": "10px"});
		util.addStyleRule('.iab-labelrow label', { "display": "inline-block", "font-weight": "bold"});
		
		util.addStyleRule('.iab-adControlDialog', {
			"position": "absolute",
			"z-index": "20",
			"width": "400px",
			"min-height": "150px",
			"border": "3px solid #ddd",
			"border-radius": "5px",
			"background-color": "white",
			"box-shadow": "4px 4px 3px #888",
			"padding": "10px"
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
			"margin-bottom": "5px",
			"margin-top": "-15px",
			"border-left": "1px solid #ddd",
			"border-right": "1px solid #ddd",
			"border-bottom": "1px solid #ddd"
		});
		
		
		/*
		
		
<style type="text/css">
.iab-ad-unit{
	background-image: url(./ads/ad_bg.png);
	position:relative;
	overflow:hidden;
}

.iab-flexad.iab-visible{
	border: 1px solid blue;
	background-color: #c0c0c0;
}

.iab-flexad img.iab-flexsizer{
	height: auto;
	width: 100%;
	display: block;
	position: relative;
	z-index: -1;
}

.iab-flexad div.iab-adcontent{
	position: absolute;
	left:0;
	right:0;
	top:0;
	bottom:0;
}


.iab-adcontent h4{
	margin-top:0;
	margin-bottom: 50%;
	text-align: center;
}
</style>
*/
		
		
		
		styleRulesDone = true;
	}
	
	
	/**
	* @class
	* Class definition for the flex ad tester
	*
	*/
	function FlexAdTester(options){
		var o = options;
		
		
		this.setup = function(options){
			var menu = document.getElementById(controlId);
			var dlg;
			var slots = options.slots, i, s;
			
			initStyleRules();
			
			
			if(menu == null){
				menu = drawFloatingMenu();
				dlg = menu.querySelector('div.iab-adControlDialog');
				// add the slots
				for(i=0;i<slots.length;i++){
					s = slots[i];
					this.registerSlot(s, menu);
				}
			}
			
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
			
		}
		
		this.registerSlot = function(slot, menu){
			var menu = menu || document.getElementById(controlId);
			
			if(menu == null){
				var me = this;
				setTimeout(function(){
					me.registerSlot(slot);
				}, 500);
				return;				
			}
			
			var dlg = menu.querySelector('div.iab-adControlDialog');
			var list = dlg.querySelector('ul');
			var item = util.makeElement('li', {
				html: '<label><input type="checkbox" data-adid="topBillboardAd" />Top Billboard </label>'
			});
			
			list.appendChild(item);
			 /* <li>
					<label><input type="checkbox" data-adid="topBillboardAd" />Top Billboard </label>
				</li>
				*/
		}
	}
	
	
	
	function setupPage(){
		wireHandlers();
	}
	
	function toggleAdControlDialog(){
		var dlg = $('#adControlDialog');
		if(dlg.hasClass('hidden')){
			dlg.removeClass('hidden');
		}
		else{
			dlg.addClass('hidden');
		}
	}
	
	function wireHandlers(){
		
		$('#adMenu').on('click', function(evt){
			toggleAdControlDialog();
		});
		
		$('#adVisibleToggle input[type=checkbox]').on('change', function(evt){
			var el = evt.target;
			var adid = el.getAttribute('data-adid');
			var ad = $('#' + adid);
			if(el.checked){
				ad.removeClass('hidden');
			}
			else{
				ad.addClass('hidden');
			}
		});
		
		$('#btnLoadAd').on('click', function(evt){
			var url = $('#adUrl').val();
			var targ = $('#adFrameTarget').val();
			loadAdUrl(url, targ);
			toggleAdControlDialog();
		});
		
		
	}
	
	
	function drawFloatingControls(){
		
		var body = document.body;
		
		
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
	
	
	
	
	function addLoader(fn){
		
		document.addEventListener("DOMContentLoaded", function(event) {
			try{
				fn.call(null, event);
			}
			catch(ex){
				console.error(ex);
			}
		});
	}
	
	addLoader(function(evt){
		setupPage();
	});
	
	
	iab.onReady = util.onDocReady; 
	
	iab.flexAds = new FlexAdTester();
	window.iab = iab;	
	
})();