/**
 * Created with JetBrains WebStorm.
 * User: stan229
 * Date: 12/12/12
 * Time: 11:53 PM
 */
Ext.define('NextDJ.util.MIDIUtil', {
    singleton          : true,
    alternateClassName : 'MIDIUtil',
    midiMap            : null,
    initMIDIMap        : function () {
        var me = this;
        Ext.Ajax.request({
            url     : "data/midi.json",
            success : me.onMIDIMapSuccess,
            failure : me.onMIDIMapFailure,
            scope   : me
        });
    },
    onMIDIMapSuccess   : function (response, opts) {
        MIDIUtil.midiMap = Ext.JSON.decode(response.responseText);
        this.initMIDI();
    },
    onMIDIMapFailure   : function () {
        console.log("error loading midi map");
    },
    initMIDI           : function () {
        var Jazz = document.getElementById("Jazz1"),
            deviceList;

        if (!Jazz || !Jazz.isJazz) {
            Jazz = document.getElementById("Jazz2");
        }
        if (Jazz) {
            deviceList = Jazz.MidiInList();
            deviceList.length > 0 && Jazz.MidiInOpen(deviceList[0], this.onMessage);
        }
    },
    onMessage          : function (timestamp, deviceId, controlId, value) {
        var mapping = MIDIUtil.midiMap[controlId];
        if (mapping.param) {
            NextDJ.app.fireEvent(mapping.event, mapping.param, mapping.deck, value);
        } else {
            NextDJ.app.fireEvent(mapping.event, mapping.deck, value);
        }

//        console.log('hello', controlId, value);
    }
});