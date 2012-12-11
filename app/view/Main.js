Ext.define("NextDJ.view.Main", {
    extend   : 'Ext.Container',
    xtype    : 'main',
    requires : [
        'NextDJ.view.DeckContainer',
        'NextDJ.view.TrackBrowser'
    ],
    config   : {
        fullscreen : true,
        cls        : 'next-dj-main',
        items      : [
            {
                xtype : 'deckcontainer'
            },
            {
                xtype : 'trackbrowser',
                data  : {}
            }

        ]
    }
});
