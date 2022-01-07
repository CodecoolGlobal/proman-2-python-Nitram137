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


def get_boards(user_id=None):
    """
    Gather all boards
    :return:
    """
    return data_manager.execute_select(
        """
        SELECT * FROM boards
        WHERE user_id = %(user_id)s::int OR user_id IS NULL
        ORDER BY user_id, id
        ;
        """,
        {"user_id": user_id}
    )


def get_last_card_order(status_id):
    return data_manager.execute_select(
        """
        SELECT COALESCE(MAX(card_order), 0) as max_card_order
        FROM cards
        WHERE status_id = %(status_id)s;
        """
        , {"status_id": status_id}
        , fetchall=False)


def get_card_data(card_id):
    return data_manager.execute_select(
        """
        SELECT card_order, status_id
        FROM cards
        WHERE id=%(card_id)s
        """, {"card_id": card_id}, fetchall=False)


def get_cards_for_board(board_id):
    matching_cards = data_manager.execute_select(
        """
        SELECT * FROM cards
        WHERE cards.board_id = %(board_id)s
        ORDER BY card_order
        ;
        """
        , {"board_id": board_id})

    return matching_cards


def get_statuses_for_board(board_id):
    matching_cards = data_manager.execute_select(
        """
        SELECT * FROM statuses
        WHERE board_id = %(board_id)s
        ORDER BY id
        ;
        """
        , {"board_id": board_id})

    return matching_cards


def insert_new_status(status_title, board_id):
    return data_manager.execute_select(
        """
        INSERT INTO statuses(title, board_id)
        VALUES(%(status_title)s, %(board_id)s)
        RETURNING *;"""
        , {"status_title": status_title, "board_id": board_id}, fetchall=False)


def insert_new_card(card_title, board_id, status_id, card_position):
    if card_position == 0:
        card_position = get_last_card_order(status_id)["max_card_order"] + 1

    data_manager.execute_insert(
        """
        UPDATE cards
        SET card_order = card_order + 1
        WHERE card_order >= %(card_position)s::int AND status_id = %(status_id)s::int;
        """, {"card_position": card_position, "status_id": status_id}
    )
    return data_manager.execute_select(
        """
        INSERT INTO cards(title, board_id, status_id, card_order)
        VALUES(%(card_title)s, %(board_id)s, %(status_id)s, %(card_position)s)
        RETURNING *;"""
        , {"card_title": card_title,
           "board_id": board_id,
           "status_id": status_id,
           "card_position": card_position}, fetchall=False)


def replace_card(card_id, board_id, status_id, new_position):
    if new_position == 0:
        new_position = get_last_card_order(status_id)["max_card_order"] + 1

    data_manager.execute_insert("""
        UPDATE cards
        SET card_order = card_order + 1
        WHERE card_order >= %(card_position)s::int AND status_id = %(status_id)s::int;
        """, {"card_position": new_position, "status_id": status_id})

    data_manager.execute_insert("""
        UPDATE cards
        SET card_order = %(new_position)s, board_id = %(board_id)s, status_id = %(status_id)s
        WHERE id = %(card_id)s::int;
        """, {"card_id": card_id, "board_id": board_id, "status_id": status_id, "new_position": new_position})



def insert_new_board(board_name, user_id=None):
    return data_manager.execute_select(
        """
        INSERT INTO boards(title, user_id)
        VALUES(%(board_name)s, %(user_id)s)
        RETURNING *;"""
        , {"board_name": board_name, "user_id": user_id}, fetchall=False)


def rename_board(board_id, new_board_name):
    data_manager.execute_insert(
        """
        UPDATE boards
        SET title = %(new_board_name)s
        WHERE id = %(board_id)s
        ;
        """,
        {"board_id": board_id, "new_board_name": new_board_name})


def rename_status(status_id, new_status_name):
    data_manager.execute_insert(
        """
        UPDATE statuses
        SET title = %(new_status_name)s
        WHERE id = %(status_id)s
        """,
        {"status_id": status_id, "new_status_name": new_status_name})


def rename_card(card_id, new_card_name):
    data_manager.execute_insert(
        """
        UPDATE cards
        SET title = %(new_card_name)s
        WHERE id = %(card_id)s
        ;
        """,
        {"card_id": card_id, "new_card_name": new_card_name})


def delete_board(board_id):
    data_manager.execute_insert(
        """
        DELETE FROM boards
        WHERE id = %(board_id)s;
        """,
        {"board_id": board_id})


def delete_status(status_id):
    data_manager.execute_insert(
        """
        DELETE FROM statuses
        WHERE id = %(status_id)s;
        """,
        {"status_id": status_id})


def delete_card(card_id):
    card_data = data_manager.execute_select(
        """
        DELETE FROM cards
        WHERE id = %(card_id)s
        RETURNING *;
        """, {"card_id": card_id}, fetchall=False
    )
    data_manager.execute_insert(
        """
        UPDATE cards
        SET card_order = card_order - 1
        WHERE card_order > %(card_order)s AND status_id = %(card_status)s;
        """, {"card_order":  card_data["card_order"], "card_status": card_data["status_id"]}
    )


def is_board_name_exist(board_title):
    data = data_manager.execute_select(
        """
        SELECT EXISTS(SELECT 1 FROM boards WHERE title=%(board_title)s)
        """, {"board_title": board_title},
        fetchall=False
    )
    return data["exists"]


def is_status_name_exist(board_id, status_title):
    data = data_manager.execute_select(
        """
        SELECT EXISTS(SELECT 1 FROM statuses WHERE title=%(board_title)s AND board_id=%(board_id)s)
        """, {"status_title": status_title, "board_id": board_id},
        fetchall=False
    )
    return data["exists"]


def is_card_name_exist(status_id, card_title):
    data = data_manager.execute_select(
        """
        SELECT EXISTS(SELECT 1 FROM cards WHERE title=%(card_title)s AND status_id = %(status_id)s)
        """, {"card_title": card_title, "status_id": status_id},
        fetchall=False
    )
    return data["exists"]
