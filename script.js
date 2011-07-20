/////////////////////////////////////////////////////////
//  Set this variable to be the ID of the "page" that  //
//   you want shown on load if one isn't in the URL.   //
/////////////////////////////////////////////////////////
var showOnLoad = 'features';


/////////////////////////////////////////////////////////
//        And the rest takes care of itself!           //
/////////////////////////////////////////////////////////
function navigate(navTo, speed, navFrom) {
	if(navFrom === undefined) {
		$('div#'+navTo).slideDown(speed,function(){
			$('div#'+navTo).addClass('current');
			window.scrollTo(0,0);
		});
		$('a[href*='+navTo+']').addClass('current');
	} else if(navTo != navFrom) {
		$('div#'+navFrom).slideUp(speed,function(){
			$('div#'+navFrom).removeClass('current');
			$('div#'+navTo).slideDown(speed,function(){
				$('div#'+navTo).addClass('current');
				window.scrollTo(0,0);
			});
		});
		$('a[href*='+navFrom+']').removeClass('current');
		$('a[href*='+navTo+']').addClass('current');
	}
}
$(document).ready(function() {
	$('div.article').hide(0);
	if(window.location.hash.substr(1)) {
		navigate(window.location.hash.substr(1),400);
	} else {
		window.location.hash = showOnLoad;
		navigate(showOnLoad,400);
	}

	$('a[href^="#"]').click(function(){
		navigate(this.href.split('#')[1],200,$('div.current.article').attr('id'));
	});
 });

//  Code is copyright Kerrick Long, 2009-2011, released under the MIT license (see index.html).