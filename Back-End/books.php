<?php
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/db.php';

// Books data from your book-data.js
$books = [
  ["The Hunger Games", "Suzanne Collins", "Alfa", 478, 1],
  ["Harry Potter", "J.K. Rowling", "Beta", 398, 2],
  ["To Kill a Mockingbird", "Harper Lee", "Omega", 685, 3],
  ["Pride and Prejudice", "Jane Austen", "Sky", 425, 4],
  ["Twilight", "Stephenie Meyer", "Sun", 556, 5],
  ["The Book Thief", "Markus Zusak", "Child", 475, 6],
  ["Narnia", "C.S. Lewis", "Alfa", 358, 7],
  ["Animal Farm", "George Orwell", "Dog", 277, 8],
  ["Les Misérables", "Victor Hugo", "Dog", 369, 9],
  ["The Alchemist", "Paulo Coelho", "Omega", 247, 10],
  ["The Help", "Kathryn Stockett", "Clock", 159, 11],
  ["Charlotte's Web", "E.B. White", "Book", 437, 12],
  ["Dracula", "Bram Stoker", "Beta", 346, 13],
  ["Muna Madan", "Laxmi Prasad Devkota", "Sajha Prakashan", 60, 14],
  ["Seto Bagh", "Diamond Shumsher Rana", "Sajha Prakashan", 328, 15],
  ["Shirishko Phool", "Bishnu Kumari Waiba", "Sajha Prakasan", 118, 16],
  ["Karnali Blues", "Buddhi Sagar", "FinePrint Publications", 397, 17],
  ["Palpasa Cafe", "Narayan Wagle", "FinePrint Publications", 250, 18],
  ["China Harayeko Manche", "Hari Bansha Acharya", "Fineprint Publications", 278, 19],
  ["Phoolko Aankhaama", "Ani Choying Dolma", "Lama Publications", 228, 20],
  ["Summer Love", "Subin Bhattarai", "FinePrint Publications", 247, 21],
  ["Chhinnamasta", "B.P. Koirala", "Ratna Pustak Bhandar", 180, 22],
  ["Ghanchakkar", "Satya Mohan Joshi", "Book Hill Publications", 180, 23],
  ["1984", "George Orwell", "Signet Classic", 328, 24],
  ["Basain", "Lil Bahadur Chettri", "Sajha Prakashan", 62, 25],
  ["Sumnima", "B.P. Koirala", "Sajha Publications", 94, 26],
  ["Seto Bagh", "Diamond Shumsher Rana", "Ratna Pustak Bhandar", 352, 27],
  ["Antarmanko Yatra", "Jagadish Ghimire", "Jagadish Ghimire Pratisthan", 297, 28],
  ["Khusi", "Vijay Kumar Pandey", "FinePrint Publications", 332, 29],
  ["Khalangama Hamala", "Radha Paudel", "Nepalaya Publications", 135, 30],
  ["Ranahar", "Yogesh Raj", "Nepalaya Publications", 151, 31],
  ["Yogmaya", "Neelam Karki Niharika", "Sangrila", 503, 32],
  ["Dhritarashtra", "Ghanshyam Kandel", "Airawati Prakashan", 96, 33],
  ["Aina", "Ramlal Joshi", "Brother Books", 255, 34],
  ["Damini Bhir", "Rajan Mukarung", "Phoenix Books", 290, 35],
  ["Chhapamar ko Chhoro", "Mahesh Bikram Shah", "Sajha Prakashan / FinePrint", 124, 36],
  ["Aaithan", "Bibek Ojha", "Sangri-La Books", 386, 37],
  ["Umaal", "Chuden Kabimo", "Publisher unspecified", 300, 38],
  ["Mukam Ranamaidan", "Mohan Mainali", "Publisher unspecified", 320, 39],
  ["Maharani", "Chandra Prakash Baniya", "Publisher unspecified", 368, 40],
  ["Khalang-ko Mukti Yuddha", "Various Authors", "Publisher unspecified", 280, 41],
  ["Pincho Jhin", "Vijay Kumar Pandey", "FinePrint", 300, 42],
  ["Palace of Illusions (Nepali trans.)", "Ashok Banker", "FinePrint", 320, 43],
  ["Karnali Ko Ghumti", "Buddhisagar", "FinePrint", 350, 44],
  ["Jiwan Kada Ki Phool", "Jhamak Ghimire", "FinePrint", 290, 45],
  ["Nepal ko Arthik Itihas", "Various Authors", "Publisher unspecified", 410, 46],
  ["Galapada (Science)", "Various Authors", "Publisher unspecified", 200, 47],
  ["Nepali Grammar", "Basant Subedi", "Publisher unspecified", 180, 48],
  ["Nepali-English Dictionary", "Ratna Pustak Mandir", "Ratna Pustak Mandir", 500, 49],
  ["Malati Ko Sapana", "Madhav Prasad Ghimire", "Sajha Prakashan", 80, 50],
  ["Nepal ko Sambidhan (2015)", "Constituent Assembly", "Government of Nepal", 408, 51],
  ["Gauri", "Madhav Prasad Ghimire", "Sajha Prakashan", 600, 52],
  ["Nepal ko Itihas (Vol. 1)", "Satish C. Subedi", "Publisher unspecified", 520, 53],
  ["Himalayan Odyssey", "Narayan Wagle", "FinePrint", 275, 54],
  ["The Ministry of Time", "Kaliane Bradley", "Sceptre/Avid Reader Press", 416, 55],
  ["The Great Gatsby", "F. Scott Fitzgerald", "Charles Scribner's Sons", 180, 56],
  ["The Catcher in the Rye", "J.D. Salinger", "Little, Brown and Company", 277, 57],
  ["Moby-Dick", "Herman Melville", "Harper & Brothers", 585, 58],
  ["War and Peace", "Leo Tolstoy", "The Russian Messenger", 1225, 59],
  ["The Hobbit", "J.R.R. Tolkien", "George Allen & Unwin", 310, 60],
  ["The Lord of the Rings", "J.R.R. Tolkien", "George Allen & Unwin", 1216, 61],
  ["The Odyssey", "Homer", "Ancient Greece", 541, 62],
  ["The Iliad", "Homer", "Ancient Greece", 704, 63],
  ["Crime and Punishment", "Fyodor Dostoevsky", "The Russian Messenger", 671, 64],
  ["Anna Karenina", "Leo Tolstoy", "The Russian Messenger", 864, 65],
  ["Brave New World", "Aldous Huxley", "Chatto & Windus", 311, 66],
  ["Fahrenheit 451", "Ray Bradbury", "Ballantine Books", 249, 67],
  ["Jane Eyre", "Charlotte Brontë", "Smith, Elder & Co.", 500, 68],
  ["Wuthering Heights", "Emily Brontë", "Thomas Cautley Newby", 416, 69],
  ["Frankenstein", "Mary Shelley", "Lackington, Hughes, Harding, Mavor & Jones", 280, 70],
  ["The Kite Runner", "Khaled Hosseini", "Riverhead Books", 371, 71],
  ["The Alchemist", "Paulo Coelho", "HarperTorch", 208, 72],
  ["Sapiens: A Brief History of Humankind", "Yuval Noah Harari", "Harper", 498, 73],
  ["The Power of Habit", "Charles Duhigg", "Random House", 371, 74],
  ["Thinking, Fast and Slow", "Daniel Kahneman", "Farrar, Straus and Giroux", 499, 75],
  ["Atomic Habits", "James Clear", "Avery", 320, 76],
  ["Educated", "Tara Westover", "Random House", 352, 77],
  ["Becoming", "Michelle Obama", "Crown", 448, 78],
  ["The Lean Startup", "Eric Ries", "Crown Business", 336, 79],
  ["Zero to One", "Peter Thiel, Blake Masters", "Crown Business", 224, 80],
  ["The Pragmatic Programmer", "Andrew Hunt, David Thomas", "Addison-Wesley", 352, 81],
  ["Clean Code", "Robert C. Martin", "Prentice Hall", 464, 82],
  ["Introduction to Algorithms", "Thomas H. Cormen, et al.", "MIT Press", 1312, 83],
  ["Code Complete", "Steve McConnell", "Microsoft Press", 960, 84],
  ["The Design of Everyday Things", "Don Norman", "Basic Books", 368, 85],
  ["The Little Prince", "Antoine de Saint-Exupéry", "Gallimard", 96, 86],
  ["The Diary of a Young Girl", "Anne Frank", "Doubleday", 341, 87],
  ["One Hundred Years of Solitude", "Gabriel García Márquez", "Harper & Row", 417, 88],
  ["Slaughterhouse-Five", "Kurt Vonnegut", "Delacorte", 275, 89],
  ["Beloved", "Toni Morrison", "Alfred A. Knopf", 324, 90],
  ["The Road", "Cormac McCarthy", "Alfred A. Knopf", 287, 91],
  ["Orbital", "Samantha Harvey", "Jonathan Cape / Grove Atlantic", 144, 92],
  ["All Fours", "Miranda July", "Riverhead Books", 336, 93],
  ["James", "Percival Everett", "Doubleday / Mantle (UK)", 320, 94],
  ["The Safekeep", "Yael van der Wouden", "Avid Reader Press / Simon & Schuster", 272, 95],
  ["Creation Lake", "Rachel Kushner", "Scribner (US) / Jonathan Cape (UK)", 416, 96],
  ["My Friends", "Hisham Matar", "Viking / Penguin Random House", 416, 97],
  ["The Coin", "Yasmin Zaher", "Catapult (US)", 240, 98],
  ["Martyr!", "Kaveh Akbar", "Knopf / Penguin Random House", 352, 99],
  ["The Book of Love", "Kelly Link", "Random House", 640, 100]
];

try {
    $stmt = $pdo->prepare('
        INSERT INTO books (title, author, publisher, pages, serial_number) 
        VALUES (?, ?, ?, ?, ?)
    ');

    $count = 0;
    foreach ($books as $book) {
        $stmt->execute($book);
        $count++;
    }

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => "$count books inserted successfully"
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Failed to insert books',
        'detail' => $e->getMessage()
    ]);
}
?>