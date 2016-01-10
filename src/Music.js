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