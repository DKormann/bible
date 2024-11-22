
/**  @type {HTMLDivElement} */
let content = document.getElementById('content');


setup();

function setup(){
  content.innerHTML = '';
  fetch ('bible').then(response => {
    response.text().then(text => {
      let links = text.match(/<a href=(.*?)>/g);
      links = links.map(link => link.slice(10, -2));
      links.forEach(link => {
        let p = document.createElement('p');
        p.textContent = link.slice(0, -10);
        p.onclick = () => open_chapter("/bible"+link);
        content.appendChild(p);
      } 
      )
    })
  });
}

function open_chapter(chap_link){

  history.pushState(null, '', chap_link);

  fetch(chap_link).then(response => {
    response.text().then(text => {
      content.innerHTML = text;
    });
  });
}

window.onpopstate = function(event) {
  setup();
};