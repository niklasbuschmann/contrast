---
title:  "HW 2"
layout: post
---
\>details here<

[Downlaod tar](/graveyard/cs370/Brock-Kaess-HW2.tar)

{% highlight c %}

    #include <stdio.h>
    #include <stdlib.h>
    #include <sys/types.h>
    #include <unistd.h>

    int fibBrooo(int num){
        int t1 = 0, t2 = 1, nextTerm = -1, rtn = -1;
        for (int i = 0; i < num; i++) {
            printf("%d", t1);
            if(i < num - 1){
                printf(", ");
            } else{
                rtn = t1;
            }
            nextTerm = t1 + t2;
            t1 = t2;
            t2 = nextTerm;
        }
        printf("\n");
        return rtn;
    }

    int main(int argc, char *argv[]){
        int pid = getpid();
        printf("Fibb[%d]: Number of terms in fibonacii series is %d\n", pid, atoi(argv[1]));
        printf("Fibb[%d]: The first %d numbers of the Fibonacci sequence are: \n", pid, atoi(argv[1]));
        return fibBrooo(atoi(argv[1]));
    }

{% endhighlight %}

{% highlight c %}

    #include <stdio.h>
    #include <stdlib.h>
    #include <sys/types.h>
    #include <unistd.h>

    int prime(int count){
        /* rtn is the last prime value we want to return for printing
            i is our rang of numbers from 0 to count.
            k is our number of primes found thus far.
            s is our prime checker.
        */
        int rtn = -1, i = 0, k = 0, s = 0;
        // Iterate 0-count finding count primes
        while(k < count){
            // Check for primeness
            for(s = 2; s <= i; s++){
                if(i % s == 0){
                    break;
                }
            }
            // Prime and the right number?
            if(i == s){
                printf("%d", i);
                if(k < count - 1){
                    printf(", ");
                }
                k++;
                rtn = i;
            }
            i++;
        }
        printf("\n");
        return rtn;
    }

    int main(int argc, char *argv[]){
        int pid = getpid();
        printf("Prime[%d]: The first %d prime numbers are: \n", pid, atoi(argv[1]));
        return prime(atoi(argv[1]));;
    }

{% endhighlight %}

{% highlight c %}

    #include <stdio.h>
    #include <stdlib.h>
    #include <sys/types.h>
    #include <unistd.h>
    #include <sys/wait.h>
    #include <ctype.h>

    /* Use fopen() to read the string from the file. Input numbers are [1,25]. 
    For ease of grading, your program must fork()/exec() the programs in 
    this order for each Number: Fibb-Prime-Total.
    */
    int main(int argc, char **argv){
        // STEP 1 & 2: Read char's from a file. Send each line(String) to child.
        FILE *f = fopen(argv[1], "r");
        char c[100];
        int stat, maxFibb = 0, maxPrime = 0, maxTotal = 0;
        while(fgets(c, 100, f) != NULL){
            int pid = getpid();
            int fibb = fork();

            // Fork returns zero in child process
            if(fibb == 0){
                // Enact child processes
                // STEP 3: Print out the process ID of the process it created
                // STEP 4: Exec() function loads the Fibb/Prime/Total into a new process.
                /* STEP 5: When the Fibb/Prime/Total progam is executing, it prints out its 
                process ID which should match the one returned by fork() in step 3
                */ 
                execlp("./Fibb", "Fibb", c, NULL);
            }else if(fibb == -1){
                // Fork failed; error
                fprintf(stderr, "You Died");
                return -1;
            }else{
                // Parent process; wait
                printf("Starter[%d] : Forked process with ID %d.\n", pid, fibb);
                printf("Starter[%d]: Waiting for process [%d].\n", pid, fibb);
                wait(&stat);
                int p = WEXITSTATUS(stat);
                printf("Starter: Child process %d returned %d.\n", fibb, p);
                if(p > maxFibb){
                    maxFibb = p;
                }

                int prime = fork();
                if(prime == 0){
                    execlp("./Prime", "Prime", c, NULL);
                }else if(prime == -1){
                    // Fork failed; error

                }else{
                    // Parent process; wait
                    printf("Starter[%d] : Forked process with ID %d.\n", pid, prime);
                    printf("Starter[%d]: Waiting for process [%d].\n", pid, prime);
                    wait(&stat);
                    int p = WEXITSTATUS(stat);
                    printf("Starter: Child process %d returned %d.\n", prime, p);
                    if(p > maxPrime){
                        maxPrime = p;
                    }

                    int total = fork();
                    if(total == 0){
                        execlp("./Total", "Total", c, NULL);
                    }else if(total == -1){
                        // Fork failed; error

                    }else{
                        // Parent process; wait
                        printf("Starter[%d] : Forked process with ID %d.\n", pid, total);
                        printf("Starter[%d]: Waiting for process [%d].\n", pid, total);
                        wait(&stat);
                        int p = WEXITSTATUS(stat);
                        printf("Starter: Child process %d returned %d.\n", total, p);
                        if(p > maxTotal){
                            maxTotal = p;
                        }
                        
                    }
                }
            }

            /* STEP 6: The Fibb/Prime/Total program then prints the respective 
            numbers(refer 6.d) and returns the results(refer 6.a,b,c)
            a. Fibb should return the nth fibonacii number (n being the value of string).
            b. Prime should return the nth prime number(n being the value of string).
            c. Total should return the sum of first n numbers (n being the value of string).
            d. respective numbers should be printed from the child process. 
            */
        }
        fclose(f);
        printf("fibb: %d\n", maxFibb);
        printf("Prime: %d\n", maxPrime);
        printf("total Count: %d\n", maxTotal);

        /* STEP 7: Fibb/Prime/Total program should return the result to be printed. 
        You can use the WEXITSTATUS() macro to determine the exit status code.
        STEP 8: Parent-specific processing in the Starter should ensure that 
        the Starter will wait() for each instance of the child-specific processing 
        to complete. Once all the processes are complete output the result as 
        mentioned in 6.a,b,c to the terminal.
        */

        printf("\n");
        return 0;
    }

{% endhighlight %}

{% highlight c %}

    #include <stdio.h>
    #include <stdlib.h>
    #include <sys/types.h>
    #include <unistd.h>

    int sum(int num){
        for(int i = num - 1; i > 0; i--){
            num += i;
        }
        return num;
    }

    int main(int argc, char *argv[]){
        int pid = getpid(), rtn = sum(atoi(argv[1]));
        printf("Total[%d] : Sum = %d\n", pid, rtn);
        return rtn;
    }

{% endhighlight %}

{% highlight Makefile %}

    CC = gcc
    OUT_EXE = Starter
    OUT_1 = Total
    OUT_2 = Prime
    OUT_3 = Fibb
    FILES = Starter.c
    FILES1 = Total.c
    FILES2 = Prime.c
    FILES3 = Fibb.c
    PKG = README.txt
    TAR_NAME = Brock-Kaess-HW2.tar

    build:
        $(CC) -g -Wall -o $(OUT_EXE) $(FILES)
        $(CC) -g -Wall -o $(OUT_1) $(FILES1)
        $(CC) -g -Wall -o $(OUT_2) $(FILES2)
        $(CC) -g -Wall -o $(OUT_3) $(FILES3)
    package:
        tar cvzf $(TAR_NAME) $(FILES) $(FILES1) $(FILES2) $(FILES3) $(PKG) Makefile
    clean:
        rm -f $(OUT_EXE) $(OUT_1) $(OUT_2) $(OUT_3)

{% endhighlight %}

{% highlight txt %}

    README
    ======
    This is a simple practical which in itself contains another practical! Files in the tar include:
    -Starter.c 
    -Fibb.c 
    -Prime.c 
    -Total.c 
    -Makefile
    -HW2README.txt (this file)
    -hard work and tears with a bit of love

    QUESTIONS
    =========

    1. How many of the least significant bits of the status does WEXITSTATUS return?
        8.
    2. Which header file has to be included to use the WEXITSTATUS?
        #include <sys/wait.h>
    3. What is the return value for the fork() in a child process?
        0
    4. Give a reason for the fork() to fail?
        Lack of memory it can use.
    5. In the program written by you, are we doing a sequential processing or a concurrent processing 
        with respect to the child processes? Sequential processing is when only one of the child
        processes is running at one time, and concurrent processing is when more than one child
        process can be running at the same time.
            I'm ding sequential processing.
    6. Do you Observe any anomalies in the output from child process and the output from parent
        process. Provide a reason for that observation.
            I don't see any anomalies.

{% endhighlight %}