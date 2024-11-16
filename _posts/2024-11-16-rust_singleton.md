---
title:  "Implementing a Singleton Pattern in Rust: A Practical Example"
mathjax: true
layout: post
categories: media
---

In this blog post, we'll explore how to implement a **Singleton pattern** in Rust. The Singleton design pattern ensures a class has only one instance while providing a global access point to that instance. Rust's ownership model and thread safety make this implementation an interesting challenge.

---

# Implementing a Singleton Pattern in Rust: A Practical Example

In this blog post, we'll explore how to implement a **Singleton pattern** in Rust. The Singleton design pattern ensures a class has only one instance while providing a global access point to that instance. Rust's ownership model and thread safety make this implementation an interesting challenge.

### Why Singletons?

Singletons are useful when you need a single shared resource, such as a configuration manager or a cache. However, they must be used carefully, as overusing the pattern can lead to tightly coupled code.

### Singleton Implementation in Rust

Below is an implementation of a singleton pattern using `std::rc::Rc` (reference counting for shared ownership) and `std::cell::RefCell` (interior mutability for shared mutable state). Here's the full code:

```rust
use std::rc::Rc;
use std::cell::RefCell;

// Enum to represent the state of data stored in the Singleton
#[derive(Clone, Debug)]
enum Data {
    Content(String),
    Empty,
}

// The Singleton struct holds shared, mutable data
#[derive(Clone, Debug)]
struct Singleton {
    data: Rc<RefCell<Data>>, // Shared and mutable data wrapped in Rc and RefCell
}

// A static mutable variable to hold the singleton instance
static mut INSTANCE: RefCell<Option<Singleton>> = RefCell::new(None);

impl Singleton {
    /// Creates a new singleton instance or returns the existing one
    fn new(data: Rc<RefCell<Data>>) -> Self {
        unsafe {
            let mut instance = INSTANCE.borrow_mut(); // Borrow the static instance for modification

            match &*instance {
                Some(val) => val.clone(), // Return the existing instance if it exists
                _ => {
                    // Create a new Singleton if none exists
                    let singleton = Singleton { data: data };
                    let singleton_ptr = Some(singleton.clone());
                    *instance = singleton_ptr; // Update the static instance with the new Singleton
                    singleton // Return the new Singleton
                }
            }
        }
    }

    /// Swaps the state of the Singleton's data between Empty and Content
    fn swap(&mut self) {
        let mut data = self.data.borrow_mut();
        match *data {
            Data::Empty => *data = Data::Content("SWAPPED".to_string()),
            _ => *data = Data::Empty,
        }
    }
}

fn main() {
    // Create shared data for the Singleton
    let shared_data = Rc::new(RefCell::new(Data::Empty));
    let other_shared_data = Rc::new(RefCell::new(Data::Content("Hey".to_string())));

    // Create or retrieve the Singleton instance using `shared_data`
    let mut singleton1 = Singleton::new(shared_data);

    // Attempt to create another Singleton instance using different data
    let mut singleton2 = Singleton::new(other_shared_data);

    // Both singleton1 and singleton2 refer to the same Singleton instance
    println!("{:?}", singleton1);
    println!("{:?}", singleton2);

    // Swap the state of singleton1's data
    singleton1.swap();

    // Observe that the change is reflected in both singleton1 and singleton2
    println!("{:?}", singleton1);
    println!("{:?}", singleton2);

    // Swap the state of singleton2's data
    singleton2.swap();

    // Again, observe the shared state between singleton1 and singleton2
    println!("{:?}", singleton1);
    println!("{:?}", singleton2);
}
```

---

### Understanding the Implementation

#### 1. **`Rc` and `RefCell`**
- **`Rc`** (Reference Counted Pointer): Manages shared ownership of data. Multiple `Rc` instances can point to the same data.
- **`RefCell`**: Allows mutation of the data even when it's shared (mutable borrows are checked at runtime instead of compile-time).

#### 2. **Static Instance Storage**
The singleton instance is stored in a `static mut INSTANCE`, which is wrapped in a `RefCell` to allow mutability. Using `unsafe` allows us to modify this static variable, though care must be taken to ensure proper synchronization in multi-threaded contexts.

#### 3. **Singleton Initialization**
The `Singleton::new` method checks if an instance already exists:
- If it does, it returns the existing instance.
- If not, it creates a new `Singleton`, stores it in `INSTANCE`, and returns it.

#### 4. **The `swap` Method**
This method modifies the `Singleton`'s `data`:
- If the data is `Data::Empty`, it changes it to `Data::Content("SWAPPED")`.
- Otherwise, it resets the data to `Data::Empty`.

It'll illustrate how all instances of `Singleton` are affected (point to the same data).
---

### Running the Example

#### Input

The `main` function demonstrates how two calls to `Singleton::new` with different data sources return the same underlying singleton. The `swap` method toggles the state of the shared data.

#### Output

```plaintext
Singleton { data: RefCell { value: Empty } }
Singleton { data: RefCell { value: Empty } }
Singleton { data: RefCell { value: Content("SWAPPED") } }
Singleton { data: RefCell { value: Content("SWAPPED") } }
Singleton { data: RefCell { value: Empty } }
Singleton { data: RefCell { value: Empty } }
```

- The first two instances share the same underlying data (`Empty`).
- Swapping the state on one instance affects the other, confirming they are the same instance.

---

### Considerations

1. **Thread Safety**
   The example uses `std::rc::Rc`, which is not thread-safe. For multi-threaded programs, you would need to use `Arc<Mutex<>>` instead of `Rc<RefCell<>>`.

2. **Unsafe Code**
   Using `unsafe` to access a mutable static variable is necessary here but should be avoided when possible. Consider using a crate like `lazy_static` or `once_cell` for safer alternatives.

3. **Overuse**
   Singletons can lead to hidden dependencies and global state, making your program harder to test and maintain.

---

### Alternatives

This example demonstrates a basic singleton implementation in Rust. While it works, it's essential to carefully evaluate when and where to use singletons, particularly in concurrent applications. For thread-safe implementations, libraries like `lazy_static` or `once_cell` can provide more robust solutions.