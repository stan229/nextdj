/**
 * Created with JetBrains WebStorm.
 * User: stan229
 * Date: 10/10/12
 * Time: 10:43 AM
 */

Ext.define('NextDJ.controller.Main', {
    extend         : 'Ext.app.Controller',
    config         : {
        models  : [
        ],
        stores  : [
        ],
        views   : [
            'Main'
        ],
        refs    : {
            mixer        : 'mixer',
            trackBrowser : 'trackbrowser'
        },
        control : {
            'mixer'        : {
                setVolume : 'onSetVolume',
                eqChange  : 'onEqChange'
            },
            'trackbrowser' : {
                addTrack  : 'onAddTrack',
                loadTrack : 'onLoadTrack'
            }
        }
    },
    launch         : function () {
        var me = this;
        me.getApplication().on({
            addTrack  : me.onAddTrack,
            scope     : me
        });
        Ext.Viewport.add({
            xtype : 'main'
        });
        me.initFileSystem();
        MIDIUtil.initMIDIMap();
    },
    initFileSystem : function () {
        var me = this,
            onInitFs = Ext.bind(me.onInitFs, me),
            onInitFsError = Ext.bind(me.onInitFsError, me);

        window.webkitStorageInfo.requestQuota(window.PERSISTENT, 256 * 1024 * 1024, function (grantedBytes) {
            window.webkitRequestFileSystem(window.PERSISTENT, grantedBytes, onInitFs, onInitFsError);
        }, function (e) {
            console.log('Error', e);
        });
    },
    onInitFs       : function (fs) {
        this.getApplication().fileSystem = fs;
        this.loadTracks();
    },
    onInitFsError  : function (e) {
        var msg = '';

        switch (e.code) {
            case FileError.QUOTA_EXCEEDED_ERR:
                msg = 'QUOTA_EXCEEDED_ERR';
                break;
            case FileError.NOT_FOUND_ERR:
                msg = 'NOT_FOUND_ERR';
                break;
            case FileError.SECURITY_ERR:
                msg = 'SECURITY_ERR';
                break;
            case FileError.INVALID_MODIFICATION_ERR:
                msg = 'INVALID_MODIFICATION_ERR';
                break;
            case FileError.INVALID_STATE_ERR:
                msg = 'INVALID_STATE_ERR';
                break;
            default:
                msg = 'Unknown Error';
                break;
        }

        console.log('Error: ' + msg);
    },
    loadTracks     : function () {
        var me = this,
            trackBrowser = me.getTrackBrowser(),
            fs = me.getApplication().fileSystem,
            dirReader = fs.root.createReader(),
            tracks = [],
            i = 0,
            resultsLength,
            track;

        dirReader.readEntries(function (results) {
            resultsLength = results.length;

            for (; i < resultsLength; i++) {
                track = results[i];
                tracks.push(track.name);
            }

            trackBrowser.setData(tracks);
        });

    },
    onSetVolume    : function (volume, deckType) {
        var deck = Ext.ComponentQuery.query('deck[deckType="' + deckType + '"]')[0],
            backend = deck.getWaveSurfer().backend,
            newVol = -1 + volume;

        backend.startVolume = newVol;
        if (backend.gainNode) {
            console.log(newVol);
            backend.gainNode.gain.value = newVol;
        }
    },
    onEqChange     : function (deckType, eq, value) {
        var deck = Ext.ComponentQuery.query('deck[deckType="' + deckType + '"]')[0],
            backend = deck.getWaveSurfer().backend;

        backend[eq + 'EQ'].gain.value = value;
    },
    onLoadTrack    : function (track, deckType) {
        var deck = Ext.ComponentQuery.query('deck[deckType="' + deckType + '"]')[0];

        deck.loadSong(track);
    },
    onAddTrack     : function (file, deckType) {
        debugger;
        var me = this,
            fs = me.getApplication().fileSystem;

        fs.root.getFile(file.name, {create : true, exclusive : true}, function (fileEntry) {
            fileEntry.createWriter(function (fileWriter) {
                debugger;
                fileWriter.write(file);
                me.loadTracks();
                deckType && me.onLoadTrack(file.name, deckType);
            }, function (writerError) {
                console.log('write err', writerError);
            });

        }, function (fileEntryError) {
            console.log('err', fileEntryError);
        });
    }

});