/* assets/js/main.js */
document.addEventListener("DOMContentLoaded", () => {
    const cursor = document.querySelector(".custom-cursor");
    const themeToggle = document.getElementById("theme-toggle");
    
    document.addEventListener("mousemove", (e) => {
        cursor.style.top = `${e.clientY}px`;
        cursor.style.left = `${e.clientX}px`;
    });
    
    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("light-theme");
    });
});
