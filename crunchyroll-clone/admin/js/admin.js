// Admin Panel State Management
const adminState = {
    currentAnime: [],
    currentUsers: [],
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    searchQuery: '',
    sortField: 'createdAt',
    sortOrder: 'desc',
    filters: {
        status: 'all',
        genre: 'all',
        userRole: 'all'
    }
};

// API Endpoints (to be implemented with backend)
const API = {
    baseUrl: '/api',
    endpoints: {
        anime: '/anime',
        episodes: '/episodes',
        users: '/users',
        stats: '/stats',
        uploads: '/uploads'
    }
};

// Dashboard Statistics
async function loadDashboardStats() {
    try {
        // In a real implementation, this would fetch from the backend
        const stats = {
            totalAnime: 247,
            totalEpisodes: 1583,
            activeUsers: 15234,
            storageUsed: '1.2 TB'
        };

        updateDashboardUI(stats);
    } catch (error) {
        showNotification('Error loading dashboard statistics', 'error');
    }
}

// Anime Management
async function uploadAnime(formData) {
    try {
        const form = new FormData();
        for (const [key, value] of Object.entries(formData)) {
            form.append(key, value);
        }

        // Simulate API call
        console.log('Uploading anime:', formData);
        showNotification('Anime uploaded successfully', 'success');
        
        // Refresh anime list
        loadAnimeList();
    } catch (error) {
        showNotification('Error uploading anime', 'error');
    }
}

async function loadAnimeList() {
    try {
        // Simulate API call
        const animeList = [
            {
                id: 1,
                title: 'Attack on Titan',
                episodes: 75,
                status: 'Ongoing',
                thumbnail: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=120'
            },
            {
                id: 2,
                title: 'Demon Slayer',
                episodes: 26,
                status: 'Completed',
                thumbnail: 'https://images.unsplash.com/photo-1580477667995-2b94f01c9516?w=120'
            }
        ];

        adminState.currentAnime = animeList;
        updateAnimeListUI(animeList);
    } catch (error) {
        showNotification('Error loading anime list', 'error');
    }
}

// Episode Management
async function uploadEpisode(formData) {
    try {
        const form = new FormData();
        for (const [key, value] of Object.entries(formData)) {
            form.append(key, value);
        }

        // Simulate API call
        console.log('Uploading episode:', formData);
        showNotification('Episode uploaded successfully', 'success');

        // Refresh episode list
        loadEpisodeList(formData.animeId);
    } catch (error) {
        showNotification('Error uploading episode', 'error');
    }
}

async function loadEpisodeList(animeId) {
    try {
        // Simulate API call
        const episodes = [
            {
                id: 1,
                number: 1,
                title: 'The Beginning',
                duration: '23:45',
                views: 150000
            }
        ];

        updateEpisodeListUI(episodes);
    } catch (error) {
        showNotification('Error loading episodes', 'error');
    }
}

// User Management
async function loadUsers() {
    try {
        // Simulate API call
        const users = [
            {
                id: 1,
                name: 'John Doe',
                email: 'john@example.com',
                status: 'active',
                role: 'premium'
            }
        ];

        adminState.currentUsers = users;
        updateUserListUI(users);
    } catch (error) {
        showNotification('Error loading users', 'error');
    }
}

async function updateUserStatus(userId, status) {
    try {
        // Simulate API call
        console.log(`Updating user ${userId} status to ${status}`);
        showNotification('User status updated successfully', 'success');
        
        // Refresh user list
        loadUsers();
    } catch (error) {
        showNotification('Error updating user status', 'error');
    }
}

// File Upload Handling
function handleFileUpload(file, type) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            // In a real implementation, this would upload to a server
            console.log(`Uploading ${type} file:`, file.name);
            resolve(reader.result);
        };
        reader.onerror = () => {
            reject(new Error('File upload failed'));
        };
        reader.readAsDataURL(file);
    });
}

// Search and Filter
function handleSearch(query) {
    adminState.searchQuery = query;
    if (window.location.hash === '#users') {
        const filteredUsers = adminState.currentUsers.filter(user => 
            user.name.toLowerCase().includes(query.toLowerCase()) ||
            user.email.toLowerCase().includes(query.toLowerCase())
        );
        updateUserListUI(filteredUsers);
    } else if (window.location.hash === '#anime') {
        const filteredAnime = adminState.currentAnime.filter(anime =>
            anime.title.toLowerCase().includes(query.toLowerCase())
        );
        updateAnimeListUI(filteredAnime);
    }
}

function applyFilters(filters) {
    adminState.filters = { ...adminState.filters, ...filters };
    // Reapply filters based on current view
    if (window.location.hash === '#users') {
        loadUsers();
    } else if (window.location.hash === '#anime') {
        loadAnimeList();
    }
}

// UI Updates
function updateDashboardUI(stats) {
    document.getElementById('total-anime').textContent = stats.totalAnime;
    document.getElementById('total-episodes').textContent = stats.totalEpisodes;
    document.getElementById('active-users').textContent = stats.activeUsers;
    document.getElementById('storage-used').textContent = stats.storageUsed;
}

function updateAnimeListUI(animeList) {
    const container = document.querySelector('#anime-list');
    if (!container) return;

    container.innerHTML = animeList.map(anime => `
        <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div class="flex items-center space-x-4">
                <img src="${anime.thumbnail}" alt="${anime.title}" class="w-16 h-16 object-cover rounded">
                <div>
                    <h3 class="font-semibold">${anime.title}</h3>
                    <p class="text-sm text-gray-500">${anime.episodes} Episodes</p>
                </div>
            </div>
            <div class="flex space-x-2">
                <button onclick="editAnime(${anime.id})" class="p-2 text-blue-500 hover:bg-blue-100 rounded">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteAnime(${anime.id})" class="p-2 text-red-500 hover:bg-red-100 rounded">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function updateEpisodeListUI(episodes) {
    const container = document.querySelector('#episode-list');
    if (!container) return;

    container.innerHTML = episodes.map(episode => `
        <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
                <h3 class="font-semibold">Episode ${episode.number}: ${episode.title}</h3>
                <p class="text-sm text-gray-500">${episode.duration} • ${episode.views.toLocaleString()} views</p>
            </div>
            <div class="flex space-x-2">
                <button onclick="editEpisode(${episode.id})" class="p-2 text-blue-500 hover:bg-blue-100 rounded">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteEpisode(${episode.id})" class="p-2 text-red-500 hover:bg-red-100 rounded">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function updateUserListUI(users) {
    const container = document.querySelector('#user-list tbody');
    if (!container) return;

    container.innerHTML = users.map(user => `
        <tr>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                    <div class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <i class="fas fa-user text-gray-500"></i>
                    </div>
                    <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">${user.name}</div>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">${user.email}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    ${user.status}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${user.role}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button onclick="editUser(${user.id})" class="text-blue-600 hover:text-blue-900">Edit</button>
                <button onclick="deleteUser(${user.id})" class="ml-4 text-red-600 hover:text-red-900">Delete</button>
            </td>
        </tr>
    `).join('');
}

// Notifications
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed bottom-4 right-4 px-6 py-3 rounded-lg text-white ${
        type === 'success' ? 'bg-green-500' :
        type === 'error' ? 'bg-red-500' :
        'bg-blue-500'
    }`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize dashboard
    loadDashboardStats();

    // Handle navigation
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash;
        if (hash === '#users') {
            loadUsers();
        } else if (hash === '#anime') {
            loadAnimeList();
        }
    });

    // Initialize search
    const searchInput = document.querySelector('input[placeholder="Search users..."]');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => handleSearch(e.target.value));
    }

    // Initialize file upload listeners
    document.querySelectorAll('input[type="file"]').forEach(input => {
        input.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (file) {
                try {
                    await handleFileUpload(file, input.accept.includes('image') ? 'image' : 'video');
                } catch (error) {
                    showNotification('File upload failed', 'error');
                }
            }
        });
    });
});

// Export functions for use in HTML
window.showModal = showModal;
window.hideModal = hideModal;
window.uploadAnime = uploadAnime;
window.uploadEpisode = uploadEpisode;
window.updateUserStatus = updateUserStatus;
window.handleSearch = handleSearch;
window.applyFilters = applyFilters;