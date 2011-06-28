var settings, cache, utils, button, reddit, background;

settings = new Store('settings').toObject();
cache = new Store('cache');

/**
 * Create a new framework of utility functions.
 * @classDescription			Creates a new framework of utility functions.
 * @type	{Object}
 * @return	{Boolean}			Returns true.
 * @constructor
 */
function MHUtils() {
	return true;
}

/**
 * Escape special RegExp characters.
 * @alias						MHUtils.regexEscape(str)
 * @param	{String}	str		The string to be escaped
 * @return	{String}			Returns an escaped string
 * @method
 */
MHUtils.prototype.regexEscape = function (str) {
	return str.replace(/([.?*+\^$\[\]\\(){}\-])/g, "\\$1");
};

/**
 * Find the UNIX epoch time.
 * @alias						MHUtils.epoch()
 * @return	{Number}			Returns the current epoch time
 * @method
 */
MHUtils.prototype.epoch = function () {
	return Math.floor(new Date().getTime() / 1000);
};

/*
 * JavaScript Pretty Date
 * Thanks to Dean Landolt's comment on
 * http://ejohn.org/blog/javascript-pretty-date/#postcomment
 */
// Takes an ISO time and returns a string representing how
// long ago the date represents.
MHUtils.prototype.prettyDate = function (date_str) {
  var time_formats = [
  [60, 'just now', 1], // 60
  [120, '1 minute ago', '1 minute from now'], // 60*2
  [3600, 'minutes', 60], // 60*60, 60
  [7200, '1 hour ago', '1 hour from now'], // 60*60*2
  [86400, 'hours', 3600], // 60*60*24, 60*60
  [172800, 'yesterday', 'tomorrow'], // 60*60*24*2
  [604800, 'days', 86400], // 60*60*24*7, 60*60*24
  [1209600, 'last week', 'next week'], // 60*60*24*7*4*2
  [2419200, 'weeks', 604800], // 60*60*24*7*4, 60*60*24*7
  [4838400, 'last month', 'next month'], // 60*60*24*7*4*2
  [29030400, 'months', 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
  [58060800, 'last year', 'next year'], // 60*60*24*7*4*12*2
  [2903040000, 'years', 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
  [5806080000, 'last century', 'next century'], // 60*60*24*7*4*12*100*2
  [58060800000, 'centuries', 2903040000] // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
];
  var time = ('' + date_str).replace(/-/g,"/").replace(/[TZ]/g," ");
  then = new Date(time);
  utcTime = Date.UTC(then.getFullYear(), then.getMonth(), then.getDate(), then.getHours(), then.getMinutes(), then.getSeconds(), then.getMilliseconds())
  var seconds = (new Date - new Date(utcTime)) / 1000;
  var token = 'ago', list_choice = 1;
  if (seconds < 0) {
	seconds = Math.abs(seconds);
	token = 'from now';
	list_choice = 2;
  }
  var i = 0, format;
  while (format = time_formats[i++]) if (seconds < format[0]) {
	if (typeof format[2] == 'string')
	  return format[list_choice];
	else
	  return Math.floor(seconds / format[2]) + ' ' + format[1] + ' ' + token;
  }
  return time;
};

/*
 * ISO 8601 Formatted Dates
 * Gotten from the Mozilla Developer Center
 */
MHUtils.prototype.ISODateString = function (d) {
 function pad(n){return n<10 ? '0'+n : n}
 return d.getUTCFullYear()+'-'
	  + pad(d.getUTCMonth()+1)+'-'
	  + pad(d.getUTCDate())+'T'
	  + pad(d.getUTCHours())+':'
	  + pad(d.getUTCMinutes())+':'
	  + pad(d.getUTCSeconds())+'Z'
};

utils = new MHUtils();

/**
 * Create a new instance of the browser action button and its popup. ONLY CALL THIS ONCE!
 * @classDescription			Creates a new browser icon.
 * @type	{Object}
 * @return	{Boolean}			Returns true.
 * @constructor
 */
function BrowserAction() {
	return true;
}

/**
 * Set the browser icon badge to its defaults.
 * @alias						BrowserAction.setBadgeDefaults()
 * @param	{Number}	tabId	If given, only sets badge defaults for this tab.
 * @return	{Boolean}			Returns true.
 * @method
 */
BrowserAction.prototype.setBadgeDefaults = function (tabId) {
	chrome.browserAction.setBadgeText({'text': '?', 'tabId': tabId});
	chrome.browserAction.setTitle({'title': 'Refresh the page to load data.', 'tabId': tabId});
	chrome.browserAction.setBadgeBackgroundColor({'color': [192, 192, 192, 255], 'tabId': tabId});
	return true;
};

/**
 * Set the browser icon badge for a page.
 * @alias						BrowserAction.setBadgeFor(url, tabId)
 * @param	{String}	url		Sets the badge according to this URL.
 * @param	{Number}	tabId	Sets the badge for this tab, if specified.
 * @return	{Boolean}			Returns true.
 * @method
 */
BrowserAction.prototype.setBadgeFor = function (url, tabId) {
	var cachedPosts;
	
	cachedPosts = cache.get(url);
	
	if (cachedPosts.isCommentsPage === true) {
		chrome.browserAction.setBadgeText({'text': '...', 'tabId': tabId});
		chrome.browserAction.setTitle({'title': 'You are currently viewing the comments for this page.', 'tabId': tabId});
		chrome.browserAction.setBadgeBackgroundColor({'color': [95, 153, 207, 255], 'tabId': tabId});
		chrome.browserAction.setPopup({popup: '/html/popup.html', tabId: tabId});
	} else if (cachedPosts.api.length === 0) {
		chrome.browserAction.setBadgeText({'text': '+', 'tabId': tabId});
		chrome.browserAction.setTitle({'title': 'Submit this page.', 'tabId': tabId});
		chrome.browserAction.setBadgeBackgroundColor({'color': [0, 0, 0, 255], 'tabId': tabId});
		chrome.browserAction.setPopup({popup: '/html/popup.html', tabId: tabId});
	} else {
		chrome.browserAction.setBadgeText({'text': cachedPosts.api.length.toString(), 'tabId': tabId});
		chrome.browserAction.setTitle({'title': 'This page has been submitted ' + cachedPosts.api.length.toString() + ' times.', 'tabId': tabId});
		chrome.browserAction.setBadgeBackgroundColor({'color': [255, 69, 0, 255], 'tabId': tabId});
		chrome.browserAction.setPopup({popup: '/html/popup.html', tabId: tabId});
	}
	
	return true;
};

button = new BrowserAction();

/**
 * Create a new instance of a reddit-powered website.
 * @classDescription			Creates a new reddit-powered website.
 * @param	{String}	domain	The base domain of the reddit-powered website. (e.g. 'www.reddit.com')
 * @type	{Object}
 * @return	{Boolean}			Returns true.
 * @constructor
 */
function RedditAPI(domain) {
	if (domain) {
		this.domain = domain;
	} else {
		this.domain = 'www.reddit.com';
	}
	this.commentsMatchPattern = new RegExp('https?:\/\/' + utils.regexEscape(this.domain) + '(\/r\/(.+?))?\/comments\/(.+?)\/.*');
	return true;
}

/**
 * Grabs info about a URL via the reddit API and caches it.
 * @alias						RedditAPI.getInfo(url)
 * @param	{String}	url		The URL of the page to grab info about.
 * @return	{Boolean}			Returns true.
 * @method
 */
RedditAPI.prototype.getInfo = function (url) {
	var reqUrl, isCommentsPage, req;
	
	isCommentsPage = this.commentsMatchPattern.test(url);
	
	if (isCommentsPage) {
		var matches;
		
		matches = url.match(this.commentsMatchPattern);
		reqUrl = 'http://' + this.domain + '/by_id/t3_' + matches[3] + '.json';
	} else {
		reqUrl = 'http://' + this.domain + '/api/info.json?url=' + encodeURI(url);
	}
	
	req = new XMLHttpRequest();
	req.open('GET', reqUrl, false);
	req.send(null);
	
	if (req.status !== 200) {
		console.warn(req);
		throw 'Error loading API.\nURL: ' + reqUrl + '\nStatus: ' + req.status.toString();
	}
	
	cache.set(url, {
		'api': JSON.parse(req.responseText).data.children,
		'cacheDate': utils.epoch(),
		'isCommentsPage': isCommentsPage
	});
	
	return true;
};

reddit = new RedditAPI('www.reddit.com');

/**
 * Creates a new framework of background processes
 * @classDescription			Creates a new framework of background processes.
 * @type	{Object}
 * @return	{Boolean}			Returns true.
 * @constructor
 */
function Background() {
	return true;
}

/**
 * Prepare the browser action (badge, popup, etc.) for a given tab.
 * @alias						Background.prepareBrowserAction(tabId, info, tab)
 * @param	{Number}	tabId	The ID of the tab to get data for.
 * @param	{Object}	info	The info for the change as sent by Chrome.
 * @param	{Object}	tab		The info for the tab as sent by Chrome.
 * @return	{Boolean}			Returns true.
 * @method
 */
Background.prototype.prepareBrowserAction = function (tabId, info, tab) {
	if (info.status === 'loading') {
		button.setBadgeDefaults(tabId);
		
		if (cache.get(tab.url) === undefined || cache.get(tab.url).cacheDate - utils.epoch() < -60  * settings.cacheTime) {
			console.log('Grabbing data from the API...');
			reddit.getInfo(tab.url);
		} else {
			console.log('Grabbing data from the cache...');
		}
		
		button.setBadgeFor(tab.url, tabId);
	}
	
	return true;
};

/**
 * Creates a new framework of popup processes
 * @classDescription			Creates a new framework of background processes.
 * @type	{Object}
 * @return	{Boolean}			Returns true.
 * @constructor
 */
function Popup() {
	return true;
}

/**
 * Create and store the HTML for a list of posts.
 * @alias						Popup.createListHTML(url)
 * @param	{String}	url		The URL of the page to create the HTML for.
 * @return	{String}			Returns the generated HTML.
 * @method
 */
Popup.prototype.createListHTML = function (url) {
	var listHTML;
	
	if (cache.get(url) === undefined) {
		throw 'Cannot create list HTML for a non-cached URL.';
	}
	
	listHTML = '<ol id="posts" data-url="' + url + '">';
	
	for(var i = 0; i < cache.get(url).api.length; i++) {
		var data, voteDir, entry, hiddenText, saveText, thumbSrc;
		
		data = cache.get(url).api[i].data;
		console.log(data);
		if (data.likes === true) voteDir = 1;
		if (data.likes === null)  voteDir = 0;
		if (data.likes === false) voteDir = -1;
		hiddenText = data.hidden === true ? 'hidden' : 'hide';
		saveText = data.saved === true ? 'saved' : 'save';
		thumbSrc = data.thumbnail.indexOf('/') === 0 ? 'http://www.reddit.com' + data.thumbnail : data.thumbnail;
		
		listHTML += '<li id="' + data.name + '" class="' + hiddenText + ' ' + saveText + '" data-dir="' + voteDir.toString() + '">';
			listHTML += '<div class="votes">';
				listHTML += '<a class="upmod" onclick="reddit.voteUp(\'' + data.name + '\')"></a>';
				listHTML += '<span class="count" id="count_' + data.name + '" title="' + data.ups + ' up votes, ' + data.downs + ' down votes">' + data.score + '</span>';
				listHTML += '<a class="downmod" onclick="reddit.voteDown(\'' + data.name + '\')"></a>';
			listHTML += '</div>';
			listHTML += '<a class="thumblink" href="http://www.reddit.com' + data.permalink + '" target="_blank" title="View this post on reddit">';
				listHTML += '<img class="thumb" src="' + thumbSrc + '" alt="' + data.title + '" width="70"/>';
			listHTML += '</a>';
			listHTML += '<div class="post">';
				listHTML += '<a class="link" href="http://www.reddit.com' + data.permalink + '" target="_blank" title="View this post on reddit">' + data.title + '</a> ';
				listHTML += '<a class="domain" href="http://www.reddit.com/domain/' + data.domain + '" target="_blank">(' + data.domain + ')</a>';
				listHTML += '<div class="meta">';
					listHTML += '<span class="timestamp">submitted ' + utils.prettyDate(utils.ISODateString(new Date(data.created_utc * 1000))) + '</span> by ';
					listHTML += '<a class="submitter" href="http://www.reddit.com/user/' + data.author + '" target="_blank">' + data.author + '</a> to ';
					listHTML += '<a class="subreddit" href="http://www.reddit.com/r/' + data.subreddit + '/" target="_blank">' + data.subreddit + '</a>';
				listHTML += '</div>';
				listHTML += '<div class="actions">';
					listHTML += '<a class="comments" href="http://www.reddit.com' + data.permalink + '" target="_blank">' + data.num_comments + ' comments</a>';
					listHTML += '<a class="share">share</a>';
					listHTML += '<a class="save">' + saveText + '</a>';
					listHTML += '<a class="hide">' + hiddenText + '</a>';
					listHTML += '<a class="report">report</a>';
				listHTML += '</div>';
			listHTML += '</div>'
		listHTML += '</li>';
	}
	
	listHTML += '</ol>'
	return listHTML;
	
};
