
  {
    "title" : "What is the Perl Core?",
    "author": ["David Farrell"],
    "date"  : "2016-03-09T10:04:57",
    "tags"  : [],
    "draft" : true,
    "description" : "Unfortunately there's more than one way to package it",
    "image" : ""
  }

When I write the words "Perl Core" I mean the modules that ship with the `perl` interpreter, and I think that's what most people mean when they use that term. Knowing which modules are in the Perl core is useful; it enables developers to build programs without any external dependencies (over which the developer has no control). The perldoc site has a handy alphabetized [list](http://perldoc.perl.org/index-modules-A.html) of core modules and I generally check there first. The problem is that it's wrong.

### What modules are included in the Perl core?

Did you know that [HTTP::Tiny](http://metacpan.org/pod/HTTP::Tiny) has shipped with core Perl since version 5.14.0 (from 2011) ? It's not listed on [perldoc](http://perldoc.perl.org) (although that is on the list to be fixed at the next QA Hackathon). Luckily there is a better solution: the `corelist` program. This is supplied with [Module::CoreList](https://metacpan.org/pod/Module::CoreList/). Let's see when it first shipped with Perl:

    $ corelist -a Module::CoreList

    Data for 2015-06-01
    Module::CoreList was first released with perl v5.8.9
      v5.8.9     2.17
      v5.9.2     1.99
      v5.9.3     2.02
      v5.9.4     2.08
      v5.9.5     2.12
      v5.10.0    2.13
      ...

I've truncated the output and kept the key details. It shows that Module::CoreList has been included since Perl version 5.8.9. At home I run Fedora 23, which comes with Perl version 5.22.1. Running the system Perl `corelist`:

    $ sudo corelist -a Module::CoreList
    sudo: corelist: command not found

The program doesn't exist; the Fedora team didn't include it for some reason. Not only that, but great core modules like [Time::Piece](http://perltricks.com/article/59/2014/1/10/Solve-almost-any-datetime-need-with-Time--Piece/) aren't included either!

### Which modules do I have?

Sometimes instead of asking which modules are in the Perl Core we really mean, "which modules do I have?" For non-Core modules, we can use [perldoc](http://perltricks.com/article/14/2013/4/7/List-all-Perl-modules-installed-via-CPAN/). Except that `perldoc` isn't always available either (e.g. with AWS EC2 Ubuntu).

`perldoc` won't show us the core modules that we already have, and in the case of missing Core modules, Module::CoreList can't help either. A simple way I handle this is to dump the contents of `@INC`; the directories which `perl` searches for modules. I can then use some Unix-foo to count the files in each directory.

    $ /usr/bin/perl -E 'for (@INC) { print "$_: " . `ls -lh $_ | wc -l` }'
    /usr/local/lib64/perl5: 2
    /usr/local/share/perl5: 2
    /usr/lib64/perl5/vendor_perl: 49
    /usr/share/perl5/vendor_perl: 75
    /usr/lib64/perl5: 58
    /usr/share/perl5: 94
    .: 10

Every directory has a different number of files. The `/usr/local/` directories are where modules from CPAN are installed. So the remaining directories are the ones to containing the core Perl modules shipped with Fedora 23 system Perl. This method should work on all Unix-based systems (although the directory names change). This one-liner from `perldoc perlmodlib` lists all module files:

    $ /usr/bin/perl -MFile::Find=find -MFile::Spec::Functions -Tlw -e 'find { wanted => sub { print canonpath $_ if /\.pm\z/ }, no_chdir => 1 }, @INC'

If you want a module names instead of filepaths, a quick-and-dirty way is to extract them from the `man` pages. This works on Fedora 23:

    $ perl -E '$m = "/usr/share/man/man3"; while (<$m/*>) { if (/\.3pm\.gz/) { say substr $_, length($m) + 1, -7  } }'

On Fedora the Perl man pages end in `.3pm.gz`. On Ubuntu the files end in `.3perl.gz` and on OSX it's `.3pm` so adjust the above code accordingly. Every core module should have a man page. From what I've seen on Fedora and Ubuntu, the man pages are excluded for the modules not shipped with system Perl (like Time::Piece). One downside of this approach is it lists every module rather than every distribution, (see this [explanation](http://perltricks.com/article/96/2014/6/13/Perl-distributions--modules--packages-explained/) if you're not familiar with the distinction).

### Conclusion

It's always easier to work with a locally installed version of Perl than the system-installed version. The local Perl versions provided by perlbrew and plenv contain the all core modules and utilities. Strawberry Perl for Windows even comes with some useful extras. If you do have to rely on the system Perl, you may find a core module isn't there at all.
