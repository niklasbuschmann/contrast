---
title:  "Rust - Dynamic dispatching and Generics"
mathjax: true
layout: post
categories: media
---

In this blog post I show the main differences between using dynamic dispatching, `dyn`, and generics,`impl`/`<T>`, using a simple program that creates different database connectors.

_**NB:** this blog post assumes some familiarity with rust_

---


## Building a database connector
A database connector allows establishing connections to a database and run queries without binding to a specific query language or data store. Suppose that you have a service that connects to `PostgreSQL`and `MongoDB`, they're fundamentally different - SQL vs NOSQL, Row based vs Document based, query language - but at the same time, they simply store and retrieve data.

### `trait`s
A `trait` defines functionality which can be shared across different types. By using trait bounds, one can specify a behavior that a generic type can be any type that has certain behavior.

Defining a `trait` to represent the connector functionality exposes a common interface to the client. This allow a program to be independent of the data store used, potentially reusing large pieces of code, making it very general.

I provide a mockup example bellow.

### Implementing the DB connector
We start by defining the database connector `trait`, which tells how a connector should work, like a blueprint:

```rust
use std::result::Result;

struct Query {
    query: String,
}

struct Data {}

trait DbConnector {
    fn connect(&self) -> Result<String, String>;
    fn query(&self, query: Query) -> Result<Data, String>;
}
```

The `DbConnector` `trait`exposes a `connect` method to establish a database connection, and a `query`method that executes a query.

### Defining concrete connectors
We can create concrete database connectors:

```rust
#[derive(Clone)]
struct MongoDb {
    conn: String
}

impl DbConnector for MongoDb {
    fn connect(&self) -> Result<String, String> {
        if self.conn.contains("mongo"){
            Ok(self.conn.to_owned())
        } else {
            Err(String::from("Failed to connect to mongo."))
        }
    }

    fn query(&self, qry: Query) -> Result<Data, String> {
        if qry.query.contains("..."){
            Ok(Data {})
        } else {
            Err(String::from("Failed to execute mongo query."))
        }
    }

}

#[derive(Clone)]
struct PostgreSQL {
    conn: String
}

impl DbConnector for PostgreSQL {
    fn connect(&self) -> Result<String, String> {
        if self.conn.contains("postgresql"){
            Ok(self.conn.to_owned())
        } else {
            Err(String::from("Failed to connect to postgres."))
        }
    }

    fn query(&self, qry: Query) -> Result<Data, String> {
        if qry.query.contains(""){
            Ok(Data {})
        } else {
            Err(String::from("Failed to execute postgres query."))
        }
    }

}
```

We now have a `PostgreSQL`and a `MongoDB`connector. Note how they can have different implementation but ultimately expose the same interface. This allows the caller to be unaware of the concrete data store type.

### Defining caller functions using dynamic dispatching and generics
There's a big difference between using dynamic dispatching, `dyn` and generics, `<T>`/`ìmpl`.

#### Generics
When using generics, `rust` uses monomorphisation. This mean that the compiler creates a function for each concrete type.
This increases code size, since it creates a copy for each implementation of `DbConnector` and allows multiple bounds. Rust decides the concrete function for an implementation at compile time, thus faster equivalent to using generics fine-grained control of properties of types using `where` clauses can have multiple trait bounds (e.g., `impl (Foo + Bar)` is allowed, but `dyn (Foo + Bar)` is not).
All type parameters have an implicit bound of `Sized`, which allows the compiler to know the amount of memory needed to allocate an object. This mechanism makes monomorphisation possible.

```rust
fn connect_impl_arg(connector: impl DbConnector) -> Result<String, String> {
    connector.connect()
}

fn connect_impl_generic<T: DbConnector>(connector: T) -> Result<String, String> {
    connector.connect()
}
```

The functions above are equivalent, but use a different syntax.
Rust will create a copy for each implementation of `DbConnector` for each function.

#### Dynamic dispatching

Dynamic dispatch is the process of selecting which implementation of a polymorphic operation (method or function) to call at run time.
`dyn` means "dynamic dispatching", the type is determined at runtime which results in a runtime overhead. Objects must always be passed by pointer (`&`, `Box`, `Rc`, etc) - doesn't have a size known at compile-time, since it isn't `Sized` - and must be safe.

Using `dyn`:
```rust
fn connect_dyn_ref(connector: &dyn DbConnector) -> Result<String, String> {
    connector.connect()
}

fn connect_dyn_box(connector: Box<dyn DbConnector>) -> Result<String, String> {
    connector.connect()
}
```
The above functions offer two different flavors for using `dyn`. Either by reference or by using a `Box`container (`Box` is a pointer type that uniquely owns a heap allocation).

#### Instantiating db connector objects and calling functions

This is how it looks calling the functions different strategies:
```rust
// concrete connectors
let mongo_conn = MongoDb {conn: String::from("mongodb://username:password@host1:port1")};
let psql_conn = PostgreSQL {conn: String::from("postgresql://user:password@]netloc:port/dbname")};

println!("Call connect_impl_arg");
println!("\tMongoDB connection: {}", connect_impl_arg(mongo_conn.clone()).unwrap());
println!("\tPostgreSQL connection: {}", connect_impl_arg(psql_conn.clone()).unwrap());


println!("Call onnect_impl_generic");
println!("\tMongoDB connection: {}", connect_impl_generic(mongo_conn.clone()).unwrap());
println!("\tPostgreSQL connection: {}", connect_impl_generic(psql_conn.clone()).unwrap());

println!("Call connect_dyn_ref");
println!("\tMongoDB connection: {}", connect_dyn_ref(&mongo_conn).unwrap());
println!("\tPostgreSQL connection: {}", connect_dyn_ref(&psql_conn).unwrap());

let boxed_mongo_conn = Box::new(mongo_conn.clone());
let boxed_psql_conn = Box::new(psql_conn.clone());
println!("Call connect_dyn_box");
println!("\tMongoDB connection: {}", connect_dyn_box(boxed_mongo_conn).unwrap());
println!("\tPostgreSQL connection: {}", connect_dyn_box(boxed_psql_conn).unwrap());
```

## Conclusion
Rust is a powerful and expressive language with rich types - including generics and type bounds. It allows flexible implementations and is able to fit to very specific requirements. This blog post showed the differences between using dynamic dispatching and monophormisation via generics. Although using generics is safer and more performant, using dynamic dispatching can be used when the concrete type of an object is unknown at compile or when using object references (e.g. `Vec<Box<dyn T>>`).

If you'd like to dig, please watch [Jon Gjengset's](https://thesquareplanet.com/) video [Crust of Rust: Dispatch and Fat Pointers
](https://www.youtube.com/watch?v=xcygqF5LVmM&list=PLqbS7AVVErFiWDOAVrPt7aYmnuuOLYvOa&index=11&ab_channel=JonGjengset).

## References
- [rust lang book - traits](https://doc.rust-lang.org/book/ch10-02-traits.html)
- [rust lang book -  the Sized trait ](https://doc.rust-lang.org/std/marker/trait.Sized.html)
- [rust lang book - dyn](https://doc.rust-lang.org/std/keyword.dyn.html)
- [Wikipedia: Dynamic dispatch](https://en.wikipedia.org/wiki/Dynamic_dispatch)
- [Crust of Rust: Dispatch and Fat Pointers](https://www.youtube.com/watch?v=xcygqF5LVmM&list=PLqbS7AVVErFiWDOAVrPt7aYmnuuOLYvOa&index=11&ab_channel=JonGjengset)