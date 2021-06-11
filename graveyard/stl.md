---
title:  "STL"
layout: post
---
\>details here<

The STL is the Standard Template Library.

{% highlight c %}

    #include <iostream>
    #include <fstream>
    #include <string>
    #include <vector>
    #include <set>
    #include <iterator>
    using namespace std;
    //STEP 1: initialize a vector to hold integers read from input
    int main(){
        vector<int> v;
        int c;
        cin >> c;
        while (c != 0){
            v.push_back(c);
            cin >> c;
        }
        //STEP 2: print a line for each int element in the vector
        for (size_t i = 0 ; i < v.size(); i++){
            cout << v[i] << '\n';
        }
        //STEP 3: Read all char's into one big string
        ifstream in("/etc/resolv.conf");
        string oneBigString;
        char f;
        while (in.get(f)){
            oneBigString += f;
        }
        //STEP 4: Copy each char in oneBigString to a multiset ms
        multiset<char> ms;
        for(char c : oneBigString){
            ms.insert(c);
        }
        //STEP 5: Copy each char in ms to a set s
        set<char> s;
        for(auto c : ms){
            s.insert(c);
        }
        //STEP 6: Display the size and char's from oneBigString, s, and ms
        cout << "string: size=" << oneBigString.length() << " " << oneBigString;
        cout << "set: size=" << s.size() << " ";
        for(auto c : s){
            cout << c;
        }
        cout << '\n';
        cout << "multiset: size=" << ms.size() << " ";
        for(char c : ms){
            cout << c;
        }
        cout << '\n';
        //STEP 7: Add a comment block to explain why the sizes from above aren't the same.
        // QUESTION 7
        // In the output printed from the above code you see that string and multiset are 
        // allowed. You notice the multiset containes EVERY char from string but in order 
        // via the ASCII chart. The set has a smaller size becaue it does NOT repeat char's
        // though they are still in order via the ASCII chart.
        // the same size because repeated char's 

        //COMPILE: g++ results.cc
        //RUN:     ./a.out

    }

{% endhighlight %}