module.exports = {
   replacement: '_',  // replace spaces with replacement character
   lower: true,
   remove: /[*+~.()'"!:@]/g,
   strict: false,     // strip special characters except replacement, defaults to `false`
}