goog.provide('kemia.exports');

kemia.exportSymbol = goog.exportSymbol;

kemia._class = function(name, obj) {
    kemia.exportSymbol(name, obj);
    this.name = name;
};

kemia._class.prototype.add = function(name, obj) {
    kemia.exportSymbol(this.name + '.prototype.' + name, obj);
    return this;
};

kemia._class.prototype.addStatic = function(name, obj) {
    kemia.exportSymbol(this.name + '.' + name, obj);
    return this;
};

kemia.exportClass = function(name, obj) {
    return new kemia._class(name, obj);    
};
