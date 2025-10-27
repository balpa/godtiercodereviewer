/* OPT-188630 START */
((self) => {
    'use strict';

    const builderId = Insider.browser.isDesktop() ? 784 : 785;
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);

    const buttonText = {
        de_DE: 'Suchen',
        fr_FR: 'Rechercher'
    }[Insider.systemRules.call('getLang')];

    const classes = {
        style: `ins-custom-style-${ variationId }`,
        goal: `sp-custom-${ variationId }-1`,
        wrapper: `ins-custom-button-wrapper-${ variationId }`,
        flex: `ins-flex-${ variationId }`
    };

    const selectors = Insider.fns.keys(classes).reduce((createdSelector, key) => (
        createdSelector[key] = `.${ classes[key] }`, createdSelector
    ), {
        appendElement: 'e2core-store-locator-input',
        radioButton: '.delivery-group-selector__radio',
        input: '.input',
        checkoutWrapper: '.MainCheckoutSlot'
    });

    self.init = () => {
        if (variationId && Insider.campaign.get(variationId).hus ? Insider.storage.get('ucd-segment-data')[builderId] :
            variationId) {
            Insider.fns.onElementLoaded(selectors.appendElement, () => {
                if (!Insider.campaign.isControlGroup(variationId)) {
                    self.displayCampaign();
                }

                Insider.campaign.custom.show(variationId);
            }).listen();
        }
    };

    self.displayCampaign = () => {
        self.reset();
        self.buildCSS();
        self.buildHTML();
        self.adjustPartnerElement();
        self.setEvents();
        self.setMutationObserver();
    };

    self.reset = () => {
        const { style, wrapper, appendElement } = selectors;

        if (Insider.__external.mutationObserver188630) {
            Insider.__external.mutationObserver188630.disconnect();
        }

        Insider.dom(`${ style }, ${ wrapper }`).remove();
        Insider.dom(appendElement).removeClass(classes.flex);
    };

    self.buildCSS = () => {
        const { wrapper, flex } = selectors;

        const customStyle =
        `${ wrapper } {
            font-size: 15px;
            margin-top: 24px;
            margin-left: 10px;
            padding: 0px 25px;
            letter-spacing: 0.5px;
            justify-content: center;
            display: flex;
            align-items: center;
            background-color: black;
            color: white;
            font-weight: bold;
            cursor: pointer;
        }
        ${ flex } {
            display: flex;
        }
        @media only screen and (max-width: 767px) {
            ${ wrapper } {
                padding: 0px 10px;
            }
        }`;

        Insider.dom('<style>').addClass(classes.style).html(customStyle).appendTo('head');
    };

    self.buildHTML = () => {
        const { wrapper, goal } = classes;

        const html = `<div class="${ wrapper } ${ goal }">${ buttonText }</div>`;

        Insider.dom(selectors.appendElement).append(html);
    };

    self.adjustPartnerElement = () => {
        const { appendElement } = selectors;

        Insider.fns.onElementLoaded(appendElement, ($node) => {
            $node.addClass(classes.flex);
        }).listen();
    };

    self.setEvents = () => {
        const { radioButton, wrapper, input } = selectors;

        Insider.eventManager.once(`change.init:on:rerender-${ variationId }`, radioButton, () => {
            self.displayCampaign();
        });

        Insider.eventManager.once(`click.trigger:search:${ variationId }`, wrapper, () => {
            const $searchInput = Insider.dom(input).getNode(0);

            const event = new KeyboardEvent('keydown', {
                key: 'Enter',
                keyCode: 13,
                code: 'Enter',
                which: 13,
                bubbles: true
            });

            $searchInput?.dispatchEvent(event);
        });
    };

    self.setMutationObserver = () => {
        const { checkoutWrapper, radioButton } = selectors;

        Insider.__external.mutationObserver188630 = new MutationObserver(() => {
            if (Insider.dom(`${ radioButton }:last`).is(':checked')) {
                self.displayCampaign();
            }
        });

        Insider.fns.onElementLoaded(checkoutWrapper, () => {
            Insider.__external.mutationObserver188630.observe(
                Insider.dom(checkoutWrapper).getNode(0),
                { childList: true, subtree: true }
            );
        }).listen();
    };

    return self.init();
})({});
/* OPT-188630 END */