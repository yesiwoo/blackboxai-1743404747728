// Admin Router Configuration
class AdminRouter {
    constructor() {
        this.baseAdminPath = '/animeadminhub';
        this.currentPath = window.location.pathname;
        this.setupRoutes();
        this.checkAuth();
    }

    setupRoutes() {
        // Define admin routes and their corresponding pages
        this.routes = {
            '/': 'dashboard.html',
            '/dashboard': 'dashboard.html',
            '/users': 'users.html',
            '/content': 'content.html',
            '/comments': 'comments.html',
            '/settings': 'settings.html'
        };

        // Listen for navigation events
        window.addEventListener('popstate', () => this.handleRoute());
        document.addEventListener('DOMContentLoaded', () => this.handleRoute());
    }

    async checkAuth() {
        // Check if user is authenticated and has admin privileges
        const isAuthenticated = localStorage.getItem('adminToken');
        if (!isAuthenticated && !this.currentPath.includes('/login')) {
            this.redirectToLogin();
            return false;
        }
        return true;
    }

    redirectToLogin() {
        window.location.href = '/login.html';
    }

    async handleRoute() {
        const path = window.location.pathname.replace(this.baseAdminPath, '') || '/';
        
        if (await this.checkAuth()) {
            const page = this.routes[path];
            if (page) {
                this.loadPage(page);
            } else {
                this.handle404();
            }
        }
    }

    async loadPage(page) {
        try {
            const response = await fetch(`${this.baseAdminPath}/${page}`);
            if (response.ok) {
                const content = await response.text();
                document.getElementById('admin-content').innerHTML = content;
                this.updateActiveNav(page);
            } else {
                this.handle404();
            }
        } catch (error) {
            console.error('Error loading page:', error);
            this.handleError();
        }
    }

    updateActiveNav(currentPage) {
        // Update navigation active states
        document.querySelectorAll('nav a').forEach(link => {
            const isActive = link.getAttribute('href').includes(currentPage);
            link.classList.toggle('bg-crunchyroll-orange', isActive);
            link.classList.toggle('hover:bg-gray-800', !isActive);
        });
    }

    handle404() {
        document.getElementById('admin-content').innerHTML = `
            <div class="flex items-center justify-center h-screen bg-crunchyroll-dark">
                <div class="text-center">
                    <h1 class="text-6xl font-bold text-crunchyroll-orange mb-4">404</h1>
                    <p class="text-white text-xl mb-8">Page not found</p>
                    <a href="${this.baseAdminPath}/dashboard" 
                        class="bg-crunchyroll-orange text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition">
                        Back to Dashboard
                    </a>
                </div>
            </div>
        `;
    }

    handleError() {
        document.getElementById('admin-content').innerHTML = `
            <div class="flex items-center justify-center h-screen bg-crunchyroll-dark">
                <div class="text-center">
                    <h1 class="text-6xl font-bold text-red-500 mb-4">Error</h1>
                    <p class="text-white text-xl mb-8">Something went wrong</p>
                    <button onclick="window.location.reload()" 
                        class="bg-crunchyroll-orange text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition">
                        Try Again
                    </button>
                </div>
            </div>
        `;
    }

    // Navigation methods
    navigateTo(path) {
        const fullPath = `${this.baseAdminPath}${path}`;
        window.history.pushState({}, '', fullPath);
        this.handleRoute();
    }

    // Authentication methods
    static login(credentials) {
        // In a real app, this would make an API call
        return new Promise((resolve, reject) => {
            if (credentials.email && credentials.password) {
                localStorage.setItem('adminToken', 'dummy-token');
                resolve({ success: true });
            } else {
                reject(new Error('Invalid credentials'));
            }
        });
    }

    static logout() {
        localStorage.removeItem('adminToken');
        window.location.href = '/login.html';
    }
}

// Initialize router
const adminRouter = new AdminRouter();

// Export for use in other admin scripts
window.AdminRouter = AdminRouter;
window.adminRouter = adminRouter;