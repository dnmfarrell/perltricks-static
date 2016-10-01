
  {
    "title"  : "Hacktoberfest is here",
    "authors": ["brian d foy"],
    "date"   : "2016-10-01T00:00:01",
    "tags"   : ["perl","github", "pull-request","git"],
    "draft"  : true,
    "image"  : null,
    "description" : "Send those Perl GitHub pull requests!",
    "categories": "community"
  }

[Hacktoberfest](https://hacktoberfest.digitalocean.com/) is here, and you can be part of the effort to make Perl the most popular language to participate in the month long festival of patches and pull requests.

VPN provider [DigitalOcean](https://www.digitalocean.com/) and [GitHub](https://www.github.com/) have teamed up to encourage new users to participate in open source. Make four pull requests to any GitHub project and they'll give you a limited-edition Hacktoberfest t-shirt. It might not sound like much, but consider what you get besides the shirt: you're in the commit logs of four projects and your profile has some history. That's the first step in building your open source résumé.

The sponsors suggest that projects that want to participate label their issues with "Hacktoberfest". That's not strictly necessary, but you can [search for issues that projects think are suitable for new users](https://github.com/search?q=state%3Aopen+label%3Ahacktoberfest&type=Issues). I think all of my projects are suitable (I may be optimistic), so I wanted a way to label all of my issues across all of my projects.

I found out about this as I was building some other GitHub tools. I looked at [Net::GitHub](https://www.metacpan.org/module/Net::GitHub) and [Pithub](https://www.metacpan.org/module/Pithub), but I wanted to iterate through long lists of paged results and process each item as I received them. And, even if you are re-inventing the wheel you're learning about wheels! And, the [GitHub Developer API](https://developer.github.com/v3/) is quite nice, making this a fun night of work.

I had some hacky stuff I started to pull together in the [Ghojo]() module, which is still very much in its infancy (which means there's all sorts of pull request opportunities). Actually, it's a bit of a mess and everything is likely to change, but I was able to create a program that could log in, list all of my repos (there are a couple hundred), create the "Hacktoberfest" label in each, and then apply the label to each open issue. It's my [hacktoberfest.pl program](https://github.com/briandfoy/ghojo/blob/master/examples/hacktoberfest.pl) in my [ghojo](https://github.com/briandfoy/ghojo) repository.

Curiously, with a couple of hours of uploading this stuff, I received [my first Hacktoberfest pull request](https://github.com/briandfoy/ghojo/pull/14). [haydenty](https://github.com/haydenty) added the [CONTRIBUTING.md](https://github.com/briandfoy/ghojo/blob/master/CONTRIBUTING.md) file to my ghojo repo. It's something I've been meaning to add to all of my repositories. Now I'm considering adding an issue to each repository to note that, and once I've done that, I'll label each of those issues as "Hacktoberfest". Or, someone who wants to get started with something simple can create the issues for me, or send the pull requests right off.

If you're in the mood to participate but haven't used GitHub that much, realize you only get one pull request per repo at a time. It's really a request for the origin repository to grab your changes. But, it's the changes at the time when they decide to merge your results, not when you created the pull request. If you keep working, all those changes count as the same pull request. That means you might want to work on four separate repositories (i.e. projects) to create four separate pull requests. That way you'll get your special, limited-edition t-shirt.

But, this is [PerlTricks](https://www.perltricks.com), so I should show you a little about Perl. I mentioned a few other interfaces to the GitHub API, and maybe those work for you. No module is a one-size-fits-all tool. I want to do something different.

Most of the modules for these APIs are very thin wrappers. You have to know the low-level API quite well to use it. You need to know what to input and understand the data structures. I want something much more high level. Do you want to set the the label color to orange for Halloween (an American holiday which has unfortunately escaped the laboratory)? I don't think you should have to know the calling conventions or grok the data structures. I don't think you should have to know that the API specifies six-digit hexadecimal RGB values.

``` pretty-print
$repo->set_label_color( 'Hacktoberfest', 'orange' );
```

My code (or, your code if you send one of those pull requests), will translate everything to the right requests, will read the responses, and will translate those the value you probably want.

That's what I really like to see in an API: the forethought of questions people probably want to ask and the answers they want to receive. At the same time, I'd still like to have the knobs and dials that developers like to play with.

I'm mostly at the knobs and dials part, but I allow quite a bit of flexibility by accepting a callback for things I expect to return many items:

``` pretty-print
use Ghojo;

my $ghojo = Ghojo->new( { token => ... } );

my $callback = sub {
	my $item = shift;
	...
	};

$ghojo->repos( $repo_callback );
```

Each time I find a repo—and you don't have to know how I do that—I run that callback. It's a little bit like [File::Find](https://www.metacpan.org/module/File::Find)'s use of the `wanted` coderef. You don't see the very nice API paging going on either. That `repos` keeping fetching more results as long as GitHub keeps telling it there are more results.

That callback deals with a repository, but a repository as issues. It's the same situation inside each repository. I want to process a possibly long list (if I'm so lucky) of issues as I run into them. Now I have a callback process an item that has additional items that get a nested callback in this stripped down version of the real thing:

``` pretty-print
use v5.24;

use Ghojo;

my $ghojo = Ghojo->new( { token => ... } );

my $label_name = 'Hacktoberfest';

my $callback = sub ( $item ) {
	my( $user, $repo ) = split m{/}, $item->{full_name};

	my $repo = $ghojo->get_repo_object( $owner, $repo );

	# get the labels for that repo
	my %labels = map { $_->@{ qw(name color) } } $repo->labels->@*;

	unless( exists $labels{$label_name} ) {
		my $rc = $repo->create_label( $label_name, 'ff5500' );
		say "\tCreated $label_name label" if $rc;
		}

	my $callback = sub ( $item ) {
		$repo->add_labels_to_issue( $item->{number}, $label_name );
		return $item;
		};

	my $issues = $repo->issues( $callback );

	return $repo;
	};


$ghojo->repos( $repo_callback );
```

If you're the sort of person with lots of repos, label your issues to help push Perl up in [the rankings](https://github.com/search?q=state%3Aopen+label%3Ahacktoberfest&type=Issues). By the time we reach the end of the month, I'll have a program to reverse the labeling.

Some of this I'm doing for fun, and some of this I'm doing because some organizations want some GitHub tools. Somehow how October is when all of that is coming together. If you'd like me to work on this sort of stuff for you, [let me know](mailto:brian.d.foy@gmail.com]! But, send those pull requests first so you get that t-shirt.
