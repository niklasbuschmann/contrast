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