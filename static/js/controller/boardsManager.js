import { dataHandler } from "../data/dataHandler.js";
import { htmlFactory, htmlTemplates } from "../view/htmlFactory.js";
import { domManager } from "../view/domManager.js";
import { cardsManager } from "./cardsManager.js";

export let boardsManager = {
  loadBoards: async function () {
    const boards = await dataHandler.getBoards();
    for (let board of boards) {
      const boardBuilder = htmlFactory(htmlTemplates.board);
      const content = boardBuilder(board);
      domManager.addChild("#root", content);
      domManager.addEventListener(
        `.toggle-board-button[data-board-id="${board.id}"]`,
        "click",
        showHideButtonHandler
      );
      domManager.addEventListener(`.board[data-board-id="${board.id}"] span`, "click", function(e){boardTitleToInputHandler(e, `${board.title}`, `${board.id}` )})

  }
    newBoardButtonHandler()
  },
};

function newBoardButtonHandler() {
    domManager.addEventListener(".create-board-button", "click", boardNameInput)
}

function showHideButtonHandler(clickEvent) {
  const boardId = clickEvent.target.dataset.boardId;
  cardsManager.loadCards(boardId);
}

function boardNameInput() {
function boardTitleToInputHandler(clickEvent, boardTitle) {
  const inputField = `  <input type="text" id="new-board-name" name="new-board-name" value="${boardTitle}"><button id="rename-btn">Rename</button>`
  const boardTitleSpan = clickEvent.target

  var form = document.createElement('form');
  form.innerHTML = inputField
  form.className = "board-title"
  boardTitleSpan.parentNode.replaceChild(form, boardTitleSpan);
  document.querySelector('#new-board-name').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      console.log("test")
    }
});
   /*dataHandler.renameBoard(`${boardId}`,document.querySelector("#new-board-name").value)*/
}

}

function getNewBoardName() {
  const buttonContainer = document.querySelector(".button-container");
  const submitButton = document.createElement("button");
  submitButton.setAttribute("type", "button");
  submitButton.textContent = "Save";
  const boardNameInput = document.createElement("input");
  boardNameInput.setAttribute("id", "board-name-input");
  boardNameInput.setAttribute("name", "board-name-input");
  buttonContainer.appendChild(boardNameInput);
  buttonContainer.appendChild(submitButton);
  submitButton.addEventListener("click", () => {
    console.log(boardNameInput.value)
    dataHandler.createNewBoard(boardNameInput.value)
  })
}
