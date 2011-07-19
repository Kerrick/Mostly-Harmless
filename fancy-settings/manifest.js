// SAMPLE
this.manifest = {
    "name": "Mostly Harmless",
    "icon": "/pix/alien.png",
    "settings": [
        {
        	"tab": "Preferences",
        	"group": "Fresh Content",
        	"name": "freshCutoff",
        	"type": "slider",
        	"label": "",
        	"max": 91,
        	"min": 1,
        	"step": 1,
        	"display": true,
        	"displayModifier": function(value) {
        		if(value === 1)
        			return "Show posts less than " + value.toString() + " day old";
        		if(value <= 2 * 7)
        			return "Show posts less than " + value.toString() + " days old";
        		if(value > 2 * 7 && value < 7 * 7)
        			return "Show posts less than " + Math.floor(value / 7).toString() + " weeks old";
        		if(value >= 7 * 7 && value < 91)
        			return "Show posts less than " + Math.ceil(value / 30).toString() + " months old";
        		return "Show posts from all time";
        	}
        },
        {
        	"tab": "Preferences",
        	"group": "Fresh Content",
        	"name": "freshCutoffDescription",
        	"type": "description",
        	"text": "<p>This setting allows you to choose the oldest reddit posts you&rsquo;d like to see. Anything posted before the value you&rsquo;ve chosen will be indicated in the browser button's total, but will not be shown in the popup."
        },
        {
        	"tab": "Preferences",
        	"group": "Popup Width",
        	"name": "popupWidth",
        	"type": "slider",
        	"label": "",
        	"max": 784,
        	"min": 480,
        	"step": 1,
        	"display": true,
        	"displayModifier": function(value) {
        		return value.toString() + "px";
        	}
        },
        {
        	"tab": "Preferences",
        	"group": "Popup Width",
        	"name": "popupWidthDescription",
        	"type": "description",
        	"text": "<p>This setting allows you to set the width of the browser action popup."
        },
        {
        	"tab": "Preferences",
        	"group": "Shameless Plug",
        	"name": "shamelessPlug",
        	"type": "checkbox",
        	"label": "Show the shameless plug",
        },
        {
        	"tab": "Preferences",
        	"group": "Shameless Plug",
        	"name": "shamelessPlugDescription",
        	"type": "description",
        	"text": "<p>When checked, this will add the following to each commment you post from within Mostly Harmless:</p><p><em>Posted from <a href='http://kerrick.github.com/Mostly-Harmless'>Mostly Harmless</a>, a Google Chrome extension for awesome redditors.<em></p>"
        },
        {
        	"tab": "Preferences",
        	"group": "Orangered Notifications",
        	"name": "checkMail",
        	"type": "checkbox",
        	"label": "Check for orangereds"
        },
        {
        	"tab": "Preferences",
        	"group": "Orangered Notifications",
        	"name": "mailInterval",
        	"type": "slider",
        	"label": "",
        	"max": 5,
        	"min": 0,
        	"step": 1,
        	"display": true,
        	"displayModifier": function (value) {
        		if (value === 0)
        			return "every 30 seconds";
        		else if (value === 1)
        			return "every minute";
        		return "every " + value.toString() + " minutes";
        	}
        	
        },
        {
        	"tab": "Preferences",
        	"group": "Orangered Notifications",
        	"name": "mailDescription",
        	"type": "description",
        	"text": "<p>When checked, Mostly Harmless will check for new orangereds at the interval you set. If you get an orangered, it will display a desktop notification for five seconds.</p>"
        },
        {
        	"tab": "Performance",
        	"group": "Cache Time",
        	"name": "cacheTime",
        	"type": "slider",
        	"label": "",
        	"max": 5,
        	"min": 1,
        	"step": 1,
        	"display": true,
        	"displayModifier": function(value) {
        		if(value === 1)
        			return value.toString() + " minute";
        		return value.toString() + " minutes";
        	}
        },
        {
        	"tab": "Performance",
        	"group": "Cache Time",
        	"name": "cacheDescription",
        	"type": "description",
        	"text": "<p>Mostly Harmless grabs data from the Reddit API every time you load a page. However, that data can be cached, or saved for a short time, to improve performance and reduce the load on the reddit API.</p><p>This option allows you to change how long a page's data is cached. Longer cache times mean less bandwidth, faster results, and less load on reddit. Shorter cache times mean fresher data.</p>"
        },
        {
        	"tab": "Performance",
        	"group": "Timeout Length",
        	"name": "timeoutLength",
        	"type": "slider",
        	"label": "",
        	"max": 16,
        	"min": 1,
        	"step": 1,
        	"display": true,
        	"displayModifier": function(value) {
        		if(value === 1)
        			return value.toString() + " second";
        		if(value <= 15)
        			return value.toString() + " seconds";
        		return "Do not timeout; Only error when the API is down."
        	}
        },
        {
        	"tab": "Performance",
        	"group": "Timeout Length",
        	"name": "tiemoutDescription",
        	"type": "description",
        	"text": "<p>Mostly Harmless uses the reddit API, but sometimes the API will be slow or down. If that happens, Mostly Harmless can display an error after trying to reach the API for a certain amount of time.</p><p>This option allows you to change how long Mostly Harmless should try to reach the Reddit API. Longer timeout lengths mean more time waiting for a result from the reddit API. Shorter timeout lengths mean a higher possibility of timing out when reddit may only be slow instead of down."
        },
        {
        	"tab": "Privacy",
        	"group": "Wait for Click",
        	"name": "waitForClick",
        	"type": "checkbox",
        	"label": "Wait for click"
        	
        },
        {
        	"tab": "Privacy",
        	"group": "Wait for Click",
        	"name": "waitForClickDescription",
        	"type": "description",
        	"text": "<p>If this checkbox is selected, Mostly Harmless will not activate unless you click its icon.</p>"
        },
        {
        	"tab": "Privacy",
        	"group": "Warning!",
        	"name": "excludedDescription",
        	"type": "description",
        	"text": "<h3>Exclusions do not work yet!</h3><p><big>I am waiting on Fancy Settings to support textareas.</big></p><p>Mostly Harmless grabs data from the Reddit API every time you load a page. This takes time and bandwidth, taxes the reddit API, and sends the unencrypted URL to reddit. However, you can exclude certain domains or URL patterns from being looked up.</p>"
        },
        {
    		"tab": "Privacy",
    		"group": "Excluded Domains",
    		"name": "excludedDomains",
    		"type": "text",
    		"label": "Excluded domains:",
    		"text": "secure.ingdirect.com\nchaseonline.chase.com\nonline.wellsfargo.com"
        },
        {
        	"tab": "Privacy",
        	"group": "Excluded Domains",
        	"name": "excludedDomainsDescription",
        	"type": "description",
        	"text": "<p>Put domains or subdomains, one per line, in the above text box. Any page on the listed domains will <strong>not</strong> activate Mostly Harmless.</p>"
        },
        {
        	"tab": "Privacy",
        	"group": "Excluded Regex",
        	"name": "excludedRegex",
        	"type": "text",
        	"label": "Excluded regex matches",
        	"text": "chrome:\/\/.*\nhttps?:\/\/www\.google\.com\/search.*\nhttps?:\/\/search\.yahoo\.com\/search.*\nhttps?:\/\/www\.bing\.com\/search.*"
        },
        {
        	"tab": "Privacy",
        	"group": "Excluded Regex",
        	"name": "excludedRegexDescription",
        	"type": "description",
        	"text": "<p>Put regular expressions, one per line, in the above text box. Please do not use the <code>\\n</code> character, because there should be no newlines in a URL. Any page that matches the listed regular expressions will <strong>not</strong> activate Mostly Harmless."
        }
    ]
};
