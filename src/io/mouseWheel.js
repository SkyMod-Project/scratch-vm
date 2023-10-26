class MouseWheel {
    constructor (runtime) {
        /**
         * Reference to the owning Runtime.
         * @type{!Runtime}
         */
        this.runtime = runtime;
        // track scroll deltaY
        this.scrollDelta = 0;
    }

    _addToScrollingDistanceBlock (amount) {
        if ('ext_pmSensingExpansion' in this.runtime) {
            this.runtime.ext_pmSensingExpansion.scrollDistance += amount;
        }
    }

    /**
     * Mouse wheel DOM event handler.
     * @param  {object} data Data from DOM event.
     */
    postData (data) {
        // store scroll delta
        this.scrollDelta = data.deltaY;
        // add to scrolling distance
        this._addToScrollingDistanceBlock(0 - data.deltaY);
        // wait 2 ticks then set back to zero since we don't get a post for scroll stop
        this.runtime.once('RUNTIME_STEP_START', () => {
            this.runtime.once('RUNTIME_STEP_START', () => {
                this.scrollDelta = 0;
            });
        });

        const matchFields = {};
        // we need to track scrolling separately for another block
        // we cant reuse matchFields as we need to give a different name
        const scrollFields = {};
        if (data.deltaY < 0) {
            matchFields.KEY_OPTION = 'up arrow';
            scrollFields.KEY_OPTION = 'up';
        } else if (data.deltaY > 0) {
            matchFields.KEY_OPTION = 'down arrow';
            scrollFields.KEY_OPTION = 'down';
        } else {
            return;
        }

        this.runtime.startHats('event_whenkeypressed', matchFields);
        this.runtime.startHats('event_whenmousescrolled', scrollFields);
    }

    // pm: expose scroll delta for sensing block
    getScrollDelta () {
        return this.scrollDelta;
    }
}

module.exports = MouseWheel;
