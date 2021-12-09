import { dataHandler } from "../data/dataHandler.js";
import { htmlFactory, htmlTemplates } from "../view/htmlFactory.js";
import { domManager } from "../view/domManager.js";
import {cardsManager} from "./cardsManager.js";

export let statusesManager = {
  loadStatuses: async function (boardId) {
    const statuses = await dataHandler.getStatuses(boardId);
    for (let status of statuses) {
      const statusBuilder = htmlFactory(htmlTemplates.status);
      const content = statusBuilder(status);
      domManager.addChild(`.board[data-board-id="${boardId}"]`, content);
      domManager.addEventListener(
        `.status[data-status-id="${status.id}"]`,
        "click",
      );
    }
  },

  addStatusToBoard: async function(boardId, statusTitle) {
    const newStatus = await dataHandler.createNewStatus(statusTitle, boardId);
    const statusBuilder = htmlFactory(htmlTemplates.status);
    const statusHTML = statusBuilder(newStatus[0]);
    domManager.addChild(`.board[data-board-id="${boardId}"]`, statusHTML);
    domManager.addEventListener(
      `.add-card[data-status-id="${newStatus[0].id}"]`,
      "click", () => {
      cardsManager.addCardToStatus(boardId, newStatus[0].id)})
  }
};