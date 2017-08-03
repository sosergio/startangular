interface Array<T> {
  groupBy(key: any): any;
  indexOfItemWithAttr(attr: any, value: any): any;
  move(oldIndex: number, newIndex: number);
  orderBy(prop:string, asc:boolean);
}

Array.prototype.groupBy = function (key) {
  return this.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

Array.prototype.indexOfItemWithAttr = function (attr, value) {
  for (var i = 0; i < this.length; i += 1) {
    if (this[i][attr] === value) {
      return i;
    }
  }
  return -1;
}

Array.prototype.move = function (old_index, new_index) {
  if (new_index >= this.length) {
    var k = new_index - this.length;
    while ((k--) + 1) {
      this.push(undefined);
    }
  }
  this.splice(new_index, 0, this.splice(old_index, 1)[0]);
  return this; // for testing purposes
};

Array.prototype.indexOfItemWithAttr = function (attr, value) {
  for (var i = 0; i < this.length; i += 1) {
    if (this[i][attr] === value) {
      return i;
    }
  }
  return -1;
}

Array.prototype.orderBy = function(prop, asc) {
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


