var streams = [];
var fadeInterval = 1.6;
var symbolSize = 20;
var end = false;
var create_message = false;

function check_symbol_remains() {
  for (var i = 0; i < streams.length; i++) {
    if (streams[i].symbols[streams[i].symbols.length - 1].value != " ") {
      return true;
    }
  }
  return false;
}

function setup() {
  createCanvas(
    window.innerWidth,
    window.innerHeight
  );
  background(0);

  var x = 0;
  for (var i = 0; i <= width / symbolSize; i++) {
    var stream = new Stream();
    stream.generateSymbols(x, random(0, height));
    streams.push(stream);
    x += symbolSize;
  }

  textFont('Consolas');
  textSize(symbolSize);
}

function draw() {
  if (check_symbol_remains()) {
    background(0, 150);
  } else {
    background(0);
  }
  if (end && !check_symbol_remains() && create_message) {
    x = 0;
    symbolSize = window.innerWidth / 19;
    streams = [];
    for (var i = 0; i < window.innerWidth / symbolSize; i++) {
      stream = new Stream();
      stream.generateSymbols(x,0);
      streams.push(stream);
      x += symbolSize;
    }
    create_message = false;
  }

  for (var i = 0; i < streams.length;i++) {
    if (end && !create_message) {
      console.log(streams[i]);
      text(streams[i].symbols[0],i * 20, window.innerHeight/2);

    }
  }
  for (var i = 0; i < streams.length;i++) {
    streams[i].render();
  }
}

function Symbol(x, y, speed, first, opacity) {
  this.x = x;
  this.y = y;
  this.value;

  this.speed = speed;
  this.first = first;
  this.opacity = opacity;

  this.switchInterval = round(random(2, 25));

  this.setToRandomSymbol = function() {
    var charType = round(random(0, 7));
    if (frameCount % this.switchInterval == 0) {
      if (end && !create_message) {
        console.log("assigning value");
      }
      if (charType > 3) {
        // set it to Russian
        this.value = String.fromCharCode(
          0x0410 + round(random(0, 31))
        );
      } else if (charType > 1) {
        // set it to Chinese
        this.value = String.fromCharCode(
          0x3400 + round(random(0, 1000))
        );
      } else {
        // set it to numeric
        this.value = round(random(0,9));
      }
    }
  }

  this.rain = function() {
    if (this.y >= (height + 20)) {
      if (!end) {
        this.y = 0;
        if (!check_symbol_remains()) {

        } else {
          this.y += speed;
        }
      }else{
        this.value = " ";
      }
    } else {
      this.y += speed;
    }
  }
}

function Stream() {
  this.symbols = [];
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
