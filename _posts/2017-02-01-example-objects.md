---
title:  "Example Objects"
date:   2017-02-01 22:30:00
categories: objects
---

### Code

{% highlight c %}

static void asyncEnabled(Dict* args, void* vAdmin, String* txid, struct Allocator* requestAlloc)
{
    struct Admin* admin = Identity_check((struct Admin*) vAdmin);
    int64_t enabled = admin->asyncEnabled;
    Dict d = Dict_CONST(String_CONST("asyncEnabled"), Int_OBJ(enabled), NULL);
    Admin_sendMessage(&d, txid, admin);
}

{% endhighlight %}


### Quote

> They who can give up essential liberty to obtain a little temporary safety, deserve neither liberty nor safety.
> 
> _Benjamin Franklin_

### Table

| First Header | Second Header | Third Header   | Fourth Header |
|--------------|---------------|----------------|---------------|
| First Entry  | Second Entry  | Third Entry    | Fourth Entry  |
| Fifth Entry  | Sixth Entry   | Seventh Entry  | Eight Entry   |
| Ninth Entry  | Tenth Entry   | Eleventh Entry | Twelfth Entry |

### Image

![subtle swirly bokeh in the background](https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Photography_by_Victor_Albert_Grigas_%281919-2017%29_000172050002_%2837159721864%29.jpg/1039px-Photography_by_Victor_Albert_Grigas_%281919-2017%29_000172050002_%2837159721864%29.jpg)

