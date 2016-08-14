
  {
    "title"  : "Identify slow code with Devel::Timer",
    "authors": ["David Farrell"],
    "date"   : "2016-08-14T16:38:50",
    "tags"   : ["devel-timer", "benchmark", "refactor", "optimize", "speed"],
    "draft"  : true,
    "image"  : "",
    "description" : "How timing statements can help you pinpoint bottlenecks",
    "categories": "development"
  }

Program execution speed is an important factor in programming. No one wants their program to execute more slowly. As a general purpose programming language, Perl is usually fast enough for most things, and when it isn't, we have some great tools to help us make it faster. We can use the [Benchmark]() module to compare code and [Devel::NYTProf]() to produce detailed analyses of our programs. This article is about [Devel::Timer](), another module I like to use when I want to optimize an existing subroutine, and I'm not sure how long each statement within the subroutine takes to execute. It's very easy to setup, so if you haven't used it before, once you've read this article you'll have another tool in your toolbox for timing code.

### Use Devel::Timer to get a timing report

Let's say I have a subroutine which is far too slow, but I'm not sure what's slowing it down. The (fictional) subroutine looks like this:

``` prettyprint
sub foo {
  my $args = shift;

  die 'foo() requires an hashref of args'
    unless $args && ref $args eq 'HASH';

  my %parsed_args = validate_args($args);

  my $user        = find_user($parsed_args{username});

  my $location    = get_location($parsed_args{req_address});

  my $bar         = register_request($user, $location);

  return $bar;
}
```

I can use [Devel::Timer]() to time each statement in the subroutine, and tell me how long each one took:

``` prettyprint
use Devel::Timer;

sub foo {
  my $args = shift;
  my $timer = Devel::Timer->new();
  die 'foo() requires an hashref of args'
    unless $args && ref $args eq 'HASH';
  $timer->mark('check $args is hashref');

  my %parsed_args = validate_args($args);
  $timer->mark('validate_args()');

  my $user        = find_user($parsed_args{username});
  $timer->mark('find_user()');

  my $location    = get_location($parsed_args{req_address});
  $timer->mark('get_location()');

  my $bar         = register_request($user, $location);
  $timer->mark('register_request()');

  $timer->report();
  return $bar;
}
```

I've updated the code to import Devel::Timer and construct a new `$timer` object. After every statement I want to time, I call the `mark` method which adds an entry to the timer. Finally I call `report` which prints out a table listing every `mark` call.

    Devel::Timer Report -- Total time: 7.0028 secs
    Interval  Time    Percent
    ----------------------------------------------
    05 -> 06  3.0006  42.85%  something begin -> something end
    03 -> 04  2.0007  28.57%  something begin -> something end
    06 -> 07  1.0009  14.29%  something end -> END
    01 -> 02  1.0004  14.29%  something begin -> something end
    00 -> 01  0.0000   0.00%  INIT -> something begin
    04 -> 05  0.0000   0.00%  something end -> something begin
    02 -> 03  0.0000   0.00%  something end -> something begin

### Measurement traps

- run only once (outliers, lazy initialization)
- environment factors (hardware, network, resources)
- Perl / module versions


### References

- [Devel::Timer]()
- [Benchmark::Stopwatch]() very similar to Devel::Timer
- [Devel::NYTProf]() (link to Tim Bunce talk)
- The [Benchmark]() module comes with Perl. I wrote about how to use it [How to benchmark Perl code for speed](http://perltricks.com/article/40/2013/9/29/How-to-benchmark-Perl-code-for-speed/)
