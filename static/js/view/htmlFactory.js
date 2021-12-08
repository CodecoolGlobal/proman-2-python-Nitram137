export const htmlTemplates = {
    board: 1,
    status: 2,
    card: 3
}

export function htmlFactory(template) {
    switch (template) {
        case htmlTemplates.board:
            return boardBuilder
        case htmlTemplates.status:
            return statusBuilder
        case htmlTemplates.card:
            return cardBuilder
        default:
            console.error("Undefined template: " + template)
            return () => { return "" }
    }
}

function boardBuilder(board) {
    return `
    <div class="board card">
    <a href="#collapse-${board.id}" data-toggle="collapse">
         <div class="card-header" id="heading-${board.id}">
             <h5 class="mb-0">
                ${board.title}
             </h5>
         </div></a>
    </div>

    <div id="collapse-${board.id}" class="collapse show">
        <div class="board row" data-board-id=${board.id}>
            <input type="text" class="new-status-name" data-board-id="${board.id}">
            <button class="add-status" data-board-id="${board.id}">Add status</button>
        </div>
    </div>`;
}

function statusBuilder(status) {
    return `
    <div class="status col" data-status-id="${status.id}">    
    <div class="status-header"><h6>${status.title}</h6></div>
    </div>`
}

function cardBuilder(card) {
    return `<div class="card" data-card-id="${card.id}">${card.title}</div>`;
}

