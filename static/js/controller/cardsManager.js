import { dataHandler } from "../data/dataHandler.js";
import { htmlFactory, htmlTemplates } from "../view/htmlFactory.js";
import { domManager } from "../view/domManager.js";

export let cardsManager = {
  addCardToStatus:async function(boardId, statusId, cardTitle) {
    const newCard = await dataHandler.createNewCard(cardTitle, boardId, statusId);
    cardsManager.loadCardToStatus(boardId, statusId, newCard)
  },
  loadCardToStatus: function(boardId, statusId, card) {
    const cardBuilder = htmlFactory(htmlTemplates.card);
    const cardHTML = cardBuilder(card);
    domManager.addChild(`.status-body[data-status-id="${statusId}"]`, cardHTML);
    renameCard(card.id);
    deleteCard(card.id)
  }
};

function deleteCard(cardId) {
  domManager.addEventListener(
    `.delete-card[data-card-id="${cardId}"]`,
    'click', () => {
      dataHandler.deleteCard(cardId).then();
      let deletedCard = document.querySelector(`.card[data-card-id="${cardId}"]`);
      deletedCard.remove();
    });
}

function renameCard(cardId) {
    domManager.addEventListener(
      `.card-text[data-card-id="${cardId}"]`,
      "click", function (e) {
      if (!document.querySelector("#new-name-input")){
          domManager.titleToInputHandler(e, cardId, dataHandler.renameCard);
      }
    });
}