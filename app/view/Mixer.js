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
                    '<div class="eq">',
                        '<input type="text" value="20" class="high left" data-angleOffset=-125 data-angleArc=250 data-width=75 data-height=75>',
                        '<input type="text" value="20" class="mid left" data-angleOffset=-125 data-angleArc=250 data-width=75 data-height=75>',
                        '<input type="text" value="20" class="low left" data-angleOffset=-125 data-angleArc=250 data-width=75 data-height=75>',
                    '</div>',
                    '<div class="dragdealer left">',
                        '<div class="red-bar handle"></div>',
                    '</div>',
                '</div>',
                '<div class="channel right">',
                    '<div class="dragdealer right">',
                        '<div class="red-bar handle"></div>',
                    '</div>',
                    '<div class="eq">',
                        '<input type="text" value="20" class="high right" data-angleOffset=-125 data-angleArc=250 data-width=75 data-height=75>',
                        '<input type="text" value="20" class="mid right" data-angleOffset=-125 data-angleArc=250 data-width=75 data-height=75>',
                        '<input type="text" value="20" class="low right" data-angleOffset=-125 data-angleArc=250 data-width=75 data-height=75>',
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

        $(".high.left").knob({
            'change' : me.onEQChange
        });
        $(".mid.left").knob({
            'change' : me.onEQChange
        });
        $(".low.left").knob({
            'change' : me.onEQChange
        });
        $(".high.right").knob({
            'change' : me.onEQChange
        });
        $(".mid.right").knob({
            'change' : me.onEQChange
        });
        $(".low.right").knob({
            'change' : me.onEQChange
        });

    },
    onEQChange : function (value) {
        var eqClasses = this.i.context.classList,
            eqType    = eqClasses[0],
            deckType  = (eqClasses[1] === "left") ? "A" : "B";

        Ext.ComponentQuery.query('mixer')[0].fireEvent('eqChange', deckType, eqType, value);
    },
    onFaderDrag : function(x, y, deckType) {
        console.log(1-y);
        this.fireEvent('setVolume', (1 - y), deckType);
    }
});