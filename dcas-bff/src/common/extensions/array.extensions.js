
Object.prototype.isArray = function(){
  return Object.prototype.toString.call( this ) === '[object Array]';
}

Object.prototype.groupBy = function (key) {
  if(!this.isArray()){
    throw new Error(`groupBy function invoked on not an array`);
  }
  return this.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

Object.prototype.indexOfItemWithAttr = function (attr, value) {
  if(!this.isArray()){
    throw new Error(`indexOfItemWithAttr function invoked on not an array`);
  }
  for (var i = 0; i < this.length; i += 1) {
    if (this[i][attr] === value) {
      return i;
    }
  }
  return -1;
}

Object.prototype.move = function (old_index, new_index) {
  if(!this.isArray()){
    throw new Error(`move function invoked on not an array`);
  }
  if (new_index >= this.length) {
    var k = new_index - this.length;
    while ((k--) + 1) {
      this.push(undefined);
    }
  }
  this.splice(new_index, 0, this.splice(old_index, 1)[0]);
  return this; // for testing purposes
};

Object.prototype.orderBy = function(prop, asc) {
  if(!this.isArray()){
    throw new Error(`orderBy function invoked on not an array`);
  }
  return this.sort(
    function (a, b) {
      if (a[prop] > b[prop]) {
        return asc?1:-1;
      } else if (a[prop] < b[prop]) {
        return asc?-1:1;
      }
      return 0;
    });
}


