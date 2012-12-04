/**
 * Created with JetBrains WebStorm.
 * User: stan229
 * Date: 10/10/12
 * Time: 10:43 AM
 */

Ext.define('NextDJ.controller.Main', {
    extend : 'Ext.app.Controller',
    config : {
        models  : [
        ],
        stores  : [
        ],
        views   : [
            'Main'
        ],
        refs    : {},
        control : {
            'mixer' : {
                setVolume : 'setVolume'
            }
        }
    },
    launch : function () {
        Ext.Viewport.add({
            xtype : 'main'
        });
    },
    setVolume : function(volume, deckType) {
        var deck    = Ext.ComponentQuery.query('deck[deckType="' + deckType + '"]')[0],
            backend = deck.getWaveSurfer().backend,
            newVol  = -1 + volume;

        backend.startVolume = newVol;
        if(backend.gainNode) {
            backend.gainNode.gain.value = newVol;
        }
    }
});