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
    const newStatus = await dataHandler.createNewStatus(statusTitle, boardId);
    const statusBuilder = htmlFactory(htmlTemplates.status);
    const statusHTML = statusBuilder(newStatus[0]);
    domManager.addChild(`.board[data-board-id="${boardId}"]`, statusHTML);
    domManager.addEventListener(
      `.add-card[data-status-id="${newStatus[0].id}"]`,
      "click", () => {
      addCardToStatus(boardId, newStatus[0].id)})
  }
}

async function addCardToStatus(boardId, statusId) {
  const inputText = document.querySelector(`.new-card-name[data-status-id="${statusId}"]`);
  const cardTitle = inputText.value;
  if (cardTitle !== '') {
    const newCard = await dataHandler.createNewCard(cardTitle, boardId, statusId);
    const cardBuilder = htmlFactory(htmlTemplates.card);
    const cardHTML = cardBuilder(newCard[0]);
    domManager.addChild(`.status[data-status-id="${statusId}"]`, cardHTML);
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
                domManager.addChild("#root", content);
          });
        };
      loadLastBoard();
    })
  }


function renameBoard(boardId) {
    domManager.addEventListener(`#heading-${boardId} h5`, "click", function (e)
    {if (!document.querySelector("#new-board-name")){
        boardTitleToInputToTitleHandler(e, `${boardId}`)
        }
    })
}

async function boardTitleToInputToTitleHandler(clickEvent, boardId) {
    let oldBoardTitle = clickEvent.target.innerText
    const inputField = `<input type="text" id="new-board-name" name="new-board-name" value="${oldBoardTitle}">`
    const boardTitleText = clickEvent.target
    const newDiv = document.createElement('h5');
    newDiv.innerHTML = inputField
    boardTitleText.parentNode.replaceChild(newDiv, boardTitleText);

    document.querySelector('#new-board-name').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            const newBoardName = document.querySelector("#new-board-name").value
            dataHandler.renameBoard(`${boardId}`, newBoardName)
            e.target.parentNode.removeChild(e.target)
            domManager.addChild(`#heading-${boardId} h5`, `${newBoardName}`)
            renameBoard(`${boardId}`)
        }else if (window.onclick){
            e.target.parentNode.removeChild(e.target)
            domManager.addChild(`#heading-${boardId} h5`, `${oldBoardTitle}`)
            renameBoard(`${boardId}`)

        }
    })
}