import { dataHandler } from "../data/dataHandler.js";
import { htmlFactory, htmlTemplates } from "../view/htmlFactory.js";
import { domManager } from "../view/domManager.js";

export let cardsManager = {
  addCardToStatus:async function(boardId, statusId, cardTitle) {
    const newCard = await dataHandler.createNewCard(cardTitle, boardId, statusId);
    const cardBuilder = htmlFactory(htmlTemplates.card);
    const cardHTML = cardBuilder(newCard[0]);
    domManager.addChild(`.status[data-status-id="${statusId}"]`, cardHTML);
  }
};



function deleteButtonHandler(clickEvent) {}
