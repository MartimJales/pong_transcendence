var loginForm = document.getElementById('loginForm');
var messageElement = document.getElementById('message');

// async function getCsrfToken() {
//     console.log("PEGAAAAA O")
//     try {
//         const response1 = await fetch('http://127.0.0.1:8000/api/get-csrf/', {
//             credentials: 'include',
//         });
//         if(response1.ok){
//             const receba = await response1.json();
//             console.log(receba);
//         }
//     } catch (error) {
//         console.error('Error getting CSRF token:', error);
//     }
// }

// getCsrfToken();

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault(); 
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    console.log("segura essa pass carai : ");
    console.log(username);
    console.log(password);

        const csrftoken = getCookie('csrftoken');
        try {
            const response = await fetch('http://127.0.0.1:8000/api/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken
                },
                credentials: 'include', //deixa o o django fazer o session cookie
                body: JSON.stringify({ username, password }),
            });  
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('user_id', data.user_id);
            localStorage.setItem('username', data.username);
            
            messageElement.textContent = 'Login successful!';
            messageElement.style.color = 'green';
            console.log("deu bom carai info aqui de baixo");
            console.log(data);
            window.go("profile");
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
    