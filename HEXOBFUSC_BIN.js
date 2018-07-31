/* wip stuff to be added to be able to read from  / write to binary files */
// save stuff as txt file using blob
var saveStuff = function(){
  //var myData = ['0x33 0x23 0x45']; // works
  var myData = [0x33, 0x23, 0x45];
  console.log('myData:', myData);
  var blob = new Blob([myData], {type: 'application/octet-stream'}); // pass a useful mime type here
  var url = URL.createObjectURL(blob);
  // url will be something like: blob:d3958f5c-0777-0845-9dcf-2cb28783acaf
  //var newdata = canvasImg.replace(/^data:image\/png/,'data:application/octet-stream');
  //window.open( newdata ); // doesn't allow us to specify a filename
  var link = document.createElement('a');
  link.setAttribute('download', 'stuff.txt');
  //link.setAttribute('href', newdata);
  link.setAttribute('href', url);
  link.click();
}

// test
//saveStuff();



// ====== read from file ======
function readSingleFile(e) {
  var file = e.target.files[0];
  if (!file) {
    return;
  }
  var reader = new FileReader();
  reader.onload = function(e) {
    var blobContent = e.target.result;
    console.log('blobContent:', blobContent );
  };
  reader.readAsText(file);
  //reader.readAsDataURL(file);
  //reader.readAsArrayBuffer(file);
}
// test
var fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.id = 'file-input';
fileInput.addEventListener('change', readSingleFile, false);
//fileInput.click(); // auto popup open file dialog
