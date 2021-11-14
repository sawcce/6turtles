# Installing

```
npm i -g 6turtles
```

# Basics

## Numeral system

6turtles uses a base 6 numeral system where each character of the word Turtle is a numeral

```
T = 0, u = 1, r = 2, t = 3, l = 4, e = 5
```
## Variables

Variables can be declared with the following syntax:

```
IDENTIFIER is value
```

The indentifier must match this specific regex : `([A-SV-Z])+`,  
meaning it can contain any upper case letter except T and U

## Primitives

The two primitive types are the string and the number.

### Strings 

Strings can be declared using the following syntax:

```
IDENTIFIER is '"Turtlei1"'
```

And can only contain the characters T,u,r,t,l,e,i,1

(note that in that case you can put anything in the string that matches these characters and any quantity of them)

### Numbers

Numbers can be declared using the following syntax:

```
IDENTIFIER is Number
```

Where number is a Valid 6turtles base-6 number like ``eurl`` or ``luT``


## Complex types

### Turtle expression

A turtle expression is a way to modify a value with another

``🐢expression operand expression🐢``

The different operands are:
* U = division
* s = multiplication
* the ➕ emoji = addition
* the ➖ emoji = substraction
* the 👎 emoji = decreases the ascii value of an entire string
* the 👍 emoji = increases the ascii value of an entire string

so ```🐢eUx🐢``` means 5 / 1

## Functions

### Basic Call
To call a function:

```
FUNCTION wake up! 🐢
```

### Argumented Call

To pass it an argument:

```
FUNCTION wake up! with value in mind🐢
```

To pass it an arguments:

```
FUNCTION wake up! with value and value in mind🐢
```

Where value is either a string, a number or a variable

### Conditional Call

```
This will run a function until the given condition is false
FUNCTION wake up! until condition🐢
```

### Conditions

#### Equals
```
 value equals expression
```

#### Not

This syntax is the equivalent of the ! operator in js (it makes false true and true false)

```
not condition
```

### Combining both

If you want to use arguments and a condition, use this order:

```
FUNCTION wake up! ARGS UNTIL🐢
```
