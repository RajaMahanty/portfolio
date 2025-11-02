// ===== Preloader (first visit only) =====
window.addEventListener("load", () => {
	const preloader = document.getElementById("preloader");
	const seen = sessionStorage.getItem("seenPreloader");
	const delay = seen ? 0 : 600;
	setTimeout(() => {
		preloader.classList.add("fade-out");
		setTimeout(() => {
			preloader.style.display = "none";
		}, 500);
	}, delay);
	if (!seen) sessionStorage.setItem("seenPreloader", "1");
});

// ===== Initialize AOS (Animate On Scroll) =====
AOS.init({
	duration: 1000, // Animation duration in milliseconds
	easing: "ease-in-out", // Easing function
	once: true, // Whether animation should happen only once
	mirror: false, // Whether elements should animate out while scrolling past them
	offset: 100, // Offset (in px) from the original trigger point
	delay: 0, // Delay before starting the animation
});

// Refresh AOS on window resize for better responsiveness
window.addEventListener("resize", () => {
	AOS.refresh();
});

// ===== Motion preference =====
const prefersReducedMotion = window.matchMedia(
	"(prefers-reduced-motion: reduce)"
).matches;

// ===== Page Progress Indicator =====
const progressBar = document.querySelector(".progress-bar");

window.addEventListener("scroll", () => {
	const windowHeight =
		document.documentElement.scrollHeight -
		document.documentElement.clientHeight;
	const scrolled = (window.scrollY / windowHeight) * 100;
	progressBar.style.width = scrolled + "%";
});

// ===== Dark Mode Toggle =====
const darkModeToggle = document.getElementById("darkModeToggle");
const body = document.body;
const icon = darkModeToggle.querySelector("i");

// Check for saved dark mode preference, otherwise use system preference
const savedTheme = localStorage.getItem("darkMode");
const prefersDarkScheme = window.matchMedia(
	"(prefers-color-scheme: dark)"
).matches;

if (
	savedTheme === "enabled" ||
	(savedTheme !== "disabled" && prefersDarkScheme)
) {
	body.classList.add("dark-mode");
	icon.classList.remove("fa-moon");
	icon.classList.add("fa-sun");
}

darkModeToggle.addEventListener("click", () => {
	body.classList.toggle("dark-mode");

	if (body.classList.contains("dark-mode")) {
		localStorage.setItem("darkMode", "enabled");
		icon.classList.remove("fa-moon");
		icon.classList.add("fa-sun");
	} else {
		localStorage.setItem("darkMode", "disabled");
		icon.classList.remove("fa-sun");
		icon.classList.add("fa-moon");
	}
});

// Listen for system theme changes
window
	.matchMedia("(prefers-color-scheme: dark)")
	.addEventListener("change", (e) => {
		const savedTheme = localStorage.getItem("darkMode");
		// Only apply system theme if user hasn't set a manual preference
		if (!savedTheme || savedTheme === "null") {
			if (e.matches) {
				body.classList.add("dark-mode");
				icon.classList.remove("fa-moon");
				icon.classList.add("fa-sun");
			} else {
				body.classList.remove("dark-mode");
				icon.classList.remove("fa-sun");
				icon.classList.add("fa-moon");
			}
		}
	});

// ===== Back to Top Button =====
const backToTopBtn = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
	if (window.scrollY > 300) {
		backToTopBtn.classList.add("show");
	} else {
		backToTopBtn.classList.remove("show");
	}
});

backToTopBtn.addEventListener("click", () => {
	window.scrollTo({
		top: 0,
		behavior: "smooth",
	});
});

// ===== Secure external links =====
document.querySelectorAll('a[target="_blank"]').forEach((a) => {
	if (!a.rel.includes("noopener")) a.rel += (a.rel ? " " : "") + "noopener";
	if (!a.rel.includes("noreferrer")) a.rel += " noreferrer";
});

// ===== Lazy Loading Images =====
const images = document.querySelectorAll('img[loading="lazy"]');

if ("IntersectionObserver" in window) {
	const imageObserver = new IntersectionObserver((entries, observer) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				const img = entry.target;
				img.classList.add("loaded");
				observer.unobserve(img);
			}
		});
	});

	images.forEach((img) => imageObserver.observe(img));
} else {
	// Fallback for older browsers
	images.forEach((img) => img.classList.add("loaded"));
}

// ===== Mobile Navigation Toggle =====
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-link");

hamburger.addEventListener("click", () => {
	const isOpen = navMenu.classList.toggle("active");
	hamburger.classList.toggle("active");
	hamburger.setAttribute("aria-expanded", String(isOpen));
	document.body.classList.toggle("no-scroll", isOpen);

	// Animate hamburger bars
	const bars = hamburger.querySelectorAll(".bar");
	bars.forEach((bar, index) => {
		if (isOpen) {
			if (index === 0) bar.style.transform = "translateY(9px) rotate(45deg)";
			if (index === 1) bar.style.opacity = "0";
			if (index === 2) bar.style.transform = "translateY(-9px) rotate(-45deg)";
		} else {
			bar.style.transform = "";
			bar.style.opacity = "";
		}
	});
});

// Close mobile menu when clicking on a link
navLinks.forEach((link) => {
	link.addEventListener("click", () => {
		navMenu.classList.remove("active");
		hamburger.classList.remove("active");
		hamburger.setAttribute("aria-expanded", "false");
		document.body.classList.remove("no-scroll");

		const bars = hamburger.querySelectorAll(".bar");
		bars.forEach((bar) => {
			bar.style.transform = "";
			bar.style.opacity = "";
		});
	});
});

// ===== Navbar Scroll Effect =====
const navbar = document.querySelector(".navbar");
let lastScroll = 0;

window.addEventListener("scroll", () => {
	const currentScroll = window.pageYOffset;

	if (currentScroll > 100) {
		navbar.classList.add("scrolled");
	} else {
		navbar.classList.remove("scrolled");
	}

	lastScroll = currentScroll;
});

// ===== Active Navigation Link on Scroll =====
const sections = document.querySelectorAll("section");

function highlightNavigation() {
	const scrollPosition = window.scrollY + 100;

	sections.forEach((section) => {
		const sectionTop = section.offsetTop;
		const sectionHeight = section.offsetHeight;
		const sectionId = section.getAttribute("id");

		if (
			scrollPosition >= sectionTop &&
			scrollPosition < sectionTop + sectionHeight
		) {
			navLinks.forEach((link) => {
				link.classList.remove("active");
				link.removeAttribute("aria-current");
				if (link.getAttribute("href") === `#${sectionId}`) {
					link.classList.add("active");
					link.setAttribute("aria-current", "page");
				}
			});
		}
	});
}

window.addEventListener("scroll", highlightNavigation);

// ===== Smooth Scroll for Navigation Links =====
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
	anchor.addEventListener("click", function (e) {
		e.preventDefault();
		const target = document.querySelector(this.getAttribute("href"));

		if (target) {
			const offsetTop = target.offsetTop - 80;
			window.scrollTo({
				top: offsetTop,
				behavior: "smooth",
			});
		}
	});
});

// ===== Scroll Reveal Animation =====
const observerOptions = {
	threshold: 0.1,
	rootMargin: "0px 0px -100px 0px",
};

const observer = new IntersectionObserver((entries) => {
	entries.forEach((entry) => {
		if (entry.isIntersecting) {
			if (prefersReducedMotion) {
				entry.target.style.opacity = "1";
			} else {
				entry.target.style.animation = "fadeInUp 0.8s ease forwards";
			}
			observer.unobserve(entry.target);
		}
	});
}, observerOptions);

// Observe all sections and cards
const animateElements = document.querySelectorAll(
	".about-text, .info-item, .skill-category, .timeline-item, .education-card, .project-card, .contact-item, .contact-form"
);

animateElements.forEach((element) => {
	element.style.opacity = "0";
	observer.observe(element);
});

// ===== Contact Form Handling =====
const contactForm = document.getElementById("contactForm");

if (contactForm) {
	contactForm.addEventListener("submit", (e) => {
		e.preventDefault();

		// Get form data
		const formData = new FormData(contactForm);
		const data = Object.fromEntries(formData);

		// Show success message
		showNotification(
			"Message sent successfully! I'll get back to you soon.",
			"success"
		);

		// Reset form
		contactForm.reset();

		// Log form data (in production, this would send to a backend)
		console.log("Form submitted:", data);
	});
}

// ===== Notification Function =====
function showNotification(message, type = "success") {
	// Remove existing notification if any
	const existingNotification = document.querySelector(".notification");
	if (existingNotification) {
		existingNotification.remove();
	}

	// Create notification element
	const notification = document.createElement("div");
	notification.className = `notification ${type}`;
	notification.textContent = message;

	// Style notification
	notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: ${type === "success" ? "#10b981" : "#ef4444"};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 9999;
    animation: slideInRight 0.3s ease;
  `;

	// Add to document
	document.body.appendChild(notification);

	// Remove after 3 seconds
	setTimeout(() => {
		notification.style.animation = "slideOutRight 0.3s ease";
		setTimeout(() => notification.remove(), 300);
	}, 3000);
}

// Add notification animations to CSS
const style = document.createElement("style");
style.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// ===== Typing Effect for Hero Subtitle =====
const heroSubtitle = document.querySelector(".hero-subtitle");
if (heroSubtitle && !prefersReducedMotion) {
	const text = heroSubtitle.textContent;
	heroSubtitle.textContent = "";
	let i = 0;

	function typeWriter() {
		if (i < text.length) {
			heroSubtitle.textContent += text.charAt(i);
			i++;
			setTimeout(typeWriter, 100);
		}
	}

	// Start typing effect after page load
	window.addEventListener("load", () => {
		setTimeout(typeWriter, 1000);
	});
}

// ===== Cursor Effect (Optional Enhancement) =====
const createCursorEffect = () => {
	const cursor = document.createElement("div");
	cursor.className = "cursor-dot";
	cursor.style.cssText = `
    width: 8px;
    height: 8px;
    background: #6366f1;
    border-radius: 50%;
    position: fixed;
    pointer-events: none;
    z-index: 9999;
    transition: transform 0.2s ease;
    display: none;
  `;
	document.body.appendChild(cursor);

	document.addEventListener("mousemove", (e) => {
		cursor.style.display = "block";
		cursor.style.left = e.clientX + "px";
		cursor.style.top = e.clientY + "px";
	});

	// Scale up on clickable elements
	const clickables = document.querySelectorAll("a, button, .btn");
	clickables.forEach((el) => {
		el.addEventListener("mouseenter", () => {
			cursor.style.transform = "scale(2)";
			cursor.style.background = "#ec4899";
		});
		el.addEventListener("mouseleave", () => {
			cursor.style.transform = "scale(1)";
			cursor.style.background = "#6366f1";
		});
	});
};

// Enable cursor effect on desktop only
if (window.innerWidth > 768 && !prefersReducedMotion) {
	createCursorEffect();
}

// ===== Parallax Effect for Hero Section =====
const hero = document.querySelector(".hero");
let parallaxHandler = null;
const mqMobile = window.matchMedia("(max-width: 768px)");

function applyParallax() {
	if (!hero || prefersReducedMotion) return;
	if (!mqMobile.matches) {
		if (!parallaxHandler) {
			parallaxHandler = () => {
				const scrolled = window.pageYOffset;
				const parallax = scrolled * 0.5;
				hero.style.transform = `translateY(${parallax}px)`;
			};
			window.addEventListener("scroll", parallaxHandler);
		}
	} else {
		if (parallaxHandler) {
			window.removeEventListener("scroll", parallaxHandler);
			parallaxHandler = null;
		}
		hero.style.transform = "";
	}
}

applyParallax();
if (typeof mqMobile.addEventListener === "function") {
	mqMobile.addEventListener("change", applyParallax);
} else if (typeof mqMobile.addListener === "function") {
	mqMobile.addListener(applyParallax);
}

// ===== Skill Tags Hover Animation Enhancement =====
const skillTags = document.querySelectorAll(".skill-tag");
skillTags.forEach((tag) => {
	tag.addEventListener("mouseenter", function () {
		this.style.transform = "translateY(-5px) scale(1.05)";
	});
	tag.addEventListener("mouseleave", function () {
		this.style.transform = "translateY(0) scale(1)";
	});
});

// ===== Dynamic Year in Footer =====
const footer = document.querySelector(".footer p");
if (footer && footer.textContent.includes("2025")) {
	const currentYear = new Date().getFullYear();
	footer.textContent = footer.textContent.replace("2025", currentYear);
}

// ===== Project Filter Tabs =====
const tabButtons = document.querySelectorAll(".tab-btn");
const projectCards = document.querySelectorAll(".project-card");

tabButtons.forEach((button) => {
	button.addEventListener("click", () => {
		const filter = button.getAttribute("data-filter");

		// Remove active class from all buttons
		tabButtons.forEach((btn) => btn.classList.remove("active"));

		// Add active class to clicked button
		button.classList.add("active");

		// Filter projects with animation
		projectCards.forEach((card) => {
			const categories = card.getAttribute("data-category");

			// Add fade out effect
			card.style.opacity = "0";
			card.style.transform = "scale(0.8)";

			setTimeout(() => {
				if (filter === "all" || categories.includes(filter)) {
					card.classList.remove("hide");
					// Trigger reflow
					card.offsetHeight;
					// Fade in
					card.style.opacity = "1";
					card.style.transform = "scale(1)";
				} else {
					card.classList.add("hide");
				}
			}, 300);
		});
	});
});

// ===== Project Cards Random Gradient =====
const projectImages = document.querySelectorAll(".project-image");
const gradients = [
	"linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
	"linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
	"linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
	"linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
];

projectImages.forEach((img, index) => {
	img.style.background = gradients[index % gradients.length];
});

// ===== Console Message =====
console.log(
	"%c👋 Hello! Thanks for checking out my portfolio!",
	"font-size: 16px; font-weight: bold; color: #6366f1;"
);
console.log(
	"%c🚀 Built with HTML, CSS, and JavaScript",
	"font-size: 14px; color: #64748b;"
);
console.log(
	"%c💼 Want to work together? Let's connect!",
	"font-size: 14px; color: #ec4899;"
);

// ===== Performance Optimization: Lazy Loading Images =====
if ("IntersectionObserver" in window) {
	const imageObserver = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				const img = entry.target;
				if (img.dataset.src) {
					img.src = img.dataset.src;
					img.classList.add("loaded");
					imageObserver.unobserve(img);
				}
			}
		});
	});

	document.querySelectorAll("img[data-src]").forEach((img) => {
		imageObserver.observe(img);
	});
}

// (Skip link is now in HTML with CSS styling)

console.log("✨ Portfolio loaded successfully!");

// ===== Animated Statistics Counter =====
const animateCounters = () => {
	const counters = document.querySelectorAll(".stat-number");
	const speed = 200; // Animation speed

	counters.forEach((counter) => {
		const animate = () => {
			const value = +counter.getAttribute("data-target");
			const data = +counter.innerText;
			const time = value / speed;

			if (data < value) {
				counter.innerText = Math.ceil(data + time);
				setTimeout(animate, 1);
			} else {
				// Add + symbol to certain stats
				if (
					value === 90 ||
					value === 2 ||
					value === 10000 ||
					value === 10 ||
					value === 15
				) {
					counter.innerText = value + "+";
				} else {
					counter.innerText = value;
				}
			}
		};

		animate();
	});
};

// Trigger counter animation when stats section is visible
const statsSection = document.querySelector(".stats");
if (statsSection) {
	const statsObserver = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					animateCounters();
					statsObserver.unobserve(entry.target);
				}
			});
		},
		{ threshold: 0.5 }
	);

	statsObserver.observe(statsSection);
}
