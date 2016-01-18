

var colorThief = new ColorThief();
var imageWidth, imageHeight;
var loader = document.getElementById("loader");
var container = document.getElementById('tiles');
var preview = document.getElementById('main-image');
var numTiles = 0;
var numTilesDone = 0;
/*
Handling image loaded by the user.

*/
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
  //get an array of image tiles
  var imgTiles = cutImageUp(this);
  numTiles = imgTiles.length;
  //draw the mosaic with image tiles.
  drawMosaic(imgTiles);
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
  var rows = img.height / TILE_HEIGHT;
    var imagePieces = [];
    for(var y = 0; y < rows; ++y) {
        for(var x = 0; x < columns; ++x) {
            var canvas = document.createElement('canvas');
            canvas.width = TILE_WIDTH;
            canvas.height = TILE_HEIGHT;
            var context = canvas.getContext('2d');
            context.drawImage(img, x * TILE_WIDTH, y * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT, 0, 0, canvas.width, canvas.height);
            imagePieces.push({"img" : canvas.toDataURL(),
                              "left" : x * TILE_WIDTH,
                              "top" : y * TILE_HEIGHT
                            });
        }
    }
    // imagePieces now contains data urls of all the pieces of the image
    loader.innerHTML ="image tiled";
    return imagePieces;
}

// arrange the tiles to recreate the image from the pieces. so we are sure that all the pieces are where they should be.
function drawMosaic(imgTiles){
    loader.innerHTML = "Arranging images from tiles..";
   container.style.width = imageWidth+"px";
   container.style.height = imageHeight+"px";
   imgTiles.forEach(function (imgTile){
     var imgElem = document.createElement("img");
     var colImg = document.getElementById("tile");
     colImg.src = imgTile.img;
     imgElem.src = imgTile.img;
     imgElem.style.position = "absolute";
     imgElem.style.left = imgTile.left + "px";
     imgElem.style.top = imgTile.top + "px";
     container.appendChild(imgElem);
     imgElem.onload = colorReplace;
   });

 loader.innerHTML = "getting colors for respective "+imgTiles.length+" tiles";

}
//replace img src with the color svg
function colorReplace(){
   var color = colorThief.getColor(this);
   var hex = rgbToHex(color[0],color[1],color[2]);
   this.src = "/color/"+hex;
   this.onload = function (){
     //changing the src here causes an infinite loop on onload event so an empty callback to stop that from happening
     numTilesDone++;
     revealImg(numTilesDone);
     loader.innerHTML = numTilesDone+" of "+numTiles+" tiles done";
   }
}
function revealImg(numDone) {
  if(numDone === numTiles){
    console.log("all done");
    container.style.display = "block";
   document.getElementById("reset").style.display = "block";
   loader.style.display = "none";
  }
}
//reset the playing field to try a new image.
function reset () {
  container.innerHTML = '';
document.getElementById("file-input").style.display = "block";
document.getElementById("reset").style.display = "none";
}
