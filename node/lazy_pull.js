//-------------- Step 1

/**
 * Returns an iterable that transforms the input sequence
 * of characters into an output sequence of words.
 */
function* tokenize(chars) {
    let iterator = chars[Symbol.iterator]();
    let ch;
    do {
        ch = getNextItem(iterator);
        if (isWordChar(ch)) {
            let word = '';
            do {
                word += ch;
                ch = getNextItem(iterator);
            } while (isWordChar(ch));
            yield word;
        }
        // Ignore all other characters
    } while (ch !== END_OF_SEQUENCE);
}
const END_OF_SEQUENCE = Symbol();
function getNextItem(iterator) {
    let {value,done} = iterator.next();
    return done ? END_OF_SEQUENCE : value;
}
function isWordChar(ch) {
    return typeof ch === 'string' && /^[A-Za-z0-9]$/.test(ch);
}

//-------------- Step 2

/**
 * Returns an iterable that filters the input sequence
 * of words and only yields those that are numbers.
 */
function* extractNumbers(words) {
    for (let word of words) {
        if (/^[0-9]+$/.test(word)) {
            yield Number(word);
        }
    }
}

//-------------- Step 3

/**
 * Returns an iterable that contains, for each number in
 * `numbers`, the total sum of numbers encountered so far.
 * For example: 7, 4, -1 --> 7, 11, 10
 */
function* summarize(numbers) {
    let result = 0;
    for (let n of numbers) {
        result += n;
        yield result;
    }
}

//-------------- Pull the output

const CHARS = '2 apples and 5 oranges.';
const CHAIN = summarize(extractNumbers(tokenize(CHARS)));
console.log([...CHAIN]);

// Output:
// [ 2, 7 ]

//-------------- Examine the laziness

function* logAndYield(iterable, prefix='') {
    for (let item of iterable) {
        console.log(prefix + item);
        yield item;
    }
}

const CHAIN2 = logAndYield(summarize(extractNumbers(tokenize(logAndYield(CHARS)))), '-> ');
[...CHAIN2];

// Output:
// 2
//  
// -> 2
// a
// p
// p
// l
// e
// s
//  
// a
// n
// d
//  
// 5
//  
// -> 7
// o
// r
// a
// n
// g
// e
// s
// .
