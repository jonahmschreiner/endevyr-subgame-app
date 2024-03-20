<style>
    button {
        background: none;
        padding: 0;
        border: none;
        cursor: pointer;
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
        font-size: 15px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
        padding-left: 10px;
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
        height: 72px;
        flex-shrink: 0;
        border-radius: 5px;
        border: 2px solid #000;
        margin-top: 20px;
        color: #000;
        font-family: 'Inter';
        font-size: 16px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
        padding-left: 10px;
        padding-top: 10px;
        max-width: 960px;
        resize: none;
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
        font-size: 15px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
        max-width: 960px;
        cursor: pointer;
    }
</style>

<script>
    import { tick } from "svelte";
    export let data;
    let { user, drillsdue } = data;

    let processStage = 0;
    if (drillsdue == null || drillsdue == undefined || drillsdue.length == 0) {
        processStage = 1;
        if (user.todaynewfinitegamebehaviorcount == 3) {
            processStage = 2;
        }
    }

    let primaryGames = user.games.filter(obj => obj.parentgameid == null);

    function getSubgamesOfGame (gameIn) {
        return user.games.filter(obj => obj.parentgameid == gameIn.id).sort((a, b) => a.parentgamesubgamesindex - b.parentgamesubgamesindex);
    }


    async function addPrimaryGame () {
        let response = await fetch('/api/createGame', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userid: user.id }),
        });
        let responseJSON = await response.json();
        primaryGames.push(responseJSON.newgame);
        user.games.push(responseJSON.newgame);
        user.games = user.games;
        primaryGames = primaryGames;
    }

    async function addSubGame () {
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
    }

    let ingame = false;
    let indrill = false;
    let currgame = null;
    async function goToGame (gameIn) {
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
        if (currgame.parentgame) {
            currgame = currgame.parentgame;
            currgame.subgames = getSubgamesOfGame(currgame);
        } else {
            currgame = null;
            ingame = false;
        }
    }

    function closeDrill () {
        if (currgame.parentgame) {
            currgame = currgame.parentgame;
            currgame.subgames = getSubgamesOfGame(currgame);
            indrill = false;
        } else {
            currgame = null;
            indrill = false;
        }
    }

    let editingTitle = false;
    function toggleEditingTitle () {
        editingTitle = !editingTitle;
    }

    async function submitTitleChanges () {
        editingTitle = false;
        await fetch('/api/updateGame', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ gameid: currgame.id, type: "name", value: currgame.name }),
        });
    }

    let editingSubGameTitle = null;
    function setEditingSubGameTitle (subgame) {
        editingSubGameTitle = subgame;
    }

    async function submitSubGameTitleChanges () {
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

    function navigateToSubGame (subgameIn) {
        if (subgameIn.isbasecase == 1) {
            goToDrill(subgameIn);
        } else {
            goToGame(subgameIn);
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
            let nextcompletiondate;
            if (currgame.basecaserepetitions > 0) {
                nextcompletiondate = lastcompleted + spacedrepetitioncadence[currgame.basecaserepetitions];
            } else {
                nextcompletiondate = new Date().setHours(lastcompleted.getHours() + 5);
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
                if (user.todaynewfinitegamebehaviorcount == 3){
                    processStage = 2;
                } else {
                    processStage = 1;
                }
            }
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
                processStage = 0;
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
        user.games = user.games.filter(obj => !(obj.id == subgameIn.id || obj.parent));
        if (clear) {
            user.games.find(obj => obj.id == storecurrgame.id).subgames = null;
        }
        

        //db
        await fetch('/api/deleteGame', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ gameid: subgameIn.id }),
        });
    }
</script>


<title>Endevyr</title>
<meta name="description" content="Endevyr app">
<div style="display: flex; flex-direction: column; {ingame ? 'margin-left: 15px; margin-right: 15px; margin-bottom: 15px; margin-top: 0;' : 'margin: 15px;'} align-items: flex-start;">
    {#if indrill}
        <div style="display: flex; width: 100%; justify-content: flex-end; margin-right: -10px;">
            <button on:click={closeDrill}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="10" viewBox="0 0 11 11" fill="none">
                    <line y1="-1" x2="11.5486" y2="-1" transform="matrix(0.692722 0.721204 -0.692722 0.721204 1 2)" stroke="black" stroke-width="2"/>
                    <line y1="-1" x2="11.5486" y2="-1" transform="matrix(-0.692722 0.721204 0.692722 0.721204 10 2)" stroke="black" stroke-width="2"/>
                </svg>
            </button>
        </div>
        <h1>{currgame.name}</h1>
        <h2>Drill set up</h2>
        <textarea id="drill-setup-textarea" class="input" type="text" spellcheck="false" autocomplete="off" placeholder="How to set up drill" bind:value={currgame.basecasedrillsetup} on:keydown={handleKeyDownDrill} />
        <h2>Drill execution</h2>
        <textarea id="drill-execution-textarea" class="input" type="text" spellcheck="false" autocomplete="off" placeholder="How to execute drill" bind:value={currgame.basecasedrillexecution} on:keydown={handleKeyDownDrill} />
        {#if currgame.basecasedrillexecution != null && currgame.basecasedrillexecution.trim() != '' && currgame.basecasedrillsetup != null && currgame.basecasedrillsetup.trim() != ''}
            <button class="page-button" style="{!currgame.basecasedrillactivated ? 'color: #FFF; background-color: #000' : 'color: #000; background-color: #FFF'}" on:click={handleBottomButtonClick}>{#if processStage == 0}Completed{:else if !currgame.basecasedrillactivated}Activate{:else}Turn Off{/if}</button>
        {:else}
            <button disabled class="page-button" style="{!currgame.basecasedrillactivated ? 'color: #0000004D; border-color: #0000004D;' : 'color: #FFFFFF4D; border-color: #0000004D; background: #0000004D; background-clip: padding-box;'}">Activate</button>
        {/if}
    {:else if ingame}
        <div style="display: flex; width: 100%; justify-content: flex-end; margin-right: -10px;">
            <button on:click={closeGame}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="10" viewBox="0 0 11 11" fill="none">
                    <line y1="-1" x2="11.5486" y2="-1" transform="matrix(0.692722 0.721204 -0.692722 0.721204 1 2)" stroke="black" stroke-width="2"/>
                    <line y1="-1" x2="11.5486" y2="-1" transform="matrix(-0.692722 0.721204 0.692722 0.721204 10 2)" stroke="black" stroke-width="2"/>
                </svg>
            </button>
        </div>
        <div style="display: flex;">
            {#if !editingTitle}
                <h1 style="margin: 0;">{currgame.name}</h1>
                <button style="margin-left: 15px;" on:click={toggleEditingTitle}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="38" viewBox="0 0 20 20" fill="none">
                            <line x1="4.58579" y1="15.0985" x2="14.0989" y2="5.58533" stroke="#D9D9D9" stroke-width="4"/>
                            <rect x="14" y="2.82812" width="4" height="4" transform="rotate(-45 14 2.82812)" fill="#D9D9D9"/>
                            <path d="M1.41391 18.243L2.31049 14.8969L4.75998 17.3464L1.41391 18.243Z" fill="#D9D9D9"/>
                        </svg>
                </button>
            {:else}
                <input spellcheck="false" autocomplete="off" class="title-input" type="text" placeholder="Insert game title" bind:value={currgame.name}>
                <button style="margin-left: 15px;" on:click={submitTitleChanges}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20 6 9 17l-5-5"/>
                    </svg>
                </button>
            {/if}
        </div>
        {#each currgame.subgames as subgame, index}
            <div style="display: flex; justify-content: space-between;">
                <div style="display: flex;">
                    {#if editingSubGameTitle != null && editingSubGameTitle.id == subgame.id}
                        <input spellcheck="false" autocomplete="off" class="title-input" type="text" placeholder="Insert game title" bind:value={subgame.name}>
                        <button style="padding-left: 15px;" on:click={submitSubGameTitleChanges}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M20 6 9 17l-5-5"/>
                            </svg>
                        </button>  
                    {:else}
                        <button on:click={() => {navigateToSubGame(subgame)}}>{subgame.name}</button>
                        <button style="margin-left: 15px;" on:click={() => {setEditingSubGameTitle(subgame)}}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="38" viewBox="0 0 20 20" fill="none">
                                <line x1="4.58579" y1="15.0985" x2="14.0989" y2="5.58533" stroke="#D9D9D9" stroke-width="4"/>
                                <rect x="14" y="2.82812" width="4" height="4" transform="rotate(-45 14 2.82812)" fill="#D9D9D9"/>
                                <path d="M1.41391 18.243L2.31049 14.8969L4.75998 17.3464L1.41391 18.243Z" fill="#D9D9D9"/>
                            </svg>
                        </button>
                        {#if subgame.subgames == null || subgame.subgames.length == 0}
                            <button style="margin-left: 15px;" on:click={() => {goToDrill(subgame);}}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="{subgame.isbasecase == 1 && subgame.basecasedrillactivated == 0 ? 'red' : subgame.isbasecase == 1 && subgame.basecasedrillactivated == 1 ? '#53E720' : 'black'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="m12 8 6-3-6-3v10"/>
                                    <path d="m8 11.99-5.5 3.14a1 1 0 0 0 0 1.74l8.5 4.86a2 2 0 0 0 2 0l8.5-4.86a1 1 0 0 0 0-1.74L16 12"/>
                                    <path d="m6.49 12.85 11.02 6.3"/>
                                    <path d="M17.51 12.85 6.5 19.15"/>
                                </svg>
                            </button>
                        {/if}
                        {#if subgame.isbasecase == 0}
                            <button style="margin-left: 15px;" on:click={() => {goToGame(subgame)}}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26" fill="none">
                                    <circle cx="13" cy="13" r="12" fill="black" stroke="black" stroke-width="2"/>
                                    <rect x="12.6973" y="5.44141" width="1.2093" height="15.7209" fill="white"/>
                                    <rect x="5.44141" y="13.9072" width="1.2093" height="15.7209" transform="rotate(-90 5.44141 13.9072)" fill="white"/>
                                </svg>
                            </button>
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
                    {/if}
                </div>
                <div style="display: flex;">
                    <button on:click={() => {moveGameDown(index)}}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="m6 9 6 6 6-6"/>
                        </svg>
                    </button>
                    <button style="margin-left: 15px;" on:click={() => {moveGameUp(index)}}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="m18 15-6-6-6 6"/>
                        </svg>
                    </button>
                </div>
            </div>
        {/each}
        <button on:click={addSubGame}>
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26" fill="none">
                <circle cx="13" cy="13" r="12" fill="black" stroke="black" stroke-width="2"/>
                <rect x="12.6973" y="5.44141" width="1.2093" height="15.7209" fill="white"/>
                <rect x="5.44141" y="13.9072" width="1.2093" height="15.7209" transform="rotate(-90 5.44141 13.9072)" fill="white"/>
            </svg>
        </button>
    {:else}
        {#if processStage == 0}
            <h1>Today's Drills</h1>
            {#each drillsdue as drill}
                <button>
                    <h2>{drill.name}</h2>
                    <p>{drill.superparentgame.name}</p>
                </button>
            {/each}
        {:else if processStage == 1}
            <h1>Add Drills ({3 - user.todaynewfinitegamebehaviorcount})</h1>
            {#each primaryGames as primaryGame}
                <button on:click={() => {goToGame(primaryGame)}}>
                    <h2>{primaryGame.name}</h2>
                </button>
            {/each}

            <button on:click={addPrimaryGame}>
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26" fill="none">
                    <circle cx="13" cy="13" r="12" fill="black" stroke="black" stroke-width="2"/>
                    <rect x="12.6973" y="5.44141" width="1.2093" height="15.7209" fill="white"/>
                    <rect x="5.44141" y="13.9072" width="1.2093" height="15.7209" transform="rotate(-90 5.44141 13.9072)" fill="white"/>
                </svg>
            </button>
        {:else if processStage == 2}
            <h1>Finished for the day</h1>
        {/if}
    {/if}
</div>
