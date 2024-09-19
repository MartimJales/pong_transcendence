export default class Home {
    constructor(params) {
        this.params = params;
}

async getHtml() {
    return `
        <div class="container">
            <div class="text-center mt-5">
                <h1>Welcome to Transcendence</h1>
                <p>This is the home page of our Pong game application.</p>
                <a href="/game" class="btn btn-primary" data-link>Play Game</a>
            </div>
        </div>
    `;
}

async afterRender() {
    // Any JavaScript that needs to run after the HTML is rendered
}
}