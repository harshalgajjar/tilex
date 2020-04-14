// (c) 2020 Harshal Gajjar (www.harshalgajjar.com)
// Tilex v1.0
// (tilex_v1.js) Available under MIT License

$(document).keyup(function(e) {
  if (e.key === "Escape" && tilexLiveElem!=null) {
    tilexContract(tilexLiveElem)
    tilexLiveElem=null;
  }
});

function tilexContract(elem){

  //getting parent's coordinates
  var originalTile = document.getElementsByClassName("tilex-tile-current")[0];
  var viewportOffset = originalTile.getBoundingClientRect();
  var topOriginalTile = viewportOffset.top;
  var leftOriginalTile = viewportOffset.left;
  var originalLargeDiv = originalTile.getElementsByClassName("tilex-large-content")[0];
  var style = getComputedStyle(originalTile);

  //getting necessary divs for animation
  var expandedTile = document.getElementById("tilex-expanded-tile");
  var smallDiv = expandedTile.getElementsByClassName("tilex-small")[0];
  var largeDiv = expandedTile.getElementsByClassName("tilex-large")[0];
  var largeDivContent = largeDiv.getElementsByClassName("tilex-large-content")[0];
  var closeButton = expandedTile.getElementsByClassName("tilex-close-button")[0];

  //ANIMATING

  //hiding .small and making .large appear
  $(largeDiv).animate({
    'opacity': 0
  }, tilexSpeed/4, function(){
    $(smallDiv).animate({
      'opacity': 1
    }, tilexSpeed/4);
  });

  //animating close button's visibility
  $(closeButton).animate({
    'opacity': 0
  }, tilexSpeed);

  originalTile.style.opacity = 1;

  //animating the tile to make it small
  $(expandedTile).animate({
    top: topOriginalTile+'px',
    left: leftOriginalTile+'px',
    borderRadius: style["border-bottom-left-radius"],
    height: originalTile.offsetHeight + 'px',
    width: originalTile.offsetWidth + 'px'
  }, tilexSpeed);

  //actually removing the element
  setTimeout(function(){
    expandedTile.remove();
  }, tilexSpeed);

  //removing the parent identifier
  originalTile.classList.remove("tilex-tile-current");

}

function tilexExpand(elem){
  elem.classList.add("tilex-tile-current");

  //creating a duplicate tile at the same position
  var expandedTile = document.createElement("div");
  var viewportOffset = elem.getBoundingClientRect();
  var topTile = viewportOffset.top;
  var leftTile = viewportOffset.left;
  expandedTile.innerHTML = elem.innerHTML;
  expandedTile.classList.add("tilex-tile");
  expandedTile.classList.add("tilex-full-tile");
  var style = getComputedStyle(elem);
  expandedTile.style.borderRadius = style["border-bottom-left-radius"];
  expandedTile.style.textAlign = style["text-align"];

  //adding shared class
  for(var i=0; i<elem.classList.length; i++){
    if(elem.classList[i].includes("tilex-shared")){
      expandedTile.classList.add(elem.classList[i]);
    }
  }

  expandedTile.style.top = topTile +"px";
  expandedTile.style.left = leftTile +"px";
  expandedTile.style.minWidth = elem.offsetWidth;
  expandedTile.style.minHeight = elem.offsetHeight;

  expandedTile.id="tilex-expanded-tile";
  document.body.appendChild(expandedTile);

  elem.style.opacity = '0';

  //adding a listener to close button
  var closeButton = expandedTile.getElementsByClassName("tilex-close-button")[0];
  closeButton.addEventListener("click", function(){
    tilexContract(closeButton.parentElement)
  });

  //getting the inner divisions to animate
  var smallDiv = expandedTile.getElementsByClassName("tilex-small")[0];
  var largeDiv = expandedTile.getElementsByClassName("tilex-large")[0];
  var largeDivContent = largeDiv.getElementsByClassName("tilex-large-content")[0];

  //setting padding and making space for the close button
  // alert(closeButton.offsetWidth);

  largeDivContent.style.padding = (closeButton.offsetWidth+20) + "px";

  //setting width (before animation) for smoother animation and displaying the text and the close button
  largeDiv.style.width = '100vw';
  largeDiv.style.display = 'inline';
  closeButton.style.display='block';

  //ANIMATIONS

  //animating the tile to make it full screen
  $(expandedTile).animate({
    top: "0px",
    left: "0px",
    right: "0px",
    borderRadius: "0px",
    height: '100vh'
  }, tilexSpeed);

  // animating close button's visibility
  $(closeButton).animate({
    'opacity': 1
  }, tilexSpeed);

  //setting the max height of content to allow for scrolling



  if(largeDivContent.offsetHeight>window.innerHeight){
    largeDivContent.style.maxHeight = (window.innerHeight) +"px";
  }

  largeDivContent.style.display = 'block';

  //hiding .small and making .large appear
  $(smallDiv).animate({
    'opacity': 0
  }, tilexSpeed/2, function(){
    $(largeDiv).animate({
      'opacity': 1
    }, tilexSpeed/2);
  });

  tilexLiveElem=elem;

}

function initTilex(tilexSpeed = 400){
  tilexTiles = document.getElementsByClassName('tilex-tile');
  for(var i=0; i<tilexTiles.length; i++){
    tilexTiles[i].addEventListener("click", function(){
      tilexExpand(this);
    });
  }

  var sheet = document.getElementsByTagName('style')[0];
  var divtilex = document.getElementsByClassName('tilex-tile')[0];

  if(sheet==null){
    var sheet = document.createElement('style')
    sheet.innerHTML = ".tilex-full-tile{ min-height: " + divtilex.offsetHeight + "px; min-width: " + divtilex.offsetWidth + "px;}";
    document.body.appendChild(sheet);
  }else{
    sheet.innerHTML = sheet.innerHTML + " .tilex-full-tile{ min-height: " + divtilex.offsetHeight + "px; min-width: " + divtilex.offsetWidth + "px;}";
  }

  window.tilexSpeed = tilexSpeed;
  window.tilexLiveElem = null;
}
