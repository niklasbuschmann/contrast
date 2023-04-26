---
title: Zig and CLAP plugin - Part 1
layout: post
categories: audio
---

## Zig and CLAP, what are we talking about

Directly from [zilang homepage](https://ziglang.org), we read that 

> Zig is a general purpose programming language and toolchain for maintaining robust, optimal and reusable software.

[CLAP](https://github.com/free-audio/clap) - CLever Audio Plugin - is a new audio plugin standard that, on top of its cool features, it's open source and liberally licensed.

## Get started

We get a copy of the CLAP client repository 

```
git clone git@github.com:free-audio/clap.git
```

In this repo, we are only interested in the `include/clap/clap.h` header file, that contains all the `C` interfaces to build a CLAP plugin.

Out goal is to read this header file and provide a minimal implementation of the core functionality of a plugin.

To keep the example at the absolute bare minimum, we are going to create a plugin that output a constant sine wave at a fixed frequency.

Right now, we are just interested in building a plugin with Zig, later on we will expand and explore the CLAP features.

A CLAP plugin, from a coding prospective, is nothing more than a dynamic library; so let's initialize a zig library with

```
zig init-lib
```

This command will generate `build.zig` and `src/main.zig` files. BTW, if you poke your head inside `build.zig` you'll notice one of the cool feature of Zig: build instruction are written in Zig itself.

To build the library, we just launch

```
zig build
```

Up to now, CLAP and Zig are not interacting, let's change this.

## Bring CLAP definition within Zig

In our `build.zig` we want to include our CLAP definitions, using the following line:
```zig
lib.addIncludePath("src/clap/include/clap");
```

Now, this is our new `build.zig`:

```zig
const std = @import("std");

pub fn build(b: *std.build.Builder) void {
    // Standard release options allow the person running `zig build` to select
    // between Debug, ReleaseSafe, ReleaseFast, and ReleaseSmall.
    const mode = b.standardReleaseOptions();

    const lib = b.addStaticLibrary("zig-clap-example", "src/main.zig");
    lib.setBuildMode(mode);
    lib.install();
    lib.addIncludePath("src/clap/include/clap");

    const main_tests = b.addTest("src/main.zig");
    main_tests.setBuildMode(mode);

    const test_step = b.step("test", "Run library tests");
    test_step.dependOn(&main_tests.step);
}
```

We are now able to import `clap.h` in `main.zig` using 

```
const clap = @cImport({
    @cInclude("clap.h");
});
```
That's it, simple as it gets, we just added all the CLAP definition that are needed to make our plugin.

## Interfacing with CLAP

Taking a look at the CLAP source code, we need to implement and expose the following structure:

```c
typedef struct clap_plugin_entry {
   clap_version_t clap_version; // initialized to CLAP_VERSION

   // This function must be called first, and can only be called once.
   //
   // It should be as fast as possible, in order to perform a very quick scan of the plugin
   // descriptors.
   //
   // It is forbidden to display graphical user interface in this call.
   // It is forbidden to perform user interaction in this call.
   //
   // If the initialization depends upon expensive computation, maybe try to do them ahead of time
   // and cache the result.
   //
   // If init() returns false, then the host must not call deinit() nor any other clap
   // related symbols from the DSO.
   bool(CLAP_ABI *init)(const char *plugin_path);

   // No more calls into the DSO must be made after calling deinit().
   void(CLAP_ABI *deinit)(void);

   // Get the pointer to a factory. See factory/plugin-factory.h for an example.
   //
   // Returns null if the factory is not provided.
   // The returned pointer must *not* be freed by the caller.
   const void *(CLAP_ABI *get_factory)(const char *factory_id);
} clap_plugin_entry_t;
```

Does it means we have to translate every line of the previous snippet in Zig? 
No, we can hack our way out of this by re-building the plugin with `zig build` and poke our head inside the directory `zig-cache`.

After some crawling around, we find out what Zig generated when reading our C code:

```zig
pub const struct_clap_plugin_entry = extern struct {
    clap_version: clap_version_t,
    init: ?*const fn ([*c]const u8) callconv(.C) bool,
    deinit: ?*const fn () callconv(.C) void,
    get_factory: ?*const fn ([*c]const u8) callconv(.C) ?*const anyopaque,
};
pub const clap_plugin_entry_t = struct_clap_plugin_entry;
```

Well, now we know what we should implement in Zig to bring the plugin to life.

Let's find out `clap_version_t` type as well

```zig
pub const struct_clap_version = extern struct {
    major: u32,
    minor: u32,
    revision: u32,
};
pub const clap_version_t = struct_clap_version;
```

It 's now time to start writing some Zig code!
