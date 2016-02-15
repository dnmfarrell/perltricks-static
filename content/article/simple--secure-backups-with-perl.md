{
   "tags" : [
      "stasis",
      "gpg",
      "tar",
      "dropbox",
      "aes",
      "old_site"
   ],
   "image" : "/images/185/487F38FA-4C68-11E5-A045-6BD5FB9DDBA7.jpeg",
   "title" : "Simple, secure backups with Perl",
   "authors" : [
      "David Farrell"
   ],
   "description" : "Creating encrypted, compressed archives",
   "slug" : "185/2015/8/27/Simple--secure-backups-with-Perl",
   "draft" : false,
   "date" : "2015-08-27T13:09:11"
}

Recently I was searching for a backup solution, and ended up rolling my own. The result is [Stasis](https://github.com/dnmfarrell/Stasis) a Perl program that uses `tar` and `gpg` to compress and encrypt files.

### How it works

Stasis takes a list of file and directory paths and builds a temporary compressed gzip archive using `tar`. It then encrypts the temporary archive with `gpg` using [AES 256-bit](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard), saving it to a new location and removes the temporary archive. Stasis supports backups using a passphrase or a GPG key.

### Examples

Let's say I wanted to backup all files in my main home directories. I'd create a text file called `files_to_backup.txt`, that contains:

    /home/dfarrell/Documents
    /home/dfarrell/Downloads
    /home/dfarrell/Music
    /home/dfarrell/Pictures
    /home/dfarrell/Videos

I can save all of these directories and files to Dropbox:

``` prettyprint
$ stasis --destination ~/Dropbox --files files_to_backup.txt --passphrase mysecretkey
```

Or more tersely:

``` prettyprint
$ stasis -d ~/Dropbox -f files_to_backup.txt --passphrase mysecretkey
```

Use passfile instead of passphrase:

``` prettyprint
$ stasis -d ~/Dropbox -f files_to_backup.txt --passfile /path/to/passfile
```

Use the "referrer" argument to provide a GPG key instead of a passphrase:

``` prettyprint
$ stasis -d ~/Dropbox -f files_to_backup.txt -r keyname@example.com
```

Ignore the files matching patterns in `.stasisignore`. This is useful if I wanted to ignore certain types of files, like OSX `.DS_Store` index files or more broadly, all hidden files: `.*`.

``` prettyprint
$ stasis -d ~/Dropbox -f files_to_backup.txt -r keyname@example.com -i .stasisignore
```

Only keep the most recent 5 backups:

``` prettyprint
$ stasis -d ~/Dropbox -f files_to_backup.txt -r mygpgkey@email.com -l 5
```

### Restoring a backup

First decrypt the the backup with `gpg`:

``` prettyprint
$ gpg -d /path/to/backup.tar.gz.gpg > /path/to/output.tar.gz
gpg: AES256 encrypted data
gpg: encrypted with 1 passphrase
```

GPG will ask for the passphrase or GPG key passphrase to unlock the data. You can then inspect the decrypted archive's files with `tar`:

``` prettyprint
$ tar --list -f /path/to/output.tar.gz
```

Or:

``` prettyprint
$ tar -zvtf /path/to/output.tar.gz
```

To unzip the archive:

``` prettyprint
$ tar -zvxf /path/to/output.tar.gz
```

### Scripting Stasis

This script creates weekly backups using Stasis. I have a cron job that runs the script every 30 minutes - if it can't find a Stasis backup archive that is less than a week old, it will start a new backup.

``` prettyprint
#!/usr/bin/env perl
use strict;
use warnings;
use Time::Piece;
use Time::Seconds;
use Getopt::Long 'GetOptions';

GetOptions ( force => \my $force );

my $time_now   = localtime;
my $week_ago   = $time_now - ONE_WEEK;
my $backup_dir = '/home/dfarrell/Dropbox/backups';
my $need_backup= 'true';

# look for a backup file younger than 1 week
opendir(my $dir, $backup_dir) or die "Can't open backup_dir $!\n";
while (readdir $dir)
{
  next unless /^stasis-.+?\.gpg$/;
  my @stat = stat "$backup_dir/$_";
  $need_backup = 0 if $stat[10] > $week_ago->epoch;
}

if ($need_backup || $force)
{
  system('/home/dfarrell/Projects/Stasis/stasis \
    -d /home/dfarrell/Dropbox/backups \
    -f /home/dfarrell/Projects/Stasis/backup_list \
    -i /home/dfarrell/Projects/Stasis/.stasisignore \
    -l 4 \
    --passfile /home/dfarrell/.stasis'
  ) == 0 or die "Error creating backup $?\n";
}
else
{
  print "No backup required\n";
```

The script is saved in my path as `backup`. So I can also generate a fresh backup anytime with this terminal command `backup --force`. If you use the script, be sure to update the filepaths for your own system. Both Stasis and this script only use core Perl - no additional modules should need to installed providing you have a fairly modern Perl distribution.

### Disadvantages of Stasis

Stasis suits my needs but it has several drawbacks which mean it might not be ideal for you. For one thing, it creates a standalone, encrypted archive every time it runs instead of incremental backups. Although this is simple, it also wastes space, so consider the implications if you intend to keep many backup copies. Because Stasis creates a temporary copy of the data it archives, it also requires enough disk space to create two compressed archives of the data.

As Stasis creates a new archive every time, it can be a resource intensive process to backup. On my ultrabook, it takes Stasis about 20 seconds to create a new 400MB new archive. If you are intending to archive large amounts of data, you may need another solution.

Archive names are fixed and should not be changed. Stasis creates encrypted archives with the ISO 8601 datetime in the filename like:`stasis-0000-00-00T00:00:00.tar.gz.gpg`. To detect previous backup files, Stasis looks for files matching this pattern in the backup directory. This comes into play of you use the `--limit` option, which will limit the number of archives retained.

### Stasis cheatsheet

    stasis [options]

    Options:

        --destination -d  destination directory to save the encrypted archive to
        --files       -f  filepath to a text file of filepaths to backup
        --ignore      -i  filepath to a text file of glob patterns to ignore
        --limit       -l  limit number of stasis backups to keep in destination directory (optional)
        --passphrase      passphrase to use
        --passfile        filepath to a textfile containing the password to use
        --referrer    -r  name of the gpg key to use (instead of a passphrase or passfile)
        --temp        -t  temp directory path, uses /tmp by default
        --verbose     -v  verbose, print progress statements
        --help        -h  print this documentation

