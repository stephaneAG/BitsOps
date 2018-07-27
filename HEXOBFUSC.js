/*
    Having a little fun encoding / decoding 3 letters from & to hex/rgb & using a random letter dic idx offset ;P
*/

//var myArr = ['A', 'B', 'C', 'D']
var myDic = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''); // 38 chars, idx [0..37]

// offset arry to easily decode 3-bytes chunks
var offsetArr = function(arr, offset){
  var tmpArr = arr.slice();
  for(var i=0; i < offset; i++){
    var off = tmpArr.shift();
    tmpArr.push(off);
  }
  return tmpArr;
}
offsetArr(myDic, 10);

// encoding 3 letters:
// - get random offset [0..37]
// - offset array by that offset to get tmp array for those 3 letters
// - get bits corresponding to first letter index in offset-ed array
// - get bits corresponding to second letter index in offset-ed array
// - get bits corresponding to third letter index in offset-ed array
// - get bits corresponding to random offset
// - split random offset bits in 3 chunks
// - prepend each of the random offset bits chunks to each of the letters bits
// - output as three hex OR as a rgb value

// decoding 3 letters:
// - get hex string
// - split in 3 chunks of 2 hex chars
// - get their bits
// - extract 2 first bits from each to build up the offset index
// - offset array by that offset to get tmp array for those 3 letters
// - clean bits corresponding to first letter offset-ed index in array
// - clean bits corresponding to first letter offset-ed index in array
// - clean bits corresponding to first letter offset-ed index in array
// - get first letter by using its index in offset-ed array
// - get second letter by using its index in offset-ed array
// - get third letter by using its index in offset-ed array


// helper - to get a random inclusive number within a particular range
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// helper - 
function intToAscii(intCode)
{
    return myDic[intCode];
}

function asciiToInt(asciiChar){
  return myDic.join('').indexOf(asciiChar);
}

// helper - to better see bits lying within ..
var logBits = function(num, showHex){
  var numBits = num.toString(2);
  //var prefixLen = 8 - numBits;
  var prefixStr = '';
  //console.log(8 - numBits.length);
  for(var i=0; i< 8 - numBits.length; i++){ prefixStr +='0'; }
  if(showHex === true) console.log('0b%c' + prefixStr + '%c' + numBits + ' 0x' + num.toString(16), 'color: blue;', 'color: black;');
  else console.log('0b%c' + prefixStr + '%c' + numBits, 'color: blue;', 'color: black;');
}
