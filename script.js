
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

let touchstartX = 0;
let touchendX = 0;

content.addEventListener('touchstart', e => {
  touchstartX = e.changedTouches[0].screenX;
}
, false);

content.addEventListener('touchend', e => {
  touchendX = e.changedTouches[0].screenX;
  handleGesture();
}
, false);

function handleGesture() {
  if (touchendX < touchstartX - 50) {
    open_chapter(current_chapter + 1);
  }

  if (touchendX > touchstartX + 50) {
    open_chapter(current_chapter - 1);
  }
}