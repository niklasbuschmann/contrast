---
title:  "How to process and download financial data in rust"
mathjax: true
layout: post
categories: media
---

This is the first blog post of a series that will focus on time series analysis and forecasting of stock prices. This post shows how to get data from yahoo finance and parse json responses in rust. 

---


## Introduction

Yahoo Finance is a popular platform that provides financial data, news, and insights about stocks, bonds, and other financial instruments. The platform also provides a RESTful API that allows developers to programmatically access its data and build custom applications. In this blog post, we will show you how to download data from the Yahoo Finance API and parse it using the rust programming language.

## Prerequisites
Before we get started, you will need to have rust and Cargo installed on your machine. You can download rust from the official website, rust-lang.org, and Cargo, which is rust's package manager, comes with the rust installation.

## Downloading data from the Yahoo Finance API
To download data from the Yahoo Finance API, we will use the `reqwest` crate, which is a rust HTTP client that allows us to easily send HTTP requests and receive responses. To get started, we first need to add `reqwest` as a dependency to our `Cargo.toml` file:

```toml
[dependencies]
reqwest = { version = "0.11", features = ["json"] }
tokio = { version = "1", features = ["full"] }
```

Once we have added the dependency, we can use the following Rust code to download data from the Yahoo Finance API:

```rust
use tokio;
use reqwest;

#[tokio::main]
async fn main() -> Result<(), reqwest::Error> {

    let symbol = "AAPL";
    let date_start = NaiveDate::from_ymd_opt(2023, 1, 1).unwrap();
    let interval = "1d";
    let start_timestamp = date_start.and_hms_opt(0, 0, 0).unwrap().timestamp();
    let end_timestamp = Utc::now().timestamp();

    let url = format!(
        "https://query1.finance.yahoo.com/v8/finance/chart/{}?period1={}&period2={}&interval={}",
        symbol,
        start_timestamp,
        end_timestamp,
        interval,
    );
    println!("Url: {}", url);

    let client = reqwest::Client::builder().timeout(Duration::from_secs(5)).build()?;

    let response: serde_json::Value = client.get(&url).send().await?.json().await?;
    println!("response: {:?}\n", response);
```

In this example, we first import the `reqwest` and `tokio` crates.

We then define a main function that is annotated with the `#[tokio::main]` attribute. This attribute tells rust to use the `tokio` runtime to execute the asynchronous code.

Inside the main function, we define the url variable, which contains the URL of the Yahoo Finance API endpoint that we want to query. In this case, we are querying the price history of Apple (`AAPL` - `symbol`) from January 1st (`period1`) until the moment that `main` is ran (`period2`) with intervals of 1 day (`1d`) between observations (`interval`). We convert dates to timestamps to build de API query and create the final url using `format!`, which creates a `String` using interpolation of runtime expressions.

We then create a `reqwest::Client` with a timeout of 5 seconds, and use the `get()` method to send an HTTP GET request to the URL and return the response as a JSON object. JSON values are stored using the `serde_json::Value` data structure, which is a data container that can store any valid JSON value:
```rust
enum Value {
    Null,
    Bool(bool),
    Number(Number),
    String(String),
    Array(Vec<Value>),
    Object(Map<String, Value>),
}
```

We print the url and response to the console using the `println!()` macro.

```bash
Url: https://query1.finance.yahoo.com/v8/finance/chart/AAPL?period1=1672531200&period2=1676585545&interval=1d
```

## Parsing Data from the Yahoo Finance API
Now that we have downloaded the data from the Yahoo Finance API, we can parse it using rust's built-in `serde` crate. `serde` is a rust library for serializing and deserializing data, and it supports many data formats, including JSON, which is what the Yahoo Finance API returns.

To parse the JSON data, we need to add the `serde` and `serde_json` dependencies to our `Cargo.toml` file:

```toml
[dependencies]
serde = {version = "1.0.152", features = ["derive"]}
serde_json = {version = "1.0.93"}
```

To parse JSON data using `serde_json`, we can create a rust struct that represents the JSON data. The struct must have fields that correspond to the fields in the JSON object. Each field must have a type that can be deserialized from the JSON data. For example, a JSON object with a field `"name"` that contains a string value can be represented by a rust struct with a name field of type `String`.

A toy example:
```rust
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
struct Person {
    name: String,
    age: u32,
    is_student: bool,
}
```
The above struc can be used with `serde` to parse the following json data:

```json
{"name": "Alice", 
 "age": 25, 
 "is_student": true
 }
```

Once we have added the dependencies, we can use the following rust code to parse the data returned by the Yahoo Finance API:

```rust
use serde::Deserialize;


#[derive(Debug, Deserialize)]
struct YahooFinanceQuote {
    low: Vec<f64>,
    volume: Vec<i64>,
    close: Vec<f64>,
    open: Vec<f64>,
}

#[derive(Debug, Deserialize)]
struct YahooFinanceQuoteTs {
    timestamps: Vec<i64>,
    quotes: YahooFinanceQuote,
}
```

## Putting everything together
Now that we have all the pieces we can parse the data using `serde` and structs:

```rust
let response_json: &Map<String, Value> = response.as_object().unwrap()["chart"]["result"][0].as_object().unwrap();

let timestamps: &Vec<Value> = response_json["timestamp"].as_array().unwrap();
let quotes: : &Vec<Value> = response_json["indicators"]["quote"].as_array().unwrap(); // quote is an array with 1 object

let yahoo_quotes: YahooFinanceQuote = serde_json::from_value(quotes[0].clone()).unwrap();
let yahoo_quotes_ts: YahooFinanceQuoteTs = YahooFinanceQuoteTs {
    timestamps: timestamps.into_iter().map(|x| x.as_i64().unwrap()).collect(),
    quotes: yahoo_quotes,
};
```

We start by calling the `as_object()` method, which returns a `Result<&Map<String, Value>>`, and access the `["chart"]["result"][0]` object to get the response data. We then extract the response's array of timestamps via `["timestamp"]` and quote data through `["indicators"]["quote"]`, using the `as_array()` method, which returns a `Result<&Vec<Value>>`. Finally, we store the data in a struct using the `serde_json::from_value()` method that takes a `serde_json::Value` as input argument; we explicitly copy the object (using `clone()`) since a move occurs because type `serde_json::Value` does not implement the `Copy` trait. While `quote[0]` is a `serde_json::Value`, `timestamps` is of type `&Vec<Value>` and thus we cannot use `serde_json::from_value`, so iterate over the vector and extract the values as `i64` values using the `as_i64()` method.


We can visualize our data using:
```rust
println!("QuotesTs: {:?}\n", yahoo_quotes_ts);

for (i, (ts, price)) in yahoo_quotes_ts.timestamps.iter().zip(yahoo_quotes_ts.quotes.close.iter()).enumerate() {
    let datetime = NaiveDateTime::from_timestamp_opt(*ts, 0).unwrap();
    println!("{} - Date: {} | Price: ${}", i+1, datetime, price);
}
```

Which outputs:

```
QuotesTs: YahooFinanceQuoteTs { timestamps: [1676385000, 1676471400, 1676581205], quotes: YahooFinanceQuote { low: [150.86000061035156, 152.8800048828125, 153.34750366210938], volume: [61707600, 65669300, 66914188], close: [153.1999969482422, 155.3300018310547, 153.7100067138672], open: [152.1199951171875, 153.11000061035156, 153.50999450683594] } }

1 - Date: 2023-02-14 | Price: $153.1999969482422
2 - Date: 2023-02-15 | Price: $155.3300018310547
3 - Date: 2023-02-16 | Price: $153.7100067138672
```

## Conclusion
The blog post describes how to download data from the Yahoo Finance API and parse it using rust. I've provided a step-by-step guide on how to make HTTP requests using the `reqwest` crate and parse the JSON response using the `serde_json` crate. I also show how to use rust's `chrono` crate to work with dates and timestamps.

The key takeaways from the post are:
1. The Yahoo Finance API provides historical stock price data that can be accessed via HTTP requests.
2. Rust provides a rich set of crates for working with HTTP requests, JSON parsing, dates, and timestamps.
3. The `reqwest` crate can be used to make HTTP requests, while the `serde_json` crate can be used to parse the JSON response.
4. The `chrono` crate provides a convenient way to work with dates and timestamps in rust.

By combining these tools, it is possible to download historical stock price data from the Yahoo Finance API and process it using rust.

## References
1. [serde_json](ttps://docs.rs/serde_json/latest/serde_json/)
2. [Clone](raint)[https://doc.rust-lang.org/std/clone/trait.Clone.html)
3. [Yahoo](PI reference)[https://cryptocointracker.com/yahoo-finance/yahoo-finance-api)
4. [Yahoo](inance)[https://finance.yahoo.com/)
5. [reqwests](https://docs.rs/reqwest/latest/reqwest/)
6. [chrono](https://docs.rs/chrono/latest/chrono/)