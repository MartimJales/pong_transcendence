

    const data = {
        pages: new Map(),
        page: undefined,
        currentPageName: null 
    }

    let auth;


    // const elements = Array.from(document.querySelectorAll("page-element"));
    // for (const element of elements)
    // {
    //     data.pages.set(element.getAttribute("name"), element)
    // }

    // console.log(data.pages);

    class PageElement extends HTMLElement {

        constructor(){
            super();
            this.style.display = "none";
        }
    }

    customElements.define("page-element", PageElement);

    window.go = (name) => {
        window.location.href = "/#/" + name;
    }


    async function setPage(name)
    {

        
        console.log("url agora ----->", window.location.href, varzinha);
        console.log("setPage o arg q foi passado ----->", name);

        //if (name === data.currentPageName) {
        //    console.log("Already on page:", name);
        //    return;
        //}


        data.currentPageName = name;

        data.page?.remove();
        
        //let page = data.pages.get(name) || Array.from(data.pages.values()).find(e =>  e.getAttribute("default") == "");
        let page;   
       
        console.log(data.pages.values());
        console.log("-page to be rendered ---------> ", page);

        let authResult1 = await authStatus();

        if(!authResult1){
            if(name === 'signup')
                page = data.pages.get('signup');
            else
                page = data.pages.get('login');
        }  
        else{
            page = data.pages.get(name) || Array.from(data.pages.values()).find(e =>  e.getAttribute("default") == "");

        }
        

        if (page)
        {
            updateNavigation();
            const newPage = document.createElement("div");
            window.page = newPage;
            newPage.style.display = "flex";
            newPage.innerHTML = page.innerHTML;
            document.body.append(newPage);
            

            const newScript = document.createElement("script");
            newScript.src = page.getAttribute("src");
            newPage.append(newScript);
            data.page = newPage;

            //const scriptSrc = page.getAttribute("src");
            //if (scriptSrc) {
            //    const newScript = document.createElement("script");
            //    newScript.setAttribute('data-page-script', '');
            //    newScript.type = "text/javascript";
            //    newScript.src = scriptSrc;
            //    document.body.appendChild(newScript);
            //}
            //data.page = newPage;
        }   

    };

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


    window.addEventListener("popstate", (e) => {
        const name = window.location.href.split("#/")[1];
        console.log("bateu no popstate");
        setPage(name);  
    });


    let flag = 0;
    let flagzinha = 0;
    let varzinha;
    async function getPageNameFromURL() { // only runs once when django renders the html or refreshes the page

        let pageName;
        let hash = window.location.href;
        

        let authResult = await authStatus();
        console.log("resultado do status é********", authResult);
  
       if (hash === "https://localhost:1443/"){
            pageName = authResult ? 'profile' : 'login';
            console.log("entrou no if")
       }else{
            hash = window.location.hash; 
            pageName = hash.startsWith('#/') ? hash.slice(2) : 'default';
            console.log("mudou aqui AGORA ------------> ", pageName);
       }

       

        console.log(`o que ta na url window.location.ref: ${window.location.href}`);
        console.log(`o que tiramos: ${pageName}`);
        varzinha = pageName;
        return pageName;
    }

    
    document.addEventListener('DOMContentLoaded', async () => {
        
        
        const elements = Array.from(document.querySelectorAll("page-element"));
        for (const element of elements) {
        data.pages.set(element.getAttribute("name"), element);
        document.body.removeChild(element);
        }
        console.log(data.pages);

        
        const name = await getPageNameFromURL();
        setPage(name);
    });

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

    function getSessionId() {
        if (!document.cookie) {
            console.log("No cookies found");
            return null;
        }
    
        const cookies = document.cookie.split(';');
        console.log("All cookies:", cookies);  // Debug log
    
        for (let cookie of cookies) {
            // Use startsWith to properly match the cookie name
            if (cookie.trim().startsWith('sessionid=')) {
                const value = cookie.trim().split('=')[1];
                console.log("Found session ID:", value);  // Debug log
                return value;
            }
        }
        return null;
    }

    window.getCookie = getCookie;
    window.getSessionId = getSessionId;

    // -----------------------------------NAV BAR-------------------------------


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
                console.log("done");
            } else {
                const data = await response.json();
                console.error('failed to set bool', data.message);
            }
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

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
                window.go('login');
            } else {
                const data = await response.json();
                console.error('Logout failed:', data.message);
            }
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const navTemplates = {
        loggedOut: `
            <nav class="navbar navbar-expand-md navbar-dark bg-dark mb-4">
                <a class="navbar-brand" href="/" data-link>Transcendence</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" 
                    aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarCollapse">
                    <ul class="navbar-nav mr-auto">
                        <li class="nav-item">
                            <a class="nav-link" onclick="window.go('signup')" data-link>Register</a>
                        </li>
                    </ul>
                </div>
            </nav>
        `,
        loggedIn: `
            <nav class="navbar navbar-expand-md navbar-dark bg-dark mb-4" id="navs">
                <a class="navbar-brand" href="/" data-link>Transcendence</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" 
                    aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarCollapse">
                    <ul class="navbar-nav mr-auto">
                        <li class="nav-item">
                            <a class="nav-link" onclick="window.go('profile')" data-link>Profile</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" onclick="window.go('gameoption')" data-link>Play Game</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" onclick="handleLogout()" data-link>Logout</a>
                        </li>
                    </ul>
                </div>
            </nav>
        `
    };

    async function updateNavigation() {
        try {
             const response = await fetch('https://localhost:1443/api/auth-status/', {
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                }
            });
            
            const currentNav = document.querySelector('nav');
            if (currentNav) {
                currentNav.remove();
            }
    
            const template = document.createElement('template');
            
            if (response.ok) {
                const data = await response.json();
                console.log("Auth status:", data);
                
                template.innerHTML = data.isAuthenticated ? navTemplates.loggedIn : navTemplates.loggedOut;
            } else {
                console.error('Auth check failed:', response.status);
                template.innerHTML = navTemplates.loggedOut;
            }
            
            document.body.insertBefore(template.content.firstElementChild, document.body.firstChild);
            
        } catch (error) {
            console.error('Navigation update failed:', error);
            const template = document.createElement('template');
            template.innerHTML = navTemplates.loggedOut;
            document.body.insertBefore(template.content.firstElementChild, document.body.firstChild);
        }
    }
    

    async function authStatus() {
        try {
             const response = await fetch('https://localhost:1443/api/auth-status/', {
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log("Auth status:", data);
                auth = data.isAuthenticated ? 1 : 0;
                return auth;  // Return the same value we stored in au
            }
            
        } catch (error) {
            console.error('merda no fetch', error);
        }
    }
    