import { dataHandler } from "../data/dataHandler.js";
import { htmlFactory, htmlTemplates } from "../view/htmlFactory.js";
import { domManager } from "../view/domManager.js";
import {cardsManager} from "./cardsManager.js";

export let statusesManager = {
  addStatusToBoard: async function(boardId, statusTitle) {
    const newStatus = await dataHandler.createNewStatus(statusTitle, boardId);
    const statusBuilder = htmlFactory(htmlTemplates.status);
    const statusHTML = statusBuilder(newStatus[0]);
    domManager.addChild(`.board[data-board-id="${boardId}"]`, statusHTML);
    domManager.addEventListener(
      `.add-card[data-status-id="${newStatus[0].id}"]`,
      "click", () => {
      this.addCardToStatus(boardId, newStatus[0].id)})
  },

  addCardToStatus: async function(boardId, statusId) {
    const inputText = document.querySelector(`.new-card-name[data-status-id="${statusId}"]`);
    const cardTitle = inputText.value;
    if (cardTitle !== '') {
      await cardsManager.addCardToStatus(boardId, statusId, cardTitle);
    }
  }
};