// Comments System
class CommentSystem {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.comments = [];
        this.currentUser = {
            id: 'user123',
            name: 'John Doe',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120'
        };
        this.gifAPI = 'https://api.giphy.com/v1/gifs/search';
        this.gifKey = 'YOUR_GIPHY_API_KEY'; // In production, this should be secured
        this.initializeUI();
    }

    initializeUI() {
        this.createCommentBox();
        this.loadComments();
        this.setupEventListeners();
    }

    createCommentBox() {
        const commentBox = `
            <div class="bg-gray-800 rounded-lg p-6">
                <h3 class="text-xl font-bold text-white mb-6">Comments</h3>
                
                <!-- Comment Input -->
                <div class="mb-6">
                    <div class="flex items-start space-x-4">
                        <img src="${this.currentUser.avatar}" alt="${this.currentUser.name}" 
                            class="w-10 h-10 rounded-full">
                        <div class="flex-grow">
                            <div class="bg-gray-700 rounded-lg p-4">
                                <textarea id="commentText" 
                                    class="w-full bg-transparent text-white placeholder-gray-400 resize-none focus:outline-none"
                                    rows="3" 
                                    placeholder="Share your thoughts..."></textarea>
                                
                                <!-- Attachment Options -->
                                <div class="flex items-center justify-between mt-4">
                                    <div class="flex space-x-4">
                                        <button class="text-gray-400 hover:text-white" id="uploadImage">
                                            <i class="fas fa-image"></i>
                                        </button>
                                        <button class="text-gray-400 hover:text-white" id="uploadGif">
                                            <i class="fas fa-gift"></i>
                                        </button>
                                        <button class="text-gray-400 hover:text-white" id="addEmoji">
                                            <i class="fas fa-smile"></i>
                                        </button>
                                    </div>
                                    <button id="submitComment" 
                                        class="bg-crunchyroll-orange text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition">
                                        Comment
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- GIF Search Modal -->
                <div id="gifModal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div class="bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
                        <div class="flex justify-between items-center mb-4">
                            <h4 class="text-white font-bold">Search GIFs</h4>
                            <button class="text-gray-400 hover:text-white" id="closeGifModal">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        <input type="text" id="gifSearch" 
                            class="w-full bg-gray-700 text-white px-4 py-2 rounded-lg mb-4"
                            placeholder="Search for GIFs...">
                        <div id="gifResults" class="grid grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                            <!-- GIF results will be populated here -->
                        </div>
                    </div>
                </div>

                <!-- Emoji Picker -->
                <div id="emojiPicker" class="hidden absolute bg-gray-800 rounded-lg p-4 shadow-lg">
                    <div class="grid grid-cols-8 gap-2">
                        <!-- Emojis will be populated here -->
                    </div>
                </div>

                <!-- Comments List -->
                <div id="commentsList" class="space-y-6">
                    <!-- Comments will be populated here -->
                </div>
            </div>
        `;
        this.container.innerHTML = commentBox;
    }

    setupEventListeners() {
        // Submit Comment
        document.getElementById('submitComment').addEventListener('click', () => {
            const text = document.getElementById('commentText').value.trim();
            if (text) {
                this.addComment(text);
                document.getElementById('commentText').value = '';
            }
        });

        // GIF Button
        document.getElementById('uploadGif').addEventListener('click', () => {
            document.getElementById('gifModal').classList.remove('hidden');
        });

        // Close GIF Modal
        document.getElementById('closeGifModal').addEventListener('click', () => {
            document.getElementById('gifModal').classList.add('hidden');
        });

        // GIF Search
        let searchTimeout;
        document.getElementById('gifSearch').addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.searchGifs(e.target.value);
            }, 500);
        });

        // Emoji Button
        document.getElementById('addEmoji').addEventListener('click', (e) => {
            const picker = document.getElementById('emojiPicker');
            picker.classList.toggle('hidden');
            picker.style.top = `${e.target.offsetTop + 40}px`;
            picker.style.left = `${e.target.offsetLeft}px`;
        });

        // Image Upload
        document.getElementById('uploadImage').addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = (e) => this.handleImageUpload(e.target.files[0]);
            input.click();
        });
    }

    async searchGifs(query) {
        if (!query) return;
        try {
            const response = await fetch(`${this.gifAPI}?api_key=${this.gifKey}&q=${query}&limit=15`);
            const data = await response.json();
            this.displayGifResults(data.data);
        } catch (error) {
            console.error('Error searching GIFs:', error);
        }
    }

    displayGifResults(gifs) {
        const container = document.getElementById('gifResults');
        container.innerHTML = gifs.map(gif => `
            <img src="${gif.images.fixed_height.url}" 
                class="w-full h-32 object-cover rounded cursor-pointer hover:opacity-80"
                onclick="selectGif('${gif.images.fixed_height.url}')">
        `).join('');
    }

    handleImageUpload(file) {
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            this.addComment('', e.target.result);
        };
        reader.readAsDataURL(file);
    }

    addComment(text, attachment = null) {
        const comment = {
            id: Date.now(),
            user: this.currentUser,
            text,
            attachment,
            timestamp: new Date(),
            likes: 0,
            replies: []
        };

        this.comments.unshift(comment);
        this.saveComments();
        this.displayComments();
    }

    loadComments() {
        // In a real app, this would load from a backend
        const savedComments = localStorage.getItem('animeComments');
        if (savedComments) {
            this.comments = JSON.parse(savedComments);
        }
        this.displayComments();
    }

    saveComments() {
        // In a real app, this would save to a backend
        localStorage.setItem('animeComments', JSON.stringify(this.comments));
    }

    displayComments() {
        const container = document.getElementById('commentsList');
        container.innerHTML = this.comments.map(comment => this.createCommentHTML(comment)).join('');
    }

    createCommentHTML(comment) {
        const timeAgo = this.getTimeAgo(comment.timestamp);
        
        return `
            <div class="flex space-x-4" id="comment-${comment.id}">
                <img src="${comment.user.avatar}" alt="${comment.user.name}" 
                    class="w-10 h-10 rounded-full">
                <div class="flex-grow">
                    <div class="bg-gray-700 rounded-lg p-4">
                        <div class="flex items-center justify-between mb-2">
                            <span class="font-semibold text-white">${comment.user.name}</span>
                            <span class="text-sm text-gray-400">${timeAgo}</span>
                        </div>
                        ${comment.text ? `<p class="text-white mb-2">${comment.text}</p>` : ''}
                        ${comment.attachment ? `
                            <div class="mb-2">
                                <img src="${comment.attachment}" alt="Comment attachment" 
                                    class="max-w-full rounded-lg">
                            </div>
                        ` : ''}
                        <div class="flex items-center space-x-4 mt-2">
                            <button class="text-gray-400 hover:text-white" 
                                onclick="likeComment(${comment.id})">
                                <i class="fas fa-heart"></i>
                                <span class="ml-1">${comment.likes}</span>
                            </button>
                            <button class="text-gray-400 hover:text-white"
                                onclick="replyToComment(${comment.id})">
                                <i class="fas fa-reply"></i>
                                <span class="ml-1">Reply</span>
                            </button>
                        </div>
                    </div>
                    
                    <!-- Replies -->
                    ${comment.replies.length > 0 ? `
                        <div class="mt-4 space-y-4 pl-8">
                            ${comment.replies.map(reply => this.createCommentHTML(reply)).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    getTimeAgo(timestamp) {
        const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
        
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + ' years ago';
        
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + ' months ago';
        
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + ' days ago';
        
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + ' hours ago';
        
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + ' minutes ago';
        
        return 'just now';
    }

    likeComment(commentId) {
        const comment = this.findComment(commentId);
        if (comment) {
            comment.likes++;
            this.saveComments();
            this.displayComments();
        }
    }

    replyToComment(commentId) {
        const comment = this.findComment(commentId);
        if (!comment) return;

        const replyBox = document.createElement('div');
        replyBox.className = 'mt-4 pl-8';
        replyBox.innerHTML = `
            <div class="flex items-start space-x-4">
                <img src="${this.currentUser.avatar}" alt="${this.currentUser.name}" 
                    class="w-8 h-8 rounded-full">
                <div class="flex-grow">
                    <textarea class="w-full bg-gray-700 text-white rounded-lg p-2 resize-none"
                        rows="2" placeholder="Write a reply..."></textarea>
                    <div class="flex justify-end mt-2">
                        <button class="bg-crunchyroll-orange text-white px-4 py-1 rounded-lg hover:bg-orange-600 transition"
                            onclick="submitReply(${commentId}, this)">
                            Reply
                        </button>
                    </div>
                </div>
            </div>
        `;

        const commentElement = document.getElementById(`comment-${commentId}`);
        commentElement.appendChild(replyBox);
    }

    submitReply(commentId, button) {
        const textarea = button.parentElement.previousElementSibling;
        const text = textarea.value.trim();
        
        if (text) {
            const reply = {
                id: Date.now(),
                user: this.currentUser,
                text,
                timestamp: new Date(),
                likes: 0,
                replies: []
            };

            const comment = this.findComment(commentId);
            if (comment) {
                comment.replies.push(reply);
                this.saveComments();
                this.displayComments();
            }
        }
    }

    findComment(commentId, comments = this.comments) {
        for (const comment of comments) {
            if (comment.id === commentId) return comment;
            if (comment.replies.length > 0) {
                const found = this.findComment(commentId, comment.replies);
                if (found) return found;
            }
        }
        return null;
    }
}

// Initialize the comment system
window.initializeComments = function(containerId) {
    return new CommentSystem(containerId);
};

// Global functions for comment interactions
window.likeComment = function(commentId) {
    commentSystem.likeComment(commentId);
};

window.replyToComment = function(commentId) {
    commentSystem.replyToComment(commentId);
};

window.submitReply = function(commentId, button) {
    commentSystem.submitReply(commentId, button);
};

window.selectGif = function(url) {
    commentSystem.addComment('', url);
    document.getElementById('gifModal').classList.add('hidden');
};