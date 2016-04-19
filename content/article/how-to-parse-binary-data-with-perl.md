
  {
    "title"  : "How to parse binary data with Perl",
    "authors": ["David Farrell"],
    "date"   : "2016-04-18T19:56:47",
    "tags"   : [ "binary","unpack", "png", "tzfile", "olsen", "zoneinfo"],
    "draft"  : true,
    "image"  : "/images/how-to-parse-binary-data-with-perl/hackers_internet.jpg",
    "description" : "Parsing binary data is easy with unpack",
    "categories": "data"
  }

Parsing binary data is one of those tasks that seems to come up rarely, but is useful to know. Many common file types like images, music, timestamps, network packets and auth logs all come in binary flavors. Unfortunately it's nowhere near as exciting as the fictitious depictions from [Hackers](https://en.wikipedia.org/wiki/Hackers_%28film%29). The good news though is parsing binary data with Perl is easy using the `unpack` function. I'm going to walk you through the three steps you'll need when working with binary data.

### 1. Open a binary filehandle

Start things off *right* by opening a filehandle to binary file:

``` prettyprint
use autodie;
open my $fh, '<:raw', '/usr/share/zoneinfo/America/New_York';
```

This is a suitably Modern Perlish beginning. I start by importing [autodie](https://metacpan.org/pod/autodie) which ensures the code will `die` if any filehandle operation fails. This avoids repetive `... or die "IO failed"` coding constructs. The file is the history of New York timezone changes, from the [tz database](https://en.wikipedia.org/wiki/Tz_database).

Next I use the `:raw` IO layer to open a filehandle to a binary file. This will avoid newline translation issues. No need for `binmode` here.

### 2. Read a few bytes

All binary files have a specific format that they follow. In the case of the zoneinfo files, the first 44 bytes are the header, so I'll grab that:

``` prettyprint
use autodie;
open my $fh, '<:raw', '/usr/share/zoneinfo/America/New_York';

my $bytes_read = read $fh, my $bytes, 44;
die 'Got $bytes_read but expected 44' unless $bytes_read == 44;
```

Here I use `read` to read in 44 bytes/octets of data into the variable `$bytes`. The `read` function returns the number of bytes read; it's good practice to check this as read may not return the expected number of bytes if it reaches the end of the file. In this case, if the file ends before the header does, we know we've got bad data and bail out.

### 3. Unpack bytes into variables

Now comes the fun part. I've got to split out the data in `$bytes` into separate Perl variables. The tzfile [man page](http://linux.die.net/man/5/tzfile) defines the header format:

> Timezone information files begin with the magic characters "TZif" to identify them as timezone information files, followed by a character identifying the version of the file's format (as of 2005, either an ASCII NUL ('\0') or a '2') followed by fifteen bytes containing zeros reserved for future use, followed by six four-byte values of type long
>
> <cite>Tzfile manual</cite>

What I need to do now is use `unpack` to split out this data. `unpack` needs a template of the binary data to read (this is defined in the pack [documentation](http://perldoc.perl.org/functions/pack.html). I'm going to match up the header description with the template codes to design the template.


| Description  |   Example  | Type       | Length | Template Code|
|--------------|------------|------------|--------|--------------|
| Magic chars  | `TZif`       | String     | 4      | `a4`         |
| Version      | `2`          | ASCII String | 1    | `A` |
| Reserved     | `0`          | Ignore     | 15     | `x15` |
| Numbers      | `244`        | Long       | 1      | `N N N N N N` |

The header begins with the magic chars "TZif", this is 4 bytes terminated by a null byte `\0`. The template code `a4` matches this. Next is the version, this is a single ASCII character matched by `A`. The next 15 bytes are reserved and can be ignored, so I use `x15` to skip over them. Finally there are 6 numbers of type long. Each one is separate variable so I must write `N` 6 times instead of `N6`.

``` prettyprint
use autodie;
open my $fh, '<:raw', '/usr/share/zoneinfo/America/New_York';

my $bytes_read = read $fh, my $bytes, 44;
die 'Got $bytes_read but expected 44' unless $bytes_read == 44;

my ($magic, $version, @numbers) = unpack 'a4 A x15 N N N N N N', $bytes;
```

This code passes my template to `unpack` and it returns the variables we asked for. Now they're in Perl variables, the hard part is done. In the case of a tzfile, the header defines the length of the body of the file, so I can use these variables to calculate how much more data to read from the file.

If you're interested in how to parse the rest of a tzfile, check out the source code of my module [Time::Tzfile](https://metacpan.org/pod/Time::Tzfile).

### More binary parsing examples

* In section 7.2 of [Data Munging with Perl](http://perlhacks.com/2014/04/data-munging-perl/) Dave Cross shows how to parse PNG and MP3 data.
* There are some useful replies on the PerlMonks thread [Confession of a Perl Hacker](http://www.perlmonks.org/?node_id=53473).
* Entry 117 "Use pack and unpack for data munging" from [Effective Perl Programming](http://www.effectiveperlprogramming.com/) shows how to use `unpack` for fixed width data.
* The official Perl documentation also has a pack/unpack [tutorial](http://perldoc.perl.org/perlpacktut.html).
