import { getCookie } from '../router.js';

export default class Login {
    constructor(params) {
        this.params = params;
    }

    async getHtml() {
        return `
        <style>
            .ping-pong-container {
                background-color: #1a1a1a;
                color: #ffffff;
                padding: 2rem;
                border-radius: 10px;
                box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
            }
            .ping-pong-title {
                font-family: 'Arial Black', sans-serif;
                font-size: 2.5rem;
                text-transform: uppercase;
                margin-bottom: 2rem;
                text-shadow: 2px 2px 4px rgba(0, 255, 0, 0.5);
                position: relative;
                display: inline-block;
                padding: 0 50px;
            }
            .ping-pong-input {
                background-color: #333;
                border: 2px solid #00ff00;
                color: #ffffff;
                border-radius: 20px;
                padding: 0.5rem 1rem;
            }
            .ping-pong-input:focus {
                box-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
            }
            .ping-pong-btn {
                background-color: #00ff00;
                border: none;
                color: #000000;
                font-weight: bold;
                text-transform: uppercase;
                border-radius: 20px;
                padding: 0.5rem 2rem;
                transition: all 0.3s ease;
            }
            .ping-pong-btn:hover {
                background-color: #00cc00;
                transform: scale(1.05);
            }
            .ping-pong-ball {
                display: inline-block;
                width: 20px;
                height: 20px;
                background-color: #ffffff;
                border-radius: 50%;
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                animation: sideBounce 2s ease-in-out infinite;
            }
            .ping-pong-ball:first-child {
                left: 0;
                animation-delay: -1s;
            }
            .ping-pong-ball:last-child {
                right: 0;
            }
            @keyframes sideBounce {
                0%, 100% {
                    transform: translateY(-50%) translateX(0) scale(1, 1);
                    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
                }
                50% {
                    transform: translateY(-50%) translateX(15px) scale(1.1, 0.9);
                    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
                }
                0%, 100% {
                    background-color: rgba(255, 255, 255, 0.8);
                }
                50% {
                    background-color: rgba(255, 255, 255, 1);
                }
            }
        </style>
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-md-6">
                    <div class="ping-pong-container text-center mt-5">
                        <h1 class="ping-pong-title">
                            <span class="ping-pong-ball"></span>
                            Login to Transcendence
                            <span class="ping-pong-ball"></span>
                        </h1>
                        <form id="loginForm">
                            <div class="form-group mb-3">
                                <label for="username" class="mb-2">Username</label>
                                <input type="text" class="form-control ping-pong-input" id="username" name="username" required>
                            </div>
                            <div class="form-group mb-3">
                                <label for="password" class="mb-2">Password</label>
                                <input type="password" class="form-control ping-pong-input" id="password" name="password" required>
                            </div>
                            <button type="submit" class="btn ping-pong-btn mt-3">Serve!</button>
                        </form>
                        <div id="message" class="mt-3"></div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }
    
    async afterRender() {
        const loginForm = document.getElementById('loginForm');
        const messageElement = document.getElementById('message');

        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            try {
                const csrftoken = getCookie('csrftoken');
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
                    navigateTo('/profile');
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
    }
}