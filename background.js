var db = openDatabase('mhdb', '1.0', 'Mostly Harmless Database', 5 * 1024 * 1024);
var settings = new Store("settings", {
    "cacheTime": 1,
    "freshCutoff": 90
}).toObject();
var commentsMatchPattern = /https?:\/\/www\.reddit\.com(\/r\/(.+?))?\/comments\/(.+?)\/.*/;
init();

function init() {
	setBadgeDefaults();
	chrome.tabs.onUpdated.addListener(listenToTabs);
	if(window.localStorage.getItem('installed') !== 'true') {
		installDefaults();
	}
	db.transaction(function(tx){
		// Clear cache and post data
		tx.executeSql('DELETE FROM cache');
		tx.executeSql('DELETE FROM posts');
	});
}

function installDefaults(tx) {
	window.localStorage.setItem('installed','true');
	db.transaction(function(tx) {
		tx.executeSql('CREATE TABLE IF NOT EXISTS cache (pageUrl unique, cacheDate, howManyPosts)');
		tx.executeSql('CREATE TABLE IF NOT EXISTS posts (id unique, name, likes, domain, subreddit, author, score, over_18, hidden, thumbnail, downs, permalink, created_utc, url, title, num_comments, ups, modhash)')
	});
}

function setBadgeDefaults(tabId) {
	chrome.browserAction.setBadgeBackgroundColor({
		color: [192,192,192,255] //r,g,b,a
	});
	chrome.browserAction.onClicked.removeListener(submitToReddit);
	if(tabId) {
		chrome.browserAction.setBadgeText({
			text: '?',
			tabId: tabId
		});
		chrome.browserAction.setTitle({
			title: 'Refresh the page to load data.',
			tabId: tabId
		});
	} else {
		chrome.browserAction.setBadgeText({
			text: '?',
		});
		chrome.browserAction.setTitle({
			title: 'Refresh the page to load data.'
		});
	}
}

function listenToTabs(tabId,changeInfo,tab){
	if(changeInfo.status === 'loading') {
		//If the user is at /comments instead of /r/subreddit/comments, redirect them.
		if(commentsMatchPattern.test(tab.url) && !(/https?:\/\/www\.reddit\.com\/r\/(.+?)\/comments\/(.+?)\/.*/.test(tab.url))) {
			chrome.tabs.update(tabId,{url:'http://redd.it/' + tab.url.match(commentsMatchPattern)[3]});	
		} else {
			grabData(tab.url,tabId);
		}
	}
}

function grabData(url,tabId) {
	// If the URL hasn't been cached recently, fetch it from the API.
	db.transaction(function(tx) {
		tx.executeSql('SELECT * FROM cache WHERE pageUrl=?', [url], function(tx, results) {
			var cache = results.rows;
			var isCommentsPage = commentsMatchPattern.test(url);
			if(cache.length === 0 || -(cache.item(0).cacheDate - epoch()) > 60  * settings.cacheTime ) {
				console.log('Loading from reddit api...');
				var reqUrl = new String();
				if(isCommentsPage) {
					var matches = url.match(commentsMatchPattern);
					reqUrl = 'http://www.reddit.com/by_id/t3_' + matches[3] + '.json';
				} else {
					reqUrl = 'http://www.reddit.com/api/info.json?url=' + encodeURI(url);
				}
				var api = new XMLHttpRequest();
				api.open('GET',reqUrl,false);
				api.send(null);
				if(api.status !== 200) {
					console.error('Error loading API.\nURL: ' + reqUrl + '\nStatus: ' + api.status);
					console.log(api);
					setBadgeDefaults(tabId);
				}
				api.onload = cacheData(JSON.parse(api.responseText),url,tabId,isCommentsPage);
			} else {
				console.log('Loading from cache...');
				preparePopup(url,tabId);
			}
		});
	});
}

function epoch() {
	return Math.floor(new Date().getTime()/1000);
}

function cacheData(response,pageUrl,tabId,isCommentsPage) {
	var wasCached = false;
	var freshPosts = [];
	for(var i = 0; i < response.data.children.length; i++) {
		var data = response.data.children[i].data;
		var isFreshEnough = data.created_utc >= epoch() - settings.freshCutoff * 24 * 60 * 60;
		if(isFreshEnough) {
			wasCached = true;
			freshPosts.push(data);
		}
	}
	if(wasCached === true) {
		db.transaction(function(tx) {
			var insertNum = isCommentsPage ? '...' : freshPosts.length;
			tx.executeSql('INSERT OR REPLACE INTO cache (pageUrl, cacheDate, howManyPosts) VALUES (?, ?, ?)',[pageUrl, epoch(), freshPosts.length]);
			for(var j = freshPosts.length - 1; j >= 0; j--) {
				var insertUrl = isCommentsPage ? 'http://www.reddit.com' + freshPosts[j].permalink : freshPosts[j].url.split('#')[0];
				tx.executeSql(
					'INSERT OR REPLACE INTO posts' +
					'(id, name, likes, domain, subreddit, author, score, over_18, hidden, thumbnail, downs, permalink, created_utc, url, title, num_comments, ups, modhash)' +
					'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
					[freshPosts[j].id, freshPosts[j].name, freshPosts[j].likes, freshPosts[j].domain, freshPosts[j].subreddit, freshPosts[j].author, freshPosts[j].score, freshPosts[j].over_18, freshPosts[j].hidden, freshPosts[j].thumbnail, freshPosts[j].downs, freshPosts[j].permalink, freshPosts[j].created_utc, insertUrl, freshPosts[j].title, freshPosts[j].num_comments, freshPosts[j].ups, response.data.modhash]
				);
			}
		});
	} else {
		db.transaction(function(tx) {
			tx.executeSql('INSERT OR REPLACE INTO cache (pageUrl, cacheDate, howManyPosts) VALUES (?, ?, ?)',[pageUrl, epoch(), '0',]);
		});
	}
	console.log(freshPosts);
	
	preparePopup(pageUrl,tabId);
}

function preparePopup(url,tabId) {
	// counts submissions and prepare the browserAction button appropriately
	var numberOfSubmissions;
	db.transaction(function(tx){
		tx.executeSql('SELECT * FROM cache WHERE pageUrl=?', [url], function(tx, results) {
			numberOfSubmissions = results.rows.item(0).howManyPosts;
			if(numberOfSubmissions > 0) {
				chrome.browserAction.setTitle({
					title: 'This page has been submitted to reddit ' + numberOfSubmissions + ' times.',
					tabId: tabId
				});
				chrome.browserAction.setBadgeText({
					text: numberOfSubmissions.toString(),
					tabId: tabId
				});
				chrome.browserAction.setPopup({
					popup: 'popup.html',
					tabId: tabId
				});
				chrome.browserAction.setBadgeBackgroundColor({
					color: [255,69,0,255], //r,g,b,a,
					tabId: tabId
				});
				chrome.browserAction.onClicked.removeListener(submitToReddit);
			} else if(numberOfSubmissions === '...') {
				chrome.browserAction.setTitle({
					title: 'You are currently viewing the comments for this page.',
					tabId: tabId
				});
				chrome.browserAction.setBadgeText({
					text: numberOfSubmissions,
					tabId: tabId
				});
				chrome.browserAction.setPopup({
					popup: 'popup.html',
					tabId: tabId
				});
				chrome.browserAction.setBadgeBackgroundColor({
					color: [255,69,0,255], //r,g,b,a,
					tabId: tabId
				});
				chrome.browserAction.onClicked.removeListener(submitToReddit);
			} else {
				chrome.browserAction.setTitle({
					title: 'Submit this page to reddit',
					tabId: tabId
				});
				chrome.browserAction.setBadgeText({
					text: '',
					tabId: tabId
				});
				chrome.browserAction.setPopup({
					popup: '',
					tabId: tabId
				});
				chrome.browserAction.onClicked.removeListener(submitToReddit);
				chrome.browserAction.onClicked.addListener(submitToReddit);
			}
		});
	});
}

function submitToReddit(tab){
	chrome.tabs.create({
		url: 'http://www.reddit.com/submit?url=' + encodeURI(tab.url)
	});
}