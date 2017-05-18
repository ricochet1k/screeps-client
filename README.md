# screeps-client
Custom client for Screeps using PIXI.js

![screenshot](https://raw.githubusercontent.com/ricochet1k/screeps-client/gh-pages/ags131.png)

# How to use
Due to CORS, the best way to use this is to use a bookmarklet, which will inject the client into the current page. Copy this into a bookmark:
```
javascript:((d) => {d.body.innerHTML='<div id=app>'; var S$ = x => {s = d.createElement('script'); s.setAttribute('src', '//screeps.ricochet1k.net/'+x); d.body.appendChild(s);}; S$('static/lib/pixi.js'); var B = () => { window.PIXI? S$('dist/build.js') : T()}; var T = () => setTimeout(B, 10); T(); })(document);)
```
Then go to a simple page, like a 404 page for the server you are using. This could be something like https://screeps.com/404 , or the main page of a custom server. Click the bookmarklet and magical! 

Username and password are saved in your browser's localStorage, per domain.

If you are trying to use this on a custom server, make sure to install screepsmod-auth and set a password through the Steam client. This is currently the only way to add a password to an existing account on a private server.

# What works
- Room view
- Room minimaps
- Typing in room names to view them
- Most actionLog animations
- RoomVisuals
- Console output

# What still needs implemented
See issues for the full list. Notably:
- Mouse interaction
- Memory view
- Code editing
- Typing console commands
- Map view
- Replay view

