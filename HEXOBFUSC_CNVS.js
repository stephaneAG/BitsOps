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

//hexToImage(seq);
