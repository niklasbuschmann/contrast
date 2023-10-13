---
title:  "Using Actix to expose a command line tool"
mathjax: true
layout: post
categories: media
---

In this blog post, we'll explore a Rust program that exposes an existing command-line tool via a REST API. This program leverages the Actix-web framework to create a simple HTTP server, handles HTTP requests, and interacts with an external CLI tool.

---


# Using Actix to expose a command line tool

In this blog post, we'll explore a Rust program that exposes an existing command-line tool via a REST API. This program leverages the Actix-web framework to create a simple HTTP server, handles HTTP requests, and interacts with an external CLI tool.

## Understanding the Goal

The goal of this program is to expose a command-line tool through a REST API. The program listens on `http://127.0.0.1:8080` and offers the following endpoints:

1. `GET /hello`: A simple endpoint that returns a "Hello!" message.
2. `GET /data`: This endpoint retrieves data stored in a shared state, which is initially an empty vector.
3. `POST /execute`: This endpoint takes a JSON payload, executes an external Python script (`in_n_out.py`) with the payload as input, and stores the execution result in the shared state.
4. `POST /exit`: This endpoint initiates a graceful shutdown of the server.

Let's break down the code and understand how each part works.

### The command line tool

We create a simple python script - `in_n_out.py` - that reads the standard input and write the same string back to the standard out.

```python
import sys

if __name__ == "__main__":
    try:
        text = sys.stdin.buffer.read()
        if len(text) > 0:
            sys.stdout.buffer.write(text)
            sys.stdout.flush()

    except KeyboardInterrupt:
        sys.exit(1)

    sys.exit(0)

```

### Example
In this example, we will demonstrate how to use the `/execute` endpoint of the Rust program to execute a command by sending a `POST` request with the "Hello World!" string.

**Input:**
```bash
curl -X POST -H "Content-Type: application/json" -d '{"text": "Hello World!"}' http://127.0.0.1:8080/execute
```

**Output:**
```bash
"Hello World!"
```

## Dependencies

Before diving into the code, it's essential to understand the dependencies used in this program:

- `tokio`: Tokio is an asynchronous runtime for the Rust programming language
- `actix` and `actix-web`: A popular Rust web framework for building HTTP servers.
- `chrono`: A crate for working with date and time.
- `serde` and `serde_json`: A serialization/deserialization library for Rust.
- `std::process`: Provides functionality for interacting with external processes.

```toml
[package]
name = "api_spawn"
version = "0.1.0"
edition = "2021"

# See more keys and their definitions at https://doc.rust-lang.org/cargo/reference/manifest.html

[dependencies]
actix = "0.13.1"
actix-web = "4.4.0"
tokio = { version = "1.32.0", features = ["full"] }
serde = { version = "1.0.188", features = ["derive"]}
serde_json = "1.0.107"
chrono = { version = "0.4.31"}
```

## Program Structure

The program follows a standard Rust structure, with a `main` function as the entry point. Let's go through the code step by step.

### Main Function

The `main` function is the entry point of the program. Here's an overview of what it does:

```rust
#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // Shared state to pass to the HTTP server
    let mut shared_data: Arc<Mutex<Vec<(String, String, String)>>> = Arc::new(Mutex::new(Vec::new()));

    // Start the HTTP server
    HttpServer::new(move || {
        // Move a clone of the shared state into the HTTP server closure
        let shared_data = shared_data.clone();
        App::new()
            .app_data(web::Data::new(shared_data))
            .service(execute)
            .service(hello)
            .service(get_data)
            .service(exit)
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}
```

- We create a shared state called `shared_data` using an `Arc` and a `Mutex`. This shared data is a vector of tuples that will store execution results.
- We start the HTTP server using Actix-web. Inside the server configuration, we pass a clone of the `shared_data` to each endpoint's closure, allowing them to access and modify the shared state.

### HTTP Endpoints

#### 1. `GET /hello`

```rust
#[get("/hello")]
async fn hello() -> Result<HttpResponse, actix_web::Error> {
    Ok(HttpResponse::Ok().body("Hello!"))
}
```

This is a simple GET endpoint that returns a "Hello!" message as an HTTP response.

#### 2. `GET /data`

```rust
#[get("/data")]
async fn get_data(
    shared_data: web::Data<Arc<Mutex<Vec<(String, String, String)>>>>
) -> HttpResponse {
    // Lock the shared state
    let shared_data = shared_data.lock().unwrap();
    
    let messages_vec = TextMessageVec{messages_vec: shared_data.clone()};

    // Return the data
    HttpResponse::Ok().json(messages_vec)
}
```

This GET endpoint retrieves data from the shared state. It locks the shared state, creates a JSON response containing the data, and sends it back to the client.

#### 3. `POST /execute`

```rust
#[post("/execute")]
async fn execute(
    payload: web::Json<TextMessage>,
    shared_data: web::Data<Arc<Mutex<Vec<(String, String, String)>>>>
) -> HttpResponse {
    let time_now = Utc::now().format("%Y-%m-%d %H:%M:%S").to_string();

    println!("[POST] /execute: {:?}", payload.text);
    // Lock the shared state
    let mut shared_data = shared_data.lock().unwrap();

    // Start the external program; must be mutable
    let mut ext_program = Command::new("python")
        .arg("in_n_out.py")
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .spawn()
        .expect("Failed to start external program");

    // Send data to the child's stdin
    if let Some(mut stdin) = ext_program.stdin.take() {
        stdin.write_all(payload.text.as_bytes()).expect("Failed to write to stdin");
    }

    // Read data from the child's stdout
    let mut output_data = Vec::new();
    if let Some(mut stdout) = ext_program.stdout.take() {
        stdout.read_to_end(&mut output_data).expect("Failed to read from stdout");
    }

    let output_str = String::from_utf8_lossy(&output_data).to_string();
    
    // Store the data in the shared state
    shared_data.push((time_now, payload.text.clone(), output_str.clone()));

    // Check if the command was successful
    let status = ext_program.wait().expect("Failed to wait for child process");

    // Check if the command was successful
    if status.success() {
        HttpResponse::Ok().json(output_str)
    } else {
        HttpResponse::InternalServerError().body("Command error")
    }
}
```

This POST endpoint is the core of the program. It does the following:

- Formats the current time.
- Spawns an external Python program (`in_n_out.py`) as a child process.
- Writes the payload text to the child process's stdin.
- Reads the output from the child process's stdout.
- Stores the execution result in the shared state.
- Responds with the execution result if successful or an error message if the command fails.

#### 4. `POST /exit`

```rust
#[post("/exit")]
async fn exit() -> HttpResponse {
    println!("Shutting down the server...");
    
    // Shuts down server after 2 seconds
    tokio::spawn(async move {
        tokio::time::sleep(Duration::from_secs(2)).await;
        std::process::exit(0);
    });

    // Return a shutdown message to the client
    HttpResponse::Ok().body("Server is shutting down...")
}
```

This `POST` endpoint initiates a graceful shutdown of the server. It prints a message and schedules the server to shut down after a 2-second delay using Tokio. Finally, it responds with a message indicating that the server is shutting down.

##### Example
Gracefully shutdown server.

**Input:**
```bash
curl -X POST http://127.0.0.1:8080/exit
```

**Output:**
```bash
Server is shutting down...
```

## Conclusion

This Rust program demonstrates how to expose an existing CLI tool via a REST API using the Actix-web framework. It showcases Rust's capabilities in handling HTTP requests, managing shared state, and interacting with external processes. By understanding the code snippets and their functionality, you can build similar projects to expose command-line functionality through APIs in a secure and efficient