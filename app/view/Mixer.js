/**
 * Created with JetBrains WebStorm.
 * User: stan229
 * Date: 10/10/12
 * Time: 11:07 AM
 */
Ext.define("NextDJ.view.Mixer", {
    extend : 'Ext.Component',
    xtype  : 'mixer',
    config : {
        cls              : 'mixer-component',
        styleHtmlContent : true,
        html             : ''.concat(
            '<div class="mixer">',
                '<div class="channel left">',
//                    '<div class="eq">',
//                        '<div class="hi">H</div>',
//                        '<div class="mid">M</div>',
//                        '<div class="low">L</div>',
//                    '</div>',
                    '<div class="dragdealer left">',
                        '<div class="red-bar handle"></div>',
                    '</div>',
                '</div>',
                '<div class="channel right">',
//                    '<div class="eq">',
//                        '<div class="hi">H</div>',
//                        '<div class="mid">M</div>',
//                        '<div class="low">L</div>',
//                    '</div>',
                    '<div class="dragdealer right">',
                        '<div class="red-bar handle"></div>',
                    '</div>',
                '</div>',
            '</div>'
        )
    },
    initialize : function () {
        var me = this;

        me.on({
            painted : me.onPainted,
            scope   : me
        });


        me.callParent();
    },
    onPainted    : function() {
        var me         = this,
            element    = me.element,
            leftFader  = element.down('.dragdealer.left').dom,
            rightFader = element.down('.dragdealer.right').dom;

        new Dragdealer(leftFader, {
            horizontal        : false,
            vertical          : true,
            animationCallback : Ext.bind(me.onFaderDrag, me, ['A'], true)
        });

        new Dragdealer(rightFader, {
            horizontal        : false,
            vertical          : true,
            animationCallback : Ext.bind(me.onFaderDrag, me, ['B'], true)
        });

    },
    onFaderDrag : function(x, y, deckType) {
        this.fireEvent('setVolume', (1 - y), deckType);
    }
});