# R: for EDID stuff, we need:

http://www.edidreader.com/

some hexs from an EDID
```bash
00 FF FF FF FF FF FF 00 59 32 87 46 20 0A 04 01 33 1C 01 03 80 00 00 00 0A D7 A5 A2 59 4A 96 24 14 50 54 A3 08 00 95 00 01 01 81 00 81 40 81 C0 01 01 01 01 01 01 9A 29 A0 D0 51 84 22 30 50 98 36 00 3F 43 21 00 00 1C 66 21 50 B0 51 00 1B 30 40 70 36 00 3F 43 21 00 00 1E 00 00 00 FD 00 32 4C 1E 50 10 00 0A 20 20 20 20 20 20 00 00 00 FC 00 48 44 54 56 0A 20 20 20 20 20 20 20 20 01 2A
```
this logic to format stuff
https://stackoverflow.com/questions/51350141/edid-edit-in-javascript/51369351#51369351

the following code
```javascript
var getEisaId = function(topByte, bottomByte)
{
  var FIVE_BIT_LETTER_MASK = 0x1F;
  var EISA_ID_BYTE1 = 8;
  var EISA_ID_BYTE2 = 9;
  var EISA_LETTER1_OFF = 2
  var EISA_LETTER2_OFF = 5;
  var LETTER2_TOP_BYTES = 3;
  var LETTER2_TOP_MASK = 0x03;
  var LETTER2_BOT_MASK = 0x07;

  //var firstLetter = (0xA1 >> EISA_LETTER1_OFF) & FIVE_BIT_LETTER_MASK;
  var firstLetter = (topByte >> EISA_LETTER1_OFF) & FIVE_BIT_LETTER_MASK;
  
  // Get the first two bits [2:0] of the top byte
  //var secondLetterTop = 0xA1 & LETTER2_TOP_MASK;
  var secondLetterTop = topByte & LETTER2_TOP_MASK;
  
  // Get the last three bits [7:5] of the bottom byte
  //var secondLetterBottom = (0x00 >> EISA_LETTER2_OFF) & LETTER2_BOT_MASK;
  var secondLetterBottom = (bottomByte >> EISA_LETTER2_OFF) & LETTER2_BOT_MASK;
  
  // Combine the top and bottom
  var secondLetter = (secondLetterTop << LETTER2_TOP_BYTES) | secondLetterBottom;

  //var thirdLetter = 0x00 & FIVE_BIT_LETTER_MASK;
  var thirdLetter = bottomByte & FIVE_BIT_LETTER_MASK;

  return intToAscii(firstLetter)+intToAscii(secondLetter)+intToAscii(thirdLetter);
}

function intToAscii(intCode)
{
    var abc = "0ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    return abc[intCode];
}

getEisaId();

function asciiToInt(asciiChar){
  return "0ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(asciiChar);
}
//var byte9 = ( asciiToInt("0").toString(2) & 0x1F ).toString(16)

var generateEisaId = function(threeCharsId){
  var FIVE_BIT_LETTER_MASK = 0x1F;
  var EISA_LETTER1_OFF = 2;
  var EISA_LETTER2_OFF = 5;
  var LETTER2_TOP_BYTES = 3;
  var LETTER2_TOP_MASK = 0x03;
  var LETTER2_BOT_MASK = 0x07; // 111 in base 2

  var charsArr = threeCharsId.split('').splice(0, 3); // delete anything after 3rd char
  
  // format 1st char
  var firstLetterBin = asciiToInt(charsArr[0]); //.toString(2); // get index from letter, and get its binary representation
  console.log('1st letter: ' + charsArr[0] + ' > ' + asciiToInt(charsArr[0]) + ' (int/base10) > ' + firstLetterBin.toString(2) + ' (bin/base2)');

  // format 2nd char
  var secondLetterBin = asciiToInt(charsArr[1]); //.toString(2);
  console.log('2nd letter: ' + charsArr[1] + ' > ' + asciiToInt(charsArr[1]) + ' (int/base10) > ' + secondLetterBin.toString(2) + ' (bin/base2)');
  // get the second letter binary chunk for the 1st two bits of the top byte
  //var secondLetterTopBin = secondLetterBin >> LETTER2_TOP_MASK;
  //var secondLetterTopBin = secondLetterBin & LETTER2_TOP_MASK;
  //var secondLetterTopBin = secondLetterBin & LETTER2_TOP_MASK;
  var secondLetterTopBin = secondLetterBin >> 3; // shift 3 positions right ( drop stuff )
  console.log('2nd letter top bin: ' + secondLetterTopBin.toString(2));

  // get the second letter binary chunk for the last three bits of the bottom byte
  //var secondLetterBottomBin = secondLetterBin & LETTER2_BOT_MASK;
  var secondLetterBottomBin = ( secondLetterBin << 2 ) & 0x07;
  console.log('2nd letter bottom bin: ' + secondLetterBottomBin.toString(2));

  // format Last char
  var thirdLetterBin = asciiToInt(charsArr[2]); //.toString(2);
  console.log('3rd letter: ' + charsArr[2] + ' > ' + asciiToInt(charsArr[2]) + ' (int/base10) > ' + thirdLetterBin.toString(2) + ' (bin/base2)');

  // 1st byte - add 1st char binary to top byte & shift it 2 positions left to make room for 2nd char 1st binary chunk of 2 bits
  var firstLetterOnceOffset = ( firstLetterBin << EISA_LETTER1_OFF ) & FIVE_BIT_LETTER_MASK;
  //var firstLetterOnceOffset = ( firstLetterBin & 0xA0 );

  console.log('1st letter once offset: ' + firstLetterOnceOffset.toString(2));
  //var topByte = ( ( firstLetterBin << EISA_LETTER1_OFF ) | secondLetterTopBin ) >> 2;
  var topByte = ( firstLetterBin << EISA_LETTER1_OFF ) | secondLetterTopBin;
  console.log('top byte: ' + topByte.toString(2) );

  // 2nd byte - add 3rd char binary to bottom byte & shift it 3 positions right to make room for 2nd char 2nd binary chunk of 3 bits
  //var bottomByte = ( thirdLetterBin & FIVE_BIT_LETTER_MASK ) | ( secondLetterBottomBin << EISA_LETTER2_OFF )
  //var bottomByte = ( thirdLetterBin & FIVE_BIT_LETTER_MASK ) | ( secondLetterBottomBin << EISA_LETTER2_OFF );
  //var bottomByte = ( thirdLetterBin & FIVE_BIT_LETTER_MASK );
  var bottomByte = thirdLetterBin | ( secondLetterBottomBin << EISA_LETTER2_OFF ); // & 0xA0;
  //var bottomByte = ( thirdLetterBin & FIVE_BIT_LETTER_MASK ) | ( secondLetterBottomBin << 8 );
  //var bottomByte = ( thirdLetterBin & FIVE_BIT_LETTER_MASK ) | ( secondLetterBottomBin << 8 ); // &0x1F;
  console.log('bottom byte: ' + bottomByte.toString(2));

  // padding ? 
  var n1 = topByte.toString(2);
  n1 = "00000000".substr(n1.length) + n1;
  console.log('padded top byte: ' + n1);
  var n2 = bottomByte.toString(2);
  n2 = "00000000".substr(n2.length) + n2;
  console.log('padded bottom byte: ' + n2);
  
  // get hex's of the padded versions ?
  var eisaIdP = '0x' + parseInt(n1, 2).toString(16) + ' 0x' + parseInt(n2, 2).toString(16);
  console.log('padded: ' + eisaIdP);

  // get hex's for both of the aboves
  var eisaId = '0x' + topByte.toString(16) + bottomByte.toString(16);
  return eisaId;

}
//var myId = generateEisaId('AAA');
//console.log('generated Eisa Id hex: ' + myId);

/* ==== Tests with Hex & Web EDID reader ====

0x00 0x00 => 000
0x04 0x21 => AAA
*/

/* trying to compute the available choices */
// gives some "undefined" stuff
/*
for( var i=0; i < 255; i++){
  console.log('i: ' + i +' / 0x' + i.toString(16) + ' => ' + getEisaId(i, 0x00) );
}
*/

// gives some "undefined" stuff, but slightly less
/*
for( var i=0; i < 128; i++){
  //console.log('i: ' + i +' / 0x' + i.toString(16) + ' => ' + getEisaId(i, 0x00) );
  for( var ii=0; ii < 128; ii++){
    console.log('i: ' + i +' / 0x' + i.toString(16) + ' => ' + getEisaId(i, ii) );
  }
}
*/

/*
  some more digging: trying to get 'Z' correctly splitting across those 2 bytes
    Z -> 26    (dec/base10)
       0x1A  (hex/base16)
       11010 ( bin/base2)

  Z:              11010
  padded Z:    00011010
  bytes:       00000000 | 00000000
  split:     0 00000 00 | 000 00000
  result:    0 11010 11 | 010 11010
  formatted:   01101011 | 01011010
  hex:             0x6b | 0x5a
  -> SUCCESS! ==> gives us 'ZZZ'
*/
// helper
var logBits = function(num, showHex){
  var numBits = num.toString(2);
  //var prefixLen = 8 - numBits;
  var prefixStr = '';
  //console.log(8 - numBits.length);
  for(var i=0; i< 8 - numBits.length; i++){ prefixStr +='0'; }
  if(showHex === true) console.log('0b%c' + prefixStr + '%c' + numBits + ' 0x' + num.toString(16), 'color: blue;', 'color: black;');
  else console.log('0b%c' + prefixStr + '%c' + numBits, 'color: blue;', 'color: black;');
}
// to do: alternate version that colors in other color ( or doesn't color at all )
// "leading zeros that were lost we manipulating bits" to better perceive the changes in logs

// steps:
// getting bytes from num's integer index: ok
/*
var letterAsciiChar = '0'; // Z works, but A, B, .. needs to "be reversed" in the order their hex is shown ?
// WORKS ( 3 same letters ): B, C, D, E, F, G, I, .. X, Y, Z
// H needed to be padded ( prefixed with a zero int its case ), cuz being generated as 0x8 instead of 0x08
// ex: our code gives 
var letterIdx = asciiToInt(letterAsciiChar);
//var letter = 0b11010; // Z ( decimal: 26 hex: 0x1a) - working hardcoded version to debug out ;P
var letter = letterIdx; // same as the above
logBits(letter, true );
// getting left-chunk of 2nd letter's bits:
var letter1stChunk = letter >> 3; // discard the three last bits
logBits(letter1stChunk, true );
// getting right-chunk of 2nd letter's bits:
//var letter2ndChunk = letter & 0b00111; // gets only the three last bits - seemingly working ?
var letter2ndChunk = letter & 0x07; //0b00111; // gets only the three last bits
logBits(letter2ndChunk, true );
// 1st byte: shift letter by 2 then combine 2nd letter 1st chunk of bits
var firstByte = (letter << 2 ) | letter1stChunk;
logBits(firstByte, true );
// 2nd byte: shift 2nd letter 2nd chunk by 5 positions to the left then combine with 3rd letters bits
var secondByte = (letter2ndChunk << 5) | letter;
logBits(secondByte, true );
// get the hex's
// /!\ if hex contain only one char, it needs to be padded ( prefixed with a 0 )
var firstByteHex = (firstByte.toString(16).length == 2 )? firstByte.toString(16) : '0' + firstByte.toString(16);
var secondByteHex = (secondByte.toString(16).length == 2) ? secondByte.toString(16) : '0' + secondByte.toString(16);
//var eisaId = '0x' + firstByte.toString(16) + ' 0x' + secondByte.toString(16);
var eisaId = '0x' + firstByteHex + ' 0x' + secondByteHex;
console.log(eisaId);
console.log('goal: ' + letterAsciiChar);
console.log( getEisaId(firstByte, secondByte) ); // even if this shows stg ok, the online ui doens't ?
// so, my question: what differs from the online version & my extract from its github repo ?
*/

// new function built from the aboves steps
var genEisaId = function(threeCharsId, arr){
  var charsArr = threeCharsId.split('').splice(0, 3); // delete anything after 3rd char
  
  // get mapping idx's
  var firstLetterBin = asciiToInt(charsArr[0]);
  var secondLetterBin = asciiToInt(charsArr[1]);
  var thirdLetterBin = asciiToInt(charsArr[2]);
  
  // process
  var secondLetter1stChunk = secondLetterBin >> 3; // discard the three last bits
  var secondLetter2ndChunk = secondLetterBin & 0x07; //0b00111; // gets only the three last bits
  
  // build
  var firstByte = (firstLetterBin << 2 ) | secondLetter1stChunk;
  var secondByte = (secondLetter2ndChunk << 5) | thirdLetterBin;
  
  // post-proc
  //var firstByteHex = firstByte.toString(16);
  //var secondByteHex = secondByte.toString(16);
  var firstByteHex = (firstByte.toString(16).length == 2 )? firstByte.toString(16) : '0' + firstByte.toString(16);
  var secondByteHex = (secondByte.toString(16).length == 2) ? secondByte.toString(16) : '0' + secondByte.toString(16);
  
  // return hex's
  if(arr === true) return['0x' + firstByteHex, '0x' + secondByteHex];
  else return '0x' + firstByteHex + ' 0x' + secondByteHex;
}
//console.log ( genEisaId('TEF', true) ) // gives 0x50 0xA6, which is a valid "TEF", yet different from "0xD0 0xA6" I knew ;p
//console.log ( genEisaId('AAA', true) )
console.log ( genEisaId('VIR', true) )
//console.log( getEisaId(genEisaId('TEF', true)[0], genEisaId('TEF', true)[1]) ); // even if this shows stg ok, the online ui doens't ?
//console.log( getEisaId(genEisaId('AAA', true)[0], genEisaId('AAA', true)[1]) ); // even if this shows stg ok, the online ui doens't ?
console.log( getEisaId(genEisaId('VIR', true)[0], genEisaId('VIR', true)[1]) ); // even if this shows stg ok, the online ui doens't ?
```
