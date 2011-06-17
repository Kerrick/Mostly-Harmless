var db = openDatabase('mhdb', '1.0', 'Mostly Harmless Database', 5 * 1024 * 1024);
var cacheTime;
var over18;
init();

function init() {
	if(window.localStorage.getItem('installed') !== 'true') {
		installDefaults();
	}
	db.transaction(function(tx){
		tx.executeSql('SELECT * FROM prefs WHERE pref=?', ['cacheTime'], function(tx, results) {
			cacheTime = results.rows.item(0).choice;
		});
		tx.executeSql('SELECT * FROM prefs WHERE pref=?', ['over18'], function(tx, results) {
			over18 = results.rows.item(0).choice;
		});
	});
}
chrome.tabs.getSelected(undefined, function(currTab) {
	buildPage(currTab.url);
});
function buildPage(pageUrl) {
	db.transaction(function(tx){
		tx.executeSql('SELECT * FROM posts WHERE url=?', [pageUrl], function(tx, results) {
			document.getElementById('posts').setAttribute('data-modhash',results.rows.item(0).modhash);
			document.getElementById('posts').setAttribute('data-url',pageUrl);
			var children = results.rows;
			var now = new Date();
			for(var i = 0; i < children.length; i++) {
				var data = children.item(i);
				var entry = document.createElement('li');
					entry.id = data.name;
					if (data.likes === 'true')  entry.setAttribute('data-dir','1');
					if (data.likes === null)  entry.setAttribute('data-dir','0');
					if (data.likes === 'false') entry.setAttribute('data-dir','-1');
					var votes = document.createElement('div');
						votes.className = 'votes';
						var upmod = document.createElement('a');
							upmod.className = 'upmod';
							upmod.setAttribute('onclick','apiCall("upmod", "' + data.name + '")');
							votes.appendChild(upmod);
						var count = document.createElement('span');
							count.className = 'count';
							count.id = 'count_' + data.name;
							count.innerHTML = data.score;
							count.title = data.ups + ' up votes, ' + data.downs + ' down votes';
							votes.appendChild(count);
						var downmod = document.createElement('a');
							downmod.className = 'downmod';
							downmod.id = 'down_' + data.name;
							votes.appendChild(downmod);
						entry.appendChild(votes);
					var thumblink = document.createElement('a');
						thumblink.className = 'thumblink';
						thumblink.href = 'http://www.reddit.com' + data.permalink;
						thumblink.target = '_blank';
						thumblink.title = 'View this submission on reddit';
						var thumb = document.createElement('img');
							thumb.className = 'thumb';
							data.thumbnail.indexOf('/') === 0 ? thumb.src = 'http://www.reddit.com' + data.thumbnail : thumb.src = data.thumbnail;
							thumb.alt = data.title;
							thumblink.appendChild(thumb);
						entry.appendChild(thumblink);
					var post = document.createElement('div');
						post.className = 'post';
						var link = document.createElement('a');
							link.className = 'link';
							link.href = 'http://www.reddit.com' + data.permalink;
							link.target = '_blank';
							link.innerHTML = data.title;
							link.title = 'View this submission on reddit';
							post.appendChild(link);
						var space = document.createTextNode(' ');
							post.appendChild(space);
						var domain = document.createElement('a');
							domain.className = 'domain';
							domain.href = 'http://www.reddit.com/domain/' + data.domain + '/';
							domain.target = '_href';
							domain.innerHTML = '(' + data.domain + ')';
							post.appendChild(domain);
						var meta = document.createElement('div');
							meta.className = 'meta';
							var timestamp = document.createElement('span');
								timestamp.className = 'timestamp';
								timestamp.innerHTML = 'submitted ' + prettyDate(ISODateString(new Date(data.created_utc * 1000)));
								meta.appendChild(timestamp);
							var by = document.createTextNode(' by ');
								meta.appendChild(by);
							var submitter = document.createElement('a');
								submitter.className = 'submitter';
								submitter.href = 'http://www.reddit.com/user/' + data.author + '/';
								submitter.target = '_blank';
								submitter.innerHTML = data.author;
								meta.appendChild(submitter);
							var to = document.createTextNode(' to ');
								meta.appendChild(to);
							var subreddit = document.createElement('a');
								subreddit.className = 'subreddit';
								subreddit.href = 'http://www.reddit.com/r/' + data.subreddit + '/';
								subreddit.target = '_blank';
								subreddit.innerHTML = data.subreddit;
								meta.appendChild(subreddit);
							post.appendChild(meta);
						var actions = document.createElement('div');
							actions.className = 'actions';
							var comments = document.createElement('a');
								comments.className = 'comments';
								comments.href = 'http://www.reddit.com' + data.permalink;
								comments.target = '_blank';
								comments.innerHTML = data.num_comments + ' comments';
								actions.appendChild(comments);
							post.appendChild(actions);
							var share = document.createElement('a');
								share.className = 'share';
								share.innerHTML = 'share';
								actions.appendChild(share);
							var save = document.createElement('a');
								save.className = 'save';
								save.innerHTML = data.saved === 'true' ? 'saved' : 'save';
								actions.appendChild(save);
							var hide = document.createElement('a');
								hide.className = 'hide';
								if(data.hidden === 'true') {
									entry.className += ' hidden';
									hide.innerHTML = 'unhide'
								} else {
									hide.innerHTML = 'hide';
								}
								actions.appendChild(hide);
							var report = document.createElement('a');
								report.className = 'report';
								report.innerHTML = 'report';
								actions.appendChild(report);
						entry.appendChild(post);
					document.getElementById('posts').appendChild(entry);
			}
			document.getElementById('submit').href = 'http://www.reddit.com/submit?url=' + encodeURI(document.getElementById('posts').getAttribute('data-url'));
		});
	});
}

function apiCall(call, postId) {
	var formData = new FormData();
	var apiUrl = new String();
	switch(call) {
		case 'upmod':
			apiUrl = 'http://www.reddit.com/api/vote';
			formData.append('id',postId);
			formData.append('uh',document.getElementById('posts').getAttribute('data-modhash'));
			var listItem = document.getElementById(postId);
			var voteWas = listItem.getAttribute('data-dir');
			var voteCount = document.getElementById('count_' + postId)
			if(voteWas === '1') formData.append('dir','0');
			if(voteWas === '0') formData.append('dir','1');
			if(voteWas === '-1') formData.append('dir','1');
			db.transaction(function(tx) {
				if(voteWas === '1') {
						listItem.setAttribute('data-dir','0');
						tx.executeSql('UPDATE posts SET likes=? WHERE name=?', [null, postId]);
					}
					if(voteWas === '0') {
						listItem.setAttribute('data-dir','1');
						tx.executeSql('UPDATE posts SET likes=? WHERE name=?', ['true', postId]);
					}
					if(voteWas === '-1') {
						listItem.setAttribute('data-dir','1');
						tx.executeSql('UPDATE posts SET likes=? WHERE name=?', ['true', postId]);
					}
			});
			break;
		default:
			console.warn('apiCall was called without a proper "call" argument.');
			break;
		var api = new XMLHttpRequest();
		api.open('POST',apiUrl,false);
		api.send(formData);
		if (api.statusText !== 'OK') {
			console.error('Error voting.\n' + api.statusText);
			console.warn(api);
			// Todo: roll back changes?
		}
	}
}


/*
 * JavaScript Pretty Date
 * Thanks to Dean Landolt's comment on
 * http://ejohn.org/blog/javascript-pretty-date/#postcomment
 */
// Takes an ISO time and returns a string representing how
// long ago the date represents.
function prettyDate(date_str){
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

/*
 * ISO 8601 Formatted Dates
 * Gotten from the Mozilla Developer Center
 */
function ISODateString(d){
 function pad(n){return n<10 ? '0'+n : n}
 return d.getUTCFullYear()+'-'
	  + pad(d.getUTCMonth()+1)+'-'
	  + pad(d.getUTCDate())+'T'
	  + pad(d.getUTCHours())+':'
	  + pad(d.getUTCMinutes())+':'
	  + pad(d.getUTCSeconds())+'Z'}