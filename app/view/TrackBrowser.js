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
        scroll           : {
            direction : 'vertical'
        },
        styleHtmlContent : true,
        tpl              : ''.concat(
            '<div class="track-browser">',
               '<div class="drop-tracks">Please Drop Tracks in Here</div>',
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
        )
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
        var me = this,
            fs = NextDJ.fileSystem,
            file = evtObj.dataTransfer.files[0];

        fs.root.getFile(file.name, {create : true, exclusive : true}, function (fileEntry) {
            fileEntry.createWriter(function (fileWriter) {
                fileWriter.write(file);
            }, function (writerError) {
                console.log('write err', writerError);
            });

        }, function (fileEntryError) {
            console.log('err', fileEntryError);
        });

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