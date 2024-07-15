const addModal = document.querySelector('.modal');
const backdrop = document.querySelector('#backdrop');
const bookList = document.querySelector('#book-list');
const deleteModal = document.querySelector('#delete-modal');
const paginationDiv = document.querySelector('#pagination');
const pages = document.querySelector('#pages');
const showMaxSelect = document.querySelector('#showMaxSelect');
const showMaxSelectDiv = document.querySelector('#showMaxSelectDiv');

let books = [];
let bookId = 0;

let paginations = [
  {
    id: 1,
    bookIds: [],
  },
];

let showMaxBook = showMaxSelect.value;
let currentPage = 0;

window.onload = () => {
  if (localStorage.getItem('books') !== null)
    books = JSON.parse(localStorage.getItem('books'));
  else localStorage.setItem('books', JSON.stringify(books));

  if (books.length) {
    hideElement(document.querySelector('#entry-text'));
    bookId = books[books.length - 1].id + 1;

    updatePages();

    renderCurrentPage();
  } else hideElement(showMaxSelectDiv);
};

showMaxSelect.addEventListener('change', (e) => {
  showMaxBook = e.target.value;
  currentPage = 0;
  updatePages();
  renderCurrentPage();
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

    renderCurrentPage();

    hideElement(document.querySelector('#entry-text'));

    btnclose();

    clearInputs();
  } else alert(isValid);
};

const delclick = () => {
  books = [];
  document.querySelectorAll('.book-element').forEach((el) => {
    el.remove();
  });
  localStorage.setItem('books', JSON.stringify(books));

  renderCurrentPage();
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
  bookLi.addEventListener('mouseover', () => {
    bookLi.style.cursor = 'pointer';
  });
  bookLi.addEventListener('mouseout', () => {
    bookLi.style.cursor = 'default';
  });
  bookLi.addEventListener('click', (e) => {
    displayElement(deleteModal);
    backdrop.classList.add('visible');

    deleteModal.children[2].children[0].addEventListener('click', () => {
      hideElement(deleteModal);
      backdrop.classList.remove('visible');
    });

    deleteModal.children[2].children[1].addEventListener(
      'click',
      () => {
        books = books.filter((book) => book.id !== id);
        localStorage.setItem('books', JSON.stringify(books));
        bookLi.remove();

        if (!books.length)
          displayElement(document.querySelector('#entry-text'));

        renderCurrentPage();

        hideElement(deleteModal);
        backdrop.classList.remove('visible');
      },
      { once: true }
    );
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

const loadInitialData = () => {
  localStorage.setItem(
    'books',
    JSON.stringify([
      {
        id: 0,
        title: 'Book 1',
        imageUrl:
          'https://images.rawpixel.com/image_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvcGYtczEyNS0wNC1tb2NrdXBfMS5qcGc.jpg',
        rating: 3,
      },
      {
        id: 1,
        title: 'Book 2',
        imageUrl:
          'https://images.rawpixel.com/image_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvcGYtczEyNS0wNC1tb2NrdXBfMS5qcGc.jpg',
        rating: 5,
      },
      {
        id: 2,
        title: 'Book 3',
        imageUrl:
          'https://images.rawpixel.com/image_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvcGYtczEyNS0wNC1tb2NrdXBfMS5qcGc.jpg',
        rating: 5,
      },
      {
        id: 3,
        title: 'Book 4',
        imageUrl:
          'https://images.rawpixel.com/image_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvcGYtczEyNS0wNC1tb2NrdXBfMS5qcGc.jpg',
        rating: 4,
      },
      {
        id: 4,
        title: 'Book 5',
        imageUrl:
          'https://images.rawpixel.com/image_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvcGYtczEyNS0wNC1tb2NrdXBfMS5qcGc.jpg',
        rating: 1,
      },
      {
        id: 5,
        title: 'Book 6',
        imageUrl:
          'https://images.rawpixel.com/image_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvcGYtczEyNS0wNC1tb2NrdXBfMS5qcGc.jpg',
        rating: 4,
      },
      {
        id: 6,
        title: 'Book 7',
        imageUrl:
          'https://images.rawpixel.com/image_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvcGYtczEyNS0wNC1tb2NrdXBfMS5qcGc.jpg',
        rating: 2,
      },
    ])
  );
};

loadInitialData();
