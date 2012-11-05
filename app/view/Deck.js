/**
 * Created with JetBrains WebStorm.
 * User: stan229
 * Date: 10/10/12
 * Time: 10:57 AM
 */
Ext.define("NextDJ.view.Deck", {
    extend : 'Ext.Component',
    xtype  : 'deck',
    config : {
        cls              : 'deck-component',
        deckType         : null,
        styleHtmlContent : true,
        waveSurfer       : null,
        tpl              : ''.concat(
            '<div class="deck">',
                '<h3 class="deck-header">{deckType}</h3>',
                '<div class="track-info">',
                    '<div class="track-title">{trackTitle}</div>',
                '</div>',
                '<div class="timeline">',
                    '<div class="cursor {deckType}" id="wave-cursor-{deckType}"></div>',
                    '<canvas id="wave-{deckType}" width="600" height="100"></canvas>',
                '</div>',
                '<div class="deck-buttons">',
                    '<div class="deck-button metal radial play">P</div>',
                    '<div class="deck-button metal radial cue">C</div>',
                '</div>',
                '<div class="deck-progress">',
                '</div>',
            '</div>'
        )
    },
    initialize : function () {
        var me = this;
        me.setData({
            deckType : me.getDeckType()
        });
        me.callParent();
        me.element.on({
            tap   : me.onTap,
            scope : me
        });
        me.loadSong();
    },
    onTap : function (evtObj) {
        var playButton = evtObj.getTarget('.play');

        if (playButton) {
            this.getWaveSurfer().playPause();
        }
    },
    loadSong : function () {
        var me         = this,
            element    = me.element,
            canvas     = element.down('canvas').dom,
            cursor     = element.down('.cursor').dom,
            waveSurfer = Object.create(WaveSurfer);

        waveSurfer.init({
            canvas : canvas,
            cursor : cursor,
            color  : '#2e3047'
        });

        if (this.getDeckType() == "B") {
            waveSurfer.load('song2.mp3');
        } else {
            waveSurfer.load('song.mp3');
        }

        waveSurfer.bindDragNDrop(canvas);
        this.setWaveSurfer(waveSurfer);
    }
});