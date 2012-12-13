/**
 * Created with JetBrains WebStorm.
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
        me.getApplication().on({
            setVolume : me.onSetVolume,
            eqChange  : me.onEqChange,
            playPause : me.onPlayPause,
            cue       : me.onCue,
            scope     : me
        });
    },
    onSetVolume : function (deckType, value) {
        var mixer    = this.getMixer(),
            fader    = (deckType === "A") ? mixer.getLeftFader() : mixer.getRightFader(),
            newValue = ((100 - value) / 100);

        fader.setValue(0, newValue);
    },
    onEqChange  : function (eq, deckType, value) {
        var mixer     = this.getMixer();
        mixer.setEQValue(deckType, eq, value - 20);
    },
    onPlayPause : function (deckType, value) {
        if (value > 0) {
            var deck = Ext.ComponentQuery.query('deck[deckType="' + deckType + '"]')[0];
            deck.playPause();
        }
    },
    onCue       : function (deckType, value) {
        if (value > 0) {
            var deck = Ext.ComponentQuery.query('deck[deckType="' + deckType + '"]')[0];
            deck.cue();
        }
    }


});
