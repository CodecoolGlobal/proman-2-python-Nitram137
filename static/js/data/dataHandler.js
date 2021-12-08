export let dataHandler = {
  getBoards: async function () {
    const response = await apiGet("/api/boards");
    return response;
  },
  getBoard: async function (boardId) {
    // the board is retrieved and then the callback function is called with the board
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
    await apiPut("/api/createBoard", payLoad);
  },
  createNewStatus: async function (statusTitle, boardId) {
    const response = await apiPut(`/api/boards/${boardId}/statuses`, {statusTitle: statusTitle});
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

async function apiDelete(url) {}

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
