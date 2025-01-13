
import { LoginPage } from "./views/Login.js";
import {SignupPage} from "./views/Signup.js"
import { HomePage } from "./views/HomePage.js";
import { GameOptionPage } from "./views/GameOption.js"
import { GamePage} from "./views/Game.js"

Router.subscribe("login", LoginPage, null)
Router.subscribe("signup", SignupPage, null)
Router.subscribe("home", HomePage)
Router.subscribe("game_option", GameOptionPage)
Router.subscribe("game", GamePage)
Router.subscribe("/", HomePage)

export {};