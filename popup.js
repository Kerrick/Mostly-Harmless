var db = openDatabase('mhdb', '1.0', 'Mostly Harmless Database', 5 * 1024 * 1024);
var cacheTime;
var over18;
var commentsMatchPattern = /https?:\/\/www\.reddit\.com(\/r\/(.+?))?\/comments\/(.+?)\/.*/;
var isCommentsPage = false;
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
	isCommentsPage = commentsMatchPattern.test(pageUrl);
	var sqlQuery = isCommentsPage ? 'SELECT * FROM posts WHERE id=?' : 'SELECT * FROM posts WHERE url=?';
	var sqlSearch = isCommentsPage ? pageUrl.match(commentsMatchPattern)[3] : pageUrl;
	db.transaction(function(tx){
		tx.executeSql(sqlQuery, [sqlSearch], function(tx, results) {
			console.log(results.rows);
			document.getElementById('posts').setAttribute('data-modhash',results.rows.item(0).modhash);
			document.getElementById('posts').setAttribute('data-url',pageUrl);
			var children = results.rows;
			var now = new Date();
			for(var i = 0; i < children.length; i++) {
				var data = children.item(i);
				var voteDir;
					if (data.likes === 'true')  voteDir = 1;
					if (data.likes === null)  voteDir = 0;
					if (data.likes === 'false') voteDir = -1;
				var entry = new String();
					var hiddenText = data.saved === 'true' ? 'hidden' : 'hide';
					var saveText = data.saved === 'true' ? 'saved' : 'save';
					entry += '<li id="' + data.name + '" class="' + hiddenText + ' ' + saveText + '" data-dir="' + voteDir.toString() + '">';
						entry += '<div class="votes">';
							entry += '<a class="upmod" onclick="apiCall(\'upmod\', \'' + data.name + '\')"></a>';
							entry += '<span class="count" id="count_' + data.name + '" title="' + data.ups + ' up votes, ' + data.downs + ' down votes">' + data.score + '</span>';
							entry += '<a class="downmod" onclick="apiCall(\'downmod\', \'' + data.name + '\')"></a>';
						entry += '</div>';
						entry += '<a class="thumblink" href="http://www.reddit.com' + data.permalink + '" target="_blank" title="View this post on reddit">';
							var thumbSrc = data.thumbnail.indexOf('/') === 0 ? 'http://www.reddit.com' + data.thumbnail : data.thumbnail;
							entry += '<img class="thumb" src="' + thumbSrc + '" alt="' + data.title + '" width="70"/>';
						entry += '</a>';
						entry += '<div class="post">';
							entry += '<a class="link" href="http://www.reddit.com' + data.permalink + '" target="_blank" title="View this post on reddit">' + data.title + '</a> ';
							entry += '<a class="domain" href="http://www.reddit.com/domain/' + data.domain + '" target="_blank">(' + data.domain + ')</a>';
							entry += '<div class="meta">';
								entry += '<span class="timestamp">submitted ' + prettyDate(ISODateString(new Date(data.created_utc * 1000))) + '</span> by ';
								entry += '<a class="submitter" href="http://www.reddit.com/user/' + data.author + '" target="_blank">' + data.author + '</a> to';
								entry += '<a class="subreddit" href="http://www.reddit.com/r/' + data.subreddit + '/" target="_blank">' + data.subreddit + '</a>';
							entry += '</div>';
							entry += '<div class="actions">';
								entry += '<a class="comments" href="http://www.reddit.com' + data.permalink + '" target="_blank">' + data.num_comments + ' comments</a>';
								entry += '<a class="share">share</a>';
								entry += '<a class="save">' + saveText + '</a>';
								entry += '<a class="hide">' + hiddenText + '</a>';
								entry += '<a class="report">report</a>';
							entry += '</div>';
						entry += '</div>'
					entry += '</li>';
					document.getElementById('posts').innerHTML += entry;
			}
			if(!isCommentsPage) {
				document.getElementById('submit').href = 'http://www.reddit.com/submit?resubmit=true&url=' + encodeURI(document.getElementById('posts').getAttribute('data-url'));
			} else {
				document.getElementById('submit').parentNode.style.display = 'none';
			}
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
		case 'downmod':
			apiUrl = 'http://www.reddit.com/api/vote';
			formData.append('id',postId);
			formData.append('uh',document.getElementById('posts').getAttribute('data-modhash'));
			var listItem = document.getElementById(postId);
			var voteWas = listItem.getAttribute('data-dir');
			var voteCount = document.getElementById('count_' + postId)
			if(voteWas === '-1') formData.append('dir','0');
			if(voteWas === '0') formData.append('dir','-1');
			if(voteWas === '1') formData.append('dir','-1');
			db.transaction(function(tx) {
				if(voteWas === '-1') {
						listItem.setAttribute('data-dir','0');
						tx.executeSql('UPDATE posts SET likes=? WHERE name=?', [null, postId]);
					}
					if(voteWas === '0') {
						listItem.setAttribute('data-dir','-1');
						tx.executeSql('UPDATE posts SET likes=? WHERE name=?', ['false', postId]);
					}
					if(voteWas === '1') {
						listItem.setAttribute('data-dir','-1');
						tx.executeSql('UPDATE posts SET likes=? WHERE name=?', ['false', postId]);
					}
			});
			break;
		default:
			console.warn('apiCall was called without a proper "call" argument.');
			break;
		}
		var api = new XMLHttpRequest();
		api.open('POST',apiUrl,false);
		api.send(formData);
		if (api.statusText !== 'OK') {
			console.error('Error voting.\n' + api.statusText);
			console.warn(api);
			// Todo: roll back changes?
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