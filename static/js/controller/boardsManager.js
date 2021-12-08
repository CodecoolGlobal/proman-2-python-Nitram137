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

    for (let board of boards) {
      const content = boardBuilder(board);
      const statuses = await dataHandler.getStatuses(board.id);
      domManager.addChild("#root", content);
      for (let status of statuses) {
        const boardContent = statusBuilder(status);
        domManager.addChild(`.board[data-board-id="${board.id}"]`, boardContent)
      }
      domManager.addEventListener(
        `.toggle-board-button[data-board-id="${board.id}"]`,
        "click",
        showHideButtonHandler
      );
    }
  }
};

function showHideButtonHandler(clickEvent) {
  const boardId = clickEvent.target.dataset.boardId;
  statusesManager.loadStatuses(boardId)
  cardsManager.loadCards(boardId);
}
