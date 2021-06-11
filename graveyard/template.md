---
title:  "Template"
layout: post
---
\>details here<

{% highlight c %}

    #include <iomanip>	// for right, setw
    #include <iostream>
    #include <map>
    #include <string>

    using namespace std;

    template <typename T>
    class BarGraph {
    public:
        void operator+=(const T &datum) {
            data[datum]++;
        }
        friend ostream &operator<<(ostream &stream, const BarGraph<T> &datum){
            for (const auto &val : datum.data){
                stream << right << setw(10) << val.first << ' '
                << string(val.second, '*') << '\n';
            }
            stream << '\n';
            return stream;
        }
    private:
        map<T, unsigned> data;
    };

    template <>
    class BarGraph<bool> {
        unsigned false_count = 0, true_count = 0;
    public:
        void operator+=(const bool datum) {
        datum ? true_count++ : false_count++;
        }
        friend ostream &operator<<(ostream &stream, const BarGraph<bool> &datum){
            stream << "     false " << string(datum.false_count, '*') << "\n"
                    "      true " << string(datum.true_count,  '*') << "\n\n";
            return stream;
        }
    };

    template <>
    class BarGraph<char> {
    public:
        void operator+=(const char &datum) {
            c[int(datum)]++;
        }
        void operator+=(const string &datum) {
            for(size_t t = 0; t < datum.length(); t++){
                operator+=(datum[t]);
            }
        }
        friend ostream &operator<<(ostream &stream, const BarGraph<char> &datum){
            for(size_t i = 0; i < 128; i++){
                if(datum.c[i] > 0){
                    stream << right << setw(10) << char(i) << " " << string(datum.c[i], '*') << '\n';
                }
            }
            stream << '\n';
            return stream;
        }
    private:
        int c[128] = {0};
    };


    int main() {
        BarGraph<int> alpha;
        alpha += 12;
        alpha += 6;
        alpha += 4;
        alpha += 6;
        cout << alpha;

        BarGraph<double> beta;
        beta += 3.14;
        beta += 2.71828;
        beta += 6.023e23;
        beta += 2.71828;
        cout << beta << "\n";

        BarGraph<bool> gamma;
        gamma += false;
        gamma += true;
        gamma += false;
        gamma += true;
        gamma += true;
        cout << gamma << "\n";

        BarGraph<char> delta;
        delta += 'G';
        delta += 'e';
        delta += 'o';
        delta += 'f';
        delta += 'f';
        cout << delta << "\n";

        BarGraph<char> foo;
        foo += "Colorado";
        cout << foo << "\n";
        
        return 0;
    }

{% endhighlight %}