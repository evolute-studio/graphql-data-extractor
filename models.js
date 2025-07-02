export default {
    board:{
        id : String,
        player1 : {
            player_id : String,
            side: String, 
            joker_count: Number
        },
        player2 : {
            player_id : String,
            side: String,
            joker_count: Number
        },
        blue_score : {
            city_score : Number,
            road_score : Number
        },
        red_score : {
            city_score : Number,
            road_score : Number
        },
        first_move_id : String,
        last_move_id : String,
        duration : Number,
        game_state : String,
        updatedAt : String
    },
    player:{
        id : String,
        username : String,
        balance : Number,
        games_played : Number,
        time_played : Number,
        active_skin : String,
        is_bot : Boolean,
        updatedAt : String,
        boards : []
    },
    score:{
        city_score : Number,
        road_score : Number
    },
    move:{
        id : String,
        is_joker : Boolean,
        first_board_id : String,
        timestamp : String,
        updatedAt : String
    }
}