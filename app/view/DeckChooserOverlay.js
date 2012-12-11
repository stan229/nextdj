/**
 * Created with JetBrains WebStorm.
 * User: stan229
 * Date: 12/10/12
 * Time: 11:59 PM
 */
Ext.define('NextDJ.view.DeckChooserOverlay', {
    extend : 'Ext.Panel',
    xtype  : 'deckchooser',
    config : {
        styleHtmlContent : true,
        hideOnMaskTap    : true,
        modal            : true,
        width            : 200,
        height           : 100,
        items            : [
            {
                docked : 'top',
                xtype  : 'titlebar',
                html   : 'Choose Deck'

            },
            {
                xtype : 'button',
                text  : 'A'
            },
            {
                xtype : 'button',
                text  : 'B'
            }

        ]
    }


});