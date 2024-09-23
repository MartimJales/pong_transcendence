// Import your view components
import Home from './views/Home.js';
import Game from './views/meuovo.js';
import Meuovoerror from './views/404.js';
import Tournament from './views/Tournament.js';
import Login from './views/Login.js';
import Profile from './views/Profile.js';

// Add a utility function to get cookies
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Add a function to set up CSRF token for AJAX requests
function setupCSRF() {
    const csrftoken = getCookie('csrftoken');
    if (csrftoken) {
        // Set up AJAX requests to include CSRF token
        const oldXHR = window.XMLHttpRequest;
        function newXHR() {
            const realXHR = new oldXHR();
            realXHR.addEventListener("readystatechange", function() {
                if(realXHR.readyState === 1) {
                    realXHR.setRequestHeader("X-CSRFToken", csrftoken);
                }
            }, false);
            return realXHR;
        }
        window.XMLHttpRequest = newXHR;
    }
}

const pathToRegex = path => new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");

const getParams = match => {
    const values = match.result.slice(1);
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(result => result[1]);
    return Object.fromEntries(keys.map((key, i) => {
        return [key, values[i]];
    }));
};

const navigateTo = url => {
    history.pushState(null, null, url);
    router();
};

const router = async () => {
    const routes = [
        { path: "/", view: Home },
        { path: "/home", view: Home },
        { path: "/login", view: Login },
        { path: "/profile", view: Profile },
        { path: "/tournament", view: Tournament },
        { path: "/:page", view: Meuovoerror }    
    ];

    console.log("Router function called");
    console.log("Current path:", location.pathname);
    // Test each route for potential match
    const potentialMatches = routes.map(route => {
        return {
            route: route,
            result: location.pathname.match(pathToRegex(route.path))
        };
    });

    let match = potentialMatches.find(potentialMatch => potentialMatch.result !== null);

    if (!match) {
        match = {
            route: routes[0],
            result: [location.pathname]
        };
    }
    console.log("Matched route:", match.route.path);
    console.log(getParams.toString)
    const view = new match.route.view(getParams(match));
    console.log("View instance created:", view);

    document.querySelector("#app").innerHTML = await view.getHtml();

    if (view.afterRender) {
        await view.afterRender();
    }
};

// Handle navigation
document.addEventListener("DOMContentLoaded", () => {
    setupCSRF(); // Set up CSRF token handling
    document.body.addEventListener("click", e => {
        if (e.target.matches("[data-link]")) {
            e.preventDefault();
            navigateTo(e.target.href);
        }
    });
    router();
});

// Handle browser back/forward buttons
window.addEventListener("popstate", (e) => {
    if (e.state) {
        router();
    } else {
        navigateTo(location.pathname);
    }
});

export { navigateTo, getCookie }; // Export getCookie for use in other modules