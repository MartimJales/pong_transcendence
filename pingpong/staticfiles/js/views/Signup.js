
let formzin = document.getElementById("signupForm");
let msg = document.getElementById("message");

formzin.addEventListener('submit', async (e) => {
    e.preventDefault();

    const newUserData = {
        userName: document.getElementById("username").value,
        email: document.getElementById("email").value,
        pass: document.getElementById("password").value,
        passconf: document.getElementById("confirmPassword").value,
    }

    console.log("newUserData -->", newUserData);

    if (newUserData.pass !== newUserData.passconf){
        msg.innerText = "Passwords do not match";
        msg.style.color = "red";
        return;
    }

    try {
        const csrftoken = window.getCookie('csrftoken');
        const response = await fetch('https://127.0.0.1:1443/api/signup/', {
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
            document.getElementById("username").style.display = "none";
            document.getElementById("password").style.display = "none";
            document.getElementById("email").style.display = "none";
            document.getElementById("confirmPassword").style.display = "none";
            document.getElementById("button").style.display = "none";
            document.getElementById("div").style.display = "none";
            const newbtn = document.createElement("button");
            newbtn.type = "button";
            newbtn.textContent = "Join Transcendence";
            newbtn.classList.add("btn", "ping-pong-btn", "mt-3");
            newbtn.addEventListener('click', () => {
                window.go('login');
            });
            const donde = document.getElementById("local");
            donde.append(newbtn);
            msg.innerText = "Account created succesfully, please login";
            msg.style.color = "green";
        }else{
            const errorRe = await response.json();
            msg.textContent = errorRe.error || "Account creation failed, please try again";
            msg.style.color = "red";
        }
    } catch (error) {   
        console.log("fetch error", error);
        msg.innerText = "sepa que deu merda no fetch";
        msg.style.color = 'red';
    }

});   
    