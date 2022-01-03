export let dataHandler = {
  getBoards: async function () {
    const response = await apiGet("/api/boards");
    return response;
  },
  getNewBoardId: async function () {
    const firstResponse = await apiGet("/api/boards");
    const newBoardId = firstResponse[firstResponse.length - 1].id;
    return newBoardId;
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
    const newBoardId = this.getNewBoardId()
    const payLoad = {id: newBoardId, title: boardTitle};
    return await apiPut("/api/createBoard", payLoad);
  },
  createNewStatus: async function (statusTitle, boardId) {
    const response = await apiPut(`/api/boards/${boardId}/statuses/`, {statusTitle: statusTitle});
    return response;
  },
  createNewCard: async function (cardTitle, boardId, statusId) {
    const response = await apiPut(`/api/boards/${boardId}/statuses/${statusId}/cards`, {cardTitle: cardTitle});
    return response;
  },
  renameBoard: async function (boardId, newBoardName) {
    const payLoad = {title: newBoardName};
    await apiPut(`/api/boards/${boardId}/rename/`, payLoad);
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

async function apiPost(url, payload) {}

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
