// Dark Mode Toggle
const darkModeToggle = document.getElementById('dark-mode-toggle');
if (darkModeToggle) {
    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        darkModeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
    });
}

// Typing Effect
const typingText = "A Passionate Front-End Developer.";
let index = 0;
function typeEffect() {
    const typingElement = document.getElementById("typing");
    if (typingElement) {
        typingElement.textContent = "";
        function type() {
            if (index < typingText.length) {
                typingElement.textContent += typingText.charAt(index);
                index++;
                setTimeout(type, 100);
            }
        }
        type();
    }
}
document.addEventListener("DOMContentLoaded", typeEffect);

// Skill Bar Animation
window.addEventListener("scroll", () => {
    document.querySelectorAll(".progress-bar span").forEach((bar) => {
        if (bar.getBoundingClientRect().top < window.innerHeight - 50) {
            if (bar.classList.contains("html")) bar.style.width = "90%";
            else if (bar.classList.contains("css")) bar.style.width = "80%";
            else if (bar.classList.contains("js")) bar.style.width = "75%";
        }
    });
});

// Form Validation
document.getElementById("contact-form")?.addEventListener("submit", function(event) {
    event.preventDefault();
    let name = this.name.value.trim();
    let email = this.email.value.trim();
    let message = this.message.value.trim();
    
    if (!name || !email || !message) {
        alert("Please fill in all fields.");
    } else {
        alert("Message Sent Successfully!");
        this.reset();
    }
});
