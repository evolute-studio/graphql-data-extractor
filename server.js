import express from "express";
import cors from "cors";
import { request } from "graphql-request";
import queries from "./quries.js";
import models from "./models.js";
import { hexToString, hexToDecimal, unixToISOString } from './converters.js';
import { GetGeneralPlayersData, GetGeneralBoardsData } from './helper.js';

const app = express();
const PORT = 3000;
app.use(cors());

const GRAPHQL_ENDPOINT = "https://api.cartridge.gg/x/evolute-duel/torii/graphql";

app.get("/general_players_data", async (req, res) => {
  let boards = await GetGeneralBoardsData();
  const players = await GetGeneralPlayersData();
  res.json(players);
  //res.json({players, boards_count: boards.length, boards: boards});
});

app.get("/players", async (req, res) => {
  try {
    const result = await request(GRAPHQL_ENDPOINT, queries.players.query, queries.players.defaultVars);
    console.log(`Received ${result.evoluteDuelPlayerModels.edges.length} players from GraphQL`);
    const players = result.evoluteDuelPlayerModels.edges.map((edge) => {
      const node = edge.node;
      return {
        player_id: node.player_id,
        username: hexToString(node.username),
        balance: node.balance,
        games_played: node.games_played,
        active_skin: node.active_skin,
        role: node.role,
        updatedAt: node.entity.updatedAt
      };
    });
    console.log(`Sending ${players.length} players to client`);
    res.json(players);
  } catch (error) {
    console.error("GraphQL error:", error);
    res.status(500).json({ error: "Failed to fetch players data" });
  }
});

app.get("/boards", async (req, res) => {
  try {
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
        last_move_id: node.last_move_id.Some,
        game_state: node.game_state,
        updatedAt: node.entity.updatedAt
      };
    });
    console.log(`Sending ${boards.length} boards to client`);
    res.json(boards);
  } catch (error) {
    console.error("GraphQL error:", error);
    res.status(500).json({ error: "Failed to fetch boards data" });
  }
});

app.get("/moves", async (req, res) => {
  try {
    const first_board_id = req.query.first_board_id || "0x0";
    const result = await request(GRAPHQL_ENDPOINT, queries.moves.query, {
      ...queries.moves.defaultVars,
      first_board_id
    });
    console.log(`Received ${result.evoluteDuelMoveModels.edges.length} moves from GraphQL for board ${first_board_id}`);
    const moves = result.evoluteDuelMoveModels.edges.map((edge) => {
      const node = edge.node;
      return {
        id: node.id,
        is_joker: node.is_joker,
        first_board_id: node.first_board_id,
        timestamp: unixToISOString(hexToDecimal(node.timestamp)),
        updatedAt: node.entity.updatedAt
      };
    });
    console.log(`Sending ${moves.length} moves to client`);
    res.json(moves);
  } catch (error) {
    console.error("GraphQL error:", error);
    res.status(500).json({ error: "Failed to fetch moves data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
