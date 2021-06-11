---
title:  "HW 3"
layout: post
---
\>details here<

[Downlaod tar](/graveyard/cs370/Brock-Kaess-HW3.tar)

{% highlight c %}

    #include <stdio.h>
    #include <sys/wait.h>
    #include <unistd.h>
    #include <string.h>
    #include <sys/ipc.h>
    #include <sys/shm.h>
    #include <sys/types.h>
    #include <sys/stat.h>
    #include <fcntl.h>
    #include <sys/mman.h>
    #include <ctype.h>
    #include <stdlib.h>

    /*
        This executable reads a line at a time and keeps a
        running total of the numbers from each line to return.op0
    */
    int main(int argc, char *argv[]){
        // Check we have enough args
        if(argc < 2){
            fprintf(stderr, " -> ERROR: I need more arguments\n");
            exit(1);
        }
    
        int fd = atoi(argv[2]);
        char msg[32];
        int counter = 0;
        // Parse each line's numbers and keep a running total of them.
        // Read char's from the file
        FILE *f = fopen(argv[1], "r");
        if(f == NULL){
            fprintf(stderr, " -> ERROR: empty file");
            exit(2);
        }
        char c[32];
        while(fgets(c, sizeof(c), f) != NULL){
            counter += atoi(c);
        }

        sprintf(msg, "%d", counter);
        write(fd, msg, strlen(msg) + 1);
        close(fd); // Close child write
        fclose(f);

        return 0;
    }

{% endhighlight %}

{% highlight c %}

    #include <stdio.h>
    #include <sys/wait.h>
    #include <unistd.h>
    #include <string.h>
    #include <sys/ipc.h>
    #include <sys/shm.h>
    #include <sys/types.h>
    #include <sys/stat.h>
    #include <fcntl.h>
    #include <sys/mman.h>
    #include <ctype.h>
    #include <stdlib.h>

    /*
        Takes an int and returns the fibbonacci sequence for it
    */
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
        if(argc < 2){
            fprintf(stderr, "%s -> ERROR: I need more arguments\n", argv[0]);
            exit(1);
        }
        char shm_Fibb[] = "Shared_Mem_Fib";  // Name of shared mem seg
        int shm_fd_Fibb = shm_open(shm_Fibb, O_CREAT | O_RDWR, 0666); // Make/open mem seg
        int SIZE = 32;  // Byte size
        void *shmPtrFibb = mmap(0, SIZE, PROT_READ, MAP_SHARED, shm_fd_Fibb, 0); // Mapping the new mem seg
        

        int pid = getpid();
        printf("Fibb[%d]: Number of terms in fibonacii series is %d\n", pid, atoi(shmPtrFibb));
        printf("Fibb[%d]: The first %d numbers of the Fibonacci sequence are: \n", pid, atoi(shmPtrFibb));
        int rtn = fibBrooo(atoi(shmPtrFibb));
        shm_unlink(shm_Fibb);
        return rtn;
    }

{% endhighlight %}

{% highlight c %}

    #include <stdio.h>
    #include <sys/wait.h>
    #include <unistd.h>
    #include <string.h>
    #include <sys/ipc.h>
    #include <sys/shm.h>
    #include <sys/types.h>
    #include <sys/stat.h>
    #include <fcntl.h>
    #include <sys/mman.h>
    #include <ctype.h>
    #include <stdlib.h>

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
                printf("%d, ", i);
                k++;
                rtn = i;
            }
            i++;
        }
        printf("\n");
        return rtn;
    }

    int main(int argc, char *argv[]){
        if(argc < 2){
            fprintf(stderr, "%s -> ERROR: I need more arguments\n", argv[0]);
            exit(1);
        }
        char shm_Prime[] = "Shared_Mem_Prime";  // Name of shared mem seg
        int shm_fd_Prime = shm_open(shm_Prime, O_CREAT | O_RDWR, 0666); // Make/open mem seg
        int SIZE = 32;  // Byte size
        void *shmPtrPrime = mmap(0, SIZE, PROT_WRITE, MAP_SHARED, shm_fd_Prime, 0); // Mapping the new mem seg


        int pid = getpid();
        printf("Prime[%d]: The first %d prime numbers are: \n", pid, atoi(shmPtrPrime));
        int rtn = prime(atoi(shmPtrPrime));
        shm_unlink(shm_Prime);
        return rtn;
    }

{% endhighlight %}

{% highlight c %}

    #include <stdio.h>
    #include <ctype.h>
    #include <fcntl.h>
    #include <stdlib.h>
    #include <unistd.h>
    #include <string.h>
    #include <sys/shm.h>
    #include <sys/ipc.h>
    #include <sys/wait.h>
    #include <sys/stat.h>
    #include <sys/mman.h>
    #include <sys/types.h>

    /* Use fopen() to read the string from the file. Input numbers are [1,25]. 
    For ease of grading, your program must fork()/exec() the programs in 
    this order for each Number: Fibb-Prime-Total.
    */
    int main(int argc, char *argv[]){
        // Check we have enough args
        if(argc < 2){
            fprintf(stderr, "I need more arguments\n");
            exit(1);
        }
        // Create a pipe and fork a child process to execute CharacterReader, giving
        // it the .txt file as an argument. Wait for a return and read from the pipe.

        char charReadVals[16]; // C style string for CharacterReader return vals
        
        int fd[2];
        if(pipe(fd) == -1){ // Check pipe failure
            fprintf(stderr, "%s -> ERROR: Pipe failed.\n", argv[0]);
            exit(2);
        }
        int status;
        pid_t pid = getpid();
        pid_t cpid = fork();

        if(cpid < 0){ // ERROR
            fprintf(stderr, " -> ERROR: Fork failed.\n");
            exit(3);
        }else if(cpid == 0){ // Child process
            close(fd[0]);
            char msg[16];
            sprintf(msg, "%d", fd[1]);
            execlp("./CharacterReader", "CharacterReader", argv[1], msg, NULL);
            close(fd[1]);
        }else { // Parent process
            close(fd[1]); // close parent write end
            wait(&status);
        
            int count = read(fd[0], charReadVals, sizeof(charReadVals));
            charReadVals[count] = '\0';
            close(fd[0]);
            printf("Starter[%d]: contents read from the read end pipe: %s.\n", pid, charReadVals);
        }



        // Fibb shared mem
        char shm_Fibb[] = "Shared_Mem_Fib";  // Name of shared mem seg
        int shm_fd_Fibb = shm_open(shm_Fibb, O_CREAT | O_RDWR, 0666); // Make/open mem seg
        int SIZE = 32;  // Byte size
        ftruncate(shm_fd_Fibb, SIZE); // Set byte ammount
        void *shmPtrFibb = mmap(0, SIZE, PROT_WRITE, MAP_SHARED, shm_fd_Fibb, 0); // Mapping the new mem seg
        sprintf(shmPtrFibb, "%s", charReadVals);
        // Prime shared mem
        char shm_Prime[] = "Shared_Mem_Prime";  // Name of shared mem seg
        int shm_fd_Prime = shm_open(shm_Prime, O_CREAT | O_RDWR, 0666); // Make/open mem seg
        ftruncate(shm_fd_Prime, SIZE); // Set byte ammount
        void *shmPtrPrime = mmap(0, SIZE, PROT_WRITE, MAP_SHARED, shm_fd_Prime, 0); // Mapping the new mem seg
        sprintf(shmPtrPrime, "%s", charReadVals);
        // Total shared mem
        char shm_Total[] = "Shared_Mem_Total";  // Name of shared mem seg
        int shm_fd_Total = shm_open(shm_Total, O_CREAT | O_RDWR, 0666); // Make/open mem seg
        ftruncate(shm_fd_Total, SIZE); // Set byte ammount
        void *shmPtrTotal = mmap(0, SIZE, PROT_WRITE, MAP_SHARED, shm_fd_Total, 0); // Mapping the new mem seg
        sprintf(shmPtrTotal, "%s", charReadVals);

        // Print our work
        printf("Starter[%d]: Created shared memory \"%s\" with FD: %d\n", pid, shm_Fibb, shm_fd_Fibb);
        printf("Starter[%d]: Created shared memory \"%s\" with FD: %d\n", pid, shm_Prime, shm_fd_Prime);
        printf("Starter[%d]: Created shared memory \"%s\" with FD: %d\n", pid, shm_Total, shm_fd_Total);
        
        // Make 2d array to store the shared mem name where
        // the the first column contains the file location 
        // and the second column contains the shared mem
        char *execLoop[3][2] = {
            {"./Fibb",shmPtrFibb}, 
            {"./Prime",shmPtrPrime}, 
            {"./Total",shmPtrTotal}
        };

        for(int i = 0; i < 3; i++){
            int cpid0 = fork();
            if(cpid0 < 0){
                fprintf(stderr, " -> ERROR: Fork failed.\n");
                exit(7);
            }else if(cpid0 == 0){
                execlp(execLoop[i][0], execLoop[i][0], execLoop[i][1], charReadVals, NULL);
            }else{
                wait(&status);
            }
        }

        // char *rtnF[10];
        // sprintf(*rtnF, "%p", shmPtrFibb);
        printf("Starter[%d]: Fibb last number: %d\n", pid, 5);
        printf("Starter[%d]: Prime last number: %d\n", pid, 5);
        printf("Starter[%d]: Total last number: %d\n", pid, 5);
        return 0;
    }

{% endhighlight %}

{% highlight c %}

    #include <stdio.h>
    #include <sys/wait.h>
    #include <unistd.h>
    #include <string.h>
    #include <sys/ipc.h>
    #include <sys/shm.h>
    #include <sys/types.h>
    #include <sys/stat.h>
    #include <fcntl.h>
    #include <sys/mman.h>
    #include <ctype.h>
    #include <stdlib.h>

    /*
        Takes an int and returns a facotrial of sums for it
    */
    int sum(int num){
        for(int i = num - 1; i > 0; i--){
            num += i;
        }
        return num;
    }

    int main(int argc, char *argv[]){
        if(argc < 2){
            fprintf(stderr, "%s -> ERROR: I need more arguments\n", argv[0]);
            exit(1);
        }
        char shm_Total[] = "Shared_Mem_Total";  // Name of shared mem seg
        int shm_fd_Total = shm_open(shm_Total, O_CREAT | O_RDWR, 0666); // Make/open mem seg
        int SIZE = 32; // Byte size
        void *shmPtrTotal = mmap(0, SIZE, PROT_WRITE, MAP_SHARED, shm_fd_Total, 0); // Mapping the new mem seg


        int pid = getpid(), rtn = sum(atoi(shmPtrTotal));
        printf("Total[%d] : Sum = %d\n", pid, rtn);
        shm_unlink(shm_Total);
        return rtn;
    }

{% endhighlight %}

{% highlight Makefile %}

    CC = gcc
    OUT_EXE = Starter
    OUT_1 = Total
    OUT_2 = Prime
    OUT_3 = Fibb
    OUT_4 = CharacterReader
    FILES = Starter.c
    FILES1 = Total.c
    FILES2 = Prime.c
    FILES3 = Fibb.c
    FILES4 = CharacterReader.c
    PKG = README.txt
    TAR_NAME = Brock-Kaess-HW3.tar
    CXXFLAGS= -Wall -Wextra -Wpedantic -Werror -Wfatal-errors -Winit-self -Wshadow -Wlogical-op -Wcomment -D_GLIBCXX_DEBUG -fno-diagnostics-show-option

    build:
        $(CC) -lrt -g $(CXXFLAGS) -o $(OUT_EXE) $(FILES)
        $(CC) -lrt -g $(CXXFLAGS) -o $(OUT_1) $(FILES1)
        $(CC) -lrt -g $(CXXFLAGS) -o $(OUT_2) $(FILES2)
        $(CC) -lrt -g $(CXXFLAGS) -o $(OUT_3) $(FILES3)
        $(CC) -lrt -g $(CXXFLAGS) -o $(OUT_4) $(FILES4)
    package:
        tar cvzf $(TAR_NAME) $(FILES) $(FILES1) $(FILES2) $(FILES3) $(FILES4) $(PKG) Makefile
    clean:
        rm -f $(OUT_EXE) $(OUT_1) $(OUT_2) $(OUT_3) $(OUT_4)

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