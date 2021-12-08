from flask import Flask, render_template, url_for, session, request, jsonify
from dotenv import load_dotenv


from util import json_response
import mimetypes
import queires


mimetypes.add_type('application/javascript', '.js')
app = Flask(__name__)
secret_key = "b'h45h3d"
load_dotenv()


@app.route("/", methods=['GET', 'POST'])
def index():
    """
    This is a one-pager which shows all the boards and cards
    """
    return render_template('index.html')


@app.route("/api/boards", methods=["GET", "POST", "PUT"])
@json_response
def get_boards():
    return queires.get_boards()


@app.route("/api/createBoard", methods=["GET", "POST", "PUT"])
@json_response
def create_new_board():
    if request.method == "PUT":
        body = request.json
        return queires.insert_new_board(body['title'])


@app.route("/api/boards/<int:board_id>/statuses")
@json_response
def get_statuses_for_board(board_id: int):
    return queires.get_statuses_for_board(board_id)


@app.route("/api/boards/<int:board_id>/cards/")
@json_response
def get_cards_for_board(board_id: int):
    """
    All cards that belongs to a board
    :param board_id: id of the parent board
    """
    return queires.get_cards_for_board(board_id)


@app.route("/api/boards/<int:board_id>/rename/", methods=['GET', 'POST', 'PUT'])
@json_response
def rename_board(board_id: int):
    if request.method == "PUT":
        body = request.json
        return queires.rename_board(board_id, body['title'])


def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
