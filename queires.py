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


def insert_new_board(board_name):

    data_manager.execute_insert(
        """
        INSERT INTO boards(title)
        VALUES(%(board_name)s);"""
        , {"board_name": board_name})


def rename_board(board_id, new_board_name):
    return data_manager.execute_insert(
        """
        UPDATE boards
        SET title = %(new_board_name)s
        WHERE id = %(board_id)s
        ;
        """,
    {"board_id": board_id, "new_board_name": new_board_name})