---
title:  "HW 1"
layout: post
---
\>details here<
Before I say anything, I just wanna say, this was my first header I made for a c file from scratch, at least that I could remember. So it's not even close to acceptable by my standards. But this is what I have and what I turned in.

[PDF INSTRUCTIONS](/graveyard/cs370/HW1.pdf)
[Downlaod tar](/graveyard/cs370/Brock-Kaess-HW1.tar)

Executor Header:
{% highlight c %}

    //This is the Header file for the c file Executor
    //Created by Brock Kaess

    int get_iteration_no(int rand);

    int get_arr_size(int rand);

    char get_arr_val(int rand);

    float ratio(char *arr, int size, int *maxCountPointer);

    double get_running_ratio();

{% endhighlight %}

Executor C:
{% highlight c %}

    #include <stdio.h>
    #include <stdlib.h>

    int maxCount, maxIteration;

    int get_iteration_no(int rand){
    return ((rand % (100 - 50) + 50));
    }

    int get_arr_size(int rand){
    return ((rand % (150 - 100) + 100));
    }

    char get_arr_val(int rand){
    return (char)((rand % (91 - 65) + 65));
    }

    /* TODO: In this auxiliary function the number of vowels 
    and consonants in the array is found, and so is the 
    ratio vowels/consonants. It also compares the maximum 
    number of vowels in all the iterations so far, which is
    the value stored in the address pointed by maxCountPointer. 
    If the maximum number of vowels found so far is less than the 
    count of the vowels in the current iteration, the value at 
    the address pointed by maxCountPointer is changed to count.
    */
    float ratio(char *a, int size, int *maxCountPointer){
        float vowels = 0, cons = 0;

        for (int i = 0; i < size; i++){
            //Check for vowel/cons counter
            if(a[i] == 'A' || a[i] == 'E' || 
                a[i] == 'I' || a[i] == 'O' || a[i] == 'U'){
                vowels++;
            } else{
                cons++;
            }

        }
        //Update maxCountPointer if new max
        if(*maxCountPointer < vowels){
            *maxCountPointer = vowels;
        }

        return vowels/cons;
    }

    double get_running_ratio(){
        //Step 2
        int maxCount = 0, maxIteration = 0, 
        iterationNo = get_iteration_no(rand());
        double currentRat = 0, avg;
        printf("[Executor]: Number of iterations is %d\n", iterationNo);
        //Steps 3-8
        for (int i = 0; i < iterationNo; i++){
            //Step 3
            int aSize = get_arr_size(rand());
            char *a = (char*)malloc(aSize * sizeof(char));
            // Step 4
            for (int j = 0; j < aSize; j++){
                a[j] = get_arr_val(rand());
            }
            //Step 5
            int tempMaxCount = maxCount;
            currentRat += ratio(a,aSize,&maxCount);
            //Step 6
            if(tempMaxCount != maxCount){
                maxIteration = i;
            }

            free(a);
        }
        //Step 7
        avg = (double) currentRat/iterationNo;
        printf("[Executor]: Iteration with maximum vowel count is %d\n", maxIteration + 1);

    return (double) avg;
    }

{% endhighlight %}

Starter C:
{% highlight c %}

#include <stdio.h>
#include <stdlib.h>
#include "Executor.h"

    int main(int argc, char** argv){
        int seed = atoi(argv[1]);
        srand(seed);
        printf("[Starter]: With seed: %d\n", seed);
        double running_ratio = get_running_ratio();
        printf("[Starter]: Running ratio: %f\n", running_ratio);
        return 0;
    }

{% endhighlight %}

Makefile:
{% highlight Makefile %}

    CC = gcc
    OUT_EXE = Starter
    FILES = Starter.c Executor.c
    PKG = Executor.h README.txt
    TAR_NAME = Brock-Kaess-HW1.tar

    build:
        $(CC) -g -Wall -o $(OUT_EXE) $(FILES)
    package:
        tar cvzf $(TAR_NAME) $(FILES) $(PKG) Makefile
    clean:
        rm -f $(OUT_EXE)

    #third: second
    #    @echo "Third"
    #second: first
    #    @echo "Second"
    #first: 
    #    @echo "First"

    #target: [optional dependecies]
    #    cmd

{% endhighlight %}

README:
{% highlight txt %}

    README
    ======

    A. This package includes the following files. In your own readme file, modify the information as needed.

    |-- Description PDF of the assignment
    |-- README.txt [This file]


    B. Use your designed makefile 
    To compile the code and build the executable using the command 

    systemprompt>  make

    To remove the  executable files use

    systemprompt>  make clean

    To run the program use (assuming seed is 3) 

    systemprompt> ./Starter 3

    which will run the program and generate the outputs.


    C. Answer the following questions (1 point each, select/type the right answer).

        1. Malloc allocates memory dynamically on heap? – True
        2. When dynamically allocating an integer array, Malloc takes the number of elements as the input? – True
        3. free() is defined inside which header file? – stdlib.h
        4. How many executable(s) are required to be generated by the Makefile for this assignment? – One
        5. What command is used to call the default target in Makefile? – make

{% endhighlight %}