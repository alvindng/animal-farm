var plan = [
"############################################################################################################",
"#                                                                                                          #",
"#                                                              o         o                                 #",
"#                                                              o         o                                 #",
"#                 ##             ##                            o         o                                 #",
"#                 ##                                           o         o                                 #",
"#        ######   ##  ##     ##  ##  #######                   o         o                                 #",
"#             ##  ##   ##   ##   ##  ##    ##                  o         o                                 #",
"#        #######  ##    ## ##    ##  ##    ##                                                              #",
"#       ##    ##  ##     ###     ##  ##    ##                                                              #",
"#        #######  ##      #      ##  ##    ##               o                                              #",
"#                                                                                                          #",
"#                                                                                                          #",
"#                                                                                                          #",
"#                                                                                                          #",
"#                                 ##                                                                       #",
"#                                 ##                       o                                               #",
"#        ######   #######    #######                                                                       #",
"#             ##  ##    ##  ##    ##                                                                       #",
"#        #######  ##    ##  ##    ##                                                                       #",
"#       ##    ##  ##    ##  ##    ##                  o                                                    #",
"#        #######  ##    ##   #######                                                                       #",
"#                                                                                                          #",
"#                                             o                                                            #",
"#             o                                                                                            #",
"#                           ##                              ##      ##                     ##              #",
"#                           ##                              ##                             #               #",
"#        #######   ######   #######    ######    #######  ######    ##   ######   #######    #######       #",
"#       ##        ##    ##  ##    ##        ##  ##          ##      ##        ##  ##    ##  ##             #",
"#        ######   ########  ##    ##   #######   ######     ##      ##   #######  ##    ##   ######        #",
"#             ##  ##        ##    ##  ##    ##        ##    ##  ##  ##  ##    ##  ##    ##        ##       #",
"#       #######    #######  #######    #######  #######      ####   ##   #######  ##    ##  #######        #",
"#                                                                                                          #",
"#                                                                                                          #",
"#                                                                                                          #",
"#                                                                                                          #",
"#        ######                                                                                            #",
"#       ##    ##                                                                                           #",
"#       ##       ######    ######   ###### ####                                                            #",
"#       ####          ##  ##    ##  ##   ##   ##                                                           #",
"#       ##       #######  ##        ##   ##   ##                                                           #",
"#       ##      ##    ##  ##        ##   ##   ##                                                           #",
"#       ##       #######  ##        ##   ##   ##                                                           #",
"#                                                                                                          #",
"#                                                          o                                               #",
"#                                                                                                          #",
"############################################################################################################"];

var colorbank = ['#E90000','#F64F4F','#FF3434','#A50000','#AB0000','#E96900','#F69B4F','#FF9034','#A54B00','#AB4D00','#008C8C','#2F9494','#23A9A9','#006363','#006666','#00BA00','#3FC53F','#2CD42C','#008400','#008900'];

var image = ["<img src='img/chick.png'>", "<img src='img/dog.png'>", "<img src='img/cow.png'>", "<img src='img/sheep.png'>"];

function Vector(x,y) {
  this.x = x;
  this.y = y;
}

Vector.prototype.plus = function(other) {
  return new Vector(this.x +other.x, this.y + other.y);
};

var grid = ["top left", "top middle", "top right", "bottom left", "bottom middle", "bottom right"];

function Grid(width, height) {
  this.space = new Array(width * height);
  this.width = width;
  this.height = height;
}
Grid.prototype.isInside = function(vector) {
  return vector.x >= 0 && vector.x < this.width &&
         vector.y >= 0 && vector.y < this.height;
};
Grid.prototype.get = function(vector) {
  return this.space[vector.x + this.width * vector.y];
};
Grid.prototype.set = function(vector, value) {
  this.space[vector.x + this.width * vector.y] = value;
};

var directions = {
  "n": new Vector(0,-1),
  "ne": new Vector(1,-1),
  "e": new Vector(1,0),
  "se": new Vector(1,1),
  "s": new Vector(0,1),
  "sw": new Vector(-1,1),
  "w": new Vector(-1,0),
  "nw": new Vector(-1,-1)
};

function randomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}
var directionNames = "n ne e se s sw w nw".split(" ");


function BouncingCritter() {
  this.direction = randomElement(directionNames);
  this.color = randomColor = colorbank[Math.floor(Math.random() * colorbank.length)];
};

BouncingCritter.prototype.act = function(view) {
  if (view.look(this.direction) !=" ")
    this.direction = view.find(" ") || "s";
  return {type: "move", direction: this.direction};
};

function elementFromChar(legend, ch) {
  if (ch == " ")
    return null;
  var element = new legend[ch]();
  element.originChar = ch;
  return element;
}

function charFromElement(element) {
  if (element === null) {
    return " ";
  } else if (element.originChar === "o") {
    return "<img src='img/cow.png'>";
  } else {
    return "<span style='color:" + element.color + "'>" + element.originChar + "</span>";
  }
}


function World(map, legend) {
  var grid = new Grid(map[0].length, map.length);
  this.grid = grid;
  this.legend = legend;

  map.forEach(function(line,y) {
    for (var x = 0; x < line.length; x++)
      grid.set(new Vector(x,y),
              elementFromChar(legend, line[x]));
  });
}


World.prototype.toString = function() {
  var output = "";
  for (var y = 0; y < this.grid.height; y++) {
    for (var x = 0; x < this.grid.width; x++) {
      var element = this.grid.get(new Vector(x,y));
      output += charFromElement(element);
    }
    output += "\n";
  }
  return output;
}

function Wall() {}

var world = new World(plan, {"#": Wall, "o": BouncingCritter});
console.log(world.toString());

var test = {
  prop: 10,
  addPropTo: function(array) {
    return array.map(function(elt) {
      return this.prop + elt;
    }, this);
  }
};
console.log(test.addPropTo([25]));

Grid.prototype.forEach = function(f, context) {
  for (var y = 0; y < this.height; y++) {
    for (var x = 0; x < this.width; x++) {
      var value = this.space[x + y * this.width];
      if (value != null)
        f.call(context, value, new Vector(x,y));
    }
  }
};

World.prototype.turn = function() {
  var acted = [];
  this.grid.forEach(function(critter, vector) {
    if (critter.act && acted.indexOf(critter) == -1) {
      acted.push(critter);
      this.letAct(critter, vector);
    }
  }, this);
};

World.prototype.letAct = function(critter, vector) {
  var action = critter.act(new View(this, vector));
  if (action && action.type == "move") {
    var dest = this.checkDestination(action, vector);
    if (dest && this.grid.get(dest) == null) {
      this.grid.set(vector, null);
      this.grid.set(dest, critter);
    }
  }
};

World.prototype.checkDestination = function(action, vector) {
  if (directions.hasOwnProperty(action.direction)) {
    var dest = vector.plus(directions[action.direction]);
    if (this.grid.isInside(dest))
      return dest;
  }
};

function View (world, vector) {
  this.world = world;
  this.vector = vector;
}
View.prototype.look = function(dir) {
  var target = this.vector.plus(directions[dir]);
  if (this.world.grid.isInside(target))
    return charFromElement(this.world.grid.get(target));
  else
    return "#";
};
View.prototype.findAll = function(ch) {
  var found = [];
  for (var dir in directions)
    if (this.look(dir) == ch)
      found.push(dir);
  return found;
};
View.prototype.find = function(ch) {
  var found = this.findAll(ch);
  if (found.length == 0) return null;
  return randomElement(found);
};


function printSequence() {
  setTimeout(function() {
    if (true) {
    world.turn();
    var printThis = world.toString();
    document.getElementById('world').innerHTML = printThis;
    printSequence();
  } else {
    console.log("finished");
  }
}, 100);
}

printSequence();
