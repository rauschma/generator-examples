import {readFile} from 'fs';

let fileNames = process.argv.slice(2);

run(function* () {
    let next = yield;
    for (let f of fileNames) {
        let contents = yield readFile(f, { encoding: 'utf8' }, next);
        console.log('##### '+f);
        console.log(contents);
    }
});

function run(generatorFunction) {
    let generatorObject = generatorFunction();

    // Step 1: Proceed to first `yield`
    generatorObject.next();

    // Step 2: Pass in a function that the generator can use as a callback
    function nextFunction(error, result) {
        if (error) {
            generatorObject.throw(error);
        } else {
            generatorObject.next(result);
        }
    }
    generatorObject.next(nextFunction);

    // Subsequent invocations of `next()` are triggered by `nextFunction`
}
