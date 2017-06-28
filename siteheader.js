/**
 * Copyright 2017 Interactive Advertising Bureau. All rights reserved
 * @author chris cole
 */

(function() {
	var root = './';
	var scripts = document.getElementsByTagName('SCRIPT');
	var path = scripts[scripts.length-1].getAttribute('src');
	if(path.indexOf('#') > -1){
		var a = path.indexOf('#root=');
		root = path.substr(a + 6);
		console.log(root);
	}
	
	
document.write('<header > \
		<div class="topNavHeader "> \
			<div class="headerWrap pageFullContentWidth"> \
			<a href="' + root + '" ><img src="' + root + 'src/images/iab-techlab-logo.png" class="techlabLogo-sm" alt="IAB"></a> \
	</div> \
		</div> \
	</header> \
	');
	
	
	
})();