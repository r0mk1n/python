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