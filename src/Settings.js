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