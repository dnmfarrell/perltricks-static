
  {
    "title"  : "Track Module Changes While You Sleep",
    "authors": ["brian d foy"],
    "date"   : "2017-01-31T19:47:28",
    "tags"   : [],
    "draft"  : true,
    "image"  : "",
    "description" : "Let Perlmodules.net do the work",
    "categories": "cpan"
  }

Much of my work involves helping people turn legacy stuff into something testable, distributable, and installable (I find that special sort of drudgery quite interesting because every mess is different). I created [Module::Extract::Use](https://www.metacpan.org/module/Module::Extract::Use) as a simple tool to take some programs lying around and list the modules they use. Jonathan Yu created the example program <i>examples/extract_modules</i> which I extended a bit. Here are some examples using the script on itself:

	# print a verbose text listing
	$ extract_modules extract_modules
	Modules required by examples/extract_modules:
	 - Getopt::Std (first released with Perl 5)
	 - Module::CoreList (first released with Perl 5.008009)
	 - Pod::Usage (first released with Perl 5.006)
	 - strict (first released with Perl 5)
	 - warnings (first released with Perl 5.006)
	5 module(s) in core, 0 external module(s)

	# print a succint list, one module per line
	$ extract_modules -l extract_modules
	Getopt::Std
	Module::CoreList
	Pod::Usage
	open
	strict
	warnings

	# print a succinct list, modules separated by null bytes
	# you might like this with xargs -0
	$ extract_modules -l -0 extract_modules
	Getopt::StdModule::CoreListPod::Usageopenstrictwarnings

	# print the modules list as JSON
	$ extract_modules -j extract_modules
	[
		"Getopt::Std",
		"Module::CoreList",
		"Pod::Usage",
		"open",
		"strict",
		"warnings"
	]

Note that this program can only detect explicitly declared namespaces in static `use` and `require` statements. You don't see the [Module::Extract::Use](https://www.metacpan.org/module/Module::Extract::Use) in the output because this program uses it implicitly. That's a rare situation that doesn't bother me that much.

For example, I might want to install all of the dependencies from a standalone program:

	$ extract_modules -0 some_program | xargs -0 cpan

This is much better than what I use to do: keep trying to run the program until it doesn't complain about missing dependencies. Sometimes that will still happen will implicit dependencies, but as I said, it's rare.

There's another thing I like to do. Alexander Karelas created the website [PerlModules.net](https://www.perlmodules.net) to create feeds of changes to sets of modules. You create a feed that specifies the modules that you want to track. For each new release, he diffs the Changes file and adds that diff to your feed. If you like, you could have one feed per application. When the module changes, you'll see and entry in your feed and can read the diff without tracking down the module.

To get the list of modules I want to track, I can use `extract_modules` with its `-l` switch to make a one-namespace-per-line list of the dependencies. Here I use `extract_modules` on all of the modules in a project:

	$ find lib -name "*.pm" -print0 | xargs -0 extract_modules -l
	Archive::Extract
	Archive::Tar
	Archive::Zip
	... # long list elided
	YAML::XS
	base
	parent
	strict
	subs
	vars
	warnings

I can paste this list directly into the [PerlModules.net](https://www.perlmodules.net) feed creator (or, the motivated can automate this if they want to create many, many feeds).

Once I've created the feed, I can view it in a variety of ways. Although I could visit the website to see what's changed, I can also get updates in email or as an RSS feed.

