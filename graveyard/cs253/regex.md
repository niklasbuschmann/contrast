---
title:  "Regular Expresions"
layout: post
---
\>details here<

{% highlight  c++ %}

    #include <iostream>
    #include <regex>

    using namespace std;

    // Match a regular expression (pattern) against a fixed string,
    // and show the match, if any.

    void test(int test_number, string pattern) {
        const string target("A quick brown fox jumps over the lazy dog");

        cout << test_number << ": pattern=\"" << pattern << "\""
        << " target=\"" << target << "\"" << endl;

        const regex r(pattern);	    // Compile regexp into internal form.
        smatch m;			    // Match information goes here.

        if (regex_search(target, m, r))
        cout << "   at " << m.position() << ": \"" << m.str() << "\"\n";
        else
        cout << "   no match\n";
    }

    int main() {

        // Exercise 1
        // Match the string "jump"--nothing else.
        // Look, I did it for you!
        test(1, "jump");

        // Exercise 2
        // Match the string "A", but only at the start of the line.
        test(2, "^A");

        // Exercise 3
        // Match the string "lazy dog", but only at the end of the line.
        test(3, "lazy dog$");

        // Exercise 4
        // Match the letter v, followed by any single character, followed by r.
        test(4, "v.r");

        // Exercise 5
        // Match "fo", followed by any string of any length,
        // including the empty string, followed by "er".
        test(5, "fo.*er");

        // Exercise 6
        // Match "ro", followed by any number of w’s,
        // but it must be at least one, followed by "n":
        test(6, "row+n");

        // Exercise 7
        // Match "bro", followed by an optional "q", followed by "w".
        test(7, "broq?w");

        // Exercise 8
        // Match a word, at least four letters long, that doesn’t contain "i".
        test(8, "[^i\\s]{4,}");

        // Exercise 9
        // Match "the ", followed by either "lazy" or "old", followed by " dog".
        test(9, "the (lazy|old) dog");

        // Exercise 10
        // Match "o", followed by any single character "m" through "x",
        // followed any single character "a" through "f".
        test(10, "o[m-x]{1}[a-f]{1}");

        // Exercise 11
        // Match a single character that isn’t "f" or "g",
        // followed by "o", followed by a letter "a" through "m".
        test(11, "[^fg]{1}o[a-m]{1}");

        // Exercise 12
        // Match an entire single word that ends with "e".
        test(12, "\\w+e\\b");

        // Exercise 13
        // Match three consecutive words, where the middle word begins with "f".
        test(13, "\\b\\w+\\s\\b\\b[f]{1}\\w+\\s\\b\\b\\w+\\b");

        return 0;
    }

{% endhighlight %}