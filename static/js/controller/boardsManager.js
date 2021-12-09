import { dataHandler } from "../data/dataHandler.js";
import { htmlFactory, htmlTemplates } from "../view/htmlFactory.js";
import { domManager } from "../view/domManager.js";
import { cardsManager } from "./cardsManager.js";
import { statusesManager } from "./statusesManager.js";

export let boardsManager = {
  loadBoards: async function () {
    const boards = await dataHandler.getBoards();
    const boardBuilder = htmlFactory(htmlTemplates.board);
    const statusBuilder = htmlFactory(htmlTemplates.status);
    const cardBuilder = htmlFactory(htmlTemplates.card);

    for (let board of boards) {
      const content = boardBuilder(board);
      domManager.addChild("#root", content);
      renameBoard(board.id, board.title);
      const statuses = await dataHandler.getStatuses(board.id);
      const cards = await dataHandler.getCardsByBoardId(board.id);
      for (let status of statuses) {
        const boardContent = statusBuilder(status);
        domManager.addChild(`.board[data-board-id="${board.id}"]`, boardContent);
        for (let card of cards) {
          if (card.status_id === status.id) {
            const statusContent = cardBuilder(card);
            domManager.addChild(`.status[data-status-id="${status.id}"]`, statusContent);
          }
        }
        domManager.addEventListener(
            `.add-card[data-status-id="${status.id}"]`,
            "click", () => {
            addCardToStatus(board.id, status.id)
          }
        )
      }
      domManager.addEventListener(
          `.add-status[data-board-id="${board.id}"]`,
          "click", ()=>{
          addStatusToBoard(board.id)});
    }
    inputButton();
  }
};

async function addStatusToBoard(boardId) {
  const inputText = document.querySelector(`.new-status-name[data-board-id="${boardId}"]`);
  const statusTitle = inputText.value;
  if (statusTitle !== '') {
    await statusesManager.addStatusToBoard(boardId, statusTitle)
  }
}


async function addDefaultStatusToBoard(boardId) {
    const statusTitles = ["new", "in progress", "testing", "done"];
    const statusBuilder = htmlFactory(htmlTemplates.status);
    for (let i = 0; i < statusTitles.length; i++){
        const newStatus = await dataHandler.createNewStatus(statusTitles[i], boardId);
        const statusHTML = statusBuilder(newStatus[0]);
        domManager.addChild(`.board[data-board-id="${boardId}"]`, statusHTML);
        domManager.addEventListener(
      `.add-card[data-status-id="${newStatus[0].id}"]`,
      "click", () => {
      addCardToStatus(boardId, newStatus.id)})
    }
}

async function addCardToStatus(boardId, statusId) {
  const inputText = document.querySelector(`.new-card-name[data-status-id="${statusId}"]`);
  const cardTitle = inputText.value;
  if (cardTitle !== '') {
    await cardsManager.addCardToStatus(boardId, statusId, cardTitle);
  }
}

function inputButton(){
    domManager.addEventListener('.create-board-button', 'click', getNewBoardName)
}

function getNewBoardName() {
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
    submitButton.addEventListener("click", () => {
      dataHandler.createNewBoard(boardNameInput.value)
        buttonContainer.removeChild(boardNameInput)
        buttonContainer.removeChild(submitButton)
        const loadLastBoard = () => {
          fetch("/api/boards", {
              method: "GET",
          }).then((response) => {
              return response.json();
            }).then((board) => {
                const content = boardBuilder(board[board.length - 1]);
                addDefaultStatusToBoard(board[board.length - 1].id)
                domManager.addChild("#root", content);
          });
        };
      loadLastBoard();
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
    })
}
