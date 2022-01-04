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

function buttonBuilder(buttonClass="", buttonId ="") {
    return `
    <div class="button-container">
        <button type="button" class="${buttonClass}" id="${buttonId}">+ New Board</button>
    </div>`;
}

function boardBuilder(board) {
    return `
    <div class="board" data-board-id="${board.id}">
        <div class="board-header card">
             <div class="card-header" id="heading-${board.id}">
                 <h5 class="mb-0">${board.title}</h5>
                 <button type="button" class="btn-close delete-board" data-board-id="${board.id}"></button>
                 <a href="#collapse-${board.id}" data-toggle="collapse"></a>
             </div>
        </div>
    
        <div id="collapse-${board.id}" class="collapse show">
            <div class="board-body row" data-board-id="${board.id}">
                <input type="text" class="new-status-name" data-board-id="${board.id}">
                <button class="add-status" data-board-id="${board.id}">Add status</button>
            </div>
        </div>
    </div>`;

}

function statusBuilder(status) {
    return `
    <div class="status col" data-status-id="${status.id}">    
        <div class="status-header" data-status-id="${status.id}">
            <h6>${status.title}</h6>
            <button type="button" class="btn-close delete-status" data-status-id="${status.id}"></button>
            <input type="text" class="new-card-name" data-status-id="${status.id}">
            <button class="add-card" data-status-id="${status.id}">Add card</button>
        </div>
        <div class="status-body" data-status-id="${status.id}">
        
        </div>
    </div>`
}

function cardBuilder(card) {
    return `
    <div class="card" data-card-id="${card.id}">   
        <p class="card-text" data-card-id="${card.id}">${card.title}</p>
        <button type="button" class="btn-close delete-card" data-card-id="${card.id}"></button>
    </div>`;
}

