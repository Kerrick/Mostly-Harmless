// SAMPLE
this.manifest = {
    "name": "Mostly Harmless",
    "icon": "/pix/alien.png",
    "settings": [
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
        	"tab": "Preferences",
        	"group": "Excluded Sites",
        	"name": "excludedDescription",
        	"type": "description",
        	"text": "<h3>Excluding sites does not work yet!</h3><p><big>I am waiting on Fancy Settings to support textareas.</big></p><p>Mostly Harmless grabs data from the Reddit API every time you load a page. This takes time and bandwidth, taxes the reddit API, and sends the unencrypted URL to reddit. However, you can exclude certain domains or URL patterns from being looked up.</p>"
        },
        {
    		"tab": "Preferences",
    		"group": "Excluded Sites",
    		"name": "excludedDomains",
    		"type": "text",
    		"label": "Excluded domains:",
    		"text": "secure.ingdirect.com\nchaseonline.chase.com\nonline.wellsfargo.com"
        },
        {
        	"tab": "Preferences",
        	"group": "Excluded Sites",
        	"name": "excludedDomainsDescription",
        	"type": "description",
        	"text": "<p>Put domains or subdomains, one per line, in the above text box. Any page on the listed domains will <strong>not</strong> activate Mostly Harmless.</p>"
        },
        {
        	"tab": "Preferences",
        	"group": "Excluded Sites",
        	"name": "excludedRegex",
        	"type": "text",
        	"label": "Excluded regex matches",
        	"text": "chrome:\/\/.*\nhttps?:\/\/www\.google\.com\/search.*\nhttps?:\/\/search\.yahoo\.com\/search.*\nhttps?:\/\/www\.bing\.com\/search.*"
        },
        {
        	"tab": "Preferences",
        	"group": "Excluded Sites",
        	"name": "excludedRegexDescription",
        	"type": "description",
        	"text": "<p>Put regular expressions, one per line, in the above text box. Please do not use the <code>\\n</code> character, because there should be no newlines in a URL. Any page that matches the listed regular expressions will <strong>not</strong> activate Mostly Harmless."
        },
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
        }
    ]
};
