
document.addEventListener('DOMContentLoaded', function() {
    console.log("dom vai ser chamado agora");   
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
});

console.log("ta aqui : ")
console.log(document.getElementById("main"));

