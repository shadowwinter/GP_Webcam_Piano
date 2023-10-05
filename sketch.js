//piano notes taken from https://www.reddit.com/r/piano/comments/3u6ke7/heres_some_midi_and_mp3_files_for_individual/
//guitar chords taken from https://archive.org/details/GuitarChord-A/4th_String_D.aiff

var video;
var prevImg;
var diffImg;
var currImg;
var thresholdSlider;
var threshold;
var grid;
var isShowing = 0;

var selectMode;
var toggleNotes;

var a3,a3s,a4,a4s,a5,a5s,b3,b4,b5,c3,c3s,c4,c4s,c5,c5s,c6,d3,d3s,d4,d4s,d5,d5s;
var e3,e4,e5,f3,f3s,f4,f4s,f5,f5s,g3,g3s,g4,g4s,g5,g5s;
var piano = [];
var pianoNotes = [];

var g1e, g2b, g3g, g4d, g5a, g6e, gc, gd, gdm, ge;
var guitar = [];
var guitarNotes = [];

function preload() {
  soundFormats('mp3');
  a3 = loadSound('assets/piano/a3.mp3');
  a3s = loadSound('assets/piano/a-3.mp3');
  a4 = loadSound('assets/piano/a4.mp3');
  a4s = loadSound('assets/piano/a-4.mp3');
  a5 = loadSound('assets/piano/a5.mp3');
  a5s = loadSound('assets/piano/a-5.mp3');
  b3 = loadSound('assets/piano/b3.mp3');
  b4 = loadSound('assets/piano/b4.mp3');
  b5 = loadSound('assets/piano/b5.mp3');
  c3 = loadSound('assets/piano/c3.mp3');
  c3s = loadSound('assets/piano/c-3.mp3');
  c4 = loadSound('assets/piano/c4.mp3');
  c4s = loadSound('assets/piano/c-4.mp3');
  c5 = loadSound('assets/piano/c5.mp3');
  c5s = loadSound('assets/piano/c-5.mp3');
  c6 = loadSound('assets/piano/c6.mp3');
  d3 = loadSound('assets/piano/d3.mp3');
  d3s = loadSound('assets/piano/d-3.mp3');
  d4 = loadSound('assets/piano/d4.mp3');
  d4s = loadSound('assets/piano/d-4.mp3');
  d5 = loadSound('assets/piano/d5.mp3');
  d5s = loadSound('assets/piano/d-5.mp3');

  e3 = loadSound('assets/piano/e3.mp3');
  e4 = loadSound('assets/piano/e4.mp3');
  e5 = loadSound('assets/piano/e5.mp3');
  f3 = loadSound('assets/piano/f3.mp3');
  f3s = loadSound('assets/piano/f-3.mp3');
  f4 = loadSound('assets/piano/f4.mp3');
  f4s = loadSound('assets/piano/f-4.mp3');
  f5 = loadSound('assets/piano/f5.mp3');
  f5s = loadSound('assets/piano/f-5.mp3');
  g3 = loadSound('assets/piano/g3.mp3');
  g3s = loadSound('assets/piano/g-3.mp3');
  g4 = loadSound('assets/piano/g4.mp3');
  g4s = loadSound('assets/piano/g-4.mp3');
  g5 = loadSound('assets/piano/g5.mp3');
  g5s = loadSound('assets/piano/g-5.mp3');

  piano.push(a3,a3s,a4,a4s,a5,a5s,b3,b4,b5,c3,c3s,c4,c4s,c5,c5s,c6,d3,d3s,d4,d4s,d5,d5s,e3,e4,e5,f3,f3s,f4,f4s,f5,f5s,g3,g3s,g4,g4s,g5,g5s);

  g1e = loadSound('assets/guitar/1e.mp3');
  g2b = loadSound('assets/guitar/2b.mp3');
  g3g = loadSound('assets/guitar/3g.mp3'); 
  g4d = loadSound('assets/guitar/4d.mp3'); 
  g5a = loadSound('assets/guitar/5a.mp3');
  g6e = loadSound('assets/guitar/6e.mp3');
  gc = loadSound('assets/guitar/c.mp3');
  gd = loadSound('assets/guitar/d.mp3');
  gdm = loadSound('assets/guitar/dm.mp3');
  ge = loadSound('assets/guitar/e.mp3');


  guitar.push(g1e, g2b, g3g, g4d, g5a, g6e, gc, gd, gdm, ge);
}

function setup() {
    createCanvas(640+300, 480);
    pixelDensity(1);

    background(255);
    fill(0);
    rect(670,height/2-height*1/8-10,width*1/4-53, height*1/4+23);

    video = createCapture(VIDEO);
    video.hide();

    thresholdSlider = createSlider(0, 255, 50);
    thresholdSlider.position(20, 20);

    toggleNotes = createButton("Toggle Notes");
    toggleNotes.position(640-110, height-35);
    toggleNotes.mousePressed(buttonPressed);

    selectMode = createSelect();
    selectMode.position(640-80, 20);
    selectMode.option("Piano");
    selectMode.option("Guitar");

    grid = new Grid(640,480);

    pianoNotes.push('a3','a#3','a4','a#4','a5','a#5','b3','b4','b5','c3','c#3','c4','c#4','c5','c#5','c6','d3','d#3','d4','d#4','d5','d#5','e3','e4','e5','f3','f#3','f4','f#4','f5','f#5','g3','g#3','g4','g#4','g5','g#5')
    guitarNotes.push('1e', '2b', '3g', '4d', '5a', '6e', 'c', 'd', 'dm', 'e');

}

function draw() {
    image(video, 0, 0);

    currImg = createImage(video.width, video.height);
    currImg.copy(video, 0, 0, video.width, video.height, 0, 0, video.width, video.height);
    currImg.resize(currImg.width/4,currImg.height/4);
    currImg.filter(BLUR,3);
    
    diffImg = createImage(video.width, video.height);
    diffImg.resize(diffImg.width/4,diffImg.height/4);
    diffImg.loadPixels();

    threshold = thresholdSlider.value();

    if (typeof prevImg !== 'undefined') {
        prevImg.loadPixels();
        currImg.loadPixels();
        for (var x = 0; x < currImg.width; x += 1) {
            for (var y = 0; y < currImg.height; y += 1) {
                var index = (x + (y * currImg.width)) * 4;
                var redSource = currImg.pixels[index + 0];
                var greenSource = currImg.pixels[index + 1];
                var blueSource = currImg.pixels[index + 2];

                var redBack = prevImg.pixels[index + 0];
                var greenBack = prevImg.pixels[index + 1];
                var blueBack = prevImg.pixels[index + 2];

                var d = dist(redSource, greenSource, blueSource, redBack, greenBack, blueBack);


                if (d > threshold) {
                    diffImg.pixels[index + 0] = 0;
                    diffImg.pixels[index + 1] = 0;
                    diffImg.pixels[index + 2] = 0;
                    diffImg.pixels[index + 3] = 255;
                } else {
                    diffImg.pixels[index + 0] = 255;
                    diffImg.pixels[index + 1] = 255;
                    diffImg.pixels[index + 2] = 255;
                    diffImg.pixels[index + 3] = 255;
                }
            }
        }
    }
    diffImg.updatePixels();
    image(diffImg, 680, height/2-height*1/8);

    pop();
    fill(0);
    rect(5,15,190,60);
    fill(255);
    noStroke();
    text(threshold, 160, 35);
    text("Sensitivity of detecting movement:", 10, 50);
    text("0 being very sensitive", 40, 65);
    push();

    copyCurrToPrevImg();

    grid.run(diffImg);

}

function copyCurrToPrevImg(){
    prevImg = createImage(currImg.width, currImg.height);
    prevImg.copy(currImg, 0, 0, currImg.width, currImg.height, 0, 0, currImg.width, currImg.height);
}

function buttonPressed() {
    isShowing = !isShowing;
}

// faster method for calculating color similarity which does not calculate root.
// Only needed if dist() runs slow
function distSquared(x1, y1, z1, x2, y2, z2){
  var d = (x2-x1)*(x2-x1) + (y2-y1)*(y2-y1) + (z2-z1)*(z2-z1);
  return d;
}
