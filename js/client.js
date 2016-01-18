

var colorThief = new ColorThief();
var imageWidth, imageHeight;
var loader = document.getElementById("loader");
var container = document.getElementById('tiles');

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
  var preview = document.getElementById('main-image');

  if(file){
    reader.readAsDataURL(file);
  }
  reader.onloadend = function () {
    loader.innerHTML = "image loaded";
      preview.src = reader.result;
      setTimeout(function(){
        imageWidth = preview.width;
        imageHeight = preview.height;
        //get an array of image tiles
        var imgTiles = cutImageUp(preview);
        //draw the mosaic with image tiles.
        drawMosaic(imgTiles);
      },500)

  }
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
    return imagePieces;
    loader.innerHTML ="image tiled";
}

// arrange the tiles to recreate the image from the pieces. so we are sure that all the pieces are where they should be.
function drawMosaic(imgTiles){
    loader.innerHTML = "Arranging images from tiles..";
   container.style.width = imageWidth+"px";
   container.style.height = imageHeight+"px";
   for (var i = 0; i < imgTiles.length; i++) {
     var imgTile = imgTiles[i];
     var imgElem = document.createElement("img");
     var colImg = document.getElementById("tile");
     colImg.src = imgTile.img;
     imgElem.src = imgTile.img;
     imgElem.style.position = "absolute";
     imgElem.style.left = imgTile.left + "px";
     imgElem.style.top = imgTile.top + "px";
     container.appendChild(imgElem);
   }
 loader.innerHTML = "all the pieces are here.";
 //get color information from them.
 getSvgColors();
}

//get dominant color of each image tile and replace them with color svg from the server.
function getSvgColors(){
  var tiles = container.childNodes;
  loader.innerHTML = "getting colors for respective tiles";
  for (var i = 0; i < tiles.length; i++) {
    var tile = tiles[i]
    var color = colorThief.getColor(tile);
    var hex = rgbToHex(color[0],color[1],color[2]);
    tile.src = "/color/"+hex;
  }
  container.style.display = "block";
  document.getElementById("reset").style.display = "block";
  loader.style.display = "none";

}

//reset the playing field to try a new image.
function reset () {
  container.innerHTML = '';
document.getElementById("file-input").style.display = "block";
document.getElementById("reset").style.display = "none";
}
