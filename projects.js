// Projects page functionality
document.addEventListener("DOMContentLoaded", function () {
  // Filter functionality for projects page
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  if (filterButtons.length > 0 && projectCards.length > 0) {
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        // Remove active class from all buttons
        filterButtons.forEach((btn) => btn.classList.remove("active"));
        // Add active class to clicked button
        button.classList.add("active");

        const filterValue = button.getAttribute("data-filter");
        filterProjects(filterValue);
      });
    });
  }
});

function filterProjects(filter) {
  const projectCards = document.querySelectorAll(".project-card");

  projectCards.forEach((card) => {
    if (filter === "all" || card.getAttribute("data-category") === filter) {
      card.style.display = "block";
      setTimeout(() => {
        card.style.opacity = "1";
        card.style.transform = "scale(1)";
      }, 100);
    } else {
      card.style.opacity = "0";
      card.style.transform = "scale(0.8)";
      setTimeout(() => {
        card.style.display = "none";
      }, 400);
    }
  });
}

// Initialize projects page
if (document.querySelector(".all-projects")) {
  console.log("Projects page loaded successfully");
}
