---
title:  "HW 7"
layout: post
---
\>details here<

[download](/graveyard/hw7.tar)

Header File:
{% highlight c++ %}

    #ifndef Words_H // include guard
    #define Words_H
    #include <string>
    #include <vector>

    class Words{
        using string = std::string;
        
        public:

            class iterator{

                public:
                    // iterator(std::vector<string> &w, std::vector<bool> &escW, std::string &rej, int i);
                    iterator(const Words &a, size_t i);
                    iterator(const iterator &rhs) = default; // Copy ctor
                    iterator &operator=(const iterator &rhs) = default; // Assingment Op

                    bool operator==(const iterator &rhs) const;

                    bool operator!=(const iterator &rhs) const;

                    struct Word_iter{
                        string first;
                        bool second;
                    } word_iter;
                    // Return a pointer to the num'th element,
                    // where num==0 is the first element.
                    Word_iter operator*();

                    bool get_iter(size_t n, string &s, bool &esc);
                    // Word_iter &operator[](size_t t);    // Subscript Op

                    // Pre & Post -fix
                    iterator &operator++();
                    iterator operator++(int); // Post-increment
                    iterator &operator--(); // Pre-decrement
                    iterator operator--(int);  // Post-decrement

                private:
                    std::vector<string> w_iter;
                    std::vector<bool> escW_iter;
                    string rej_iter;
                    size_t index;
                    void rejHelper(const string &s);
            };
            

            Words(string input); // Ctor
            Words() = delete; // Delete default dtor
            Words(const Words &rhs); // Copy ctor
            ~Words() = default; // Default dtor

            
            Words &operator=(const Words &rhs); // Assingment Op
            // Other public methods and getters.
            string analyze(string input);
            [[nodiscard]] size_t size() const;
            [[nodiscard]] bool empty() const;
            bool get(size_t n, string &, bool &) const;
            friend std::ostream& operator<<(std::ostream &stream, const Words &w);

            /* Postfix, Prefix, and Operator Methods/Functions */

            Words operator+(const Words &) const;
            Words &operator+=(const Words &);

            bool operator==(const Words &) const;
            bool operator!=(const Words &) const;

            explicit operator bool() const;

            Words &operator--();	// Pre-decrement
            Words operator--(int);	// Post-decrement

            struct Word{
                string first;
                bool second;
            } word;
            Word &operator[](size_t);    // Subscript Op

            iterator begin() const;
            iterator end() const;

            void reject(const string &s);

        private:
            std::vector<string> w;
            std::vector<bool> escW;
            std::string rej = "";
            /* Helper methods */
            bool isNewWord(const char &c);  // Word delimiter
            bool pushBack(string &s, bool &esc); // Word adder
    };


    #endif /* Words_H */

{% endhighlight %}

CC File:
{% highlight  c++ %}

    #include "Words.h"
    #include <iostream>
    #include <sstream>
    #include <stdexcept>
    #include <string>
    #include <vector>

    using namespace std;

    // Perform lexical analysis on the multi-line input
    // as if .analyze() were called.
    Words::Words(string input){
        analyze(input);
    }

    // Copy constructor:
    // Copy all information from another object of the same class.
    Words::Words(const Words &rhs){
        w = rhs.w;
        escW = rhs.escW;
    }

    // Assignment operator:
    // Copy all information from another object of the same class, 
    // replacing any previous information.
    Words &Words::operator=(const Words &rhs){
        w = rhs.w;
        escW = rhs.escW;
        return *this;
    }

    // Perform lexical analysis on the given multi-line input. 
    // Calling this method more than once will start from scratch, 
    // and ignore any previous input.
    string Words::analyze(string input){
        char c; bool esc = false; string s; w.clear(); escW.clear();
        
        for(size_t i = 0; i < input.length(); i++){
            c = input[i];
            if(!isNewWord(c)){
                if(c == '\\'){
                    esc = true;
                    c = input[++i];
                }
                s.push_back(c);
            }else{
                pushBack(s, esc);
                if(isNewWord(c) && !isspace(c)){
                    s.push_back(c);
                    pushBack(s, esc);
                }
            }
        }

        if(s.length() > 1){
            pushBack(s,esc);
        }
        return input;
    }

    // Puts a string and boolean into corresponding vectors and clears them
    bool Words::pushBack(string &s, bool &esc){
        if(s.length() > 0){
            w.push_back(s);
            escW.push_back(esc);
            s.clear();
            esc = false;
            return true;
        }
        return false;
    }

    // Word delimiter based on a space, or opne/close paren
    bool Words::isNewWord(const char &c){
        if(c == '(' || c == ')' || isspace(c)){return true;}
        return false;
    }

    // Return a size_t representing the numer of words detected by 
    // the lexical analysis. For example, Words(" a +=#hi\nb ").
    // size() would return a size_t with the value 3. Ignoring the 
    // result of .size() must generate a compile-time warning.
    [[nodiscard]] size_t Words::size() const{
        return w.size();
    }

    // Return true iff there are no words in this object. Ignoring the 
    // result of this method must generate a compile-time warning.
    [[nodiscard]] bool Words::empty() const{
        return w.size() == 0;
    }

    // The first argument n is an index into the words, where 0 represents 
    // the first word. If n is out of range, return false to indicate failure. 
    // Otherwise, set the string argument to the corresponding word, set the 
    // bool argument to true if that word was escaped in the input, and false if not, 
    // and return true to indicate success. By “escaped”, I mean if any character 
    // of that word was escaped by a backslash.
    bool Words::get(size_t n, string &s, bool &esc) const{
        if(n > size()){
            s.clear();
            esc = false;
            return false;
        }
        s = w[n];
        esc = escW[n];
        return true;
    }

    // ADDITION MEMBER FUNCTION:
    // Member functions automatically have the lhs (left-hand side),
    // so use *this for assingment in the coming methods as needed.
    //
    // Addition opperator combines two Word objects s.t. Words("Raining\\ cats") + Words("& dogs!")
    // Will equal Words("Raining\\ cats & dogs!") (Spacing is intentional). Maintain escaped flagging.
    Words Words::operator+(const Words &rhs) const {
        Words rtn = *this;
        return rtn += rhs;
    }

    // ADDITION ASSIGNMENT OPPERATOR:
    // Adds all words from the first object to the
    // end of the second. Words lhs("x y") += Words rhs("and z!") changes lhs to 
    // have the four words "x", "y", "and", and "z!". Maintain escaped flagging.
    Words &Words::operator+=(const Words &rhs) {
        w.insert(w.end(), rhs.w.begin(), rhs.w.end());  // w += rhs.w;
        escW.insert(escW.end(), rhs.escW.begin(), rhs.escW.end());  // escW += rhs.escW;
        return *this;
    }

    // True if both objects have the same words, ignoring escaped flags, and in the same order
    bool Words::operator==(const Words &rhs) const {
        return w==rhs.w;
    }

    // False if both objects have the same words, ignoring escaped flags, and in the same order...
    bool Words::operator!=(const Words &rhs) const {
        // Let == do the real work.
        return !(*this == rhs);
    }

    // BOOLEAN CONTEXT:
    // True if size is > 0
    Words::operator bool() const{
        return this->size() > 0;
    }

    // PRE-DECREMENT: 
    // Will make each word in the Words object shorter 
    // by one byte exactly, taking from the end of each word. Empty zero
    // length strings will be removed. Escapedness will be preserved regardless
    // of if the char removed was the escape char.
    Words &Words::operator--() { 	// Pre-decrement
        // TODO:
        vector<string> temp;
        vector<bool> escTemp;
        for(size_t t = 0; t < this->size(); t++){
            if(this->w[t].length() == 0){ continue; }
            temp.push_back(this->w[t].substr(0, this->w[t].length() - 1));
            escTemp.push_back(this->escW[t]);
        }
        this->w = temp;
        this->escW = escTemp;
        return *this;
    }

    // POST-DECREMENT:
    // Repeats Pre-decrement's work and returns the old value BY VALUE.
    Words Words::operator--(int/* Do we really want int? */) {    	// Post-decrement
        const auto save = *this;		// Save old value
        --*this;				// Invoke pre-decrement
        return save;			// Return old value
    }

    // SUBSCRIPT OP:
    // Must return a struct which stores the values returned by .get().
    // One for a string named first, another for a bool named second.
    Words::Word &Words::operator[](size_t t){
        if(t > this->size()){
            ostringstream oss;
            oss << "Index is out of bounds. Index given: " << t << " "
                << "Current size for the Words object: " << this->size() << "\n";
            string what = oss.str();
            throw out_of_range(what);
        }
        this->get(t, word.first, word.second);
        return this->word;
    }

    // Write the words in this object to the ostream, separated by commas. 
    // cout << Words("foo)") must emit exactly the five characters foo,) and nothing else.
    std::ostream& operator<<(std::ostream &stream, const Words &word){
        for(size_t i = 0; i < word.size(); i++){
            stream << word.w[i];
            if(i < word.size() - 1){stream << ",";}
        }
        return stream;
    }

    // Words::iterator::iterator(vector<string> &w, vector<bool> &escW, string &rej, int i) : 
    //     w_iter(w), escW_iter(escW), rej_iter(rej), index(i){ }
    Words::iterator::iterator(const Words &a, size_t i) : 
        w_iter(a.w), escW_iter(a.escW), rej_iter(a.rej), index(i) {
            rejHelper("+");
        }

    bool Words::iterator::operator==(const Words::iterator &rhs) const{
        return (w_iter == rhs.w_iter && escW_iter == rhs.escW_iter && rej_iter == rhs.rej_iter && index == rhs.index);
    }

    bool Words::iterator::operator!=(const Words::iterator &rhs) const{
        return !(*this == rhs);
    }

    Words::iterator::Word_iter Words::iterator::operator*() {
        this->get_iter(index, word_iter.first, word_iter.second);
        return this->word_iter;
    }

    bool Words::iterator::get_iter(size_t n, string &s, bool &esc) {
        if(n >= w_iter.size()){
            s.clear();
            esc = false;
            return false;
        }
        s = w_iter[n];
        esc = escW_iter[n];
        return true;
    }

    // Words::iterator::Word_iter &Words::iterator::operator[](size_t t) {
    //     if(t > this->w_iter.size()){
    //         ostringstream oss;
    //         oss << "Index is out of bounds. Index given: " << t << " "
    //              << "Current size for the Words object: " << this->w_iter.size() << "\n";
    //         string what = oss.str();
    //         throw out_of_range(what);
    //     }
    //     this->get_iter(t, word_iter.first, word_iter.second);
    //     return this->word_iter;
    // }

    // Pre-increment
    Words::iterator &Words::iterator::operator++(){
        this->index++;
        rejHelper("+");
        return *this;
    }

    // Post-increment
    Words::iterator Words::iterator::operator++(int){
        const auto save = *this;
        ++*this;
        return save;
    }

    // Pre-decrement
    Words::iterator &Words::iterator::operator--(){
        --this->index;
        rejHelper("-");
        return *this;
    }

    // Post-decrement
    Words::iterator Words::iterator::operator--(int){
        const auto save = *this;
        --*this;
        return save;
    }

    void Words::iterator::rejHelper(const string &s){
        if(s.find("+") != string::npos){
            while(index < w_iter.size() && w_iter[index].find_first_of(rej_iter) != string::npos){ ++this->index; }
        }
        if(s.find("-") != string::npos){
            while(index > static_cast<size_t> (0) && w_iter[index].find_first_of(rej_iter) != string::npos){ --this->index; }
        }
        
    }

    Words::iterator Words::begin() const{
        return iterator(*this, 0);
    }

    Words::iterator Words::end() const{
        return iterator(*this, size());
    }

    void Words::reject(const string &s){
        this->rej = s;
    }

{% endhighlight %}

Test Functionality File:
{% highlight  c++  %}

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

{% endhighlight %}

CMake File:
{% highlight CMake %}

    cmake_minimum_required(VERSION 3.11)
    project(hw7)
    
    # Are we in the wrong directory?
    if(CMAKE_SOURCE_DIR MATCHES "[Hh][Ww]([0-9])$")
    if(PROJECT_NAME MATCHES "[^${CMAKE_MATCH_1}]$")
        message(FATAL_ERROR "Building ${PROJECT_NAME} in ${CMAKE_SOURCE_DIR}")
    endif()
    endif()
    
    # Using -Wall is required:
    add_compile_options(-Wall)
    
    # These compile flags are highly recommended, but not required:
    add_compile_options(-Wextra -Wpedantic)
    
    # Optional super-strict mode:
    add_compile_options(-fmessage-length=80 -fno-diagnostics-show-option
        -fstack-protector-all -g -O3 -std=c++17 -Walloc-zero -Walloca
        -Wctor-dtor-privacy -Wduplicated-cond -Wduplicated-branches
        -Werror -Wextra-semi -Wfatal-errors -Winit-self -Wlogical-op
        -Wold-style-cast -Wshadow -Wunused-const-variable=1
        -Wzero-as-null-pointer-constant)
    
    # add_compile_options must be BEFORE add_executable.
    
    # Create the executable from the source file main.cc:
    add_library(${PROJECT_NAME} Words.cc)
    add_executable(test test.cc)
    target_link_libraries(test ${PROJECT_NAME})
    
    # Create a tar file every time:
    add_custom_target(${PROJECT_NAME}.tar ALL COMMAND
        tar -cf ${PROJECT_NAME}.tar *.cc *.h CMakeLists.txt)

{% endhighlight %}