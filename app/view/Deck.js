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
                    '<canvas id="wave-{deckType}" data-decktype="{deckType}" width="500" height="100"></canvas>',
                '</div>',
                '<div class="pitch-amount"></div>',
                '<div class="track-title"></div>',
                '<div class="deck-buttons">',
                    '<div class="deck-button metal radial play"><div class="play-icon"></div></div>',
                    '<div class="deck-button metal radial cue">CUE</div>',
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
        me.initWaveSurfer();
    },
    initWaveSurfer : function() {
         var me         = this,
            element    = me.element,
            canvas     = element.down('canvas').dom,
            cursor     = element.down('.cursor').dom,
            waveSurfer = Object.create(WaveSurfer);

        waveSurfer.init({
            canvas : canvas,
            cursor : cursor,
            color  : '#EFD78F'
        });

        waveSurfer.bindDragNDrop(canvas, me);
        this.setWaveSurfer(waveSurfer);
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
            cueButton  = evtObj.getTarget('.cue');

        playButton && me.playPause();
        cueButton  && me.cue();
    },
    playPause : function () {
        this.getWaveSurfer().playPause();
    },
    cue      : function () {
        var me         = this,
            waveSurfer = me.getWaveSurfer(),
            backend    = waveSurfer.backend,
            cuePosition;

        cuePosition = me.getCuePosition();

        if (!cuePosition || backend.paused) {
            cuePosition = backend.getCurrentTime();
        }

        backend.play(cuePosition);

        me.setCuePosition(cuePosition);
    },
    loadSong : function (trackName) {
        this.getWaveSurfer().loadFromFs(trackName);
        this.setTrackTitle(trackName);
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