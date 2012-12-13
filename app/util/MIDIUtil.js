/**
 * Initializes MIDI Functionality
 * Process MIDI IN messages and fires events on MIDI Controller
 * User: stan229
 * Date: 12/12/12
 * Time: 11:53 PM
 */
Ext.define('NextDJ.util.MIDIUtil', {
    singleton          : true,
    alternateClassName : 'MIDIUtil',
    midiMap            : null,
    /**
     * Initialize MIDI Mapping
     */
    initMIDIMap        : function () {
        var me = this;
        // request mapping properties file
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
    /**
     * Initialize Jazz-MIDI interface
     */
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
    /**
     * Process every MIDI-IN Message and event found from mapping
     * @param timestamp
     * @param deviceId
     * @param controlId
     * @param value
     */
    onMessage          : function (timestamp, deviceId, controlId, value) {
        var mapping = MIDIUtil.midiMap[controlId];
        if (mapping.param) {
            NextDJ.app.fireEvent(mapping.event, mapping.param, mapping.deck, value);
        } else {
            NextDJ.app.fireEvent(mapping.event, mapping.deck, value);
        }
    }
});