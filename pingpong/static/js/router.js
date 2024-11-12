
    const data = {
        pages: new Map(),
        page: undefined,
        currentPageName: null 
    }

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


    function setPage(name)
    {
        console.log("url agora ----->", window.location.href, varzinha);
        console.log("setPage o arg q foi passado ----->", name);

        if (name === data.currentPageName) {
            console.log("Already on page:", name);
            return;
        }
        data.currentPageName = name;

        data.page?.remove();
        //if (data.page) { //script remove, precisa ?
        //    const oldScripts = document.querySelectorAll('script[data-page-script]');
        //    oldScripts.forEach(script => script.remove());
        //    data.page.remove();
        //}
     
        
        const page = data.pages.get(name) || Array.from(data.pages.values()).find(e =>  e.getAttribute("default") == "");
             
       
        console.log(data.pages.values());
        console.log("-page to be rendered ---->", page);
        console.log("id to arrobado -->", localStorage.getItem('user_id'));

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

    window.addEventListener("popstate", (e) => { //everythime we change this shit with .go()
        const name = window.location.href.split("#/")[1];
        if (window.location.href === "http://localhost:8000/" && localStorage.getItem('user_id')) // in case of manueally http://localhost:8000/ again
            name = "profile";
        setPage(name);  
    });


    let flag = 0;
    let varzinha;
    function getPageNameFromURL() { // only runs once when django renders a poha do html

        let flag = parseInt(localStorage.getItem('pageFlag') || '0'); // this shit is to prevent default behaviour do 404 page
        if (!flag) { 
            localStorage.setItem('pageFlag', '1'); // i++;
            if(localStorage.getItem('user_id')){
                console.log("trigged automatico aqui!! --> login profile");
                return "profile";
            }
            console.log("trigged automatico aqui!! --> login profile")
            return "login";
        }

        let pageName;
        let hash = window.location.href;
        
        if (hash === "http://localhost:8000/" || hash === "http://127.0.0.1:8000/"){
            if (localStorage.getItem('user_id')){ //asim forcamos o user a presionar sempre logout
                pageName = "profile";
            }
            else{
                pageName = "login";
            }
            return pageName;   //talvez checkar se o user ja foi logado para redirecionar para lo profile security here
        }
        hash = window.location.hash;
        pageName = hash.startsWith('#/') ? hash.slice(2) : 'default';
        console.log(`oque ta na url window.location.ref: ${window.location.href}`);
        console.log(`oque tiramos: ${pageName}`);
        varzinha = pageName;
        return pageName;
    }

    
    document.addEventListener('DOMContentLoaded', () => {
        //window.pros = pegar info do user para qeue 
        
        const elements = Array.from(document.querySelectorAll("page-element"));
        for (const element of elements) {
        data.pages.set(element.getAttribute("name"), element);
        document.body.removeChild(element);
        }
        console.log(data.pages);

        
        const name = getPageNameFromURL();
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


    window.getCookie = getCookie;

    // -----------------------------------NAV BAR-------------------------------

    window.handleLogout = async () => {
        try {
            const csrftoken = window.getCookie('csrftoken');
            const response = await fetch('http://127.0.0.1:8000/api/logout/', {
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
            <nav class="navbar navbar-expand-md navbar-dark bg-dark mb-4">
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

    function updateNavigation() {
        const userId = localStorage.getItem('user_id');
        const currentNav = document.querySelector('nav');
        if (currentNav) {
            currentNav.remove();
        }

        const template = document.createElement('template');
        template.innerHTML = userId ? navTemplates.loggedIn : navTemplates.loggedOut;
        document.body.insertBefore(template.content.firstElementChild, document.body.firstChild);
    }

    