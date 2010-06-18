goog.provide('jchemhub.exports');

jchemhub.exportSymbol = goog.exportSymbol;

jchemhub._class = function(name, obj) {
    jchemhub.exportSymbol(name, obj);
    this.name = name;
};

jchemhub._class.prototype.add = function(name, obj) {
    jchemhub.exportSymbol(this.name + '.prototype.' + name, obj);
    return this;
};

jchemhub._class.prototype.addStatic = function(name, obj) {
    jchemhub.exportSymbol(this.name + '.' + name, obj);
    return this;
};

jchemhub.exportClass = function(name, obj) {
    return new jchemhub._class(name, obj);    
};
