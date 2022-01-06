export const htmlTemplates = {
    board: 1,
    status: 2,
    card: 3,
    button: 4
}

export function htmlFactory(template) {
    switch (template) {
        case htmlTemplates.board:
            return boardBuilder
        case htmlTemplates.status:
            return statusBuilder
        case htmlTemplates.card:
            return cardBuilder
        case htmlTemplates.button:
            return buttonBuilder
        default:
            console.error("Undefined template: " + template)
            return () => { return "" }
    }
}

function buttonBuilder(id="", buttonId ="", innerText="") {
    return `
    <div class="button-container" id="${id}-button-container">
        <button type="button" id="${buttonId}">${innerText}</button>
    </div>`;
}

function boardBuilder(board) {
    return `
    <div class="board" data-board-id="${board.id}" data-user-id="${board.user_id}">
        <div class="board-header card">
             <div class="card-header d-flex" id="heading-${board.id}">
                <div class="toggle-button-and-board-name">
                    <a href="#collapse-${board.id}" data-toggle="collapse"><i class="fa fas fa-angle-down"></i></a>
                    <h5 class="board-name">${board.title}</h5>
                </div>
                 <div class="add-status">
                    <input type="text" class="new-status-name" data-board-id="${board.id}">
                    <button class="add-status" data-board-id="${board.id}">Add status</button>
                    <button type="button" class="btn-close delete-board" data-board-id="${board.id}"></button>
                 </div>
             </div>
        </div>
    
        <div id="collapse-${board.id}" class="collapse show">
            <div class="board-body row" data-board-id="${board.id}"></div>
        </div>
    </div>`;

}

function statusBuilder(status) {
    return `
    <div class="status col card border-dark mb-3" data-status-id="${status.id}">
        <div class="status-header card-header" data-status-id="${status.id}">
            <h6>${status.title}</h6>
            <div class="close-container">
                <button type="button" class="close delete-status" aria-label="Close" data-status-id="${status.id}">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="input-group input-group-sm mb-3">
                <div class="input-group-prepend">
                    <button class="input-group-text add-card btn btn-dark" data-status-id="${status.id}" id="inputGroup-sizing-sm">Add card</button>
                </div>
                <input type="text" class="new-card-name form-control"  data-status-id="${status.id}" aria-label="Small" aria-describedby="inputGroup-sizing-sm">
            </div>
        </div>
        <div class="status-body card-body text-dark" data-status-id="${status.id}">
        
        </div>
    </div>`
}

function cardBuilder(card) {
    return `
    <div class="card mb-3 position-relative" draggable="true" data-card-id="${card.id}">
        
        <p class="card-text text-center" data-card-id="${card.id}">${card.title}</p>
        <button type="button" class="btn-close delete-card" data-card-id="${card.id}"></button>
    </div>`;
}

