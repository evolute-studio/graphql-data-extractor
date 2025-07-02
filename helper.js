import { gql, request } from "graphql-request";
import queries from "./quries.js";
import { hexToString, hexToDecimal, unixToISOString } from './converters.js';


export const GRAPHQL_ENDPOINT = "https://api.cartridge.gg/x/evolute-duel/torii/graphql";


export async function GetGeneralPlayersData() {
  const players = await getPlayers();
  const boards = await getBoards();
  const moves = await getMoves();

  // цикл по всіх гравцях
  for (const player of players) {
    // отримати всі дошки гравця
    const playerBoards = boards.filter(board => board.player1.player_id === player.id || board.player2.player_id === player.id);
    // отримати всі рухи гравця
    player.username = hexToString(player.username);

    player.games_played = playerBoards.length;
    for (const board of playerBoards) {
      const boardMoves = moves.filter(move => move.first_board_id === board.id);
      board.moves_count = boardMoves.length;
      // перевіряємо чи є ходи для дошки
      if (boardMoves.length > 0) {
        // need to sort moves by timestamp
        boardMoves.sort((a, b) => a.timestamp - b.timestamp);

        // first move in array
        const firstMove = boardMoves[0];
        // last move in array
        const lastMove = boardMoves[boardMoves.length - 1];
        const boardCreatedAt = hexToDecimal(firstMove.timestamp);
        board.created_at = unixToISOString(boardCreatedAt);



        // duration of the game
        const duration = lastMove.timestamp - firstMove.timestamp;
        board.first_move_id = firstMove.id;
        board.duration = duration;

        // add duration to player
        player.time_played += duration;
        // add board to player
        player.boards.push(board);

      }
    }

  }

  // sort players by balance
  players.sort((a, b) => b.time_played - a.time_played);

  return players;
}

export async function GetGeneralBoardsData() {
  const boards = await getBoards();
  return boards;
}


// треба отримати всіх гравців query запитом
export async function getPlayers() {
  const result = await request(GRAPHQL_ENDPOINT, queries.players.query, queries.players.defaultVars);
  console.log(`Received ${result.evoluteDuelPlayerModels.edges.length} players from GraphQL`);
  const players = result.evoluteDuelPlayerModels.edges.map((edge) => {
    const node = edge.node;
    return {
      id: node.player_id,
      username: node.username,
      balance: node.balance,
      games_played: node.games_played,
      time_played: 0, // за замовчуванням 0, оскільки немає в запиті
      active_skin: node.active_skin,
      updatedAt: node.entity.updatedAt,
      role: node.role,
      boards: [] // за замовчуванням пустий масив, оскільки немає в запиті
    };
  });
  return players;
}

// треба отримати всі дошки
export async function getBoards() {
  const result = await request(GRAPHQL_ENDPOINT, queries.boards.query, queries.boards.defaultVars);
  console.log(`Received ${result.evoluteDuelBoardModels.edges.length} boards from GraphQL`);
  const boards = result.evoluteDuelBoardModels.edges.map((edge) => {
    const node = edge.node;
    return {
      id: node.id,
      player1: {
        player_id: node.player1._0,
        side: node.player1._1,
        joker_count: node.player1._2
      },
      player2: {
        player_id: node.player2._0,
        side: node.player2._1,
        joker_count: node.player2._2
      },
      blue_score: {
        city_score: node.blue_score._0,
        road_score: node.blue_score._1
      },
      red_score: {
        city_score: node.red_score._0,
        road_score: node.red_score._1
      },
      first_move_id: "", // за замовчуванням пустий рядок, оскільки немає в запиті
      last_move_id: node.last_move_id.Some,
      duration: 0, // за замовчуванням 0, оскільки немає в запиті
      game_state: node.game_state,
      updatedAt: node.entity.updatedAt
    }
  });
  return boards;
}

// треба отримати всі рухи
export async function getMoves() {
  const result = await request(GRAPHQL_ENDPOINT, queries.moves.query, queries.moves.defaultVars);
  console.log(`Received ${result.evoluteDuelMoveModels.edges.length} moves from GraphQL`);
  const moves = result.evoluteDuelMoveModels.edges.map((edge) => {
    const node = edge.node;
    return {
      id: node.id,
      is_joker: node.is_joker,
      first_board_id: node.first_board_id,
      timestamp: node.timestamp,
      updatedAt: node.entity.updatedAt
    }
  });
  return moves;
}
