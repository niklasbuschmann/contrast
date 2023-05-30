---
title:  "Understanding Ord, Eq, PartialOrd, and PartialEq Traits in Rust"
mathjax: true
layout: post
categories: media
---

Rust provides several traits that are fundamental for comparing and ordering values. These traits include `Ord`, `Eq`, `PartialOrd`, and `PartialEq`. In this blog post, we'll explore what these traits are, when they can and can't be derived, and how they can be used to sort a vector. 

---

# Understanding Ord, Eq, PartialOrd, and PartialEq Traits in Rust

Rust provides several traits that are fundamental for comparing and ordering values. These traits include `Ord`, `Eq`, `PartialOrd`, and `PartialEq`. In this blog post, we'll explore what these traits are, when they can and can't be derived, and how they can be used to sort a vector.

When working with custom types in Rust, it's often useful to compare and order instances of those types. The `Ord`, `Eq`, `PartialOrd`, and `PartialEq` traits, play a key role in enabling comparison and sorting operations. However, the presence of certain fields can affect the ability to derive these traits automatically.

Let's consider the following `Person` struct as an example:

```rust
#[derive(Debug)]
struct Person {
    name: String,
    age: u32,
    income: f32,
}
```

In this case, the `income` field is of type `f32`. When it comes to floats, comparing them for equality or establishing a total ordering can be problematic due to precision limitations. Floats are prone to rounding errors, meaning that two seemingly equal floats may have slightly different representations. Therefore, deriving the `Eq`, `Ord`, `PartialEq`, and `PartialOrd` traits for the `Person` struct is not possible automatically.

However, if we remove the `income` field from the `Person` struct, we can derive all the discussed traits:

```rust
#[derive(Debug, Eq, Ord, PartialEq, PartialOrd)]
struct Person {
    name: String,
    age: u32,
}
```

In this modified version of the `Person` struct, all fields implement the necessary traits, allowing us to derive them. This enables us to easily compare instances of `Person` for equality, establish a total ordering, and use the derived traits for sorting operations.

It is possible though, to comparte multiple floats by using the `partial_cmp` and `sort_by` methods.

```rust
let mut float_vec = vec![1.0, 0.3, 4.6];
float_vec.sort_by(|a, b| a.partial_cmp(b).unwrap());
```

## The Ord Trait

The `Ord` trait represents types that can be totally ordered, meaning they can be compared for relative ordering. It provides the `cmp` method, which returns an instance of the `Ordering` enum, representing the result of the comparison.

```rust
enum Ordering {
    Less,
    Equal,
    Greater,
}
```

The `Ord` trait can be manually implemented for custom types. Alternatively, you can use the `#[derive(Ord)]` attribute macro to automatically generate the implementation based on the fields of the struct. However, note that the `Ord` trait requires all fields to implement `Ord`, which may not always be the case (like `f32`) or desired.

```rust
// https://doc.rust-lang.org/std/cmp/trait.Ord.html
pub trait Ord: Eq + PartialOrd<Self>
```

In addition, `Ord` requires `PartialOrd`, and its implementations must be consistent with the `PartialOrd` implementation.



```rust
impl Ord for Person {
    fn cmp(&self, other: &Self) -> Ordering {
        self.partial_cmp(&other).unwrap()
    }
}
```

In the above example, the `cmp` method is implemented for the `Person` struct, delegating the comparison to the `PartialOrd` implementation.

## The Eq Trait

The `Eq` trait represents types that can be compared for equality. It extends the `PartialEq` trait, requiring the implementation of the `eq` method, which compares two values for equality and returns a `bool`.

```rust
impl Eq for Person {}
```

For `Eq`, no additional methods need to be implemented. It acts as a marker trait, indicating that the type can be compared reflexively for equality. By default, Rust derives `Eq` when the `PartialEq` trait is implemented.

## The PartialOrd and PartialEq Traits

The `PartialOrd` and `PartialEq` traits are similar to `Ord` and `Eq`, respectively, but they allow for partial ordering and partial equality comparisons. This means that not all values need to have a definite order or be equal.

To manually implement `PartialOrd` and `PartialEq`, you need to implement the `partial_cmp` and `eq` methods, respectively.

```rust
impl PartialOrd for Person {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        let ordering = self.name.cmp(&other.name).then(self.age.cmp(&other.age));

        if Ordering::Equal == ordering {
            self.income.partial_cmp(&other.income)
        } else {
            Some(ordering)
        }
    }
}

impl PartialEq for Person {
    fn eq(&self, other: &Self) -> bool {
        self.name == other.name && self.age == other.age && self.income == other.income
    }
}
```

In the `PartialOrd` implementation above, the `partial_cmp` method compares the `name` field using `cmp`, followed by the `age` field. If both fields are equal, it compares the `income` field using `partial_cmp`. The `PartialEq` implementation compares all three fields for equality.

## Deriving Traits and Sorting a Vector

Rust provides the `#[derive]` attribute macro to automatically generate implementations for certain traits. However, not all traits can be derived automatically.

For the `Person` struct, you can derive `Debug` and `PartialEq`, but not `Ord`, `Eq`, `PartialOrd`, as the presence of the `income` field of type `f32` prevents automatic derivation. The floating-point numbers cannot be accurately compared for equality or total ordering due to potential rounding errors.

To sort a vector of `Person` instances

To sort a vector of `Person` instances, you can manually implement the `Ord` trait for `Person` by leveraging the `PartialOrd` implementation. By implementing `Ord`, you can establish the total ordering required for sorting.

```rust
impl Ord for Person {
    fn cmp(&self, other: &Self) -> Ordering {
        self.partial_cmp(other).unwrap()
    }
}
```

In the `Ord` implementation above, the `cmp` method simply calls `partial_cmp` and unwraps the `Option<Ordering>` to obtain the total ordering. This assumes that the `partial_cmp` implementation always returns a non-`None` value, indicating that the comparison is well-defined.

With the `Ord` trait implemented, you can now use the `sort` or `sort_by` methods on the vector of `Person` instances to sort them.

```rust
let mut people = vec![
    Person::new("Zoe".to_string(), 25, 70000.0),
    Person::new("Al".to_string(), 60, 25000.0),
    Person::new("John".to_string(), 1, 10000.0),
];

people.sort(); // Sort people by derived natural order (Name, age, and income)

assert_eq!(
    people,
    vec![
        Person::new("Al".to_string(), 60, 25000.0),
        Person::new("John".to_string(), 1, 10000.0),
        Person::new("Zoe".to_string(), 25, 70000.0),
]);

people.sort_by(|a, b| a.age.cmp(&b.age)); // Sort people by age

assert_eq!(
    people,
    vec![
        Person::new("John".to_string(), 1, 10000.0),
        Person::new("Zoe".to_string(), 25, 70000.0),
        Person::new("Al".to_string(), 60, 25000.0),
]);
```

In the example above, the vector of `Person` instances, `people`, is sorted using the `sort` method to sort them by their derived natural order, which includes the fields `name`, `age`, and `income`. The `sort_by` method is then used to sort them by the `age` field.

By implementing `Ord` and `PartialOrd` for the `Person` struct, you gain the ability to compare instances and establish a total ordering, enabling sorting operations.


When working with floats, it's important to note that comparing floating-point numbers for equality can be problematic due to precision limitations. Floats are prone to rounding errors, which means that two seemingly equal floats may have slightly different representations.

To handle floating-point numbers in comparison operations, you can use the `partial_cmp` method, which returns an `Option<Ordering>`. The `partial_cmp` method performs a partial comparison and allows for handling potential inconsistencies due to floating-point precision.

In the `PartialOrd` implementation for `Person` shown earlier, the `partial_cmp` method is used to compare the `income` field of two `Person` instances. It first compares the `name` and `age` fields using the `cmp` method, and if they are equal, it proceeds to compare the `income` fields using `partial_cmp`.

```rust
impl PartialOrd for Person {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        let ordering = self.name.cmp(&other.name).then(self.age.cmp(&other.age));

        if Ordering::Equal == ordering {
            self.income.partial_cmp(&other.income)
        } else {
            Some(ordering)
        }
    }
}
```

By using `partial_cmp`, you handle potential inconsistencies and avoid assuming exact equality for floating-point numbers. This helps maintain the correctness and stability of the comparison operations.

## Conclusion
The `Ord`, `Eq`, `PartialOrd`, and `PartialEq` traits are essential in Rust for comparing and ordering values. While these traits can often be derived automatically, in some cases, you may need to manually implement them. When working with floats, it's crucial to use `partial_cmp` to handle potential precision issues. By implementing these traits appropriately, you can enable sorting and comparison operations on custom types in Rust.