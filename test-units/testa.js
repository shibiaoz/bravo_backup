function a () {
    this.name = 'ss';
}
a.prototype.test0 = function() {
    console.log('test0');
}
a.test1 = function() {
    console.log('test1');
}
a.test2 = function (aa) {
    //console.log(arguments);
    //console.log(arguments.callee.caller.toString());
    a.test1();
    console.log('test2');
}
module.exports = a;
