const BOOKS_DATABASE = [
  { name: "The Hunger Games", author: "Suzanne Collins", publisher: "Alfa", pages: 478, serial: 1 },
  { name: "Harry Potter", author: "J.K. Rowling", publisher: "Beta", pages: 398, serial: 2 },
  { name: "To Kill a Mockingbird", author: "Harper Lee", publisher: "Omega", pages: 685, serial: 3 },
  { name: "Pride and Prejudice", author: "Jane Austen", publisher: "Sky", pages: 425, serial: 4 },
  { name: "Twilight", author: "Stephenie Meyer", publisher: "Sun", pages: 556, serial: 5 },
  { name: "The Book Thief", author: "Markus Zusak", publisher: "Child", pages: 475, serial: 6 },
  { name: "Narnia", author: "C.S. Lewis", publisher: "Alfa", pages: 358, serial: 7 },
  { name: "Animal Farm", author: "George Orwell", publisher: "Dog", pages: 277, serial: 8 },
  { name: "Les Misérables", author: "Victor Hugo", publisher: "Dog", pages: 369, serial: 9 },
  { name: "The Alchemist", author: "Paulo Coelho", publisher: "Omega", pages: 247, serial: 10 },
  { name: "The Help", author: "Kathryn Stockett", publisher: "Clock", pages: 159, serial: 11 },
  { name: "Charlotte's Web", author: "E.B. White", publisher: "Book", pages: 437, serial: 12 },
  { name: "Dracula", author: "Bram Stoker", publisher: "Beta", pages: 346, serial: 13 },
  { name: "Muna Madan", author: "Laxmi Prasad Devkota", publisher: "Sajha Prakashan", pages: 60, serial: 14 },
  { name: "Seto Bagh", author: "Diamond Shumsher Rana", publisher: "Sajha Prakashan", pages: 328, serial: 15 },
  { name: "Shirishko Phool", author: "Bishnu Kumari Waiba", publisher: "Sajha Prakasan", pages: 118, serial: 16 },
  { name: "Karnali Blues", author: "Buddhi Sagar", publisher: "FinePrint Publications", pages: 397, serial: 17 },
  { name: "Palpasa Cafe", author: "Narayan Wagle", publisher: "FinePrint Publications", pages: 250, serial: 18 },
  { name: "China Harayeko Manche", author: "Hari Bansha Acharya", publisher: "Fineprint Publications", pages: 278, serial: 19 },
  { name: "Phoolko Aankhaama", author: "Ani Choying Dolma", publisher: "Lama Publications", pages: 228, serial: 20 },
  { name: "Summer Love", author: "Subin Bhattarai", publisher: "FinePrint Publications", pages: 247, serial: 21 },
  { name: "Chhinnamasta", author: "B.P. Koirala", publisher: "Ratna Pustak Bhandar", pages: 180, serial: 22 },
  { name: "Ghanchakkar", author: "Satya Mohan Joshi", publisher: "Book Hill Publications", pages: 180, serial: 23 },
  { name: "1984", author: "George Orwell", publisher: "Signet Classic", pages: 328, serial: 24 },
  { name: "Basain", author: "Lil Bahadur Chettri", publisher: "Sajha Prakashan", pages: 62, serial: 25 },
  { name: "Sumnima", author: "B.P. Koirala", publisher: "Sajha Publications", pages: 94, serial: 26 },
  { name: "Seto Bagh", author: "Diamond Shumsher Rana", publisher: "Ratna Pustak Bhandar", pages: 352, serial: 27 },
  { name: "Antarmanko Yatra", author: "Jagadish Ghimire", publisher: "Jagadish Ghimire Pratisthan", pages: 297, serial: 28 },
  { name: "Khusi", author: "Vijay Kumar Pandey", publisher: "FinePrint Publications", pages: 332, serial: 29 },
  { name: "Khalangama Hamala", author: "Radha Paudel", publisher: "Nepalaya Publications", pages: 135, serial: 30 },
  { name: "Ranahar", author: "Yogesh Raj", publisher: "Nepalaya Publications", pages: 151, serial: 31 },
  { name: "Yogmaya", author: "Neelam Karki Niharika", publisher: "Sangrila", pages: 503, serial: 32 },
  { name: "Dhritarashtra", author: "Ghanshyam Kandel", publisher: "Airawati Prakashan", pages: 96, serial: 33 },
  { name: "Aina", author: "Ramlal Joshi", publisher: "Brother Books", pages: 255, serial: 34 },
  { name: "Damini Bhir", author: "Rajan Mukarung", publisher: "Phoenix Books", pages: 290, serial: 35 },
  { name: "Chhapamar ko Chhoro", author: "Mahesh Bikram Shah", publisher: "Sajha Prakashan / FinePrint", pages: 124, serial: 36 },
  { name: "Aaithan", author: "Bibek Ojha", publisher: "Sangri-La Books", pages: 386, serial: 37 },
  { name: "Umaal", author: "Chuden Kabimo", publisher: "Publisher unspecified", pages: 300, serial: 38 },
  { name: "Mukam Ranamaidan", author: "Mohan Mainali", publisher: "Publisher unspecified", pages: 320, serial: 39 },
  { name: "Maharani", author: "Chandra Prakash Baniya", publisher: "Publisher unspecified", pages: 368, serial: 40 },
  { name: "Khalang-ko Mukti Yuddha", author: "Various Authors", publisher: "Publisher unspecified", pages: 280, serial: 41 },
  { name: "Pincho Jhin", author: "Vijay Kumar Pandey", publisher: "FinePrint", pages: 300, serial: 42 },
  { name: "Palace of Illusions (Nepali trans.)", author: "Ashok Banker", publisher: "FinePrint", pages: 320, serial: 43 },
  { name: "Karnali Ko Ghumti", author: "Buddhisagar", publisher: "FinePrint", pages: 350, serial: 44 },
  { name: "Jiwan Kada Ki Phool", author: "Jhamak Ghimire", publisher: "FinePrint", pages: 290, serial: 45 },
  { name: "Nepal ko Arthik Itihas", author: "Various Authors", publisher: "Publisher unspecified", pages: 410, serial: 46 },
  { name: "Galapada (Science)", author: "Various Authors", publisher: "Publisher unspecified", pages: 200, serial: 47 },
  { name: "Nepali Grammar", author: "Basant Subedi", publisher: "Publisher unspecified", pages: 180, serial: 48 },
  { name: "Nepali-English Dictionary", author: "Ratna Pustak Mandir", publisher: "Ratna Pustak Mandir", pages: 500, serial: 49 },
  { name: "Malati Ko Sapana", author: "Madhav Prasad Ghimire", publisher: "Sajha Prakashan", pages: 80, serial: 50 },
  { name: "Nepal ko Sambidhan (2015)", author: "Constituent Assembly", publisher: "Government of Nepal", pages: 408, serial: 51 },
  { name: "Gauri", author: "Madhav Prasad Ghimire", publisher: "Sajha Prakashan", pages: 600, serial: 52 },
  { name: "Nepal ko Itihas (Vol. 1)", author: "Satish C. Subedi", publisher: "Publisher unspecified", pages: 520, serial: 53 },
  { name: "Himalayan Odyssey", author: "Narayan Wagle", publisher: "FinePrint", pages: 275, serial: 54 },
  { name: "The Ministry of Time", author: "Kaliane Bradley", publisher: "Sceptre/Avid Reader Press", pages: 416, serial: 55 },
  { name: "The Great Gatsby", author: "F. Scott Fitzgerald", publisher: "Charles Scribner's Sons", pages: 180, serial: 56 },
  { name: "The Catcher in the Rye", author: "J.D. Salinger", publisher: "Little, Brown and Company", pages: 277, serial: 57 },
  { name: "Moby-Dick", author: "Herman Melville", publisher: "Harper & Brothers", pages: 585, serial: 58 },
  { name: "War and Peace", author: "Leo Tolstoy", publisher: "The Russian Messenger", pages: 1225, serial: 59 },
  { name: "The Hobbit", author: "J.R.R. Tolkien", publisher: "George Allen & Unwin", pages: 310, serial: 60 },
  { name: "The Lord of the Rings", author: "J.R.R. Tolkien", publisher: "George Allen & Unwin", pages: 1216, serial: 61 },
  { name: "The Odyssey", author: "Homer", publisher: "Ancient Greece", pages: 541, serial: 62 },
  { name: "The Iliad", author: "Homer", publisher: "Ancient Greece", pages: 704, serial: 63 },
  { name: "Crime and Punishment", author: "Fyodor Dostoevsky", publisher: "The Russian Messenger", pages: 671, serial: 64 },
  { name: "Anna Karenina", author: "Leo Tolstoy", publisher: "The Russian Messenger", pages: 864, serial: 65 },
  { name: "Brave New World", author: "Aldous Huxley", publisher: "Chatto & Windus", pages: 311, serial: 66 },
  { name: "Fahrenheit 451", author: "Ray Bradbury", publisher: "Ballantine Books", pages: 249, serial: 67 },
  { name: "Jane Eyre", author: "Charlotte Brontë", publisher: "Smith, Elder & Co.", pages: 500, serial: 68 },
  { name: "Wuthering Heights", author: "Emily Brontë", publisher: "Thomas Cautley Newby", pages: 416, serial: 69 },
  { name: "Frankenstein", author: "Mary Shelley", publisher: "Lackington, Hughes, Harding, Mavor & Jones", pages: 280, serial: 70 },
  { name: "The Kite Runner", author: "Khaled Hosseini", publisher: "Riverhead Books", pages: 371, serial: 71 },
  { name: "The Alchemist", author: "Paulo Coelho", publisher: "HarperTorch", pages: 208, serial: 72 },
  { name: "Sapiens: A Brief History of Humankind", author: "Yuval Noah Harari", publisher: "Harper", pages: 498, serial: 73 },
  { name: "The Power of Habit", author: "Charles Duhigg", publisher: "Random House", pages: 371, serial: 74 },
  { name: "Thinking, Fast and Slow", author: "Daniel Kahneman", publisher: "Farrar, Straus and Giroux", pages: 499, serial: 75 },
  { name: "Atomic Habits", author: "James Clear", publisher: "Avery", pages: 320, serial: 76 },
  { name: "Educated", author: "Tara Westover", publisher: "Random House", pages: 352, serial: 77 },
  { name: "Becoming", author: "Michelle Obama", publisher: "Crown", pages: 448, serial: 78 },
  { name: "The Lean Startup", author: "Eric Ries", publisher: "Crown Business", pages: 336, serial: 79 },
  { name: "Zero to One", author: "Peter Thiel, Blake Masters", publisher: "Crown Business", pages: 224, serial: 80 },
  { name: "The Pragmatic Programmer", author: "Andrew Hunt, David Thomas", publisher: "Addison-Wesley", pages: 352, serial: 81 },
  { name: "Clean Code", author: "Robert C. Martin", publisher: "Prentice Hall", pages: 464, serial: 82 },
  { name: "Introduction to Algorithms", author: "Thomas H. Cormen, et al.", publisher: "MIT Press", pages: 1312, serial: 83 },
  { name: "Code Complete", author: "Steve McConnell", publisher: "Microsoft Press", pages: 960, serial: 84 },
  { name: "The Design of Everyday Things", author: "Don Norman", publisher: "Basic Books", pages: 368, serial: 85 },
  { name: "The Little Prince", author: "Antoine de Saint-Exupéry", publisher: "Gallimard", pages: 96, serial: 86 },
  { name: "The Diary of a Young Girl", author: "Anne Frank", publisher: "Doubleday", pages: 341, serial: 87 },
  { name: "One Hundred Years of Solitude", author: "Gabriel García Márquez", publisher: "Harper & Row", pages: 417, serial: 88 },
  { name: "Slaughterhouse-Five", author: "Kurt Vonnegut", publisher: "Delacorte", pages: 275, serial: 89 },
  { name: "Beloved", author: "Toni Morrison", publisher: "Alfred A. Knopf", pages: 324, serial: 90 },
  { name: "The Road", author: "Cormac McCarthy", publisher: "Alfred A. Knopf", pages: 287, serial: 91 },
  { name: "Orbital", author: "Samantha Harvey", publisher: "Jonathan Cape / Grove Atlantic", pages: 144, serial: 92 },
  { name: "All Fours", author: "Miranda July", publisher: "Riverhead Books", pages: 336, serial: 93 },
  { name: "James", author: "Percival Everett", publisher: "Doubleday / Mantle (UK)", pages: 320, serial: 94 },
  { name: "The Safekeep", author: "Yael van der Wouden", publisher: "Avid Reader Press / Simon & Schuster", pages: 272, serial: 95 },
  { name: "Creation Lake", author: "Rachel Kushner", publisher: "Scribner (US) / Jonathan Cape (UK)", pages: 416, serial: 96 },
  { name: "My Friends", author: "Hisham Matar", publisher: "Viking / Penguin Random House", pages: 416, serial: 97 },
  { name: "The Coin", author: "Yasmin Zaher", publisher: "Catapult (US)", pages: 240, serial: 98 },
  { name: "Martyr!", author: "Kaveh Akbar", publisher: "Knopf / Penguin Random House", pages: 352, serial: 99 },
  { name: "The Book of Love", author: "Kelly Link", publisher: "Random House", pages: 640, serial: 100 }
];

function loadBooksToTable(tableBodyId) {
  const tbody = document.getElementById(tableBodyId);
  if (!tbody) return;
  tbody.innerHTML = "";
  
  BOOKS_DATABASE.forEach(book => {
    const row = document.createElement("tr");
    row.className = "tab";
    row.innerHTML = `
      <th scope="row">${book.name}</th>
      <td>${book.author}</td>
      <td>${book.publisher}</td>
      <td>${book.pages}</td>
      <td>${book.serial}</td>
      <td>
        <button type="button" class="close" aria-label="Close">
          <span aria-hidden="true">x</span>
        </button>
      </td>
    `;
    tbody.appendChild(row);
  });
}