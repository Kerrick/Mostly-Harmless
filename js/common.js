var settings, cache, utils, button, reddit, background;

settings = new Store('settings', {
	'cacheTime': 3,
	'timeoutLength': 15,
	'freshCutoff': 90,
	'popupWidth': 640,
	'shamelessPlug': false,
	'waitForClick': false,
	'checkMail': true,
	'mailInterval': 5,
	'mailDisplayTime': 30,
	'mailSound': false,
	'excludedDomains': 'secure.ingdirect.com\nchaseonline.chase.com\nonline.wellsfargo.com\nmail.google.com\ndocs.google.com',
	'excludedRegex': 'chrome://.*\nchrome-extension://.*\nview-source://.*\nftp://.*\nhttps?://www\\.google\\.com/search.*\nhttps?://search\\.yahoo\\.com/search.*\nhttps?://www\\.bing\\.com/search.*\nhttps?://www\\.reddit\\.com/(?:r/(?:\\w|\\+)+/?)?(?:$|\\?count)'
});
cache = new Store('cache');

/**
 * Create a new framework of utility functions.
 * @classDescription			Creates a new framework of utility functions.
 * @type	{Object}
 * @return	{Boolean}		Returns true.
 * @constructor
 */
function MHUtils() {
	return true;
}

/**
 * Convert an array to an object with properties of the array each having empty values, for use in "in" statements.
 * @alias				MHUtils.objConvert(arr)
 * @param	{Array}		arr	The array to be converted
 * @return	{Object}		Returns the object
 * @method
 */
MHUtils.prototype.objConvert = function (arr) {
	var obj = {};
	for (var i = 0; i < arr.length; i++) {
		obj[arr[i]]='';
	}
	return obj;
};

/**
 * Escape special RegExp characters.
 * @alias				MHUtils.regexEscape(str)
 * @param	{String}	str	The string to be escaped
 * @return	{String}		Returns an escaped string
 * @method
 */
MHUtils.prototype.regexEscape = function (str) {
	return str.replace(/([.?*+\^$\[\]\\(){}\-])/g, "\\$1");
};

/**
 * Find the UNIX epoch time.
 * @alias				MHUtils.epoch()
 * @return	{Number}		Returns the current epoch time
 * @method
 */
MHUtils.prototype.epoch = function () {
	return Math.floor(new Date().getTime() / 1000);
};

/**
 * Iterate over an object.
 * @alias				MHUtils.forEachIn(object, action)
 * @return	{Boolean}		Returns true.
 * @method
 */
MHUtils.prototype.forEachIn = function (object, action) {
	for (var property in object) {
		if (object.hasOwnProperty(property)) {
			action(property, object[property]);
		}
	}
	return true;
};

/**
 * Iterates over an array.
 * @alias				MHUtils.forEach(array, action)
 * @return	{Boolean}		Returns true.
 * @method
 */
MHUtils.prototype.forEach = function (array, action) {
	for (var i = 0; i < array.length; i++) {
		action(array[i]);
	}
	return true;
};

/**
 * Parses a URL and returns a useful object. http://james.padolsey.com/javascript/parsing-urls-with-the-dom/
 * @alias				MHUtils.parseURL(url)
 * @param	{String}	url	A string with a full URL to be parsed.
 * @return	{Object}		Returns a URL object.
 * @method
 */
MHUtils.prototype.parseURL = function (url) {
	var a =  document.createElement('a');
	a.href = url;
	return {
		source: url,
		protocol: a.protocol.replace(':',''),
		host: a.hostname,
		port: a.port,
		query: a.search,
		params: (function (){
			var ret = {},
				seg = a.search.replace(/^\?/,'').split('&'),
				len = seg.length, i = 0, s;
			for (;i<len;i++) {
				if (!seg[i]) { continue; }
				s = seg[i].split('=');
				ret[s[0]] = s[1];
			}
			return ret;
		})(),
		file: (a.pathname.match(/\/([^\/?#]+)$/i) || [,''])[1],
		hash: a.hash.replace('#',''),
		path: a.pathname.replace(/^([^\/])/,'/$1'),
		relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [,''])[1],
		segments: a.pathname.replace(/^\//,'').split('/')
	};
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
		[60, 'just_now', 1], // 60
		[120, 'a_minute_ago', 'a_minute_from_now'], // 60*2
		[3600, 'minutes', 60], // 60*60, 60
		[7200, 'an_hour_ago', 'an_hour_from_now'], // 60*60*2
		[86400, 'hours', 3600], // 60*60*24, 60*60
		[172800, 'yesterday', 'tomorrow'], // 60*60*24*2
		[604800, 'days', 86400], // 60*60*24*7, 60*60*24
		[1209600, 'last_week', 'next_week'], // 60*60*24*7*4*2
		[2419200, 'weeks', 604800], // 60*60*24*7*4, 60*60*24*7
		[4838400, 'last_month', 'next_month'], // 60*60*24*7*4*2
		[29030400, 'months', 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
		[58060800, 'last_year', 'next_year'], // 60*60*24*7*4*12*2
		[2903040000, 'years', 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
		[5806080000, 'last_century', 'next_century'], // 60*60*24*7*4*12*100*2
		[58060800000, 'centuries', 2903040000] // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
	];
	var time = ('' + date_str).replace(/-/g,"/").replace(/[TZ]/g," ");
	then = new Date(time);
	utcTime = Date.UTC(then.getFullYear(), then.getMonth(), then.getDate(), then.getHours(), then.getMinutes(), then.getSeconds(), then.getMilliseconds())
	var seconds = (new Date - new Date(utcTime)) / 1000;
	var token = 'ago', list_choice = 1;
	if (seconds < 0) {
		seconds = Math.abs(seconds);
		token = 'from_now';
		list_choice = 2;
	}
	var i = 0, format;
	while (format = time_formats[i++]) if (seconds < format[0]) {
	if (typeof format[2] == 'string')
		return chrome.i18n.getMessage(format[list_choice]);
	else
		return chrome.i18n.getMessage(format[1] + '_' + token, Math.floor(seconds / format[2]).toString());
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
 * @return	{Boolean}		Returns true.
 * @constructor
 */
function BrowserAction() {
	return true;
}

/**
 * Set the browser icon badge to its defaults.
 * @alias				BrowserAction.setBadgeDefaults(tabId)
 * @param	{Number}	tabId	If given, only sets badge defaults for this tab.
 * @return	{Boolean}		Returns true.
 * @method
 */
BrowserAction.prototype.setBadgeDefaults = function (tabId) {
	chrome.browserAction.setIcon({'path': '/pix/alien-fade.png', 'tabId': tabId});
	chrome.browserAction.setBadgeText({'text': '?', 'tabId': tabId});
	chrome.browserAction.setTitle({'title': 'Click to load data.', 'tabId': tabId});
	chrome.browserAction.setBadgeBackgroundColor({'color': [192, 192, 192, 255], 'tabId': tabId});
	chrome.browserAction.setPopup({popup: '', tabId: tabId});
	chrome.browserAction.onClicked.addListener(function (tab) {
		reddit.getInfo(tab.url, tab.id);
	});
	return true;
};

/**
 * Set the browser icon badge to its ignore state.
 * @alias				BrowserAction.setBadgeIgnore(tabId)
 * @param	{Number}	tabId	If given, only sets ignore state for this tab.
 * @return	{Boolean}		Returns true.
 * @method
 */
BrowserAction.prototype.setBadgeIgnore = function (tabId) {
	chrome.browserAction.setIcon({'path': '/pix/alien-fade.png', 'tabId': tabId});
	chrome.browserAction.setBadgeText({'text': '', 'tabId': tabId});
	chrome.browserAction.setTitle({'title': chrome.i18n.getMessage('not_activated'), 'tabId': tabId});
	chrome.browserAction.setPopup({popup: '', tabId: tabId});
	chrome.browserAction.onClicked.addListener(function (tab) {
		reddit.getInfo(tab.url, tab.id);
	});
	return true;
};

/**
 * Set the browser icon badge to its loading state.
 * @alias				BrowserAction.setBadgeLoading(tabId)
 * @param	{Number}	tabId	If given, only sets loading state for this tab.
 * @return	{Boolean}		Returns true.
 * @method
 */
BrowserAction.prototype.setBadgeLoading = function (tabId) {
	chrome.browserAction.setIcon({'path': '/pix/alien.png', 'tabId': tabId});
	chrome.browserAction.setBadgeText({'text': '', 'tabId': tabId});
	chrome.browserAction.setTitle({'title': chrome.i18n.getMessage('loading'), 'tabId': tabId});
	chrome.browserAction.setPopup({popup: '', tabId: tabId});
	return true;
};

/**
 * Set the browser icon badge to its error state.
 * @alias				BrowserAction.setBadgeError(tabId, text)
 * @param	{Number}	tabId	If given, only sets loading state for this tab.
 * @param	{String}	text	Sets the badge's hover text.
 * @return	{Boolean}		Returns true.
 * @method
 */
BrowserAction.prototype.setBadgeError = function (tabId, text) {
	chrome.browserAction.setIcon({'path': '/pix/alien-fade.png', 'tabId': tabId});
	chrome.browserAction.setBadgeText({'text': '×', 'tabId': tabId});
	chrome.browserAction.setTitle({'title': text, 'tabId': tabId});
	chrome.browserAction.setBadgeBackgroundColor({'color': [200, 0, 0, 255], 'tabId': tabId});
	chrome.browserAction.setPopup({popup: '', tabId: tabId});
	chrome.browserAction.onClicked.addListener(function (tab) {
		reddit.getInfo(tab.url, tab.id);
	});
	return true;
};

/**
 * Set the browser icon badge for a page.
 * @alias				BrowserAction.setBadgeFor(url, tabId)
 * @param	{String}	url	Sets the badge according to this URL.
 * @param	{Number}	tabId	Sets the badge for this tab, if specified.
 * @return	{Boolean}		Returns true.
 * @method
 */
BrowserAction.prototype.setBadgeFor = function (url, tabId) {
	var cachedPosts;
	
	cachedPosts = cache.get(url);
	chrome.browserAction.setIcon({'path': '/pix/alien.png', 'tabId': tabId});
	
	if (cachedPosts.isCommentsPage === true) {
		chrome.browserAction.setBadgeText({'text': '...', 'tabId': tabId});
		chrome.browserAction.setTitle({'title': chrome.i18n.getMessage('viewing_comments'), 'tabId': tabId});
		chrome.browserAction.setBadgeBackgroundColor({'color': [95, 153, 207, 255], 'tabId': tabId});
		chrome.browserAction.setPopup({popup: '/html/popup.html', tabId: tabId});
	} else if (cachedPosts.count === 0) {
		chrome.browserAction.setBadgeText({'text': '+', 'tabId': tabId});
		chrome.browserAction.setTitle({'title': chrome.i18n.getMessage('submit_page'), 'tabId': tabId});
		chrome.browserAction.setBadgeBackgroundColor({'color': [0, 0, 0, 255], 'tabId': tabId});
		chrome.browserAction.setPopup({popup: '/html/popup.html', tabId: tabId});
	} else {
		chrome.browserAction.setBadgeText({'text': cachedPosts.count.toString(), 'tabId': tabId});
		chrome.browserAction.setTitle({'title': chrome.i18n.getMessage('submitted_num_times', cachedPosts.count.toString()), 'tabId': tabId});
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
 * @return	{Boolean}		Returns true.
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
 * Transmits info to the API and returns the response.
 * @alias				RedditAPI.apiTransmit(type, url, async, data)
 * @param	{String}	type	The type of HTTP request: 'GET' or 'POST'.
 * @param	{String}	url	The URL to request.
 * @param	{Object}	data	If it exists, send this as a FormData() object.
 * @param	{Function}	cback	If it exists, call this function when the request is complete, passing a parameter: the API's response as an object.
 * @return	{Object}		Returns the API's response as an object if there is no callback.
 * @method 
 */
RedditAPI.prototype.apiTransmit = function (type, url, data, cback) {
	var req, apiTimeout;
	
	function processResponse () {
		if (req.readyState === 4) {
			if (req.status === 200) {
				if (JSON.parse(req.responseText).jquery && JSON.parse(req.responseText).jquery[3][3][0] === '.error.USER_REQUIRED') {
					throw chrome.i18n.getMessage('login');
				}
				
				clearTimeout(apiTimeout);
				
				if (cback) {
					cback(JSON.parse(req.responseText));
				}
				return JSON.parse(req.responseText);
			} else {
				throw chrome.i18n.getMessage('api_error', req.status.toString());
			}
		}
	}
	
	function handleTimeout () {
		req.abort();
		throw chrome.i18n.getMessage('api_timeout', settings.get('timeoutLength').toString());
	}
	
	req = new XMLHttpRequest();
	req.open(type, url, true);
	req.onreadystatechange = processResponse;
	req.send(data);
	if (settings.get('timeoutLength') !== 31) {
		apiTimeout = setTimeout(handleTimeout, settings.get('timeoutLength') * 1000);
	}
};


/**
 * Grabs info about a URL via the reddit API and caches it, then sets the browser button.
 * @alias				RedditAPI.getInfo(url)
 * @param	{String}	url	The URL of the page to grab info about.
 * @param	{Number}	tabId	The ID of the tab to prepare.
 * @return	{Boolean}		Returns true.
 * @method
 */
RedditAPI.prototype.getInfo = function (url, tabId) {
	var apiTimeout, isCommentsPage, reqUrl, req, postsObj, postCount;
	
	function processResponse () {
		if (req.readyState === 4) {
			if (req.status === 200) {
				var response;
				
				clearTimeout(apiTimeout);
				response = JSON.parse(req.responseText);
				cache.set('modhash', response.data.modhash);
				postsObj = {};
				postCount = 0;
				
				for (i = 0; i < response.data.children.length; i++) {
					var child;
					
					child =  response.data.children[i];
					postsObj[child.data.name] = {
						'url': url,
						'data': child.data
					};
					postCount++;
				}
				
				cache.set(url, {
					'count': postCount,
					'posts': postsObj,
					'cacheDate': utils.epoch(),
					'isCommentsPage': isCommentsPage
				});
				button.setBadgeFor(url, tabId);
				return true;
			} else {
				button.setBadgeError(tabId, chrome.i18n.getMessage('api_error', req.status.toString()));
			}
		}
	}
	
	function handleTimeout () {
		req.abort();
		button.setBadgeError(tabId, chrome.i18n.getMessage('api_timeout', settings.get('timeoutLength').toString()));
	}
	
	button.setBadgeLoading(tabId);
	isCommentsPage = this.commentsMatchPattern.test(url);
	
	if (isCommentsPage) {
		var matches;
		
		matches = url.match(this.commentsMatchPattern);
		reqUrl = 'http://' + this.domain + '/by_id/t3_' + matches[3] + '.json?app=mh';
	} else {
		reqUrl = 'http://' + this.domain + '/api/info.json?app=mh&url=' + encodeURIComponent(url);
	}
	
	req = new XMLHttpRequest();
	req.open('GET', reqUrl, true);
	req.onreadystatechange = processResponse;
	req.send(null);
	if (settings.get('timeoutLength') !== 16) {
		apiTimeout = setTimeout(handleTimeout, settings.get('timeoutLength') * 1000);
	}
};

/**
 * Votes a post up.
 * @alias				RedditAPI.voteUpPost(event)
 * @param	{String}	thing	The FULLNAME of the thing to vote up.
 * @return	{Boolean}		Returns true.
 * @method
 */
RedditAPI.prototype.voteUpPost = function (e) {
	var listItem, fullName, url, reqUrl, oldCache, voteWas, formData;
	
	listItem = e.srcElement.parentNode.parentNode;
	fullName = listItem.id;
	voteWas = listItem.getAttribute('data-dir');
	url = listItem.parentNode.getAttribute('data-url');
	reqUrl = 'http://' + this.domain + '/api/vote?app=mh';
	oldCache = cache.get(url);
	formData = new FormData();
	formData.append('id', fullName);
	formData.append('uh', cache.get('modhash'));
	
	if (voteWas === '1') {
		formData.append('dir','0');
		listItem.setAttribute('data-dir','0');
		oldCache.posts[fullName].data.likes = null;
	} else if (voteWas === '0') {
		formData.append('dir','1');
		listItem.setAttribute('data-dir','1');
		oldCache.posts[fullName].data.likes = true;
	} else if (voteWas === '-1') {
		formData.append('dir','1');
		listItem.setAttribute('data-dir','1');
		oldCache.posts[fullName].data.likes = true;
	}
	
	cache.set(url, oldCache);
	this.apiTransmit('POST', reqUrl, formData);
};

/**
 * Votes a post down.
 * @alias				RedditAPI.voteDownPost(event)
 * @param	{String}	thing	The FULLNAME of the thing to vote up.
 * @return	{Boolean}		Returns true.
 * @method
 */
RedditAPI.prototype.voteDownPost = function (e) {
	var listItem, fullName, url, reqUrl, oldCache, voteWas, formData;
	
	listItem = e.srcElement.parentNode.parentNode;
	fullName = listItem.id;
	voteWas = listItem.getAttribute('data-dir');
	url = listItem.parentNode.getAttribute('data-url');
	reqUrl = 'http://' + this.domain + '/api/vote?app=mh';
	oldCache = cache.get(url);
	formData = new FormData();
	formData.append('id', fullName);
	formData.append('uh', cache.get('modhash'));
	
	if (voteWas === '1') {
		formData.append('dir','-1');
		listItem.setAttribute('data-dir','-1');
		oldCache.posts[fullName].data.likes = false;
	} else if (voteWas === '0') {
		formData.append('dir','-1');
		listItem.setAttribute('data-dir','-1');
		oldCache.posts[fullName].data.likes = false;
	} else if (voteWas === '-1') {
		formData.append('dir','0');
		listItem.setAttribute('data-dir','0');
		oldCache.posts[fullName].data.likes = null;
	}
	
	cache.set(url, oldCache);
	this.apiTransmit('POST', reqUrl, formData);
};

/**
 * Saves a post.
 * @alias				RedditAPI.savePost(event)
 * @param	{String}	thing	The FULLNAME of the thing to save.
 * @return	{Boolean}		Returns true.
 * @method
 */
RedditAPI.prototype.savePost = function (e) {
	var listItem, fullName, url, reqUrl, oldCache, formData;
	
	listItem = e.srcElement.parentNode.parentNode.parentNode;
	fullName = listItem.id;
	url = listItem.parentNode.getAttribute('data-url');
	reqUrl = 'http://' + this.domain + '/api/save?app=mh';
	oldCache = cache.get(url);
	formData = new FormData();
	formData.append('id', fullName);
	formData.append('uh', cache.get('modhash'));
	listItem.setAttribute('data-saved', 'true');
	listItem.className.replace(/\bsaved\b/,'');
	listItem.className += ' unsave';
	e.srcElement.innerHTML = chrome.i18n.getMessage('action_unsave');
	e.srcElement.onclick = function (event) {reddit.unsavePost(event)};
	oldCache.posts[fullName].data.saved = true;
	cache.set(url, oldCache);
	this.apiTransmit('POST', reqUrl, formData);
};

/**
 * Unsaves a post.
 * @alias				RedditAPI.unsavePost(event)
 * @param	{String}	thing	The FULLNAME of the thing to unsave.
 * @return	{Boolean}		Returns true.
 * @method
 */
RedditAPI.prototype.unsavePost = function (e) {
	var listItem, fullName, url, reqUrl, oldCache, formData;
	
	listItem = e.srcElement.parentNode.parentNode.parentNode;
	fullName = listItem.id;
	url = listItem.parentNode.getAttribute('data-url');
	reqUrl = 'http://' + this.domain + '/api/unsave?app=mh';
	oldCache = cache.get(url);
	formData = new FormData();
	formData.append('id', fullName);
	formData.append('uh', cache.get('modhash'));
	listItem.setAttribute('data-saved', 'false');
	listItem.className.replace(/\bunsave\b/,'');
	listItem.className += ' saved';
	e.srcElement.innerHTML = chrome.i18n.getMessage('action_save');
	e.srcElement.onclick = function (event) {reddit.savePost(event)};
	oldCache.posts[fullName].data.saved = false;
	cache.set(url, oldCache);
	this.apiTransmit('POST', reqUrl, formData);
};

/**
 * Hides a post.
 * @alias				RedditAPI.hidePost(event)
 * @param	{String}	thing	The FULLNAME of the thing to hide.
 * @return	{Boolean}		Returns true.
 * @method
 */
RedditAPI.prototype.hidePost = function (e) {
	var listItem, fullName, url, reqUrl, oldCache, formData;
	
	listItem = e.srcElement.parentNode.parentNode.parentNode;
	fullName = listItem.id;
	url = listItem.parentNode.getAttribute('data-url');
	reqUrl = 'http://' + this.domain + '/api/hide?app=mh';
	oldCache = cache.get(url);
	formData = new FormData();
	formData.append('id', fullName);
	formData.append('uh', cache.get('modhash'));
	listItem.setAttribute('data-hidestatus', 'true');
	e.srcElement.innerHTML = chrome.i18n.getMessage('action_unhide');
	e.srcElement.onclick = function (event) {reddit.unhidePost(event)};
	oldCache.posts[fullName].data.hidden = true;
	cache.set(url, oldCache);
	this.apiTransmit('POST', reqUrl, formData);
};

/**
 * Unhides a post.
 * @alias				RedditAPI.unhidePost(event)
 * @param	{String}	thing	The FULLNAME of the thing to unhide.
 * @return	{Boolean}		Returns true.
 * @method
 */
RedditAPI.prototype.unhidePost = function (e) {
	var listItem, fullName, url, reqUrl, oldCache, formData;
	
	listItem = e.srcElement.parentNode.parentNode.parentNode;
	fullName = listItem.id;
	url = listItem.parentNode.getAttribute('data-url');
	reqUrl = 'http://' + this.domain + '/api/unhide?app=mh';
	oldCache = cache.get(url);
	formData = new FormData();
	formData.append('id', fullName);
	formData.append('uh', cache.get('modhash'));
	listItem.setAttribute('data-hidestatus', 'false');
	e.srcElement.innerHTML = chrome.i18n.getMessage('action_hide');
	e.srcElement.onclick = function (event) {reddit.hidePost(event)};
	oldCache.posts[fullName].data.hidden = false;
	cache.set(url, oldCache);
	this.apiTransmit('POST', reqUrl, formData);
};

/**
 * Brings up the report confirmation dialog.
 * @alias				RedditAPI.confirmReport(event)
 * @param	{Object}	event	The event object.
 * @return	{Boolean}		Returns true.
 * @method
 */
RedditAPI.prototype.confirmReport = function (e) {
	e.srcElement.className = 'report-confirm';
	e.srcElement.removeAttribute('onclick');
	e.srcElement.innerHTML = chrome.i18n.getMessage('report_confirm');
	return true;
};

/**
 * Resets the report link.
 * @alias				RedditAPI.denyReport(event)
 * @param	{Object}	event	The event object.
 * @return	{Boolean}		Returns true.
 * @method
 */
RedditAPI.prototype.denyReport = function (e) {
	e.srcElement.parentNode.className = 'report';
	e.srcElement.parentNode.setAttribute('onclick', 'reddit.confirmReport(event)');
	e.srcElement.parentNode.innerHTML = chrome.i18n.getMessage('action_report');
	return true;
};

/**
 * Reports a post.
 * @alias				RedditAPI.reportPost(event)
 * @param	{Object}	event	The event object.
 * @return	{Boolean}		Returns true.
 * @method
 */
RedditAPI.prototype.reportPost = function (e) {
	var listItem, fullName, url, reqUrl, oldCache, formData;
	
	listItem = e.srcElement.parentNode.parentNode.parentNode.parentNode;
	fullName = listItem.id;
	url = listItem.parentNode.getAttribute('data-url');
	reqUrl = 'http://' + this.domain + '/api/report?app=mh';
	oldCache = cache.get(url);
	formData = new FormData();
	formData.append('id', fullName);
	formData.append('uh', cache.get('modhash'));
	this.apiTransmit('POST', reqUrl, formData);
	listItem.setAttribute('data-hidestatus', 'true');
	e.srcElement.parentNode.parentNode.childNodes[3].innerHTML = 'unhide';
	e.srcElement.parentNode.parentNode.childNodes[3].onclick = function (event) {reddit.unhidePost(event)};
	oldCache.posts[fullName].data.hidden = true;
	cache.set(url, oldCache);
	listItem.setAttribute('data-reportstatus', 'true');
	e.srcElement.parentNode.innerHTML = chrome.i18n.getMessage('action_reported');
};

/**
 * Submits a comment.
 * @alias				RedditAPI.submitComment(event)
 * @param	{Object}	event	The event object.
 * @return	{Boolean}		Returns true.
 * @method
 */
RedditAPI.prototype.submitComment = function (e) {
	var listItem, fullName, status, submitButton, cancelButton, textarea, comment, formData;
	
	function afterSubmission (response) {
		var url, oldCache;
		
		status.innerHTML = '';
		submitButton.innerHTML = chrome.i18n.getMessage('button_submit');
		cancelButton.innerHTML = chrome.i18n.getMessage('button_hide');
		submitButton.setAttribute('disabled');
		textarea.setAttribute('readonly');
		textarea.onkeyup = function () {return true;};
		url = document.getElementById(fullName).parentNode.getAttribute('data-url');
		oldCache = cache.get(url);
		oldCache.posts[fullName].savedCommentText = '';
		cache.set(url, oldCache);
	}
	
	submitButton = e.srcElement;
	listItem = submitButton.parentNode.parentNode.parentNode;
	fullName = listItem.id;
	status = submitButton.parentNode.getElementsByClassName('status')[0];
	cancelButton = submitButton.parentNode.getElementsByClassName('cancel')[0];
	textarea = e.srcElement.parentNode.getElementsByTagName('textarea')[0];
	comment = settings.get('shamelessPlug') ? textarea.value + '\n\n*Posted from [Mostly Harmless](http://kerrick.github.com/Mostly-Harmless), a Google Chrome extension for awesome redditors.*' : textarea.value;
	
	if (textarea.value === '') {
		status.innerHTML = chrome.i18n.getMessage('error_empty');
	} else {
		formData = new FormData();
		formData.append('thing_id', fullName);
		formData.append('text', comment);
		formData.append('uh', cache.get('modhash'));
		status.innerHTML = 'submitting...';
		try {
			reddit.apiTransmit('POST', 'http://www.reddit.com/api/comment?app=mh', formData, afterSubmission);
		} catch (error) {
			status.innerHTML = error;
		}
	}
};

/**
 * Submits a link.
 * @alias				RedditAPI.submitLink(event)
 * @param	{Object}	event	The event object.
 * @return	{Boolean}		Returns true.
 * @method
 */
RedditAPI.prototype.submitLink = function (e, tabId) {
	var url, title, subreddit, status, submitButton, formData;
	
	function afterSubmission (response) {
		if (response.jquery[22]) {
			status.innerHTML = response.jquery[22][3][0];
		} else {
			status.innerHTML = 'submitted! <a href="' + response.jquery[18][3][0] + '" target="_blank">click to view your post.</a>';
			submitButton.innerHTML = chrome.i18n.getMessage('submit_page');
			submitButton.setAttribute('disabled');
			title.setAttribute('readonly');
			subreddit.setAttribute('readonly');
			cache.remove(url);
			button.setBadgeDefaults(parseInt(tabId));
		}
	}
	
	submitButton = e.srcElement;
	status = submitButton.parentNode.getElementsByClassName('status')[0];
	title = document.getElementById('submit_title');
	subreddit = document.getElementById('submit_reddit');
	url = document.getElementById('submit_url');
	
	if (title.value === '' || subreddit.value === '') {
		status.innerHTML = chrome.i18n.getMessage('error_empty');
	} else {
		formData = new FormData();
		formData.append('title', title.value);
		formData.append('url', url.value);
		formData.append('sr', subreddit.value);
		formData.append('kind', 'link');
		formData.append('uh', cache.get('modhash'));
		status.innerHTML = 'submitting...';
		try {
			reddit.apiTransmit('POST', 'http://www.reddit.com/api/submit?app=mh', formData, afterSubmission);
		} catch (error) {
			status.innerHTML = error;
		}
	}
};

/**
 * Grabs the logged in user's reddits.
 * @alias				RedditAPI.getReddits()
 * @return	{Boolean}		Returns true.
 * @method
 */
RedditAPI.prototype.getReddits = function () {
	reddit.apiTransmit('GET', 'http://' + this.domain + '/reddits/mine.json?app=mh', null, function (response) {
		cache.set('reddits', response.data.children);
		return true;
	});
};

reddit = new RedditAPI('www.reddit.com');

/**
 * Creates a new framework of background processes
 * @classDescription			Creates a new framework of background processes.
 * @type	{Object}
 * @return	{Boolean}		Returns true.
 * @constructor
 */
function Background() {
	return true;
}

/**
 * Prepare the browser action (badge, popup, etc.) for a given tab.
 * @alias				Background.prepareBrowserAction(tabId, info, tab)
 * @param	{Number}	tabId	The ID of the tab to get data for.
 * @param	{Object}	info	The info for the change as sent by Chrome.
 * @param	{Object}	tab	The info for the tab as sent by Chrome.
 * @return	{Boolean}		Returns true.
 * @method
 */
Background.prototype.prepareBrowserAction = function (tabId, info, tab) {
	if (info.status === 'loading') {
		try {
			var excludedRegex, match;
			
			excludedRegex = settings.get('excludedRegex').split('\n');
			excludedDomains = settings.get('excludedDomains').split('\n');
			match = false;
			
			for (var i = 0; i < excludedRegex.length; i++) {
				if (tab.url.match(new RegExp(excludedRegex[i], "i")) !== null) {
					match = true;
				}
			}
			
			if (utils.parseURL(tab.url).host in utils.objConvert(excludedDomains)) {
				match = true;
			}
			
			if (settings.get('waitForClick') === false && match === false) {
				if (cache.get(tab.url) === undefined || cache.get(tab.url).cacheDate - utils.epoch() < -60  * settings.get('cacheTime')) {
					console.log(chrome.i18n.getMessage('loading_api'));
					reddit.getInfo(tab.url, tabId);
				} else {
					console.log(chrome.i18n.getMessage('loading_cache'));
					button.setBadgeFor(tab.url, tabId);
				}
			} else {
				button.setBadgeIgnore(tabId);
			}
		} catch (error) {
			button.setBadgeError(tabId, error.message);
		}
	}
	
	return true;
};

/**
 * Sets a timeout for the next time to run checkMail.
 * @alias				Background.watchMail()
 * @return	{Boolean}		Returns true.
 * @method
 */
Background.prototype.watchMail = function () {
	var mailProcess, pop;
	
	function showNotification (hasMail) {
		var notification, notificationTimeout, mailInterval;
		
		mailInterval = settings.get('mailInterval') * 1000 * 60;
		
		if (hasMail === true) {
			if (settings.get('mailSound') === true) {
				pop.play();
			}
			
			notification = webkitNotifications.createNotification(
				'/pix/mail.png',  // icon url - can be relative
				chrome.i18n.getMessage('orangered_received'),  // notification title
				chrome.i18n.getMessage('orangered_action')  // notification body text
			);
			notificationTimeout = window.setTimeout(function () {
				notification.cancel();
			}, settings.get('mailDisplayTime') * 1000);
			notification.onclick = function () {
				chrome.tabs.create({'url': 'http://' + reddit.domain + '/message/unread/', 'selected': true});
				notification.cancel();
				window.clearTimeout(notificationTimeout);
			};
			notification.show();
		}
		
		window.setTimeout(checkPrefs, mailInterval);
	}
	
	function getMail () {
		reddit.apiTransmit('GET', 'http://' + reddit.domain + '/api/me.json?app=mh', null, function (response) {
			showNotification(response.data.has_mail);
		});
	}
	
	function checkPrefs () {
		if (settings.get('checkMail') === true) {
			getMail();
		}
	}
	
	pop = document.createElement('audio');
	pop.src = '/pix/pop.ogg';
	checkPrefs();
};

/**
 * Creates a new framework of popup processes
 * @classDescription			Creates a new framework of background processes.
 * @type	{Object}
 * @return	{Boolean}		Returns true.
 * @constructor
 */
function Popup() {
	return true;
};

/**
 * Create and store the HTML for a list of posts.
 * @alias				Popup.createListHTML(url)
 * @param	{String}	url	The URL of the page to create the HTML for.
 * @return	{String}		Returns the generated HTML.
 * @method
 */
Popup.prototype.createListHTML = function (url) {
	var listHTML, staleCounter;
	
	if (cache.get(url) === undefined) {
		throw chrome.i18n.getMessage('error_not_cached');
	}
	
	listHTML = '<ol id="posts" data-url="' + url + '" data-commentspage="' + cache.get(url).isCommentsPage.toString() + '">';
	staleCounter = 0;
	
	utils.forEachIn(cache.get(url).posts, function (name, value) {
		var data, voteDir, hiddenText, hideStatus, hideAction, saveText, saveStatus, saveAction, isFreshEnough, freshText, thumbSrc, commentText;
		
		data = value.data;
		if (data.likes === true) voteDir = 1;
		if (data.likes === null)  voteDir = 0;
		if (data.likes === false) voteDir = -1;
		hideStatus = data.hidden;
		hiddenText = hideStatus === true ? 'unhide' : 'hide';
		hideAction = hideStatus === true ? 'reddit.unhidePost(event)' : 'reddit.hidePost(event)'; 
		saveStatus = data.saved;
		saveText = saveStatus === true ? 'unsave' : 'save';
		saveAction = saveStatus === true ? 'reddit.unsavePost(event)' : 'reddit.savePost(event)';
		isFreshEnough = settings.get('freshCutoff') === 91 ? 'true' : data.created_utc >= utils.epoch() - settings.get('freshCutoff') * 24 * 60 * 60;
		commentText = value.savedCommentText === undefined ? '' : value.savedCommentText;
		if (!isFreshEnough) staleCounter++;
		freshText = isFreshEnough ? 'fresh' : 'stale';
		thumbSrc = data.thumbnail.indexOf('/') === 0 ? 'http://www.reddit.com' + data.thumbnail : data.thumbnail;
		
		listHTML += '<li id="' + data.name + '" class="' + freshText  + '" data-dir="' + voteDir.toString() + '" data-savestatus="' + saveStatus + '" data-hidestatus="' + hideStatus + '">';
			listHTML += '<div class="votes">';
				listHTML += '<a class="upmod" onclick="reddit.voteUpPost(event)"></a>';
				listHTML += '<span class="count" id="count_' + data.name + '" title="' + chrome.i18n.getMessage('score', [data.ups.toString(), data.downs.toString()]) + '">' + data.score + '</span>';
				listHTML += '<a class="downmod" onclick="reddit.voteDownPost(event)"></a>';
			listHTML += '</div>';
			listHTML += '<a class="thumblink" href="http://www.reddit.com' + data.permalink + '" target="_blank" title="' + chrome.i18n.getMessage('view_on_reddit') + '">';
				listHTML += '<img class="thumb" src="' + thumbSrc + '" alt="' + data.title + '" width="70"/>';
			listHTML += '</a>';
			listHTML += '<div class="post">';
				listHTML += '<a class="link" href="http://www.reddit.com' + data.permalink + '" target="_blank" title="' + chrome.i18n.getMessage('view_on_reddit') + '">' + data.title + '</a> ';
				listHTML += '<a class="domain" href="http://www.reddit.com/domain/' + data.domain + '" target="_blank">(' + data.domain + ')</a>';
				listHTML += '<div class="meta">';
					listHTML += '<span class="timestamp">' + chrome.i18n.getMessage('submitted_when', utils.prettyDate(utils.ISODateString(new Date(data.created_utc * 1000)))) + '</span> ' + chrome.i18n.getMessage('by') + ' ';
					listHTML += '<a class="submitter" href="http://www.reddit.com/user/' + data.author + '" target="_blank">' + data.author + '</a> ' + chrome.i18n.getMessage('to') + ' ';
					listHTML += '<a class="subreddit" href="http://www.reddit.com/r/' + data.subreddit + '/" target="_blank">' + data.subreddit + '</a>';
				listHTML += '</div>';
				listHTML += '<div class="actions">';
					switch (data.num_comments) {
						case 0:
							listHTML += '<a class="comments" onclick="popup.showCommentForm(\'' + data.name + '\')">' + chrome.i18n.getMessage('add_comment_zero') + '</a>';
							break;
						case 1:
							listHTML += '<a class="comments" onclick="popup.showCommentForm(\'' + data.name + '\')">' + chrome.i18n.getMessage('add_comment_one') + '</a>';
							break;
						default:
							listHTML += '<a class="comments" onclick="popup.showCommentForm(\'' + data.name + '\')">' + chrome.i18n.getMessage('add_comment_many', data.num_comments.toString()) + '</a>';
							break;
					}
					// listHTML += '<a class="share">' + chrome.i18n.getMessage('action_share') + '</a>';
					listHTML += '<a class="save" onclick="' + saveAction + '">' + chrome.i18n.getMessage('action_' + saveText) + '</a>';
					listHTML += '<a class="hide" onclick="' + hideAction + '">' + chrome.i18n.getMessage('action_' + hiddenText) + '</a>';
					listHTML += '<a class="report" onclick="reddit.confirmReport(event)">' + chrome.i18n.getMessage('action_report') + '</a>';
				listHTML += '</div>';
			listHTML += '</div>';
			listHTML += '<form class="comment">';
				listHTML += '<fieldset>';
					listHTML += '<legend>' + chrome.i18n.getMessage('leave_comment') + '</legend>';
					listHTML += '<textarea rows="8" onkeyup="popup.cacheComment(event)" style="width:' + (settings.get('popupWidth') - 10) + 'px;">' + commentText + '</textarea>';
					listHTML += '<button type="button" class="submit" onclick="reddit.submitComment(event)">' + chrome.i18n.getMessage('button_submit') + '</button>';
					listHTML += '<button type="button" class="cancel" onclick="this.parentNode.parentNode.style.display = \'none\'">' + chrome.i18n.getMessage('button_hide') + '</button>';
					listHTML += '<span class="status"></span>';
				listHTML += '</fieldset>';
			listHTML += '</form>';
		listHTML += '</li>';
	});
	
	listHTML += '</ol>'
	
	if (staleCounter > 0) {
		listHTML += '<div id="information">' + chrome.i18n.getMessage('stale_posts_hiding', staleCounter.toString()) + '</div>';
	}
	
	return listHTML;
	
};

/**
 * Create the HTML for a submission form.
 * @alias				Popup.createSubmitForm(tab)
 * @param	{String}	tab	The Google Chrome Tab object.
 * @return	{String}		Returns the generated Form.
 * @method
 */
Popup.prototype.createSubmitForm = function (tab) {
	var submitHTML, redditCache;
	
	redditCache = cache.get('reddits');
	submitHTML = '<form id="submit">';
		submitHTML += '<h1>' + chrome.i18n.getMessage('submit_page') + '</h1>';
		submitHTML += '<fieldset>';
			submitHTML += '<label for="submit_title">' + chrome.i18n.getMessage('title') + '</label>';
			submitHTML += '<input id="submit_title" name="submit_title" type="text" />';
			submitHTML += '<input id="submit_title_suggest" type="button" value="' + chrome.i18n.getMessage('suggest_title') + '" onclick="document.getElementById(\'submit_title\').value=\'' + tab.title + '\'" />';
		submitHTML += '</fieldset>';
		submitHTML += '<fieldset>';
			submitHTML += '<label for="submit_url">' + chrome.i18n.getMessage('url') + '</label>';
			submitHTML += '<input id="submit_url" name="submit_url" type="text" readonly value="' + tab.url + '"/>';
		submitHTML += '</fieldset>';
		submitHTML += '<fieldset>';
			submitHTML += '<label for="submit_reddit">reddit</label>';
			submitHTML += '<input id="submit_reddit" name="submit_reddit" type="text" />';
			if (redditCache !== undefined || reddit.getReddits() === true) {
				submitHTML += '<strong id="your_label">' + chrome.i18n.getMessage('popular_choices') + '</strong>';
				submitHTML += '<ul id="your_reddits">';
					for (var i = 0; i < redditCache.length; i++) {
						submitHTML += '<li><a onclick="document.getElementById(\'submit_reddit\').value=\'' + redditCache[i].data.display_name + '\'">' + redditCache[i].data.display_name + '</a></li>';
					}
				submitHTML += '</ul>';
			}
		submitHTML += '</fieldset>';
		submitHTML += '<input type="button" id="submit_submit" onclick="reddit.submitLink(event, \'' + tab.id + '\')" value="' + chrome.i18n.getMessage('submit_page') + '" />';
		submitHTML += '<span class="status"></span>'
	submitHTML += '</form>';
	
	return submitHTML;
}

/**
 * Show stale posts.
 * @alias				Popup.showStalePosts()
 * @return	{Boolean}		Returns true.
 * @method
 */
Popup.prototype.showStalePosts = function () {
	var stalePosts;
	
	stalePosts = document.getElementsByClassName('stale');
	document.getElementById('information').innerHTML = chrome.i18n.getMessage('stale_posts_showing');
	
	while (stalePosts.length > 0) {
		stalePosts[0].className = 'stale-shown';
	}
};

/**
 * Show the comment form for a given post.
 * @alias				Popup.showCommentForm(postId)
 * @param	{String}	postId	The ID of the thing to show the comment form for.
 * @return	{Boolean}		Returns true.
 * @method
 */
Popup.prototype.showCommentForm = function (postId) {
	document.getElementById(postId).getElementsByClassName('comment')[0].style.display = 'block';
	return true;
};

/**
 * Cache a comment for a given post.
 * @alias				Popup.cacheComment(event)
 * @param	{Object}	event	The event object of the keyup.
 * @return	{Boolean}		Returns true.
 * @method
 */
Popup.prototype.cacheComment = function (e) {
	var value, postId, url, oldCache;
	
	value = e.srcElement.value;
	postId = e.srcElement.parentNode.parentNode.parentNode.id
	url = e.srcElement.parentNode.parentNode.parentNode.parentNode.getAttribute('data-url');
	oldCache = cache.get(url);
	oldCache.posts[postId].savedCommentText = value;
	cache.set(url, oldCache);
	return true;
};
