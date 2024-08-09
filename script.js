document.addEventListener("DOMContentLoaded", function() {
    const pressButton = document.getElementById("press-button");
    const needMoreLoveButton = document.getElementById("need-more-love-button");
    const homeButton = document.getElementById("home-button");
    const initialContainer = document.getElementById("initial-container");
    const imageContainer = document.getElementById("image-container");
    const loveImage = document.getElementById("love-image");

    const viewJournalButton = document.getElementById("view-journal-button");
    const playMusicButton = document.getElementById("play-music-button");
    const journalDisplay = document.getElementById("journal-display");
    const journalContent = document.getElementById("journal-content");

    const backgroundMusic = document.getElementById("background-music");
    let isMusicPlaying = false;

    // Array of image paths
    const imageArray = [];

    for (let i = 0; i <= 50; i++) {
        imageArray.push(`images/img${i}.jpg`);
    }


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

    
    playMusicButton.addEventListener("click", function() {
        if (isMusicPlaying) {
            backgroundMusic.pause();
            playMusicButton.textContent = "Play Music";
        } else {
            backgroundMusic.play();
            playMusicButton.textContent = "Pause Music";
        }
        isMusicPlaying = !isMusicPlaying;
    });
    // Handle View Journal button click
    viewJournalButton.addEventListener("click", function() {
        data = "Have a safe flight! \n I am going to start to Seattle as your flight takes off.\n" +
        "Today will be very important day for us! I am super proud of you and extremely thrilled for the journey ahead of us.\n" +
        "Last few days I was distracted with HY work, but deep down I felt I would breakdown otherwise.\nI just got time to rethink and realize this is a journey for both of us to grow and spread our wings to the maximum.\n" +
        "Love you so much! I am always there! Focus on your health and being more and more aware!"
        journalContent.textContent = data;
        journalDisplay.style.display = "block";
    });
});
