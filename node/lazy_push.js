/**
 * Returns a function that, when called,
 * returns a generator object that is immediately
 * ready for input via `next()`
 */
function coroutine(generatorFunction) {
    return function (...args) {
        let generatorObject = generatorFunction(...args);
        generatorObject.next();
        return generatorObject;
    };
}

//-------------- Step 1

/**
 * Receives a sequence of characters (via the generator object
 * method `next()`), groups them into words and pushes them
 * into the generatory `receiver`.
 */
const tokenize = coroutine(function* (receiver) {
    try {
        while (true) { // (A)
            let ch = yield; // (B)
            if (isWordChar(ch)) {
                // A word has started
                let word = '';
                try {
                    do {
                        word += ch;
                        ch = yield; // (C)
                    } while (isWordChar(ch));
                } finally {
                    // The word is finished.
                    // We get here if
                    // - the loop terminates normally
                    // - the loop is terminated via `return()` in line C
                    receiver.next(word);
                }
            }
            // Ignore all other characters
        }
    } finally {
        // We only get here if the infinite loop is terminated
        // via `return()` (in line B or C).
        // Forward `return()` to `receiver` so that it is also
        // aware of the end of stream.
        receiver.return();
    }
});

function isWordChar(ch) {
    return /^[A-Za-z0-9]$/.test(ch);
}

//-------------- Step 2

/**
 * Receives a sequence of Strings (via the generator object
 * method `next()`) and pushes only those Strings to the generator
 * `receiver` that are “numbers” (consist only of decimal digits).
 */
const extractNumbers = coroutine(function* (receiver) {
    try {
        while (true) {
            let word = yield;
            if (/^[0-9]+$/.test(word)) {
                receiver.next(Number(word));
            }
        }
    } finally {
        // Only reached via `return()`, forward.
        receiver.return();
    }
});

//-------------- Step 3

/**
 * Receives a sequence of numbers (via the generator object
 * method `next()`). For each number, it pushes the total sum
 * so far to the generator `receiver`.
 */
const addNumbers = coroutine(function* (receiver) {
    let sum = 0;
    try {
        while (true) {
            sum += yield;
            receiver.next(sum);
        }
    } finally {
        // We received an end-of-stream
        receiver.return(); // signal end of stream
    }
});

//-------------- Push the input into a chain of generators

/**
 * Pushes the items of `iterable` into `receiver`, a generator.
 * It uses the generator method `next()` to do so.
 */
function send(iterable, receiver, {log = false} = {}) {
    for (let x of iterable) {
        if (log) {
            console.log(x);
        }
        receiver.next(x);
    }
    receiver.return(); // signal end of stream
}

/**
 * This generator logs everything that it receives via `next()`.
 */
const logItems = coroutine(function* ({prefix = ''} = {}) {
    try {
        while (true) {
            let item = yield; // receive item via `next()`
            console.log(prefix + item);
        }
    } finally {
        console.log('DONE');
    }
});

const INPUT = '2 apples and 5 oranges.';
const CHAIN = tokenize(extractNumbers(addNumbers(logItems())));
send(INPUT, CHAIN);

// Output
// 2
// 7
// DONE

//-------------- Examine the laziness

const CHAIN2 = tokenize(extractNumbers(addNumbers(logItems({ prefix: '-> ' }))));
send(INPUT, CHAIN2, { log: true });

// Output
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
// DONE
