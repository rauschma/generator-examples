require('isomorphic-fetch'); // polyfill
let co = require('co');

function read(url) {
    return fetch(url)
        .then(request => request.text());
}

co(function* () {
    try {
        let [croftStr, bondStr] = yield Promise.all([
            read('http://localhost:8000/croft.json'),
            read('http://localhost:8000/bond.json'),
        ]);
        let croftJson = JSON.parse(croftStr);
        let bondJson = JSON.parse(bondStr);

        console.log(croftJson);
        console.log(bondJson);
    } catch (e) {
        console.log('Failure to read: ' + e);
    }
});
