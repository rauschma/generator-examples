
function chain(...generatorFunctions) {
    if (generatorFunctions.length < 1) {
        throw new Error('Need at least 1 argument');
    }
    let generatorObject = generatorFunctions[generatorFunctions.length-1]();
    generatorObject.next();
    for (let i=generatorFunctions.length-2; i >= 0; i--) {
        let generatorFunction = generatorFunctions[i];
        // Link current generator to successor
        generatorObject = generatorFunction(generatorObject);
        // Start the generator
        generatorObject.next();
    }
    return generatorObject;
}

import {createReadStream} from 'fs';

/**
 * Create an asynchronous ReadStream for the file whose name
 * is `fileName` and feed it to the generator object `target`.
 *
 * @see ReadStream https://nodejs.org/api/fs.html#fs_class_fs_readstream
 */
function readFile(fileName, target) {
    let readStream = createReadStream(fileName, { encoding: 'utf8', bufferSize: 1024 });
    readStream.on('data', buffer => {
        let str = buffer.toString('utf8');
        target.next(str);
    });
    readStream.on('end', () => {
        // Signal end of output sequence
        target.return();
    });
}

/**
 * Turns a sequence of text chunks into a sequence of lines
 * (where lines are separated by newlines)
 */
function* splitLines(target) {
    let previous = '';
    try {
        while (true) {
            previous += yield;
            let eolIndex;
            while ((eolIndex = previous.indexOf('\n')) >= 0) {
                let line = previous.slice(0, eolIndex);
                target.next(line);
                previous = previous.slice(eolIndex+1);
            }
        }
    } finally {
        // Handle the end of the input sequence
        // (signaled via `return()`)
        if (previous.length > 0) {
            target.next(previous);
        }
        // Signal end of output sequence
        target.return();
    }
}

/**
 * Prefixes numbers to a sequence of lines
 */
function* numberLines(target) {
    try {
        for (let lineNo = 0; ; lineNo++) {
            let line = yield;
            target.next(`${lineNo}: ${line}`);
        }
    } finally {
        // Signal end of output sequence
        target.return();
    }
}

/**
 * Receives a sequence of lines (without newlines)
 * and logs them (adding newlines).
 */
function* printLines() {
    while (true) {
        let line = yield;
        console.log(line);
    }
}

let fileName = process.argv[2];
readFile(fileName, chain(splitLines, numberLines, printLines));

