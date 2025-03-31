// DOM Elements
const mobileMenuButton = document.querySelector('.md\\:hidden');
const mobileMenu = document.getElementById('mobile-menu');
const featuredAnimeContainer = document.getElementById('featured-anime');
const trendingAnimeContainer = document.getElementById('trending-anime');

// Sample Anime Data (In real app, this would come from an API)
const animeData = {
    featured: [
        {
            id: 1,
            title: "Attack on Titan",
            image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500",
            episodes: 24,
            rating: 4.9,
            isPremium: true
        },
        {
            id: 2,
            title: "Demon Slayer",
            image: "https://images.unsplash.com/photo-1580477667995-2b94f01c9516?w=500",
            episodes: 26,
            rating: 4.8,
            isPremium: true
        },
        {
            id: 3,
            title: "One Punch Man",
            image: "https://images.unsplash.com/photo-1612487528505-d2338264c821?w=500",
            episodes: 12,
            rating: 4.7,
            isPremium: false
        },
        {
            id: 4,
            title: "My Hero Academia",
            image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500",
            episodes: 25,
            rating: 4.6,
            isPremium: true
        }
    ],
    trending: [
        {
            id: 5,
            title: "Jujutsu Kaisen",
            image: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=500",
            episodes: 24,
            rating: 4.9,
            isPremium: true
        },
        {
            id: 6,
            title: "Tokyo Revengers",
            image: "https://images.unsplash.com/photo-1625895197185-efcec01cffe0?w=500",
            episodes: 24,
            rating: 4.7,
            isPremium: false
        },
        {
            id: 7,
            title: "Black Clover",
            image: "https://images.unsplash.com/photo-1624456735729-03594a40c4fb?w=500",
            episodes: 170,
            rating: 4.6,
            isPremium: true
        },
        {
            id: 8,
            title: "Dr. Stone",
            image: "https://images.unsplash.com/photo-1625895197185-efcec01cffe0?w=500",
            episodes: 24,
            rating: 4.8,
            isPremium: false
        }
    ]
};

// Mobile Menu Toggle
mobileMenuButton?.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    mobileMenu.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!mobileMenu?.contains(e.target) && !mobileMenuButton?.contains(e.target)) {
        mobileMenu?.classList.add('hidden');
        mobileMenu?.classList.remove('active');
    }
});

// Create Anime Card
function createAnimeCard(anime) {
    const card = document.createElement('div');
    card.className = 'anime-card bg-gray-800 rounded-lg overflow-hidden shadow-lg';
    
    card.innerHTML = `
        <a href="video.html?id=${anime.id}" class="block relative">
            <img 
                src="${anime.image}" 
                alt="${anime.title}" 
                class="w-full h-48 object-cover transform hover:scale-105 transition duration-300"
                loading="lazy"
                onerror="this.src='https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500'"
            >
            ${anime.isPremium ? `
                <span class="premium-badge absolute top-2 right-2">
                    Premium
                </span>
            ` : ''}
        </a>
        <div class="p-4">
            <h3 class="text-lg font-semibold mb-2">${anime.title}</h3>
            <div class="flex items-center justify-between text-sm text-gray-400">
                <span>${anime.episodes} Episodes</span>
                <div class="flex items-center">
                    <i class="fas fa-star text-yellow-400 mr-1"></i>
                    <span>${anime.rating}</span>
                </div>
            </div>
        </div>
    `;

    return card;
}

// Load Featured Anime
function loadFeaturedAnime() {
    if (!featuredAnimeContainer) return;
    
    featuredAnimeContainer.innerHTML = '';
    animeData.featured.forEach(anime => {
        featuredAnimeContainer.appendChild(createAnimeCard(anime));
    });
}

// Load Trending Anime
function loadTrendingAnime() {
    if (!trendingAnimeContainer) return;
    
    trendingAnimeContainer.innerHTML = '';
    animeData.trending.forEach(anime => {
        trendingAnimeContainer.appendChild(createAnimeCard(anime));
    });
}

// Lazy Loading Images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy-image');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => {
        imageObserver.observe(img);
    });
}

// Error Handler
function handleError(error, element) {
    console.error('Error:', error);
    
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.innerHTML = `
        <i class="fas fa-exclamation-circle mr-2"></i>
        An error occurred. Please try again later.
    `;
    
    element.appendChild(errorMessage);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    try {
        loadFeaturedAnime();
        loadTrendingAnime();
        lazyLoadImages();
    } catch (error) {
        handleError(error, document.body);
    }
});

// Handle Scroll Animation
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.anime-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'slideUp 0.5s ease forwards';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(element => {
        observer.observe(element);
    });
};

// Initialize scroll animation
window.addEventListener('load', animateOnScroll);

// Handle Network Status
window.addEventListener('online', () => {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(msg => msg.remove());
    loadFeaturedAnime();
    loadTrendingAnime();
});

window.addEventListener('offline', () => {
    handleError(new Error('Network connection lost'), document.body);
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Theme Toggle (if implemented)
const toggleTheme = () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
};

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
}