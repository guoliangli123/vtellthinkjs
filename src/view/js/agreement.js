var _ = require('lodash');

import $ from "jquery";


let a = _.chunk(['a', 'b', 'c', 'd'], 2);

console.log($('body'));
console.log('success');
console.log(a);