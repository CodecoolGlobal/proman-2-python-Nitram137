import { dataHandler } from "../data/dataHandler.js";
import { htmlFactory, htmlTemplates } from "../view/htmlFactory.js";
import { domManager } from "../view/domManager.js";
import {cardsManager} from "./cardsManager.js";

export let statusesManager = {
  addStatusToBoard: async function(boardId, statusTitle) {
    const newStatus = await dataHandler.createNewStatus(statusTitle, boardId);
    statusesManager.loadStatusToBoard(boardId, newStatus);
  },

  loadStatusToBoard: function(boardId, status) {
    const statusBuilder = htmlFactory(htmlTemplates.status);
    const statusHTML = statusBuilder(status);
    domManager.addChild(`.board-body[data-board-id="${boardId}"]`, statusHTML);
    addCardToStatus(boardId, status.id);
    deleteStatusEvent(status.id);
    renameStatus(status.id);
  },
};

function deleteStatusEvent(statusId) {
  domManager.addEventListener(
    `.delete-status[data-status-id="${statusId}"]`,
    'click', () => {
      dataHandler.deleteStatus(statusId).then();
      let deletedStatus = document.querySelector(`.status[data-status-id="${statusId}"]`);
      deletedStatus.remove();
    });
}

function addCardToStatus(boardId, statusId) {
  domManager.addEventListener(
    `.add-card[data-status-id="${statusId}"]`,
    "click", () => {
      const inputText = document.querySelector(`.new-card-name[data-status-id="${statusId}"]`);
      const cardTitle = inputText.value;
      if (cardTitle !== '') cardsManager.addCardToStatus(boardId, statusId, cardTitle).then();
    })
}

function renameStatus(statusId) {
    domManager.addEventListener(
        `.status-header[data-status-id="${statusId}"] h6`,
        "click",  (e) => {
        if (!document.querySelector("#new-name-input")){
            domManager.titleToInputHandler(e, statusId, dataHandler.renameStatus);
        }
    })
}