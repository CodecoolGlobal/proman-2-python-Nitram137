import { dataHandler } from "../data/dataHandler.js";
import { htmlFactory, htmlTemplates } from "../view/htmlFactory.js";
import { domManager } from "../view/domManager.js";
import { cardsManager } from "./cardsManager.js";
import { statusesManager } from "./statusesManager.js";

let userIdInSession = document.querySelector("#username") ? document.querySelector("#username").dataset.userId : '0';

export let boardsManager = {
    loadBoards: async function () {
        const buttonBuilder = htmlFactory(htmlTemplates.button);
        const newPublicBoardButton = buttonBuilder("public", "create-public-board-button", '+ New Public Board');
        domManager.addChild("#root", newPublicBoardButton);
        if (userIdInSession !== '0'){
            const newPrivateBoardButton = buttonBuilder("private", "create-private-board-button", '+ New Private Board');
            domManager.addChild("#root", newPrivateBoardButton);
        }

        const boards = await dataHandler.getBoards(userIdInSession);

        for (let board of boards) {
            LoadBoard(board).then();
        }
        inputButton();

        const boardsDOM = document.querySelectorAll(".board");
        for (let board of boardsDOM) {
            if (board.dataset.userId != 'null'){
                board.querySelector(".board-header").classList.add("private");
            }
        }
    }
};

async function LoadBoard(board) {
    const boardBuilder = htmlFactory(htmlTemplates.board);
    const content = boardBuilder(board);
    domManager.addChild("#root", content);
    renameBoard(board.id);
    deleteBoard(board.id);
    addStatusToBoard(board.id)
    const statuses = await dataHandler.getStatuses(board.id);
    const cards = await dataHandler.getCardsByBoardId(board.id);
    for (let status of statuses) {
        await statusesManager.loadStatusToBoard(board.id, status);
        for (let card of cards) {
            if (card.status_id === status.id) {
                await cardsManager.loadCardToStatus(board.id, status.id, card)
            }
        }
    }
}

function renameBoard(boardId) {
    domManager.addEventListener(`#heading-${boardId} h5`, "click",  (e) => {
        if (!document.querySelector("#new-name-input")){
            domManager.titleToInputHandler(e, boardId, dataHandler.renameBoard);
        }
    })
}

function deleteBoard(boardId) {
    domManager.addEventListener(
        `.delete-board[data-board-id="${boardId}"]`,
        "click", () => {
            dataHandler.deleteBoard(boardId).then();
            let deletedBoard = document.querySelector(`.board[data-board-id="${boardId}"]`);
            deletedBoard.remove();
        });
}

function addStatusToBoard(boardId) {
    domManager.addEventListener(
        `.add-status[data-board-id="${boardId}"]`,
        "click", ()=>{
            const inputText = document.querySelector(`.new-status-name[data-board-id="${boardId}"]`);
            const statusTitle = inputText.value;
            if (statusTitle !== '') {
                statusesManager.addStatusToBoard(boardId, statusTitle).then();
            }
        });
}


async function addDefaultStatusToBoard(boardId) {
    const statusTitles = ["new", "in progress", "testing", "done"];
    for (let i = 0; i < statusTitles.length; i++){
        await statusesManager.addStatusToBoard(boardId, statusTitles[i])
    }
}

function inputButton(){
    domManager.addEventListener('#create-public-board-button', 'click', () => {getNewBoardName('public')});
    if (userIdInSession !== '0'){
        domManager.addEventListener('#create-private-board-button', 'click', () => {getNewBoardName('private')});
    }
}

async function getNewBoardName(publicOrPrivate) {
    const buttonContainer = document.querySelector(`#${publicOrPrivate}-button-container`);
    const submitButton = document.createElement("button");
    submitButton.setAttribute("type", "button");
    submitButton.setAttribute("id", `${publicOrPrivate}-save-button`);
    submitButton.textContent = "Save";
    const boardNameInput = document.createElement("input");
    boardNameInput.setAttribute("id", `${publicOrPrivate}-board-name-input`);
    boardNameInput.setAttribute("name", `${publicOrPrivate}-board-name-input`);
    buttonContainer.appendChild(boardNameInput);
    buttonContainer.appendChild(submitButton);
    submitButton.addEventListener("click", async () => {
        let lastBoard;
        if (submitButton.getAttribute("id") === "public-save-button"){
            lastBoard = await dataHandler.createNewBoard(boardNameInput.value, null);
        }else if (submitButton.getAttribute("id") === "private-save-button"){
            lastBoard = await dataHandler.createNewBoard(boardNameInput.value, userIdInSession);
        }
        await LoadBoard(lastBoard);
        await addDefaultStatusToBoard(lastBoard.id);

        buttonContainer.removeChild(boardNameInput);
        buttonContainer.removeChild(submitButton);
    })
  }
