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
  }
};
