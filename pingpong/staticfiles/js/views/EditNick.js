var serverres = document.getElementById('message');
var nickForm = document.getElementById('nickForm');

nickForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent default form submission
    
    const newNick = document.getElementById('nick').value;
    
    try {
        const csrftoken = window.getCookie('csrftoken');
        const response = await fetch('https://127.0.0.1:1443/api/editNick/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            },
            credentials: 'include',
            body: JSON.stringify({ nick: newNick })
        });

        if (response.ok) {
            const data = await response.json();
            serverres.textContent = 'Nickname updated successfully!';
            serverres.style.color = 'green';
            
            
            setTimeout(() => {
                window.go('profile');
            }, 2000);
        } else {
            const errorData = await response.json();
            serverres.textContent = errorData.error || 'Failed to update nickname';
            serverres.style.color = 'red';
        }
    } catch (error) {
        console.error('Error:', error);
        serverres.textContent = 'An error occurred. Please try again.';
        serverres.style.color = 'red';
    }
});