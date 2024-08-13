document.addEventListener("DOMContentLoaded", function() {
    const week1Button = document.getElementById("week1-button");
    const week1Content = document.getElementById("week1-content");

    // Handle Week 1 button click
    week1Button.addEventListener("click", function() {
        week1Content.style.display = week1Content.style.display === "none" ? "block" : "none";
        
    });
});
