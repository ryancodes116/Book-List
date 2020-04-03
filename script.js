// Cache DOM
const form = document.getElementById('book-form');
const submitButton = document.getElementById('submit');
const bookList = document.getElementById('book-list');

class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

class UI {
  updateList(book) {
    // Create row
    const row = document.createElement('tr');
    // Add row data
    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td><a href="#" class="delete">X</a></td>
    `;
    // Append row to table body
    bookList.appendChild(row);
  }

  clearInputs() {
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('isbn').value = '';
  }
}

// Local storage class
class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem('books') === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }

    return books;
  }

  static displayBooks() {
    const books = Store.getBooks();
    books.forEach(function (book) {
      const ui = new UI();
      // Add book to UI
      ui.updateList(book);
    });
  }

  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = Store.getBooks();
    books.forEach(function (book, index) {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });
    localStorage.setItem('books', JSON.stringify(books));
  }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', Store.displayBooks);
form.addEventListener('submit', addBook);
bookList.addEventListener('click', removeBook);

// Remove Book
function removeBook(e) {
  if (e.target.className === 'delete') {
    e.target.parentElement.parentElement.remove();
    Store.removeBook(e.target.parentElement.previousElementSibling.innerText);
  }
}

// Add Book
function addBook(e) {
  // Get inputs
  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;
  const isbn = document.getElementById('isbn').value;

  // Validate form
  if (validateForm(title, author, isbn)) {
    // Instantiate Book class
    const book = new Book(title, author, isbn);

    // Instantiate UI class
    const ui = new UI();

    // Add book
    ui.updateList(book);

    // Add to LS
    Store.addBook(book);

    // Show message
    showMessage('Book added!', 'success');
  } else {
    showMessage('Please complete all fields', 'danger');
  }

  // Clear inputs
  const ui = new UI();
  ui.clearInputs();

  // Prevent form submit default
  e.preventDefault();
}

// Show message
function showMessage(msg, color) {
  // Grab container
  const container = document.querySelector('.col');
  // Create div
  const div = document.createElement('div');
  // Add message
  div.innerHTML = msg;
  // Add class
  div.className = `alert alert-${color}`;
  // Insert alert before form
  container.insertBefore(div, form);
  // Remove alert after 3 seconds
  setTimeout(removeAlert, 3000);
}

// Remove alert
function removeAlert() {
  document.querySelector('.alert').remove();
}

// Validate form
function validateForm(title, author, isbn) {
  return title !== '' && author !== '' && isbn !== '';
}
