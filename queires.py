import data_manager
import json


def reg_user(input_username, input_email, password_hashed):
    data_manager.execute_insert(
        '''
        INSERT INTO users (username, email, password_hashed)
        VALUES ( %(un)s, %(em)s, %(psswh)s )
        ;
        ''',
        {'un': input_username, 'em': input_email, 'psswh': password_hashed})


def login_user(user_name):
    username = data_manager.execute_select(
        '''
        SELECT * 
        FROM users
        WHERE username = %(input_username)s
        ;
        ''',
        {'input_username': user_name})

    return username


def get_card_status(status_id):
    """
    Find the first status matching the given id
    :param status_id:
    :return: str
    """
    status = data_manager.execute_select(
        """
        SELECT * FROM statuses s
        WHERE s.id = %(status_id)s
        ;
        """,
        {"status_id": status_id})

    return status


def get_boards():
    """
    Gather all boards
    :return:
    """
    # remove this code once you implement the database
    # return [{"title": "board1", "id": 1}, {"title": "board2", "id": 2}]

    return data_manager.execute_select(
        """
        SELECT * FROM boards
        ;
        """
    )


def get_cards_for_board(board_id):
    # remove this code once you implement the database
    # return [{"title": "title1", "id": 1}, {"title": "board2", "id": 2}]

    matching_cards = data_manager.execute_select(
        """
        SELECT * FROM cards
        WHERE cards.board_id = %(board_id)s
        ;
        """
        , {"board_id": board_id})

    return matching_cards
