/* OPT-12345 START */
((self) => {
    'use strict';

    const isDesktop = Insider.browser.isDesktop();
    const builderId = isDesktop ? 3576 : 3574;
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
    const isOfferPage = Insider.fns.hasParameter('/offer');
    const isCategoryPage = Insider.systemRules.call('isOnCategoryPage');
    const isProductPage = Insider.systemRules.call('isOnProductPage');
    const isControlGroup = Insider.campaign.isControlGroup(Number(variationId));
    const couponStorage = `ins-coupon-code-${ variationId }`;
    const giftStorage = `ins-gift-storage-${ variationId }`;

    const classes = {
        badge: `ins-badge-${ variationId }`,
        join: `sp-custom-${ variationId }-1`,
        style: `ins-custom-style-${ variationId }`,
        wrapper: `ins-custom-wrapper-${ variationId }`,
        header: `ins-custom-text-header-${ variationId }`,
        notice: `ins-custom-text-notice-${ variationId }`,
        modelData: 'data-modelcode',
        positionRelative: `ins-element-position-relative-${ variationId }`,
        addToCart: `ins-add-to-cart-${ variationId }`,
        hidden: `ins-hidden-element-${ variationId }`,
        infoWrapper: `ins-preview-wrapper-${ variationId }`,
        backgroundUnset: `ins-background-unset-${ variationId }`,
        productPageSecondAddToCart: `ins-second-add-to-cart-${ variationId }`,
        addToCartBaseStyle: `ins-add-to-cart-base-style-${ variationId }`,
        addedElement: `ins-added-element-${ variationId }`
    };

    const selectors = Insider.fns.keys(classes).reduce((createdSelector, key) => (
        createdSelector[key] = `.${ classes[key] }`, createdSelector
    ), {
        categoryPageAppendLocation: '.option-selector-v2__swiper-container',
        categoryPageProducts: '.pd03-product-finder__content-item.pd03-product-finder__content-item-view.js-pfv2-product-card',
        categoryPageProductTitle: '.pd03-product-card__product-name a',
        productPageProductId: '.pd-info__sku',
        productPageImage: '.first-image',
        offerPageProduct: '.cmp-prd-card_item',
        offerPageProductLink: '.cmp-prd-card_item-thbnail',
        categoryPageAddToCartButton: '.cta.cta--contained.cta--black.js-cta-addon',
        productPageAddToCartButton: '.tg-add-to-cart',
        offerPageAddToCartButton: '.cta.cta--contained.cta--black.cmp-prd-card_cta-btn',
        skipButton: '.ins-skip-button',
        closeButton: '.ins-element-close-button',
        popUpAddToCart: '.ins-custom-add-to-cart-button',
        addCoupon: '.summary-total__btn.summary-total__btn--link.link.ng-star-inserted',
        couponInput: '.cart-voucher.modal__container.ng-star-inserted input',
        couponModal: '.modal',
        couponSubmit: '.cart-voucher.modal__container.ng-star-inserted button[type="submit"]',
        couponModalContainer: '.cart-voucher.modal__container.ng-star-inserted',
        couponModalClose: '.modal__close',
        appliedCoupon: '.summary-total__voucher.summary-total__voucher--last.ng-star-inserted',
        cartButton: '.cart-in-number.gnb-cart-count'
    });

    const config = {
        skuList: {
            'QE98QN90DATXTK': {
                giftProduct: 'HW-Q990D/TK',
                paraCardAmount: '15,000'
            },
            'QE85QN900DTXTK': {
                giftProduct: 'HW-Q990D/TK',
                paraCardAmount: '15,000'
            },
            'QE75QN900DTXTK': {
                giftProduct: 'HW-Q990D/TK',
                paraCardAmount: '15,000'
            },
            'QE75QN800DTXTK': {
                giftProduct: 'HW-Q990D/TK',
                paraCardAmount: '15,000'
            },
            'QE65QN800DTXTK': {
                giftProduct: 'HW-Q990D/TK',
                paraCardAmount: '15,000'
            },
            'QE77S95DATXTK': {
                giftProduct: 'HW-Q800D/TK',
                paraCardAmount: '8,000'
            },
            'QE65S95DATXTK': {
                giftProduct: 'HW-Q800D/TK',
                paraCardAmount: '8,000'
            },
            'QE85QN90DATXTK': {
                giftProduct: 'HW-Q600C/TK',
                paraCardAmount: '5,000'
            },
            'QE75QN90DATXTK': {
                giftProduct: 'HW-Q600C/TK',
                paraCardAmount: '5,000'
            },
            'QE65QN90DATXTK': {
                giftProduct: 'HW-Q600C/TK',
                paraCardAmount: '5,000'
            },
            'QE55QN90DATXTK': {
                giftProduct: 'HW-Q600C/TK',
                paraCardAmount: '5,000'
            },
            'QE85QN85DBTXTK': {
                giftProduct: 'HW-Q600C/TK',
                paraCardAmount: '5,000'
            },
            'QE75QN85DBTXTK': {
                giftProduct: 'HW-Q600C/TK',
                paraCardAmount: '5,000'
            },
            'QE65QN85DBTXTK': {
                giftProduct: 'HW-Q600C/TK',
                paraCardAmount: '5,000'
            },
            'QE55QN85DBTXTK': {
                giftProduct: 'HW-Q600C/TK',
                paraCardAmount: '5,000'
            },
            'QE75LS03DAUXTK': {
                giftProduct: 'HW-LS60D/TK',
                paraCardAmount: '4,500'
            },
            'QE65LS03DAUXTK': {
                giftProduct: 'HW-LS60D/TK',
                paraCardAmount: '4,500'
            },
            'QE55LS03DAUXTK': {
                giftProduct: 'HW-LS60D/TK',
                paraCardAmount: '4,500'
            },
            'HW-Q990D/TK': {
                giftProduct: '',
                paraCardAmount: '2,500'
            },
            'HW-LS60D/TK': {
                giftProduct: '',
                paraCardAmount: '1,000'
            }
        },
        texts: {
            addToCart: 'Sepete Ekle',
            buy: 'Satın Al',
            numberOfItems: 'Ürün Sayısı : '
        },
        urls: {
            request: 'searchapi.samsung.com/'
        }
    };

    self.init = () => {
        self.reset();
        self.buildCSS();
        self.handlePageContent();
        self.setEvents();

        return false;
    };

    self.reset = () => {
        const { style, wrapper, positionRelative: positionRelativeSelector, addToCart, addedElement } = selectors;
        const { positionRelative } = classes;

        Insider.dom(`${ style }, ${ wrapper }, ${ addToCart }, ${ addedElement }`).remove();
        Insider.dom(positionRelativeSelector).removeClass(positionRelative);
    };

    self.buildCSS = () => {
        const { wrapper, addToCart, hidden, backgroundUnset, productPageSecondAddToCart,
            addToCartBaseStyle } = selectors;
        let customStyle =
        `${ addToCart } {
            color: white;
            text-align: center;
            border-radius: 30px;
            transition: background-color 0.3s ease;
            order: -1;
            font-weight: 600;
            cursor: pointer;
        }
        ${ addToCart }:hover {
            background-color: #595959;
        }
        ${ hidden } {
            display: none !important;
        }
        ${ backgroundUnset } {
            background-color: unset !important;
        }
        ${ addToCartBaseStyle } {
            background-color: black;
            color: white;
            text-align: center;
            border-radius: 30px;
            transition: background-color 0.3s ease;
            order: -1;
            font-weight: 550;
            cursor: pointer;
        }
        @media (min-width: 1200px) {
            ${ addToCart } {
                height: 4vh !important;
                font-size: 14px;
            }
        }
        @media (max-width: 1200px) {
            ${ addToCart } {
                height: 47px !important;
                width: 68% !important;
                margin-left: 16% !important;
                width: 60%;
                margin-left: 20%;
                font-size: 17px;
            }
            ${ wrapper } {
                margin: unset !important;
                border-radius: 25vh 25vh 0 0;
            }
        }`;

        if (isCategoryPage) {
            customStyle +=
            `${ addToCart } {
                background-color: black;
                height: 5vh;
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100% !important;
                margin-left: unset !important;
            }
            @media (max-width: 1200px) {
                ${ addToCart } {
                    font-size: 1.8vh !important;
                }
            }`;
        } else if (isProductPage) {
            customStyle +=
            `@media (min-width: 1200px) {
                ${ addToCart } {
                    font-size: 15px;
                }
                ${ productPageSecondAddToCart } {
                    width: 40% !important;
                    margin-left: 30% !important;
                }
            }
            ${ addToCart } {
                font-size: 14px;
                background-color: #007AFF;
                padding: 1.5vh;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            ${ addToCart }:hover {
                background-color: #2189ff !important;
            }
            @media (max-width: 1200px) {
                ${ addToCart } {
                    font-size: 17px !important;
                    padding: 1.5vh;
                    width: 100% !important;
                    border-radius: 35px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 100%;
                }
                ${ productPageSecondAddToCart } {
                    margin-left: 10% !important;
                    width: 80% !important;
                }
            }`;
        } else if (isOfferPage) {
            customStyle +=
            `${ addToCart } {
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: 30px !important;
                width: ${ isDesktop ? '70% !important' : '60% !important' };
                margin-left: ${ isDesktop ? '15% !important' : '20% !important' };
                height: ${ isDesktop ? '4.5vh !important' : '5vh !important' }
            }}`;
        }

        Insider.dom('<style>').addClass(classes.style).html(customStyle).appendTo('head');
    };

    self.handlePageContent = () => {
        let pageType;
        const pageHandlers = {
            product: self.handleProductPage,
            category: self.handleCategoryPage,
            offer: self.handleOfferPage,
            cart: self.handleCheckoutPage
        };

        if (isOfferPage) {
            pageType = 'offer';
        } else if (isCategoryPage) {
            pageType = 'category';
        } else if (isProductPage) {
            pageType = 'product';
        } else if (Insider.systemRules.call('isOnCartPage')) {
            pageType = 'cart';
        }

        if (pageType) {
            pageHandlers[pageType]();

            Insider.utils.opt.ajaxListener((url, response, method) => {
                if (method === 'GET' && Insider.fns.has(url, config.urls.request)) {
                    setTimeout(() => {
                        pageHandlers[pageType]();
                    }, 500);
                }
            });
        }
    };

    self.handleOfferPage = () => {
        const { addToCart, hidden, positionRelative, addToCartBaseStyle } = classes;
        const { offerPageProduct, offerPageProductLink, addToCart: addToCartSelector,
            offerPageAddToCartButton } = selectors;

        Insider.dom(addToCartSelector).remove();

        Insider.dom(offerPageProduct).accessNodes((node) => {
            const productId = Insider.dom(node).find(offerPageProductLink).attr('title');
            const $partnerAddToCart = Insider.dom(node).find(offerPageAddToCartButton);
            const $node = Insider.dom(node);

            if (config.skuList[productId] && !isControlGroup) {
                const buttonHtml = `
                <div class="${ addToCart } ${ addToCartBaseStyle }" data-ins-product-id="${ productId }">
                    ${ config.texts.addToCart }
                </div>`;

                $node.addClass(positionRelative);
                $partnerAddToCart.after(buttonHtml);
                $partnerAddToCart.addClass(hidden);
            }
        });
    };

    self.handleCategoryPage = () => {
        const { modelData, addToCart, hidden, addToCartBaseStyle } = classes;
        const { categoryPageProducts, categoryPageProductTitle, categoryPageAddToCartButton,
            addToCart: addToCartSelector } = selectors;

        Insider.dom(addToCartSelector).remove();

        Insider.dom(categoryPageProducts).accessNodes((node) => {
            const $node = Insider.dom(node).find(categoryPageProductTitle);
            const productId = $node.attr(modelData);
            const product = config.skuList[productId];
            const $partnerAddToCart = Insider.dom(node).find(categoryPageAddToCartButton);

            if (product && !isControlGroup) {
                const buttonHtml = `
                <div class="${ addToCart } ${ addToCartBaseStyle }"
                    data-ins-product-id="${ productId }">${ config.texts.addToCart }</div>`;

                $partnerAddToCart.after(buttonHtml);
                $partnerAddToCart.addClass(hidden);
            }
        });
    };

    self.handleProductPage = () => {
        const { addToCart, hidden, productPageSecondAddToCart, addToCartBaseStyle } = classes;
        const { productPageAddToCartButton, addToCart: addToCartSelector } = selectors;
        const currentProductId = Insider.systemRules.call('getCurrentProduct').id;
        const $productPageAddToCartButton = Insider.dom(productPageAddToCartButton);

        if (config.skuList[currentProductId] && !isControlGroup) {
            const buttonHtml = `
            <div class="${ addToCart } ${ addToCartBaseStyle }"
                data-ins-product-id="${ currentProductId }">${ config.texts.buy }</div>`;

            $productPageAddToCartButton.addClass(hidden).after(buttonHtml);
            Insider.dom(addToCartSelector).last().addClass(productPageSecondAddToCart);
        }
    };

    self.handleCheckoutPage = () => {
        const couponCode = Insider.storage.localStorage.get(couponStorage);
        const isCouponApplied = Insider.dom(selectors.appliedCoupon).length > 0;

        if (couponCode && Insider.systemRules.call('isOnCartPage') && !isCouponApplied) {
            if (!isControlGroup) {
                setTimeout(() => {
                    self.submitCouponCode(couponCode);
                }, 500);
            }

            self.showCampaign();
        }
    };

    self.submitCouponCode = (couponCode) => {
        const { backgroundUnset, hidden } = classes;
        const { addCoupon, couponInput, couponModal, couponSubmit, couponModalContainer, couponModalClose } = selectors;
        const $addCouponButton = Insider.dom(addCoupon);

        const inputEvent = new Event('input', {
            bubbles: true,
            cancelable: true,
        });

        const changeEvent = new Event('change', {
            bubbles: true,
            cancelable: true,
        });

        $addCouponButton.click();

        const $couponModal = Insider.dom(couponModal);
        const $couponModalContainer = Insider.dom(couponModalContainer);
        const $couponInput = Insider.dom(couponInput);
        const $couponSubmit = Insider.dom(couponSubmit);
        const $couponInputNode = $couponInput.getNode(0);

        $couponModal.addClass(backgroundUnset);
        $couponModalContainer.addClass(hidden);
        $couponInput.val(couponCode);
        $couponInputNode.dispatchEvent(inputEvent);
        $couponInputNode.dispatchEvent(changeEvent);
        $couponSubmit.click();

        setTimeout(() => {
            Insider.dom(couponModalClose).click();
        }, 1000);
    };

    self.showCampaign = () => {
        const { cartButton } = selectors;

        const itemsInCart = Number(Insider.dom(cartButton).text()?.match(/\d+/g)?.[0] ?? 0);
        const cartBubble =
        `<span class="cart-in-number gnb-cart-count ${ classes.addedElement }" aria-live="polite">
            <span class="hidden">
                ${ config.texts.numberOfItems }
            </span>
            ${ (itemsInCart + 1).toString() }
        </span>`;

        Insider.dom(cartButton).after(cartBubble);

        Insider.campaign.info.show(variationId);
    };

    self.setEvents = () => {
        const { addToCart, skipButton, infoWrapper, closeButton, popUpAddToCart } = selectors;
        const { skuList } = config;
        const method = isDesktop ? 'click' : 'mouseup';
        const couponCode = 'INSIDERTESTTR';

        Insider.eventManager.once('click.track:add:to:cart:clicks', addToCart, async (event) => {
            const productId = Insider.dom(event.target).data('ins-product-id');
            const baseUrl = 'https://shop.samsung.com/tr/ng/p4v1/addCart?productCode=#ID&quantity=1&insTrigger=true';
            const url = baseUrl.replace('#ID', productId);

            try {
                const response = await fetch(url, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Accept': 'application/json, text/javascript, */*; q=0.01',
                        'Content-Type': 'application/x-www-form-urlencoded',
                    }
                });

                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${ response.statusText }`);
                }

                Insider.storage.localStorage.set({
                    name: giftStorage,
                    value: { product: skuList[productId]?.giftProduct ?? '', amount: skuList[productId]?.paraCardAmount
                      ?? '' }
                });

                if (!isControlGroup) {
                    Insider.campaign.info.clearVisibleCampaignsByType('ON-PAGE');
                    Insider.campaign.webInfo.clearVisibleCampaignsByType('ON-PAGE');
                }

                self.showCampaign();
            } catch (error) {
                Insider.logger.log(`Error: ${ error.message }`);
            }
        });

        Insider.eventManager.once(`${ method }.handle:skip:button:${ variationId }`, skipButton, () => {
            Insider.dom(infoWrapper).find(closeButton).click();
        });

        Insider.eventManager.once(`${ method }.handle:add:to:cart:button:${ variationId }`, popUpAddToCart, () => {
            Insider.storage.localStorage.set({
                name: couponStorage,
                value: couponCode
            });

            Insider.dom(infoWrapper).find(closeButton).click();
        });
    };

    return self.init();
})({});

/* OPT-12345 END */