export default class Signup {
    constructor(params) {
        this.params = params;
    }

    async getHtml() {
        return `
            <div class="container">
                <div class="text-center mt-5">
                    <h1>Sign Up</h1>
                    <form method="POST" autocomplete="off">
                        <div class="form-group">
                            <label for="username">Username</label>
                            <input type="text" class="form-control" id="username" name="username" required>
                        </div>
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input type="email" class="form-control" id="email" name="email" required>
                        </div>
                        <div class="form-group">
                            <label for="password">Password</label>
                            <input type="password" class="form-control" id="password" name="password" required>
                        </div>
                        <input type="submit" value="Register" class="btn btn-primary">
                    </form>
                </div>
            </div>
        `;
    }

    async afterRender() {
        // Código JS que precise de ser executado após o HTML ser renderizado
    }
}
