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
        <button class="toggle-board-button" data-toggle="collapse" data-target="#collapse-${board.id}" 
                data-board-id="${board.id}" aria-expanded="true">
             <div class="card-header" id="heading-${board.id}">
                 <h5 class="mb-0">
                    ${board.title}
                 </h5>
             </div>
        </button>
    </div>

    <div id="collapse-${board.id}" class="collapse show" aria-labelledby="heading-${board.id}" data-parent="#accordion">
        <div class="board" data-board-id=${board.id}></div>
    </div>`;
}

function statusBuilder(status) {
    return `
    <div class="status-header">
        <h6>${status.title}</h6>
     </div>
    <div class="status" data-status-id="${status.id}">    
    </div>`
}

function cardBuilder(card) {
    return `<div class="card" data-card-id="${card.id}">${card.title}</div>`;
}

