function filterState() {
  let button = document.getElementById('filter');
  let filter = window.localStorage.getItem('filter');
  if (filter === 'true') {
    button.setAttribute('class', 'btn btn-danger');
    button.textContent = 'Remove filter';
    return 1;
  }
  else if (filter === 'false') {
    button.setAttribute('class', 'btn btn-info');
    button.textContent = 'Set filter';
    return 0;
  }
  else {
    window.localStorage.setItem('filter', true);
    button.setAttribute('class', 'btn btn-danger');
    button.textContent = 'Remove filter';
    return 1;
  }
}

function buttonClick() {
  let filter = window.localStorage.getItem('filter');
  if (filter === 'true') {
    window.localStorage.setItem('filter', false);
    location.reload();
  }
  else {
    window.localStorage.setItem('filter', true);
    location.reload();
  }
}

function paginationElement(num, content) {
  let elem = document.createElement('a');
  elem.setAttribute('class', 'page-link');
  elem.setAttribute('href', '?page=' + num);
  elem.textContent = content;
  return elem;
}

function getImages(page, filter) {
  fetch('http://api.knerli.no/images/?page=' + page + '&filter=' + filter)
    .then((response) => {
      return response.json();
    })
    .then((imageObj) => {
      let canvas = document.getElementById('canvas');
      //Loop over the images and create the grid elements
      imageObj.images.forEach((image) => {
        let div = document.createElement('div');
        div.setAttribute('class', 'col-xs m-3 d-flex justify-content-center');
        div.setAttribute('style', 'width: 200px;');
        
        let link = document.createElement('a');
        link.setAttribute('href', image.url);
        
        let img = document.createElement('img');
        img.setAttribute('src', image.thumbnail);
        
        //Append all the elements to the canvas
        link.append(img);
        div.append(link);
        canvas.append(div);
      });
      
      //Remove the style attrib, this will make the canvas visible
      //Currently not working as intended.
      canvas.removeAttribute('style');
      
      
      let pagination = document.getElementById('pagination');
      let nav = document.createElement('nav');
      let ul = document.createElement('ul');
      
      ul.setAttribute('class', 'pagination justify-content-center');
      
      let firstLink = paginationElement(1, 'First');
      ul.append(firstLink);
      
      if (imageObj.previous) {
        let prevLink = paginationElement(imageObj.previous, 'Previous');
        ul.append(prevLink);
      }
      
      let i;
      
      for (i = imageObj.current_page - 5; i <= imageObj.current_page - 1; i++) {
        if (i <= 0) continue;
        let page = paginationElement(i, String(i));
        ul.append(page);
      }
      
      for (i = imageObj.current_page; i <= imageObj.current_page + 4; i++) {
        if (i > imageObj.number_of_pages) continue;
        let page = paginationElement(i, String(i));
        if (i == imageObj.current_page) {
          page.id = 'currentPage';
        }
        ul.append(page);
      }
      
      if (imageObj.next) {
        let nextLink = paginationElement(imageObj.next, 'Next');
        ul.append(nextLink);
      }
      
      let lastLink = paginationElement(imageObj.number_of_pages, 'Last');
      ul.append(lastLink);

      nav.append(ul);
      pagination.append(nav);
    });
}

function getUrlVars() {
  var vars = [], hash;
  var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
  for (var i = 0; i < hashes.length; i++) {
    hash = hashes[i].split('=');
    vars.push(hash[0]);
    vars[hash[0]] = hash[1];
  }
  return vars;
}

window.onload = function () {
  let q = getUrlVars();
  let filter = filterState();

  if (!q.page) {
    q.page = 1
  }

  getImages(q.page, filter);
}
