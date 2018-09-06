/* trying to find a hack that's not feasable ? .. yup :/ .. 
    Goal: "2 letters, one byte"
    letters being [A..Z], " " & "-" minimum
*/

// nice additions ( thx to https://fr.wikipedia.org/wiki/Somme_de_contr%C3%B4le_BSD )
var bsdChecksumFromNums = function(num1, num2){
  var checksum = 0;
  // handle 1st num
  checksum = (checksum >> 1) + ((checksum & 1) << 15); // ?
  checksum += num1; // add num1 to the check sum
  checksum &= 0xffff; /* binary AND equivalent to modulo 2^16 */
  // handle 2ns num
  checksum = (checksum >> 1) + ((checksum & 1) << 15); // ?
  checksum += num2; // add num2 to the check sum
  checksum &= 0xffff; /* binary AND equivalent to modulo 2^16 */
  return checksum;
}
// Thnk: '0b' + ( (loler >> 1) + ((loler & 1) << 7) ).toString(2)
var bsdChecksumFromNumsMod = function(num1, num2){
  var checksum = 0;
  // handle 1st num
  checksum = (checksum >> 1) + ((checksum & 1) << 7); // ( right shift 1 bit ) + ( ( select only last bit ) <- shift that 7 bits left, adding 0's )
  checksum += num1; // add num1 to the check sum
  //checksum &= 0xff; /* binary AND equivalent to modulo 2^8 */
  checksum &= 0xffff; // bigger nums, but maybe less duplicates ?
  // handle 2ns num
  checksum = (checksum >> 1) + ((checksum & 1) << 7); // ?
  checksum += num2; // add num2 to the check sum
  //checksum &= 0xff; /* binary AND equivalent to modulo 2^8 */
  checksum &= 0xffff; // bigger nums, but maybe less duplicates ?
  return checksum;
}


// "older" code ..
var highestVal = 0;
var resNum = 0;
var lastRes = 0;
var allRes = {};
var duplicates = {};
for(var a=0;a<27;a++){
  for(var b=0;b<27;b++){
    //var a = 3; var b = 3;
    //( ( a << 4) & 0xf0 ) | b & 0x0f;
    //var res = ( ( a << 4) & 0xf0 ) | b & 0x0f;
    //var res = ( ( a << 4) & 0xf0 ) | (255-b) & 0x0f;
    //var res = ( ( a << 4) & 0xf0 ) | (~b) & 0x0f;
    var res = bsdChecksumFromNumsMod(a, b);
    // update resNum
    resNum++;
    // get highest value ( must stay between [0..255] )
    if( res > highestVal) highestVal = res;
    // get duplicates res ( should be empty if some algo works .. but can one do ? .. )
    //if( lastRes == res){
      if( typeof allRes['b' + res.toString(2)] !== 'undefined'){
        //duplicates['b' + res.toString(2)] +=1;
        allRes['b' + res.toString(2)] +=1;
        //if( duplicates['b' + res.toString(2)] !== 'undefined' ){ duplicates['b' + res.toString(2)] +=1; }
        //else { duplicates['b' + res.toString(2)] = 1; }
      }
      //else { duplicates[res.toString(2)] = 0; }
    //}
    //lastRes = res;
    allRes['b' + res.toString(2)] = 0;
    console.log('a=' + a + ', b=' + b + ' => res=' + res);
  }
}
console.log('highest val: ' +highestVal);
console.log('number of res: ' +resNum);
console.log('duplicates n°: ' + Object.keys(duplicates).length);
console.log('all res: ', allRes);
console.log('duplicates: ', duplicates);
