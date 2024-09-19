export default class meuovoerror {
    constructor(params) {
        this.params = params;
}

async getHtml() {
    return `
        <div class="container">
            <h1> 404 NO FOUND </h1>
        </div>
    `;
}

async afterRender() {
    // Any JavaScript that needs to run after the HTML is rendered
}
}