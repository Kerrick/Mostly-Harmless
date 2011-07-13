## Mostly Harmless ##

This is an upcoming reddit extension for Google Chrome.

### Roadmap

1. Share -- get it working or not?

2. Submission dialog for pages that haven't been submitted to reddit.

3. Submission dialog for pages that have been submitted to reddit, provided you're not reposting the same link to a subreddit.

4. Depending on user feedback, I might add special support for reposts. The extension could append a URL query string to it so it still goes through.

5. Comment dialog for pages that are reddit comment pages.

6. Comment dialog upon clicking an action (near save, hide, etc.) for all posts.

7. **Privacy** - when [Fancy Settings](https://github.com/frankkohlhepp/fancy-settings) supports textareas, I'll add the capability to exclude domains and regular expression matches from being looked up.

8. When infobars come out of the expiremental API, I may be implementing a UI similar to Socialite as well. However, [chromakode](https://github.com/chromakode)'s [shine](https://github.com/chromakode/shine) is more like Socialite, and our two extensions' functionalities have been taking different paths.

9. I hope to open source this and get it officially endorsed by reddit in the same way Socialite and RedditAddict are.

## Known Issues ##

* After clicking a vote icon, hide, or report, the state may not *appear* to change unless you move your mouse over what you just clicked. However, often you move your mouse to get away from the element, so you won't usually see this. This is a [known bug in Google Chrome](http://code.google.com/p/chromium/issues/detail?id=77246).

* Share doesn't work yet.