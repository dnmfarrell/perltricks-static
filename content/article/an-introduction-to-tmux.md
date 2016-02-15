{
   "tags" : [
      "old_site"
   ],
   "image" : null,
   "title" : "An introduction to tmux",
   "authors" : [
      "David Farrell"
   ],
   "description" : "How to get started with the open source terminal multiplexer ",
   "slug" : "211/2016/1/29/An-introduction-to-tmux",
   "date" : "2016-01-28T13:30:18",
   "draft" : true
}

[Tmux](https://tmux.github.io/) is a terminal multiplexer: it let's you manage several terminals under one tmux session, split terminal screens, detach and re-attach sessions and much more. If you work with multiple servers over ssh, you'll find a terminal multiplexer invaluable.

### Setup

First you'll need to install Tmux via your package manager or [download](https://tmux.github.io/) it. Tmux is highly configurable but the first change I'd recommend is to ssh, not Tmux. Make ssh "keep alive" for all connections by adding this to `~/.ssh/config`:

    host *
       ServerAliveInternal 300
       ServerAliveCountMax 3

If the file doesn't exist, create it. This configuration instructs your local machine for all user ssh sessions to send a server alive message every 300 seconds to keep the ssh session alive. If the local machine sends 3 unanswered messages, it will disconnect the session. You should tweak these settings to suit your needs: for instance restricting the `host` to specific domains let's you have different settings per domain. If you have a slow or unreliable internet connection, consider changing `ServerAliveInternal` to a lower number to send more frequent messages.

If you have permission on the server, you can add a similar configuration to `/etc/ssh/sshd_config`:

    ClientAliveInterval 300
    ClientAliveCountMax 3

Session Control (command line)
------------------------------

Sessions are one of the most useful features of Tmux. They let you group multiple terminal processes into a single Tmux session which can be worked on (attached), put into the background (detached) and discarded as you see fit. Because Tmux operates under a client-server architecture, even if the original terminal that started Tmux dies, or your desktop GUI crashes or whatever, the Tmux session will be preserved, along with all of the terminal sessions in it.

To start a new session just type `tmux` at the terminal prompt. The terminal screen should refresh and if you're using the default Tmux settings, you'll see a colored bar at the bottom of the screen.

To list existing Tmux sessions just use the `ls` command:

``` prettyprint
$ tmux ls
0: 1 windows (created Thu Jan 28 08:15:20 2016) [190x50] (attached)
2: 2 windows (created Thu Jan 28 09:11:59 2016) [190x50]
```

This shows that I have two Tmux sessions running, one of which is attached to a Terminal window already. To attach to a session just use the `attach` command at the terminal prompt:

``` prettyprint
$ tmux attach
```

By default Tmux attaches to the next unattached session ("2") in this case. If I have many different sessions and want to attach to a particular one, I can specify it with `-t` for target:

``` prettyprint
$ tmux attach -t 2
```

Ok that's enough terminal Tmux commands, let's see what's possible within a Tmux session!

The Prefix
----------

`Ctrl-b` is the **prefix** combination. Press the Ctrl key AND the letter b at the same time. When inside a Tmux session, the prefix is nearly always pressed before the shortcut key to trigger a command.

For example, to display a list of tmux commands, type: `Ctrl-b ?`

That means press `Control` and `b` together, release, then press `?`.

You can change the prefix, see the config section. If you do that, remember to use your prefix combination instead of `Ctrl-b` in the examples below.

Window Control
--------------

In a Tmux session windows are similar to tabs. Every window occupies the entirety of the terminal display. To create a new window press`Ctrl-b c`. You can cycle between windows: `Ctrl-b n` for the next window and `Ctrl-b p` takes you to the prior window. `Ctrl-b w` list all windows in a session and let's you select which one to active (using the arrow keys and enter).

If you know the window number you can also jump straight to it with `Ctrl-b #` replacing "\#" with the window number. By default they begin at 0, not 1!

Pane Control
------------

A window is divided into panes. - `Ctrl-b "` split pane horizontally - `Ctrl-b %` split pane vertically - `Ctrl-b o` next pane - `Ctrl-b ;` prior pane - `Ctrl-b direction` jump to pane - `Ctrl-b Ctrl-o` swap panes - `Ctrl-b space` arrange panes - `Ctrl-b + direction` change pane size - `Ctrl-b !` pop a pane into a new window

Scrolling and copy/paste
------------------------

- `Ctrl-b [` enter scroll mode - `Ctrl-b esc` exit scroll mode - `Ctrl-space` begin highlight for copy - `Alt-w` copy highlighted text - `Ctrl-b ]` paste text

Config Options
--------------

`~/.tmux.conf` is a plaintext file used by tmux for local config. If it doesn't exist, create it! This example config file shows some common options:

\`\`\`

set scroll history to 10,000 lines
==================================

set-option -g history-limit 10000

modern encoding and colors
==========================

set -g utf8 on set-window-option -g utf8 on set -g default-terminal screen-256color

unbind the prefix and bind it to Ctrl-a like screen
===================================================

unbind C-b set -g prefix C-a bind C-a send-prefix

use zsh instead of bash
=======================

set -g default-command /bin/zsh set -g default-shell /bin/zsh \`\`\`

To reload your `.tmux.conf` within a tmux session, type: `Ctrl-b :` then `source-file ~/.tmux.conf`.

tmux has a lot of configuration options, here is advanced config [example](https://github.com/zanshin/dotfiles/blob/master/tmux/tmux.conf)

Learning Resources
------------------

- The official tmux [website](https://tmux.github.io/) - The tmux [man page](http://manpages.ubuntu.com/manpages/precise/en/man1/tmux.1.html) is extensive. Read it in the terminal by typing the command `man tmux` - This [youtube series](https://www.youtube.com/watch?v=nD6g-rM5Bh0) by Jay LaCroix is a good introduction - This is another helpful [introduction video](https://www.youtube.com/watch?v=BHhA_ZKjyxo) for tmux - The Arch Linux [tmux documentation](https://wiki.archlinux.org/index.php/Tmux) goes deeper, covers advanced features - [tmux - Productive Mouse-Free Development](https://pragprog.com/book/bhtmux/tmux) by Pragmatic Bookshelf is thorough introduction to tmux

