function TestClass () {
    this.name = 'aa';
    this.id = '2323';
}
TestClass.prototype.test  = function  () {
    for (var key in this) {
        console.log(key);
    }
}
TestClass.prototype.testb  = function  () {
    var ownPropery = {};
    // 取到instance 的属性
    for (var key in this) {
        if (this.hasOwnProperty(key)) {
            console.log(key);
            ownPropery[key] = this[key];
        }
    }
    return ownPropery;
}
var aa =  new TestClass();
aa['email'] = 'aa@qq.com';
aa.testb();
