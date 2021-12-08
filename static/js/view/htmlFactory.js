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
    <div class="card">
        <div class="card-header" id="headingOne">
            <h5 class="mb-0">
                <button class="btn btn-link toggle-board-button" data-toggle="collapse"
                 data-target="#collapse-${board.id}" data-board-id="${board.id}"
                 aria-expanded="true" aria-controls="collapseOne">
                    Show Cards
                </button>
            </h5>
        </div>

        <div id="collapse-${board.id}" class="collapse show" aria-labelledby="headingOne" data-parent="#accordion">
            <div class="card-body">
                <div class="board" data-board-id="${board.id}">${board.title}</div>
            </div>
        </div>
    </div>`;
}

function statusBuilder(status) {
    return `<div class="status" data-status-id="${status.id}">${status.title}</div>`
}

function cardBuilder(card) {
    return `<div class="card" data-card-id="${card.id}">${card.title}</div>`;
}

