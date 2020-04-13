
window.addEventListener("load", function () {
    // DOM ELEMENTS
    const divPageBanner = this.document.getElementById("page-banner");
    const titlePageBanner = divPageBanner.getElementsByClassName("title")[0];

    const divModeMenu = this.document.getElementById("mode-menu");

    const divInGame = this.document.getElementById("in-game");
    const canvas = divInGame.getElementsByTagName("canvas")[0];

    const DynamicContent = [divModeMenu, divLevelMenu, divInGame];

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
        switch (requestedPage) {
            case "#mode-solo":
                initSoloMode();
                break;

            case "#mode-multi":
                initMultiMode();
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
        // DISPLAY SOLO MODE
        divInGame.style.display = "flex";
        // SET CANVAS SIZE
        canvas.width = 600;
        canvas.height = 600;
        // RUN GAME
    }
    /*------------------------------------------------------------------------------------------*/


    /*------------------------------------------------------------------------------------------*/
    function initMultiMode() {
        // SET PAGE TITLE
        titlePageBanner.innerHTML = "Multi";
        // CLEAR PAGE
        clearDynamicContent();
        // DISPLAY MULTI MODE
        divInGame.style.display = "flex";
        // SET CANVAS SIZE
        canvas.width = 600;
        canvas.height = 600;
        // RUN GAME
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