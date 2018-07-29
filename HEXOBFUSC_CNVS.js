/* R: currently NOT working .. */
var seq =["0xdd 0x5a 0x21", "0xac 0xaf 0x7b", "0xb6 0xae 0xb1", "0x0c 0x84 0x5b", "0x27 0x22 0xa2"];
var hexToRgb = function(hexArr, rgbStr){
  if (rgbStr == true) return 'rgb(' + Number(hexArr[0]) + ',' + Number(hexArr[1]) + ',' + Number(hexArr[2]) + ')';
  else return {r: Number(hexArr[0]), g: Number(hexArr[1]), b: Number(hexArr[2]) };
}
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
var rgbSeq = sentenceHexToRgb(seq);

//var canvasOutput = function(rgbSeq){
  //var cnvs = document.createElement('canvas');
  var cnvs = document.querySelector('canvas');
  var ctx = cnvs.getContext('2d');
  cnvs.height = 1;
  cnvs.width = rgbSeq.length; // number of 3hex chunks or r,g,b objs
  //document.body.append(cnvs); // debug
  var imageData = ctx.getImageData(0, 0, cnvs.width, 1); //read ( blank )
  //var data = imageData.data;
  var buf = anew ArrayBuffer(imageData.data.length); // tmp hold content od img data
  var buf8 = new Uint8ClampedArray(buf); // array buffer view - representation as one-dimensional array of unsigned 8-bit values
  //var data = new Uint32Array(buf); // array buffer view - representation as one-dimensional array of unsigned 32-bit values
  /*
  for(var i=0,j=0; i <data.length; i+=1,j++){
    // set pixel at i to data in array at j
    data[i] = 0; //rgbSeq[j].r;
    data[i+1] = 0; //rgbSeq[j].g;
    data[i+2] = 0; //rgbSeq[j].b;
    console.log('looping over ' + i);
  }
  */
  
  for(var i=0,j=0; i <imageData.data.length; i+=4,j++){
    // set pixel at i to data in array at j
    imageData.data[i] = 255; //rgbSeq[j].r;
    imageData.data[i+1] = 255; //rgbSeq[j].g;
    imageData.data[i+2] = 255; //rgbSeq[j].b;
    console.log('looping over ' + j);
  }
  
  //imageData.data.set(buf8); // assign content of buffer to imageData.data - doesn't seem to work
  //imageData.data.set(buf); // assign content of buffer to imageData.data - seems to work
  //imageData.data.set(imageData.data); // assign content of buffer to imageData.data - seems to work
  for(var i=0, j=0; i < imageData.data.length; i+=4, j++) {
    console.log(j+': R:' + imageData.data[i] + ' G:' + imageData.data[i+1] +' B:' + imageData.data[i+2]);
    imageData.data[i] = rgbSeq[j].r;
    imageData.data[i + 1] = rgbSeq[j].g;
    imageData.data[i + 2] = rgbSeq[j].b;
    //console.log('looping over i: ' + i + ' and j: ' + j);
    console.log(j+': R:' + imageData.data[i] + ' G:' + imageData.data[i+1] +' B:' + imageData.data[i+2]);
  }
  //imageData.data = data; // necessary ?
  ctx.putImageData(imageData, 0, 0); // write imageData back to canvas
  
  // == debug: re-read image data from canvas ==
  var imageData2 = ctx.getImageData(0, 0, cnvs.width, 1); //read ( blank )
  var data2 = imageData2.data;
  for(var i=0, j=0; i < data2.length; i+=4, j++) {
    console.log(j+': R:' + data2[i] + ' G:' + data2[i+1] +' B:' + data2[i+2]);
  }
//}

//canvasOutput(rgbSeq);
