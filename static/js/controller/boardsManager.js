import { dataHandler } from "../data/dataHandler.js";
import { htmlFactory, htmlTemplates } from "../view/htmlFactory.js";
import { domManager } from "../view/domManager.js";
import { cardsManager } from "./cardsManager.js";
import { statusesManager } from "./statusesManager.js";

export let boardsManager = {
    loadBoards: async function () {
        const buttonBuilder = htmlFactory(htmlTemplates.button);
        const content = buttonBuilder("create-board-button");
        domManager.addChild("#root", content);

        const boards = await dataHandler.getBoards();

        for (let board of boards) {
            LoadBoard(board).then();
        }
        inputButton();
    }
};

async function DeleteBoard(boardId) {
    document.querySelector('#root').innerHTML = '';
    await dataHandler.deleteBoard(boardId);
    await boardsManager.loadBoards();
}


async function LoadBoard(board) {
    const boardBuilder = htmlFactory(htmlTemplates.board);
    const content = boardBuilder(board);
    domManager.addChild("#root", content);
    renameBoard(board.id, board.title);
    console.log(document.querySelector(`.delete-board[data-board-id="${board.id}"]`));
    domManager.addEventListener(
        `.delete-board[data-board-id="${board.id}"]`,
        "click", () => {
        DeleteBoard(board.id)});
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
    domManager.addEventListener(
        `.add-status[data-board-id="${board.id}"]`,
        "click", ()=>{
        addStatusToBoard(board.id)});
}

async function addStatusToBoard(boardId) {
  const inputText = document.querySelector(`.new-status-name[data-board-id="${boardId}"]`);
  const statusTitle = inputText.value;
  if (statusTitle !== '') {
    await statusesManager.addStatusToBoard(boardId, statusTitle)
  }
}


async function addDefaultStatusToBoard(boardId) {
    const statusTitles = ["new", "in progress", "testing", "done"];
    for (let i = 0; i < statusTitles.length; i++){
        await statusesManager.addStatusToBoard(boardId, statusTitles[i])
    }
}

function inputButton(){
    domManager.addEventListener('.create-board-button', 'click', getNewBoardName)
}

async function getNewBoardName() {
    const buttonContainer = document.querySelector(".button-container");
    const submitButton = document.createElement("button");
    submitButton.setAttribute("type", "button");
    submitButton.textContent = "Save";
    const boardBuilder = htmlFactory(htmlTemplates.board);
    const boardNameInput = document.createElement("input");
    boardNameInput.setAttribute("id", "board-name-input");
    boardNameInput.setAttribute("name", "board-name-input");
    buttonContainer.appendChild(boardNameInput);
    buttonContainer.appendChild(submitButton);
    submitButton.addEventListener("click", async () => {
        await dataHandler.createNewBoard(boardNameInput.value);
        const boards = await dataHandler.getBoards();
        const lastBoard = boards[boards.length - 1];
        await LoadBoard(lastBoard);
        await addDefaultStatusToBoard(lastBoard.id);

        buttonContainer.removeChild(boardNameInput);
        buttonContainer.removeChild(submitButton);
    })
  }

function renameBoard(boardId, boardTitle) {
    domManager.addEventListener(`#heading-${boardId} h5`, "click",  (e) => {
        if (!document.querySelector("#new-board-name")){
            boardTitleToInputToTitleHandler(e, boardId, boardTitle);
        }
    })
}

function boardTitleToInputToTitleHandler(clickEvent, boardId, boardTitle ) {
    const boardTitleText = document.querySelector(`#heading-${boardId} h5`);
    const saveBtn = document.querySelector(`#save-board-btn-${boardId}`);
    boardTitleText.innerHTML = `<input type="text" id="new-board-name" name="new-board-name" value="${boardTitle}">`;
    saveBtn.style.display = "flex";

    saveBtn.addEventListener("click", () => {
        boardTitle = document.querySelector("#new-board-name").value;
        dataHandler.renameBoard(boardId, boardTitle);
        boardTitleText.innerHTML = `${boardTitle}`;
        saveBtn.style.display = "none";
        renameBoard(boardId, boardTitle);
    });
}
