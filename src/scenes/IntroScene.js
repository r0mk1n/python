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