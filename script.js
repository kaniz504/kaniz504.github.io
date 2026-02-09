// ===== PERSONAL INFORMATION CONFIGURATION =====
// Edit your details here - all information will be automatically updated throughout the website
const personalInfo = {
    name: "Your Name",
    title: "Aspiring Developer | Learning Web Development ",
    email: "kanizfatemafaria30@gmail.com",
    phone: "+880 1906443272",
    location: "City, Country",
    github: "https://github.com/kaniz504",
    githubUsername: "kaniz504",  // Your GitHub username for fetching repositories
    linkedin: "https://linkedin.com/in/yourprofile",
    twitter: "https://twitter.com/yourprofile",
    about: {
        intro: "Hi! I'm a passionate beginner developer just starting my journey into web development. I'm excited to learn new technologies and build cool projects!",
        background: "I'm learning the fundamentals of HTML, CSS, and JavaScript through hands-on projects and continuous practice. Every day is a learning opportunity, and I'm committed to improving my skills one step at a time.",
        interest: "In my free time, I love exploring new coding concepts, working on small projects to practice, reading tech blogs, and connecting with other developers in the community. I believe in the power of consistent learning and collaboration."
    },
    stats: {
        experience: "Beginner",
        projects: "5+",
        clients: "Learning",
        satisfaction: "Eager!"
    },
    // GitHub Projects Configuration
    projectsConfig: {
        autoFetch: true,          // Set to true to fetch projects from GitHub automatically
        maxProjects: 6,           // Maximum number of projects to display
        sortBy: "updated",        // Options: "updated", "stars", "created"
        excludeRepos: []          // Add repo names to exclude, e.g., ["repo1", "repo2"]
    }
};

// Update personal information in the DOM
function updatePersonalInfo() {
    // Update name
    document.querySelector('.hero-title .highlight').textContent = personalInfo.name;

    // Update title/subtitle
    document.querySelector('.hero-subtitle').textContent = personalInfo.title;

    // Update about section
    const aboutText = document.querySelector('.about-text');
    const paragraphs = aboutText.querySelectorAll('p');
    if (paragraphs.length >= 3) {
        paragraphs[0].textContent = personalInfo.about.intro;
        paragraphs[1].textContent = personalInfo.about.background;
        paragraphs[2].textContent = personalInfo.about.interest;
    }

    // Update social links
    const socialLinks = document.querySelectorAll('.social-links a, .footer-social a');
    socialLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href.includes('github.com')) {
            link.setAttribute('href', personalInfo.github);
        } else if (href.includes('linkedin.com')) {
            link.setAttribute('href', personalInfo.linkedin);
        } else if (href.includes('twitter.com')) {
            link.setAttribute('href', personalInfo.twitter);
        } else if (href.includes('mailto:')) {
            link.setAttribute('href', `mailto:${personalInfo.email}`);
        }
    });

    // Update contact information
    const contactItems = document.querySelectorAll('.contact-item');
    contactItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes('email')) {
            item.querySelector('p').textContent = personalInfo.email;
        } else if (text.includes('phone')) {
            item.querySelector('p').textContent = personalInfo.phone;
        } else if (text.includes('location')) {
            item.querySelector('p').textContent = personalInfo.location;
        }
    });

    // Update stats
    const statCards = document.querySelectorAll('.stat-card');
    if (statCards.length >= 4) {
        statCards[0].querySelector('h3').textContent = personalInfo.stats.experience;
        statCards[1].querySelector('h3').textContent = personalInfo.stats.projects;
        statCards[2].querySelector('h3').textContent = personalInfo.stats.clients;
        statCards[3].querySelector('h3').textContent = personalInfo.stats.satisfaction;
    }

    // Update footer copyright
    const year = new Date().getFullYear();
    document.querySelector('.footer p').textContent = `© ${year} ${personalInfo.name}. All rights reserved.`;
}

// Call update function when page loads
window.addEventListener('DOMContentLoaded', () => {
    updatePersonalInfo();
    if (personalInfo.projectsConfig.autoFetch) {
        fetchGitHubProjects();
    }
});

// ===== GITHUB PROJECTS INTEGRATION =====
async function fetchGitHubProjects() {
    const username = personalInfo.githubUsername;
    const projectsGrid = document.querySelector('.projects-grid');

    if (!username) {
        console.warn('GitHub username not set. Please update personalInfo.githubUsername');
        return;
    }

    try {
        // Show loading message
        projectsGrid.innerHTML = '<p style="text-align: center; width: 100%; padding: 40px;">Loading projects from GitHub...</p>';

        // Fetch repositories from GitHub API
        const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);

        if (!response.ok) {
            throw new Error('Failed to fetch GitHub repositories');
        }

        let repos = await response.json();

        // Filter out excluded repos and forks
        repos = repos.filter(repo =>
            !personalInfo.projectsConfig.excludeRepos.includes(repo.name) &&
            !repo.fork
        );

        // Sort repositories
        const sortBy = personalInfo.projectsConfig.sortBy;
        if (sortBy === 'stars') {
            repos.sort((a, b) => b.stargazers_count - a.stargazers_count);
        } else if (sortBy === 'updated') {
            repos.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
        } else if (sortBy === 'created') {
            repos.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        }

        // Limit number of projects
        repos = repos.slice(0, personalInfo.projectsConfig.maxProjects);

        // Clear loading message
        projectsGrid.innerHTML = '';

        // Generate project cards
        if (repos.length === 0) {
            projectsGrid.innerHTML = '<p style="text-align: center; width: 100%; padding: 40px;">No public repositories found.</p>';
            return;
        }

        repos.forEach(repo => {
            const projectCard = createProjectCard(repo);
            projectsGrid.appendChild(projectCard);
        });

        console.log(`Successfully loaded ${repos.length} projects from GitHub`);

    } catch (error) {
        console.error('Error fetching GitHub projects:', error);
        projectsGrid.innerHTML = '<p style="text-align: center; width: 100%; padding: 40px; color: #ef4444;">Failed to load projects from GitHub. Please check the console for details.</p>';
    }
}

function createProjectCard(repo) {
    const card = document.createElement('div');
    card.className = 'project-card';

    // Get language color
    const languageColors = {
        'JavaScript': '#f1e05a',
        'Python': '#3572A5',
        'Java': '#b07219',
        'TypeScript': '#2b7489',
        'HTML': '#e34c26',
        'CSS': '#563d7c',
        'PHP': '#4F5D95',
        'Ruby': '#701516',
        'Go': '#00ADD8',
        'Rust': '#dea584',
        'C++': '#f34b7d',
        'C': '#555555',
        'C#': '#178600',
        'Swift': '#ffac45',
        'Kotlin': '#F18E33',
        'Dart': '#00B4AB',
        'Vue': '#41b883',
        'React': '#61dafb'
    };

    const languageColor = languageColors[repo.language] || '#6366f1';

    // Extract topics/technologies (GitHub topics)
    const topics = repo.topics || [];
    const language = repo.language || 'Code';

    // Create tech tags from language and topics
    let techTags = [];
    if (language) techTags.push(language);
    techTags = [...techTags, ...topics.slice(0, 3)];

    // Generate icon based on repo name or description
    let icon = 'fa-code';
    const repoNameLower = repo.name.toLowerCase();
    const descLower = (repo.description || '').toLowerCase();

    if (repoNameLower.includes('web') || descLower.includes('website')) icon = 'fa-globe';
    else if (repoNameLower.includes('app') || repoNameLower.includes('mobile')) icon = 'fa-mobile-alt';
    else if (repoNameLower.includes('api') || descLower.includes('api')) icon = 'fa-server';
    else if (repoNameLower.includes('bot')) icon = 'fa-robot';
    else if (repoNameLower.includes('game')) icon = 'fa-gamepad';
    else if (repoNameLower.includes('chat') || repoNameLower.includes('message')) icon = 'fa-comments';
    else if (repoNameLower.includes('data') || repoNameLower.includes('analytics')) icon = 'fa-chart-line';
    else if (repoNameLower.includes('shop') || repoNameLower.includes('ecommerce')) icon = 'fa-shopping-cart';

    card.innerHTML = `
        <div class="project-image" style="background: linear-gradient(135deg, ${languageColor}20 0%, ${languageColor}40 100%);">
            <div class="image-placeholder">
                <i class="fas ${icon}" style="color: ${languageColor};"></i>
            </div>
        </div>
        <div class="project-content">
            <h3 class="project-title">${repo.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h3>
            <p class="project-description">${repo.description || 'No description available'}</p>
            <div class="project-tech">
                ${techTags.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
            </div>
            <div class="project-links">
                <a href="${repo.html_url}" target="_blank" class="project-link">
                    <i class="fab fa-github"></i> GitHub
                </a>
                ${repo.homepage ? `
                    <a href="${repo.homepage}" target="_blank" class="project-link">
                        <i class="fas fa-external-link-alt"></i> Live Demo
                    </a>
                ` : ''}
                <div class="project-stats" style="margin-left: auto; display: flex; gap: 10px; color: #6b7280; font-size: 0.9rem;">
                    ${repo.stargazers_count > 0 ? `<span><i class="fas fa-star"></i> ${repo.stargazers_count}</span>` : ''}
                    ${repo.forks_count > 0 ? `<span><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>` : ''}
                </div>
            </div>
        </div>
    `;

    return card;
}


// Mobile Navigation Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
});

// Close menu when clicking on a link (only on mobile)
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        // Only hide menu on mobile devices (screen width <= 768px)
        if (window.innerWidth <= 768) {
            navMenu.style.display = 'none';
        }
    });
});

// Contact Form Handling
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form values
    const name = contactForm.querySelector('input[type="text"]').value;
    const email = contactForm.querySelector('input[type="email"]').value;
    const subject = contactForm.querySelectorAll('input[type="text"]')[1].value;
    const message = contactForm.querySelector('textarea').value;

    // Validate
    if (!name || !email || !subject || !message) {
        alert('Please fill all fields');
        return;
    }

    // Here you can send the form data to your backend
    console.log({
        name,
        email,
        subject,
        message
    });

    // Show success message
    alert('Thank you! Your message has been sent successfully.');
    contactForm.reset();
});

// Scroll effect for navbar
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
    }
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for animations on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.animation = 'slideInLeft 0.6s ease';
        }
    });
}, observerOptions);

// Observe elements
document.querySelectorAll('.section-title').forEach(el => observer.observe(el));

// Add active class to navigation links based on scroll position
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Counter animation for stats
const countUp = (element, target, duration = 2000) => {
    let current = 0;
    const increment = target / (duration / 16);

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
};

// Trigger counter animation when stats section is visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            const stats = entry.target.querySelectorAll('.stat-card h3');
            stats.forEach(stat => {
                const number = parseInt(stat.textContent);
                if (!isNaN(number)) {
                    countUp(stat, number);
                }
            });
            entry.target.classList.add('counted');
        }
    });
});

const aboutSection = document.querySelector('.about');
if (aboutSection) {
    statsObserver.observe(aboutSection);
}

// Responsive menu
function handleResize() {
    if (window.innerWidth > 768) {
        navMenu.style.display = 'flex';
    } else {
        navMenu.style.display = 'none';
    }
}

window.addEventListener('resize', handleResize);

// Initialize
handleResize();

console.log('Portfolio website loaded successfully!');
