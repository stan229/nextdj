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
        trackTitle       : null,
        pitchOffset      : null,
        cuePosition      : null,
        tpl              : ''.concat(
            '<div class="deck">',
                '<div class="deck-header">{deckType}</div>',
                '<div class="timeline">',
                    '<div class="dragdealer pitch">',
                        '<div class="pitch-bar handle"></div>',
                    '</div>',
                    '<div class="cursor {deckType}" id="wave-cursor-{deckType}"></div>',
                    '<canvas id="wave-{deckType}" width="500" height="100"></canvas>',
                '</div>',
                '<div class="pitch-amount"></div>',
                '<div class="track-title"></div>',
                '<div class="deck-buttons">',
                    '<div class="deck-button metal radial play">P</div>',
                    '<div class="deck-button metal radial cue">C</div>',
                '</div>',
            '</div>'
        )
    },
    initialize : function () {
        var me = this;
        me.setData({
            deckType   : me.getDeckType()
        });
        me.callParent();

        me.on({
            painted : me.onPainted,
            scope   : me
        });

        me.element.on({
            tap   : me.onTap,
            scope : me
        });
        me.loadSong();
    },
    onPainted    : function() {
        var me         = this,
            element    = me.element,
            pitchFader = element.down('.dragdealer.pitch').dom,
            dragDealer;


        dragDealer = new Dragdealer(pitchFader, {
            horizontal        : false,
            vertical          : true,
            y                 : 0.5,
            slide             : false,
            steps             : 200,
            snap              : false,
            animationCallback : Ext.bind(me.onFaderDrag, me)
        });

    },
    onFaderDrag : function(x, y) {
        var baseRate     = 0.5 - y,
            pitchOffset  = baseRate.toFixed(2) * 2 * 10,
            newRate      = 1 - (pitchOffset / 100);
            backend      = this.getWaveSurfer().backend;
        if(backend.source) {
            backend.source.playbackRate.value = newRate;
            backend.startPlaybackRate = null;
        } else {
            backend.startPlaybackRate = newRate;
        }
        this.setPitchOffset(pitchOffset);
    },
    onTap : function (evtObj) {
        var me         = this,
            playButton = evtObj.getTarget('.play'),
            cueButton  = evtObj.getTarget('.cue'),
            waveSurfer = me.getWaveSurfer(),
            backend    = waveSurfer.backend,
            cuePosition;

        if (playButton) {
            waveSurfer.playPause();
        }
        if (cueButton) {
            cuePosition = me.getCuePosition();

            if (!cuePosition || backend.paused) {
                cuePosition = backend.getCurrentTime();
            }

            backend.play(cuePosition);

            me.setCuePosition(cuePosition);

        }
    },
    loadSong : function () {
        var me         = this,
            element    = me.element,
            canvas     = element.down('canvas').dom,
            cursor     = element.down('.cursor').dom,
            waveSurfer = Object.create(WaveSurfer),
            songSrc    = me.getDeckType() === "B" ? 'song2.mp3' : 'song.mp3';

        waveSurfer.init({
            canvas : canvas,
            cursor : cursor,
            color  : '#2e3047'
        });


        waveSurfer.load(songSrc);


        waveSurfer.bindDragNDrop(canvas, me);
        this.setWaveSurfer(waveSurfer);
        this.setTrackTitle(songSrc);
    },
    applyTrackTitle : function (trackName) {
        this.element.down('.track-title').setHtml(trackName);
    },
    applyPitchOffset : function (pitchOffset) {
        var pitchAmount = 0.0;
        if (pitchOffset > 0) {
            pitchAmount = "-" + pitchOffset.toFixed(1) + "%";
        } else if (pitchOffset < 0) {
            pitchAmount = "+" + (pitchOffset * -1).toFixed(1) + "%";
        }
        this.element.down('.pitch-amount').setHtml(pitchAmount);
    }
});