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