/**
 * Created with JetBrains WebStorm.
 * User: stan229
 * Date: 12/10/12
 * Time: 8:56 PM
 */
Ext.define('NextDJ.view.TrackBrowser', {
    extend       : 'Ext.Container',
    xtype        : 'trackbrowser',
    requires     : ['NextDJ.view.DeckChooserOverlay'],
    config       : {
        cls              : "track-browser-cmp",
        scrollable       : {
            direction : 'vertical'
        },
        styleHtmlContent : true,
        tpl              : ''.concat(
            '<div class="track-browser">',
                '<tpl for=".">',
                    '<div class="track">',
                        '<div class="track-name">{.}</div>',
                        '<div class="deck-chooser">',
                            '<div class="deck-button deck-a" data-track="{.}" data-decktype="A">A</div>',
                            '<div class="deck-button deck-b" data-track="{.}" data-decktype="B">B</div>',
                        '</div>',
                    '</div>',
                '</tpl>',
            '</div>'
        ),
        items            : [
            {
                xtype  : 'component',
                cls    : 'drop-tracks',
                html   : '<div class="drop-tracks-inner">Drop Tracks in Here</div>',
                docked : 'top'
            }
        ]
    },
    initialize   : function () {
        var me = this;
        me.element.on({
            tap        : me.onTap,
            touchstart : me.onTouchStart,
            touchend   : me.onTouchEnd,
            scope      : me
        });
        me.element.dom.addEventListener('drop', Ext.bind(me.onDrop, me), false);
        me.callParent();
    },
    onDrop       : function (evtObj) {
        evtObj.preventDefault();
        var file = evtObj.dataTransfer.files[0];
        this.fireEvent('addTrack', file);
    },
    onDragEnd    : function (evtObj) {
        evtObj.preventDefault();
    },
    onTouchStart : function (evtObj) {
        var target = evtObj.getTarget();
        if (target) {
            Ext.fly(target).addCls('pressed');
        }
    },
    onTouchEnd   : function (evtObj) {
        var target = evtObj.getTarget();
        if (target) {
            Ext.fly(target).removeCls('tapped');
        }
    },
    onTap        : function (evtObj) {
        var track = evtObj.getTarget('.deck-button', null, true),
            dataset;
        if (track) {
            dataset = track.dom.dataset;
            this.fireEvent('loadTrack', dataset.track, dataset.decktype);
        }
    }
});