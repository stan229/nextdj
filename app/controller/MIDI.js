/**
 * MIDI Controller
 * Handles events from MIDIUtil message handler
 * User: stan229
 * Date: 12/13/12
 * Time: 12:46 AM
 */
Ext.define('NextDJ.controller.MIDI', {
    extend      : 'Ext.app.Controller',
    config      : {
        refs : {
            mixer        : 'mixer',
            trackBrowser : 'trackbrowser'
        }
    },
    init        : function () {
        var me = this;
        // Listen on Application wide events fired from MIDIUtil
        me.getApplication().on({
            setVolume : me.onSetVolume,
            eqChange  : me.onEqChange,
            playPause : me.onPlayPause,
            cue       : me.onCue,
            scope     : me
        });
    },
    /**
     * Set volume on given deck
     * @param deckType
     * @param value
     */
    onSetVolume : function (deckType, value) {
        var mixer    = this.getMixer(),
            fader    = (deckType === "A") ? mixer.getLeftFader() : mixer.getRightFader(),
            newValue = ((100 - value) / 100);

        fader.setValue(0, newValue);
    },
    /**
     * Set Equalizer knob value on particular deck
     * @param eq
     * @param deckType
     * @param value
     */
    onEqChange  : function (eq, deckType, value) {
        var mixer     = this.getMixer();
        mixer.setEQValue(deckType, eq, value - 20);
    },
    /**
     * Play/Pause on given deck
     * @param deckType
     * @param value
     */
    onPlayPause : function (deckType, value) {
        if (value > 0) {
            var deck = Ext.ComponentQuery.query('deck[deckType="' + deckType + '"]')[0];
            deck.playPause();
        }
    },
    /**
     * Cue on particular deck
     * @param deckType
     * @param value
     */
    onCue       : function (deckType, value) {
        if (value > 0) {
            var deck = Ext.ComponentQuery.query('deck[deckType="' + deckType + '"]')[0];
            deck.cue();
        }
    }


});
