var path = require('path'),
    sassTrue = require('sass-true');

var testFile = path.join(__dirname, 'test.scss');
sassTrue.runSass({file: testFile}, describe, it);
