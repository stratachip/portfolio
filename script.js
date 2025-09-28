// Theme Management

const themes = {
    space: {
        video: './public/bg1.mp4',  // 👈 correct path for Live Server
        name: 'space'
    },
    semiconductor: {
        video: './public/bg2.mp4',  // 👈 same local video
        name: 'semiconductor'
    },
    PCB: {
        video: './public/bg3.mp4',  // 👈 same local video
        name: 'PCB'
    }
};



let currentTheme = 'space';
let themeInterval;

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    initializeNavigation();
    initializeAnimations();
    initializeFormHandlers();
    startThemeRotation();
});

// Theme Functions
function initializeTheme() {
    document.body.setAttribute('data-theme', currentTheme);
    updateBackgroundVideo();
    document.getElementById('themeSelect').value = currentTheme;
}

function changeTheme(theme) {
    currentTheme = theme;
    document.body.setAttribute('data-theme', theme);
    updateBackgroundVideo();
    
    // Reset theme rotation
    clearInterval(themeInterval);
    startThemeRotation();
}

function updateBackgroundVideo() {
    const video = document.getElementById('backgroundVideo');
    const newSource = themes[currentTheme].video;
    
    if (video.src !== newSource) {
        video.src = newSource;
        video.load();
    }
}

function startThemeRotation() {
    themeInterval = setInterval(() => {
        const themeKeys = Object.keys(themes);
        const currentIndex = themeKeys.indexOf(currentTheme);
        const nextIndex = (currentIndex + 1) % themeKeys.length;
        const nextTheme = themeKeys[nextIndex];
        
        changeTheme(nextTheme);
        document.getElementById('themeSelect').value = nextTheme;
    }, 20000); // Change theme every 20 seconds
}

// Navigation Functions
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Hamburger menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Theme selector
    document.getElementById('themeSelect').addEventListener('change', (e) => {
        changeTheme(e.target.value);
    });

    // Smooth scrolling and active link highlighting
    window.addEventListener('scroll', updateActiveNavLink);
    updateActiveNavLink();
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Animation Functions
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    // Observe all sections and cards
    const elementsToAnimate = document.querySelectorAll('section, .service-card, .team-card, .about-card');
    elementsToAnimate.forEach(el => observer.observe(el));
}

// Service Details Toggle
function toggleServiceDetails(serviceId) {
    const details = document.getElementById(`${serviceId}-details`);
    const button = details.previousElementSibling;
    const icon = button.querySelector('i');
    
    if (details.classList.contains('expanded')) {
        details.classList.remove('expanded');
        button.innerHTML = '<i class="fas fa-chevron-down"></i> Learn More';
    } else {
        // Close all other expanded details
        document.querySelectorAll('.service-details.expanded').forEach(detail => {
            detail.classList.remove('expanded');
            const btn = detail.previousElementSibling;
            btn.innerHTML = '<i class="fas fa-chevron-down"></i> Learn More';
        });
        
        details.classList.add('expanded');
        button.innerHTML = '<i class="fas fa-chevron-up"></i> Show Less';
    }
}

// Team Details Toggle
function toggleTeamDetails(memberId) {
    const details = document.getElementById(`${memberId}-details`);
    const button = details.nextElementSibling.querySelector('.read-more-btn');
    
    if (details.classList.contains('expanded')) {
        details.classList.remove('expanded');
        button.textContent = 'Read More';
    } else {
        // Close all other expanded details
        document.querySelectorAll('.team-details.expanded').forEach(detail => {
            detail.classList.remove('expanded');
            const btn = detail.nextElementSibling.querySelector('.read-more-btn');
            btn.textContent = 'Read More';
        });
        
        details.classList.add('expanded');
        button.textContent = 'Show Less';
    }
}

// Form Handlers
function initializeFormHandlers() {
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', handleContactForm);
}

function handleContactForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Create email content
    const emailSubject = `New Contact Form Submission from ${data.name}`;
    const emailBody = `
Name: ${data.name}
Email: ${data.email}
Company: ${data.company || 'Not provided'}
Service: ${data.service}
Message: ${data.message}
    `;
    
    // Create mailto link
    const mailtoLink = `mailto:stratachip@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    
    // Open email client
    window.location.href = mailtoLink;
    
    // Show success message
    showNotification('Email client opened! Please send the email to complete your inquiry.', 'success');
    
    // Reset form
    e.target.reset();
}

function applyForJob(jobTitle) {
    const emailSubject = `Job Application for ${jobTitle}`;
    const emailBody = `
Dear Stratachip Team,

I am interested in applying for the ${jobTitle} position at Stratachip.

Please find my resume attached. I look forward to hearing from you.

Best regards,
[Your Name]
[Your Phone Number]
[Your Email]
    `;
    
    const mailtoLink = `mailto:stratachip@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    window.location.href = mailtoLink;
    
    showNotification('Email client opened! Please attach your resume and send the email.', 'success');
}

// Utility Functions
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'var(--primary-color)' : '#f59e0b'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        max-width: 400px;
    `;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        .notification-content {
            display: flex;
            align-items: center;
            gap: 10px;
        }
    `;
    document.head.appendChild(style);
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease-out reverse';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Smooth scrolling for all anchor links
document.addEventListener('click', (e) => {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        scrollToSection(targetId);
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    // Close mobile menu on resize
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (window.innerWidth > 768) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Preload videos for smooth transitions
function preloadVideos() {
    Object.values(themes).forEach(theme => {
        const video = document.createElement('video');
        video.src = theme.video;
        video.preload = 'metadata';
    });
}

// Initialize video preloading
setTimeout(preloadVideos, 2000);