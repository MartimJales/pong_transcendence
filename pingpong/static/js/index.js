
import { LoginPage } from "./views/Login.js";
import {SignupPage} from "./views/Signup.js"
import { HomePage } from "./views/HomePage.js";
import { GameOptionPage } from "./views/GameOption.js"
import { GamePage} from "./views/Game.js"
import { EditNickPage } from "./views/EditNick.js"
import { MatchHistoryPage} from "./views/MatchHistory.js"
import { TournamentHistoryPage } from "./views/TournamentHistory.js"
import { TournamentPage } from "./views/Tournament.js"
import { MultiplayerPage } from "./views/Multiplayer.js"

Router.subscribe("login", LoginPage, null)
Router.subscribe("signup", SignupPage, null)
Router.subscribe("home", HomePage)
Router.subscribe("game_option", GameOptionPage)
Router.subscribe("game", GamePage)
Router.subscribe("edit_nick", EditNickPage)
Router.subscribe("match_history", MatchHistoryPage)
Router.subscribe("tournament_history", TournamentHistoryPage)
Router.subscribe("tournament", TournamentPage)
Router.subscribe("multiplayer", MultiplayerPage)
Router.subscribe("/", HomePage)

export {};