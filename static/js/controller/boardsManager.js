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
      }
    }
    inputButton();
  }
};

function inputButton(){
    domManager.addEventListener('.create-board-button', 'click', getNewBoardName)
}
function boardTitleToInputHandler(clickEvent, boardTitle) {
  const inputField = `  <input type="text" id="new-board-name" name="new-board-name" value="${boardTitle}"><input type="submit" value="Rename">`
  const boardTitleSpan = clickEvent.target

  let form = document.createElement('form');
  form.innerHTML = inputField
  form.className = "board-title"
  boardTitleSpan.parentNode.replaceChild(form, boardTitleSpan);
  document.querySelector('#new-board-name').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      dataHandler.renameBoard(`${boardId}`, document.querySelector("#new-board-name").value)
    }
});
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
