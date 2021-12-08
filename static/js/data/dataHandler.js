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
  createNewCard: async function (cardTitle, boardId, statusId) {
    // creates new card, saves it and calls the callback function with its data
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
  let upload = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  return upload;
}
