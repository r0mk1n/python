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


