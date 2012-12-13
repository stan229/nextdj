/**
 * Container for Decks A/B and Mixer
 * User: stan229
 * Date: 10/10/12
 * Time: 11:21 AM
 */
Ext.define("NextDJ.view.DeckContainer", {
    extend   : 'Ext.Container',
    xtype    : 'deckcontainer',
    requires : [
        'NextDJ.view.Deck',
        'NextDJ.view.Mixer'
    ],
    config   : {
        trackName : null,
        cls       : 'deck-container',
        layout    : 'hbox',
        items     : [
            {
                xtype    : 'deck',
                deckType : 'A'
            },
            {
                xtype : 'mixer'
            },
            {
                xtype    : 'deck',
                deckType : 'B'
            }
        ]
    }
});
