import Snake from "./classes/game/Snake.js";
import runGame from './gameEngine.js';

window.addEventListener("load", function () {
    /*------------------------------------------------------------------------------------------*/
    const pageHome = this.document.getElementById("page-home");
    const pageCredits = this.document.getElementById("page-credits");
    const pageOther = this.document.getElementById("page-other");
    const pageContent = [pageHome, pageCredits, pageOther];

    const arcadeTop = this.document.getElementsByClassName("arcade-top")[0];
    const arcadeTitle = arcadeTop.getElementsByClassName("arcade-title")[0];
    const arcadeNavbar = arcadeTop.getElementsByClassName("arcade-navbar")[0];
    const navbarPrev = arcadeNavbar.getElementsByClassName("navbar-prev")[0];
    const navbarAction = arcadeNavbar.getElementsByClassName("navbar-action")[0];
    const navbarNext = arcadeNavbar.getElementsByClassName("navbar-next")[0];
    const navbarContent = [navbarPrev, navbarAction, navbarNext];

    const arcadeScreen = this.document.getElementsByClassName("arcade-screen")[0];
    const screenLevels = arcadeScreen.getElementsByClassName("screen-levels")[0];
    const screenLobby = document.getElementsByClassName("screen-lobby")[0];
    const screenGame = arcadeScreen.getElementsByClassName("screen-game")[0];
    const screenContent = [screenLobby, screenLevels, screenGame];
    /*------------------------------------------------------------------------------------------*/


    /*------------------------------------------------------------------------------------------*/
    // LOBBY
    let nbPlayers = 0;
    let createdSnakes = [];
    const playersDisplay = document.getElementsByClassName("players-display")[0];
    const promptCommands = screenLobby.getElementsByClassName("prompt-commands")[0];
    const buttonValidate = screenLobby.getElementsByClassName("prompt-validate")[0];
    const zoneUp = [promptCommands.getElementsByClassName("up")[0], "up"];
    const zoneRight = [promptCommands.getElementsByClassName("right")[0], "right"];
    const zoneDown = [promptCommands.getElementsByClassName("down")[0], "down"];
    const zoneLeft = [promptCommands.getElementsByClassName("left")[0], "left"];
    const zones = [zoneUp, zoneRight, zoneDown, zoneLeft];
    zones.forEach(zone => {
        zone[0].addEventListener("keydown", e => {
            addKey(e.key, zone[0], zone[1]);
        });
    });
    navbarAction.addEventListener("click", displayPrompt);
    buttonValidate.addEventListener("click", submitCommands);

    // LEVELS
    const nbLevels = 4;
    const authorizedLevels = [];
    for (let index = 1; index <= nbLevels; index++) {
        authorizedLevels.push(index.toString());
    }
    const levelsDisplay = screenLevels.getElementsByClassName("levels-display")[0];
    populateLevelsDisplay();


    // GAME
    const gameCanvas = screenGame.getElementsByTagName("canvas")[0];
    const canvasContext = gameCanvas.getContext("2d");
    const canvasScale = 10;
    /*------------------------------------------------------------------------------------------*/


    // GLOBAL
    /*------------------------------------------------------------------------------------------*/
    window.addEventListener("hashchange", getRequestedPage);
    getRequestedPage();

    function getRequestedPage() {
        const requestedPage = window.location.hash;
        switch (requestedPage) {
            case "#credits":
                displayCredits();
                break;
            case "#lobby":
                navbarNext.addEventListener("click", function () {
                    if (nbPlayers > 0) { window.location.hash = 'levels' }
                });
                displayLobby();
                break;
            case "#levels":
                if (nbPlayers > 0) {
                    displayLevels();
                    navbarPrev.addEventListener("click", function () {
                        window.location.hash = 'lobby'
                    });
                }
                else window.location.hash = 'lobby';
                break;
            default:
                if (requestedPage.substr(0, 6) === "#level") {

                    if (nbPlayers > 0) {
                        const levelNumber = requestedPage.substr(6);

                        if (authorizedLevels.includes(levelNumber)) {
                            navbarPrev.addEventListener("click", function () {
                                window.location.hash = 'levels'
                            });
                            if (nbPlayers > 1) {
                                displayGame("multi", levelNumber);
                            }
                            else {
                                displayGame("solo", levelNumber);
                            }
                        }
                        else window.location.hash = 'levels';
                    }
                    else window.location.hash = 'lobby';

                }
                else {
                    displayHome();
                    window.location.hash = "";
                }
        }
    }

    function clearPageContent() {
        pageContent.forEach(div => {
            div.style.display = "none";
        });
    }
    function clearScreenContent() {
        screenContent.forEach(div => {
            div.style.display = "none";
        });
    }
    function clearNavbarContent() {
        navbarContent.forEach(div => {
            div.style.display = "none";
        });
    }

    function displayHome() {
        clearPageContent();
        pageHome.style.display = "flex";
    }
    function displayCredits() {
        clearPageContent();
        pageCredits.style.display = "flex";
    }
    function displayLevels() {
        clearPageContent();
        clearScreenContent();
        clearNavbarContent();
        pageOther.style.display = "flex";
        screenLevels.style.display = "flex";
        navbarPrev.style.display = "flex";
        arcadeTitle.innerHTML = "Level menu";
    }
    function displayGame(mode, levelNumber) {
        clearPageContent();
        clearScreenContent();
        clearNavbarContent();
        pageOther.style.display = "flex";
        screenGame.style.display = "flex";
        navbarPrev.style.display = "flex";
        arcadeTitle.innerHTML = "Level " + levelNumber;
        if (localStorage.getItem('level' + levelNumber + 'BestScore') && localStorage.getItem('level' + levelNumber + 'BestPlayer')) {
            const BS = localStorage.getItem('level' + levelNumber + 'BestScore');
            const BP = localStorage.getItem('level' + levelNumber + 'BestPlayer');
            navbarAction.style.display = "flex";
            navbarAction.textContent = "🏆" + BP + "🏆 " + BS + "pts";
        }
        else {
        }
        runGame(gameCanvas, canvasContext, canvasScale, mode, levelNumber, createdSnakes);
    }
    function displayLobby() {
        clearPageContent();
        clearScreenContent();
        clearNavbarContent();
        pageOther.style.display = "flex";
        screenLobby.style.display = "flex";
        navbarAction.style.display = "flex";
        navbarNext.style.display = "flex";
        navbarAction.textContent = "ADD PLAYER";
        arcadeTitle.innerHTML = "Lobby";
        if (nbPlayers < 1) {
            navbarNext.classList.add("disabled");
        }
    }
    /*------------------------------------------------------------------------------------------*/


    // LEVELS
    /*------------------------------------------------------------------------------------------*/
    function populateLevelsDisplay() {
        for (let index = 0; index < nbLevels; index++) {
            const level = document.createElement("button");
            level.classList.add("level-button");
            level.innerHTML = "level" + (index + 1);
            level.addEventListener("click", function () {
                window.location.hash = level.innerHTML;
            })
            levelsDisplay.appendChild(level);
        }
    }
    /*------------------------------------------------------------------------------------------*/


    // LOBBY
    /*------------------------------------------------------------------------------------------*/
    let commands = [null, null, null, null];

    function displayPrompt() {
        document.getElementsByClassName('players-placeholder')[0].style.display = "none";
        if (nbPlayers < 4) {
            buttonValidate.disabled = true;
            promptCommands.style.display = 'flex';
        }
    }

    function submitCommands() {
        const newSnake = new Snake(canvasContext, canvasScale);
        newSnake.commandPalette.changeCommands(commands[0], commands[1], commands[2], commands[3]);
        addPlayer(newSnake);
        navbarNext.classList.remove("disabled");
        promptCommands.style.display = 'none';
        resetSymbols();
    }

    function addPlayer(snake) {
        createdSnakes.push(snake);
        nbPlayers++;

        // CREATE PLAYER IN HTML
        const playerDiv = document.createElement('div');
        playerDiv.classList.add('player');

        const playerName = document.createElement('h2');
        playerName.innerHTML = '*Name Here*';
        playerName.classList.add("gamertag");
        snake.setName(playerName.innerHTML)
        playerName.contentEditable = true;
        playerName.addEventListener("keyup", function () {
            snake.setName(playerName.innerHTML);
        });
        playerDiv.appendChild(playerName);



        // const playerColor = document.createElement('div');
        // playerColor.classList.add('player-color');
        // playerColor.style.backgroundColor = "#FF9244";
        // snake.setColor("#FF9244");
        // playerDiv.appendChild(playerColor);

        const colorPalette = document.createElement('div');
        colorPalette.classList.add('color-palette');
        const color1 = document.createElement('div');
        const color2 = document.createElement('div');
        const color3 = document.createElement('div');
        const color4 = document.createElement('div');
        const colors = [color1, color2, color3, color4];
        colors.forEach(color => {
            color.classList.add('color-option');
            color.addEventListener("click", function () {
                snake.setColor(color.style.backgroundColor);
                playerDiv.style.backgroundColor = color.style.backgroundColor;
            });
            colorPalette.appendChild(color);
        });
        updateColorPalette(colors, "1");

        const playerTeam = document.createElement('select');
        const team1 = document.createElement('option');
        team1.innerHTML = "1";
        const team2 = document.createElement('option');
        team2.innerHTML = "2";
        const team3 = document.createElement('option');
        team3.innerHTML = "3";
        const team4 = document.createElement('option');
        team4.innerHTML = "4";
        snake.setTeam(parseInt(team1.innerHTML))
        const options = [team1, team2, team3, team4];
        options.forEach(team => {
            team.addEventListener("click", function () {
                snake.setTeam(parseInt(team.innerHTML));
                updateColorPalette(colors, team.innerHTML);
                snake.setColor(color1.style.backgroundColor);
                playerDiv.style.backgroundColor = color1.style.backgroundColor;
            });
            playerTeam.appendChild(team);
        });
        playerDiv.appendChild(playerTeam);
        playerDiv.appendChild(colorPalette);
        playerDiv.style.backgroundColor = color1.style.backgroundColor;
        snake.setColor(color1.style.backgroundColor);

        const labelTeam = document.createElement('label');
        labelTeam.innerHTML = "Team : ";
        playerTeam.parentNode.insertBefore(labelTeam, playerTeam);

        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = "delete";
        deleteButton.addEventListener("click", function () {
            deletePlayer(playerDiv, snake);
        });
        playerDiv.appendChild(deleteButton);

        playersDisplay.appendChild(playerDiv);
    }

    function updateColorPalette(colors, teamNumber) {
        let newColors = [];
        switch (teamNumber) {
            case "1":
                newColors = ["#2039CC", "#192DA1", "#111E6C", "#0C154A"]
                break;
            case "2":
                newColors = ["#00FF5D", "#00BF46", "#00802E", "#004017"]
                break;
            case "3":
                newColors = ["#BF1D3A", "#E62246", "#801327", "#400A13"]
                break;
            case "4":
                newColors = ["#F2C849", "#F29D35", "#F2B33D", "#F27127"]
                break;
            default:
                newColors = ["#2039CC", "#192DA1", "#111E6C", "#0C154A"]
                break;
        }
        for (let index = 0; index < colors.length; index++) {
            const color = colors[index];
            color.style.backgroundColor = newColors[index];
        }
    }

    function resetSymbols() {
        const symbols = promptCommands.getElementsByClassName("key-symbol");
        for (let index = 0; index < symbols.length; index++) {
            const symbol = symbols[index];
            symbol.innerHTML = "";
        }
    }

    function deletePlayer(playerDiv, snake) {
        playerDiv.remove();
        nbPlayers--;

        for (let index = 0; index < createdSnakes.length; index++) {
            const curSnake = createdSnakes[index];
            if (curSnake.getId() === snake.getId()) {
                createdSnakes.splice(index, 1);
            }
        }
    }

    function addKey(pressedKey, div, command) {
        switch (command) {
            case "up":
                commands[0] = pressedKey;
                break;
            case "right":
                commands[1] = pressedKey;
                break;
            case "down":
                commands[2] = pressedKey;
                break;
            case "left":
                commands[3] = pressedKey;
                break;
            default:
                break;
        }
        const symbol = div.getElementsByClassName("key-symbol")[0];
        switch (pressedKey) {
            case "ArrowUp":
                symbol.innerHTML = "⬆";
                break;
            case "ArrowRight":
                symbol.innerHTML = "➡";
                break;
            case "ArrowDown":
                symbol.innerHTML = "⬇";
                break;
            case "ArrowLeft":
                symbol.innerHTML = "⬅";
                break;
            case " ":
                symbol.innerHTML = "_";
                break;
            default:
                if (pressedKey.length > 1) symbol.innerHTML = "...";
                else symbol.innerHTML = pressedKey;
                break;
        }
        checkCommands();

        function checkCommands() {
            let ok = true;
            commands.forEach(command => {
                if (command === null) ok = false;
            });
            if (ok) {
                buttonValidate.disabled = false;
            }
        }
    }
    /*------------------------------------------------------------------------------------------*/
});