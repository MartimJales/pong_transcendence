
console.log("ftech vai ser mandado agora"); 
 
async function profile_info(){
     console.log("foi buscarrr o profile");

     
        try {
            const response = await fetch('https://127.0.0.1:1443/api/profile/', {
                credentials: 'include',
                headers: {
                    'Accept': 'application/json'
                }
            });
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                document.querySelector('h1').textContent = `Welcome, ${data.username}`;
                
                //document.querySelector('img').src = data.image_url;
                
                const h2Elements = document.querySelectorAll('h2');
                h2Elements[0].textContent = `Nick: ${data.nick}`;
                h2Elements[1].textContent = `Losses: ${data.losses}`;
                h2Elements[2].textContent = `Winnings: ${data.wins}`;
                h2Elements[3].textContent = `Total Points: ${data.total_points}`;

                const imagenzinha = document.getElementById("circle");
                imagenzinha.src = data.image_url;
                console.log("info: ", data);
                

                localStorage.setItem('usernick', data.nick);
                
                // Update friends list
                const friendsList = document.querySelector('#friendsList ul');
                if (data.friends.length > 0) {
                    friendsList.innerHTML = data.friends.map(friend => `
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            ${friend.username}
                            <span class="badge ${friend.is_online ? 'bg-success' : 'bg-secondary'} rounded-pill">
                                ${friend.is_online ? 'Online' : 'Offline'}
                            </span>
                        </li>
                    `).join('');
                } else {
                    friendsList.innerHTML = `
                        <li class="list-group-item text-center">
                            No friends added yet
                        </li>
                    `;
                }
                    
            } else {
                const errorData = await response.json();
                console.log(errorData);
            }
        } catch (error) {
            console.log("Error:", error);
        }
    
}

profile_info();
var messageElement = document.getElementById('message');

document.getElementById("addFriendBtn").addEventListener('click', async (e) => {
    e.preventDefault(); 

    const aplydiv = document.getElementById("friendsbox");
    const formzin = document.createElement("div");
    formzin.classList.add("mt-3");
    formzin.innerHTML = `
       <form id="loginForm" class="login-form">
            <input type="text" 
                   id="friendName" 
                   name="friendName" 
                   class="form-control mb-2" 
                   placeholder="Enter friend's username"
                   style="background-color: #2b3035; color: white; border: 1px solid #6c757d;">
            <button id="friendBtn" 
                    type="submit" 
                    class="btn btn-secondary w-100"
                    style="background-color: #6c757d; border-color: #6c757d;">
                Add MF
            </button>
        </form>
    `;
    const addFriendBtn = document.getElementById("addFriendBtn");
    addFriendBtn.style.display = "none";
    aplydiv.appendChild(formzin);

    document.getElementById("loginForm").addEventListener('submit', async (e) => {
        e.preventDefault();
        const friendName = document.getElementById("friendName").value;

        console.log("fetch do add friend agora");
        try {
            const csrftoken = window.getCookie('csrftoken');
            const response = await fetch('https://127.0.0.1:1443/api/add/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRFToken': csrftoken
                },
                body: JSON.stringify({friendName}),
                credentials: 'include'
            });
            
            if(response.ok) {
                const data = await response.json();
                console.log("deu bom");
                console.log(data);
                
                // Show success message
                messageElement.textContent = 'Friend added successfully!';
                messageElement.style.color = 'green';
                messageElement.style.display = 'block';
                
                // Clear the input field
                document.getElementById("friendName").value = '';
                
                // Update friends list
                await profile_info();
                
                // Hide form after success
                formzin.remove();
                addFriendBtn.style.display = "block";
                
                // Hide success message after delay
                setTimeout(() => {
                    messageElement.style.display = 'none';
                }, 3000);
            } else {
                const errorData = await response.json();
                messageElement.textContent = errorData.error || 'Failed to add friend. Please try again.';
                messageElement.style.color = 'red';
                messageElement.style.display = 'block';

                setTimeout(() => {
                    messageElement.style.display = 'none';
                }, 3000);
                
                // Don't remove form on error - let user try again
            }
        } catch(error) {
            console.error("Error adding friend:", error);
            messageElement.textContent = 'An error occurred. Please try again.';
            messageElement.style.color = 'red';
            messageElement.style.display = 'block';

            setTimeout(() => {
                messageElement.style.display = 'none';
            }, 3000);
            
            // Don't remove form on error - let user try again
        }
    });
});


// Get the elements
var profileImg = document.querySelector('.profile-img');
var fileInput = document.querySelector('#profileImageUpload');

console.log(profileImg);

// Make image clickable
profileImg.style.cursor = 'pointer';

// Add click handler to image
profileImg.addEventListener('click', () => {
    fileInput.click();
});

// Handle file selection
fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
    }

    // Create FormData
    const formData = new FormData();
    formData.append('image', file);
    
    try {
        const csrftoken = getCookie('csrftoken');
        const response = await fetch('https://127.0.0.1:1443/api/upload_profile_image/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrftoken
            },
            body: formData,
            credentials: 'include'
        });

        if (response.ok) {
            const data = await response.json();
            // Update the image source
            profileImg.src = "/static/images/" + data.image_url;
        } else {
            const errorData = await response.json();
            console.error('Upload failed:', errorData);
            alert(errorData.error || 'Failed to upload image');
        }
    } catch (error) {
        console.error('Error:', error);
        alert(error);
    }
});