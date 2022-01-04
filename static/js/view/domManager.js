import {dataHandler} from "../data/dataHandler.js";

export let domManager = {
  addChild(parentIdentifier, childContent) {
    const parent = document.querySelector(parentIdentifier);
    if (parent) {
      parent.insertAdjacentHTML("beforeend", childContent);
    } else {
      console.error("could not find such html element: " + parentIdentifier);
    }
  },
  addEventListener(parentIdentifier, eventType, eventHandler) {
    const parent = document.querySelector(parentIdentifier);
    if (parent) {
      parent.addEventListener(eventType, eventHandler);
    } else {
      console.error("could not find such html element: " + parentIdentifier);
    }
  },
  titleToInputHandler(clickEvent, id, dataHandlerFunc) {
    let oldName = clickEvent.target.innerText;
    const inputField = `<input type="text" id="new-name-input" name="new-name-input" value="${oldName}">`;
    const titleText = clickEvent.target
    titleText.innerHTML = inputField
    saveTitle(id, dataHandlerFunc);
    closeInput(clickEvent.target, oldName);
  },
};

function saveTitle(id, dataHandlerFunc) {
  domManager.addEventListener('#new-name-input','keypress', function (e) {
    const clickEventInputField = e.target;
    if (e.key === 'Enter') {
      const newTitle = document.querySelector("#new-name-input").value;
      dataHandlerFunc(id, newTitle).then();
      clickEventInputField.parentNode.innerHTML = `${newTitle}`;
    }
  })
}

function closeInput(target, oldName) {
  document.addEventListener('mousedown', function closeEvent(e) {
    if (document.querySelector("#new-name-input")) {
      let x = e.x, y = e.y;
      if (document.elementFromPoint(x, y) !== document.querySelector("#new-name-input")) target.innerText = oldName;
    } else {
      document.removeEventListener('mousedown', closeEvent);
    }
  });
}
