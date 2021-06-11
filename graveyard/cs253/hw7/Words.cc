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

