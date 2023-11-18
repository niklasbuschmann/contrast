---
title:  "Asynchronous Programming and the Actor Model in Golang"
mathjax: true
layout: post
categories: media
---

This blog post provides insights into Golang's concurrent programming features. It delves into the implementation of actors, independent entities communicating through messages. We do a walthorugh over a simple actor system implementation in go, which  showcases actor creation, message sending, and concurrent message processing, highlighting the principles of the actor model.

---


# Asynchronous Programming and the Actor Model in Golang

In the world of concurrent and parallel programming, asynchronous programming and the actor model stand out as powerful paradigms. Golang, with its built-in support for concurrency through `goroutines` and channels, provides an excellent and intuitive environment for implementing these concepts. In this blog post, we'll explore asynchronous programming and the actor model in Golang using a sample program.

## Understanding the Actor Model

The actor model is a computer science and mathematical model for concurrent computation. It defines a set of rules for actors, which are independent entities that communicate by sending messages to each other. Each actor has its own state, and the only way to interact with an actor is by sending it a message. Actors operate independently and can create new actors or decide how to handle incoming messages.

In this post's sample program, actors share a global state and process only one type of message, for sake of simplicity.

Let's dive into the provided Golang program to understand how actors are implemented:

### The Program
**Sharing Data**

Lets first demontrate a `struct` to share data across actors:

```go
type ShareState struct {
    mutex          sync.Mutex
    nActors        int
    nMsgsProcessed int
    nMsgsSent      int
}
```

Here, `ShareState` is a shared data structure containing mutex-protected counters for the number of actors, messages processed, and messages sent. This ensures safe concurrent access to these variables.

*`ShareState` methods*

These methods use mutexes to protect shared state variables (`nMsgsSent` and `nMsgsProcessed`) from concurrent access. By locking and unlocking the mutex during the critical sections of code where these variables are modified, the methods ensure that only one goroutine can modify the shared state at a time. This helps prevent data races and ensures the integrity of the shared state in a concurrent environment.

```go
func (s *ShareState) incrementMsgsSent() {
	s.mutex.Lock()
	s.nMsgsSent += 1
	s.mutex.Unlock()
}

func (s *ShareState) incrementMsgsProcessed() {
	s.mutex.Lock()
	s.nMsgsProcessed += 1
	s.mutex.Unlock()
}
```

*Breaking down the method' code:*

1. `s.mutex.Lock()`: Acquires a lock on the mutex associated with the ShareState instance (s). This ensures exclusive access to shared data when incrementing the nMsgsProcessed counter.
2. `s.nMsgsSent += 1` and `s.nMsgsProcessed += 1`: Increment the `nMsgsSent` and `nMsgsProcessed` counter by 1. This counter represents the total number of messages sent and processed by actors respectively.
3. `s.mutex.Unlock()`: Releases the lock on the mutex, allowing other `goroutines` to access the shared data.

**The `Actor` struct**

```go
type Actor struct {
    id        string
    channels  *map[string]chan Message
    shareData *ShareState
}
```

The `Actor` struct represents an actor, holding its unique ID, a pointer to map of communication channels - this allows different actors to reference to the same object, the map is indexed by actor name, and each actor has its own channel -, and a reference to the shared state.

**Creating actors**

We now create a mechanism to create new actors:
```go
func new(id string, channels *map[string]chan Message, channelCap int, sharedData *ShareState) (*Actor, error) {
	if id == "all" {
		return nil, errors.New("Actor id 'all' is reserved")
	}
	if _, ok := (*channels)[id]; ok {
		return nil, errors.New("Actor id already exists")
	}
	channelsDeref := *channels
	channelsDeref[id] = make(chan Message, channelCap)
	fmt.Printf("Actor %s - Created\n", id)
	sharedData.mutex.Lock()
	sharedData.nActors += 1
	sharedData.mutex.Unlock()
	new_actor := Actor{id, channels, sharedData}

	return &new_actor, nil
}
```

The `new` function creates a new actor with a specified ID, communication channels, and shared data. Actors are added to the channel map, and the shared state is updated accordingly.

**Sending messages**

The `send` method allows an actor to send a message to another actor or all actors. The messages are sent through channels, and the shared state is updated.

```go
func (a *Actor) send(m string, to string) error {
	channels := *a.channels
	if len(channels) <= 1 {
		return errors.New("No other actors to send message to")
	}

	if to == "all" {
		for k, _ := range channels {
			if k != a.id {
				select {
				case channels[k] <- Message{m, a.id}:
					fmt.Printf("Actor %s - Sending message '%s' to 'all' - %s\n", a.id, m, k)
					a.shareData.incrementMsgsSent()
				default:
					fmt.Printf("Actor %s - Channel is full\n", a.id)
					return errors.New("Channel is full")
				}
			}
		}
	} else {
		if _, ok := channels[to]; !ok {
			errors.New("Channel not found!")
		}
		// prevents blocking the sender
		select {
		case channels[to] <- Message{m, a.id}:
			fmt.Printf("Actor %s - Sending message '%s' to %s\n", a.id, m, to)
			a.shareData.incrementMsgsSent()
		default:
			fmt.Printf("Actor %s - Channel is full\n", a.id)
			return errors.New("Channel is full")
		}
	}
	return nil
}
```

The `send` method enables an actor to send messages to specific actors or all actors in a concurrent and non-blocking manner, using Golang's `select` statement for channel communication. It also includes error handling to account for situations like sending a message to a non-existing channel or a full channel.
Let's break down how it works:
1. `channels := *a.channels`: Retrieves the map of communication channels associated with the actor.
2. `if len(channels) <= 1`: Checks if there is only one actor, meaning there's no one else to send messages to. If true, it returns an error.
3. `if to == "all"`: Handles the case where the message needs to be sent to all other actors.
    1. Iterates through each actor in the channel map using for `k, _ := range channels`.
    2. Checks if the actor ID (`k`) is not the sender's ID (`a.id`) to avoid sending a message to itself.
    3. Uses a `select` statement to attempt sending the message to the actor's channel.
    4. If successful, prints a message, increments the sent message counter, and moves on to the next actor.
    5. If the channel is full, it prints an error message and returns an error.

4. The `else` block: Handles the case where the message is sent to a specific actor (to is not "all").
    1. Checks if the specified actor exists in the channel map.
    2. Uses a `select` statement to attempt sending the message to the specified actor's (`to`) channel.
    3. If successful, prints a message, increments the sent message counter.
    4. If the channel is full, it prints an error message and returns an error.
5. Finally, returns `nil` if the message(s) are sent successfully, indicating no errors occurred.

**Receiving messages**

The `receiveOnce` and `receiveMany` methods enable an actor to process received messages. These methods update the shared state and print information about processed messages.

```go
func (a *Actor) receiveOnce() (Message, error) {
	channels := *a.channels
	select {
	case msg := <-channels[a.id]:
		a.shareData.incrementMsgsProcessed()
		fmt.Printf("Actor %s - Processed message '%s' from sender %s\n", a.id, msg.msg, msg.sender)
		return msg, nil
	default:
		fmt.Printf("Actor %s - No messages to process.\n", a.id)
		return Message{}, nil
	}
}

func (a *Actor) receiveMany() ([]*Message, error) {
	channels := *a.channels
	var messages []*Message
	// If the bellow snip was used instead, it would wait until channel was closed
	// for msg := range channels[a.id]
	for {
		select {
		case msg := <-channels[a.id]:
			messages = append(messages, &msg)
			a.shareData.incrementMsgsProcessed()
			fmt.Printf("Actor %s - Processed message '%s' from sender %s\n", a.id, msg.msg, msg.sender)
		default:
			return messages, nil
		}
	}
}
```
*The `receiveOnce` method*

The `receiveOnce` method allows an actor to attempt to receive a single message from its own channel in a non-blocking manner.

If there is a message, it processes it and returns the message. Otherwise, if no message is available, it prints a message and returns an empty message.

The use of `select` ensures that the actor can check for messages without getting blocked, making it suitable for scenarios where it needs to check for incoming messages periodically.

Breaking down the code:

1. `channels := *a.channels`: dereferences the map of communication channels associated with the actor.
2. `select`: Initiates a `select` statement to handle multiple communication channels concurrently. It attempts to receive a message from the actor's own channel (`channels[a.id]`).
    1. `case msg := <-channels[a.id]:`: If a message is received from the actor's channel, it executes the following:
        1. Increments the processed message counter in the shared state using `a.shareData.incrementMsgsProcessed()`.
        2. Prints a message indicating that the actor has processed the received message, including the message content and sender.
        3. Returns the received message and `nil` as the error.

    2. `default:`: If no message is received from the actor's channel, it executes the following:
        1. Prints a message indicating that there are no messages to process for the actor.
        2. Returns an empty `Message{}` and `nil` as the error.

*The `receiveMany` method*

This `receiveMany` method allows an actor to continuously receive messages from its own channel until there are no more messages to process. The loop is intentionally infinite to keep checking for messages without blocking, making it suitable for scenarios where the actor needs to process messages continuously. The use of `select` ensures non-blocking behavior and allows the actor to respond to incoming messages as they arrive. The accumulated messages are then returned once there are no more messages to process.

Code Breakdown:

1. `channels := *a.channels`: references the map of communication channels associated with the actor.
2. `var messages []*Message`: Initializes an empty slice to store received messages.
3. Infinite loop - `for {}`: Initiates an infinite loop to continuously check for messages from the actor's channel.
4. `select:`: Within the loop, it uses a select statement to handle multiple communication channels concurrently.
    1. `case msg := <-channels[a.id]:`: If a message is received from the actor's channel, it executes the following:
        - Appends a pointer to the received message to the `messages` slice.
        - Increments the processed message counter in the shared state using `a.shareData.incrementMsgsProcessed()`.
        - Prints a message indicating that the actor has processed the received message, including the message content and sender.
    2. `default:`: If no message is received from the actor's channel, it returns the accumulated messages and `nil` as the error.

**Starting the actor system**

```go
func start(actors []*Actor) {
	fmt.Println("Starting actors...")
	for _, actor := range actors {
		// synchronous call, so it waits for the actor to finish processing messages
		// alternative would be to use a wait group
		func(a Actor) {
			if _, err := a.receiveMany(); err != nil {
				fmt.Printf("Actor %s - No messages to process.\n", a.id)
			}
		}(*actor)
	}
}
```

The `start` function initiates the actors, making them concurrently process messages.

#### Running the Program

In the `main` function, actors are created, messages are sent asynchronously, and the `start` function is called to process the messages concurrently. Finally, the program prints the updated shared state.

```go
func main() {
	messageChannel := make(map[string]chan Message)

	channelCap := 3
	sharedData := ShareState{nActors: 0, nMsgsProcessed: 0, nMsgsSent: 0}
	a1, _ := new("1", &messageChannel, channelCap, &sharedData)
	a2, _ := new("2", &messageChannel, channelCap, &sharedData)
	a3, _ := new("3", &messageChannel, channelCap, &sharedData)
	fmt.Printf("N Actors: %d | Messages Sent: %d | Messages Received: %d\n", sharedData.nActors, sharedData.nMsgsSent, sharedData.nMsgsProcessed)
	fmt.Println("---")

	// send messages
	// using sleep makes it easier to see the messages being processed
	go a1.send("Viva 2", "2")
	time.Sleep(1 * time.Second)
	go a1.send("Bonjour 3", "3")
	time.Sleep(1 * time.Second)
	go a2.send("Olá 1", "1")
	time.Sleep(1 * time.Second)
	go a3.send("Hello World", "all")
	time.Sleep(1 * time.Second)
	go a3.send("Olá Mundo!", "all")
	time.Sleep(1 * time.Second)
	fmt.Println("---")

	// await
	start([]*Actor{a1, a2, a3})

	fmt.Println("---")
	fmt.Printf("N Actors: %d | Messages Sent: %d | Messages Received: %d\n", sharedData.nActors, sharedData.nMsgsSent, sharedData.nMsgsProcessed)
}
```


Sending more messages to a channel than its capacity allows can lead to the sender getting blocked until there is space in the buffer to accommodate the messages. 

Given that the senders operate as `goroutines`, there's a risk of program termination before the sender completes, potentially resulting in inaccurate shared data output.

In the provided example, the channel has a maximum capacity of 3 messages, ensuring that the buffer won't be overwhelmed. The use of `select` further prevents blocking by allowing the program to execute the `default` block when the buffer is full. Selecting an appropriate buffer size is crucial to guarantee the successful processing and sending of all messages.

Feel free to tweak the program and experiment with different buffer sizes to observe their impact on the output (try setting it to 1 ;).

<details>
<summary><b>The Whole Program</b></summary>

```go
package main

import (
	"errors"
	"fmt"
	"sync"
	"time"
)

type ShareState struct {
	mutex          sync.Mutex
	nActors        int
	nMsgsProcessed int
	nMsgsSent      int
}

func (s *ShareState) incrementMsgsSent() {
	s.mutex.Lock()
	s.nMsgsSent += 1
	s.mutex.Unlock()
}

func (s *ShareState) incrementMsgsProcessed() {
	s.mutex.Lock()
	s.nMsgsProcessed += 1
	s.mutex.Unlock()
}

type Message struct {
	msg    interface{}
	sender string
}

type Actor struct {
	id        string
	channels  *map[string]chan Message
	shareData *ShareState
}

func new(id string, channels *map[string]chan Message, channelCap int, sharedData *ShareState) (*Actor, error) {
	if id == "all" {
		return nil, errors.New("Actor id 'all' is reserved")
	}
	if _, ok := (*channels)[id]; ok {
		return nil, errors.New("Actor id already exists")
	}
	channelsDeref := *channels
	channelsDeref[id] = make(chan Message, channelCap)
	fmt.Printf("Actor %s - Created\n", id)
	sharedData.mutex.Lock()
	sharedData.nActors += 1
	sharedData.mutex.Unlock()
	new_actor := Actor{id, channels, sharedData}

	return &new_actor, nil
}

func (a *Actor) send(m string, to string) error {
	channels := *a.channels
	if len(channels) <= 1 {
		return errors.New("No other actors to send message to")
	}

	if to == "all" {
		for k, _ := range channels {
			if k != a.id {
				select {
				case channels[k] <- Message{m, a.id}:
					fmt.Printf("Actor %s - Sending message '%s' to 'all' - %s\n", a.id, m, k)
					a.shareData.incrementMsgsSent()
				default:
					fmt.Printf("Actor %s - Channel is full\n", a.id)
					return errors.New("Channel is full")
				}
			}
		}
	} else {
		if _, ok := channels[to]; !ok {
			errors.New("Channel not found!")
		}
		// prevents blocking the sender
		select {
		case channels[to] <- Message{m, a.id}:
			fmt.Printf("Actor %s - Sending message '%s' to %s\n", a.id, m, to)
			a.shareData.incrementMsgsSent()
		default:
			fmt.Printf("Actor %s - Channel is full\n", a.id)
			return errors.New("Channel is full")
		}
	}
	return nil
}

func (a *Actor) receiveOnce() (Message, error) {
	channels := *a.channels
	select {
	case msg := <-channels[a.id]:
		a.shareData.incrementMsgsProcessed()
		fmt.Printf("Actor %s - Processed message '%s' from sender %s\n", a.id, msg.msg, msg.sender)
		return msg, nil
	default:
		fmt.Printf("Actor %s - No messages to process.\n", a.id)
		return Message{}, nil
	}
}

func (a *Actor) receiveMany() ([]*Message, error) {
	channels := *a.channels
	var messages []*Message
	// If the bellow snip was used instead, it would wait until channel was closed
	// for msg := range channels[a.id]
	for {
		select {
		case msg := <-channels[a.id]:
			messages = append(messages, &msg)
			a.shareData.incrementMsgsProcessed()
			fmt.Printf("Actor %s - Processed message '%s' from sender %s\n", a.id, msg.msg, msg.sender)
		default:
			return messages, nil
		}
	}
}

func start(actors []*Actor) {
	fmt.Println("Starting actors...")
	for _, actor := range actors {
		// synchronous call, so it waits for the actor to finish processing messages
		// alternative would be to use a wait group (TODO)
		func(a Actor) {
			if _, err := a.receiveMany(); err != nil {
				fmt.Printf("Actor %s - No messages to process.\n", a.id)
			}
		}(*actor)
	}
}

func main() {
	messageChannel := make(map[string]chan Message)
	channelCap := 3
	sharedData := ShareState{nActors: 0, nMsgsProcessed: 0, nMsgsSent: 0}
	a1, _ := new("1", &messageChannel, channelCap, &sharedData)
	a2, _ := new("2", &messageChannel, channelCap, &sharedData)
	a3, _ := new("3", &messageChannel, channelCap, &sharedData)
	fmt.Printf("N Actors: %d | Messages Sent: %d | Messages Received: %d\n", sharedData.nActors, sharedData.nMsgsSent, sharedData.nMsgsProcessed)
	fmt.Println("---")

	// send messages
	// using sleep makes it easier to see the messages being processed
	go a1.send("Viva 2", "2")
	time.Sleep(1 * time.Second)
	go a1.send("Bonjour 3", "3")
	time.Sleep(1 * time.Second)
	go a2.send("Olá 1", "1")
	time.Sleep(1 * time.Second)
	go a3.send("Hello World", "all")
	time.Sleep(1 * time.Second)
	go a3.send("Olá Mundo!", "all")
	time.Sleep(1 * time.Second)
	fmt.Println("---")

	// await
	start([]*Actor{a1, a2, a3})

	fmt.Println("---")
	fmt.Printf("N Actors: %d | Messages Sent: %d | Messages Received: %d\n", sharedData.nActors, sharedData.nMsgsSent, sharedData.nMsgsProcessed)
}
```
</details>

## Conclusion

In this blog post we explore asynchronous programming and the actor model in Golang, revealing the language's robust support for concurrent systems. The provided program demonstrates the creation and communication of actors through channels, shared state management and mutex synchronization for safe concurrency.

Golang's goroutines and channels facilitate a clean and expressive implementation of the actor model, making a great for building scalable and efficient concurrent systems.

Golang's features, offer a powerful paradigm for handling concurrent tasks and designing responsive, resilient and event-driven applications.

## References
- [Go by Example](https://gobyexample.com/)
- [Actor Model](https://en.wikipedia.org/wiki/Actor_model)