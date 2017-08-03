interface String {
    toDashCase():string;
    toHumanReadable():string;
    toCamelCase():string;
}

String.prototype.toDashCase = function() {
 return this.replace(/\.?([A-Z]+)/g, function (x,y){return "-" + y.toLowerCase()}).replace(/^-/, "");
};

String.prototype.toCamelCase = function(){
  return this.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
}

String.prototype.toHumanReadable = function(){
  var cameled = this.toCamelCase();
  var result = cameled.replace( /([A-Z])/g, " $1" );
  return result.charAt(0).toUpperCase() + result.slice(1);
}
