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
// generate three letters chunk
var genThreeLettersChunk = function(threeCharsChunk, arr){
  var charsArr = threeCharsChunk.split('').splice(0, 3); // delete anything after 3rd char
  
  // get mapping idx's
  var firstLetterBin = asciiToInt(charsArr[0]);
  var secondLetterBin = asciiToInt(charsArr[1]);
  var thirdLetterBin = asciiToInt(charsArr[2]);
  var randomOffsetBin = getRandomInt(0, 36);
  
  // process
  var randomOffset1stChunk = randomOffsetBin >> 4; // discard the four last bits ( aka get 2 first bits )
  var randomOffset2ndChunk = ( randomOffsetBin & 0b001100 ) >> 2; // discard the two last bits & two first bits
  var randomOffset3rdChunk = randomOffsetBin & 0b000011; // gets only the two last bits  

  // build
  var firstByte = (randomOffset1stChunk << 6 ) | firstLetterBin;
  var secondByte = (randomOffset1stChunk << 6) | secondLetterBin;
  var thirdByte = (randomOffset1stChunk << 6) | thirdLetterBin;
  
  // post-proc
  //var firstByteHex = firstByte.toString(16);
  //var secondByteHex = secondByte.toString(16);
  var firstByteHex = (firstByte.toString(16).length == 2 )? firstByte.toString(16) : '0' + firstByte.toString(16);
  var secondByteHex = (secondByte.toString(16).length == 2) ? secondByte.toString(16) : '0' + secondByte.toString(16);
  var thirdByteHex = (thirdByte.toString(16).length == 2) ? thirdByte.toString(16) : '0' + thirdByte.toString(16);
  
  // return hex's
  if(arr === true) return['0x' + firstByteHex, '0x' + secondByteHex, '0x' + thirdByteHex];
  else return '0x' + firstByteHex + ' 0x' + secondByteHex + ' 0x' + thirdByteHex;
}

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

//["0x1d", "0x0e", "0x0f"]
//["0x5d", "0x4e", "0x4f"]
//["0x9d", "0x8e", "0x8f"]
/*
hexToRgb( ["0x1d", "0x0e", "0x0f"], true )
//> "rgb(29,14,15)"
hexToRgb( ["0x5d", "0x4e", "0x4f"], true )
//>"rgb(93,78,79)"
hexToRgb( ["0x9d", "0x8e", "0x8f"], true )
//>"rgb(157,142,143)"
*/
// R: we could also strip the '0x' & instad prefix the whole 3 rgb by '#' :)
var hexToRgb = function(hexArr, rgbStr){
  if (rgbStr == true) return 'rgb(' + Number(hexArr[0]) + ',' + Number(hexArr[1]) + ',' + Number(hexArr[2]) + ')';
  else return {r: Number(hexArr[0]), g: Number(hexArr[1]), b: Number(hexArr[2]) };
}
/*  Usage:
hexToRgb( genThreeLettersChunk('TEF', true) )
//> {r: 29, g: 14, b: 15}

hexToRgb( genThreeLettersChunk('TEF', true), true )
//> "rgb(93,78,79)"
*/
