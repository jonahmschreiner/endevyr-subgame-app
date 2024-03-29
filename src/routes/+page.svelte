<style>
    button {
        background: none;
        padding: 0;
        border: none;
        cursor: pointer;
        font-family: 'Inter';
        -webkit-tap-highlight-color: transparent;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }

    input {
        font-family: 'Inter';
        height: 36px;
        border-radius: 5px;
        color: black;
        font-size: 16px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
        padding-left: 10px;
    }

    input:focus {
        outline: none;
    }

    input::placeholder {
        color: #7C7B7B;
        font-family: 'Inter';
        font-size: 15px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        padding-left: 0px;
    }

    textarea {
        box-sizing: border-box;
        width: 90%;
        height: 150px;
        flex-shrink: 0;
        border-radius: 5px;
        border: 2px solid #000;
        color: #000;
        font-family: 'Inter';
        font-size: 16px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
        padding-left: 10px;
        padding-top: 10px;
        max-width: 600px;
        resize: none;
        margin-top: 5px;
    }
    
    textarea::placeholder {
        color: #7C7B7B;
        font-family: 'Inter';
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
    }

    textarea:focus {
        outline: none;
    }

    .page-button {
        border-radius: 20px;
        border: solid;
        border-color: #000;
        border-width: 2px;
        background: #FFF;
        width: 90%;
        box-sizing: border-box;
        height: 36px;
        margin-top: 25px;
        color: #000;
        text-align: center;
        font-family: 'Inter';
        font-size: 16px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
        max-width: 600px;
        cursor: pointer;
        letter-spacing: -0.01em;
    }

    h1 {
        flex-shrink: 0;
        color: #000;
        text-align: left;
        font-family: 'Inter';
        font-size: 32px;
        font-style: normal;
        font-weight: 900;
        line-height: 1.2;
        margin-top: 0px;
        margin-bottom: 0px;
        letter-spacing: -0.01em;
    }

    h2 {
        letter-spacing: -0.01em;
    }

    .drill-input-title {
        font-size: 16px;
        font-family: 'Inter';
        color: #6F6D6D;
        margin: 0;
        letter-spacing: -0.01em;
        line-height: 1.2;
        font-weight: 900;
        margin-top: 20px;
    }

    .super-parent-text {
        font-size: 16px;
        font-family: 'Inter';
        color: #6F6D6D;
        letter-spacing: -0.01em;
    }

    .tooltip-modal {
        border-radius: 15px;
        border: 1px solid #EFEFEF;
        background: #FFF;
        box-shadow: 0px 5px 4px 0px rgba(0, 0, 0, 0.68);
        box-sizing: border-box;
        width: 85%;
        padding: 5px;
        z-index: 1000;
        position: absolute;
        max-width: 360px;
    }

    .tooltip-modal-content {
        color: #000;
        text-align: center;
        font-family: 'Inter';
        font-size: 15px;
        font-style: normal;
        font-weight: 600;
        line-height: 1.4;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 10px;
        margin-bottom: 17px;
    }

    .navigationSection {
        display: flex;
        justify-content: flex-end;
    }

    .onboarding-text {
        font-family: 'Inter';
        font-size: 20px;
        font-weight: 500;
        line-height: 1.4;
        margin: 0;
    }

    .onboarding-bullet {
        font-family: 'Inter';
        font-size: 20px;
        font-weight: 500;
        line-height: 1.4;
        margin: 0;
        margin-bottom: 5px;
    }

    .onboarding-list {
        margin: 0;
        padding-left: 27px;
    }

    .modal {
        background-color: white;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding-left: 10px;
        padding-right: 10px;
        padding-top: 10px;
        position: absolute;
        border-radius: 5px;
        border-color: black;
        border-width: 2px;
        border-style: solid;
        box-shadow: 0px 5px 4px 0px rgba(0, 0, 0, 0.68);
    }

    .modal-element {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        gap: 15px;
        margin-bottom: 10px;
    }

    .modal-text {
        color: #000000;
        font-family: 'Inter';
        font-size: 20px;
        font-weight: 600;
        line-height: normal;
        text-align: left;
        margin: 0;
        letter-spacing: -0.01em;
    }

    @media (max-width: 430px) {
        .tooltip-modal {
            left: 50%;
            transform: translateX(-50%);
            width: 92%;
        }
    }
</style>

<script>
    import { tick, onMount } from "svelte";
    import { goto } from '$app/navigation';
    import LogRocket from 'logrocket';
    import Onboardinggraphic1 from "../lib/onboardinggraphic1.svelte";
    import Onboardinggraphic2 from "../lib/onboardinggraphic2.svelte";
    import Onboardinggraphic3 from "../lib/onboardinggraphic3.svelte";
    import Onboardinggraphic4 from "../lib/onboardinggraphic4.svelte";
    export let data;
    const baseURL = import.meta.env.VITE_APP_BASE_URL;
    let { user, drillsdue } = data;
    if (user.email != "jonahmschreiner@gmail.com"){
        LogRocket.init('1ok2hy/endevyr-app');
        LogRocket.identify(user.id, {
            name: user.name,
            email: user.email,
        });
    }
    let processStage = 0;
    if (drillsdue == null || drillsdue == undefined || drillsdue.length == 0) {
        processStage = 1;
    }

    let primaryGames = user.games.filter(obj => obj.parentgameid == null);
    function getSubgamesOfGame (gameIn) {
        return user.games.filter(obj => obj.parentgameid == gameIn.id).sort((a, b) => a.parentgamesubgamesindex - b.parentgamesubgamesindex);
    }

    let viewportWidth;
    const updateWidth = () => {
        viewportWidth = window.innerWidth;
    };
    onMount(() => {
        updateWidth();
        window.addEventListener('resize', updateWidth);
        if (user.onboardingcomplete == 0 && user.onboardingstage == 6) {
            speedUpOnboardingVideos();
        }
        return () => {
            window.removeEventListener('resize', updateWidth);
        };
    });


    async function addPrimaryGame () {
        hamburgermenuopen = false;
        if (user.games.length < 80 || user.premiumsubscriber == 1) {
            let response = await fetch('/api/createGame', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userid: user.id, name: "New Category" }),
            });
            let responseJSON = await response.json();
            primaryGames = [responseJSON.newgame, ...primaryGames];
            user.games = [responseJSON.newgame, ...user.games];
            user.games = user.games;
            primaryGames = primaryGames;
        } else {
            showFreeLimitReachedModal();
        }  
    }

    async function addSubGame () {
        if (user.games.length < 80 || user.premiumsubscriber == 1) {
            let superparentgameid;
            if (currgame.superparentgameid) {
                superparentgameid = currgame.superparentgameid;
            } else if (currgame.parentgameid) {
                superparentgameid = currgame.parentgameid;
            } else {
                superparentgameid = currgame.id;
            }
            let response = await fetch('/api/createGame', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userid: user.id, parentgameid: currgame.id, parentgamesubgameslength: currgame.subgames.length, superparentgameidin: superparentgameid }),
            });
            let responseJSON = await response.json();
            user.games.push(responseJSON.newgame);
            currgame.subgames = getSubgamesOfGame(currgame);
            editingSubGameTitle = currgame.subgames[currgame.subgames.length - 1];
            currgame.subgames[currgame.subgames.length - 1].name = null;
            await tick();
            document.getElementById("subgamenameinput" + (currgame.subgames.length - 1)).focus();
        } else {
            showFreeLimitReachedModal();
        }
    }

    let freelimitreachedmodalshowing = false;
    function showFreeLimitReachedModal () {
        freelimitreachedmodalshowing = true;
    }

    function hideFreeLimitReachedModal () {
        freelimitreachedmodalshowing = false;
    }

    let ingame = false;
    let indrill = false;
    let currgame = null;
    async function goToGame (gameIn) {
        hamburgermenuopen = false;
        let updateLastAccessed = false;
        const gameInConst = gameIn;
        if (gameIn.parentgameid == null || gameIn.parentgameid == undefined) {
            updateLastAccessed = true;
        }
        gameIn.subgames = getSubgamesOfGame(gameIn);
        let superparentgameid;
        if (gameIn.superparentgameid) {
            superparentgameid = gameIn.superparentgameid;
        } else if (gameIn.parentgameid) {
            superparentgameid = gameIn.parentgameid;
        } else {
            superparentgameid = gameIn.id;
        }
        if (gameIn.subgames == null || gameIn.subgames.length == 0) {
            let response = await fetch('/api/createGame', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userid: user.id, parentgameid: gameIn.id, parentgamesubgameslength: 0, superparentgameidin: superparentgameid}),
            });
            let responseJSON = await response.json();
            user.games.push(responseJSON.newgame);
            user.games = user.games;
            gameIn.subgames = getSubgamesOfGame(gameIn);
        }
        currgame = gameIn;
        ingame = true;
        if (updateLastAccessed) {
            if (currgame.name == "New Category") {
                await tick();
                toggleEditingTitle();
                blur = true;
                await tick();
                document.getElementById("currgametitleinput").focus();
            }

            let newPrimaryGamesOrder = primaryGames.filter(obj => obj.id != gameInConst.id);
            primaryGames = [gameInConst, ...newPrimaryGamesOrder];
            await fetch('/api/updateGame', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ gameid: gameInConst.id, type: "lastaccessed", value: new Date() }),
            });
        }
    }

    async function goToDrill (gameIn) {
        indrill = true;
        currgame = gameIn;
        if (processStage == 0) {
            await tick();
            document.getElementById("drill-setup-textarea").disabled = true;
            document.getElementById("drill-execution-textarea").disabled = true;
        }
        if (!gameIn.isbasecase) {
            currgame.isbasecase = 1;
            await fetch('/api/updateGame', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ gameid: currgame.id, type: "isbasecase", value: 1 }),
            });
            let oldestdate = new Date(0);
            await fetch('/api/updateGame', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ gameid: currgame.id, type: "basecaselastcompleted", value: oldestdate }),
            });
        }
    }

    function closeGame () {
        editingHierarchyStage = 0;
        if (currgame.parentgameid != undefined && currgame.parentgameid != null) {
            currgame = user.games.find(obj => obj.id == currgame.parentgameid);
            currgame.subgames = getSubgamesOfGame(currgame);
        } else {
            currgame = null;
            ingame = false;
        }
    }

    async function closeDrill () {
        if (currgame.parentgameid != undefined && currgame.parentgameid != null) {
            if (indrilltypeselection) {
                deleteDrill(currgame);
                indrilltypeselection = false;
            } else {
                currgame = user.games.find(obj => obj.id == currgame.parentgameid);
                currgame.subgames = getSubgamesOfGame(currgame);
                indrill = false;
            } 
        } else {
            currgame = null;
            indrill = false;
        }
    }

    let editingTitle = false;
    async function toggleEditingTitle () {
        editingTitle = !editingTitle;
        if (currgame.name == "Category" || currgame.name == "New Category") {
            currgame.name = null;
        }
        await tick();
        document.getElementById("currgametitleinput").focus();
    }

    async function submitTitleChanges () {
        blur = false;
        if (currgame.name == null || currgame.name == undefined || currgame.name.trim() == ""){
            if (currgame.parentgameid == null || currgame.parentgameid == undefined) {
                currgame.name = "New Category";
            } else {
                currgame.name = "Category";
            }  
        }
        editingTitle = false;
        currgame.subgames.forEach(subgame => subgame.parentgame.name = currgame.name);
        let primaryGameInstance = primaryGames.find(obj => obj.id == currgame.id);
        if (primaryGameInstance != null && primaryGameInstance != undefined) {
            primaryGameInstance.name = currgame.name;
        }
        await fetch('/api/updateGame', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ gameid: currgame.id, type: "name", value: currgame.name }),
        });
    }

    let editingSubGameTitle = null;
    async function setEditingSubGameTitle (subgame, index) {
        if (subgame.name == "Category") {
            subgame.name = null;
        }
        editingSubGameTitle = subgame;
        await tick();
        document.getElementById("subgamenameinput" + index).focus();
    }

    async function submitSubGameTitleChanges () {
        if (editingSubGameTitle.name == null || editingSubGameTitle.name == undefined || editingSubGameTitle.name.trim() == ""){
            editingSubGameTitle.name = "Category";
        }
        const gameIn = editingSubGameTitle;
        editingSubGameTitle = null;
        await fetch('/api/updateGame', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ gameid: gameIn.id, type: "name", value: gameIn.name }),
        });
    }

    async function moveGameDown (index) {
        if (index !== currgame.subgames.length - 1) {
            //local
            let movingGame = currgame.subgames[index];
            currgame.subgames[index + 1].parentgamesubgamesindex = currgame.subgames[index + 1].parentgamesubgamesindex - 1;
            movingGame.parentgamesubgamesindex = movingGame.parentgamesubgamesindex + 1;
            currgame.subgames = getSubgamesOfGame(currgame);

            //db
            await fetch('/api/updateGame', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ gameid: movingGame.id, type: "parentgamesubgamesindex", value: index + 1}),
            });

            await fetch('/api/updateGame', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ gameid: currgame.subgames[index].id, type: "parentgamesubgamesindex", value: index}),
            });
        }
    }

    async function moveGameUp (index) {
        if (index !== 0) {
            //local
            let movingGame = currgame.subgames[index];
            currgame.subgames[index - 1].parentgamesubgamesindex = currgame.subgames[index - 1].parentgamesubgamesindex + 1;
            movingGame.parentgamesubgamesindex = movingGame.parentgamesubgamesindex - 1;
            currgame.subgames = getSubgamesOfGame(currgame);

            //db
            await fetch('/api/updateGame', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ gameid: movingGame.id, type: "parentgamesubgamesindex", value: index - 1}),
            });

            await fetch('/api/updateGame', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ gameid: currgame.subgames[index].id, type: "parentgamesubgamesindex", value: index}),
            });
        }
    }

    async function navigateToSubGame (subgameIn) {
        if (editingHierarchyStage == 0) {
            if (subgameIn.isbasecase == 1) {
                goToDrill(subgameIn);
            } else {
                goToGame(subgameIn);
            }
        } else if (editingHierarchyStage == 1) {
            selectedsubgame = subgameIn;
            editingHierarchyStage = 2;
        } else if (editingHierarchyStage == 2) {
            setAsNewParent(subgameIn);
        }
    }

    async function handleKeyDownDrill () {
        let timeoutId;
        clearTimeout(timeoutId);
        timeoutId = setTimeout(async () => {
            const newsetuptext = currgame.basecasedrillsetup;
            const newexecutiontext = currgame.basecasedrillexecution;
            await fetch('/api/updateGame', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ gameid: currgame.id, type: "basecasedrillsetup", value: newsetuptext}),
            });

            await fetch('/api/updateGame', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ gameid: currgame.id, type: "basecasedrillexecution", value: newexecutiontext}),
            });
        }, 500);
    }
    

    async function handleBottomButtonClick () {
        if (processStage == 0) {
            //mark drill as completed

            //get variables needed
            let spacedrepetitioncadence = [0, 1, 2, 4, 9, 21, 48, 106, 227, 475, 978, 1992];
            let lastcompleted = new Date();
            let next = new Date(lastcompleted);
            let nextcompletiondate;
            if (currgame.basecaserepetitions > 0) {
                next.setTime(lastcompleted.getTime() + (spacedrepetitioncadence[currgame.basecaserepetitions] * 1000 * 60 * 60 * 24));
                next.setHours(3);
                next.setMinutes(0);
                next.setSeconds(0);
                next.setMilliseconds(0);
                nextcompletiondate = next;
            } else {
                next.setHours(lastcompleted.getHours() + 5);
                nextcompletiondate = next;
            }
            let basecaserepetitions = currgame.basecaserepetitions + 1;

            //set local
            currgame.basecaselastcompleted = lastcompleted;
            currgame.basecasenextcompletiondate = nextcompletiondate;
            currgame.basecaserepetitions = basecaserepetitions;

            const storedcurrgame = currgame;
            ingame = false;
            currgame = false;
            drillsdue = drillsdue.filter(obj => obj.id != storedcurrgame.id);
            if (drillsdue.length == 0) {
                processStage = 1;
            }
            indrill = false;
            //set db
            await fetch('/api/updateGame', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ gameid: storedcurrgame.id, type: "basecaselastcompleted", value: storedcurrgame.basecaselastcompleted}),
            });
            await fetch('/api/updateGame', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ gameid: storedcurrgame.id, type: "basecasenextcompletiondate", value: storedcurrgame.basecasenextcompletiondate}),
            });
            await fetch('/api/updateGame', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ gameid: storedcurrgame.id, type: "basecaserepetitions", value: storedcurrgame.basecaserepetitions}),
            });
        } else {
            //local
            if (currgame.basecasedrillactivated == 1) {
                currgame.basecasedrillactivated = 0;
                user.games.find(obj => obj.id == currgame.id).basecasedrillactivated = 0;
            } else {
                currgame.basecasedrillactivated = 1;
                user.games.find(obj => obj.id == currgame.id).basecasedrillactivated = 1;
                let today = new Date();
                let yesterday = new Date(today);
                yesterday.setDate(today.getDate() - 1);
                currgame.basecasenextcompletiondate = yesterday;
                if (processStage == 1) {
                    user.todaynewfinitegamebehaviorcount = user.todaynewfinitegamebehaviorcount + 1;
                }
            }
            currgame = currgame;
            //db
            await fetch('/api/updateGame', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ gameid: currgame.id, type: "basecasedrillactivated", value: currgame.basecasedrillactivated}),
            });

            await fetch('/api/updateGame', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ gameid: currgame.id, type: "basecasenextcompletiondate", value: currgame.basecasenextcompletiondate}),
            });

            await fetch('/api/updateUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userid: user.id, type: "todaynewfinitegamebehaviorcount", value: user.todaynewfinitegamebehaviorcount}),
            });

            if (user.todaynewfinitegamebehaviorcount == 3) {
                let response = await fetch('/api/getDrillsDue', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userid: user.id }),
                });
                let responseJSON = await response.json();
                drillsdue = responseJSON.drillsdue;
                if (drillsdue && drillsdue.length > 0) {
                    processStage = 0;
                } else {
                    processStage = 3;
                }
            }
            ingame = false;
            indrill = false;
        }
    }

    async function deleteGame (subgameIn) {
        //local
        const storecurrgame = currgame;
        let clear = false;
        if (currgame.subgames.length == 1) {
            clear = true;
            closeGame();
        }
        user.games = user.games.filter(obj => !(obj.id == subgameIn.id || obj.parentgameid == subgameIn.id));
        if (clear) {
            user.games.find(obj => obj.id == storecurrgame.id).subgames = null;
        } else {
            currgame.subgames = currgame.subgames.filter(obj => !(obj.id == subgameIn.id || obj.parentgameid == subgameIn.id));
        }
        recursivelyDeleteGames(subgameIn);

        //db
        await fetch('/api/deleteGame', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ gameid: subgameIn.id }),
        });
    }

    async function deletePrimaryGame (primaryGameIn) {
        hamburgermenuopen = false;
        user.games = user.games.filter(obj => obj.id != primaryGameIn.id);
        recursivelyDeleteGames(primaryGameIn);
        primaryGames = primaryGames.filter(obj => obj.id != primaryGameIn.id);
        await fetch('/api/deleteGame', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ gameid: primaryGameIn.id }),
        });
    }

    async function recursivelyDeleteGames(node) {
        const gamesToDelete = user.games.filter(obj => obj.parentgameid == node.id);
        for (const child of gamesToDelete) {
            await recursivelyDeleteGames(child);
        }
        user.games = user.games.filter(game => !gamesToDelete.some(deleteGame => deleteGame.id == game.id));
    }

    function truncateString(primaryGameName, maxCharacterNum) {
        if (primaryGameName.length > maxCharacterNum) {
            return primaryGameName.substring(0, maxCharacterNum - 3) + '...';
        } else {
            return primaryGameName;
        }
    }

    let todaysdrillstooltipopen = false;
    let todaysdrillstooltipmodal;
    function toggletodaysdrillstooltipopen () {
        todaysdrillstooltipopen = !todaysdrillstooltipopen;
    }

    async function goToStripe () {
        hamburgermenuopen = false;
        if (user.premiumsubscriber) {
            let response = await fetch('/api/paymentUtils/createBillingPortalSession', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', 
                },
                body: JSON.stringify({ userid: user.id }),
            });
            let responseJSON = await response.json();
            goto(responseJSON.url);
        } else {
            let response = await fetch('/api/paymentUtils/createCheckout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', 
                },
                body: JSON.stringify({ userid: user.id }),
            });
            let responseJSON = await response.json();
            goto(responseJSON.url);
        }
    }

    let deactivatetext = "Deactivate All";
    let deactivatetext2 = "Drills";
    async function deactivateAll () {
        //local
        drillsdue = drillsdue.filter(obj => obj.superparentgameid != currgame.id);
        let deactivateddrills = user.games.filter(obj => obj.superparentgameid == currgame.id && obj.basecasedrillactivated == 1);
        deactivateddrills.forEach(drill => drill.basecasedrillactivated = 0);

        //db
        const deactivatedDrillIds = deactivateddrills.map(drill => drill.id);
        await fetch('/api/updateGames', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ gameids: deactivatedDrillIds, type: "basecasedrillactivated", value: 0}),
        });
        deactivatetext = "Done";
        deactivatetext2 = "";
        setTimeout(async () => {
            deactivatetext = "Deactivate All";
            deactivatetext2 = "Drills";
        }, 1000);
    }

    let drillsetuptooltipopen = false;
    let drillsetuptooltipmodal;
    function toggledrillsetuptooltipopen () {
        drillsetuptooltipopen = !drillsetuptooltipopen;
    }

    let drillexecutiontooltipopen = false;
    let drillexecutiontooltipmodal;
    function toggledrillexecutiontooltipopen () {
        drillexecutiontooltipopen = !drillexecutiontooltipopen;
    }

    let editingHierarchyStage = 0;
    function edithierarchyclicked () {
        if (editingHierarchyStage == 0) {
            editingHierarchyStage = 1;
        } else {
            editingHierarchyStage = 0;
            selectedsubgame = null;
        }
    }
    let selectedsubgame = null;
    async function setAsNewParent (gameIn) {
        if (gameIn == null) {
            selectedsubgame.parentgameid = currgame.parentgameid;
            currgame.subgames = getSubgamesOfGame(currgame);
            await fetch('/api/updateGame', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ gameid: selectedsubgame.id, type: "parentgameid", value: currgame.parentgameid }),
            });
        } else {
            selectedsubgame.parentgameid = gameIn.id;
            currgame.subgames = getSubgamesOfGame(currgame);
            gameIn.subgames = getSubgamesOfGame(gameIn);
            await fetch('/api/updateGame', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ gameid: selectedsubgame.id, type: "parentgameid", value: gameIn.id }),
            });
        }
        selectedsubgame = null;
        editingHierarchyStage = 0;
    }

    function skipDrills () {
        processStage = 1;
    }

    async function advanceOnboarding () {
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        if (user.onboardingstage < 6) {
            user.onboardingstage = user.onboardingstage + 1;
            if (user.onboardingstage == 6) {
                speedUpOnboardingVideos();
            }
            //db
            await fetch('/api/updateUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userid: user.id, type: "onboardingstage", value: user.onboardingstage}),
            });
        } else {
            user.onboardingcomplete = 1;
            //db
            await fetch('/api/updateUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userid: user.id, type: "onboardingcomplete", value: 1}),
            });
        }
    }

    async function speedUpOnboardingVideos () {
        await tick();
        document.getElementById("videoexample1").playbackRate = 2.5;
        document.getElementById("videoexample2").playbackRate = 3;
        document.getElementById("videoexample3").playbackRate = 2.5;
        document.getElementById("videoexample4").playbackRate = 2.5;
        document.getElementById("videoexample5").playbackRate = 2.5;
    }

    let blur = false;

    async function deleteDrill (subgame) {
        subgame.isbasecase = 0;
        subgame.basecasedrillexecution = null;
        subgame.basecasedrillsetup = null;
        subgame.basecaserepetitions = 0;
        subgame.basecasenextcompletiondate = null;
        subgame.basecaselastcompleted = null;
        subgame.basecasetype = 0;
        ingame = 1;
        indrill = 0;
        let newcurrgame = subgame.parentgame;
        newcurrgame.subgames = getSubgamesOfGame(newcurrgame);
        currgame = newcurrgame;
        //db
        await fetch('/api/updateGame', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ gameid: subgame.id, type: "isbasecase", value: 0 }),
        });
        await fetch('/api/updateGame', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ gameid: subgame.id, type: "basecasedrillexecution", value: null }),
        });
        await fetch('/api/updateGame', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ gameid: subgame.id, type: "basecasedrillsetup", value: null }),
        });
        await fetch('/api/updateGame', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ gameid: subgame.id, type: "basecaserepetitions", value: 0 }),
        });
        await fetch('/api/updateGame', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ gameid: subgame.id, type: "basecasenextcompletiondate", value: null }),
        });
        await fetch('/api/updateGame', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ gameid: subgame.id, type: "basecaselastcompleted", value: null }),
        });
        await fetch('/api/updateGame', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ gameid: subgame.id, type: "basecasetype", value: 0 }),
        });  
    }

    async function handleFlagClick (subgame) {
        if (subgame.isbasecase == 0) {
            //go to choosing screen
            indrilltypeselection = true;
            //temp goToDrill (remove upon adding base case choosing screen)
            goToDrill(subgame);
        } else {
            goToDrill(subgame);
        }
    }

    let indrilltypeselection = false;

    async function setBaseCaseType (typeIn) {
        currgame.basecasetype = typeIn;
        indrilltypeselection = false;
        await fetch('/api/updateGame', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ gameid: currgame.id, type: "basecasetype", value: typeIn }),
        });  
    }

    let hamburgermenuopen = false;
    async function toggleMainHamburgerMenu () {
        hamburgermenuopen = !hamburgermenuopen;
        if (hamburgermenuopen) {
            await tick();
            const scrollY = window.scrollY;
            let hamburgermenubutton = document.getElementById("hamburger-menu-button").getBoundingClientRect();
            let hamburgermenu = document.getElementById("hamburger-menu");
            hamburgermenu.style.top = `${hamburgermenubutton.bottom + scrollY}px`;
            hamburgermenu.style.right = `${viewportWidth - hamburgermenubutton.right}px`;
        }
    }

    function redoOnboarding () {
        hamburgermenuopen = false;
        user.onboardingstage = 1;
        user.onboardingcomplete = 0;
        //don't think I want to update the db to match for right now
    }
</script>


<title>Endevyr</title>
<meta name="description" content="Endevyr app">
{#if blur}
    <div style="position: fixed; top: 0px; left: 0; width: 100%; height: 100%; background-color: #00000099; z-index: 3;"></div>
{/if}
{#if freelimitreachedmodalshowing}
    <div class="tooltip-modal" bind:this={freelimitreachedmodalshowing}>
        <div class="navigationSection">
            <button on:click={hideFreeLimitReachedModal}>
                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="10" viewBox="0 0 11 10" fill="none">
                    <line x1="1.70711" y1="1.29289" x2="9.70711" y2="9.29289" stroke="black" stroke-width="2"/>
                    <line y1="-1" x2="11.3137" y2="-1" transform="matrix(-0.707107 0.707107 0.707107 0.707107 10 2)" stroke="black" stroke-width="2"/>
                </svg>
            </button>
        </div>
        <p class="tooltip-modal-content" style="font-size: 16px; margin-bottom: 15px;">You've reached the categories-added limit<br><br>Delete some to make space or upgrade to the standard version to remove the limit</p>
        <div style="width: 100%; display: flex; justify-content: center;">
            <button style="color: white; font-size: 16px; margin-bottom: 10px; margin-top: 0px; background-color: #3C80E5; letter-spacing: -0.01em; border-radius: 5px; padding: 5px; width: 100px;" on:click={goToStripe}>View Plan</button>
        </div>
    </div>
{/if}
{#if user.onboardingcomplete == 0}
    <div style="width: 100%; display: flex; justify-content: center;">
        <div style="display: flex; flex-direction: column; width: 100%; max-width: 600px; box-sizing: border-box; padding: 15px; {user.onboardingstage < 2 ? 'align-items: center; justify-content: center;' : 'align-items: flex-start;'};">
            {#if user.onboardingstage == 1}
                <h1 style="text-align: center; position: absolute; left: 50%; top: 40%; transform: translate(-50%, -40%); width: 90%;">Reach goals 10x faster with Endevyr</h1>
            {:else if user.onboardingstage == 2}
                <h1 style="margin-bottom: 15px; margin-top: 15px;">Problem-Solving</h1>
                <p class="onboarding-text" style="margin-bottom: 60px;">Our brain solves problems by breaking them into smaller and smaller parts until we figure out what to do next</p>
                <h1 style="margin-bottom: 30px;">Example</h1>
                <div style="width: 100%; display: flex; justify-content: center;">
                    <div style="border-style: solid; border-width: 4px; border-color: black; width: 100%; max-width: 400px;">
                        <Onboardinggraphic1 />
                    </div>
                </div>
            {:else if user.onboardingstage == 3}
                <h1 style="margin-bottom: 15px; margin-top: 15px;">The Memory Problem</h1>
                <p class="onboarding-text" style="margin-bottom: 60px;">However, complex goals have many parts.<br><br>This makes us spend most of our brain power on remembering the pieces and only a tiny fraction on finding a solution.</p>
                <!-- <h1 style="margin-bottom: 30px;">Simple Problem</h1>
                <div style="width: 100%; display: flex; justify-content: center;">
                    <div style="border-style: solid; border-width: 4px; border-color: black; width: 100%; max-width: 400px;">
                        <Onboardinggraphic2 />
                    </div>
                </div> -->
                <!-- <div style="width: 100%; display: flex; justify-content: center;">
                    <h1 style="text-align: center; margin-top: 30px; margin-bottom: 30px;">VS</h1>
                </div> -->
                <!-- <h1 style="margin-bottom: 30px; margin-top: 30px;">Complex Problem</h1>
                <div style="width: 100%; display: flex; justify-content: center;">
                    <div style="border-style: solid; border-width: 4px; border-color: black; width: 100%; max-width: 400px;">
                        <Onboardinggraphic3 />
                    </div>
                </div> -->
                <h1 style="margin-bottom: 30px;">Symptoms:</h1>
                <ul class="onboarding-list">
                    <li class="onboarding-bullet">Feeling lost/overwhelmed</li>
                    <li class="onboarding-bullet">Not pursuing interests because they feel like too much effort</li>
                    <li class="onboarding-bullet">Don’t feel like you’re “crushing it” in everything you work on</li>
                </ul>
            {:else if user.onboardingstage == 4}
                <h1 style="margin-bottom: 15px; margin-top: 15px;">How Endevyr helps</h1>
                <p class="onboarding-text" style="margin-bottom: 60px;">It stores the goal’s pieces for you, which frees up brain power to focus on finding a solution rather than remembering details.</p>
                <!-- <h1 style="margin-bottom: 30px;">From:</h1>
                <div style="width: 100%; display: flex; justify-content: center;">
                    <div style="border-style: solid; border-width: 4px; border-color: black; width: 100%; max-width: 400px;">
                        <Onboardinggraphic3 />
                    </div>
                </div>
                <h1 style="margin-bottom: 30px; margin-top: 30px;">To:</h1>
                <div style="width: 100%; display: flex; justify-content: center;">
                    <div style="border-style: solid; border-width: 4px; border-color: black; width: 100%; max-width: 400px;">
                        <Onboardinggraphic4 />
                    </div>
                </div> -->
                <h1 style="margin-bottom: 30px;">The difference:</h1>
                <ul class="onboarding-list">
                    <li class="onboarding-bullet">Always know exactly what to do</li>
                    <li class="onboarding-bullet">Be able to do well in any area you’re interested in without a huge commitment</li>
                    <li class="onboarding-bullet">Feel like a genius as your brain comes up with clever solutions on autopilot</li>
                </ul>
            {:else if user.onboardingstage == 5}
                <h1 style="margin-bottom: 15px; margin-top: 15px;">When to use Endevyr</h1>
                <ul class="onboarding-list">
                    <li class="onboarding-bullet">Whenever a task feels hard</li>
                    <li class="onboarding-bullet">When starting something new (skill, project, assignment, etc.)</li>
                    <li class="onboarding-bullet">When wanting to improve an existing area of life (a skill, health, wealth, relationships)</li>
                </ul>
            {:else if user.onboardingstage == 6}
                <h1 style="margin-bottom: 15px; margin-top: 15px;">How it works</h1>
                <p class="onboarding-text" style="margin-bottom: 30px;">Add a new “game” (skill, task, project, area of life, etc.)</p>
                <div style="width: 100%; display: flex; justify-content: center;">
                    <div style="border-style: solid; border-width: 4px; border-color: black; width: 100%; max-width: 400px; margin-bottom: 60px;">
                        <video id="videoexample1" src="/EndevyrOnboardingWeightLossExampleAddGameCropped.mp4" width="100%" height="100%" controls muted playsinline>
                    </div>
                </div>
                <p class="onboarding-text" style="margin-bottom: 30px;">Break the game down into the smaller “games” that make it up by asking "what would prevent this game from being completed?"</p>
                <div style="width: 100%; display: flex; justify-content: center;">
                    <div style="border-style: solid; border-width: 4px; border-color: black; width: 100%; max-width: 400px; margin-bottom: 60px;">
                        <video id="videoexample2" src="/EndevyrOnboardingWeightLossExampleBreakGameDownCropped.mp4" width="100%" height="100%" controls muted playsinline></video>
                    </div>
                </div>
                <p class="onboarding-text" style="margin-bottom: 30px;">Upon reaching a “game” that is more like an action/habit than a game, stop. If it is a new habit, select the flag, otherwise complete the action and move on to the next</p>
                <div style="width: 100%; display: flex; justify-content: center;">
                    <div style="border-style: solid; border-width: 4px; border-color: black; width: 100%; max-width: 400px; margin-bottom: 60px;">
                        <video id="videoexample3" src="/EndevyrOnboardingWeightLossExampleClickFlagCropped.mp4" width="100%" height="100%" controls muted playsinline></video>
                    </div>
                </div>
                <p class="onboarding-text" style="margin-bottom: 30px;">Record habits' situation and desired new action</p>
                <div style="width: 100%; display: flex; justify-content: center;">
                    <div style="border-style: solid; border-width: 4px; border-color: black; width: 100%; max-width: 400px; margin-bottom: 60px;">
                        <video id="videoexample4" src="/EndevyrOnboardingWeightLossExampleAddingDrillCropped.mp4" width="100%" height="100%" controls muted playsinline></video>
                    </div>
                </div>
                <p class="onboarding-text" style="margin-bottom: 30px;">Be reminded of new habits shortly before forgetting</p>
                <div style="width: 100%; display: flex; justify-content: center;">
                    <div style="border-style: solid; border-width: 4px; border-color: black; width: 100%; max-width: 400px; margin-bottom: 60px;">
                        <video id="videoexample5" src="/EndevyrOnboardingWeightLossExampleCompleteDrillCropped.mp4" width="100%" height="100%" controls muted playsinline></video>
                    </div>
                </div>
            {/if}
            <div style="width: 100%; display: flex; justify-content: center;">
                <button on:click={advanceOnboarding} class="page-button" style="{user.onboardingstage != 2 && user.onboardingstage != 6 ? 'position: absolute; left: 50%; top: 80%; transform: translate(-50%, -80%);' : ''} color: white; background-color: black; margin-top: 60px; margin-bottom: 15px; font-size: 20px; height: 40px; letter-spacing: -0.01em; max-width: 570px;">Continue</button>
            </div>
            
        </div>
    </div>
{:else}
    <div style="display: flex; flex-direction: column; {ingame || indrill ? 'margin-left: 15px; margin-right: 0px; margin-bottom: 15px; margin-top: 0;' : 'margin: 15px;'} align-items: flex-start;">
        {#if indrill}
            {#if !(indrilltypeselection && viewportWidth >= 430)}
                <div style="display: flex; width: 100%; max-width: 603px; justify-content: flex-end; margin-top: 5px;">
                    <button style="margin-right: 5px;" on:click={closeDrill}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="10" viewBox="0 0 11 11" fill="none">
                            <line y1="-1" x2="11.5486" y2="-1" transform="matrix(0.692722 0.721204 -0.692722 0.721204 1 2)" stroke="black" stroke-width="2"/>
                            <line y1="-1" x2="11.5486" y2="-1" transform="matrix(-0.692722 0.721204 0.692722 0.721204 10 2)" stroke="black" stroke-width="2"/>
                        </svg>
                    </button>
                </div>
            {/if}
            {#if indrilltypeselection}
                <div style="position: absolute; left: 50%; top: 40%; transform: translate(-50%, -40%); display: flex; flex-direction: column; align-items: center; width: 100%;">
                    <h1 style="text-align: center;">What type of solution?</h1>
                    <button class="page-button" style="color: white; background-color: black; margin-top: 30px;" on:click={() => {setBaseCaseType(0)}}>New Habit</button>
                    <button class="page-button" style="color: white; background-color: black; margin-top: 30px;" on:click={() => {setBaseCaseType(1)}}>Action, Task, or Answer</button>
                </div>
            {:else}
                <div style="display: flex; flex-direction: column; margin-right: 15px; width: -webkit-fill-available; align-items: flex-start;">
                    <h1>{currgame.name}</h1>
                    {#if currgame.basecasetype == 0}
                        <div style="display: flex; justify-content: space-between; {viewportWidth < 430 ? 'width: 100%; max-width: 100%;' : 'width: 90%; max-width: 600px;'} margin-top: 20px;">
                            <h2 class="drill-input-title" style="margin-top: 0;">Drill set up</h2>
                            {#if processStage != 0}
                                <button style="margin-left: 5px;" on:click={toggledrillsetuptooltipopen}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <circle cx="12" cy="12" r="10"/>
                                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                                        <path d="M12 17h.01"/>
                                    </svg>
                                </button>
                                {#if drillsetuptooltipopen && indrill}
                                    <div class="tooltip-modal" bind:this={drillsetuptooltipmodal}>
                                        <div class="navigationSection">
                                            <button on:click={toggledrillsetuptooltipopen}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="10" viewBox="0 0 11 10" fill="none">
                                                    <line x1="1.70711" y1="1.29289" x2="9.70711" y2="9.29289" stroke="black" stroke-width="2"/>
                                                    <line y1="-1" x2="11.3137" y2="-1" transform="matrix(-0.707107 0.707107 0.707107 0.707107 10 2)" stroke="black" stroke-width="2"/>
                                                </svg>
                                            </button>
                                        </div>
                                        <p class="tooltip-modal-content">How to get in the situation where the new behavior should be completed<br><br>(able to get into it at any time)</p>
                                    </div>
                                {/if}
                            {/if}
                        </div>
                        <textarea id="drill-setup-textarea" style="{viewportWidth < 430 ? 'width: 100%; max-width: 100%;' : ''}" class="input" type="text" spellcheck="false" autocomplete="off" placeholder="How to set up drill" bind:value={currgame.basecasedrillsetup} on:keydown={handleKeyDownDrill} />
                    {/if}
                    <div style="display: flex; justify-content: space-between; {viewportWidth < 430 ? 'width: 100%; max-width: 100%;' : 'width: 90%; max-width: 600px;'} margin-top: 20px;">
                        <h2 class="drill-input-title" style="margin-top: 0;">Drill execution</h2>
                        {#if processStage != 0}
                            <button style="margin-left: 5px;" on:click={toggledrillexecutiontooltipopen}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <circle cx="12" cy="12" r="10"/>
                                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                                    <path d="M12 17h.01"/>
                                </svg>
                            </button>
                            {#if drillexecutiontooltipopen && indrill}
                                <div class="tooltip-modal" bind:this={drillexecutiontooltipmodal}>
                                    <div class="navigationSection">
                                        <button on:click={toggledrillexecutiontooltipopen}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="10" viewBox="0 0 11 10" fill="none">
                                                <line x1="1.70711" y1="1.29289" x2="9.70711" y2="9.29289" stroke="black" stroke-width="2"/>
                                                <line y1="-1" x2="11.3137" y2="-1" transform="matrix(-0.707107 0.707107 0.707107 0.707107 10 2)" stroke="black" stroke-width="2"/>
                                            </svg>
                                        </button>
                                    </div>
                                    <p class="tooltip-modal-content">The new action to take in the situation</p>
                                </div>
                            {/if}
                        {/if}
                    </div>
                    <textarea id="drill-execution-textarea" style="{viewportWidth < 430 ? 'width: 100%; max-width: 100%;' : ''}" class="input" type="text" spellcheck="false" autocomplete="off" placeholder="How to execute drill" bind:value={currgame.basecasedrillexecution} on:keydown={handleKeyDownDrill} />
                    {#if currgame.basecasetype == 0}
                        {#if currgame.basecasedrillexecution != null && currgame.basecasedrillexecution.trim() != '' && currgame.basecasedrillsetup != null && currgame.basecasedrillsetup.trim() != ''}
                            <button class="page-button" style="{(currgame.basecasedrillactivated && processStage == 0) || (!currgame.basecasedrillactivated && processStage == 1) ? 'color: #FFF; background-color: #000;' : 'color: #000; background-color: #FFF;'} {viewportWidth < 430 ? 'width: 100%; max-width: 100%;' : ''}" on:click={handleBottomButtonClick}>{#if processStage == 0}Completed{:else if !currgame.basecasedrillactivated}Activate{:else}Turn Off{/if}</button>
                        {:else}
                            <button disabled class="page-button" style="{!currgame.basecasedrillactivated ? 'color: #0000004D; border-color: #0000004D;' : 'color: #FFFFFF4D; border-color: #0000004D; background: #0000004D; background-clip: padding-box;'} {viewportWidth < 430 ? 'width: 100%; max-width: 100%;' : ''}">Activate</button>
                        {/if}
                    {/if}
                    {#if processStage == 1}
                        <button on:click={() => {deleteDrill(currgame);}} style="color: red; font-family: 'Inter'; font-size: 16px; letter-spacing: -0.01em; font-weight: 600; margin-top: 120px; padding: 10px;">Revert to Category</button>
                    {/if}
                </div>
            {/if}
        {:else if ingame}
            <div style="display: flex; width: 100%; max-width: 433px; justify-content: flex-end; margin-top: 5px;">
                <button style="margin-right: 5px;" on:click={closeGame}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="10" viewBox="0 0 11 11" fill="none">
                        <line y1="-1" x2="11.5486" y2="-1" transform="matrix(0.692722 0.721204 -0.692722 0.721204 1 2)" stroke="black" stroke-width="2"/>
                        <line y1="-1" x2="11.5486" y2="-1" transform="matrix(-0.692722 0.721204 0.692722 0.721204 10 2)" stroke="black" stroke-width="2"/>
                    </svg>
                </button>
            </div>
            <div style="display: flex; flex-direction: column; margin-right: 15px; width: 1fr; align-items: flex-start;">
            <div style="display: flex; width: 100%; max-width: 433px;">
                {#if !editingTitle}
                        <button disabled={editingHierarchyStage == 0} on:click={() => {setAsNewParent(null);}} style="{editingHierarchyStage == 0 ? 'cursor: text;' : ''} max-width: {viewportWidth < 478 ? '90%' : '430px'};">
                            <h1 style="margin: 0;">{currgame.name}</h1>
                        </button>
                        {#if editingHierarchyStage == 0}
                            <button style="margin-left: 15px;" on:click={toggleEditingTitle}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="38" viewBox="0 0 20 20" fill="none">
                                        <line x1="4.58579" y1="15.0985" x2="14.0989" y2="5.58533" stroke="#D9D9D9" stroke-width="4"/>
                                        <rect x="14" y="2.82812" width="4" height="4" transform="rotate(-45 14 2.82812)" fill="#D9D9D9"/>
                                        <path d="M1.41391 18.243L2.31049 14.8969L4.75998 17.3464L1.41391 18.243Z" fill="#D9D9D9"/>
                                    </svg>
                            </button>
                        {/if}
                {:else}
                    <div style="display: flex; background-color: white; z-index: 5; border-radius: 5px; {blur ? 'padding: 5px;' : ''}">
                        <input style="z-index: 5;" id="currgametitleinput" spellcheck="false" autocomplete="off" class="title-input" type="text" placeholder="Insert category title" bind:value={currgame.name}>
                        <button style="margin-left: 15px; z-index: 5;" on:click={submitTitleChanges}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M20 6 9 17l-5-5"/>
                            </svg>
                        </button>
                    </div>
                {/if}
            </div>
            <div style="width: 100%; display: flex; justify-content: space-between; margin-top: 15px; max-width: 430px;">
                <p style="font-size: 16px; font-family: 'Inter'; font-weight: 600; letter-spacing: -0.01em; max-width: 60%;">Top-level reasons the above wouldn't be true:</p>
                <button style="color: #3C80E5; font-size: 16px; font-family: 'Inter'; font-weight: 600; letter-spacing: -0.01em;" on:click={edithierarchyclicked}>{#if editingHierarchyStage == 0}Edit Hierarchy{:else if editingHierarchyStage == 1}Select Subgame to Move{:else if editingHierarchyStage == 2}Select New Parent Game (title moves it up a level){/if}</button>    
            </div>
            {#each currgame.subgames as subgame, index}
                {#if editingHierarchyStage != 2 || subgame.isbasecase == 0}
                    <div style="display: flex; margin-top: 15px;">
                        {#if editingSubGameTitle != null && editingSubGameTitle.id == subgame.id}
                            <input id="subgamenameinput{index}" spellcheck="false" autocomplete="off" class="title-input" type="text" placeholder="Insert game title" bind:value={subgame.name}>
                            <button style="padding-left: 15px;" on:click={submitSubGameTitleChanges}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M20 6 9 17l-5-5"/>
                                </svg>
                            </button>  
                        {:else}
                            <div style="{viewportWidth < 430 ? 'width: ' + (viewportWidth - 265) +'px; max-width: ' + (viewportWidth - 265) + 'px;' : 'width: 200px; max-width: 200px;'} display: flex; align-items: center;">
                                <button style="font-weight: 700; font-size: 16px; color: black; text-align: left; letter-spacing: -0.01em;" on:click={() => {navigateToSubGame(subgame)}}>{subgame.name}</button>
                            </div>
                            {#if editingHierarchyStage == 0}
                                <button style="margin-left: 15px;" on:click={() => {setEditingSubGameTitle(subgame, index)}}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="38" viewBox="0 0 20 20" fill="none">
                                        <line x1="4.58579" y1="15.0985" x2="14.0989" y2="5.58533" stroke="#D9D9D9" stroke-width="4"/>
                                        <rect x="14" y="2.82812" width="4" height="4" transform="rotate(-45 14 2.82812)" fill="#D9D9D9"/>
                                        <path d="M1.41391 18.243L2.31049 14.8969L4.75998 17.3464L1.41391 18.243Z" fill="#D9D9D9"/>
                                    </svg>
                                </button>
                                {#if subgame.subgames == null || subgame.subgames.length == 0}
                                    <button style="margin-left: 15px;" on:click={() => {handleFlagClick(subgame);}}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="{subgame.isbasecase == 1 && subgame.basecasedrillactivated == 0 ? 'red' : subgame.isbasecase == 1 && subgame.basecasedrillactivated == 1 ? '#53E720' : 'black'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="m12 8 6-3-6-3v10"/>
                                            <path d="m8 11.99-5.5 3.14a1 1 0 0 0 0 1.74l8.5 4.86a2 2 0 0 0 2 0l8.5-4.86a1 1 0 0 0 0-1.74L16 12"/>
                                            <path d="m6.49 12.85 11.02 6.3"/>
                                            <path d="M17.51 12.85 6.5 19.15"/>
                                        </svg>
                                    </button>
                                {:else}
                                    <div style="width: 26px; height: 41px; margin-left: 15px;"></div>
                                {/if}
                                {#if subgame.isbasecase == 0}
                                    <button style="margin-left: 15px;" on:click={() => {goToGame(subgame)}}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26" fill="none">
                                            <circle cx="13" cy="13" r="12" fill="black" stroke="black" stroke-width="2"/>
                                            <rect x="12.6973" y="5.44141" width="1.2093" height="15.7209" fill="white"/>
                                            <rect x="5.44141" y="13.9072" width="1.2093" height="15.7209" transform="rotate(-90 5.44141 13.9072)" fill="white"/>
                                        </svg>
                                    </button>
                                {:else}
                                    <div style="width: 26px; height: 41px; margin-left: 15px;"></div>
                                {/if}
                                <button style="margin-left: 15px;" on:click={() => {deleteGame(subgame)}}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M3 6h18"/>
                                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                                        <line x1="10" x2="10" y1="11" y2="17"/>
                                        <line x1="14" x2="14" y1="11" y2="17"/>
                                    </svg>
                                </button>
                                <button style="margin-left: 15px;" on:click={() => {moveGameDown(index)}}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="m6 9 6 6 6-6"/>
                                    </svg>
                                </button>
                                <button style="margin-left: 15px;" on:click={() => {moveGameUp(index)}}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="m18 15-6-6-6 6"/>
                                    </svg>
                                </button>
                            {/if}
                        {/if}
                    </div>
                {/if}
            {/each}
            {#if editingHierarchyStage == 0}
                <button style="margin-top: 30px;" on:click={addSubGame}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26" fill="none">
                        <circle cx="13" cy="13" r="12" fill="black" stroke="black" stroke-width="2"/>
                        <rect x="12.6973" y="5.44141" width="1.2093" height="15.7209" fill="white"/>
                        <rect x="5.44141" y="13.9072" width="1.2093" height="15.7209" transform="rotate(-90 5.44141 13.9072)" fill="white"/>
                    </svg>
                </button>
                <button disabled={deactivatetext == "Done"} style="margin-top: 120px; color: red; padding: 10px; font-size: 16px; font-weight: 600; letter-spacing: -0.01em;" on:click={deactivateAll}>{deactivatetext}{#if deactivatetext != "Done"}&nbsp;{#if currgame.name != undefined && currgame.name != null}{"\"" + currgame.name + "\""}{:else}""{/if}&nbsp;{/if}{deactivatetext2}</button>
            {/if}
        </div>
        {:else}
            {#if processStage == 0}
                <div style="display: flex; justify-content: space-between; width: 100%; max-width: 360px;">
                    <h1>Today's Drills</h1>
                    <button on:click={toggletodaysdrillstooltipopen}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                            <path d="M12 17h.01"/>
                        </svg>
                    </button>
                    {#if todaysdrillstooltipopen && !indrill && !ingame}
                        <div class="tooltip-modal" bind:this={todaysdrillstooltipmodal}>
                            <div class="navigationSection">
                                <button on:click={toggletodaysdrillstooltipopen}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="11" height="10" viewBox="0 0 11 10" fill="none">
                                        <line x1="1.70711" y1="1.29289" x2="9.70711" y2="9.29289" stroke="black" stroke-width="2"/>
                                        <line y1="-1" x2="11.3137" y2="-1" transform="matrix(-0.707107 0.707107 0.707107 0.707107 10 2)" stroke="black" stroke-width="2"/>
                                    </svg>
                                </button>
                            </div>
                            <p class="tooltip-modal-content">Complete the following drills to ensure they remain in long term memory<br><br>(time between a drill's repetitions<br>increases exponentially)</p>
                        </div>
                    {/if}
                </div>
                
                {#each drillsdue as drill}
                    <button style="{viewportWidth < 430 ? 'width: 100%; max-width: 100%;' : 'width: 360px; max-width: 360px;'} border-radius: 5px; border-color: black; border-width: 2px; border-style: solid; padding: 15px; margin-top: 30px; color: black;" on:click={() => {goToDrill(drill)}}>
                        <h2>{truncateString(drill.name, 22)}</h2>
                        <p class="super-parent-text">{drill.superparentgame.name}</p>
                    </button>
                {/each}
                <div style="display: flex; justify-content: center; margin-top: 60px; {viewportWidth < 430 ? 'width: 100%; max-width: 100%;' : 'width: 360px; max-width: 360px;'}">
                    <button style="padding: 15px; color: red; text-align: center;" on:click={skipDrills}>
                        <h2>Skip drills for now</h2>
                    </button>
                </div>
                
            {:else if processStage == 1}
                <div style="display: flex; width: 100%; ">
                    <h1 style="{viewportWidth < 430 ? 'width: 80%; max-width: 80%;' : 'width: 360px; max-width: 360px; box-sizing: border-box;'}">Categories<!--({3 - user.todaynewfinitegamebehaviorcount})--></h1>
                    <div style="width: {viewportWidth < 430 ? '4' : '20'}px;"></div>
                    <button id="hamburger-menu-button" style="{viewportWidth < 430 ? 'width: 20%; max-width: 20%;' : ''} box-sizing: border-box;" on:click={toggleMainHamburgerMenu}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="4" x2="20" y1="12" y2="12"/>
                            <line x1="4" x2="20" y1="6" y2="6"/>
                            <line x1="4" x2="20" y1="18" y2="18"/>
                        </svg>
                    </button>
                    {#if hamburgermenuopen}
                        <div class="modal" id="hamburger-menu">
                            <button on:click={redoOnboarding}>
                                <div class="modal-element">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                                        <path d="M3 3v5h5"/>
                                    </svg>
                                    <p class="modal-text">Redo Onboarding</p>
                                </div>
                            </button>
                            <button on:click={goToStripe}>
                                <div class="modal-element">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        {#if user.premiumsubscriber == 1}
                                            <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"/>
                                            <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/>
                                            <path d="M12 2v2"/>
                                            <path d="M12 22v-2"/>
                                            <path d="m17 20.66-1-1.73"/>
                                            <path d="M11 10.27 7 3.34"/>
                                            <path d="m20.66 17-1.73-1"/>
                                            <path d="m3.34 7 1.73 1"/>
                                            <path d="M14 12h8"/>
                                            <path d="M2 12h2"/>
                                            <path d="m20.66 7-1.73 1"/>
                                            <path d="m3.34 17 1.73-1"/>
                                            <path d="m17 3.34-1 1.73"/>
                                            <path d="m11 13.73-4 6.93"/>
                                        {:else}
                                            <path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"/>
                                            <path d="M5 21h14"/>
                                        {/if}
                                    </svg>
                                    <p class="modal-text">{#if user.premiumsubscriber == 1}Manage Plan{:else}View Standard Plan{/if}</p>
                                </div>
                            </button>
                        </div>
                    {/if}
                </div>
                <div style="display: flex; width: 100%; margin-top: 30px;">
                    <div style="{viewportWidth < 430 ? 'width: 80%; max-width: 80%;' : 'width: 360px; max-width: 360px; box-sizing: border-box;'}">
                        <button on:click={addPrimaryGame}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26" fill="none">
                                <circle cx="13" cy="13" r="12" fill="black" stroke="black" stroke-width="2"/>
                                <rect x="12.6973" y="5.44141" width="1.2093" height="15.7209" fill="white"/>
                                <rect x="5.44141" y="13.9072" width="1.2093" height="15.7209" transform="rotate(-90 5.44141 13.9072)" fill="white"/>
                            </svg>
                        </button>
                    </div>
                </div>
                {#each primaryGames as primaryGame}
                    <div style="display: flex; width: 100%; max-width: 100%; margin-top: 30px;">
                        <button style="{viewportWidth < 430 ? 'width: 80%; max-width: 80%;' : 'width: 360px; max-width: 360px;'} overflow-wrap: break-word; border-radius: 5px; box-sizing: border-box; border-color: black; border-width: 2px; border-style: solid; padding: 15px; color: black;" on:click={() => {goToGame(primaryGame)}}>
                            <h2>{truncateString(primaryGame.name, 20)}</h2>
                        </button>
                        <div style="width: {viewportWidth < 430 ? '15' : '20'}px;"></div>
                        <button style="{viewportWidth < 430 ? 'width: 20%; max-width: 20%;' : ''} box-sizing: border-box;" on:click={() => {deletePrimaryGame(primaryGame)}}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M3 6h18"/>
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                                <line x1="10" x2="10" y1="11" y2="17"/>
                                <line x1="14" x2="14" y1="11" y2="17"/>
                            </svg>
                        </button>
                    </div>
                {/each}
            {/if}
        {/if}
    </div>
{/if}