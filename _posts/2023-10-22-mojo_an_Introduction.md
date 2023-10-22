---
title:  "Mojo - An Introduction"
mathjax: true
layout: post
categories: media
---

A first look at Mojo. In this post I scratch the surface of Mojo's syntax and compare how its borrow semantics compare to rust's.
---

# Mojo - An Introduction

Mojo is designed to be a superset of Python, bringing an array of features and capabilities that make it particularly well-suited for software development, especially in the field of artificial intelligence. In this article, we'll explore some of the key differences that set Mojo apart from Python.

## Syntax: `fn` vs. `def` & `let` vs `var`

Before delving into Mojo's unique features, let's start with a basic syntax comparison. In Mojo, functions are defined using the `fn` keyword, while Python uses `def`. This distinction is just the tip of the iceberg when it comes to the differences between the two languages.

```python
fn do_math():
    let x: Int = 1
    let y = 2
    print(x + y)

>>> do_math()
3
```

In this example, `do_math` is a simple function that calculates and prints the sum of two variables. The use of `let` to declare variables, similar to `var` in Python, shows that Mojo emphasizes immutability by default.

## Function Arguments: Borrowed, Mutable, and Owned

One of Mojo's standout features is that it is a statically typed language and its borrow semantics. In Mojo, function arguments are, by default, immutable references, which means they cannot be modified within the function. However, Mojo allows you to declare arguments as `inout` to make them mutable, enabling changes that persist outside the function.

```python
fn add(x: Int, y: Int) -> Int:
    return x + y
    
>>> let x = 1
>>> let y = 1
>>> add(x, y)
2
```

The above function `add` takes two immutable arguments and returns their sum. To make the arguments mutable, you would declare them as `inout`.

```python
fn add_inout(inout x: Int, inout y: Int) -> Int:
    x += 1
    y += 1
    return x + y

>>> let x = 1
>>> let y = 1
>>> add(x, y)
4
>>>print(x)
2
>>>print(y)
2
```

Another option is to declare the argument as `owned`, which provides the function full ownership of the value 
, it's mutable and guaranteed unique.
This way, the function can modify the value and not worry about affecting variables outside the function
If owned is not used then `text` can't be modified: `error: expression must be mutable in assignment`

```python
fn add_surname(owned text: String) -> String:
    text = text + " Lemos"
    return text

>>> let name = "Bernardo"
>>> let name_w_surname = add_surname(name)
>>> print(name_w_surname)
Bernardo Lemos
>>> print(name)
Bernardo
```
Note how even though `name` was mutated in `add_surname`, changes did not materialize outside the function, since a copy was passed.

However, if you want to give the function ownership of the value and do not want to make a copy (which can be an expensive operation for some types), then you can add the ^ "transfer" operator when you  pass a to the function. The transfer operator effectively destroys the local variable name—any attempt to call upon it later causes a compiler error.

```python
>>> let name_w_surname = add_surname(name^) # transfer object
>>> print(name_w_surname)
Bernardo Lemos
>>> print(name) # raises an error, `name` no longer in scope
```

## Structures: Static Abstractions

Mojo provides high-level abstractions for types using structures (similar to classes in Python). These structures support methods, fields, operator overloading, and metaprogramming, but they are entirely static, bound at compile-time, and do not allow dynamic dispatch.

```python
struct MyPair:
    var first: Int
    var second: Int

    fn __init__(inout self, first: Int, second: Int):
        self.first = first
        self.second = second

    fn dump(self):
        print(self.first, self.second)
```



## Errors - Making it Crash

In this section we'll explore some errors raised by mojo's compiler, namely borrow checking.

### Error 1: `add_inout` Argument Mutability

```bash
error: invalid call to 'add_inout': argument #0 must be mutable in order to pass as a by-ref argument
let y = 3
add_inout(x, y)
```

**Explanation**: In this error, Mojo is enforcing its immutability rules. The function `add_inout` expects mutable references as arguments. The attempt to pass an immutable reference, `y`, causes a compilation error.

### Error 2: Variable Shadowing
Mojo does not support shadowing. Trying to instantiate a variable of the same name raises an error.
```python
let name_with_surname = add_surname(name)
...
let name_with_surname = "Other"
```

```bash
error: invalid redefinition of 'name_with_surname'
let name_with_surname = add_surname(name)"""
```

**Explanation**: Mojo does not support variable shadowing. In this case, attempting to redefine the variable `name_with_surname` in the same scope results in an error. Variable names must be unique within their scope.

### Error 3: Ownership and Transfer Operator

```python
"""Transfering `name` to the function will destroy `name` it in the current scope
making it unusable from this point forward
"""

Running:
```python
let name_with_surname_3 = add_surname(name^)
print(name)
```

Produces an error:
```bash
error: use of uninitialized value 'name'
    print(name)
note: 'name' declared here
    let name = "Berna"
```

**Explanation**: This error highlights Mojo's ownership and transfer semantics. Using the `^` transfer operator when passing `name` to the `add_surname` function means that the function takes full ownership of the variable, making it unusable in the current scope. Attempting to use `name` after transferring ownership results in an "uninitialized value" error.

### Comparing Mojo to Rust Ownership Semantics

Mentioning Rust ownership semantics is misleading, since transferring an immutable object to a function in Rust, the function which then owns the variable cannot mutate it. To do so, the function must explicitly accept a mutable argument (`mut text: String`),  which will raise `cannot borrow `text` as mutable, as it is not declared as mutable`. On the contrary, Mojo allows the function to change the transferred value, even if it's immutable, as seen in the example. But in Mojo's docs, this is explicit: "`owned`, which provides the function full ownership of the value (it’s mutable and guaranteed unique)

While Rust enforces stricter ownership rules, Mojo allows functions to change transferred values, even if they are originally immutable. Mojo's `owned` concept provides full ownership of a value, making it mutable and unique within the function.

## Conclusion

Mojo is a powerful and promosing new language that pushes the boundaries of what's possible in developing AI solutions. Its syntax and features offer a fresh perspective on software development, making it a valuable addition to the programming landscape.
Mojo introduces a unique set of rules and behaviors related to mutability, variable shadowing, and ownership. These features make Mojo an intriguing and distinctive language for developers exploring new paradigms in programming.
In future articles, we'll explore Mojo in more depth and dive into advanced topics and work on ML use cases.

## References
- [Getting Started with Mojo](https://docs.modular.com/mojo/manual/get-started/)
- [Mojo documentation](https://docs.modular.com/mojo/)