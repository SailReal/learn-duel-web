import {registerWebSocketHandlers} from "./Websocket";
import {doFetch, replaceVueWithDiv} from "./Helper";
import Vue from "vue";
import App from "../views/App/App";
import Game from "../views/Game/Game";
import Result from "../views/Result";
import Help from "../views/Help";

const rootDivId = "root";

const renderApp = async (players: Player[]) => {
    const userResponse = doFetch(window.location.origin + '/rest/v1/username', "get");
    const maxPlayerResponse = doFetch(window.location.origin + '/rest/v1/getMaxPlayerCount', "get");
    const username = await (await userResponse);
    const maxPlayers = await (await maxPlayerResponse);

    new Vue({
        el: '#root',
        components: {
            App
        },
        data: {
            username: username,
            divId: rootDivId,
            players: players,
            showRemove: players.length > 1,
            showNewPlayerInput: players.length < maxPlayers
        },
        template: `<div v-bind:id="divId" style="width:100%; height: 100%">
                        <App 
                            :username="username"
                            :players="players"
                            :showRemove="showRemove"
                            :showNewPlayerInput="showNewPlayerInput">
                        </App>
                   </div>`
    });
};

export const renderGame = (question: Question, time: number) => {
    // create new div inside of root as vue will replace it
    replaceVueWithDiv();

    new Vue({
        el: '#vue-component',
        render: h => {
            return h(Game,
                {
                    props: {
                        question: question.text,
                        answers: question.answers,
                        time: time
                    }
                });
        }
    });
};

export const renderResult = (players: Player[]) => {
    // create new div inside of root as vue will replace it
    replaceVueWithDiv();

    new Vue({
        el: '#vue-component',
        render: h => {
            return h(Result,
                {
                    props: {
                        players: players
                    }
                });
        }
    });
};

export const renderHelp = (text: string) => {
    // create new div inside of root as vue will replace it
    replaceVueWithDiv();

    new Vue({
        el: '#vue-component',
        render: h => {
            return h(Help,
                {
                    props: {
                        text: text
                    }
                });
        }
    });
};

export const processUpdate = (gameState: GameState) => {
    if (gameState.action === "BEGIN") {
        history.pushState(gameState, "Menu", "/");
        renderApp(gameState.players);
    } else if (gameState.action === "SHOW_HELP") {
        history.pushState(gameState, "Help", "help");
        renderHelp(gameState.helpText)
    } else if (gameState.action === "SHOW_GAME") {
        history.pushState(gameState, "Game", "game");
        renderGame(gameState.currentQuestion!, gameState.currentQuestionTime!);
    } else if (gameState.action === "PLAYER_UPDATE") {
        history.pushState(gameState, "Menu", "");
        renderApp(gameState.players);
    } else if (gameState.action === "TIMER_UPDATE") {
        history.pushState(gameState, "Game", "game");
        renderGame(gameState.currentQuestion!, gameState.currentQuestionTime!);
    } else if (gameState.action === "SHOW_RESULT") {
        history.pushState(gameState, "Result", "result");
        renderResult(gameState.players);
    } else if (gameState.action === "ERROR") {
        // FIXME log error message
        alert(gameState.errorMessage);
    } else if (gameState.action == null) {
        history.pushState(gameState, "Menu", "");
        renderApp(gameState.players);
    }
};

// set what happens wenn we go back in history
window.onpopstate = (ev: PopStateEvent) => {
    const gameState = ev.state;
    if (gameState.action == null) {
        gameState.action = "BEGIN"
    }
    processUpdate(gameState);
};

registerWebSocketHandlers("wss://" + window.location.host + "/rest/v1/createSocket");
