/**
 * App consts
 * @author r0mk1n
 */
r0mk1n.Consts = {
    // global //////////////////////////////////////////////////////////////////////////////////////////////////////////

    // size of gamefield, in cells
    cell_x_count        : 80,
    cell_y_count        : 60,

    environment_percent : 3,

    // canvas ID
    canvasId: 'r0mk1n_pythonApp',

    // storage key
    storageKey: 'r0mk1n.pythonApp',

    // URL for audio stream
    audioUrl: 'http://89.184.1.39:8050/;',

    // palette
    palettes: [
        {low: "#747274", med: "#bcbabc", high: "#fcfafc"},
        {low: "#844204", med: "#ec9a54", high: "#fcfafc"},
        {low: "#ac2624", med: "#ec8a8c", high: "#fcfafc"},
        {low: "#947a4c", med: "#c4ae94", high: "#fceae4"},
        {low: "#0432fc", med: "#7caafc", high: "#fcfafc"},
        {low: "#4432a4", med: "#9c92f4", high: "#fcfafc"}
    ],

    // texts settings //////////////////////////////////////////////////////////////////////////////////////////////////

    // intro
    intro: {
        title: {
            font    : '48px Tahoma, Geneva, sans-serif',
            text    : '-==python==:)'
        },
        subtitle: {
            font    : '12px Tahoma, Geneva, sans-serif',
            text    : 'VanillaJS/CanvasAPI/LocalStorageAPI/AudioAPI ^-^ twitter@r0mk1n 2016'
        },
        press: {
            text    : 'press SPACE to play',
            font    : '16px Tahoma, Geneva, sans-serif',
        },
        bottom: {
            font    : '12px Tahoma, Geneva, sans-serif',
            text    : 'ANYWHERE: 1-2 cycle theme, M - toggle music | IN GAME: WASD or cursor keys - move, SPACE - pause'
        },
        blinkTimeout    : 400
    },

    // game
    game: {
        pause: {
            font    : '48px Tahoma, Geneva, sans-serif',
            text    : '-=paused=-'
        },
        pause_sub: {
            font    : '12px Tahoma, Geneva, sans-serif',
            text    : 'press SPACE to resume'
        },
        game_over: {
            font    : '48px Tahoma, Geneva, sans-serif',
            text    : '-=game over=-'
        },
        game_over_sub: {
            font    : '12px Tahoma, Geneva, sans-serif',
            text    : 'press SPACE to restart'
        },

        score: {
            font    : '14px Tahoma, Geneva, sans-serif',
            text    : 'SCORE:'
        }
    },

    // game settings ///////////////////////////////////////////////////////////////////////////////////////////////////

    // initial food count
    default_food_count: 10,

    // initial game speed
    default_game_speed: 200,

    // speed by length dependency
    speed_dy_length: [
        {max_length: 1,     speed: 200 },
        {max_length: 5,     speed: 180 },
        {max_length: 10,    speed: 170 },
        {max_length: 20,    speed: 160 },
        {max_length: 30,    speed: 140 },
        {max_length: 50,    speed: 120 },
        {max_length: 100,   speed: 100 },
        {max_length: 150,   speed: 90 },
        {max_length: 200,   speed: 80 },
        {max_length: 400,   speed: 70 },
        {max_length: 600,   speed: 60 },
        {max_length: 1000,  speed: 50 },
        {max_length: 2000,  speed: 40 },
        {max_length: 3000,  speed: 30 },
        {max_length: 4000,  speed: 20 },
        {max_length: 100000,  speed: 10 }
    ],

    // score points per one food item
    score_points_per_food: 5,

    // hide action (temporary)
    hideAction:  "blur(5px) sepia(50%)"
};