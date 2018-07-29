// ======== FIRST WAY: SENTENCE TO IMG ========

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




// ======== OTHER WAY 'ROUND: IMG TO SENTENCE ========
// == file reading ==
function readSingleFile(e) {
  var file = e.target.files[0];
  if (!file) {
    return;
  }
  var reader = new FileReader();
  reader.onload = function(e) {
    var imgContent = e.target.result;
    //preview.src = reader.result; // works
    //preview.src = imgContent; // also works
    
    var img = new Image();
    img.src = imgContent; // also works ;p
    //document.body.append(img);
    // .. naturalWidth ?
    //console.log( imageToHex(preview) );
    console.log( imageToHex(img) );
  };
  //reader.readAsText(file);
  reader.readAsDataURL(file);
}

var preview = document.querySelector('img');

// == file opening ==
//<input type="file" id="file-input"></input>
var fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.id = 'file-input';
//document.getElementById('file-input').addEventListener('change', readSingleFile, false);
fileInput.addEventListener('change', readSingleFile, false);
//fileInput.click(); // auto popup open file dialog
document.body.append(fileInput);

// quick helper
// returns either "0xYY 0xYY 0xYY", "#YYYYYY"
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

// == imgToHex ==
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

var imageToSentence = function(img){
  return decodeSentence( imageToHex(img) );
}
