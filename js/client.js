
//ColorGetter gets the average color of the given image source (colorgetter.js)
var colorGetter = new ColorGetter();
var imageWidth, imageHeight;
var loader = document.getElementById("loader");
var container = document.getElementById('tiles');
var preview = document.getElementById('main-image');
var imgCount = 0;


//handling image selected by the user
function imageUpload (){
  loader.style.display = "block";
  loader.innerHTML = "reading file";
  document.getElementById("file-input").style.display = "none";
  var file = document.getElementById('upload-image').files[0];
  //using file reader to load the image.
  var reader = new FileReader();
  if(file){
    reader.readAsDataURL(file);
  }
  reader.onloadend = function () {
    loader.innerHTML = "image loaded";
    preview.src = reader.result;
  }
}
preview.onload = function(){
  imageWidth = this.width;
  imageHeight = this.height;
  //slice the loaded image in tiles
  cutImageUp(this);
}

//functions to conver RGB color information to hex code.
function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}
//console.log(rgbToHex(97, 189, 16));
function rgbToHex(r, g, b) {
  return componentToHex(r) + componentToHex(g) + componentToHex(b);
}

// function to divide the given image into tiles of the given size
function cutImageUp(img) {
  var columns = img.width / TILE_WIDTH;
  console.log(columns/100);
  var rows = img.height / TILE_HEIGHT;
loader.innerHTML = "Slicing up the images into "+columns*rows+" pieces";
    for(var y = 0; y < rows; ++y) {
      var imagePiecesRow = [];
      for(var x = 0; x < columns; ++x) {
          var canvas = document.createElement('canvas');
          canvas.width = TILE_WIDTH;
          canvas.height = TILE_HEIGHT;
          var context = canvas.getContext('2d');
          context.drawImage(img, x * TILE_WIDTH, y * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT, 0, 0, canvas.width, canvas.height);
          imagePiecesRow.push({"img" : canvas.toDataURL(),
                              "left" : x * TILE_WIDTH,
                              "top" : y * TILE_HEIGHT
                            });
        }//end of colums for loop
        //drawMosaic for every row.
        if(imagePiecesRow.length > 0){
          drawMosaic(imagePiecesRow);
        }
    }//end of row for loop
}//end of cutImageUp


// arrange the tiles to recreate the image from the pieces. so we are sure that all the pieces are where they should be.
function drawMosaic(imgTiles){
    loader.innerHTML = "Arranging images from tiles..";
   container.style.width = imageWidth+"px";
   container.style.height = imageHeight+"px";
   imgTiles.forEach(function (imgTile){
     imgCount++;
     var imgElem = document.createElement("img");
     imgElem.src = imgTile.img;
     imgElem.id = "i"+imgCount;
     imgElem.style.position = "absolute";
     imgElem.style.left = imgTile.left + "px";
     imgElem.style.top = imgTile.top + "px";
     container.appendChild(imgElem);
     imgElem.onload = colorReplace;
   });
}


//replace img src with the color svg
function colorReplace(){
   var color = colorGetter.getColor(this);
}


//receiver function for color and we replace the src of the image based on its unique Id
var imgDone = 0;//counter for number of tiles completed
function gotColor(color, imgId){
  imgDone++;
loader.innerHTML = "Almost Done "+imgDone+"/"+imgCount;
  var img = document.getElementById(imgId);
  var hex = rgbToHex(color[0],color[1],color[2]);
  img.src = "/color/"+hex;
  img.onload = function (){
    img.style.opacity = 1;
  }
  if(imgDone === imgCount){
    loader.style.display = "none";
    document.getElementById("reset").style.display = "block";
  }
}


//reset the playing field to try a new image.
function reset () {
  container.innerHTML = '';
  imgDone = 0;
  imgCount = 0;
document.getElementById("file-input").style.display = "block";
document.getElementById("reset").style.display = "none";
}
