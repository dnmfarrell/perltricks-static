{
   "title" : "How to read a string into an array of characters using split",
   "image" : null,
   "tags" : [
      "string",
      "array",
      "split",
      "old_site"
   ],
   "draft" : false,
   "date" : "2013-10-03T00:42:18",
   "slug" : "42/2013/10/3/How-to-read-a-string-into-an-array-of-characters-using-split",
   "description" : "Perl's split function has a useful feature that will split a string into characters. This works by supplying an empty regex pattern (\"//\") to the split function. This can be used to easily split a word into an array of letters, for example:",
   "authors" : [
      "David Farrell"
   ]
}

Perl's split function has a useful feature that will split a string into characters. This works by supplying an empty regex pattern ("//") to the split function. This can be used to easily split a word into an array of letters, for example:

``` prettyprint
my $word = 'camel';
my @letters = split(//, $word);
```

Perl's official documentation has more on the split function. You can read it [online](http://perldoc.perl.org/functions/split.html) or by running the following command at the terminal:

``` prettyprint
perldoc -f split
```

