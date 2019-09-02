String.prototype.toProperCase = function () {
  return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

function uuid() {
  var d = new Date().getTime()
  if (window.performance && typeof window.performance.now === 'function') { d += performance.now() }
  var uid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(v) {
    var r = (d + Math.random() * 16) % 16 | 0
        d = Math.floor(d / 16)
    return (v == 'x' ? r : ( r&0x3|0x8)).toString(16)
  })
  return uid
}

function uniarr(arr) {
  var a = arr.concat()
  for (var i = 0; i < a.length; ++i) {
    for (var j = i+1; j < a.length; ++j) {
      if (a[i] === a[j]) { a.splice(j--, 1) }
    }
  }
  return a
}

function sort_by(field, reverse, primer) {
  var key = primer ? function(x) { return primer(x[field]) } : function(x) { return x[field] }
  reverse = [-1, 1][+!!reverse]
  return function(a, b) {
    a = key(a)
    b = key(b)
    return a == b ? 0 : reverse * ((a > b) - (b > a))
  }
}
 
function chainsort(arr) {
  return function(a, b) {
    for (var i = 0; i < arr.length; i++) {
      var r = arr[i](a, b)
      if (r != 0) { return r }
    }
    return 0
  }
}

function comma(x) {
  var parts = x.toString().split('.')
  parts[0]  = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g,',')
  return parts.join('.')
} 

function clone(obj) {
  var copy
  if (null == obj || 'object' != typeof obj) { return obj }
  if (obj instanceof Date) {
    copy = new Date()
    copy.setTime(obj.getTime())
    return copy
  }
  if (obj instanceof Array) {
    copy = []
    for (var i = 0; i < obj.length; i++) { copy[i] = clone(obj[i]) }
    return copy
  }
  if (obj instanceof Object) {
    copy = {}
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) { copy[attr] = clone( obj[attr] ) }
    }
    return copy
  }
  throw new Error('Unable to copy obj! Type not supported.')
}

function round(num, scale) {
  if (!('' + num).includes('e')) {
    return + (Math.round(num + 'e+' + scale) + 'e-' + scale)
  } else {
    var arr = ('' + num).split('e')
    var sig = ''
    if (+arr[1] + scale > 0) { sig = '+' }
    return + (Math.round(+arr[0] + 'e' + sig + (+arr[1] + scale)) + 'e-' + scale) 
  } 
}

function lpad(str, len, ch) {
  if (typeof str == 'number') { str = str.toString() }
  if (ch == null) { ch = ' ' }
  var r = len - str.length
  if (r < 0) { r = 0 }
  return ch.repeat(r) + str
}

function rpad(str, len, ch) {
  if (typeof str == 'number') { str = str.toString() }
  if (ch == null) { ch = ' ' }
  var r = len - str.length
  if (r < 0) { r = 0 }
  return str + ch.repeat(r)
}

function rkey(arr, v) {
  for (var prop in arr) {
    if (arr.hasOwnProperty(prop)) {
      if (arr[prop] === v) { return prop }
    }
  }
}

// https://stackoverflow.com/a/15106541
function randomProperty(obj) {
  var keys = Object.keys(obj)
  var key  = keys[ keys.length * Math.random() << 0]
  return [obj[key], key]
}

function isEmpty(obj) {
  for(var key in obj) { if(obj.hasOwnProperty(key)) { return false } }
  return true
}
