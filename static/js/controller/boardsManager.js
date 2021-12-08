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
      renameBoard(board.id, board.title)

  }
    newBoardButtonHandler()
  },

};

function newBoardButtonHandler() {
    domManager.addEventListener(".create-board-button", "click", getNewBoardName)
}

function showHideButtonHandler(clickEvent) {
  const boardId = clickEvent.target.dataset.boardId;
  cardsManager.loadCards(boardId);
}

function renameBoard(boardId, boardTitle){
  domManager.addEventListener(`.board[data-board-id="${boardId}"] span`, "click", function(e){boardTitleToInputToTitleHandler(e, `${boardTitle}`, `${boardId}` )})

}

function boardTitleToInputToTitleHandler(clickEvent, boardTitle, boardId) {
  const inputField = `<input type="text" id="new-board-name" name="new-board-name" value="${boardTitle}">`
  const boardTitleSpan = clickEvent.target
  var newDiv = document.createElement('span');
  newDiv.innerHTML = inputField
  newDiv.className = "board-title"
  boardTitleSpan.parentNode.replaceChild(newDiv, boardTitleSpan);

  document.querySelector('#new-board-name').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      console.log(e)
      const newBoardName = document.querySelector("#new-board-name").value
      dataHandler.renameBoard(`${boardId}`, newBoardName)
      e.target.parentNode.removeChild(e.target)
      domManager.addChild(`.board[data-board-id="${boardId}"] .board-title`, `${newBoardName}`)

    }
});
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
