# csv-parser-postfix

A program for parsing a given CSV file where each cell is in ​postfix notation

```bash
tsc index.ts
node index.js ./sample.csv
```

## Main

This parser uses only one iteration and don't use any external library. Complexity is O(N + M) where N - CSV file length and M - the amount of links (a1, b3, ...)

## Test

```bash
npm test
```

## Input

- Correct CSV format
- The column may be `a-z`
- doesn't support `\r` symbol (windows)

## Example

**input** (cells are in postfix format)

```csv
b1 b2 +,2 b2 3 * -,3 ,+
a1,5 ,,7 2/
c2 3*,1 2 , ,5 1 2+4*+3-
```

**output**

```csv
-8,-13,3,#ERR
-8,5,0,5
0,#ERR,0,14
```
