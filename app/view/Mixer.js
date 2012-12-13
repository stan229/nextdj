/**
 * Mixer component
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
        leftFader        : null,
        rightFader       : null,
        html             : ''.concat(
            '<div class="mixer">',
                '<div class="channel left">',
                    '<div class="eq">',
                        '<input type="text" value="0" class="high left"  data-min=-20 data-max=20 data-displayInput="false" data-angleOffset=-125 data-angleArc=250 data-width=75 data-height=75 data-fgcolor="#FF8A0D">',
                        '<input type="text" value="0" class="mid left"   data-min=-20 data-max=20 data-displayInput="false" data-angleOffset=-125 data-angleArc=250 data-width=75 data-height=75 data-fgcolor="#FF8A0D">',
                        '<input type="text" value="0" class="low left"   data-min=-20 data-max=20 data-displayInput="false" data-angleOffset=-125 data-angleArc=250 data-width=75 data-height=75 data-fgcolor="#FF8A0D">',
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
                        '<input type="text" value="0" class="high right" data-min=-20 data-max=20 data-displayInput="false" data-angleOffset=-125 data-angleArc=250 data-width=75 data-height=75 data-fgcolor="#FF8A0D">',
                        '<input type="text" value="0" class="mid right"  data-min=-20 data-max=20 data-displayInput="false" data-angleOffset=-125 data-angleArc=250 data-width=75 data-height=75 data-fgcolor="#FF8A0D">',
                        '<input type="text" value="0" class="low right"  data-min=-20 data-max=20 data-displayInput="false" data-angleOffset=-125 data-angleArc=250 data-width=75 data-height=75 data-fgcolor="#FF8A0D">',
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
            rightFader = element.down('.dragdealer.right').dom,
            leftDealer,
            rightDealer;

        // Initialize volume faders
        leftDealer = new Dragdealer(leftFader, {
            horizontal        : false,
            vertical          : true,
            animationCallback : Ext.bind(me.onFaderDrag, me, ['A'], true)
        });

        rightDealer = new Dragdealer(rightFader, {
            horizontal        : false,
            vertical          : true,
            animationCallback : Ext.bind(me.onFaderDrag, me, ['B'], true)
        });

        me.setLeftFader(leftDealer);
        me.setRightFader(rightDealer);

        // Initialize EQ Knobs
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
    /**
     * Set the EQ value (used from MIDI Controller)
     * @param deckType
     * @param eq
     * @param value
     */
    setEQValue : function (deckType, eq, value) {
        var mixerSide = (deckType === "A") ? "left" : "right",
            selector  = ''.concat('.', eq, '.', mixerSide);
        $(selector).val(value).trigger('change');
        Ext.ComponentQuery.query('mixer')[0].fireEvent('eqChange', deckType, eq, value);
    },
    /**
     * Event listener for when EQ Knob value is changed
     * @param value
     */
    onEQChange : function (value) {
        var eqClasses = this.i.context.classList,
            eqType    = eqClasses[0],
            deckType  = (eqClasses[1] === "left") ? "A" : "B";

        Ext.ComponentQuery.query('mixer')[0].fireEvent('eqChange', deckType, eqType, value);

    },
    /**
     * Event listener for when volume fader is dragged
     * @param x
     * @param y
     * @param deckType
     */
    onFaderDrag : function(x, y, deckType) {
        this.fireEvent('setVolume', (1 - y), deckType);
    }
});