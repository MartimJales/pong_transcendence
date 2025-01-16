class BaseComponent extends HTMLElement {

    constructor(template){
        super();
        fetch(template).then(async (result) => {

            if (result.ok)
            {
                const html = await result.text();
                this.innerHTML = html;
                this.onInit();
            }
            else
                document.body.innerHTML = "Not Page"
        })
    }

    onInit(){
    }

    onExit(){
    }

    getElementById(id){
        return this.querySelector("#"+id);
    }
}

customElements.define("base-component", BaseComponent);

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

const components = new Map();
let componentSelect = undefined; 
let urlSelect = undefined; 

class Router {

    static params = {};

    static async authStatus() {
        try {
             const response = await fetch('https://localhost:1443/api/auth-status/', {
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                }
            });
            if (response.ok) {
                const data = await response.json();
                return data.isAuthenticated;
            }
            
        } catch (error) {
            return false;
        }
    }

    static subscribe(url, component, auth = () => Router.authStatus())
    {
        const name = component.name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
        if (customElements.get(name) == undefined)
            customElements.define(name, component);
        components.set(url || "/", { component, auth });
    }

    static go(url, params = {}) {
        // Cria um objeto URL com a parte base da URL
        let fullUrl = "/#/" + url;
    
        // Se o objeto params não estiver vazio, adicione os parâmetros à URL
        if (Object.keys(params).length > 0) {
            const queryString = new URLSearchParams(params).toString();
            fullUrl += '?' + queryString; // Adiciona a query string à URL
        }
    
        // Redireciona para a nova URL com os parâmetros
        window.location.href = fullUrl;
    }


    static async setPage(url){
        Router.params =  url.includes("?") ? new URLSearchParams(new URL(window.location.href).search) : {};
        url = url.split("?")[0];
        if (url === urlSelect) return;
            urlSelect = url;

        document.body.innerHTML = "";
        if (componentSelect && componentSelect.onExit) 
            componentSelect.onExit();
        const data = components.get(url || "/");
        if (!data) {
            if ((await Router.authStatus())) 
                Router.go("");
            else
                Router.go("login");
            return ;
        }
        const {component, auth} = data;
        if (auth) {
           if (!(await auth())) 
           {
                Router.go("login");
                return ;
           }
        }
        if (component) 
            componentSelect = document.body.appendChild(new component());
        else
            componentSelect = null;
    }
}
