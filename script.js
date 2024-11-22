
/**  @type {HTMLDivElement} */
let content = document.getElementById('content');

/** @type {HTMLElement} */
let header = document.querySelector('h2')

header.onclick = () => window.location = './';

/** @type {string[]} */
let links

/** @type {number} */
let current_chapter = 0;



setup();

function setup(){
  content.innerHTML = '';
  fetch('bible/chapter_list').then(response => {
    response.text().then(text => {
      links = text.split('\n');
      links.forEach((l, i ) => {
        let p = document.createElement('p');
        p.style.cursor = 'pointer';
        p.textContent = l.slice(0, -10);
        p.onclick = () => open_chapter(i);
        content.appendChild(p);
      })

      if (location.search){
        current_chapter = parseInt(location.search.slice(9));
        open_chapter(current_chapter);
      }
    })
  })

}

function open_chapter(chapidx){

  current_chapter = chapidx;
  chap_link = "./bible/"+links[chapidx];
  fetch(chap_link).then(response => {
    response.text().then(text => content.innerHTML = text);
  });
  history.pushState(null, '', '?chapter='+chapidx);

  window.scrollTo(window.scrollX, 0);

}

window.onpopstate = function(event) {
  setup();
};

window.addEventListener('keydown', e => {
  if (e.key == 'ArrowRight'){
    open_chapter(current_chapter + 1);
  } else if (e.key == 'ArrowLeft'){
    open_chapter(current_chapter - 1);
  }
})

// for mobile

let touchstart = {x: 0, y: 0};

content.addEventListener('touchstart', e => {
  touchstart = {x: e.changedTouches[0].screenX, y: e.changedTouches[0].screenY};
}
, false);

content.addEventListener('touchend', e => {
  handleGesture({x: e.changedTouches[0].screenX, y: e.changedTouches[0].screenY});
}
, false);

function handleGesture(end) {
  let dx = end.x - touchstart.x;
  let dy = end.y - touchstart.y;

  if (Math.abs(dx) > Math.abs(dy)){
    if (dx > 0){
      open_chapter(current_chapter - 1);
    } else {
      open_chapter(current_chapter + 1);
    }
  }
}