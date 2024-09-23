import { getCookie } from '../router.js';

export default class Profile {
    constructor(params) {
        this.params = params;
        this.userData = null;
    }

    async getHtml() {
        return `
            <div id="profile-container">
                Loading profile data...
            </div>
        `;
    }

    async afterRender() {
        try {
            const response = await fetch('/api/get_profile_data/', {
                method: 'GET',
                headers: {
                    'X-CSRFToken': getCookie('csrftoken')
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to fetch profile data');
            }

            this.userData = await response.json();
            this.updateProfileHtml();
        } catch (error) {
            console.error('Error fetching profile data:', error);
            document.getElementById('profile-container').innerHTML = 'Error loading profile data.';
        }
    }

    updateProfileHtml() {
        const container = document.getElementById('profile-container');
        container.innerHTML = `
            <div class="container">
                <div class="row">
                    <div class="col-md-8">
                        <div class="text-center mt-5">
                            <h1>Welcome, ${this.userData.username}</h1>
                            <br>
                            <img src="${this.userData.image_url}" alt="Profile Image" class="img-fluid rounded-circle" style="width: 200px; height: 200px; object-fit: cover;">
                            <br>
                            <h2>Nick: ${this.userData.nick}</h2>
                            <h2>Losses: ${this.userData.losses}</h2>
                            <h2>Winnings: ${this.userData.wins}</h2>
                            <h2>Total Points: ${this.userData.total_points}</h2>
                            <button onclick="editProfile()" class="btn btn-secondary">Edit Nickname</button>
                            <button onclick="viewMatchHistory()" class="btn btn-secondary">Match History</button>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="mt-5">
                            <h2 class="text-center mb-4">Friends</h2>
                            <div id="friendsList" class="list-group mb-3">
                                <ul>
                                    ${this.userData.friends.map(friend => 
                                        `<li>${friend.username} - ${friend.is_online ? 'Online' : 'Offline'}</li>`
                                    ).join('')}
                                </ul>
                            </div>
                            <button onclick="addFriend()" class="btn btn-secondary w-100">Add Friend</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

// These functions need to be implemented or linked to your router
function editProfile() {
    // Implement edit profile logic or navigation
}

function viewMatchHistory() {
    // Implement view match history logic or navigation
}

function addFriend() {
    // Implement add friend logic
}