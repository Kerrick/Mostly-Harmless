// UNSAVE
Request URL: http://www.reddit.com/api/unsave
Request Method: POST
Form Data:
	id:FULLNAME
	executed:unsaved
	r:SUBREDDIT
	uh:f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0
	renderstyle:html

// SAVE
Request URL: http://www.reddit.com/api/save
Request Method: POST
Form Data:
	id:FULLNAME
	executed:saved
	r:SUBREDDIT
	uh:f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0
	renderstyle:html

// SEARCH REDDIT NAMES
Request URL: http://www.reddit.com/api/search_reddit_names
Request Method: POST
Form Data:
	query:rp
	uh:f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0
	renderstyle:html

// COMMENT IF ON COMMENTS PAGE, posting as top level of course, maybe save to localStorage until submitted?
Request URL: http://www.reddit.com/api/comment
Request Method: POST
Form Data:
	thing_id:FULLNAME
	text:**Bold**, *italic*, [link](http://minecraft.net), normal.
	id:#form-FULLNAME01h
	r:SUBREDDIT
	uh:f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0
	renderstyle:html
Response:
	{"jquery": [[0, 1, "call", ["#form-t3_i37mb01h"]], [1, 2, "attr", "find"], [2, 3, "call", [".status"]], [3, 4, "attr", "hide"], [4, 5, "call", []], [5, 6, "attr", "html"], [6, 7, "call", [""]], [7, 8, "attr", "end"], [8, 9, "call", []], [1, 10, "attr", "find"], [10, 11, "call", ["textarea"]], [11, 12, "attr", "attr"], [12, 13, "call", ["rows", 3]], [13, 14, "attr", "html"], [14, 15, "call", [""]], [15, 16, "attr", "val"], [16, 17, "call", [""]], [0, 18, "attr", "insert_things"], [18, 19, "call", [[{"kind": "t1", "data": {"parent": "t3_i37mb", "content": "&lt;div class=\"thing id-t1_c20lkip even odd comment \" onclick=\"click_thing(this)\"&gt;&lt;p class=\"parent\"&gt;&lt;a name=\"c20lkip\" &gt;&lt;/a&gt;&lt;/p&gt;&lt;div class=\"midcol likes\" &gt;&lt;div class=\"arrow upmod\" onclick=\"$(this).vote('e221cf86a1de86a4fb7d6c41da38acd52f63162b', null, event)\" &gt;&lt;/div&gt;&lt;div class=\"arrow down\" onclick=\"$(this).vote('e221cf86a1de86a4fb7d6c41da38acd52f63162b', null, event)\" &gt;&lt;/div&gt;&lt;/div&gt;&lt;div class=\"entry likes\"&gt;&lt;div class=\"collapsed\" style='display:none'&gt;&lt;a href=\"#\" class=\"expand\" onclick=\"return showcomment(this)\"&gt;[+]&lt;/a&gt;&lt;a href=\"http://www.reddit.com/user/KerrickLong\" class=\"author gray id-t2_4appr\" &gt;KerrickLong&lt;/a&gt;&lt;span class=\"userattrs\"&gt;&lt;/span&gt;&amp;#32;&lt;span class=\"score dislikes\"&gt;-1 points&lt;/span&gt;&lt;span class=\"score unvoted\"&gt;0 points&lt;/span&gt;&lt;span class=\"score likes\"&gt;1 point&lt;/span&gt;&amp;#32; 162 milliseconds ago &amp;nbsp;&lt;a href=\"#\" class=\"expand\" onclick=\"return showcomment(this)\"&gt;(0 children)&lt;/a&gt;&lt;/div&gt;&lt;div class=\"noncollapsed\" &gt;&lt;p class=\"tagline\"&gt;&lt;a href=\"#\" class=\"expand\" onclick=\"return hidecomment(this)\"&gt;[&amp;ndash;]&lt;/a&gt;&lt;a href=\"http://www.reddit.com/user/KerrickLong\" class=\"author id-t2_4appr\" &gt;KerrickLong&lt;/a&gt;&lt;span class=\"userattrs\"&gt;&lt;/span&gt;&amp;#32;&lt;span class=\"score dislikes\"&gt;-1 points&lt;/span&gt;&lt;span class=\"score unvoted\"&gt;0 points&lt;/span&gt;&lt;span class=\"score likes\"&gt;1 point&lt;/span&gt;&amp;#32; 162 milliseconds ago&lt;/p&gt;&lt;form action=\"#\" class=\"usertext\" onsubmit=\"return post_form(this, 'editusertext')\" id=\"form-t1_c20lkip9nl\"&gt;&lt;input type=\"hidden\" name=\"thing_id\" value=\"t1_c20lkip\"/&gt;&lt;div class=\"usertext-body\"&gt;&lt;div class=\"md\"&gt;&lt;p&gt;&lt;strong&gt;Bold&lt;/strong&gt;, &lt;em&gt;italic&lt;/em&gt;, &lt;a href=\"http://minecraft.net\"  rel='nofollow'&gt;link&lt;/a&gt;, normal.&lt;/p&gt;&lt;/div&gt;\n&lt;/div&gt;&lt;div class=\"usertext-edit\" style=\"display: none\"&gt;&lt;div&gt;&lt;textarea rows=\"1\" cols=\"1\" name=\"text\" &gt;**Bold**,&amp;#32;*italic*,&amp;#32;[link](http://minecraft.net),&amp;#32;normal.&lt;/textarea&gt;&lt;/div&gt;&lt;div class=\"bottom-area\"&gt;&lt;span class=\"help-toggle toggle\" style=\"display: none\"&gt;&lt;a class=\"option active \" href=\"#\" tabindex=\"100\" onclick=\"return toggle(this, helpon, helpoff)\" &gt;formatting help&lt;/a&gt;&lt;a class=\"option \" href=\"#\"&gt;hide help&lt;/a&gt;&lt;/span&gt;&lt;span class=\"error TOO_LONG field-text\" style=\"display:none\"&gt;&lt;/span&gt;&lt;span class=\"error RATELIMIT field-ratelimit\" style=\"display:none\"&gt;&lt;/span&gt;&lt;span class=\"error NO_TEXT field-text\" style=\"display:none\"&gt;&lt;/span&gt;&lt;span class=\"error TOO_OLD field-parent\" style=\"display:none\"&gt;&lt;/span&gt;&lt;span class=\"error DELETED_COMMENT field-parent\" style=\"display:none\"&gt;&lt;/span&gt;&lt;span class=\"error DELETED_LINK field-parent\" style=\"display:none\"&gt;&lt;/span&gt;&lt;div class=\"usertext-buttons\"&gt;&lt;button type=\"submit\" onclick=\"\" class=\"save\" style='display:none'&gt;save&lt;/button&gt;&lt;button type=\"button\" onclick=\"cancel_usertext(this)\" class=\"cancel\" style='display:none'&gt;cancel&lt;/button&gt;&lt;span class=\"status\"&gt;&lt;/span&gt;&lt;/div&gt;&lt;/div&gt;&lt;table class=\"markhelp md\" style=\"display: none\"&gt;&lt;tr style=\"background-color: #ffff99; text-align: center\"&gt;&lt;td&gt;&lt;em&gt;you type:&lt;/em&gt;&lt;/td&gt;&lt;td&gt;&lt;em&gt;you see:&lt;/em&gt;&lt;/td&gt;&lt;/tr&gt;&lt;tr&gt;&lt;td&gt;*italics*&lt;/td&gt;&lt;td&gt;&lt;em&gt;italics&lt;/em&gt;&lt;/td&gt;&lt;/tr&gt;&lt;tr&gt;&lt;td&gt;**bold**&lt;/td&gt;&lt;td&gt;&lt;b&gt;bold&lt;/b&gt;&lt;/td&gt;&lt;/tr&gt;&lt;tr&gt;&lt;td&gt;[reddit!](http://reddit.com)&lt;/td&gt;&lt;td&gt;&lt;a href=\"http://reddit.com\"&gt;reddit!&lt;/a&gt;&lt;/td&gt;&lt;/tr&gt;&lt;tr&gt;&lt;td&gt;* item 1&lt;br/&gt;* item 2&lt;br/&gt;* item 3&lt;/td&gt;&lt;td&gt;&lt;ul&gt;&lt;li&gt;item 1&lt;/li&gt;&lt;li&gt;item 2&lt;/li&gt;&lt;li&gt;item 3&lt;/li&gt;&lt;/ul&gt;&lt;/td&gt;&lt;/tr&gt;&lt;tr&gt;&lt;td&gt;&amp;gt; quoted text&lt;/td&gt;&lt;td&gt;&lt;blockquote&gt;quoted text&lt;/blockquote&gt;&lt;/td&gt;&lt;/tr&gt;&lt;tr&gt;&lt;td&gt;Lines starting with four spaces&lt;br/&gt;are treated like code:&lt;br/&gt;&lt;br/&gt;&lt;span class=\"spaces\"&gt;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&lt;/span&gt;if 1 * 2 &amp;lt 3:&lt;br/&gt;&lt;span class=\"spaces\"&gt;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&lt;/span&gt;print \"hello, world!\"&lt;br/&gt;&lt;/td&gt;&lt;td&gt;Lines starting with four spaces&lt;br/&gt;are treated like code:&lt;br/&gt;&lt;pre&gt;if 1 * 2 &amp;lt 3:&lt;br/&gt;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;print \"hello, world!\"&lt;/pre&gt;&lt;/td&gt;&lt;/tr&gt;&lt;tr&gt;&lt;td&gt;~~strikethrough~~&lt;/td&gt;&lt;td&gt;&lt;strike&gt;strikethrough&lt;/strike&gt;&lt;/td&gt;&lt;/tr&gt;&lt;tr&gt;&lt;td&gt;super^script&lt;/td&gt;&lt;td&gt;super&lt;sup&gt;script&lt;/sup&gt;&lt;/td&gt;&lt;/tr&gt;&lt;/table&gt;&lt;/div&gt;&lt;/form&gt;&lt;ul class=\"flat-list buttons\"&gt;&lt;li class=\"first\"&gt;&lt;a href=\"http://www.reddit.com/r/Minecraft/comments/i37mb/what_if_notch_and_jeb_posted_their_tweets_here/c20lkip\" class=\"bylink\" rel=\"nofollow\" &gt;permalink&lt;/a&gt;&lt;/li&gt;&lt;li&gt;&lt;a class=\"edit-usertext\" href=\"javascript:void(0)\" onclick=\"return edit_usertext(this)\"&gt;edit&lt;/a&gt;&lt;/li&gt;&lt;li&gt;&lt;form class=\"toggle del-button\" action=\"#\" method=\"get\"&gt;&lt;input type=\"hidden\" name=\"executed\" value=\"deleted\"/&gt;&lt;span class=\"option active\"&gt;&lt;a href=\"#\" onclick=\"return toggle(this)\"&gt;delete&lt;/a&gt;&lt;/span&gt;&lt;span class=\"option error\"&gt;are you sure? &amp;#32;&lt;a href=\"javascript:void(0)\" class=\"yes\" onclick='change_state(this, \"del\", hide_thing)'&gt;yes&lt;/a&gt;&amp;#32;/&amp;#32;&lt;a href=\"javascript:void(0)\" class=\"no\" onclick=\"return toggle(this)\"&gt;no&lt;/a&gt;&lt;/span&gt;&lt;/form&gt;&lt;/li&gt;&lt;li&gt;&lt;a class=\"\" href=\"javascript:void(0)\" onclick=\"return reply(this)\"&gt;reply&lt;/a&gt;&lt;/li&gt;&lt;/ul&gt;&lt;/div&gt;&lt;/div&gt;&lt;div class=\"child\" &gt;&lt;/div&gt;&lt;div class=\"clearleft\"&gt;&lt;!--IE6sux--&gt;&lt;/div&gt;&lt;/div&gt;&lt;div class=\"clearleft\"&gt;&lt;!--IE6sux--&gt;&lt;/div&gt;", "contentText": "**Bold**, *italic*, [link](http://minecraft.net), normal.", "link": "t3_i37mb", "replies": "", "contentHTML": "&lt;div class=\"md\"&gt;&lt;p&gt;&lt;strong&gt;Bold&lt;/strong&gt;, &lt;em&gt;italic&lt;/em&gt;, &lt;a href=\"http://minecraft.net\" &gt;link&lt;/a&gt;, normal.&lt;/p&gt;&lt;/div&gt;", "id": "t1_c20lkip"}}], false]], [0, 20, "call", ["#noresults"]], [20, 21, "attr", "hide"], [21, 22, "call", []]]}

// DELETE COMMENT maybe? Undo posted top level comment?
Request URL: http://www.reddit.com/api/del
Request Method: POST
Form Data:
	id:FULLNAME
	executed:deleted
	r:SUBREDDIT
	uh:f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0
Response:
	{}

// IDEAS
How about parsing imgur to look for direct AND imgur links?
User preference to sort by freshness, score, comment count!
Excluded sites
	When on ignored pages, badge can be black with a white X
	Clicking the badge can take the user to the options page about excluded sites
Voting and score on the right? I know, blasphemy, but it'd make it less mouse-travel to vote.