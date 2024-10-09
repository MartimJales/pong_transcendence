
const data = {
    pages: new Map(),
    page: undefined
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
    console.log("setPage: ", name)
    data.page?.remove();
    const page = data.pages.get(name) || Array.from(data.pages.values()).find(e =>  e.getAttribute("default"));

    if (page)
    {
    const newPage = document.createElement("div");
    window.page = newPage;
    newPage.style.display = "flex";
    newPage.innerHTML = page.innerHTML;
    
    document.body.append(newPage);
   
    const newScript = document.createElement("script");
    newScript.src = page.getAttribute("src");
    newPage.append(newScript);
    data.page = newPage;
    }
}

window.addEventListener("popstate", (e) => {
    const name = window.location.href.split("#/")[1];
    setPage(name);
});

function getPageNameFromURL() {
    const hash = window.location.hash;
    return hash.startsWith('#/') ? hash.slice(2) : 'default';
  }

document.addEventListener('DOMContentLoaded', () => {
    //window.pros = pegar info do user para qeue 
    // Your initialization code here
    const elements = Array.from(document.querySelectorAll("page-element"));
    for (const element of elements) {
      data.pages.set(element.getAttribute("name"), element);
      document.body.removeChild(element);
    }
    console.log(data.pages);
  
    // Set initial page
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