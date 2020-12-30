var database ,dog,dog1,dog2
var position

var feed,add;
var foodobject;
var Feedtime, Lastfeed;
var bedroomImg, gardenImg, washroomImg;

function preload(){
  dogimg1 = loadImage("images/Dog.png");
  dogimg2 = loadImage("images/happy dog.png");

  bedroomImg = loadImage("images/ BedRoom.png");
  gardenImg = loadImage("images/ Garden.png");
  washroomImg = loadImage("images/ Wash Room.png");

}


function setup() {
	createCanvas(1000, 500);
  database = firebase.database();
  console.log(database);
 
  foodobject=new Food()
  dog = createSprite(550,250,10,10);
  dog.addImage(dogimg1)
  dog.scale=0.2
 
  var dogo = database.ref('Food');
  dogo.on("value", readPosition, showError);

  feed = createButton("FEED DOG");
  feed.position(500,15);
  feed.mousePressed(FeedDog);

  add = createButton("ADD FOOD");
  add.position(400,15);
  add.mousePressed(AddFood);

  var gameStateRef  = database.ref('gameState');
  gameStateRef.on("value",function(data){
     gameState = data.val();
  })



} 

function draw(){

  background(46,139,87);

  
  if(gameState !== "hungry"){
    feed.hide();
    add.hide();
    dog.remove();
  }
  else{
    feed.show();
    add.show();
    dog.addImage(dogimg1);
  }


  currenttime = hour();
  if(currenttime === (Lastfeed + 1)){
    update("playing");
    foodobject.garden();
  }
  else if(currenttime === (Lastfeed + 2)){
    update("sleeping");
    foodobject.bedroom();
  }
  else if(currenttime > (Lastfeed + 2) && currenttime <= (Lastfeed + 4)){
    update("bathing");
    foodobject.washRoom();
  }
  else{
    update("hungry")
    foodobject.display()
  }

  drawSprites();

}


function readPosition(data){
  position = data.val();
  foodobject.updateFoodStock(position)
}

function showError(){
  console.log("Error in writing to the database");
}

function writePosition(pos){
  if(pos>0){
    pos=pos-1
  }
  else{
    pos=0
  }
  database.ref('/').set({
    'Food': pos
  })

}
function AddFood(){
position++
database.ref('/').update({
  Food:position
}

)
}
function FeedDog(){

dog.addImage(dogimg2)
foodobject.updateFoodStock(foodobject.getFoodStock()-1)
 database.ref('/').update({
   Food:foodobject.getFoodStock(),
   FeedTime:hour()
 })
}

function update(state){
  database.ref('/').update({
    gameState: state
  });
}