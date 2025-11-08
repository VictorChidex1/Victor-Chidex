// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    // Only prevent default for same-page links
    if (this.getAttribute("href").startsWith("#")) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
    // External links (with target="_blank") will work normally
  });
});

// Mobile menu functionality
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("nav-menu");

if (hamburger && navMenu) {
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
  });

  // Close menu when clicking on a link
  document.querySelectorAll(".nav-menu a").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
    });
  });
}

// Enhanced animations on scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
      entry.target.style.transition = "all 0.6s ease";

      // Add staggered animation for skills and projects
      if (
        entry.target.classList.contains("skills-container") ||
        entry.target.classList.contains("projects-container")
      ) {
        const children = entry.target.children;
        Array.from(children).forEach((child, index) => {
          child.style.transition = `all 0.6s ease ${index * 0.1}s`;
          child.style.opacity = "1";
          child.style.transform = "translateY(0)";
        });
      }
    }
  });
}, observerOptions);

// Observe all sections and containers
document
  .querySelectorAll("section, .skills-container, .projects-container")
  .forEach((element) => {
    element.style.opacity = "0";
    element.style.transform = "translateY(30px)";
    observer.observe(element);
  });

// Back to Top Button
const backToTopButton = document.getElementById("backToTop");

if (backToTopButton) {
  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
      backToTopButton.classList.add("show");
    } else {
      backToTopButton.classList.remove("show");
    }
  });

  backToTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

// Dark/Light Mode Toggle
const themeToggle = document.getElementById("themeToggle");

if (themeToggle) {
  // Check for saved theme or prefer color scheme
  const savedTheme =
    localStorage.getItem("theme") ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light");

  // Apply the saved theme
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    themeToggle.textContent = "☀️";
  }

  // Toggle theme
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
      themeToggle.textContent = "☀️";
      localStorage.setItem("theme", "dark");
    } else {
      themeToggle.textContent = "🌙";
      localStorage.setItem("theme", "light");
    }
  });
}

// Project Filtering System - FIXED VERSION
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

if (filterButtons.length > 0) {
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Remove active class from all buttons
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      // Add active class to clicked button
      button.classList.add("active");

      const filterValue = button.getAttribute("data-filter");

      // Filter projects with smooth transition
      projectCards.forEach((card) => {
        if (
          filterValue === "all" ||
          card.getAttribute("data-category") === filterValue
        ) {
          // Show the card
          card.classList.remove("hidden");
          // Add slight delay for staggered animation
          setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "scale(1)";
          }, 100);
        } else {
          // Hide the card
          card.style.opacity = "0";
          card.style.transform = "scale(0.8)";
          // After animation completes, add hidden class
          setTimeout(() => {
            card.classList.add("hidden");
          }, 400);
        }
      });
    });
  });
}

// Animate skill bars when they come into view
const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const skillProgress = entry.target;
        const width = skillProgress.getAttribute("data-width");
        setTimeout(() => {
          skillProgress.style.width = width;
        }, 300);
      }
    });
  },
  { threshold: 0.5 }
);

// Observe all skill progress bars
document.querySelectorAll(".skill-progress").forEach((skill) => {
  skillObserver.observe(skill);
});

// Contact Form with Formspree
const contactForm = document.getElementById("contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Get form values
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();
    const submitBtn = this.querySelector(".submit-btn");

    // Reset errors
    clearErrors();

    // Validate form
    let isValid = true;

    if (name === "") {
      showError("nameError", "Please enter your name");
      isValid = false;
    }

    if (email === "") {
      showError("emailError", "Please enter your email");
      isValid = false;
    } else if (!isValidEmail(email)) {
      showError("emailError", "Please enter a valid email");
      isValid = false;
    }

    if (message === "") {
      showError("messageError", "Please enter your message");
      isValid = false;
    } else if (message.length < 10) {
      showError("messageError", "Message must be at least 10 characters");
      isValid = false;
    }

    // If form is valid, submit to Formspree
    if (isValid) {
      // Show loading state
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";

      try {
        // Use Formspree to handle the submission
        const formData = new FormData(this);

        const response = await fetch(this.action, {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json",
          },
        });

        if (response.ok) {
          showSuccessMessage(
            "Thank you! Your message has been sent successfully. I'll get back to you soon!"
          );
          this.reset();
        } else {
          throw new Error("Form submission failed");
        }
      } catch (error) {
        showSuccessMessage(
          "Sorry, there was an error sending your message. Please try again or email me directly.",
          true
        );
      } finally {
        // Reset button state
        submitBtn.disabled = false;
        submitBtn.textContent = "Send Message";
      }
    }
  });
}

function showError(elementId, message) {
  const errorElement = document.getElementById(elementId);
  errorElement.textContent = message;

  // Add error styling to input
  const inputId = elementId.replace("Error", "");
  const inputElement = document.getElementById(inputId);
  inputElement.style.borderColor = "#e74c3c";
}

function clearErrors() {
  const errorElements = document.querySelectorAll(".error-message");
  errorElements.forEach((element) => {
    element.textContent = "";
  });

  // Reset input borders
  const inputs = document.querySelectorAll(
    ".form-group input, .form-group textarea"
  );
  inputs.forEach((input) => {
    input.style.borderColor = "#e9ecef";
  });
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function showSuccessMessage() {
  // Remove existing success message if any
  const existingSuccess = document.querySelector(".form-success");
  if (existingSuccess) {
    existingSuccess.remove();
  }

  // Create success message
  const successMessage = document.createElement("div");
  successMessage.className = "form-success";
  successMessage.textContent =
    "Thank you! Your message has been sent successfully.";

  // Insert before the form
  const form = document.querySelector(".contact-form");
  form.parentNode.insertBefore(successMessage, form);

  // Remove success message after 5 seconds
  setTimeout(() => {
    successMessage.remove();
  }, 5000);
}

console.log("Welcome to Victor Chidex Portfolio! 🚀");
