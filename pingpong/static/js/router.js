
function getSessionId() {
    if (!document.cookie) {
        return null;
    }

    const cookies = document.cookie.split(';');

    for (let cookie of cookies) {
        // Use startsWith to properly match the cookie name
        if (cookie.trim().startsWith('sessionid=')) {
            const value = cookie.trim().split('=')[1];
            return value;
        }
    }
    return null;
}

window.getSessionId = getSessionId;

window.handleLogout = async () => {
    try {
        const csrftoken = window.getCookie('csrftoken');
        const response = await fetch('https://localhost:1443/api/logout/', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            }
        });

        if (response.ok) {
            localStorage.clear();
            sessionStorage.clear();
            Router.go('login');
        } else {
            const data = await response.json();
            console.log('Logout failed:', data.message);
        }
    } catch (error) {
        console.log('Logout error:', error);
    }
};

import "./index.js"

let isRefreshing = false;

window.addEventListener('beforeunload', () => {
    isRefreshing = true;
    setTimeout(() => {
        isRefreshing = false;
    }, 0);
});


window.addEventListener('unload', () => {
    if (!isRefreshing) {
        turnOff();
    }
    isRefreshing = false;
});

window.turnOff = async () => {
    try {
        const csrftoken = window.getCookie('csrftoken');
        const response = await fetch('https://localhost:1443/api/setOff/', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            }
        });
        if (response.ok) {
        } else {
            const data = await response.json();
            console.log('failed to set bool', data.message);
        }
    } catch (error) {
        console.log('Logout error:', error);
    }
};


window.addEventListener("load", (e) => { //everythime we change this shit with .go()
    const url = window.location.href.split("#/")[1];
    Router.setPage(url || "/");  
});

window.addEventListener("popstate", (e) => { //everythime we change this shit with .go()
    const url = window.location.href.split("#/")[1];
    Router.setPage(url || "/");  
});
