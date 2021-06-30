npm i -g 6turtles

command line usage : 6t filename

My submission for the jam

Sorry if it isn't very detailed but I am in a rush

My language is named 6 turtles, it uses a base 6 numeric system 
where
```
T = 0, u = 1, r = 2, t = 3, l = 4, e = 5
```

You can declare vars by doing 

```
IDENTIFIER (in caps and can only contain letters except T and U) is value
```

The 2 primitive types are 
``` 
    '"Turtlei1"' and can only contain those letters
    numbers for example : eurl
```

Turtle expressions :
```
🐢value sign value🐢
```

The available signs :

U = division

s = multiplication

the :heavy_plus_sign: emoji addition

the :heavy_minus_sign:  emoji means substract

the :thumbsdown: emoji decreases the ascii value of an entire string,

the :thumbsup: emoji increments the ascii value of an entire string,

so exu means 5 / 1

Call a function,

```
FUNCTION wake up! (option : with value and value in mind) (option: until condition) 🐢
```

declare a function,
```
FUNCTIONNAME is normal(
  function body
)
```

Conditions :
```
 value equals expression
```
```
not condition ( equivalent of ! condition in js)
```

Silly syntax example :

```
S is e

S is 🐢SUS🐢
```

Example countdown program : 

```
INDEX is Turtle

CONDOWN is normal (
  PRIN wake up! with INDEX in mind 🐢
  INDEX ➖➖
)

CONDOWN wake up! until not INDEX equals T 🐢
PRIN wake up! with A in mind 🐢
```