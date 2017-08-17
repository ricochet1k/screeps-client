# screeps-client
Custom client for Screeps using PIXI.js

![screenshot](https://raw.githubusercontent.com/ricochet1k/screeps-client/gh-pages/ags131.png)

# How to use
Due to CORS, the best way to use this is to use a bookmarklet, which will inject the client into the current page. Copy the following into a bookmark:
```
javascript:(d=>{s=d.createElement('script');s.setAttribute('src','//screeps.ricochet1k.net/inject.js');d.body.appendChild(s);})(document)
```
Then go to a simple page, like a 404 page for the server you are using. This could be something like https://screeps.com/404 or the main page of a custom server. Click the bookmarklet and magical things happen! 

Username and password are saved in your browser's localStorage, per domain.

If you are trying to use this on a custom server, make sure to install screepsmod-auth. You can then set a password through the Steam client, or you can login through Steam or Github if you configure it with their API keys.

# What works
- Room view
- Room minimaps
- Typing in room names to view them
- Most actionLog animations
- RoomVisuals
- Console output
- Map view
- Code editing (barely)
- Login using Steam or Github (must be enabled and configured in screepsmod-auth)
- Registering a new account

# What still needs implemented
See issues for the full list. Notably:
- Mouse interaction
- Memory view
- Typing console commands
- Replay view

