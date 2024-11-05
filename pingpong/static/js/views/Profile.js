
 // const friendsList = document.getElementById('friendsList');
 // const addFriendBtn = document.getElementById('addFriendBtn');
 // const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
 // const userPk = friendsListContainer.dataset.userPk;
//
 // function updateFriendsList() {
 //   fetch(`http://127.0.0.1:8000/get_friends_list/${userPk}/`)
 //     .then(response => response.text())
 //     .then(html => {
 //       const parser = new DOMParser();
 //       const doc = parser.parseFromString(html, 'text/html');
 //       const newFriendsList = doc.getElementById('friendsList');
 //       if (newFriendsList) {
 //         friendsList.innerHTML = newFriendsList.innerHTML;
 //       }
 //     });
 // }
//
 // function addFriend() {
 //   const friendName = prompt("Enter friend's username:");
 //   if (friendName) {
 //     fetch('http://127.0.0.1:8000/add_friend/', { 
 //       method: 'POST',
 //       headers: {
 //         'Content-Type': 'application/x-www-form-urlencoded',
 //         'X-CSRFToken': csrfToken
 //       },
 //       body: `friend_username=${encodeURIComponent(friendName)}`
 //     })
 //     .then(response => response.json())
 //     .then(data => {
 //       if (data.status === 'success') {
 //         alert(data.message);
 //         updateFriendsList();
 //       } else {
 //         alert(data.message);
 //       }
 //     })
 //     .catch(error => {
 //       console.error('Error:', error);
 //       alert('An error occurred while adding the friend.');
 //     });
 //   }
 // }
//
 // addFriendBtn.addEventListener('click', addFriend);
//
 // 
 // updateFriendsList();

console.log("ftech vai ser mandado agora");  
async function profile_info(){
     console.log("masss que pohaaaaaa");
        try {
            const response = await fetch('http://127.0.0.1:8000/api/profile/', {
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

//setTimeout(profile_info, 3000);
console.log("ta aqui : ")
console.log(document.getElementById("main"));

