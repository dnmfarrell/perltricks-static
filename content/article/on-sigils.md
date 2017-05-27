
  {
    "title"  : "On Sigils",
    "authors": ["David Farrell"],
    "date"   : "2017-05-14T15:45:24",
    "tags"   : [],
    "draft"  : true,
    "image"  : "",
    "description" : "Should programming languages use them?",
    "categories": "development"
  }

One thing that distinguishes Perl from other languages is its use of sigils; the funny looking symbols placed in front of variable names. As experienced Perl programmers, we assume sigils are an essential part of Perl, but when I dream about my ideal version of Perl, I go back-and-forth as to how sigils would work, and even whether they're required at all.

### Background

First though, some background. In Perl there are 5 kinds of sigils:

| Sigil | Meaning | Example
|---|---|---|
| `$` | Scalar | `$foo`
| `@` | Array | `@foo`
| `%` | Hash | `%foo`
| `&` | Subroutine | `&foo`
| `*` | Typeglob | `*foo`

The `&` for subroutines is usually only needed when creating references to them. The typeglob is rarely used so I'm going to ignore it for the rest of this article.

> Sigils have many benefits, not least of which is that variables can be
interpolated into strings with no additional syntax. Perl scripts are also easy to
read (for people who have bothered to learn Perl!) because the nouns stand out
from verbs. And new verbs can be added to the language without breaking old
scripts.
>
> Programming Perl, Chapter 1, 4th Edition

This quote neatly articulates the main arguments in favor of sigils, to which I'd add type declaration terseness for arrays and hashes.  I'm going to step through these arguments one by one.

### Simpler string interpolation

It's undeniable that string interpolation is easier with sigils, compared to using `sprintf`, concatenation or `join`:

``` prettyprint
"$greeting, $name";
sprintf '%s, %s', greeting, name;
greeting . ', ' . name;
join ', ', greeting, name;
```

Not only is the syntax simpler, it's easier to read. It does mean that dollar signs need to be escaped in double quoted strings, but this is a rare use case it doesn't seem important.

### Readability

Programming Perl claimed using sigils makes "the nouns stand out from the verbs", and that's probably true: sigils do clearly demarcate variables from built-in functions and subroutines. However when I'm programming in other languages like C, I don't seem to have difficulty identifying variables. Text editors usually color variables differently from other words, which helps.

This claim is subjective; I know of other Perl programmers believe it is more readable _because_ of the sigils. Part of the problem I think, is that Perl has a huge syntax; with over 220 built-in functions. Even with a plaintext editor, if your language has only 20 keywords, it's much easier to identify variables and functions.

> Sigils separate variables into different namespaces. It's possible—though
> confusing—to declare multiple variables of the same name with different types
>
> Modern Perl, Chapter 3, 4th Edition

Perl 5 uses variant sigils: the symbol changes depending on the type being accessed. For example:

``` prettyprint
my @num = (1, 2, 3);
my $num = 25;
say $num[1]; #2
```

Here all three variables are different; Perl maintains a sub-namespace of scalars, arrays, hashes and subroutines (and more) for every global and lexical context. This permits the confusing behavior of multiple variables with the same name of different types. The fact that the sigil changes depending on the context it's used in is also confusing: Perl 6 dropped this behavior, which I think settles the argument over whether variant sigils impinge readability or not. I won't even bring up array slices, which use the `@` sigil and can be applied to hashes too.

### Extendability

This is the idea that by using sigils, new keywords can be added to the language and not break old code, as they won't contain variables whose names clash with keywords. Whilst this is undoubtedly true, I have a few problems with this. Firstly, if we believe the Programming Perl claim that variables are nouns and keywords are verbs, then they should rarely clash anyway. Second, Perl allows subroutines to be used without sigils. These are surely much more likely to clash with keywords, both being "verbs" so to speak. Third, Perl allows "constants" to be declared without sigils at all. So if sigils reduce the risk of new keywords breaking old code, they don't handle the most common cases.

Another way to reduce the risk of clashes is to use far fewer builtin keywords, and instead make them class methods. Instead of the `open` function for example, provide a `IO` class with an `open` method.

### Type declaration terseness

For arrays and hashes, instead of providing a class name and calling a constructor method, in Perl we can simply use `@` or `%`. This reduces the amount of text needed, consider:

``` prettyprint
my @numbers = (1, 2, 3);
my numbers  = Array->new(1, 2, 3);
```

The first way is obviously shorter. What about other types though? What if we wanted to create a new ordered hash type? Even though it's an ordered collection of pairs, much like an array, we can't use the `@` or `%` sigils. We have to create an object and use the `$` sigil instead. That's inconsistent. Same goes for stacks, queues, or any other data type not provided natively by the language. What could we do instead? Provide new sigils for all types? We'd run out of symbols!

Perl 6 takes a different approach: the [sigil](https://docs.perl6.org/language/variables) denotes a interface supported by the underlying type. For example `@` means positional, `%` means associative and `&` means callable. You can also define [custom types](https://docs.perl6.org/language/subscripts#Custom_type_example). This approach preserves the look and feel of Perl 5 whilst placing the syntax on a more logical footing. But it's not without its peculiarities. For instance the scalar sigil `$` denotes "no type constraint". So you can do this:

``` prettyprint
my %h = Hash.new( 'a', 1 );
my $h = Hash.new( 'b', 2 );
```

This code declares two hashes one with the associate sigil `%` and one with the "no type constraints" sigil `$`. What's the difference between the two? You might think that only the one declared with the associate sigil can use the postcirmcumfix accessor, but they both work:

``` prettyprint
say %h<a>;
say $h<b>;
```

So with Perl 6, an `@` or `%` sigil indicates an interface you can use, but the `$` doesn't indicate that you can't use the associative or positional interfaces too. Furthermore, these two variables have the same name, and the same type. Yet they coexist merrily in the same scope. So the sigil _does_ denote an underlying type difference and not just an interface. With the callable `&` sigil; between the block, arrow and `sub` syntaxes, and being able to use `$` as well as `&` I can count 10 different ways to assign a [callable](https://docs.perl6.org/type/Callable) type.

### Conclusion

In my ideal, fantasy Perl, everything would be object oriented. It would be a simpler Perl, with much less syntax than the Perls of today. I think it would have sigils, but only `$`. All variables would begin with dollar, à la PHP. This simpler approach would net the main benefits claimed for sigils (readability, string interpolation) without the confusion from variance and the kind of sigil used informing the underlying type being accessed. It would prevent multiple variables of the same name but different types existing in the same scope. And it improves the chances that newcomers would grok Perl faster, especially if they have programmed in PHP or shell before.

### References

* [The Problem With Sigils](http://wiki.c2.com/?TheProblemWithSigils) is a collection of arguments for and against sigils
* [Programming Perl 4th Edition](https://www.amazon.com/Programming-Perl-Unmatched-processing-scripting/dp/0596004923)
* [Modern Perl, 4th Edition](https://pragprog.com/book/swperl/modern-perl-fourth-edition)
* Perl 6 variables [documentation](https://docs.perl6.org/language/variables)
* Perl 6 [custom types](https://docs.perl6.org/language/subscripts#Custom_type_example)
* Perl 6 [callable](https://docs.perl6.org/type/Callable) type
