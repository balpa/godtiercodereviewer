/* OPT-203039 START */
Insider.__external.SOPCustomizer203039 = (config = {}) => {
    const self = {};
    const { variationId } = config;

    const classes = {
        style: `ins-custom-style-${ variationId }`,
        closed: `ins-slider-closed-${ variationId }`,
        wrapper: `ins-slider-vertical-banner-wrapper-${ variationId }`,
        container: `ins-slider-vertical-banner-custom-container-${ variationId }`,
        bannerText: `ins-slider-vertical-banner-custom-banner-text-${ variationId }`,
        slideArrow: `ins-slider-vertical-banner-custom-slide-arrow-${ variationId }`,
        notificationContent: `ins-notification-content-${ variationId }`,
        pointerEventsNone: `ins-pointer-events-none-${ variationId }`, /* OPT-209562 */
        goal: `sp-custom-${ variationId }-1`,
    };

    const selectors = Insider.fns.keys(classes).reduce((createdSelector, key) => (
        createdSelector[key] = `.${ classes[key] }`, createdSelector
    ), {
        previewWrapper: `.ins-preview-wrapper-${ variationId }`,
        contentWrapper: `.ins-content-wrapper-${ variationId }`,
        overlay: `#ins-frameless-overlay[data-camp-id*=${ variationId }]`
    });

    self.init = () => {
        if (variationId) {
            Insider.fns.onElementLoaded(selectors.previewWrapper, () => {
                self.reset();
                self.buildCSS();
                self.buildHTML();
                self.setEvents();
                self.checkMinimizeStatus();
                self.removeOverlay();
            }).listen();
        }
    };

    self.reset = () => {
        const { style, wrapper } = selectors;

        Insider.dom(`${ style }, ${ wrapper }`).remove();
    };

    self.buildCSS = () => {
        const { wrapper, container, slideArrow, bannerText, notificationContent, closed,
            pointerEventsNone } = selectors; /* OPT-209562 */

        const customStyle =
        `${ wrapper } {
            display: flex;
            height: 100%;
            background-color: #2806f8;
            width: 44px;
            z-index: 1;
            pointer-events: all /* OPT-209562 */
        }
        ${ closed } {
            transform: translateX(500px);
        }
        ${ notificationContent } {
            transition: 0.5s;
        }
        /* OPT-209562 START */
        ${ pointerEventsNone } {
            pointer-events: none;
        }
        /* OPT-209562 END */    
        ${ slideArrow } {
            width: 10px;
            height: 10px;
            border-top: 1.5px solid white;
            border-left: 1.5px solid white;
            transform: rotate(135deg);
            transition: 0.5s;
            cursor: pointer;
            padding: 4px;
        }
        ${ bannerText } {
            color: white;
            writing-mode: vertical-lr;            
            transform: rotate(180deg);
            text-orientation: sideways; /* OPT-206799 */
            font-size: 14px;
            font-family: proxima-nova;
            font-weight: 700 !important;
            margin-top: 5px;
        }
        ${ container } {
            height: 100%;
            display: flex !important;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 15px;
            cursor: pointer;
        }`;

        Insider.dom('<style>').addClass(classes.style).html(customStyle).appendTo('head');
    };

    self.buildHTML = () => {
        const { wrapper, container, bannerText, slideArrow } = classes;
        const { sliderVerticalBannerText } = config;

        const outerHtml =
        `<div class="${ wrapper }">
            <div class="${ container }">
                <div class="${ slideArrow }"></div>
                <div class="${ bannerText }">${ sliderVerticalBannerText }</div>
            </div>
        </div>`;

        Insider.dom(selectors.contentWrapper).append(outerHtml);
    };

    self.setEvents = () => {
        /* OPT-209562 START */
        const { slideArrow, notificationContent, wrapper, previewWrapper } = selectors;
        const { closed, pointerEventsNone } = classes;
        /* OPT-209562 END */
        const $slideArrow = Insider.dom(slideArrow);
        const $previewWrapper = Insider.dom(previewWrapper); /* OPT-209562 */

        Insider.eventManager.once(`click.toggle:slider:${ variationId }`, wrapper, () => {
            Insider.dom(notificationContent).toggleClass(closed);

            if (Insider.dom(notificationContent).hasClass(closed)) {
                $slideArrow.css('transform', 'rotate(-45deg)');

                $previewWrapper.addClass(pointerEventsNone); /* OPT-209562 */
            } else {
                $slideArrow.css('transform', 'rotate(135deg)');

                $previewWrapper.removeClass(pointerEventsNone); /* OPT-209562 */
            }
        });
    };

    self.checkMinimizeStatus = () => {
        /* OPT-209562 START */
        const { notificationContent, slideArrow, previewWrapper } = selectors;
        const { closed, pointerEventsNone } = classes;
        /* OPT-209562 END */
        const defaultExpanded = config.defaultExpanded[Insider.browser.getPlatform()];
        const $notificationContent = Insider.dom(notificationContent);
        const $slideArrow = Insider.dom(slideArrow);
        const $previewWrapper = Insider.dom(previewWrapper); /* OPT-209562 */

        if (defaultExpanded && $notificationContent.hasClass(closed)) {
            $notificationContent.removeClass(closed);
            $previewWrapper.removeClass(pointerEventsNone); /* OPT-209562 */

            $slideArrow.css('transform', 'rotate(135deg)');
        } else if (!defaultExpanded) {
            $notificationContent.addClass(closed);
            $previewWrapper.addClass(pointerEventsNone); /* OPT-209562 */

            $slideArrow.css('transform', 'rotate(-45deg)');
        }
    };

    self.removeOverlay = () => {
        Insider.dom(selectors.overlay).hide();
    };

    self.init();
};

true;
/* OPT-203039 END */