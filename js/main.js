const paleta_site = [
  '#4e57fa',
  '#fd5554',
  '#52fe54',
  '#fbfc01',
  '#57fdfd',
]

const glifos = [
  '@', '&', '¶', '§', '©', '/', '\\', '⬥', '⬦', '¢', '¤', '$', '€', '£', '¥', '≧', '≦', '+', '−', '÷', '=', '≠', '<', '>', '≥', '≤', '±', '≈', '~', '¬', '^', '∞', '∅', 'Ω', '∆', '∏', '∑', '%', '‰', '●', '○', '◆', '◇', '◊', '■', '□', '▪', '▫', '◻', '◼', '▲', '▶', '▼', '◀', '△', '▷', '▽', '◁'
]

const linhas = [
  '_.~"~.',
  '_.~"(',
  'X+',
  '[<O>]',
  '=+',
  '\\/',
  '<>',
  '●○',
  '◆◇',
  '□▪▪',
  '▲▼',
  '△', '▷', '▽', '◁'
]

function colorir() {
  const spans = document.querySelectorAll('.colorido span');
  shuffleArray(paleta_site);
  for (let i = 0; i < spans.length; i++) {
    let index = i % paleta_site.length;
    spans[i].style.backgroundColor = paleta_site[index];
  }
}
colorir();

function separador() {
  const separadores = document.querySelectorAll('.separador');
  shuffleArray(glifos);
  for (let i = 0; i < separadores.length; i++) {
    let index = i % glifos.length;
    separadores[i].innerText = glifos[index];
  }
}
separador();

function divisoria() {
  const divisores = document.querySelectorAll('.divisoria');
  shuffleArray(paleta_site);
  for (let i = 0; i < divisores.length; i++) {
    let index = i % paleta_site.length;
    divisores[i].style.backgroundColor = paleta_site[index];  
  }

  const spans = document.querySelectorAll('.divisoria span');
  shuffleArray(linhas);
  for (let i = 0; i < divisores.length; i++) {
    let index = i % linhas.length;
    let texto = '';
    for(let j = 0; j < 400; j++ ) {
      texto += linhas[index];
    }
    spans[i].innerText = texto;
  }
}
divisoria();

function shuffleArray(arr) {
  arr.sort(() => Math.random() - 0.5);
}

function menu(){
  const botao_menu = document.getElementsByClassName('botao-menu')[0];
  const body = document.getElementsByTagName('body')[0];

  botao_menu.addEventListener('click', function() {
    body.classList.toggle( 'menu-aberto');
  })

}
// menu();