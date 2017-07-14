/**
 * ...
 * @author chris cole
 */

(function() {
	
	document.write('<p>\n'
+ 'This page demonstrates a flexible sized ad container implementation serving different types of ads that can be expected during the transition period for this ad unit. The ads are being served using standard <b>Google DFP</b> GPT tags and ad delivery setup and features in combination with supported creative types, (i.e., flexible sized ad containers). '
+ 'In this test, ad tags and ad images have been provided by creative platforms <b>Flexitive</b>, <b>ResponsiveAds</b>, and <b>Flashtalking</b> which are examples of supported creative types.'
+ '</p>\n\n'
+ '<p>Please scroll down to see all four types of ad units working in the same flexible sized ad unit. '
+ 'Please refresh to see ads from different creative platforms.</p>\n\n');

	
})();


window.iabtxt = {
	
	flex: function(wh){
		return '<h4>' + wh + ' Aspect Ratio based flexible and responsive HTML ad in flexible container</h4>';
	},
	
	fixed: function(wh){
		return '<h4>' + 'Fixed size (' + wh + ') HTML ad in flexible container</h4>';
	},
	
	aspectImg: function(wh){
		return '<h4>' + wh +  ' Aspect ratio based static image ad in flexible container</h4>';
	},
	
	fixedImg: function(wh){
		return '<h4>' + 'Fixed size (' + wh + ') static image ad in flexible container</h4>';
	}
	
}


