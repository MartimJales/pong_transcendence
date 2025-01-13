
// // <!-- page elements -->
// // <!-- {% include 'login.html' %} -->
// // <!-- {% include 'game_option.html' %}  
// // {% include 'teste.html' %} 
// // {% include '404.html' %}
// // {% include 'game.html' %}
// // {% include 'tournament.html' %}
// // {% include 'signup.html' %}
// // {% include 'profile.html' %}
// // {% include 'profile_history.html' %}
// // {% include 'edit_nick.html' %} 
// // {% include 'tour_history.html' %}
// // {% include 'multiplayer.html'%} -->

export class LoginPage extends BaseComponent {

    constructor()
    { 
        super("static/html/login.html");
    }

    async login(username, password){
        const messageElement = this.getElementById('message');
        const csrftoken = getCookie('csrftoken');
        try {
            const response = await fetch('https://localhost:1443/api/login/', {
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
                //localStorage.setItem('user_id', data.user_id);
                //localStorage.setItem('username', data.username);

        
                messageElement.textContent = 'Login successful!';
                messageElement.style.color = 'green';
                // console.log("deu bom info aqui debaixo");
                // console.log(data);

                Router.go("home");
                
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
    }

    onInit(){
        const loginForm = this.getElementById('loginForm');
        loginForm.addEventListener('submit', async (e) => {
            console.log("loginForm");
        e.preventDefault(); 
        const username = this.getElementById('username').value;
        const password = this.getElementById('password').value;
        this.login(username, password);
        });   
    }

    onExit(){
        console.log("tes");
    }
}

console.log("sfdfs");