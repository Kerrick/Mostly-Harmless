var popup;

popup = new Popup();

function initPopup() {
	chrome.tabs.getSelected(null, function(currTab) {
		if (cache.get(currTab.url) !== undefined && cache.get(currTab.url).count >= 1) {
			document.getElementById('body').innerHTML = popup.createListHTML(currTab.url);
			document.getElementById('body').style.width = settings.get('popupWidth') + 'px';
		} else {
			document.getElementById('body').innerHTML = popup.createSubmitForm(currTab);
		}
		var upmods = document.getElementsByClassName("upmod")
		for (i = 0; i < upmods.length; i++) {
			upmods[i].addEventListener("click", reddit.voteUpPost.bind(reddit));
		}
		// document.getElementsByClassName("downmod").map(elem => elem.addEventListener("click", reddit.voteDownPost))
	});
}

window.addEventListener('load', initPopup);
