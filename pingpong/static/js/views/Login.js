export default class Login {
    constructor(params) {
        this.params = params;
    }

    async getHtml() {
        return `
            <div class="container">
                <div class="text-center mt-5">
                    <h1>Login with 42</h1>
                    <form action="/login" method="POST">
                        <div class="form-group">
                            <label for="username">Username</label>
                            <input type="text" class="form-control" id="username" name="username" required>
                        </div>
                        <div class="form-group">
                            <label for="password">Password</label>
                            <input type="password" class="form-control" id="password" name="password" required>
                        </div>
                        <button type="submit" class="btn btn-primary">Sign In</button>
                    </form>
                </div>
            </div>
        `;
    }

    async afterRender() {
        // Código JS que precise de ser executado após o HTML ser renderizado
    }
}
