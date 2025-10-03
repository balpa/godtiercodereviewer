(() => {
    'use strict';

    const isMobile = Insider.browser.isMobile();
    const builderId = isMobile ? 1147 : 1146;
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
    const isControlGroup = Insider.campaign.isControlGroup(variationId);
    const isOnCategoryPage = Insider.systemRules.call('isOnCategoryPage');
    const isOnProductPage = Insider.systemRules.call('isOnProductPage');
    const isOnMainPage = Insider.systemRules.call('isOnMainPage');
    let isLandScapeView = window.innerWidth > window.innerHeight;

    const classes = {
        wrapper: `ins-custom-wrapper-${ variationId }`,
        priceText: `ins-price-text-${ variationId }`,
        price: `ins-discount-price-${ variationId }`,
        style: `ins-custom-style-${ variationId }`,
        defaultGoal: `sp-custom-${ variationId }-1`,
        saveBadge: `ins-save-badge-${ variationId }`,
        marginforMobile: `ins-margin-for-mobile-${ variationId }`,
        paddingforDesktop: `ins-padding-for-desktop-${ variationId }`,
        cardHeight: `ins-card-height-${ variationId }`,
        cardHeightForMS: `ins-card-height-for-most-seller-${ variationId }`,
        cardHeightForMP: `ins-card-height-for-main-page-${ variationId }`,
        marginBottom50: `ins-margin-bottom-50-${ variationId }`,
        marginBottom60: `ins-margin-bottom-60-${ variationId }`,
        minHeight500: `ins-min-height-500-${ variationId }`,
        bottom80: `ins-bottom-80-${ variationId }`,
    };

    const selectors = Insider.fns.keys(classes).reduce((createdSelector, key) => {
        createdSelector[key] = `.${ classes[key] }`;

        return createdSelector;
    }, {
        addToBag: '.js-product-add-to-bag:first',
        productDiscountPrice: '.product-price--sale:first',
        productFooter: '.product__footer',
        productImages: '.product__images',
        innerCard: '.product.js-pr-product',
        cardFooter: '.product_content_fav_mobile',
    });

    const isProductAddableCart = Insider.dom(`${ selectors.addToBag }`).exists() &&
        !(Insider.dom(`${ selectors.addToBag }`).attr('style') === 'display: none;') ||
        Insider.dom(`${ selectors.addToBag }`).attr('style') === undefined;

    let $productStatusElement = '';
    let $productStatusElementTwo = '';
    let isCampaignShown = false;

    const bannedSkuIds = [
        'PROD108145', 'PROD108149', 'PROD108148', 'PROD108147', 'PROD108146', 'PROD108144', 'PROD108165', 'PROD108252',
        'PROD108156', 'PROD108153', 'PROD108257', 'PROD108266', 'PROD108256', 'PROD108255', 'PROD108264', 'PROD108157',
        'PROD108259', 'PROD108254', 'PROD108154', 'PROD108263', 'PROD108150', 'PROD108151', 'PROD108267', 'PROD108268',
        'PROD108261', 'PROD108158', 'PROD108260', 'PROD108269', 'PROD108155', 'PROD108152', 'PROD108927', 'PROD108928',
        'PROD108931', 'PROD106705', 'PROD108930', 'PROD108932', 'PROD108934', 'PROD108935', 'PROD108929', 'PROD108936',
        'PROD310', 'PROD309', 'PROD966', 'PROD22421', 'PROD24921', 'PROD29624', 'PROD29625', 'PROD33080', 'PROD34492',
        'PROD37591', 'PROD119065', 'PROD122830', 'PROD39509', 'PROD44603', 'PROD44604', 'PROD39510', 'PROD46823',
        'PROD46822', 'PROD55714', 'PROD67985', 'PROD75925', 'PROD88936', 'PROD115811', 'PROD115812', 'PROD115813',
        'PROD115814', 'PROD115808', 'PROD115809', 'PROD115810', 'PROD120450', 'PROD120531', 'PROD120279', 'PROD120436',
        'PROD120251', 'PROD120435', 'PROD120442', 'PROD120535', 'PROD120438', 'PROD120437', 'PROD120276', 'PROD120445',
        'PROD120440', 'PROD120446', 'PROD120447', 'PROD120281', 'PROD120277', 'PROD120441', 'PROD120443', 'PROD120453',
        'PROD120449', 'PROD116785', 'PROD121106', 'PROD121110', 'PROD121119', 'PROD121117', 'PROD121122', 'PROD117054',
        'PROD120534', 'PROD121124', 'PROD119586', 'PROD108145', 'PROD108149', 'PROD108148', 'PROD108147', 'PROD108146', 'PROD108144', 'PROD108165', 'PROD108252',
        'PROD108156', 'PROD108153', 'PROD108257', 'PROD108266', 'PROD108256', 'PROD108255', 'PROD108264', 'PROD108157',
        'PROD108259', 'PROD108254', 'PROD108154', 'PROD108263', 'PROD108150', 'PROD108151', 'PROD108267', 'PROD108268',
        'PROD108261', 'PROD108158', 'PROD108260', 'PROD108269', 'PROD108155', 'PROD108152', 'PROD108927', 'PROD108928',
        'PROD108931', 'PROD106705', 'PROD108930', 'PROD108932', 'PROD108934', 'PROD108935', 'PROD108929', 'PROD108936',
        'PROD310', 'PROD309', 'PROD966', 'PROD22421', 'PROD24921', 'PROD29624', 'PROD29625', 'PROD33080', 'PROD34492',
        'PROD37591', 'PROD119065', 'PROD122830', 'PROD39509', 'PROD44603', 'PROD44604', 'PROD39510', 'PROD46823',
        'PROD46822', 'PROD55714', 'PROD67985', 'PROD75925', 'PROD88936', 'PROD115811', 'PROD115812', 'PROD115813',
        'PROD115814', 'PROD115808', 'PROD115809', 'PROD115810', 'PROD120450', 'PROD120531', 'PROD120279', 'PROD120436',
        'PROD120251', 'PROD120435', 'PROD120442', 'PROD120535', 'PROD120438', 'PROD120437', 'PROD120276', 'PROD120445',
        'PROD120440', 'PROD120446', 'PROD120447', 'PROD120281', 'PROD120277', 'PROD120441', 'PROD120443', 'PROD120453',
        'PROD120449', 'PROD116785', 'PROD121106', 'PROD121110', 'PROD121119', 'PROD121117', 'PROD121122', 'PROD117054',
        'PROD120534', 'PROD121124', 'PROD119586', 'PROD108145', 'PROD108149', 'PROD108148', 'PROD108147', 'PROD108146', 'PROD108144', 'PROD108165', 'PROD108252', 'PROD108145', 'PROD108149', 'PROD108148', 'PROD108147', 'PROD108146', 'PROD108144', 'PROD108165', 'PROD108252',
        'PROD108156', 'PROD108153', 'PROD108257', 'PROD108266', 'PROD108256', 'PROD108255', 'PROD108264', 'PROD108157',
        'PROD108259', 'PROD108254', 'PROD108154', 'PROD108263', 'PROD108150', 'PROD108151', 'PROD108267', 'PROD108268',
        'PROD108261', 'PROD108158', 'PROD108260', 'PROD108269', 'PROD108155', 'PROD108152', 'PROD108927', 'PROD108928',
        'PROD108931', 'PROD106705', 'PROD108930', 'PROD108932', 'PROD108934', 'PROD108935', 'PROD108929', 'PROD108936',
        'PROD310', 'PROD309', 'PROD966', 'PROD22421', 'PROD24921', 'PROD29624', 'PROD29625', 'PROD33080', 'PROD34492',
        'PROD37591', 'PROD119065', 'PROD122830', 'PROD39509', 'PROD44603', 'PROD44604', 'PROD39510', 'PROD46823',
        'PROD46822', 'PROD55714', 'PROD67985', 'PROD75925', 'PROD88936', 'PROD115811', 'PROD115812', 'PROD115813',
        'PROD115814', 'PROD115808', 'PROD115809', 'PROD115810', 'PROD120450', 'PROD120531', 'PROD120279', 'PROD120436',
        'PROD120251', 'PROD120435', 'PROD120442', 'PROD120535', 'PROD120438', 'PROD120437', 'PROD120276', 'PROD120445',
        'PROD120440', 'PROD120446', 'PROD120447', 'PROD120281', 'PROD120277', 'PROD120441', 'PROD120443', 'PROD120453',
        'PROD120449', 'PROD116785', 'PROD121106', 'PROD121110', 'PROD121119', 'PROD121117', 'PROD121122', 'PROD117054',
        'PROD120534', 'PROD121124', 'PROD119586', 'PROD108145', 'PROD108149', 'PROD108148', 'PROD108147', 'PROD108146', 'PROD108144', 'PROD108165', 'PROD108252',
        'PROD108156', 'PROD108153', 'PROD108257', 'PROD108266', 'PROD108256', 'PROD108255', 'PROD108264', 'PROD108157',
        'PROD108259', 'PROD108254', 'PROD108154', 'PROD108263', 'PROD108150', 'PROD108151', 'PROD108267', 'PROD108268',
        'PROD108261', 'PROD108158', 'PROD108260', 'PROD108269', 'PROD108155', 'PROD108152', 'PROD108927', 'PROD108928',
        'PROD108931', 'PROD106705', 'PROD108930', 'PROD108932', 'PROD108934', 'PROD108935', 'PROD108929', 'PROD108936',
        'PROD310', 'PROD309', 'PROD966', 'PROD22421', 'PROD24921', 'PROD29624', 'PROD29625', 'PROD33080', 'PROD34492',
        'PROD37591', 'PROD119065', 'PROD122830', 'PROD39509', 'PROD44603', 'PROD44604', 'PROD39510', 'PROD46823',
        'PROD46822', 'PROD55714', 'PROD67985', 'PROD75925', 'PROD88936', 'PROD115811', 'PROD115812', 'PROD115813',
        'PROD115814', 'PROD115808', 'PROD115809', 'PROD115810', 'PROD120450', 'PROD120531', 'PROD120279', 'PROD120436',
        'PROD120251', 'PROD120435', 'PROD120442', 'PROD120535', 'PROD120438', 'PROD120437', 'PROD120276', 'PROD120445',
        'PROD120440', 'PROD120446', 'PROD120447', 'PROD120281', 'PROD120277', 'PROD120441', 'PROD120443', 'PROD120453',
        'PROD120449', 'PROD116785', 'PROD121106', 'PROD121110', 'PROD121119', 'PROD121117', 'PROD121122', 'PROD117054',
        'PROD120534', 'PROD121124', 'PROD119586', 'PROD108145', 'PROD108149', 'PROD108148', 'PROD108147', 'PROD108146', 'PROD108144', 'PROD108165', 'PROD108252', 'PROD37591', 'PROD119065', 'PROD122830', 'PROD39509', 'PROD44603', 'PROD44604', 'PROD39510', 'PROD46823',
        'PROD46822', 'PROD55714', 'PROD67985', 'PROD75925', 'PROD88936', 'PROD115811', 'PROD115812', 'PROD115813',
        'PROD115814', 'PROD115808', 'PROD115809', 'PROD115810', 'PROD120450', 'PROD120531', 'PROD120279', 'PROD120436',
        'PROD120251', 'PROD120435', 'PROD120442', 'PROD120535', 'PROD120438', 'PROD120437', 'PROD120276', 'PROD120445',
        'PROD120440', 'PROD120446', 'PROD120447', 'PROD120281', 'PROD120277', 'PROD120441', 'PROD120443', 'PROD120453',
        'PROD120449', 'PROD116785', 'PROD121106', 'PROD121110', 'PROD121119', 'PROD121117', 'PROD121122', 'PROD117054',
        'PROD120534', 'PROD121124', 'PROD119586', 'PROD108145', 'PROD108149', 'PROD108148', 'PROD108147', 'PROD108146', 'PROD108144', 'PROD108165', 'PROD108252',
        'PROD108156', 'PROD108153', 'PROD108257', 'PROD108266', 'PROD108256', 'PROD108255', 'PROD108264', 'PROD108157',
        'PROD108259', 'PROD108254', 'PROD108154', 'PROD108263', 'PROD108150', 'PROD108151', 'PROD108267', 'PROD108268',
        'PROD108261', 'PROD108158', 'PROD108260', 'PROD108269', 'PROD108155', 'PROD108152', 'PROD108927', 'PROD108928',
        'PROD108931', 'PROD106705', 'PROD108930', 'PROD108932', 'PROD108934', 'PROD108935', 'PROD108929', 'PROD108936',
        'PROD310', 'PROD309', 'PROD966', 'PROD22421', 'PROD24921', 'PROD29624', 'PROD29625', 'PROD33080', 'PROD34492',
        'PROD37591', 'PROD119065', 'PROD122830', 'PROD39509', 'PROD44603', 'PROD44604', 'PROD39510', 'PROD46823',
        'PROD46822', 'PROD55714', 'PROD67985', 'PROD75925', 'PROD88936', 'PROD115811', 'PROD115812', 'PROD115813',
        'PROD115814', 'PROD115808', 'PROD115809', 'PROD115810', 'PROD120450', 'PROD120531', 'PROD120279', 'PROD120436',
        'PROD120251', 'PROD120435', 'PROD120442', 'PROD120535', 'PROD120438', 'PROD120437', 'PROD120276', 'PROD120445',
        'PROD120440', 'PROD120446', 'PROD120447', 'PROD120281', 'PROD120277', 'PROD120441', 'PROD120443', 'PROD120453',
        'PROD120449', 'PROD116785', 'PROD121106', 'PROD121110', 'PROD121119', 'PROD121117', 'PROD121122', 'PROD117054',
        'PROD120534', 'PROD121124', 'PROD119586', 'PROD108145', 'PROD108149', 'PROD108148', 'PROD108147', 'PROD108146', 'PROD108144', 'PROD108165', 'PROD108252',
    ];

    self.init = () => {
        self.reset();
        self.buildCSS();
        self.buildHTML();
        self.setEvents();
    };

    self.reset = () => {
        const { style, wrapper } = selectors;

        Insider.dom(`${ style }, ${ wrapper }`).remove();
    };

    self.buildCSS = () => {
        const { wrapper, priceText, price, saveBadge, marginforMobile, paddingforDesktop, cardHeight, cardHeightForMS,
            cardHeightForMP, marginBottom50, marginBottom60, minHeight500, bottom80 } = selectors;
        const customStyle =
        `${ wrapper } {
            font-family: roboto-condensed-regular,Helvetica,Arial,sans-serif !important;
        }
        ${ priceText } {${ isMobile && !isLandScapeView ? '' : '' }
            display: flex;
            text-transform: uppercase;
            justify-content: flex-start;
            align-items: center;
            font-size: 12px !important;
            color: #E41316 !important;
            margin-left: 0px;
            width: 150px !important;
            border-color: rgb(252, 0, 0) !important;
            font-weight: bold !important;
        }
        ${ price } {
            font-size: 15px;
            color: #E41316 !important;
            display: inline-block !important;
        }
        ${ saveBadge } {
            background-color: red !important;
            color: white !important;
            display: inline-block !important;
            font-weight: bold !important;
            text-transform: none !important;
            padding: 2px 5px !important;
            margin-bottom: 7px !important;
        }
        ${ marginforMobile } {
            margin-top: 15px !important;
            margin-bottom: 15px !important;
        }
        ${ paddingforDesktop } {
            padding-top: 0px !important;
        }
        ${ cardHeight } {
            max-height: 750px !important;
            height: auto !important;
        }
        ${ cardHeightForMS } {
            max-height: unset !important;
            height: auto !important;
        }
        ${ cardHeightForMP } {
            max-height: 610px !important;
            height: auto !important;
        }
        ${ marginBottom50 } {
            margin-bottom: -50px !important;
        }
        ${ marginBottom60 } {
            margin-bottom: 60px !important;
        }
        ${ minHeight500 } {
            min-height: 500px !important;
        }
        ${ bottom80 } {
            bottom: 80px !important;
        }`;

        Insider.dom('<style>').addClass(classes.style).html(customStyle).appendTo('head');
    };

    self.buildHTML = () => {
        const { defaultGoal, cardHeightForMP } = classes;

        let html;
        let price = 0;

        if (isOnCategoryPage && $productStatusElement.exists()) {
            $productStatusElement.nodes.forEach(function (item) {
                const isExecuteProduct = bannedSkuIds.indexOf(Insider.dom(item).attr('data-product-id')) === -1;

                price = Insider.dom(item).find('.product__price--standard:last').text();

                html = self.buildBadgeHtml(price);

                isExecuteProduct && !isControlGroup &&
                    Insider.dom(html).insertAfter(Insider.dom(item).find(isMobile && !isLandScapeView ? '.product_header_details' : '.product__price '));

                isExecuteProduct && Insider.dom(item).find('.product__add-to-bag').addClass(defaultGoal);

                self.addClases(item);

                self.showCampaign();
            });
        } else if (isOnProductPage && isProductAddableCart &&
            bannedSkuIds.indexOf(Insider.dom('.product-full.product-full-v1').attr('data-product-id')) === -1) {
            price = Insider.dom(`.product-full__details-container ${ selectors.productDiscountPrice }`).exists() ?
                Insider.dom(`${ selectors.productDiscountPrice }`).text() :
                Insider.dom('.product-full__price .js-product-price-v1').text();

            html = self.buildBadgeHtml(price);

            !isControlGroup && Insider.dom(html).appendTo('.product-full__price-details');

            Insider.dom(`${ selectors.addToBag }`).addClass(defaultGoal);

            self.showCampaign();
        } else if (isOnCategoryPage && $productStatusElementTwo.exists()) {
            $productStatusElementTwo.nodes.forEach(function (item) {

                const isExecuteProduct = bannedSkuIds.indexOf(Insider.dom(item).attr('data-product-id')) === -1;

                price = Insider.dom(item).find('.product-price.js-product-price:first').text().split(' ')[0] ||
                    Insider.dom(item).find('.product-price--sale').text().split(' ')[0];

                html = self.buildBadgeHtml(price);

                isExecuteProduct && !isControlGroup &&
                    Insider.dom(html).insertAfter(Insider.dom(item).find(isMobile && !isLandScapeView ? '.product-brief__price-details' : '.product-brief__price-details'));

                isExecuteProduct && Insider.dom(item).find('.product__add-to-bag').addClass(defaultGoal);

                Insider.dom(item).parent('.product__add-to-bag').addClass(defaultGoal);

                self.addClases(item);

                self.showCampaign();
            });
        } else if (isOnMainPage) {
            $productStatusElementTwo.nodes.forEach(function (item) {
                const isExecuteProduct = bannedSkuIds.indexOf(Insider.dom(item).attr('data-product-id')) === -1;

                price = Insider.dom(item).find('.product-price.js-product-price:first').text().split(' ')[0] ||
                    Insider.dom(item).find('.product-price--sale').text().split(' ')[0];

                html = self.buildBadgeHtml(price);

                isExecuteProduct && !isControlGroup &&
                    Insider.dom(html).insertAfter(Insider.dom(item).find(isMobile && !isLandScapeView ? '.product-brief__price-details' : '.product-brief__price-details'));

                isExecuteProduct && Insider.dom(item).find('.product__add-to-bag').addClass(defaultGoal);

                !isMobile && Insider.dom(item).parent().addClass(cardHeightForMP);

                self.showCampaign();
            });
        }

    };

    self.calculateDiscount = (price) => {
        let discountedPrice;

        if (isOnCategoryPage && price.indexOf('-') > -1) {
            discountedPrice = [];
            price.split(' - ').forEach(function (item) {
                item = parseFloat(item.replace(' TL', ''));
                discountedPrice.push(self.setDiscount(item));
            });
            discountedPrice = discountedPrice.join(' - ');
        } else {
            price = parseFloat(price.replace(' TL', ''));
            discountedPrice = self.setDiscount(price);
        }

        return discountedPrice;
    };

    self.buildBadgeHtml = (price) => {
        const { wrapper, priceText, saveBadge, price: priceClass, defaultGoal } = classes;

        const discountedPrice = self.calculateDiscount(price);

        const html =
        `<div class="${ wrapper } ${ defaultGoal }">
            <div class="${ priceText }">Sepette %30 İndirim</div>
            <div class="${ priceClass }">${ discountedPrice }</div>
            <div class="${ saveBadge }">Kazancınız: ${ self.calculateSave(price, discountedPrice) }</div>
        </div>`;

        return html;
    };

    self.calculateSave = (price, discountedPrice) => {
        const originalPrices = [];
        const discountedPrices = [];
        let savePrice = 0;
        let isInterval = false;

        if (price.includes(' - ')) {
            isInterval = true;

            if (isOnCategoryPage && price.includes('-') > -1) {
                price.split(' - ').forEach((item) => {
                    item = parseFloat(item.replace(' TL', ''));

                    originalPrices.push(item);
                });

                discountedPrice.split(' - ').forEach((item) => {
                    item = parseFloat(item.replace(' TL', ''));

                    discountedPrices.push(item);
                });

                savePrice = self.calculateGap(originalPrices, discountedPrices, isInterval);
            } else {
                isInterval = false;
                price = parseFloat(price.replace(' TL', ''));

                discountedPrice = self.setDiscount(price);
            }
        } else {
            savePrice = self.calculateGap(price, discountedPrice, isInterval);
        }

        return savePrice;
    };

    self.calculateGap = (price, discountedPrice, isInterval) => (isInterval ?
        `${ (price[0] - discountedPrice[0]).toFixed(2) } - ${ (price[1] - discountedPrice[1]).toFixed(2) } TL` :
        `${ Number(parseFloat(price.replace(' TL', '')) - parseFloat(discountedPrice.replace(' TL', ''))).toFixed(2)
        } TL`);

    self.setDiscount = (value) => `${ (value - value * 30 / 100).toFixed(2) } TL`;

    self.addClases = (item) => {
        const { marginforMobile, paddingforDesktop, cardHeight, cardHeightForMS, marginBottom50, marginBottom60,
            minHeight500, bottom80 } = classes;
        const { productImages, innerCard, cardFooter } = selectors;

        const $item = Insider.dom(item);

        $item.parent().addClass(marginforMobile);

        if (!isMobile) {
            $item.find(selectors.productFooter).addClass(paddingforDesktop);
            $item.parent().addClass(cardHeight);

            Insider.fns.hasParameter('/cok-satanlar') && $item.parent().addClass(cardHeightForMS);

            if (Insider.fns.hasParameter('/products/')) {
                $item.find(productImages).addClass(bottom80);
                $item.closest(innerCard).addClass(minHeight500);
                $item.parent().addClass(marginBottom60);
                Insider.dom(cardFooter).addClass(marginBottom50);
            }
        }
    };

    self.showCampaign = () => {
        if (!isCampaignShown) {
            Insider.campaign.custom.show(variationId);

            isCampaignShown = true;
        }
    };

    self.setEvents = () => {
        Insider.eventManager.once(`resize.ins:view:change:${ variationId }`, window, function () {
            setTimeout(function () {
                isLandScapeView = window.innerWidth > window.innerHeight;

                self.init();
            }, 500);
        });

        Insider.eventManager.once(`click.ins:click:shade:picker:${ variationId }`, '.shade-picker__color', () => {
            self.init();
        });
    };

    if (isOnCategoryPage) {
        setTimeout(function () {
            $productStatusElement = Insider.dom('.product.js-pr-product');
            $productStatusElementTwo = Insider.dom('.product.js-product-brief');

            self.init();
        }, 2000);
    } else if (isOnProductPage) {
        self.init();
    } else if (isOnMainPage) {
        setTimeout(function () {
            $productStatusElement = Insider.dom('.product.js-pr-product');
            $productStatusElementTwo = Insider.dom('.product.js-product-brief');

            self.init();
        }, 2000);
    }
})({});

false;