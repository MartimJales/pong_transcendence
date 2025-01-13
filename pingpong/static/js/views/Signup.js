


export class SignupPage extends BaseComponent 
{
    constructor(){
        super("static/html/signup.html")
    }

    onInit(){
        let formzin = this.getElementById("signupForm");
        let msg = this.getElementById("message");

        formzin.addEventListener('submit', async (e) => {
            e.preventDefault();

            const newUserData = {
                userName: this.getElementById("username").value,
                email: this.getElementById("email").value,
                pass: this.getElementById("password").value,
                passconf: this.getElementById("confirmPassword").value,
            }

            // console.log("ta aqui -->", newUserData);

            if (newUserData.pass !== newUserData.passconf){
                msg.innerText = "Passwords do not match";
                msg.style.color = "red";
                return;
            }

            try {
                const csrftoken = getCookie('csrftoken');
                const response = await fetch('https://localhost:1443/api/signup/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrftoken
                    },
                    body: JSON.stringify(newUserData),
                    credentials: 'include'
                });
                if (response.ok){
                    const data = await response.json();
                    this.getElementById("username").style.display = "none";
                    this.getElementById("password").style.display = "none";
                    this.getElementById("email").style.display = "none";
                    this.getElementById("confirmPassword").style.display = "none";
                    this.getElementById("butao").style.display = "none";
                    this.getElementById("div").style.display = "none";
                    const newbtn = document.createElement("button");
                    newbtn.type = "button";
                    newbtn.textContent = "Sign-up";
                    newbtn.classList.add("btn", "ping-pong-btn", "mt-3");
                    newbtn.addEventListener('click', () => {
                        Router.go('login');
                    });
                    const donde = this.getElementById("local");
                    donde.append(newbtn);
                    msg.innerText = "Account created succesfully, please login to computaria";
                    msg.style.color = "green";
                }else{
                    const errorRe = await response.json();
                    msg.textContent = errorRe.error || "Account creation failed, please try again brother";
                    msg.style.color = "red";
                }
            } catch (error) {   
                console.log("fetch error: ", error);
                msg.innerText = "fetch error";
                msg.style.color = 'red';
            }

        });   
    }

    onExit(){
        console.log("SignupPage: onExit");
    }
}