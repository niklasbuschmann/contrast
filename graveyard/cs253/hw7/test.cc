#include "Words.h"
#include "Words.h"      // I meant to do that.
#include <iostream>
#include <cassert>

using namespace std;

int main() {
    const Words a(R"(Raiders Temple\ of\ Doom Last\ Crusade)");
    cout << "Normal:\n";
    for (auto [word, esc] : a)
        cout << '\t' << word << (esc ? " (escaped)\n" : "\n");

    cout << "Reverse:\n";
    const Words::iterator beg = a.begin();
    for (Words::iterator it = a.end(); beg != it; ) {
        it--;
        auto p = *it;
        cout << '\t' << p.first << '\n';
    }

    Words b(a);
    b.reject("D");
    cout << "Without D:\n";
    for (auto [word, esc] : b)
        cout << '\t' << word << '\n';

    cout << "Without ca%b\n";
    b.reject("ca%b");
    for (auto [word, esc] : b)
        cout << '\t' << word << '\n';

    cout << "Without 123:\n";
    b.reject("123");
    for (auto [word, esc] : b)
        cout << '\t' << word << '\n';

    cout << "All:\n";
    b.reject("");
    auto begin_it = b.begin(), end_it = b.end();  // We like everything!
    // This .reject() will NOT affect the iterators begin_it & end_it:
    b.reject("aeiouy");
    for (auto it=begin_it; it!=end_it; ++it)
        cout << '\t' << (*it).first << '\n';      // Should really use ->

    cout << "Post-increment testing:\n";
    b.reject("d");
    for(auto it = b.begin(); it != b.end(); it++)
        cout << '\t' << (*it).first << '\n';

    cout << "Post-decrement testing (Reverse):\n";
    b.reject("L");
    const Words::iterator beg1 = b.begin();
    for (Words::iterator it = b.end(); beg1 != it; ) {
        --it;
        auto p = *it;
        cout << '\t' << p.first << '\n';
    }

    return 0;
}