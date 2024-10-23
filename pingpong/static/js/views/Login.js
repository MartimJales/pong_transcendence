var loginForm = document.getElementById('loginForm');
var messageElement = document.getElementById('message');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault(); 
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    console.log("segura essa pass carai : ");
    console.log(username);
    console.log(password);
    //window.go('404');
    //setPage("404");

    try {
        const csrftoken = window.getCookie('csrftoken');
        const response = await fetch('http://127.0.0.1:8000/api/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            },
            body: JSON.stringify({ username, password }),
            credentials: 'include'
        });  
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('user_id', data.user_id);
            messageElement.textContent = 'Login successful!';
            messageElement.style.color = 'green';
            //window.go('404');
        } else {
            const errorData = await response.json();
            messageElement.textContent = errorData.error || 'Login failed. Please try again.';
            messageElement.style.color = 'red';
        }
    } catch (error) {
        console.error('Login error:', error);
        messageElement.textContent = 'An error occurred. Please try again later.';
        messageElement.style.color = 'red';
    }
});   
    