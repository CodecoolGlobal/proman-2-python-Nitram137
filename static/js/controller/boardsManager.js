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
  },
};

function showHideButtonHandler(clickEvent) {
  const boardId = clickEvent.target.dataset.boardId;
  cardsManager.loadCards(boardId);
}



function boardTitleToInputHandler(clickEvent, boardTitle, boardId) {
  const inputField = `  <input type="text" id="new-board-name" name="new-board-name" value="${boardTitle}"><input type="submit" id="rename-btn" value="Rename">`
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

async function rename(boardId) {
  newBoardName = await dataHandler.renameBoard(`${boardId}`, document.querySelector('#new-board-name').value)
}