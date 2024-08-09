document.addEventListener("DOMContentLoaded", function() {
    const pressButton = document.getElementById("press-button");
    const needMoreLoveButton = document.getElementById("need-more-love-button");
    const homeButton = document.getElementById("home-button");
    const initialContainer = document.getElementById("initial-container");
    const imageContainer = document.getElementById("image-container");
    const loveImage = document.getElementById("love-image");

    const viewJournalButton = document.getElementById("view-journal-button");
    const journalDisplay = document.getElementById("journal-display");
    const journalContent = document.getElementById("journal-content");

    // Array of image paths
    const imageArray = [
        "images/img0.jpg", // First image shown when the PRESS button is clicked
        "images/img1.jpg", 
        "images/img2.jpg",
        "images/img3.jpg",
        "images/img4.jpg",
        "images/img5.jpg",
        "images/img6.jpg",
        "images/img7.jpg",
        "images/img8.jpg",
        "images/img9.jpg",
        "images/img10.jpg",
        "images/img11.jpg", 
        "images/img12.jpg",
        "images/img13.jpg",
        "images/img14.jpg",
        "images/img15.jpg",
        "images/img16.jpg",        
        "images/img17.jpg",
        "images/img18.jpg",
        "images/img19.jpg",
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
        journalDisplay.style.display = "none"
    });

    // Handle View Journal button click
    viewJournalButton.addEventListener("click", function() {
        data = "Hello!"
        journalContent.textContent = data;
        journalDisplay.style.display = "block";
    });
});
