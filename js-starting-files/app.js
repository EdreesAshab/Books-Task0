const addModal = document.querySelector('.modal');
const backdrop = document.querySelector('#backdrop');
const bookList = document.querySelector('#book-list');
const deleteModal = document.querySelector('#delete-modal');
const deleteAllModal = document.querySelector('#deleteAll-modal');
const deleteBooksBtn = document.querySelector('#deleteBooks');
const paginationDiv = document.querySelector('#pagination');
const pages = document.querySelector('#pages');
const showMaxSelect = document.querySelector('#showMaxSelect');
const showMaxSelectDiv = document.querySelector('#showMaxSelectDiv');

let books = [];
let bookId = 0;

let showMaxBook = showMaxSelect.value;
let currentPage = 0;

let deleteId = -1;

window.onload = () => {
  if (localStorage.getItem('books') !== null)
    books = JSON.parse(localStorage.getItem('books'));
  else localStorage.setItem('books', JSON.stringify(books));

  if (books.length) {
    hideElement(document.querySelector('#entry-text'));
    bookId = books[books.length - 1].id + 1;

    updatePages();

    renderCurrentPage();
  } else {
    deleteBooksBtn.setAttribute('disabled', 'disabled');
    hideElement(showMaxSelectDiv);
  }
};

showMaxSelect.addEventListener('change', (e) => {
  showMaxBook = e.target.value;
  currentPage = 0;
  updatePages();
  renderCurrentPage();
});

document.querySelector('#cancelDelete').addEventListener('click', () => {
  hideElement(deleteModal);
  backdrop.classList.remove('visible');
  deleteId = -1;
});

document.querySelector('#confirmDelete').addEventListener('click', () => {
  books = books.filter((book) => book.id !== deleteId);
  localStorage.setItem('books', JSON.stringify(books));
  document.querySelector(`#book${deleteId}`).remove();

  if (!books.length) displayElement(document.querySelector('#entry-text'));

  renderCurrentPage();

  hideElement(deleteModal);
  backdrop.classList.remove('visible');

  deleteId = -1;
});

const btnclick = () => {
  addModal.classList.add('visible');
  backdrop.classList.add('visible');
};

const btnclose = () => {
  addModal.classList.remove('visible');
  backdrop.classList.remove('visible');
  clearInputs();
};

const additem = () => {
  const title = document.querySelector('#title').value;
  let imageUrl = document.querySelector('#image-url').value;
  const rating = document.querySelector('#rating').value;

  if (imageUrl === '')
    imageUrl =
      'https://images.rawpixel.com/image_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvcGYtczEyNS0wNC1tb2NrdXBfMS5qcGc.jpg';

  const isValid = validateNewBook(title, imageUrl, rating);

  if (isValid === true) {
    const newBook = {
      id: bookId++,
      title,
      imageUrl,
      rating,
    };

    books.push(newBook);

    localStorage.setItem('books', JSON.stringify(books));

    updatePages();

    displayElement(showMaxSelectDiv);

    hideElement(document.querySelector('#entry-text'));

    renderCurrentPage();

    btnclose();

    clearInputs();
  } else alert(isValid);
};

const delclick = () => {
  displayElement(deleteAllModal);
  backdrop.classList.add('visible');

  document.querySelector('#cancelDeleteAll').addEventListener('click', () => {
    hideElement(deleteAllModal);
    backdrop.classList.remove('visible');
  });

  document.querySelector('#confirmDeleteAll').addEventListener('click', () => {
    books = [];
    document.querySelectorAll('.book-element').forEach((el) => {
      el.remove();
    });
    localStorage.setItem('books', JSON.stringify(books));

    hideElement(deleteAllModal);
    backdrop.classList.remove('visible');

    currentPage = 0;

    renderCurrentPage();
  });
};

const validateNewBook = (title, imageUrl, rating) => {
  if (!title) return 'Empty Title';
  else if (!isValidUrl(imageUrl)) return 'Invalid URL';
  else if (rating < 1 || rating > 5)
    return 'Rating should be between 1 and 5 inclusive';

  return true;
};

const isValidUrl = (urlString) => {
  var urlPattern = new RegExp(
    '^(https?:\\/\\/)?' + // validate protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // validate domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // validate OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // validate port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // validate query string
      '(\\#[-a-z\\d_]*)?$',
    'i'
  ); // validate fragment locator
  return !!urlPattern.test(urlString);
};

const displayElement = (el) => {
  el.style.display = 'block';
};

const hideElement = (el) => {
  el.style.display = 'none';
};

const clearInputs = () => {
  document.querySelector('#title').value = '';
  document.querySelector('#image-url').value = '';
  document.querySelector('#rating').value = '';
};

const buildBookElement = ({ id, title, imageUrl, rating }) => {
  const bookLi = document.createElement('li');
  bookLi.classList.add('book-element');
  bookLi.setAttribute('id', `book${id}`);
  bookLi.addEventListener('mouseover', () => {
    bookLi.style.cursor = 'pointer';
  });
  bookLi.addEventListener('mouseout', () => {
    bookLi.style.cursor = 'default';
  });
  bookLi.addEventListener('click', () => {
    displayElement(deleteModal);
    backdrop.classList.add('visible');
    deleteId = id;
  });

  const imageDiv = document.createElement('div');
  imageDiv.classList.add('book-element__image');

  const bookImg = document.createElement('img');
  bookImg.setAttribute('src', imageUrl);
  imageDiv.appendChild(bookImg);

  bookLi.appendChild(imageDiv);

  const infoDiv = document.createElement('div');
  infoDiv.classList.add('book-element__info');

  const titleH2 = document.createElement('h2');
  titleH2.textContent = title;
  infoDiv.appendChild(titleH2);

  const ratingP = document.createElement('p');
  ratingP.textContent = `${rating}/5`;
  infoDiv.appendChild(ratingP);

  bookLi.appendChild(infoDiv);

  return bookLi;
};

const renderCurrentPage = () => {
  document.querySelectorAll('.book-element').forEach((el) => {
    el.remove();
  });
  document.querySelectorAll('.pageBtn').forEach((el) => {
    el.remove();
  });

  if (books.length) {
    deleteBooksBtn.removeAttribute('disabled');

    if (books.length === showMaxBook * currentPage) currentPage--;

    updatePages();

    for (
      let i = 0;
      i < showMaxBook && i + showMaxBook * currentPage < books.length;
      i++
    ) {
      bookList.appendChild(
        buildBookElement(books[i + showMaxBook * currentPage])
      );
    }
  } else {
    displayElement(document.querySelector('#entry-text'));
    hideElement(showMaxSelectDiv);
    deleteBooksBtn.setAttribute('disabled', 'disabled');
  }
};

const updatePages = () => {
  for (let i = 0; i < Math.ceil(books.length / showMaxBook); i++) {
    const pageBtn = document.createElement('button');
    pageBtn.className = 'pageBtn';
    pageBtn.textContent = i + 1;

    if (currentPage === i) pageBtn.setAttribute('disabled', 'disabled');

    pageBtn.addEventListener('click', () => {
      currentPage = i;
      renderCurrentPage();
    });
    pages.appendChild(pageBtn);
  }
};

const loadInitialData = (count = 7) => {
  const data = [];
  for (let i = 0; i < count; i++)
    data.push({
      id: i,
      title: `Book ${i + 1}`,
      imageUrl:
        'https://images.rawpixel.com/image_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvcGYtczEyNS0wNC1tb2NrdXBfMS5qcGc.jpg',
      rating: Math.floor(Math.random() * 5 + 1),
    });

  localStorage.setItem('books', JSON.stringify(data));
};

loadInitialData();
