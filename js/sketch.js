/******************
Código original por Vamoss:
https://www.openprocessing.org/sketch/818943

******************/

/* PARAMETROS DE ENTRADA */

let opcoes = {
  paleta: [
    '#000000',
    '#4e57fa',
    '#fd5554',
    '#52fe54',
    '#fbfc01',
    '#57fdfd',
  ],
  chars: [  
    '●●●●●○○○○○',
    '#%$^&*()_+!',
    '↑↗→↘↓↙←↖',
    '█▓▒░ ',
    '█▊▋▌▍▎▏ ',
    '▖▗▘▙▚▛▜▝▞▟',
    '♠♥♦♣',
    'Ñ@#W$9876543210?!abc;:+=-,._ '
  ],
  emojis: [
    ['🖤','🤎','💜','💙','💚','🧡'],
    ['🙁','😑','🙂','😊','😄','😁'],
    ['🐵','🐶','🐺','🦊','🦝','🐱'],
    ['🐯','🐴','🦓','🐮','🐷','🐗'],
    ['🦒','🐭','🐰','🐻','🐨','🐼'],
    ['🐔','🐸','🐠','🐌','🐜','🐝'],
    ['🌹','🌹','🌻','🌼','🌷','🌷'],
    ['⛈','🌤','🌥','🌦','🌧','🌨','🌩'],
    ['🍇','🍉','🍊','🍋','🍌','🍐'],
    ['🍍','🥭','🍎','🍑','🍒','🍓'],
    ['⚽','⚾','🥎','🏀','🏐','🎱'],
    ['💻','📸','💽','💾','💿','📀'],
    // ['📞','📟','📠','🔋'],
    // ['🔌','🧮'],
    // ['🎥','📺','📹','📼'],
    // ['📅','2','12','📅','2','12']
  ],
  modo: 3,
  grid_size_ref: 10,//14,//10, //16,
  frames: 900,
  formato: {
    width: 1080,
    height: 1080,
  },
  overlay: 'overlay-streamyard-vinheta-aguardando.png',
  imagem: 'BarbaraDanielaJésusRenato.jpg',
}

/* SETUP */

const paleta = opcoes.paleta;
const chars = opcoes.chars;
const emojis = opcoes.emojis;

const modes = [
  'noise',
  'camera',
  'draw',
  'imagem'
]
let mode = modes[opcoes.modo];
let grid_size_ref = opcoes.grid_size_ref;
let frames = opcoes.frames;
let formato = {
  width: opcoes.formato.width,
  height: opcoes.formato.height,
}
let t;
let contador = 0;
let playing = true;
let semente = 0;

/* PARAMETROS ASCII */
let canvas;
let symbols;
let chars_index = 0;
let proportion;
let grid_columns, grid_rows;
let cell_size;
let buffer;
const maxColor = 765;// 255*3

/* PARAMETROS VIDEO */
let camera;
const camWidth = 320;
const camHeight = 240;
let overlay;
let overlaying = false;

/* INTERFACE */

let radio_symbols;
let btn_camera;
let btn_save;
let btn_save_video;
let btn_play_pause;
let btn_overlay;

P5Capture.setDefaultOptions({
  format: "jpg",
  framerate: 30,
  duration: frames,
  // disableUi: true,
});

function preload() {
  overlay = loadImage('../images/' + opcoes.overlay);
  imagem = loadImage('../images/' + opcoes.imagem)
}

function setup() {
  // canvas = createCanvas(windowWidth, windowHeight);
  canvas = createCanvas(formato.width, formato.height);
	canvas.parent("p5js-container");
  pixelDensity(1);

  init();

	textAlign(CENTER, CENTER);
  textSize(cell_size * 0.65);

	// camera = createCapture(VIDEO);
	// camera.size(camWidth, camHeight);
	// camera.hide();

  symbols = [];
  chars.forEach(c => {
    c = c.split('');
    symbols.push(c);
  });
  emojis.forEach(e => {
    symbols.push(e);
  });
  symbols = shuffle(symbols);

  radio_symbols = createRadio();
  radio_symbols.parent("interface");
  radio_symbols.elt.classList.add("radios");
  radio_symbols.option('?','?');
  radio_symbols.selected('?');

  for(let i = 0; i < symbols.length; i++) {
    let label = symbols[i][2];
    radio_symbols.option(i, label);
  }
  
  btn_save = createButton('Salvar Imagem');
  btn_save.parent("interface");
  btn_save.mousePressed(save_image);

  btn_save_video = createButton('Salvar vídeo');
  btn_save_video.parent("interface");
  btn_save_video.mousePressed(save_video);

  btn_play_pause = createButton('Play & Pause');
  btn_play_pause.parent("interface");
  btn_play_pause.mousePressed(function(){ playing =! playing;});

  btn_overlay = createButton('Overlay');
  btn_overlay.parent("interface");
  btn_overlay.mousePressed(function(){ overlaying =! overlaying;});
  

  capture = P5Capture.getInstance();

}

function draw() {

  t = map(contador-1, 0, frames, 0, 1);

  if (radio_symbols.value() == '?') {
    chars_index = floor((contador * 0.01) % symbols.length);
  } else {
    chars_index = parseInt(radio_symbols.value());
  }

  if( mode == 'noise') {

    for(let x = 0; x < grid_columns; x++) {
      for(let y = 0; y < grid_rows; y++) {

        let xoff = cos(TWO_PI * t);
        let yoff = cos(TWO_PI * t);

        let n = noise(x*0.07 + xoff , y*0.07 + yoff);
        let c = map(n, 0, 0.7, 0, 255);
        buffer.stroke(c);
        buffer.point(x,y);
      }
    }
  }

  if( mode == 'camera') {
    buffer.image(camera, 0, 0, grid_columns, grid_rows);
  }

  if( mode == 'imagem') {
    buffer.image(imagem, 0, 0, grid_columns, grid_rows);
  }

 	imageToAscii(buffer);
  // image(buffer, width/2, height/2, buffer.width * 10, buffer.height * 10)
  
  if (overlaying) {
    image(overlay, 0, 0, width, height);
  }
  
  if( playing ) {
    contador++;
  } 
}

function windowResized() {
  // resizeCanvas(windowWidth, windowHeight);
}

function init() {
  proportion = formato.width / formato.height;
  grid_columns = floor(proportion * grid_size_ref);
  cell_size = formato.width / grid_columns;
  grid_rows = ceil(formato.height / cell_size);
  buffer = createGraphics(grid_columns, grid_rows);
}

function imageToAscii(c) {
  c.loadPixels();
	for (let j = 0; j < grid_rows; j++) {
		for (let i = 0; i < grid_columns; i++) {
			const pixelIndex = (i + j * grid_columns) * 4;
			const r = c.pixels[pixelIndex];
			const g = c.pixels[pixelIndex + 1];
			const b = c.pixels[pixelIndex + 2];
      let cinza = (r+g+b) / maxColor;
			let glifo_index = floor(cinza * (symbols[chars_index].length-1));
      let glifo = symbols[chars_index][glifo_index];
      let cor = floor(cinza * (paleta.length-1));
      let x = i * cell_size;
      let y = j * cell_size;
      fill(paleta[cor]);      
      strokeWeight(2);
      stroke(paleta[cor]);
      rect(x, y, cell_size, cell_size)

      fill(0);
      noStroke();
			text(glifo, x + cell_size * 0.5, y + cell_size * 0.5);
		}
	}
}

function save_image() {
  timestamp = (+new Date).toString(36);
  save(canvas, timestamp + 'png');
}

function save_video() {
  if (capture.state === "idle") {
    contador = 0;
    capture.start({
      // format: selectFormato.value,
      framerate: 30,
      duration: frames,
      verbose: true
    });
  } else {
    capture.stop();
  }
}