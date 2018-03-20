# mpc-ipc.js

This is a simple, mostly dumb, client for [MPC-HC](https://mpc-hc.org/)'s IPC interface.

* Explicitly implemented commands like `isMuted()` (see [commands](#explicit-commands) below);
* Methods starting with `get` are translated into accessors for their associated `variable`;
* Otherwise, the method name is looked up into the method table and if found, converted to a command.

The IPC interface is fully asynchronous and every command (except for event handler registration) returns a 
[Promise](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise).
On success, `resolve()` is called with the result data and on failure `reject()` is called with the error message from mpv.

## Explicit commands

* `MediaPlayerClassicClient(socketPath)`: create a client communicating with the IPC socket on `socketPath`;
* `MediaPlayerClassicClient.on(event, handler)`: register an event handler for raw IPC event `event`;
* `MediaPlayerClassicClient.off(event, handler)`: unregister an event handler for raw IPC event `event`;
* `MediaPlayerClassicClient.command(command, ...args)`: send raw command over IPC interface;
* `MediaPlayerClassicClient.get([variable])`: get variable or object containing all variables and their values;
* `MediaPlayerClassicClient.isMuted()`: return whether or not the player is muted;
* `MediaPlayerClassicClient.getPlayState()`: return a lower-case string equivalent to the player state (playing, paused, stopped);
* `MediaPlayerClassicClient.isPlaying()`: return whether or not the player is playing;
* `MediaPlayerClassicClient.isPaused()`: return whether or not the player is paused;
* `MediaPlayerClassicClient.isStopped()`: return whether or not the player is stopped;
* `MediaPlayerClassicClient.isClosed()`: return whether or not the player has any file open;
* `MediaPlayerClassicClient.loadFile(path)`: load file for immediate playback;

## Example

```js
let mpc = require('mpc-ipc');
let player = new mpc.MediaPlayerClassicClient({ host: 'localhost', port: 8088 });

player.getVolumeLevel().then(v => console.log(`Volume: ${v}%`));
player.togglePause();
player.loadFile('Z:\\Media\\not-an-anime.mkv');
```

## License

mpc-ipc.js is released under the [0BSD](https://spdx.org/licenses/0BSD.html) license:

```
Copyright (C) 2018 by Shiz <hi@shiz.me>

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN 
NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, 
WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
```
