<center>

This is it. This is my personal website


![stack](https://www.jer.cx/public/stack.png)

</center>

The site is roughly 1,800 lines of code at the moment.


![wc](https://www.jer.cx/public/wc.png)


And there are 137 views.


![view-count](https://www.jer.cx/public/view_count.png)


The backend was built with the help of the _increadible_
[__RocketRS__](https://rocket.rs/)
web framework and the absolutely remarkable
[__DieselRS__](http://diesel.rs/)
ORM.

The following example demonstrates Rocket's declarative request serialization.
`/pasta/<name..>` indicates to Rocket that the following function contains a parameter
called `name`.

_Now_, if the `name` parameter of the function implements the trait
`rocket::request::FromParam`, the moment a request is made to `/pasta/<name..>`,
the `name` segment of the URL will be passed to _that_ function(given the result
from the `FromParam` implementation).

![rocket](https://www.jer.cx/public/rocket.png)


There is also [Serde](https://serde.rs/), which provides elegant means for serializing
and deserializing data structures.

The following example demonstrates the synergy between Rust, the Rust standard library,
Rocket and Serde.

![serde](https://www.jer.cx/public/serde.png)
