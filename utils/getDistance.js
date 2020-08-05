const Distance = require('geo-distance');
module.exports = (from,to)=>Distance.between(from,to).human_readable();