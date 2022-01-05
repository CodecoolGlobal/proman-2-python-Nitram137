export let dataHandler = {
  getBoards: async function () {
    const response = await apiGet("/api/boards");
    return response;
  },
  getStatuses: async function (boardId) {
    const response = await apiGet(`/api/boards/${boardId}/statuses`);
    return response;
  },
  getStatus: async function (statusId) {
    // the status is retrieved and then the callback function is called with the status
  },
  getCardsByBoardId: async function (boardId) {
    const response = await apiGet(`/api/boards/${boardId}/cards/`);
    return response;
  },
  getCard: async function (cardId) {
    // the card is retrieved and then the callback function is called with the card
  },
  createNewBoard: async function (boardTitle) {
    const payLoad = {title: boardTitle};
    return await apiPost("/api/createBoard", payLoad);
  },
  createNewStatus: async function (statusTitle, boardId) {
    const response = await apiPut(
        `/api/boards/${boardId}/statuses/`,
        {statusTitle: statusTitle});
    return response;
  },
  createNewCard: async function (cardTitle, boardId, statusId, cardPosition = 0) {
    const response = await apiPut(
        `/api/boards/${boardId}/statuses/${statusId}/cards`,
        {cardTitle: cardTitle, cardPosition: cardPosition});
    return response;
  },
  renameBoard: async function (boardId, newBoardName) {
    const payLoad = {title: newBoardName};
    await apiPut(`/api/boards/${boardId}/rename/`, payLoad);
  },
  renameStatus: async function (statusId, newStatusName) {
    const payLoad = {title: newStatusName};
    await apiPut(`/api/status/${statusId}/rename/`, payLoad);
  },

  renameCard: async function (cardId, newCardName) {
    const payLoad = {title: newCardName};
    await apiPut(`/api/cards/${cardId}/rename/`, payLoad);
  },
  deleteBoard: async function(boardId) {
    await apiDelete(`/api/board/${boardId}/delete`);
  },
  deleteStatus: async function(statusId) {
    await apiDelete(`/api/status/${statusId}/delete`);
  },
  deleteCard: async function(cardId) {
    await apiDelete(`/api/card/${cardId}/delete`);
  }
};

async function apiGet(url) {
  let response = await fetch(url, {
    method: "GET"
  });
  if (response.ok) {
    let data = response.json();
    return data;
  }
}

async function apiPost(url, payload) {
  let response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  if (response.ok) {
    let data = response.json()
    return data;
  }
}

async function apiDelete(url) {
  let response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    },
  });
  if (response.ok) {
    let data = response.json()
    return data;
  }
}

async function apiPut(url, payload) {
  let response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  if (response.ok) {
    let data = response.json()
    return data;
  }
}
