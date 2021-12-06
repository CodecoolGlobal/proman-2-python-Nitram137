from flask import Flask, render_template, url_for, session, request, redirect
from dotenv import load_dotenv

import util
from util import json_response
import mimetypes
import queires



mimetypes.add_type('application/javascript', '.js')
app = Flask(__name__)
secret_key = "b'h45h3d"
load_dotenv()


@app.route("/")
def index():
    """
    This is a one-pager which shows all the boards and cards
    """
    return render_template('index.html')


@app.route("/registration", methods=["GET", "POST"])
def registration():
    if request.method == "GET":
        return render_template('registration.html', username='Visitor')
    elif request.method == "POST":
        input_username = request.form.get('user_name')
        input_firstname = request.form.get('first_name')
        input_lastname = request.form.get('last_name')
        input_email = request.form.get('email')
        input_password = request.form.get('password')
        password_hashed = util.hash_password(input_password)

        queires.add_user = (input_username, input_firstname, input_lastname, input_email, password_hashed)

        return redirect('/login')


@app.route("/login")
def login():
    return render_template('login.html')


@app.route("/api/boards")
@json_response
def get_boards():
    """
    All the boards
    """
    return queires.get_boards()


@app.route("/api/boards/<int:board_id>/cards/")
@json_response
def get_cards_for_board(board_id: int):
    """
    All cards that belongs to a board
    :param board_id: id of the parent board
    """
    return queires.get_cards_for_board(board_id)


def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
