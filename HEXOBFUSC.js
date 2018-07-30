/*
    Having a little fun encoding / decoding 3 letters from & to hex/rgb & using a random letter dic idx offset ;P
    
    Example output for the same input:
    
    Cmd: decodeThreeLettersChunk( genThreeLettersChunk('TEF', false) )
    Outputs:
    randomOffset: 0 => "TEF( offset: TEF )"
    randomOffset: 9 => "K56( offset: TEF )"
    randomOffset: 34 => "VGH( offset: TEF )"
    randomOffset: 3 => "QBC( offset: TEF )"
    ..
    
    Cmd2: decodeThreeLettersChunk( genThreeLettersChunk('TEF', false, 0) ) // last param is the not random offset if passed
    through helper: lookupThreeCharsHexGen('TEF', true) // true for final output logging
    Outputs:
    TEF( offset: TEF )
    SDE( offset: TEF )
    RCD( offset: TEF )
    QBC( offset: TEF )
    PAB( offset: TEF )
    O9A( offset: TEF )
    N89( offset: TEF )
    M78( offset: TEF )
    L67( offset: TEF )
    K56( offset: TEF )
    J45( offset: TEF )
    I34( offset: TEF )
    H23( offset: TEF )
    G12( offset: TEF )
    F01( offset: TEF )
    EZ0( offset: TEF )
    DYZ( offset: TEF )
    CXY( offset: TEF )
    BWX( offset: TEF )
    AVW( offset: TEF )
    9UV( offset: TEF )
    8TU( offset: TEF )
    7ST( offset: TEF )
    6RS( offset: TEF )
    5QR( offset: TEF )
    4PQ( offset: TEF )
    3OP( offset: TEF )
    2NO( offset: TEF )
    1MN( offset: TEF )
    0LM( offset: TEF )
    ZKL( offset: TEF )
    YJK( offset: TEF )
    XIJ( offset: TEF )
    WHI( offset: TEF )
    VGH( offset: TEF )
    UFG( offset: TEF )
    
    Corresponding hexs:
    0x1d 0x0e 0x0f
    0x1c 0x0d 0x4e
    0x1b 0x0c 0x8d
    0x1a 0x0b 0xcc
    0x19 0x4a 0x0b
    0x18 0x49 0x4a
    0x17 0x48 0x89
    0x16 0x47 0xc8
    0x15 0x86 0x07
    0x14 0x85 0x46
    0x13 0x84 0x85
    0x12 0x83 0xc4
    0x11 0xc2 0x03
    0x10 0xc1 0x42
    0x0f 0xc0 0x81
    0x0e 0xe3 0xc0
    0x4d 0x22 0x23
    0x4c 0x21 0x62
    0x4b 0x20 0xa1
    0x4a 0x1f 0xe0
    0x49 0x5e 0x1f
    0x48 0x5d 0x5e
    0x47 0x5c 0x9d
    0x46 0x5b 0xdc
    0x45 0x9a 0x1b
    0x44 0x99 0x5a
    0x43 0x98 0x99
    0x42 0x97 0xd8
    0x41 0xd6 0x17
    0x40 0xd5 0x56
    0x63 0xd4 0x95
    0x62 0xd3 0xd4
    0xa1 0x12 0x13
    0xa0 0x11 0x52
    0x9f 0x10 0x91
    0x9e 0x0f 0xd0
    
    TODOs:
    - write helpers to encode/ decode an entire sentence
    - handle few more characters ( space, dot, equals, minus, plus, divide, multiply, left & right parenthesis/braces/brackets, .. )
    - read input from an image through a canvas to getImgData
    - save output to an image through a canvas &  putImgData
*/

//var myArr = ['A', 'B', 'C', 'D']
//var myDic = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''); // 36 chars, idx [0..35]
// R: max 64 chars possible ( idx [0..63] ), so let's make our dict 64 items
// ( 64 == 0b01000000, 63 == 0b00111111 )
var myDic = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'; // 36 chars
myDic += ' ?.,:;!=-+/*()[]{}<>#"\'\~|^&%' // 28 chars
myDic = myDic.split('');

// helper - split sentence in a 3 chars chunk array
var splitSentenceInTreeCharsChunks = function(sentenceStr){
  var chunks = sentenceStr.match(/.{1,3}/g); // get chunks of 3 chars + reminder chars
  console.log( chunks );
  for(var i=0; i< chunks.length; i++){
    var padding = 3 - chunks[i].length;
    if(padding !== 0){
      if(padding === 1) chunks[i] = chunks[i]+' ';
      if(padding === 2) chunks[i] = chunks[i]+'  ';
    }
  }
  console.log( chunks );
  return chunks;
}

// helper - encode an entire sentence
// Usage: encodeSentence('hello world !')
//> ["0xdd 0x5a 0x21", "0xac 0xaf 0x7b", "0xb6 0xae 0xb1", "0x0c 0x84 0x5b", "0x27 0x22 0xa2"]
var encodeSentence = function(sentence){
  sentence = sentence.toUpperCase();
  var hexChunks = [];
  var strChunks = splitSentenceInTreeCharsChunks(sentence);
  strChunks.forEach(function(strChunk){
    hexChunks.push( genThreeLettersChunk( strChunk ) )
  });
  return hexChunks;
}

// helper - when passed a sentence of hex ( produced by the above fcn ), produces a set of objs with r,g,b values
var sentenceHexToRgb = function(sentenceHexStrArr){
  var rgbsArr = [];
  sentenceHexStrArr.forEach(function(sentenceHexStr){
    var sentenceHexArr = sentenceHexStr.split(' ');
    console.log(sentenceHexArr)
    //sentenceHexArr[0] = Number(sentenceHexArr[0]);
    //sentenceHexArr[1] = Number(sentenceHexArr[1]);
    //sentenceHexArr[2] = Number(sentenceHexArr[2]);
    rgbsArr.push( hexToRgb( [sentenceHexArr[0], sentenceHexArr[1], sentenceHexArr[2]] ) );
  });
  return rgbsArr;
}

// helper - generate a wide 1px tall image with pixel-encoded hex from an array of hexs
var hexToImage = function(seq){
  var rgbSeq = sentenceHexToRgb(seq);

  // == canvas part ==
  //var canvas = document.querySelector('canvas');
  var canvas = document.createElement('canvas'); // offscreen canvas
  canvas.height = 1;
  canvas.width = rgbSeq.length; // number of 3hex chunks or r,g,b objs
  var ctx = canvas.getContext('2d');
  ctx.fillStyle = 'white'; // mandatory !
  ctx.fillRect(0, 0, canvas.width, canvas.height); // mandatory !
  var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  var data = imageData.data;
  for(var i=0, j=0; i < data.length; i+=4, j++) {
    data[i] = rgbSeq[j].r;
    data[i + 1] = rgbSeq[j].g;
    data[i + 2] = rgbSeq[j].b;
  }
  ctx.putImageData(imageData, 0, 0);
  // saving the canvas
  var canvasImg = canvas.toDataURL();
  var newdata = canvasImg.replace(/^data:image\/png/,'data:application/octet-stream');
  //window.open( newdata ); // doesn't allow us to specify a filename
  var link = document.createElement('a');
  link.setAttribute('download', 'output.png');
  link.setAttribute('href', newdata);
  link.click();
}

// helper - returns an array of hexs from an image
var imageToHex = function(img){
  //var rgbSeq = sentenceHexToRgb(seq);

  // == canvas part ==
  //var canvas = document.querySelector('canvas');
  var canvas = document.createElement('canvas'); // offscreen canvas
  canvas.height = img.naturalHeight;
  canvas.width = img.naturalWidth;
  var ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0); // draw img to canvas
  var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  var data = imageData.data;
  var hexsArr = [];
  for(var i=0, j=0; i < data.length; i+=4, j++) {
    hexsArr[j] = rgbToHex( { r: data[i], g: data[i + 1], b: data[i + 2] } );
  }
  return hexsArr;
}

// helper - encodes a sentence to hex & then generate a wide 1px tall image with pixel-encoded hex
var sentenceToImg = function(sentence){
  hexToImage( encodeSentence(sentence) );
}

// helper - decodes an image to hex & then returns the text decoded from the hexs
var imageToSentence = function(img){
  return decodeSentence( imageToHex(img) );
  //console.log( imageToHex(img) )
}

// helper - decode an entire sentence
// Usage: decodeSentence(["0xdd 0x5a 0x21", "0xac 0xaf 0x7b", "0xb6 0xae 0xb1", "0x0c 0x84 0x5b", "0x27 0x22 0xa2"])
//> "HELLO WORLD !"
var decodeSentence = function(sentenceHexs){
  var sentenceChunks = [];
  sentenceHexs.forEach(function(sentenceHex){
    sentenceChunks.push( decodeThreeLettersChunk( sentenceHex, true ) );
  });
  //return sentenceChunks;
  return sentenceChunks.join('').trim();
}

// offset array to easily decode 3-bytes chunks
/*
var offsetArr = function(arr, offset){
  var tmpArr = arr.slice();
  for(var i=0; i < offset; i++){
    var off = tmpArr.shift();
    tmpArr.push(off);
  }
  return tmpArr;
}
*/
var offsetArr = function(arr, offset){
  var tmpArr = arr.slice();
  // i > 0 -> CCW
  if(offset > 0){
    for(var i=0; i < offset; i++){
      var off = tmpArr.shift();
      tmpArr.push(off);
    }
  }
  // i < 0 -> CW
  if(offset < 0){
    for(var i=offset; i < 0; i++){
      var off = tmpArr.pop();
      tmpArr.unshift(off);
    }
  }
  return tmpArr;
}
offsetArr(myDic, 10);

// helper - lookup every possibility of encoding for a three chars chunk
var lookupThreeCharsHexGen = function(threeCharsStr, log){
  var generatedHexStrings = [];
  for(var i=0; i < myDic.length; i++){
    generatedHexStrings.push( decodeThreeLettersChunk( genThreeLettersChunk(threeCharsStr, false, i) ) );
    //console.log(generatedHexStrings[i]);
  }
  if(log == true) generatedHexStrings.forEach(function(genStr){ console.log( genStr ); });
  return generatedHexStrings;
}

// helper - same as the above but spitting out hex
// usage:
// lookupThreeCharsHex('TEF', true, undefined)
//> 0xa0 0x11 0x52 ..
// lookupThreeCharsHex('TEF', true, false)
//> #a11213 ..
// lookupThreeCharsHex('TEF', true, true)
//> ["0x42", "0x97", "0xd8"]
var lookupThreeCharsHex = function(threeCharsStr, log, outputType){
  var generatedHexStrings = [];
  for(var i=0; i < myDic.length; i++){
    generatedHexStrings.push( genThreeLettersChunk(threeCharsStr, outputType, i) );
    //console.log(generatedHexStrings[i]);
  }
  if(log == true) generatedHexStrings.forEach(function(genStr){ console.log( genStr ); });
  return generatedHexStrings;
}

// helper to better visualize the "color-encoding-scheme" corresponding to our stuff
var colorfulLogHex = function(threeCharsChunk){
  var colorHexs = lookupThreeCharsHex(threeCharsChunk, true, false);
  colorHexs.forEach(function(colorHex){
    console.log('%c'+threeCharsChunk, 'color: '+colorHex+';' );
  });
}

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
// ==
// example ouput(s)
// genThreeLettersChunk('TEF')
//> "0x1d 0x0e 0x0f"
// genThreeLettersChunk('TEF', true)
//> ["0x5d", "0x4e", "0x4f"]
// genThreeLettersChunk('TEF', false)
//> "#9d8e8f"
/* == following version doesn't offset stuff ;)
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
  else if(arr === false) return '#' + firstByteHex + secondByteHex + thirdByteHex;
  else return '0x' + firstByteHex + ' 0x' + secondByteHex + ' 0x' + thirdByteHex;
}
*/
//var genThreeLettersChunk = function(threeCharsChunk, arr){
var genThreeLettersChunk = function(threeCharsChunk, arr, offset){
  var charsArr = threeCharsChunk.split('').splice(0, 3); // delete anything after 3rd char
  
  // get mapping idx's
  var firstLetterBin = asciiToInt(charsArr[0]);
  var secondLetterBin = asciiToInt(charsArr[1]);
  var thirdLetterBin = asciiToInt(charsArr[2]);
  //var randomOffsetBin = (offset !== undefined)? offset : getRandomInt(0, 36);
  //var randomOffsetBin = (offset !== undefined)? offset : getRandomInt(1, 36); // little tweak to ALWAYS offset the dic ;)
  var randomOffsetBin = (offset !== undefined)? offset : getRandomInt(1, myDic.length); // now offerinf 63 char offset support ;)
  //randomOffsetBin = 0b00111111; // DEBUG - works ( 0x3f / 63)
  //randomOffsetBin = 0b00111100; // DEBUG - works ( 0x3c / 60 )
  console.log( 'encoding randomOffset: ' + randomOffsetBin );
  logBits(randomOffsetBin, true);
    
  // get offset-ed array
  var offsetedArr = offsetArr(myDic, randomOffsetBin);

  // get offset-ed mapping idx's
  var firstLetterBinO = asciiToInt(charsArr[0], offsetedArr);
  var secondLetterBinO = asciiToInt(charsArr[1], offsetedArr);
  var thirdLetterBinO = asciiToInt(charsArr[2], offsetedArr);
  
  // process
  var randomOffset1stChunk = randomOffsetBin >> 4; // discard the four last bits ( aka get 2 first bits )
  var randomOffset2ndChunk = ( randomOffsetBin & 0b001100 ) >> 2; // discard the two last bits & two first bits
  var randomOffset3rdChunk = randomOffsetBin & 0b000011; // gets only the two last bits
  logBits(randomOffset1stChunk, true);
  logBits(randomOffset2ndChunk, true);
  logBits(randomOffset3rdChunk, true);

  // build
  var firstByte = (randomOffset1stChunk << 6 ) | firstLetterBinO; //firstLetterBin;
  var secondByte = (randomOffset2ndChunk << 6) | secondLetterBinO; //secondLetterBin
  var thirdByte = (randomOffset3rdChunk << 6) | thirdLetterBinO; //thirdLetterBin
  
  // post-proc
  //var firstByteHex = firstByte.toString(16);
  //var secondByteHex = secondByte.toString(16);
  var firstByteHex = (firstByte.toString(16).length == 2 )? firstByte.toString(16) : '0' + firstByte.toString(16);
  var secondByteHex = (secondByte.toString(16).length == 2) ? secondByte.toString(16) : '0' + secondByte.toString(16);
  var thirdByteHex = (thirdByte.toString(16).length == 2) ? thirdByte.toString(16) : '0' + thirdByte.toString(16);
  
  // = DEBUG =
  console.log('== GENERATED ==');
  logBits(firstByte, true);
  logBits(secondByte, true);
  logBits(thirdByte, true);
  
  // return hex's
  if(arr === true) return['0x' + firstByteHex, '0x' + secondByteHex, '0x' + thirdByteHex];
  else if(arr === false) return '#' + firstByteHex + secondByteHex + thirdByteHex;
  else return '0x' + firstByteHex + ' 0x' + secondByteHex + ' 0x' + thirdByteHex;
}

// decoding 3 letters:
// - get hex string OR arr
// - split in 3 chunks of 2 hex chars each
// - get their bits
// - extract 2 first bits from each to build up the offset index
// - offset array by that offset to get tmp array for those 3 letters
// - clean bits corresponding to first letter offset-ed index in array
// - clean bits corresponding to first letter offset-ed index in array
// - clean bits corresponding to first letter offset-ed index in array
// - get first letter by using its index in offset-ed array
// - get second letter by using its index in offset-ed array
// - get third letter by using its index in offset-ed array
/*
decodeThreeLettersChunk('1D0E0F')
decodeThreeLettersChunk('#1D0E0F')
decodeThreeLettersChunk('0x1D 0x0E 0x0F')
decodeThreeLettersChunk(['0x1D', '0x0E', '0x0F'])
*/
var decodeThreeLettersChunk = function(hexStrOrArr){
  var cleanedHex;
  if( Array.isArray(hexStrOrArr) === true ){
    console.log('array');
    // make sure we have an array that has length 3
    if(hexStrOrArr.length !== 3){
      console.log('Hex array doesn\'t contain enough items !');
      return;
    }
    // clean array items ( hex within strings ) if prefixed with '0x'
    var arrayItems = [];
    for(var i=0; i < hexStrOrArr.length; i++){
      arrayItems.push(hexStrOrArr[i].replace(/0x/g, '') );
    }
    // build up cleaned hex str
    cleanedHex = arrayItems.join('');
  }
  else if( typeof hexStrOrArr === 'string' ){
    console.log('string');
    // remove '#' prefix, '0x' & 'space' from string if any
    cleanedHex = hexStrOrArr.replace(/#/g, '').replace(/0x/g, '').replace(/ /g, '');
    // make sure we have a string that is 6 chars long
    if(cleanedHex.length < 6){
      console.log('Hex string doesn\'t contain enough chars !');
      return;
    }
  }
  //  continue ..
  //console.log(cleanedHex);

  // split in 3 chunks of 2 chars each
  var chunks = cleanedHex.match(/.{1,2}/g); // should give us
  console.log(chunks);

  // get their bits
  var firstHexBits = Number( '0x' + chunks[0] );
  var secondHexBits = Number( '0x' + chunks[1] );
  var thirdHexBits = Number( '0x' + chunks[2] );
  logBits(firstHexBits, true);
  logBits(secondHexBits, true);
  logBits(thirdHexBits, true);

  // extract 2 first bits of each hex bits
  var randomOffset1stChunk = firstHexBits >> 6;
  var randomOffset2ndChunk = secondHexBits >> 6;
  var randomOffset3rdChunk = thirdHexBits >> 6;
  logBits(randomOffset1stChunk, true);
  logBits(randomOffset2ndChunk, true);
  logBits(randomOffset3rdChunk, true);

  // build offset idx
  var randomOffsetBin = ( randomOffset1stChunk << 4 ) | ( randomOffset2ndChunk << 2 ) | randomOffset3rdChunk;
  console.log( 'decoded random offset: ' + randomOffsetBin );
  logBits(randomOffsetBin, true);

  // get offset-ed array
  var offsetedArr = offsetArr(myDic, randomOffsetBin);

  // extract letters idx chunks
  var firstLetterIdxBin = firstHexBits & 0b00111111;
  var secondLetterIdxBin = secondHexBits & 0b00111111;
  var thirdLetterIdxBin = thirdHexBits & 0b00111111;

  // get back letter from idx
  var firstLetter = intToAscii(firstLetterIdxBin);
  var secondLetter = intToAscii(secondLetterIdxBin);
  var thirdLetter = intToAscii(thirdLetterIdxBin);
  // get back letters from offset-ed array
  var firstLetterO = intToAscii(firstLetterIdxBin, offsetedArr);
  var secondLetterO = intToAscii(secondLetterIdxBin, offsetedArr);
  var thirdLetterO = intToAscii(thirdLetterIdxBin, offsetedArr);

  //return firstLetter+secondLetter+thirdLetter;
  //return firstLetter+secondLetter+thirdLetter + '( offset: '+ firstLetterO+secondLetterO+thirdLetterO + ' )';
  //return firstLetterO+secondLetterO+thirdLetterO + '( not offset: '+ firstLetter+secondLetter+thirdLetter + ' )';
  return firstLetterO+secondLetterO+thirdLetterO ;  
}

// EXAMPLE OF COMBINED GENERATING THEN DECODING:
// decodeThreeLettersChunk( genThreeLettersChunk('TEF', false) )


// helper - to get a random inclusive number within a particular range
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// helper - 
function intToAscii(intCode, arr){
  if(arr && Array.isArray(arr)) return arr[intCode];
  else return myDic[intCode];
}

function asciiToInt(asciiChar, arr){
  if(arr && Array.isArray(arr)) return arr.join('').indexOf(asciiChar);
  else return myDic.join('').indexOf(asciiChar);
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

// helper - returns either "0xYY 0xYY 0xYY" or "#YYYYYY"
var rgbToHex = function(rgbObj, hash){
  var hexR = (rgbObj.r.toString(16).length == 2 )? rgbObj.r.toString(16) : '0' + rgbObj.r.toString(16);
  var hexG = (rgbObj.g.toString(16).length == 2 )? rgbObj.g.toString(16) : '0' + rgbObj.g.toString(16);
  var hexB = (rgbObj.b.toString(16).length == 2 )? rgbObj.b.toString(16) : '0' + rgbObj.b.toString(16);
  // unpadded
  //if (hash == true) return '#' + rgbObj.r.toString(16) + rgbObj.g.toString(16) + rgbObj.b.toString(16);
  //else return '0x' + rgbObj.r.toString(16) + ' 0x' + rgbObj.g.toString(16) + ' 0x' + rgbObj.b.toString(16);
  // padded
  if (hash == true) return '#' + hexR + hexG + hexB;
  else return '0x' + hexR + ' 0x' + hexG + ' 0x' + hexB;
}
