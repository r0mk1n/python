/**
 * Namespace definitions
 */

var r0mk1n = {};
r0mk1n.scenes = {};

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
/**
 * Settings class
 * @author r0mk1n
 */

r0mk1n.Settings = function( options ) {
    /**
     * Consts handler
     * @type {null}
     */
    var consts          = null;

    /**
     * Storage key
     * @type {null}
     */
    var storageKey      = null;

    /**
     * Local storage object
     * @type {null}
     */
    var storage         = null;

    /**
     * Data object for storis settings
     * @type {{}}
     */
    var data            = {};

    /**
     * Setting value to settings
     * @param key
     * @param value
     * @return none
     */
    this.set = function( key, value ) {
        data[key] = value;
        write();
    };

    /**
     * Getting value from settings
     * @param key
     * @param value
     * @return mixed
     */
    this.get = function( key ) {
        return typeof data[key] !== "undefined" ? data[key] : null;
    };

    /**
     * Clean storage
     * @param none
     * @return none
     */
    this.clean = function() {
        if ( storage ) {
            storage.removeItem( storageKey );
        }
    };

    /**
     * Constructor
     * @param options
     */
    var constructor = function( options ) {
        consts = options.consts;

        storageKey = consts.storageKey;
        storage = window.localStorage;

        read();
    };

    /**
     * Red settings from storage
     * @access private
     */
    var read = function() {
        if ( storage ) {
            data = JSON.parse( storage.getItem( storageKey ) ) || {};
        }
    };

    /**
     * Write settings to storage
     * @access private
     */
    var write = function() {
        if ( storage ) {
            storage.setItem( storageKey, JSON.stringify( data ) );
        }
    };

    /**
     * Initialize class
     */
    constructor( options );
};
/**
 * Palette class
 * @author r0mk1n
 */
r0mk1n.Palette = function( options ) {
    /**
     * Handler for access from private methods
     * @type {r0mk1n.Palette}
     */
    var self = this;

    /**
     * Low color
     * @type {int}
     * @access public
     */
    this.low                = null;

    /**
     * Med color
     * @type {int}
     * @access public
     */
    this.med                = null;

    /**
     * High color
     * @type {int}
     * @access public
     */
    this.high               = null;

    /**
     * Consts handler
     * @type {Class}
     * @access private
     */
    var consts                  = null;

    /**
     * Settings handler
     * @type {Class}
     * @access private
     */
    var settings                = null;

    /**
     * Index of current palette
     * @type {int}
     * @access private
     */
    var currentPaletteIndex     = 0;

    /**
     * Switch to next palette
     * @param none
     * @return none
     * @access public
     */
    this.next = function() {
        if ( currentPaletteIndex < consts.palettes.length ) {
            currentPaletteIndex++;
        } else {
            currentPaletteIndex = 0;
        }
        this.setIndex( currentPaletteIndex );
    };

    /**
     * Switch to previous palette
     * @param none
     * @access public
     * @return none
     */
    this.prev = function() {
        if ( currentPaletteIndex > 0 ) {
            currentPaletteIndex--;
        } else {
            currentPaletteIndex = consts.palettes.length - 1;
        }
        this.setIndex( currentPaletteIndex );
    };

    /**
     * Set current palette index
     * @param {int} index
     * @return none
     * @access public
     */
    this.setIndex = function( index ) {
        if ( typeof index !== "undefined" ) {
            if( index >= 0 && index <= consts.palettes.length - 1 ) {
                currentPaletteIndex = index;
            } else {
                currentPaletteIndex = 0;
            }
        } else {
            currentPaletteIndex = 0;
        }

        settings.set( 'currentPaletteIndex', currentPaletteIndex );

        self.low = consts.palettes[currentPaletteIndex].low;
        self.med = consts.palettes[currentPaletteIndex].med;
        self.high = consts.palettes[currentPaletteIndex].high;
    };

    /**
     * Get current pagette index
     * @param none
     * @returns {int}
     * @access public
     */
    this.getIndex = function() {
        return currentPaletteIndex;
    };

    /**
     * Constructor
     * @param options
     */
    var constructor = function( options ) {
        consts = options.consts;
        settings = options.settings;

        currentPaletteIndex = settings.get( 'currentPaletteIndex' ) || 0;

        self.setIndex( currentPaletteIndex );
    };

    // calling constructor
    constructor( options );
};
/**
 * Class for manage music
 * @author r0mk1n
 */
r0mk1n.Music = function( options ) {
    /**
     * Audio element
     * @type {null}
     */
    var audio           = null;

    /**
     * Stream URL
     * @type {null}
     */
    var stream          = null;

    /**
     * Is muted flag
     * @type {boolean}
     */
    var is_muted        = false;

    /**
     * Handler for settings class
     * @type {Class}
     */
    var settings        = null;

    /**
     * Toggle music
     * @param none
     * @return none
     */
    this.toggle = function() {
        is_muted = !is_muted;
        settings.set( 'is_music_muted', is_muted );
        if ( is_muted ) {
            audio.pause();
        } else {
            audio.play();
        }
    };

    var constructor = function( options ) {
        stream = options.stream;
        settings = options.settings;

        audio = document.createElement('audio');
        var placeholder = document.getElementsByTagName('body')[0].appendChild( audio );

        audio.src = stream;

        is_muted = settings.get( 'is_music_muted' ) ? true : false;

        if ( !is_muted ) {
            audio.play();
        }
    };

    constructor( options );
};
/**
 * Intro scene
 * @author r0mk1n
 */
r0mk1n.scenes.IntroScene = function( options ) {
    /**
     * Handler for access class methods from private methods
     * @type {r0mk1n.scenes.IntroScene}
     */
    var self            = this;

    /**
     * Rendering context
     * @type {canvasContext}
     */
    var ctx             = null;

    /**
     * Palette class handler
     * @type {Class}
     */
    var palette         = null;

    /**
     * Consts class handler
     * @type {Class}
     */
    var consts          = null;

    /**
     * Showed flag
     * @type {boolean}
     * @access private
     */
    var showed          = false;

    /**
     * Blink/animation handler
     * @type {number}
     * @access internal|private
     */
    var blink_timeout   = -1;

    /**
     * Show scene
     * @param {function} callback - calling when showing complete
     * @return none
     */
    this.show = function( callback ) {
        showed = true;
        //if ( consts.hideAction ) {
        //    ctx.canvas.style.webkitFilter = 'none';
        //}
        clear();

        this.redraw();
    };

    /**
     * Hide scene
     * @param {function} callback - calling when hiding complete
     * @return none
     */
    this.hide = function( callback ) {
        showed = false;
        //if ( consts.hideAction ) {
        //    ctx.canvas.style.webkitFilter = consts.hideAction;
        //}
        clearInterval( blink_timeout );
    };

    /**
     * Redraw content
     * @param none
     * @return none
     * @access public
     */
    this.redraw = function() {
        // background
        ctx.fillStyle = palette.low;
        ctx.fillRect( 0, 0, ctx.canvas.width, ctx.canvas.height );

        // title
        ctx.font = consts.intro.title.font;
        var __measurment = ctx.measureText( consts.intro.title.text );
        ctx.fillStyle = palette.high;
        ctx.fillText( consts.intro.title.text, 50 - 1, ctx.canvas.height / 2.0 - 11 );

        ctx.fillStyle = palette.low;
        ctx.fillText(consts.intro.title.text, 50 + 1, ctx.canvas.height / 2.0 - 9 );

        ctx.fillStyle = palette.med;
        ctx.fillText( consts.intro.title.text, 50, ctx.canvas.height / 2.0 - 10 );


        // line
        ctx.strokeStyle = palette.med;
        ctx.lineWidth = 1;
        ctx.setLineDash([1, 2]);
        ctx.moveTo(50, ctx.canvas.height / 2.0 + 5 );
        ctx.lineTo( ctx.canvas.width - 50, ctx.canvas.height / 2.0 + 5);
        ctx.stroke();

        // subtitle
        ctx.fillStyle = palette.med;
        ctx.font = consts.intro.subtitle.font;
        __measurment = ctx.measureText( consts.intro.subtitle.text );
        ctx.fillText( consts.intro.subtitle.text, ctx.canvas.width - ( __measurment.width + 50 ), ctx.canvas.height / 2.0 + 20 );

        // bottom
        ctx.fillStyle = palette.med;
        ctx.font = consts.intro.bottom.font;
        __measurment = ctx.measureText( consts.intro.bottom.text );
        ctx.fillText( consts.intro.bottom.text, ( ctx.canvas.width / 2.0 - __measurment.width / 2.0 ), ctx.canvas.height - 15 );

        // press (blinking text animation)
        ctx.font = consts.intro.press.font;
        __measurment = ctx.measureText( consts.intro.press.text );

        if ( blink_timeout ) {
            clearInterval( blink_timeout );
        }

        var is_cleared = true;
        blink_timeout = setInterval(function() {
            if ( showed ) {
                if ( is_cleared ) {
                    // draw
                    ctx.fillStyle = palette.high;
                    ctx.fillText( consts.intro.press.text, ( ctx.canvas.width / 2.0 - __measurment.width / 2.0 ), ctx.canvas.height - 100 );
                } else {
                    // clear
                    ctx.fillStyle = palette.low;
                    ctx.fillRect( 0, ctx.canvas.height - 150, ctx.canvas.width, 100 );
                }
                is_cleared = !is_cleared;
            } else {
                clearInterval( blink_timeout );
            }
        }, consts.intro.blinkTimeout );
    };

    /**
     * Clear canvas
     * @param none
     * @returns none
     * @access private
     */
    var clear = function() {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height );
    };

    /**
     * Constructor
     * @param options
     */
    var constructor = function( options ) {
        ctx = options.ctx;
        palette = options.palette;
        consts = options.consts;
    };

    /**
     * Calling constructor
     */
    constructor( options );
};
/**
 * Game scene
 * @author r0mk1n
 * @property r0mk1n.Consts consts
 */
r0mk1n.scenes.GameScene = function( options ) {
    /**
     * Handler for access class methods from private methods
     * @type {r0mk1n.scenes.GameScene}
     */
    var self            = this;

    /**
     * Rendering context
     * @type {canvasContext}
     */
    var ctx             = null;

    /**
     * Palette class handler
     * @type {Class}
     */
    var palette         = null;

    /**
     * Consts class handler
     * @type {Class}
     */
    var consts          = null;

    /**
     * Showed flag
     * @type {boolean}
     * @access private
     */
    var showed          = false;

    /**
     * is_pause flag
     * @type {boolean}
     */
    var is_pause           = false;

    /**
     * Current direction
     * @type {string}
     */
    var direction       = 'l';

    /**
     * Pyphon body array
     * @type {Array}
     */
    var python          = [];

    /**
     * Food array
     * @type {Array}
     */
    var food            = [];

    /**
     * Initial count of food
     * @type {number}
     */
    var food_count      = 0;

    /**
     * Redraw interval
     * @type {number}
     */
    var redraw_interval = -1;

    /**
     * Game tick timer
     * @type {number}
     */
    var game_speed = 400;

    /**
     * Tick timeout interval
     * @type {number}
     */
    var game_timeout = -1;

    /**
     * Pre-calc rendering vars
     * @type {number}
     */
    var cell_x_size = 0,
        cell_y_size = 0,
        cell_x_half_size = 0,
        cell_y_half_size = 0,
        CIRCLE = 2 * Math.PI;

    /**
     * Game over flag
     * @type {boolean}
     */
    var is_game_over        = false;

    /**
     * Score counter
     * @type {number}
     */
    var score               = 0;

    /**
     * Environment objects
     */
    var environment_objects = [];

    // public methods //////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * Show scene
     * @param callback
     */
    this.show = function( callback ) {
        clear();
        reset();
        showed = true;

        // generate landscape objects
        generateLandscape();

        // start redrawing screen with 30 FPS
        var fps = Math.floor( 1000 / 30 );
        if ( -1 != redraw_interval ) {
            clearInterval( redraw_interval );
        }

        // start rendering loop
        if ( -1 != redraw_interval ) {
            clearInterval( redraw_interval );
        }
        redraw_interval = setInterval(
            function() {
                self.redraw();
            },
            fps
        );

        // start game loop
        game_timeout = setTimeout(
            function() {
                update();
            },
            game_speed
        );

        if ( typeof callback !== "undefined" ) {
            callback();
        }
    };

    /**
     * Hide scene
     * @param callback
     * @return none
     */
    this.hide = function( callback ) {
        showed = false;

        if ( typeof callback !== "undefined" ) {
            callback();
        }
    };

    /**
     * Redraw scene
     * @param forced - force redraw
     * @return none
     * @access public
     */
    this.redraw = function( forced ) {
        var i, __measurment;

        // background
        ctx.fillStyle = palette.low;
        ctx.fillRect( 0, 0, ctx.canvas.width, ctx.canvas.height );

        if ( is_pause ) {
            //draw pause text
            drawCenteredText( consts.game.pause );
            drawHCenteredText( consts.game.pause_sub, ctx.canvas.height / 2.0 + 30 );
        }

        if ( is_game_over ) {
            // draw game over text
            drawCenteredText( consts.game.game_over );
            drawHCenteredText( consts.game.game_over_sub, ctx.canvas.height / 2.0 + 30 );
        }

        // exit on is_pause
        if ( ( is_pause || is_game_over ) && !forced ) {
            return;
        }

        drawLandscape();

        // render python
        for ( i = 0; i < python.length; i++ ) {
            // body
            ctx.fillStyle = palette.med;
            ctx.fillRect( python[i].x * cell_x_size, python[i].y * cell_y_size, cell_x_size, cell_y_size );

            if ( 0 === i ) {
                // eyes
                if ( -1 != ['l', 'r'].indexOf( direction ) ) {
                    // horizontal moving
                    ctx.beginPath();
                    ctx.fillStyle = palette.low;
                    ctx.ellipse( python[i].x * cell_x_size + cell_x_half_size, python[i].y * cell_y_size + cell_y_half_size / 2.0, cell_x_half_size / 4.0, cell_y_half_size / 4.0, 0, 0, CIRCLE );
                    ctx.ellipse( python[i].x * cell_x_size + cell_x_half_size, python[i].y * cell_y_size + cell_y_half_size + cell_y_half_size / 2.0, cell_x_half_size / 4.0, cell_y_half_size / 4.0, 0, 0, CIRCLE );
                    ctx.fill();
                } else {
                    // vertical moving
                    ctx.beginPath();
                    ctx.fillStyle = palette.low;
                    ctx.ellipse( python[i].x * cell_x_size + cell_x_half_size / 2.0, python[i].y * cell_y_size + cell_y_half_size, cell_x_half_size / 4.0, cell_y_half_size / 4.0, 0, 0, CIRCLE );
                    ctx.ellipse( python[i].x * cell_x_size + cell_x_half_size + cell_x_half_size / 2.0, python[i].y * cell_y_size + cell_y_half_size, cell_x_half_size / 4.0, cell_y_half_size / 4.0, 0, 0, CIRCLE );
                    ctx.fill();
                }
            }
        }

        // drawing food ;)
        for ( i = 0; i < food.length; i++ ) {
            ctx.beginPath();
            ctx.fillStyle = palette.high;

            // body
            ctx.ellipse( food[i].x * cell_x_size + cell_x_half_size, food[i].y * cell_y_size + cell_y_half_size * 1.6, cell_x_half_size, cell_y_half_size / 2.0, 0, 0, CIRCLE );
            ctx.fill();

            // left ear
            ctx.beginPath();
            ctx.ellipse(
                food[i].x * cell_x_size + cell_x_half_size - cell_x_half_size / 2.0,
                food[i].y * cell_y_size + cell_y_half_size - cell_y_half_size / 4.0,
                cell_x_half_size / 3.0,
                cell_y_half_size / 1.4,
                -10, 0, CIRCLE
            );
            ctx.fill();

            // right ear
            ctx.beginPath();
            ctx.ellipse(
                food[i].x * cell_x_size + cell_x_half_size + cell_x_half_size / 2.0,
                food[i].y * cell_y_size + cell_y_half_size - cell_y_half_size / 4.0,
                cell_x_half_size / 3.0,
                cell_y_half_size / 1.4,
                10, 0, CIRCLE
            );
            ctx.fill();

            // left eye
            ctx.fillStyle = palette.low;
            ctx.beginPath();
            ctx.ellipse(
                food[i].x * cell_x_size + cell_x_half_size - cell_x_half_size / 2.4,
                food[i].y * cell_y_size + cell_y_half_size + cell_y_half_size / 1.5,
                cell_x_half_size / 4.0,
                cell_y_half_size / 4.0,
                0, 0, CIRCLE
            );
            ctx.fill();
            // right eye
            ctx.beginPath();
            ctx.ellipse(
                food[i].x * cell_x_size + cell_x_half_size + cell_x_half_size / 2.4,
                food[i].y * cell_y_size + cell_y_half_size + cell_y_half_size / 1.5,
                cell_x_half_size / 4.0,
                cell_y_half_size / 4.0,
                0, 0, CIRCLE
            );
            ctx.fill();
        }

        // score text
        var score_obj = {
            text: consts.game.score.text + ' ' + score.toString(),
            font: consts.game.score.font
        };

        // draw score text
        drawHCenteredText( score_obj, 20 );

        // bottom text
        drawHCenteredText( consts.intro.bottom, ctx.canvas.height - 15 );
    };

    /**
     * Toggle pause mode
     */
    this.togglePause = function() {
        if ( is_game_over ) {
            // restarting
            this.show();
        } else {
            is_pause = !is_pause;
        }
    };

    /**
     * Set moving direction
     * @param value {String}
     */
    this.setDirection = function( value ) {
        // making not possible suicide ;)
        if ( ( 'l' == direction && 'r' != value ) ||
            ( 'r' == direction && 'l' != value ) ||
            ( 'u' == direction && 'd' != value ) ||
            ( 'd' == direction && 'u' != value ) ) {
            direction = value;
        }
    };

    // private methods /////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * Game tick
     * @param none
     * @return none
     */
    var update = function() {
        if ( !is_pause && !is_game_over) {

            // save head
            var movePoint = {
                x: python[0].x,
                y: python[0].y
            };

            // calculate next move point
            switch( direction ) {
                case 'l': {
                    movePoint.x--;
                    break;
                }
                case 'r': {
                    movePoint.x++;
                    break;
                }
                case 'u': {
                    movePoint.y--;
                    break;
                }
                case 'd': {
                    movePoint.y++;
                    break;
                }
            }

            // checking for wall collisions
            if ( movePoint.x < 0 || movePoint.x > consts.cell_x_count || movePoint.y < 0 || movePoint.y > consts.cell_y_count ) {
                is_game_over = true;
                return;
            }

            // checking for eat himself ;)
            if ( -1 != checkBody( movePoint ) ) {
                is_game_over = true;
                return;
            }

            // checking for food in next move point
            var is_food_exists = checkFood( movePoint );
            if ( -1 == is_food_exists ) {
                // food not exists

                // move python body
                for ( var i = python.length - 1; i > 0; i-- ) {
                    python[i].x = python[i-1].x;
                    python[i].y = python[i-1].y;
                }
                // move head
                python[0].x = movePoint.x;
                python[0].y = movePoint.y;
            } else {
                // food exists - increasing python size by food and skip tick
                python.unshift( {x:food[is_food_exists].x, y:food[is_food_exists].y} );
                // remove food
                food.splice( is_food_exists, 1 );
                score += consts.score_points_per_food;
            }

            placeFood();
        }

        updateGameSpeed();

        // call next tick with game_speed delay
        game_timeout = setTimeout(
            function() {
                update();
            },
            game_speed
        );
    };

    /**
     * Drawing centered of the screen text
     * @param text_obj
     */
    var drawCenteredText = function( text_obj ) {
        ctx.font = text_obj.font;
        var __measurment = ctx.measureText( text_obj.text );

        var __x = ctx.canvas.width / 2.0 - __measurment.width / 2.0;
        ctx.fillStyle = palette.high;
        ctx.fillText( text_obj.text, __x - 1, ctx.canvas.height / 2.0 - 11 );

        ctx.fillStyle = palette.low;
        ctx.fillText( text_obj.text, __x + 1, ctx.canvas.height / 2.0 - 9 );

        ctx.fillStyle = palette.med;
        ctx.fillText( text_obj.text, __x, ctx.canvas.height / 2.0 - 10 );
    };

    /**
     * Draw horizontal - centered text
     * @param text_obj
     * @param y
     */
    var drawHCenteredText = function( text_obj, y ) {
        ctx.fillStyle = palette.high;
        ctx.font = text_obj.font;
        var __measurment = ctx.measureText( text_obj.text );
        ctx.fillText( text_obj.text, ( ctx.canvas.width / 2.0 - __measurment.width / 2.0 ), y );
    };

    /**
     * Update current game speed
     * @param none
     * @return none
     * @access private
     */
    var updateGameSpeed = function() {
        var tmp_speed = game_speed,
            length = python.length;

        for ( var i = 0; i < consts.speed_dy_length.length; i++ ) {
            if ( length >= consts.speed_dy_length[i].max_length ) {
                tmp_speed = consts.speed_dy_length[i].speed;
            }
        }
        game_speed = tmp_speed;
    };

    /**
     * Place food into gamefield
     * @param none
     * @return none
     * @access private
     */
    var placeFood = function() {
        var count = food_count - food.length,
            tmpFood;

        for ( var i = 0; i < count; i++ ) {
            // we cant place food to cell with exiting food and on cell where is python body located in
            do {
                tmpFood = { x: randomInt( 0, consts.cell_x_count ), y: randomInt( 0, consts.cell_y_count )};
            } while ( -1 != checkFood( tmpFood ) && -1 != checkBody( tmpFood ) );
            food.push( tmpFood );
        }
    };

    /**
     * Checking for cell in food array
     * @param item
     * @return {number}
     * @access private
     */
    var checkFood = function( item ) {
        var result = -1;
        for ( var i = 0; i < food.length; i++ ) {
            if ( food[i].x == item.x && food[i].y == item.y ) {
                result = i;
                break;
            }
        }
        return result;
    };

    /**
     * Checking for cell in python array
     * @param item
     * @return {number}
     * @access private
     */
    var checkBody = function( item ) {
        var result = -1;
        for ( var i = 0; i < python.length; i++ ) {
            if ( python[i].x == item.x && python[i].y == item.y ) {
                result = i;
                break;
            }
        }
        return result;
    };

    /**
     * Generate random int number between min and max
     * @param min
     * @param max
     * @returns {number}
     * @access private
     */
    var randomInt = function( min, max ) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    /**
     * Reseting gameplay settings
     */
    var reset = function() {
        var center_x = Math.round( consts.cell_x_count / 2.0),
            center_y = Math.round( consts.cell_y_count / 2.0);

        python = [
            // move to the center of the screen
            { x: center_x, y: center_y },
            // and add one cell at left
            { x: center_x - 1, y: center_y }
        ];

        // setting direction to right
        direction = 'r';

        // deleting food
        food = [];

        // reset food count
        food_count = consts.default_food_count;

        // reset game speed
        game_speed = consts.default_game_speed;

        // reset game over flag
        is_game_over = false;

        // reset score counter
        score = 0;
    };

    /**
     * Generate landscape objects
     * @param none
     * @return none
     * @access private
     */
    var generateLandscape = function() {
        environment_objects = [];
        var count = ( consts.cell_x_count * consts.cell_y_count ) * consts.environment_percent / 100;
        for ( var i = 0; i < count; i++ ) {
            environment_objects.push(
                {
                    // use full width
                    x: randomInt( 0, consts.cell_x_count ),
                    // use part of height for prevent drawing beyond texts
                    y: randomInt( 5, consts.cell_y_count - 5 ),
                    // color of item
                    color: randomInt( 1, 2 ),
                    // type of item
                    type: randomInt( 0, 1 )
                }
            );
        }
    };

    /**
     * Draw landscape on gamefield
     * @param none
     * @return none
     * @access private
     */
    var drawLandscape = function() {
        ctx.setLineDash([]);
        for( var i = 0; i < environment_objects.length; i++ ) {
            switch ( environment_objects[i].color ) {
                case 1: {
                    ctx.strokeStyle = palette.med;
                    break;
                }
                case 2: {
                    ctx.strokeStyle = palette.high;
                    break;
                }
            }
            ctx.beginPath();

            switch( environment_objects[i].type ) {
                case 0: {
                    drawEnvItem0( environment_objects[i].x * cell_x_size, environment_objects[i].y * cell_y_size );
                    break;
                }
                case 1: {
                    drawEnvItem1( environment_objects[i].x * cell_x_size, environment_objects[i].y * cell_y_size );
                    break;
                }
            }
            ctx.stroke();
        }
    };

    // env drawing functions
    var drawEnvItem0 = function( x, y ) {
        ctx.moveTo( x + cell_x_half_size, y + cell_y_size );
        ctx.lineTo( x + cell_x_half_size - randomInt( 0, 1 ), y + cell_y_half_size - randomInt( 0, 2 ) );
        ctx.moveTo( x + cell_x_half_size, y + cell_y_size );
        ctx.lineTo( x + cell_x_half_size - randomInt( 2, 3 ), y + cell_y_half_size - randomInt( 0, 2 ) );
        ctx.moveTo( x + cell_x_half_size, y + cell_y_size );
        ctx.lineTo( x + cell_x_half_size + randomInt( 2, 3 ), y + cell_y_half_size - randomInt( 0, 1 ) );
    };

    var drawEnvItem1 = function( x, y ) {
        ctx.moveTo( x + cell_x_half_size, y + cell_y_size );
        ctx.lineTo( x + cell_x_half_size - randomInt( 0, 1 ), y + cell_y_half_size - randomInt( 1, 2 ) );
        ctx.moveTo( x + cell_x_half_size, y + cell_y_size );
        ctx.lineTo( x + cell_x_half_size - randomInt( 1, 2 ), y + cell_y_half_size - randomInt( 1, 2 ) );
        ctx.moveTo( x + cell_x_half_size, y + cell_y_size );
        ctx.lineTo( x + cell_x_half_size + randomInt( 3, 4 ), y + cell_y_half_size - randomInt( 1, 2 ) );
    };

    /**
     * Clear screen
     */
    var clear = function() {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height );
    };

    /**
     * Constructor
     * @param options
     */
    var constructor = function( options ) {
        ctx = options.ctx;
        palette = options.palette;
        consts = options.consts;

        // pre-calculate some values
        cell_x_size = ctx.canvas.width / consts.cell_x_count;
        cell_y_size = ctx.canvas.height / consts.cell_y_count;

        cell_x_half_size = cell_x_size / 2.0;
        cell_y_half_size = cell_y_size / 2.0;
    };

    /**
     * calling constructor
     */
    constructor( options );
};
/**
 * Main app file
 * @author r0mk1n
 */

r0mk1n.PythonApp = function( options ) {
    /**
     * Variable for access class instance from private methods
     * @type {r0mk1n.PythonApp}
     */
    var self = this;

    /**
     * Consts var
     */
    var consts = r0mk1n.Consts;

    /**
     * Settings var
     * @type {r0mk1n.Settings}
     */
    var settings = new r0mk1n.Settings({
        consts: consts
    });

    /**
     * Palette
     * @type {null}
     */
    var palette = null;

    /**
     * Placeholder for canvas
     * @type {null}
     */
    var placeholder = null;

    /**
     * Drawing context
     * @type {null}
     */
    var ctx = null;

    /**
     * Scenes object
     * @type {{}}
     */
    var scenes = {};

    /**
     * App state
     * @type {string}
     */
    var state = 'intro';

    /**
     * Current scene
     * @type {Object}
     */
    var currentScene = null;

    /**
     * Music class
     * @type {null}
     */
    var music = null;

    /**
     * Application constructor
     */
    var constructor = function( options ) {
        if ( typeof options.placeholder !== "undefined" ) {
            placeholder = document.getElementById( options.placeholder );
        } else {
            placeholder = document.getElementsByTagName( 'body' )[0];
        }

        if ( isCanvasSupported() ) {
            var element = document.createElement('canvas');
            placeholder.appendChild( element );

            // setting width and height for canvas element
            element.width = parseInt( placeholder.style.width );
            element.height = parseInt( placeholder.style.height );

            // getting context
            ctx = element.getContext('2d');

            // create music
            music = new r0mk1n.Music({
                stream      : consts.audioUrl,
                settings    : settings
            });

            // creating palette
            palette = new r0mk1n.Palette({
                consts      : consts,
                settings    : settings
            });

            // ... and create scenes
            scenes.intro = new r0mk1n.scenes.IntroScene({
                consts      : consts,
                palette     : palette,
                ctx         : ctx
            });

            scenes.game = new r0mk1n.scenes.GameScene({
                consts      : consts,
                palette     : palette,
                ctx         : ctx
            });

            currentScene = scenes.intro;
            currentScene.show();

            // global keypress handler
            window.onkeydown = onKeydown;
        } else {
            alert( 'Sorry, this app working in modern browsers only.' );
        }
    };

    /**
     * Global keypress handler
     * @param event
     */
    var onKeydown = function( event ) {
        // global

        // 1
        if ( 49 == event.keyCode ) {
            palette.prev();
            // force redraw
            currentScene.redraw( true );
        }
        // 2
        if ( 50 == event.keyCode ) {
            palette.next();
            // force redraw
            currentScene.redraw( true );
        }
        // M
        if ( 77 == event.keyCode ) {
            music.toggle();
        }

        // space
        if ( 32 == event.keyCode ) {
            if ( 'intro' == state ) {
                // switch to game
                currentScene.hide();
                currentScene = scenes.game;
                setTimeout(
                    function() {
                        currentScene.show();
                        state = 'game';
                    },
                    500
                );
            } else if( 'game' == state ) {
                currentScene.togglePause();
            }
            // prevent scroll down page on pressing space
            event.preventDefault();
        }

        // isolate this keyCodes for game-mode only
        if( 'game' == state ) {
            // W | CursorUp
            if ( -1 != [87, 38].indexOf( event.keyCode ) ) {
                currentScene.setDirection( 'u' );
            }
            // D | CursorDown
            if ( -1 != [83, 40].indexOf( event.keyCode ) ) {
                currentScene.setDirection( 'd' );
            }
            // A | CursorLeft
            if ( -1 != [65, 37].indexOf( event.keyCode ) ) {
                currentScene.setDirection( 'l' );
            }
            // D | CursorRight
            if ( -1 != [68, 39].indexOf( event.keyCode ) ) {
                currentScene.setDirection( 'r' );
            }
            if ( -1 != [37,38,39,49].indexOf( event.keyCode ) ) {
                // prevent for moving screen by clicking cursor keys if gamearea size larger when window viewport
                event.preventDefault();
            }
        }

    };

    /**
     * Checking for canvas support
     * @returns {boolean}
     */
    var isCanvasSupported = function(){
        var elem = document.createElement('canvas');
        return !!(elem.getContext && elem.getContext('2d'));
    };

    /**
     * Calling constructor
     */
    constructor( options );
};


