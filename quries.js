import { gql } from "graphql-request";

export default {

  players: {

    query: gql`{
      evoluteDuelPlayerModels(limit: 100000) {
      edges{
        node{
          player_id
        	username
          balance
          games_played
          active_skin
          role
          entity{
            updatedAt
          }
        }
      }
  }}
    `,

    defaultVars: {},
  },

  boards: {

    query: gql`{
      evoluteDuelBoardModels(limit: 100000) {
      edges{
        node{
          id
        	player1 {
        	  _0
        	  _1
        	  _2
        	}
          player2 {
            _0
            _1
            _2
          }
          blue_score {
            _0
            _1
          }
          red_score {
            _0
            _1
          }
          last_move_id {
            Some
          }
          game_state
          entity{
            updatedAt
          }
        }
      }
  }}
    `,

    defaultVars: { limit: 10000, offset: 0 },
  },

  moves: {

    query: gql`
    {
      evoluteDuelMoveModels(limit: 100000) {
      edges{
        node{
          id
        	is_joker
          first_board_id
          timestamp
          entity{
            updatedAt
          }
        }
      }
  }}
    `,

    defaultVars: { first_board_id: "0x0" },
  },
};
