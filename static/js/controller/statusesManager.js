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
    dragOverStatusHeader(status.id);
    dragOverStatusBody(status.id);
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

function dragOverStatusHeader(statusId) {
    domManager.addEventListener(
        `.status-header[data-status-id="${statusId}`,
        'dragover',
        (e) => {
            e.preventDefault();
            let statusBody = e.currentTarget.nextElementSibling;
            const draggable = document.querySelector('.dragging');
            statusBody.appendChild(draggable);
        });
}


function dragOverStatusBody(statusId) {
    domManager.addEventListener(
        `.status-body[data-status-id="${statusId}"]`,
        'dragover',
        (e) => {
            e.preventDefault();
            const afterElement = getDragAfterElement(e.currentTarget, e.clientY);
            const draggable = document.querySelector('.dragging');
            if (afterElement == null) {
              e.currentTarget.appendChild(draggable);
            } else {
              e.currentTarget.insertBefore(draggable, afterElement);
            }
        }
    )
}

function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll('.card:not(.dragging)')]

  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}
