document.addEventListener("DOMContentLoaded", function() {
    const pressButton = document.getElementById("press-button");
    const needMoreLoveButton = document.getElementById("need-more-love-button");
    const homeButton = document.getElementById("home-button");
    const initialContainer = document.getElementById("initial-container");
    const imageContainer = document.getElementById("image-container");
    const loveImage = document.getElementById("love-image");

    const saveNoteButton = document.getElementById("save-note-button");
    const noteInput = document.getElementById("note-input");
    const viewJournalButton = document.getElementById("view-journal-button");
    const downloadJournalButton = document.getElementById("download-journal-button");

    // Array of image paths
    const imageArray = [
        "images/img0.jpg", // First image shown when the PRESS button is clicked
        "images/img1.jpg", 
        "images/img2.jpg",
        "images/img3.jpg",
        "images/img4.jpg",
        "images/img5.jpg",
        "images/img6.jpg"
    ];

    const complArray = [
        "You are so pretty", // First image shown when the PRESS button is clicked
        "You are so beautiful", 
        "You are kind",
        "You are sweet"
    ];


    // Function to shuffle the array
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Shuffle the array initially
    shuffleArray(imageArray);

    // Index to keep track of which image to show next
    let currentIndex = 0;
    imageContainer.style.display = "none";

    // Handle PRESS button click
    pressButton.addEventListener("click", function() {
        initialContainer.style.display = "none";
        imageContainer.style.display = "block";
        loveImage.src = imageArray[currentIndex];
        currentIndex = (currentIndex + 1) % imageArray.length;
    });

    // Handle Need More Love button click
    needMoreLoveButton.addEventListener("click", function() {
        if (currentIndex === 0) {
            shuffleArray(imageArray);  // Reshuffle when all images have been shown
        }
        loveImage.src = imageArray[currentIndex];
        currentIndex = (currentIndex + 1) % imageArray.length;
    });

    // Handle Home button click
    homeButton.addEventListener("click", function() {
        imageContainer.style.display = "none";
        initialContainer.style.display = "block";
    });
    

   // Handle Save Note button click
   saveNoteButton.addEventListener("click", function() {
    const note = noteInput.value;
    if (note) {
        let journal = localStorage.getItem('journal');
        if (!journal) {
            journal = [];
        } else {
            journal = JSON.parse(journal);
        }
        journal.push(note);
        localStorage.setItem('journal', JSON.stringify(journal));
        alert('Note saved successfully');
        noteInput.value = ''; // Clear the input after saving
    } else {
        alert('Please write something in the note.');
    }
});

    // Handle View Journal button click
    viewJournalButton.addEventListener("click", function() {
        let journal = localStorage.getItem('journal');
        if (!journal) {
            alert('Your journal is empty.');
        } else {
            journal = JSON.parse(journal);
            const journalText = journal.join('\n\n');
            alert(`Journal:\n\n${journalText}`);
        }
    });

    // Handle Download Journal button click
    downloadJournalButton.addEventListener("click", function() {
        let journal = localStorage.getItem('journal');
        if (!journal) {
            alert('Your journal is empty.');
        } else {
            journal = JSON.parse(journal);
            const journalText = journal.join('\n\n');
            download('Journal.txt', journalText);
        }
    });

    // Function to trigger download
    function download(filename, text) {
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }

});
