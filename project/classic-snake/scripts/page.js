import runGame from './gameEngine.js';


window.addEventListener("load", function () {
    // DOM ELEMENTS
    const divPageBanner = this.document.getElementById("page-banner");
    const titlePageBanner = divPageBanner.getElementsByClassName("title")[0];

    const divModeMenu = this.document.getElementById("mode-menu");

    const divSoloLevelMenu = this.document.getElementById("solo-level-menu");
    const buttonsSoloLevelMenu = divSoloLevelMenu.getElementsByClassName("level");

    const divMultiLevelMenu = this.document.getElementById("multi-level-menu");
    const buttonsMultiLevelMenu = divMultiLevelMenu.getElementsByClassName("level");

    const divInGame = this.document.getElementById("in-game");
    const canvas = divInGame.getElementsByTagName("canvas")[0];

    const DynamicContent = [divModeMenu, divSoloLevelMenu, divMultiLevelMenu, divInGame];

    // INIT
    init();
    function init() {

        updateDynamicContent();
        // EVENT LISTENERS
        window.addEventListener("hashchange", updateDynamicContent, false);
    }

    // FUNCTIONS
    /*------------------------------------------------------------------------------------------*/
    function updateDynamicContent() {
        const requestedPage = window.location.hash;
        // TODO populate dynamically
        switch (requestedPage) {
            case "#mode-solo":
                initSoloMode();
                break;
            case "#solo-level-1":
                initSoloLevel(1);
                break;
            case "#solo-level-2":
                initSoloLevel(2);
                break;
            case "#solo-level-3":
                initSoloLevel(3);
                break;

            case "#mode-multi":
                initMultiMode();
                break;
            case "#multi-level-1":
                initMultiLevel(1);
                break;
            case "#multi-level-2":
                initMultiLevel(2);
                break;
            case "#multi-level-3":
                initMultiLevel(3);
                break;

            default:
                // SET PAGE TITLE
                titlePageBanner.innerHTML = "Select the mode";
                // CLEAR PAGE
                clearDynamicContent();
                // DISPLAY MODE MENU
                divModeMenu.style.display = "flex";
                // RESET HASH
                window.location.hash = "";
        }
    }
    /*------------------------------------------------------------------------------------------*/


    /*------------------------------------------------------------------------------------------*/
    function initSoloMode() {
        // SET PAGE TITLE
        titlePageBanner.innerHTML = "Solo";
        // CLEAR PAGE
        clearDynamicContent();
        // DISPLAY SOLO LEVELS
        divSoloLevelMenu.style.display = "flex";
    }
    function initSoloLevel(levelNumber) {
        // CHECK PARAMETER
        if (levelNumber > 0 && levelNumber <= buttonsSoloLevelMenu.length) {
            // SET PAGE TITLE
            titlePageBanner.innerHTML = "Level " + levelNumber;
            // CLEAR PAGE
            clearDynamicContent();
            // TURN ON GAME DIV
            divInGame.style.display = "flex";
            // RUN GAME (ALSO DISPLAYS CANVAS)
            runGame(canvas, "solo", levelNumber);
        }
        else {
            // SET PAGE TITLE
            titlePageBanner.innerHTML = "Level " + levelNumber + " does not exist...";
        }
    }
    /*------------------------------------------------------------------------------------------*/


    /*------------------------------------------------------------------------------------------*/
    function initMultiMode() {
        // SET PAGE TITLE
        titlePageBanner.innerHTML = "Multi";
        // CLEAR PAGE
        clearDynamicContent();
        // DISPLAY MULTI LEVELS
        divMultiLevelMenu.style.display = "flex";
    }
    function initMultiLevel(levelNumber) {
        // CHECK PARAMETER
        if (levelNumber > 0 && levelNumber <= buttonsMultiLevelMenu.length) {
            // SET PAGE TITLE
            titlePageBanner.innerHTML = "Level " + levelNumber;
            // CLEAR PAGE
            clearDynamicContent();
            // RUN GAME
            runGame(canvas, "multi", levelNumber);
        }
        else {
            // SET PAGE TITLE
            titlePageBanner.innerHTML = "Level " + levelNumber + " does not exist...";
        }
    }
    /*------------------------------------------------------------------------------------------*/



    /*------------------------------------------------------------------------------------------*/
    function clearDynamicContent() {
        DynamicContent.forEach(element => {
            element.style.display = "none";
        });
    }
    /*------------------------------------------------------------------------------------------*/
});