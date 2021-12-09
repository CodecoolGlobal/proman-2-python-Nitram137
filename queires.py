import data_manager


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
        """
        , {"status_id": status_id})

    return status


def get_boards():
    """
    Gather all boards
    :return:
    """
    return data_manager.execute_select(
        """
        SELECT * FROM boards
        ;
        """
    )


def get_cards_for_board(board_id):
    matching_cards = data_manager.execute_select(
        """
        SELECT * FROM cards
        WHERE cards.board_id = %(board_id)s
        ;
        """
        , {"board_id": board_id})

    return matching_cards


def get_statuses_for_board(board_id):
    matching_cards = data_manager.execute_select(
        """
        SELECT * FROM statuses
        WHERE board_id = %(board_id)s
        ;
        """
        , {"board_id": board_id})

    return matching_cards


def insert_new_status(status_title, board_id):
    data_manager.execute_insert(
        """
        INSERT INTO statuses(title, board_id)
        VALUES(%(status_title)s, %(board_id)s);"""
        , {"status_title": status_title, "board_id": board_id})

    return data_manager.execute_select(
        """
        SELECT * FROM statuses
        where board_id = %(board_id)s and title = %(status_title)s
        ;""", {"status_title": status_title, "board_id": board_id}
    )


def insert_new_card(card_title, board_id, status_id):
    data_manager.execute_insert(
        """
        INSERT INTO cards(title, board_id, status_id, card_order)
        VALUES(%(card_title)s, %(board_id)s, %(status_id)s, 3);"""
        , {"card_title": card_title, "board_id": board_id, "status_id": status_id})

    return data_manager.execute_select(
        """
        SELECT * FROM cards
        where title = %(card_title)s and board_id = %(board_id)s and status_id = %(status_id)s
        ;""", {"card_title": card_title, "board_id": board_id, "status_id": status_id}
    )


def insert_new_board(board_name):
    data_manager.execute_insert(
        """
        INSERT INTO boards(title)
        VALUES(%(board_name)s);"""
        , {"board_name": board_name})


def rename_board(board_id, new_board_name):
    data_manager.execute_insert(
        """
        UPDATE boards
        SET title = %(new_board_name)s
        WHERE id = %(board_id)s
        ;
        """,
    {"board_id": board_id, "new_board_name": new_board_name})
