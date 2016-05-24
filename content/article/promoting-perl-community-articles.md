
  {
    "title"  : "Promoting Perl community articles",
    "authors": ["David Farrell"],
    "date"   : "2016-05-23T20:28:36",
    "tags"   : [],
    "draft"  : true,
    "image"  : "",
    "description" : "",
    "categories": "community"
  }

The last part of Justin Searls' [talk](https://vimeo.com/165527044#t=28m10s) has some great advice for promoting Ruby that applies to Perl too. If you haven't seen it, I'd encourage you to watch it. Justin points out that some tech projects like Ruby on Rails are essentially, done. They're feature complete and achieve everything they set out to accomplish. This means that they're no longer cutting edge tech, and consequently fewer articles are written about them.

We see this with Perl too. Modules like [Moose](https://metacpan.org/pod/Moose) and [Mojolicious](https://metacpan.org/pod/Mojolicious) are battle-tested, proven libraries that do a wonderful job. So we don't see many hype articles about them either. The solution to this is to focus on evergreen story telling:

> Tell stories that help people solve problems. And if you love Ruby, tell your story in Ruby.
>
> Justin Searls

As Perl programmers we're using the language to solve problems every day. And we'll never run out of problems to solve: there are always new systems to integrate, new data challenges, algorithms to implement and bugs to fix. That's why it doesn't matter that so much has already been written about Perl - new experiences will always be around the corner. And new is good.

Many Perl programmers are regularly writing about these sorts of things. But for those of you who aren't; if you want Perl to remain a mainstream language, if you want to be able to get paid for programming in Perl, tell some stories in Perl.

### Promoting articles
The other thing we can always improve on is promoting new Perl content. This isn't an exhaustive list, just a few suggestions on how to help.

Last week I added the "Community Articles" toolbar to this website. It's a JavaScript widget that's powered by [Perly::Bot](https://github.com/dnmfarrell/Perly-Bot). You can add this widget to your website with the following code:

    <script src="https://perltricks.com/widgets/toplinks/toplinks.js" type="text/javascript"></script>
    <div id="toplinks"></div>

The list of links is updated hourly, served over HTTPS and hosted on GitHub pages. The widget is clever enough to skip links to articles on the host domain too.

If you'd rather not add that sidebar, consider adding a [widget](https://www.reddit.com/r/perl/widget) for `/r/perl`. The Reddit widget respects Do Not Track.

Finally, participate on [/r/perl](https://reddit.com/r/perl) and Twitter! Link to Perl resources and content you like; retweet other's Perl related tweets. Use the `#perl` hashtag.
