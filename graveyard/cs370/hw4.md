---
title:  "HW 4"
layout: post
---
\>details here<

[Downlaod tar](/graveyard/cs370/Brock-Kaess-HW4.tar)

{% highlight py %}

    # Run with python3 scheduler.py processes.csv 4 for testing
    import sys
    import csv
    import copy


    # Save filename and open for reading
    filename = sys.argv[1]
    csv = open(filename, 'r')
    # Make the array for storing filename's data and it's header if it contains a string
    # Data[i][3-4] are Waiting and Turnaround Time respectively
    header = []
    data = []
    # Put each line into the array
    for i in csv:
        i = i.strip()
        i += ",0,0"
        data.append(i.split(','))
    # Toss out the col headers if they are names matching header 1-3
    header1 = 'processid'
    header2 = 'arrival time'
    header3 = 'burst time'
    if data[0][0].lower() == header1 or data[0][0].lower() == header2 or data[0][0].lower() == header3:
        header = data.pop(0)
        header.pop()
        header.pop()
    # Keep track of rows for future reference
    count = len(data)
    # Cast each element from String to int
    for i in range(count):
        for j in range(5):
            data[i][j] = int(data[i][j])
    # Sort the data by PID
    data.sort()


    def waitChart(copy, name):
        s = "{:{}^45}\n".format(name, '-')
        # s += "Process ID | Waiting Time | Turnaround Time\n"
        s += "{:<11}|".format("Process ID")
        s += "".ljust(1)
        s += "{:^13}|".format("Waiting Time")
        s += "".ljust(1)
        s += "{:>}\n".format("Turnaround Time")
        for i in range(len(copy)):
            s += "{:^11}|".format(copy[i][0])
            s += "{:^14}|".format(copy[i][3])
            s += "{:^12}\n".format(copy[i][4])
        return s


    def gantt(pid, finish, time):
        s = "[".ljust(4)
        s += "{:<4}".format(time)
        s += "]--".ljust(4)
        s += "{:^5}--".format(pid)
        s += "[".ljust(4)
        s += "{:<4}]\n".format(finish)
        return s


    # Update wait and turnaround time
    def waitNturn(copy, burst, time):
        # Update the first elements turnaround time
        copy[0][4] += burst + copy[0][3]
        # Update the rest of the list
        for i in range(1, len(copy)):
            # Special case for first element
            if copy[i][1] <= time:
                # Our burst time is greater than actual wait time
                if copy[i][1] > copy[0][1] and copy[i][3] == 0:
                    copy[i][3] += burst - (copy[i][1] - copy[0][1])
                # Burst time is our wait time
                else:
                    copy[i][3] += burst


    def getWait(copy):
        rtn = 0
        for i in range(len(copy)):
            rtn += copy[i][3]
        return rtn / len(copy)


    def getTurn(copy):
        rtn = 0
        for i in range(len(copy)):
            rtn += copy[i][4]
        return rtn / len(copy)


    def fcfs(data, count):
        # Create deep copy of data[] sorted by arrival time
        que = copy.deepcopy(data)
        que.sort(key=lambda x:x[1])
        # Initialize Gantt Chart string
        s = "Gantt Chart is:\n"
        # Keep track of arrive, burst, and running time, and PID
        arrive = burst = time = pid =  0
        # Loop through data for gantt chart
        for i in range(count):
            # Update pid, arrive, and burst
            pid = que[i][0]; arrive = que[i][1]; burst = que[i][2]
            # IDLE
            if(time < arrive):
                s += gantt("IDLE", arrive, time)
                time = arrive
            # Process here and  waiting
            if(time > arrive):
                # Get total wait time(no preemption)
                que[i][3] = time - arrive
                # Get turnaround time
                que[i][4] = que[i][3] + burst
                # Execute process
                s += gantt(pid, time + burst, time)
                # Advance to end of burst
                time += burst
            # Process here and !waiting
            else:
                # Update turnaround time and execute
                que[i][4] = burst
                s += gantt(pid, arrive + burst, arrive)
                # Advance to end of burst, update turnaround time
                time += burst
        # Sort array
        que.sort(key=lambda x:x[0])
        s0 = waitChart(que, "FCFS")
        print(s0)
        print(s)
        print("Average Waiting Time:", getWait(que))
        print("Average Turnaround Time:", getTurn(que))
        print("Throughput:{:.12f}".format(que[len(que) - 1][0]/time))


    def sjfp(data, count):
        # Create deep copy of data[] sorted by burst time
        quePop = copy.deepcopy(data)
        quePop.sort(key=lambda x: (x[1], x[2]))
        rtn = []
        # Initialize Gantt Chart string
        s = "Gantt Chart is:\n"
        # Keep track of arrive, nextArrive, burst, nextBurst, and running time, and PID, and i 
        arrive = nextArrive = burst = nextBurst = time = pid = i =  0
        # Loop through data for gantt chart
        while i < count:
            # Update pid, arrive, and burst
            pid = quePop[0][0]; arrive = quePop[0][1]; burst = quePop[0][2]
            # If there is another process, store it's arrival and burst
            nextArrive = quePop[1][1] if i < count - 1 else burst
            nextBurst = quePop[1][2] if i < count - 1 else burst
            # Check if we will be preempted
            preempt = nextArrive - arrive if burst + time > nextArrive and burst > nextBurst else 0
            # IDLE
            if arrive > time:
                # Send burst to gantt and update time
                s += gantt("IDLE", arrive, time)
                time = arrive
            # Current process will be preempted
            if preempt:
                # Update burst
                quePop[0][2] = burst - preempt
                # Send burst to gantt chart, update time, wait, and turnaround
                waitNturn(quePop, preempt, time)
                quePop[0][4] -= quePop[0][3]
                s += gantt(pid, time + preempt, time)
                time += preempt
                quePop.sort(key = lambda i:i[2])
            # Current process won't be preempted
            else:
                # Send burst to gantt chart, remove completed process, 
                # and update time, wait, and turnaround
                # Update burst
                quePop[0][2] -= burst
                waitNturn(quePop, burst, time)
                s += gantt(pid, burst + time, time)
                rtn.append(quePop.pop(0))
                time += burst
                i += 1
        # Sort array
        rtn.sort(key=lambda x:x[0])
        s0 = waitChart(rtn, "SJFP")
        print(s0)
        print(s)
        print("Average Waiting Time:", getWait(rtn))
        print("Average Turnaround Time:", getTurn(rtn))
        print("Throughput:{:.12f}".format(rtn[len(rtn) - 1][0]/time))        

    def rr(data, count, quantum):
        # Create deep copy of data[] sorted by arrival time
        quePop = copy.deepcopy(data)
        quePop.sort(key=lambda x:x[1])
        que = []
        rtn = []
        # Initialize Gantt Chart string
        s = "Gantt Chart is:\n"
        que.append(quePop.pop(0))
        # Keep track of arrive, burst, and running time, and PID, i, and insert
        arrive = burst = time = pid = i = insert = 0
        while i < count:
            # Update insert
            insert = quePop[0][1] if len(quePop) > 0 else 0
            # We have a new process arrive, put it at end of que
            if insert >= time or len(que) == 0:
                que.append(quePop.pop(0))
            # Update pid, arrive, and burst
            pid = que[0][0]; arrive = que[0][1]; burst = que[0][2]
            # Check if burst is less then our preempt/time quantum
            burst = burst if burst < quantum else quantum
            # IDLE
            if arrive > time:
                s += gantt("IDLE", arrive, time)
                time = arrive
            # Execute next process and update time
            # Adjust waiting and turnaround time
            waitNturn(que, burst, time + burst)
            s += gantt(pid, burst + time, time)
            que[0][4] -= que[0][3]
            time += burst
            # Pop process and increase i or update process burst and RR the que
            if burst == que[0][2]:
                que[0][2] -= burst
                que[0][4] += que[0][3]
                rtn.append(que.pop(0))
                i += 1
            else:
                que[0][2] -= burst
                que.append(que.pop(0))
        # Sort array
        rtn.sort(key=lambda x:x[0])
        s0 = waitChart(rtn, "Round Robin")
        print(s0)
        print(s)
        print("Average Waiting Time:", getWait(rtn))
        print("Average Turnaround Time:", getTurn(rtn))
        print("Throughput:{:.12f}".format(rtn[len(rtn) - 1][0]/time)) 


    # int main:
    # Call each function accordingly
    # print(header, "\n", data, "\n\n", sep = "")

    fcfs(data,count)
    print()
    sjfp(data,count)
    print()
    rr(data,count, 4)

{% endhighlight %}

{% highlight Makefile %}

    FILE = scheduler.py
    PKG = README.txt
    TAR_NAME = Brock-Kaess-HW4.tar

    build:
        python3 scheduler.py processes.csv 4
    package:
        tar cvzf $(TAR_NAME) $(FILE) $(PKG) Makefile

{% endhighlight %}

{% highlight txt %}

    README
    ======
    This is a simple practical which in itself contains another practical! Files in the tar include:
    -scheduler.py
    -Makefile
    -README.txt (this file)
    -hard work and tears with a bit of love

    QUESTIONS
    =========

    1. What is the other name for Shortest Job First Preemptive Algorithm?
        Priority Scheduling

    2. What are the 5 different states a process can be in scheduling 
    (Look into process state diagram)?
        New, Ready, Running, Waiting, End

    3. Shortest Job First is like Priority Scheduling with the priority 
    based on ______ of the process?
        Burst length

    4. ________ effect is the primary disadvantage of First Come First 
    Serve Scheduling algorithm.
        Convoy

    5. How does Multi Level Feedback queue prevent starvation of processes 
    that waits too long in lower priority queue?
        It has age priority as a factor

{% endhighlight %}