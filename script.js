document.addEventListener("DOMContentLoaded", function () {
  const inputBook = document.getElementById("inputBook");
  const bookSubmit = document.getElementById("bookSubmit");
  const incompleteBookshelfList = document.getElementById(
    "incompleteBookshelfList"
  );
  const completeBookshelfList = document.getElementById(
    "completeBookshelfList"
  );

  let books = [];

  const storedBooks = localStorage.getItem("books");
  if (storedBooks) {
    books = JSON.parse(storedBooks);
  }

  function saveBooksToLocalStorage() {
    localStorage.setItem("books", JSON.stringify(books));
  }

  inputBook.addEventListener("submit", function (e) {
    e.preventDefault();

    const inputBookTitle = document.getElementById("inputBookTitle").value;
    const inputBookAuthor = document.getElementById("inputBookAuthor").value;
    const inputBookYear = Number(
      document.getElementById("inputBookYear").value
    );
    const inputBookIsComplete = document.getElementById(
      "inputBookIsComplete"
    ).checked;

    const isDuplicate = books.some((book) => book.title === inputBookTitle);

    if (isDuplicate) {
      alert("A book with the same title already exists in the list.");
    } else {
      const book = {
        id: new Date().getTime(),
        title: inputBookTitle,
        author: inputBookAuthor,
        year: inputBookYear,
        isComplete: inputBookIsComplete,
      };

      books.push(book);
      saveBooksToLocalStorage();

      updateBookshelf();

      document.getElementById("inputBookTitle").value = "";
      document.getElementById("inputBookAuthor").value = "";
      document.getElementById("inputBookYear").value = "";
      document.getElementById("inputBookIsComplete").checked = false;
    }
  });

  function updateBookshelf() {
    incompleteBookshelfList.innerHTML = "";
    completeBookshelfList.innerHTML = "";

    for (const book of books) {
      const bookItem = createBookItem(book);
      if (book.isComplete) {
        completeBookshelfList.appendChild(bookItem);
      } else {
        incompleteBookshelfList.appendChild(bookItem);
      }
    }
  }

  function removeBook(id) {
    const index = books.findIndex((book) => book.id === id);
    if (index !== -1) {
      books.splice(index, 1);
      saveBooksToLocalStorage();
      updateBookshelf();
    }
  }

  function toggleIsComplete(id) {
    const index = books.findIndex((book) => book.id === id);
    if (index !== -1) {
      books[index].isComplete = !books[index].isComplete;
      saveBooksToLocalStorage();
      updateBookshelf();
    }
  }

  const searchBook = document.getElementById("searchBook");
  const searchBookTitle = document.getElementById("searchBookTitle");

  searchBook.addEventListener("submit", function (e) {
    e.preventDefault();
    const query = searchBookTitle.value.toLowerCase().trim();

    const searchResults = books.filter((book) => {
      return (
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.year.toString().includes(query)
      );
    });

    updateSearchResults(searchResults);
  });

  function updateSearchResults(results) {
    incompleteBookshelfList.innerHTML = "";
    completeBookshelfList.innerHTML = "";

    for (const book of results) {
      const bookItem = createBookItem(book);
      if (book.isComplete) {
        completeBookshelfList.appendChild(bookItem);
      } else {
        incompleteBookshelfList.appendChild(bookItem);
      }
    }
  }

  function createBookItem(book) {
    const bookItem = document.createElement("article");
    bookItem.className = "book_item";

    const actionButtons = document.createElement("div");
    actionButtons.className = "action";

    const title = document.createElement("h3");
    title.textContent = book.title;

    const author = document.createElement("p");
    author.textContent = "Penulis: " + book.author;

    const year = document.createElement("p");
    year.textContent = "Tahun: " + book.year;

    const removeButton = createActionButton("Hapus buku", "red", function () {
      removeBook(book.id);
    });

    let toggleButton;
    if (book.isComplete) {
      toggleButton = createActionButton(
        "Belum selesai di Baca",
        "blue",
        function () {
          toggleIsComplete(book.id);
        }
      );
    } else {
      toggleButton = createActionButton("Selesai dibaca", "green", function () {
        toggleIsComplete(book.id);
      });
    }

    actionButtons.appendChild(toggleButton);
    actionButtons.appendChild(removeButton);

    bookItem.appendChild(title);
    bookItem.appendChild(author);
    bookItem.appendChild(year);
    bookItem.appendChild(actionButtons);

    return bookItem;
  }

  function createActionButton(text, className, clickHandler) {
    const button = document.createElement("button");
    button.textContent = text;
    button.classList.add(className);
    button.addEventListener("click", clickHandler);
    return button;
  }

  updateBookshelf();
});
