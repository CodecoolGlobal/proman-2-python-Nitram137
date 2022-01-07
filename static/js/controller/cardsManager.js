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
    deleteCard(card.id);
    dragCard(card.id);
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

function dragCard(cardId) {
    let boxes;
    let nextElement;
    let statuses;
    let cardContainer;
    const audio = new Audio('/static/css/sad_violin.mp3');
    const dragToNowhere = (e) => {
        const draggable = document.querySelector('.dragging');
        let x = e.clientX, y = e.clientY;

        for (let box of boxes) {
            if (box.top < y && box.bottom > y && box.left < x && box.right > x) {
                return;
            }
        }
        if (nextElement) {
            cardContainer.insertBefore(draggable, nextElement);
        } else {
            cardContainer.appendChild(draggable);
        }
    }

    domManager.addEventListener(`.card[data-card-id="${cardId}"]`, "dragstart", (e) => {
        e.currentTarget.classList.add('dragging');
        audio.play().then();
        nextElement = document.querySelector(`.card[data-card-id="${cardId}"]`).nextElementSibling;
        statuses = [...document.querySelectorAll(`.status`)];
        cardContainer = document.querySelector(`.card[data-card-id="${cardId}"]`).parentElement;
        boxes = [];
        statuses.forEach((e) => {
            boxes.push(e.getBoundingClientRect());
        });
        document.addEventListener('dragover', dragToNowhere)
    });

    domManager.addEventListener(`.card[data-card-id="${cardId}"]`, "dragend", (e) => {
        e.currentTarget.classList.remove('dragging');
        document.removeEventListener('dragover', dragToNowhere);
    });
}