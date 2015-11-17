if (!String.prototype.startsWith instanceof Function) {
    String.prototype.startsWith = function(str) {
        return this.slice(0, str.length) === str;
    };
}
