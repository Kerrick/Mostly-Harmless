// SAMPLE
this.manifest = {
    "name": "Mostly Harmless",
    "icon": "/pix/alien.png",
    "settings": [
        {
        	"tab": chrome.i18n.getMessage('tab_preferences'),
        	"group": chrome.i18n.getMessage('group_fresh_content'),
        	"name": "freshCutoff",
        	"type": "slider",
        	"label": "",
        	"max": 91,
        	"min": 1,
        	"step": 1,
        	"display": true,
        	"displayModifier": function(value) {
        		if(value === 1)
        			return chrome.i18n.getMessage('fresh_content_show_one_day');
        		if(value <= 2 * 7)
        			return chrome.i18n.getMessage('fresh_content_show_days', value.toString());
        		if(value > 2 * 7 && value < 7 * 7)
        			return chrome.i18n.getMessage('fresh_content_show_weeks', Math.floor(value / 7).toString());
        		if(value >= 7 * 7 && value < 91)
        			return chrome.i18n.getMessage('fresh_content_show_months', Math.ceil(value / 30).toString());
        		return chrome.i18n.getMessage('fresh_content_show_all');
        	}
        },
        {
        	"tab": chrome.i18n.getMessage('tab_preferences'),
        	"group": chrome.i18n.getMessage('group_fresh_content'),
        	"name": "freshCutoffDescription",
        	"type": "description",
        	"text": chrome.i18n.getMessage('fresh_content_description')
        },
        {
        	"tab": chrome.i18n.getMessage('tab_preferences'),
        	"group": chrome.i18n.getMessage('group_popup_width'),
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
        	"tab": chrome.i18n.getMessage('tab_preferences'),
        	"group": chrome.i18n.getMessage('group_popup_width'),
        	"name": "popupWidthDescription",
        	"type": "description",
        	"text": chrome.i18n.getMessage('popup_width_description')
        },
        {
        	"tab": chrome.i18n.getMessage('tab_preferences'),
        	"group": chrome.i18n.getMessage('group_shameless_plug'),
        	"name": "shamelessPlug",
        	"type": "checkbox",
        	"label": chrome.i18n.getMessage('shameless_plug_label'),
        },
        {
        	"tab": chrome.i18n.getMessage('tab_preferences'),
        	"group": chrome.i18n.getMessage('group_shameless_plug'),
        	"name": "shamelessPlugDescription",
        	"type": "description",
        	"text": chrome.i18n.getMessage('shameless_plug_description')
        },
        {
        	"tab": chrome.i18n.getMessage('tab_preferences'),
        	"group": chrome.i18n.getMessage('group_orangered_notifications'),
        	"name": "checkMail",
        	"type": "checkbox",
        	"label": "Check for orangereds"
        },
        {
        	"tab": chrome.i18n.getMessage('tab_preferences'),
        	"group": chrome.i18n.getMessage('group_orangered_notifications'),
        	"name": "mailSound",
        	"type": "checkbox",
        	"label": chrome.i18n.getMessage('orangered_sound_label')
        },
        {
        	"tab": chrome.i18n.getMessage('tab_preferences'),
        	"group": chrome.i18n.getMessage('group_orangered_notifications'),
        	"name": "mailSoundPreview",
        	"type": "button",
        	"text": chrome.i18n.getMessage('orangered_sound_preview')
        },
        {
        	"tab": chrome.i18n.getMessage('tab_preferences'),
        	"group": chrome.i18n.getMessage('group_orangered_notifications'),
        	"name": "mailInterval",
        	"type": "slider",
        	"label": "",
        	"max": 15,
        	"min": 5,
        	"step": 1,
        	"display": true,
        	"displayModifier": function (value) {
        		return chrome.i18n.getMessage('orangered_interval_minutes', value.toString());
        	}
        	
        },
        {
        	"tab": chrome.i18n.getMessage('tab_preferences'),
        	"group": chrome.i18n.getMessage('group_orangered_notifications'),
        	"name": "mailDisplayTime",
        	"type": "slider",
        	"label": "",
        	"max": 20,
        	"min": 5,
        	"step": 1,
        	"display": true,
        	"displayModifier": function (value) {
        		return chrome.i18n.getMessage('orangered_display_time', value.toString());
        	}
        	
        },
        {
        	"tab": chrome.i18n.getMessage('tab_preferences'),
        	"group": chrome.i18n.getMessage('group_orangered_notifications'),
        	"name": "mailDescription",
        	"type": "description",
        	"text": chrome.i18n.getMessage('orangered_description')
        },
        {
        	"tab": chrome.i18n.getMessage('tab_performance'),
        	"group": chrome.i18n.getMessage('group_cache_time'),
        	"name": "cacheTime",
        	"type": "slider",
        	"label": "",
        	"max": 5,
        	"min": 1,
        	"step": 1,
        	"display": true,
        	"displayModifier": function(value) {
        		if(value === 1)
        			return chrome.i18n.getMessage('cache_time_one_minute', value.toString());
        		return chrome.i18n.getMessage('cache_time_minutes', value.toString());
        	}
        },
        {
        	"tab": chrome.i18n.getMessage('tab_performance'),
        	"group": chrome.i18n.getMessage('group_cache_time'),
        	"name": "cacheDescription",
        	"type": "description",
        	"text": chrome.i18n.getMessage('cache_time_description')
        },
        {
        	"tab": chrome.i18n.getMessage('tab_performance'),
        	"group": chrome.i18n.getMessage('group_timeout_length'),
        	"name": "timeoutLength",
        	"type": "slider",
        	"label": "",
        	"max": 31,
        	"min": 5,
        	"step": 1,
        	"display": true,
        	"displayModifier": function(value) {
        		if(value <= 30)
        			return chrome.i18n.getMessage('timeout_length_seconds', value.toString());
        		return chrome.i18n.getMessage('timeout_length_never');
        	}
        },
        {
        	"tab": chrome.i18n.getMessage('tab_performance'),
        	"group": chrome.i18n.getMessage('group_timeout_length'),
        	"name": "tiemoutDescription",
        	"type": "description",
        	"text": chrome.i18n.getMessage('timeout_length_description')
        },
        {
        	"tab": chrome.i18n.getMessage('tab_privacy'),
        	"group": chrome.i18n.getMessage('group_wait_for_click'),
        	"name": "waitForClick",
        	"type": "checkbox",
        	"label": chrome.i18n.getMessage('group_wait_for_click')
        	
        },
        {
        	"tab": chrome.i18n.getMessage('tab_privacy'),
        	"group": chrome.i18n.getMessage('group_wait_for_click'),
        	"name": "waitForClickDescription",
        	"type": "description",
        	"text": chrome.i18n.getMessage('wait_for_click_description')
        },
        {
    		"tab": chrome.i18n.getMessage('tab_privacy'),
    		"group": chrome.i18n.getMessage('excluded_domains'),
    		"name": "excludedDomains",
    		"type": "textarea",
    		"label": chrome.i18n.getMessage('excluded_domains')
        },
        {
        	"tab": chrome.i18n.getMessage('tab_privacy'),
        	"group": chrome.i18n.getMessage('excluded_domains'),
        	"name": "excludedDomainsDescription",
        	"type": "description",
        	"text": chrome.i18n.getMessage('excluded_domains_description')
        },
        {
        	"tab": chrome.i18n.getMessage('tab_privacy'),
        	"group": chrome.i18n.getMessage('excluded_regex'),
        	"name": "excludedRegex",
        	"type": "textarea",
        	"label": chrome.i18n.getMessage('excluded_regex'),
        },
        {
        	"tab": chrome.i18n.getMessage('tab_privacy'),
        	"group": chrome.i18n.getMessage('excluded_regex'),
        	"name": "excludedRegexDescription",
        	"type": "description",
        	"text": chrome.i18n.getMessage('excluded_regex_description')
        }
    ]
};
