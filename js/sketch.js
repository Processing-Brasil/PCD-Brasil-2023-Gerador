/******************
Código original por Vamoss:
https://www.openprocessing.org/sketch/818943

******************/

/* PARAMETROS DE ENTRADA */

const paleta = [
  '#000000',
  '#4e57fa',
  '#fd5554',
  '#52fe54',
  '#fbfc01',
  '#57fdfd',
]

const chars = [  
  '●●●●●○○○○○',
  '%%%%::::....',
  '#%$^&*()_+!',
  '↑↗→↘↓↙←↖',
  '█▓▒░ ',
  '█▊▋▌▍▎▏ ',
  '▖▗▘▙▚▛▜▝▞▟',
  '♠♥♦♣',
];

const emojis = [
  ['📘','📘','📕','📕','📗','📗'],
  ['🖤','🤎','💜','💙','💚','🧡','💛','❤','🤍'],
  ['😭','🙁','😔','😑','😐','🙂','😊','😄','😁'],
  ['🐵','🐶','🐺','🦊','🦝','🐱','🦁','🐯','🐴','🦄','🦓','🐮','🐷','🐗','🦒','🐭','🐹','🐰','🐻','🐨','🐼','🐔','🐸','🐠','🐌','🦋','🐛','🐜','🐝'],
  ['🌹','🌹','🌻','🌼','🌷','🌷'],
  ['⛈','🌤','🌥','🌦','🌧','🌨','🌩'],
  ['🍇','🍉','🍊','🍋','🍌','🍍','🥭','🍎','🍐','🍑','🍒','🍓'],
  ['⚽','⚾','🥎','🏀','🏐','🏈','🏉','🎱'],
  ['📞','📟','📠','🔋','🔌','💻','💽','💾','💿','📀','🧮','🎥','📺','📸','📹','📼'],
]

const modes = [
  'noise',
  'camera',
  'draw',
]
let mode = modes[1];
let grid_size_ref = 20;

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

/* INTERFACE */

let radio_symbols;
let btn_camera;
let btn_save;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
	canvas.parent("p5js-container");

  init();

	textAlign(CENTER, CENTER);
  textSize(cell_size * 0.8);

	camera = createCapture(VIDEO);
	camera.size(camWidth, camHeight);
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
  radio_symbols.option('?','?');
  radio_symbols.selected('?');

  for(let i = 0; i < symbols.length; i++) {
    let label = symbols[i][2];
    radio_symbols.option(i, label);
  }
  
  btn_save = createButton('Salvar Imagem');
  btn_save.mousePressed(save_image);

}

function draw() {

  if (radio_symbols.value() == '?') {
    chars_index = floor((frameCount * 0.01) % symbols.length);
  } else {
    chars_index = parseInt(radio_symbols.value());
  }

  if( mode == 'noise') {
    for(let x = 0; x < grid_columns; x++) {
      for(let y = 0; y < grid_rows; y++) {
        let n = noise(x*0.07,y*0.07, frameCount*0.007);
        let c = map(n, 0, 0.7, 0, 255);
        buffer.stroke(c);

        if ((x+y*grid_columns)%2 == 0) {
          buffer.stroke(255, 0, 0);
        } else {
          buffer.stroke(0, 100, 0);
        }
        buffer.point(x,y);
      }
    }
  }

  if( mode == 'camera') {
    buffer.image(camera, 0, 0, grid_columns, grid_rows);
  }

 	imageToAscii(buffer);
  image(buffer, width/2, height/2, buffer.width * 10, buffer.height * 10)
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function init() {
  proportion = windowWidth / windowHeight;
  grid_columns = floor(proportion * grid_size_ref);
  cell_size = windowWidth/grid_columns;
  grid_rows = ceil(windowHeight / cell_size);
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
      fill(cinza * 255);
      
      strokeWeight(2);
      stroke(paleta[cor]);
      rect(x, y, cell_size, cell_size)

      fill(0);
      noStroke();
			// text(glifo, x + cell_size * 0.5, y + cell_size * 0.5);
		}
	}
}

function save_image() {
  timestamp = (+new Date).toString(36);
  save(canvas, timestamp + 'png');
}