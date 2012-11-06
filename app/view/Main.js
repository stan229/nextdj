Ext.define("NextDJ.view.Main", {
    extend   : 'Ext.Container',
    xtype    : 'main',
    requires : [
        'NextDJ.view.DeckContainer'
    ],
    config   : {
        fullscreen : true,
        items      : [
            {
                xtype : 'deckcontainer'
            }
//            {
//                xtype : 'component',
//                html  : "songs here HELLO WORLD"
//            }
        ]
    }
});
