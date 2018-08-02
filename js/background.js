var background;

background = new Background();

function initBackground() {
	cache.removeAll();
	button.setBadgeDefaults();
	chrome.tabs.onUpdated.addListener(background.prepareBrowserAction);
	background.watchMail();
	window.setInterval(background.clearCache, (settings.get('cacheTime') * 60 * 1000));
	reddit.getReddits();
}

window.onload = initBackground;
