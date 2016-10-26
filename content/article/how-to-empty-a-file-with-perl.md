
  {
    "title"  : "How to empty a file with Perl",
    "authors": ["David Farrell"],
    "date"   : "2016-10-26T08:30:00",
    "tags"   : ["truncate", "open", "filehandle"],
    "draft"  : true,
    "image"  : "",
    "description" : "As easy as you'd expect it to be",
    "categories": "data"
  }

Have you ever had the experience of doing something a certain way for a long time, and then you discover a better way? This happened to me last week, when I was working on some code that needed to zero a file. Emptying a file is a common operation - maybe you have a session log file to write to, or want to limit disk space use, or whatever. Here's how I usually do it:

``` prettyprint
# zero the file
{ open my $session_file, '>', 'path/to/sessionfile' }
```

This opens a write filehandle on the file, effectively setting it's length to zero. I put the call to [open](http://perldoc.perl.org/functions/open.html) between curly braces in order to minimize the scope of the filehandle, `$session_file`. After that statement, the block closes, and `$session_file` variable goes out of scope, automatically closing the filehandle. As the block looks a little strange, I include an explanatory comment.

The other day though, I came across the [truncate](http://perldoc.perl.org/functions/truncate/html) function. This does exactly what you'd think it does: truncates files. It takes two arguments: the file path (or filehandle), and the length. So if you need to truncate a file, you can do:

``` prettyprint
truncate 'path/to/sessionfile', 0;
```

This doesn't use a lexical variable, so no scoping is required. It's unambiguous so no comment is needed either. I like it, it's a better way.

### Looking up Perl functions

Do you know Perl has around 220 built in functions? You can read about them in [perlfunc](http://perldoc.perl.org/perlfunc.html), or at the terminal with `perldoc perlfunc`. If you want to lookup a particular function's documentation, in the terminal you can enter the command `perldoc -f <function name>` to look it up. So `perldoc -f open` will display the documentation for the [open](http://perldoc.perl.org/functions/open.html) function. Read more about the [truncate](http://perldoc.perl.org/functions/truncate/html) function at the terminal with `perldoc -f truncate`.

*Vim users* if you're editing Perl code and want to lookup a function, place the cursor on it and type `Shift-k` to lookup the function in perldoc.
