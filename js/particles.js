/* assets/js/particles.js */
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("button").forEach(button => {
        button.addEventListener("click", (event) => {
            for (let i = 0; i < 10; i++) {
                createParticle(event.clientX, event.clientY);
            }
        });
    });
});

function createParticle(x, y) {
    const particle = document.createElement("div");
    particle.className = "particle";
    document.body.appendChild(particle);
    
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    
    setTimeout(() => {
        particle.remove();
    }, 1000);
}
