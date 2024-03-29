from flask import Flask, render_template, url_for, session, request, redirect
from dotenv import load_dotenv
from util import json_response
from datetime import timedelta
import mimetypes
import queires
import util


mimetypes.add_type('application/javascript', '.js')
app = Flask(__name__)
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'
app.permanent_session_lifetime = timedelta(minutes=10)
load_dotenv()


@app.route("/", methods=['GET', 'POST'])
def index():
    if 'username' in session:
        return render_template('index.html', username=session['username'])
    else:
        return render_template('index.html', username='Visitor')


@app.route("/registration", methods=["GET", "POST"])
def registration():
    if request.method == "GET":
        return render_template('registration.html', username='Visitor')
    elif request.method == "POST":
        input_username = request.form.get('user_name')
        input_email = request.form.get('email')
        password_hashed = util.hash_password(request.form['password'])

        queires.reg_user(input_username, input_email, password_hashed)
        return redirect('/login')


@app.route("/login", methods=['GET', 'POST'])
def login():
    if request.method == "POST":
        current_user = queires.login_user(request.form['user_name'])
        input_password = request.form['user_password']
        if len(current_user) > 0:
            if util.verify_password(input_password, current_user[0]['password_hashed']):
                session['username'] = current_user[0]['username']
                session['user_id'] = current_user[0]['id']
                return redirect('/')
            else:
                msg = "Wrong Password try again!"
                return render_template('login.html', msg=msg, username='Visitor')
        else:
            msg = "Wrong USER, try again!"
            return render_template('login.html', msg=msg, username='Visitor')
    else:
        if "username" in session:
            msg = "You have already logged in!"
            return render_template('login.html', msg=msg)
    return render_template('login.html', username='Visitor')


@app.route('/logout', methods=['GET'])
def logout():
    if 'username' in session:
        session.clear()
    return redirect('/')


@app.route("/api/boards/<user_id>", methods=["GET", "POST", "PUT"])
@json_response
def get_boards(user_id):
    return queires.get_boards(user_id)


@app.route("/api/createBoard", methods=["POST"])
@json_response
def create_new_board():
    if request.method == "POST":
        body = request.json
        return queires.insert_new_board(body['title'], body['user_id'])


@app.route("/api/boards/<int:board_id>/cards/")
@json_response
def get_cards_for_board(board_id: int):
    """
    All cards that belongs to a board
    :param board_id: id of the parent board
    """
    return queires.get_cards_for_board(board_id)


@app.route("/api/boards/<int:board_id>/rename/", methods=['GET', 'PUT'])
@json_response
def rename_board(board_id: int):
    if request.method == "PUT":
        body = request.json
        return queires.rename_board(board_id, body['title'])


@app.route("/api/boards/<int:board_id>/statuses/", methods=['GET', 'PUT'])
@json_response
def get_statuses(board_id: int):
    if request.method == 'PUT':
        return queires.insert_new_status(request.json['statusTitle'], board_id)
    return queires.get_statuses_for_board(board_id)


@app.route("/api/boards/<int:board_id>/statuses/<int:status_id>/cards", methods=['PUT'])
@json_response
def create_card(status_id: int, board_id: int):
    if request.method == 'PUT':
        return queires.insert_new_card(request.json['cardTitle'], board_id, status_id, request.json['cardPosition'])


@app.route("/api/boards/<int:board_id>/statuses/<int:status_id>/cards/<int:card_id>", methods=['PUT'])
@json_response
def replace_card(status_id: int, board_id: int, card_id: int):
    if request.method == 'PUT':
        return queires.replace_card(card_id, board_id, status_id, request.json['cardPosition'])


@app.route("/api/cards/<int:card_id>/rename/", methods=['GET', 'PUT'])
@json_response
def rename_card(card_id: int):
    if request.method == "PUT":
        body = request.json
        return queires.rename_card(card_id, body['title'])


@app.route("/api/status/<int:status_id>/rename/", methods=['GET', 'PUT'])
@json_response
def rename_status(status_id: int):
    if request.method == "PUT":
        body = request.json
        return queires.rename_status(status_id, body['title'])


@app.route("/api/board/<int:board_id>/delete", methods=['DELETE'])
@json_response
def delete_board(board_id: int):
    return queires.delete_board(board_id)


@app.route("/api/status/<int:status_id>/delete", methods=['DELETE'])
@json_response
def delete_status(status_id: int):
    return queires.delete_status(status_id)


@app.route("/api/card/<int:card_id>/delete", methods=['DELETE'])
@json_response
def delete_card(card_id: int):
    return queires.delete_card(card_id)


def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
