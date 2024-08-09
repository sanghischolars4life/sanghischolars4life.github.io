document.addEventListener("DOMContentLoaded", function() {
    const pressButton = document.getElementById("press-button");
    const needMoreLoveButton = document.getElementById("need-more-love-button");
    const homeButton = document.getElementById("home-button");
    const initialContainer = document.getElementById("initial-container");
    const imageContainer = document.getElementById("image-container");
    const loveImage = document.getElementById("love-image");

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

    // Handle the PRESS button click
    pressButton.addEventListener("click", function() {
        initialContainer.style.display = "none";
        imageContainer.style.display = "block";
        loveImage.src = imageArray[currentIndex+1];
        currentIndex = (currentIndex + 1) % imageArray.length;
    });

    // Handle the Need More Love button click
    needMoreLoveButton.addEventListener("click", function() {
        if (currentIndex === 0) {
            shuffleArray(imageArray);
        }
        loveImage.src = imageArray[currentIndex];
        currentIndex = (currentIndex + 1) % imageArray.length;
    });

    // Handle the Home button click
    homeButton.addEventListener("click", function() {
        imageContainer.style.display = "none";
        initialContainer.style.display = "block";
    });
});
