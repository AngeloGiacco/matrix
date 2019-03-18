var streams = []; //creating streams array
var fadeInterval = 1.6; //reduces opacity over time
var symbolSize = 20; //font size
var end = false; //true when key pressed
var create_message = false; //true when key pressed until final message initiated
var message = false; //true when final message initiated

function check_symbol_remains() {
  for (var i = 0; i < streams.length; i++) {
    if (streams[i].symbols[streams[i].symbols.length - 1].value != " ") { //checks if any strings still have elements
      return true;//returns true if symbols remain
    }
  }
  return false;//if nothing returned, no symbols, returns false
}

function setup() {
  createCanvas(
    window.innerWidth,
    window.innerHeight
  ); //creates background fullscreen
  background(0); //black background

  var x = 0; //first stream all the way over on far left
  for (var i = 0; i <= width / symbolSize; i++) { //width divided by symbolSize is number of Streams that will be created
    var stream = new Stream();//initialises new stream object
    stream.generateSymbols(x, random(0, height));//generates a symbol at the x position and random height
    streams.push(stream);//adds stream to stream array
    x += symbolSize;//moves to the right
  }

  textFont('Consolas');
  textSize(symbolSize);
}

function draw() {
  if (check_symbol_remains()) { //if there are still symbols, opacity helps blur
    background(0, 150);
  } else { //removes opacity if there are no more symbols, otherwise can still be seen
    background(0);
  }
  if (end && !check_symbol_remains() && create_message) { //if the message not yet created
    x = 0; //set x to zero
    symbolSize = window.innerWidth / 19;//we only want 19 streams of 1 symbol
    streams = [];//remove all streams from stream array
    for (var i = 0; i < window.innerWidth / symbolSize; i++) { //iterates 19 times
      stream = new Stream();//creates new stream object
      stream.generateSymbols(x,0);//must start at the top
      streams.push(stream);//adds new stream to the stream array
      x += symbolSize;//shifts to the right
    }
    create_message = false;//message created so set to false
  }

  for (var i = 0; i < streams.length;i++) { //just for debugging purposes
    if (end && !create_message) {
      console.log(streams[i]);
    }
  }
  for (var i = 0; i < streams.length;i++) {//renders each stream
    streams[i].render();//render code CAUSES ERROR
  }
}

function Symbol(x, y, speed, first, opacity) {
  this.x = x;//initialises Symbol attributes
  this.y = y;
  this.value;

  this.speed = speed;
  this.first = first;
  this.opacity = opacity;

  this.switchInterval = round(random(5, 30)); //sets how many frames required for a new symbol value

  this.setToRandomSymbol = function() {
    var charType = round(random(0, 7)); //creates a random int between 0 and 7
    if (frameCount % this.switchInterval == 0) {
      if (end && !create_message) {//debugging again
        console.log("assigning value");
      }
      if (charType > 3) {
        // set it to Russian
        this.value = String.fromCharCode(
          0x0410 + round(random(0, 31))//unicode for a random russian character
        );
      } else if (charType > 1) {
        // set it to Chinese
        this.value = String.fromCharCode(
          0x3400 + round(random(0, 1000))//unicode for some chinese characters
        );
      } else {
        // set it to numeric
        this.value = round(random(0,9));
      }
    }
  }

  this.rain = function() {//causes the falling appearance
    if (this.y >= (height + 20)) {//if y value is more than 20px off screen
      if (!end) { //if a key has not been pressed
        this.y = 0;//send it to the top
      }else if (!message) { //if this is not the final message
        this.value = " ";
      }
    } else if (message && this.y > height/2){ //if the message has been created and the stream is past halfway
      //set the symbols value to the appropriate character of the message
    } else {
      this.y += speed; //lower y coordinate by the speed
    }
  }
}

function Stream() {
  this.symbols = [];//create symbols array
  if (create_message) {
    this.totalSymbols = 1;
  } else {
    this.totalSymbols = round(random(5, 35));
  }
  this.speed = random(5, 15);

  this.generateSymbols = function(x, y) {
    var opacity = 255;
    var first = round(random(0, 4)) == 1;
    for (var i =0; i < this.totalSymbols; i++) {
      symbol = new Symbol(
        x,
        y,
        this.speed,
        first,
        opacity
      );
      symbol.setToRandomSymbol();
      this.symbols.push(symbol);
      opacity -= (255 / this.totalSymbols) / fadeInterval;
      y -= symbolSize;
      first = false;
    }
  }

  this.render = function() {
    this.symbols.forEach(function(symbol) {
      if (symbol.first) {
        fill(140, 255, 170, symbol.opacity);
      } else {
        fill(0, 255, 70, symbol.opacity);
      }
      text(symbol.value, symbol.x, symbol.y);
      symbol.rain();
      symbol.setToRandomSymbol();
    });
  }
}

function keyPressed() {
  end = true;
  create_message = true;
}
