/* OPT-212167 START */
((self) => {
    'use strict';

    self.getBuilderId = () => {
        if (typeof customRuleDetail !== 'undefined' && customRuleDetail?.builderId !== undefined) {
            return customRuleDetail.builderId;
        }

        if (typeof arguments !== 'undefined' && arguments.length > 0) {
            return arguments[0];
        }

        return undefined;
    };

    const builderId = self.getBuilderId();
    const variationId = Insider.campaign.userSegment.getActiveVariationByBuilderId(builderId);
    const isMobile = Insider.browser.isMobile();

    const classes = {
        customStyleSheet: `ins-custom-style-${ variationId }`,
        wrapper: `ins-wrapper-${ variationId }`,
        title: `ins-title-${ variationId }`,
        info: `ins-info-${ variationId }`,
        sliderWrapper: `ins-slider-wrapper-${ variationId }`,
        sliderContainer: `ins-slider-container-${ variationId }`,
        slide: `ins-slide-${ variationId }`,
        buttons: `ins-buttons-${ variationId }`,
        prevButton: `ins-prev-${ variationId }`,
        nextButton: `ins-next-${ variationId }`,
        dots: `ins-dots-${ variationId }`,
        dot: `ins-dot-${ variationId }`,
        dotActive: `ins-dot-active-${ variationId }`,
        arrowDisabled: `ins-arrow-disabled-${ variationId }`,
        imageWrapper: `ins-image-wrapper-${ variationId }`,
        imageTitle: `ins-image-title-${ variationId }`,
        imageInfo: `ins-image-info-${ variationId }`,
        imageSliderWrapper: `ins-image-slider-wrapper-${ variationId }`,
        imageSliderContainer: `ins-image-slider-container-${ variationId }`,
        imageSlide: `ins-image-slide-${ variationId }`,
        image: `ins-image-${ variationId }`,
        cardContainer: `ins-card-container-${ variationId }`,
        cardTitle: `ins-card-title-${ variationId }`,
        cardInfo: `ins-card-information-dynamic-${ variationId }`,
        bold: `ins-bold-${ variationId }`,
        imageButtons: `ins-image-buttons-${ variationId }`,
        imagePrevButton: `ins-image-prev-${ variationId }`,
        imageNextButton: `ins-image-next-${ variationId }`,
        imageDots: `ins-image-dots-${ variationId }`,
        imageDot: `ins-image-dot-${ variationId }`,
        imageDotActive: `ins-image-dot-active-${ variationId }`,
        imageRedirectionButton: `ins-image-redirection-button-${ variationId }`
    };

    const selectors = Insider.fns.keys(classes).reduce((createdSelector, key) => (
        createdSelector[key] = `.${ classes[key] }`, createdSelector
    ), {
        appendLocation: '.hero_myfriday-2025.vendas.home'
    });

    const config = {
        title: 'No Mycon sua conquista vale a pena',
        subtitle: 'Faça a escolha certa e aproveite as vantagens:',
        slides: [
            {
                svg: '<svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="38" height="38" rx="7.03704" fill="#E7ECFF"></rect><g clip-path="url(#clip0_4700_159)"><path opacity="0.2" d="M8 14.8932V26.1432C16.5912 21.9461 20.4088 30.1136 29 25.9164V14.6664C20.4088 18.8636 16.5912 10.6961 8 14.8932ZM18.5 22.6548C18.055 22.6548 17.62 22.5229 17.25 22.2756C16.88 22.0284 16.5916 21.677 16.4213 21.2658C16.251 20.8547 16.2064 20.4023 16.2932 19.9659C16.38 19.5294 16.5943 19.1285 16.909 18.8138C17.2237 18.4992 17.6246 18.2849 18.061 18.198C18.4975 18.1112 18.9499 18.1558 19.361 18.3261C19.7722 18.4964 20.1236 18.7848 20.3708 19.1548C20.618 19.5248 20.75 19.9598 20.75 20.4048C20.75 21.0015 20.5129 21.5738 20.091 21.9958C19.669 22.4178 19.0967 22.6548 18.5 22.6548Z" fill="#363455"></path><path d="M29 25.9164C20.4088 30.1136 16.5912 21.9461 8 26.1432V14.8932C16.5912 10.6961 20.4088 18.8636 29 14.6664V25.9164Z" stroke="#363455" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M18.5 22.6548C19.7426 22.6548 20.75 21.6474 20.75 20.4048C20.75 19.1621 19.7426 18.1548 18.5 18.1548C17.2574 18.1548 16.25 19.1621 16.25 20.4048C16.25 21.6474 17.2574 22.6548 18.5 22.6548Z" stroke="#363455" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M11 17.4048V21.9048" stroke="#363455" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M26 18.9048V23.4048" stroke="#363455" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></g><g clip-path="url(#clip1_4700_159)"><path opacity="0.2" d="M25.5475 15.1667C27.5989 15.1667 29.2618 13.5037 29.2618 11.4524C29.2618 9.40104 27.5989 7.7381 25.5475 7.7381C23.4962 7.7381 21.8333 9.40104 21.8333 11.4524C21.8333 13.5037 23.4962 15.1667 25.5475 15.1667Z" fill="#363455"></path><path d="M26.7858 10.2143L24.3096 12.6905" stroke="#363455" stroke-width="0.619048" stroke-linecap="round" stroke-linejoin="round"></path><path d="M24.3096 10.2143L26.7858 12.6905" stroke="#363455" stroke-width="0.619048" stroke-linecap="round" stroke-linejoin="round"></path><path d="M25.5475 15.1667C27.5989 15.1667 29.2618 13.5037 29.2618 11.4524C29.2618 9.40104 27.5989 7.7381 25.5475 7.7381C23.4962 7.7381 21.8333 9.40104 21.8333 11.4524C21.8333 13.5037 23.4962 15.1667 25.5475 15.1667Z" stroke="#363455" stroke-width="0.619048" stroke-linecap="round" stroke-linejoin="round"></path></g><rect x="14.119" y="28.5952" width="8.7619" height="1.90476" rx="0.952381" fill="#0131FF"></rect><defs><clipPath id="clip0_4700_159"><rect width="24" height="24" fill="white" transform="translate(6.5 8.40479)"></rect></clipPath><clipPath id="clip1_4700_159"><rect width="9.90476" height="9.90476" fill="white" transform="translate(20.5953 6.5)"></rect></clipPath></defs></svg>',
                text: 'Sem juros, sem entrada'
            },
            {
                svg: '<svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="38" height="38" rx="7.03704" fill="#E7ECFF"/><g clip-path="url(#clip0_4692_8)"><path opacity="0.2" d="M11.75 10.4286H25.25V16.3442C25.25 20.0661 22.2734 23.1505 18.5516 23.1786C17.6608 23.1854 16.7775 23.0158 15.9526 22.6797C15.1277 22.3435 14.3775 21.8474 13.7452 21.2199C13.113 20.5924 12.6111 19.846 12.2687 19.0237C11.9263 18.2013 11.75 17.3194 11.75 16.4286V10.4286Z" fill="#363455"/><path d="M15.5 26.9286H21.5" stroke="#363455" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M18.5 23.1786V26.9286" stroke="#363455" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M11.9375 17.9286H11C10.2044 17.9286 9.44129 17.6125 8.87868 17.0499C8.31607 16.4873 8 15.7242 8 14.9286V13.4286C8 13.2297 8.07902 13.0389 8.21967 12.8983C8.36032 12.7576 8.55109 12.6786 8.75 12.6786H11.75" stroke="#363455" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M25.0625 17.9286H26C26.7956 17.9286 27.5587 17.6125 28.1213 17.0499C28.6839 16.4873 29 15.7242 29 14.9286V13.4286C29 13.2297 28.921 13.0389 28.7803 12.8983C28.6397 12.7576 28.4489 12.6786 28.25 12.6786H25.25" stroke="#363455" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M11.75 10.4286H25.25V16.3442C25.25 20.0661 22.2734 23.1505 18.5516 23.1786C17.6608 23.1854 16.7775 23.0158 15.9526 22.6797C15.1277 22.3435 14.3775 21.8474 13.7452 21.2199C13.113 20.5924 12.6111 19.846 12.2687 19.0237C11.9263 18.2013 11.75 17.3194 11.75 16.4286V10.4286Z" stroke="#363455" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><rect x="14.119" y="28.7857" width="8.7619" height="1.90476" rx="0.952381" fill="#0131FF"/></g><defs><clipPath id="clip0_4692_8"><rect width="24" height="24" fill="white" transform="translate(6.5 6.5)"/></clipPath></defs></svg>',
                text: 'Contempla até 2x mais do que outros consórcios'
            },
            {
                svg: '<svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="38" height="38" rx="7.03704" fill="#E7ECFF"/><g clip-path="url(#clip0_4700_193)"><path opacity="0.2" d="M10.0494 21.4038C10.0494 21.7773 10.1978 22.1356 10.462 22.3997C10.7261 22.6638 11.0843 22.8122 11.4579 22.8122H12.8663C13.2398 22.8122 13.5981 22.6638 13.8622 22.3997C14.1263 22.1356 14.2747 21.7773 14.2747 21.4038V17.8827C14.2747 17.5092 14.1263 17.151 13.8622 16.8868C13.5981 16.6227 13.2398 16.4743 12.8663 16.4743H10.0494V21.4038Z" fill="black"/><path opacity="0.2" d="M24.1337 16.4743C23.7602 16.4743 23.4019 16.6227 23.1378 16.8868C22.8737 17.151 22.7253 17.5092 22.7253 17.8827V21.4038C22.7253 21.7773 22.8737 22.1356 23.1378 22.3997C23.4019 22.6638 23.7602 22.8122 24.1337 22.8122H26.9506V16.4743H24.1337Z" fill="black"/><path d="M26.9506 22.8123V23.5165C26.9506 24.2636 26.6538 24.9801 26.1255 25.5083C25.5973 26.0366 24.8808 26.3334 24.1337 26.3334H19.2042" stroke="#0131FF" stroke-width="1.40842" stroke-linecap="round" stroke-linejoin="round"/><path d="M26.9505 16.4744H24.1337C23.7601 16.4744 23.4019 16.6227 23.1378 16.8869C22.8736 17.151 22.7253 17.5092 22.7253 17.8828V21.4038C22.7253 21.7774 22.8736 22.1356 23.1378 22.3997C23.4019 22.6639 23.7601 22.8123 24.1337 22.8123H26.9505V16.4744ZM26.9505 16.4744C26.9505 15.3646 26.732 14.2657 26.3073 13.2405C25.8826 12.2152 25.2601 11.2836 24.4754 10.4989C23.6907 9.71421 22.7591 9.09174 21.7339 8.66706C20.7086 8.24238 19.6097 8.0238 18.5 8.0238C17.3902 8.0238 16.2914 8.24238 15.2661 8.66706C14.2408 9.09174 13.3093 9.71421 12.5245 10.4989C11.7398 11.2836 11.1174 12.2152 10.6927 13.2405C10.268 14.2657 10.0494 15.3646 10.0494 16.4744M10.0494 16.4744V21.4038C10.0494 21.7774 10.1978 22.1356 10.462 22.3997C10.7261 22.6639 11.0843 22.8123 11.4579 22.8123H12.8663C13.2398 22.8123 13.5981 22.6639 13.8622 22.3997C14.1263 22.1356 14.2747 21.7774 14.2747 21.4038V17.8828C14.2747 17.5092 14.1263 17.151 13.8622 16.8869C13.5981 16.6227 13.2398 16.4744 12.8663 16.4744H10.0494Z" stroke="black" stroke-width="1.40842" stroke-linecap="round" stroke-linejoin="round"/><rect x="14.119" y="28.2143" width="8.7619" height="1.90476" rx="0.952381" fill="#0131FF"/></g><defs><clipPath id="clip0_4700_193"><rect width="24" height="24" fill="white" transform="translate(6.5 6.5)"/></clipPath></defs></svg>',
                text: 'Especialistas disponíveis para o que precisar'
            },
            {
                svg: '<svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="38" height="38" rx="7.03704" fill="#E7ECFF"/><g clip-path="url(#clip0_4700_205)"><path opacity="0.2" d="M21.2619 11.4286H10.6905V23.3215H21.2619V11.4286Z" fill="#363455"/><path d="M19.9405 8.78571H12.0119C11.2821 8.78571 10.6905 9.37733 10.6905 10.1071V24.6428C10.6905 25.3727 11.2821 25.9643 12.0119 25.9643H19.9405C20.6703 25.9643 21.2619 25.3727 21.2619 24.6428V10.1071C21.2619 9.37733 20.6703 8.78571 19.9405 8.78571Z" stroke="#363455" stroke-width="1.32143" stroke-linecap="round" stroke-linejoin="round"/><path d="M10.6905 11.4286H21.2619" stroke="#363455" stroke-width="1.32143" stroke-linecap="round" stroke-linejoin="round"/><path d="M10.6905 23.3215H21.2619" stroke="#363455" stroke-width="1.32143" stroke-linecap="round" stroke-linejoin="round"/><g clip-path="url(#clip1_4700_205)"><path opacity="0.2" d="M24.8779 12.1221L23.0743 11.4575C23.0246 11.4392 22.9817 11.406 22.9514 11.3625C22.9211 11.3191 22.9048 11.2673 22.9048 11.2143C22.9048 11.1613 22.9211 11.1096 22.9514 11.0661C22.9817 11.0226 23.0246 10.9894 23.0743 10.9711L24.8779 10.3065L25.5424 8.50294C25.5608 8.45321 25.594 8.4103 25.6374 8.37999C25.6809 8.34968 25.7327 8.33344 25.7857 8.33344C25.8387 8.33344 25.8904 8.34968 25.9339 8.37999C25.9774 8.4103 26.0106 8.45321 26.0289 8.50294L26.6935 10.3065L28.4971 10.9711C28.5468 10.9894 28.5897 11.0226 28.62 11.0661C28.6503 11.1096 28.6666 11.1613 28.6666 11.2143C28.6666 11.2673 28.6503 11.3191 28.62 11.3625C28.5897 11.406 28.5468 11.4392 28.4971 11.4575L26.6935 12.1221L26.0289 13.9257C26.0106 13.9754 25.9774 14.0183 25.9339 14.0486C25.8904 14.0789 25.8387 14.0952 25.7857 14.0952C25.7327 14.0952 25.6809 14.0789 25.6374 14.0486C25.594 14.0183 25.5608 13.9754 25.5424 13.9257L24.8779 12.1221Z" fill="#0131FF"/><path d="M24.8779 12.1221L23.0743 11.4575C23.0246 11.4392 22.9817 11.406 22.9514 11.3625C22.9211 11.3191 22.9048 11.2673 22.9048 11.2143C22.9048 11.1613 22.9211 11.1096 22.9514 11.0661C22.9817 11.0226 23.0246 10.9894 23.0743 10.9711L24.8779 10.3065L25.5424 8.50294C25.5608 8.45321 25.594 8.4103 25.6374 8.37999C25.6809 8.34968 25.7327 8.33344 25.7857 8.33344C25.8387 8.33344 25.8904 8.34968 25.9339 8.37999C25.9774 8.4103 26.0106 8.45321 26.0289 8.50294L26.6935 10.3065L28.4971 10.9711C28.5468 10.9894 28.5897 11.0226 28.62 11.0661C28.6503 11.1096 28.6666 11.1613 28.6666 11.2143C28.6666 11.2673 28.6503 11.3191 28.62 11.3625C28.5897 11.406 28.5468 11.4392 28.4971 11.4575L26.6935 12.1221L26.0289 13.9257C26.0106 13.9754 25.9774 14.0183 25.9339 14.0486C25.8904 14.0789 25.8387 14.0952 25.7857 14.0952C25.7327 14.0952 25.6809 14.0789 25.6374 14.0486C25.594 14.0183 25.5608 13.9754 25.5424 13.9257L24.8779 12.1221Z" stroke="#0131FF" stroke-width="0.902857" stroke-linecap="round" stroke-linejoin="round"/><path d="M27.881 7.0238V8.59523" stroke="#0131FF" stroke-width="0.523809" stroke-linecap="round" stroke-linejoin="round"/><path d="M29.4524 8.85706V9.90467" stroke="#0131FF" stroke-width="0.523809" stroke-linecap="round" stroke-linejoin="round"/><path d="M27.0953 7.80945H28.6667" stroke="#0131FF" stroke-width="0.523809" stroke-linecap="round" stroke-linejoin="round"/><path d="M28.9286 9.38104H29.9762" stroke="#0131FF" stroke-width="0.523809" stroke-linecap="round" stroke-linejoin="round"/></g><rect x="14.119" y="28.2143" width="8.7619" height="1.90476" rx="0.952381" fill="#0131FF"/></g><defs><clipPath id="clip0_4700_205"><rect width="24" height="24" fill="white" transform="translate(6.5 6.5)"/></clipPath><clipPath id="clip1_4700_205"><rect width="8.38095" height="8.38095" fill="white" transform="translate(22.119 6.5)"/></clipPath></defs></svg>',
                text: 'Especialistas disponíveis para o que precisar'
            },
            {
                svg: '<svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="38" height="38" rx="7.03704" fill="#E7ECFF"/><g clip-path="url(#clip0_4700_56)"><path opacity="0.2" d="M11.109 18.0319H14.7653V25.9606H11.109C10.956 25.9606 10.809 25.8998 10.7008 25.7916C10.5928 25.6835 10.5319 25.5372 10.5319 25.3844V18.609C10.5319 18.456 10.5926 18.309 10.7008 18.2008C10.809 18.0926 10.956 18.0319 11.109 18.0319Z" fill="#0131FF" stroke="#0131FF" stroke-width="0.0782149"/><path d="M11.1087 17.9928H14.8044V26H11.1087C10.9454 26 10.7887 25.9352 10.6732 25.8196C10.5577 25.7041 10.4928 25.5475 10.4928 25.3841V18.6087C10.4928 18.4454 10.5577 18.2887 10.6732 18.1732C10.7887 18.0577 10.9454 17.9928 11.1087 17.9928Z" stroke="#0131FF" stroke-width="1.25144" stroke-linecap="round" stroke-linejoin="round"/><path d="M14.8043 17.9928L17.884 11.8334C18.5375 11.8334 19.1641 12.0929 19.6262 12.555C20.0882 13.017 20.3478 13.6437 20.3478 14.2971V16.145H25.2753C25.4501 16.145 25.6228 16.1822 25.7821 16.2542C25.9413 16.3261 26.0835 16.4311 26.199 16.5622C26.3146 16.6932 26.4009 16.8474 26.4523 17.0144C26.5038 17.1814 26.5191 17.3575 26.4972 17.5308L25.5733 24.9221C25.5358 25.2198 25.391 25.4935 25.166 25.692C24.9411 25.8904 24.6514 26 24.3514 26H14.8043" stroke="#363455" stroke-width="1.25144" stroke-linecap="round" stroke-linejoin="round"/><rect x="14.119" y="28.2143" width="8.7619" height="1.90476" rx="0.952381" fill="#0131FF"/><g clip-path="url(#clip1_4700_56)"><path opacity="0.2" d="M12.0239 14.75C12.6485 14.75 13.1548 14.2437 13.1548 13.6191C13.1548 12.9944 12.6485 12.4881 12.0239 12.4881C11.3993 12.4881 10.8929 12.9944 10.8929 13.6191C10.8929 14.2437 11.3993 14.75 12.0239 14.75Z" fill="#0131FF"/><path opacity="0.2" d="M10.2143 12.9405C10.714 12.9405 11.1191 12.5354 11.1191 12.0357C11.1191 11.5361 10.714 11.131 10.2143 11.131C9.71465 11.131 9.30957 11.5361 9.30957 12.0357C9.30957 12.5354 9.71465 12.9405 10.2143 12.9405Z" fill="#0131FF"/><path opacity="0.2" d="M13.8334 12.9405C14.333 12.9405 14.7381 12.5354 14.7381 12.0357C14.7381 11.5361 14.333 11.131 13.8334 11.131C13.3337 11.131 12.9286 11.5361 12.9286 12.0357C12.9286 12.5354 13.3337 12.9405 13.8334 12.9405Z" fill="#0131FF"/><path d="M13.8334 12.9405C14.0968 12.9403 14.3566 13.0015 14.5922 13.1193C14.8278 13.2371 15.0326 13.4082 15.1905 13.6191" stroke="#0131FF" stroke-width="0.452381" stroke-linecap="round" stroke-linejoin="round"/><path d="M8.85718 13.6191C9.01506 13.4082 9.21993 13.2371 9.45552 13.1193C9.69111 13.0015 9.95092 12.9403 10.2143 12.9405" stroke="#0131FF" stroke-width="0.452381" stroke-linecap="round" stroke-linejoin="round"/><path d="M12.0239 14.75C12.6485 14.75 13.1548 14.2437 13.1548 13.6191C13.1548 12.9944 12.6485 12.4881 12.0239 12.4881C11.3993 12.4881 10.8929 12.9944 10.8929 13.6191C10.8929 14.2437 11.3993 14.75 12.0239 14.75Z" stroke="#0131FF" stroke-width="0.452381" stroke-linecap="round" stroke-linejoin="round"/><path d="M10.4406 15.6548C10.6029 15.3792 10.8344 15.1508 11.1121 14.9921C11.3898 14.8335 11.7041 14.75 12.0239 14.75C12.3437 14.75 12.658 14.8335 12.9357 14.9921C13.2134 15.1508 13.4448 15.3792 13.6072 15.6548" stroke="#0131FF" stroke-width="0.452381" stroke-linecap="round" stroke-linejoin="round"/><path d="M12.9569 11.8096C12.9992 11.6457 13.0866 11.497 13.2092 11.3804C13.3317 11.2637 13.4845 11.1838 13.6503 11.1496C13.816 11.1155 13.9879 11.1284 14.1467 11.1871C14.3054 11.2458 14.4444 11.3478 14.5481 11.4815C14.6517 11.6153 14.7158 11.7754 14.733 11.9437C14.7502 12.112 14.7199 12.2818 14.6455 12.4338C14.571 12.5857 14.4555 12.7137 14.3119 12.8033C14.1684 12.8929 14.0026 12.9404 13.8334 12.9405" stroke="#0131FF" stroke-width="0.452381" stroke-linecap="round" stroke-linejoin="round"/><path d="M10.2142 12.9405C10.045 12.9404 9.87925 12.8929 9.73571 12.8033C9.59216 12.7137 9.47661 12.5857 9.40218 12.4338C9.32775 12.2818 9.29742 12.112 9.31463 11.9437C9.33184 11.7754 9.39591 11.6153 9.49956 11.4815C9.60321 11.3478 9.74228 11.2458 9.90099 11.1871C10.0597 11.1284 10.2317 11.1155 10.3974 11.1496C10.5631 11.1838 10.7159 11.2637 10.8385 11.3804C10.961 11.497 11.0484 11.6457 11.0907 11.8096" stroke="#0131FF" stroke-width="0.452381" stroke-linecap="round" stroke-linejoin="round"/></g></g><defs><clipPath id="clip0_4700_56"><rect width="24" height="24" fill="white" transform="translate(6.5 6.5)"/></clipPath><clipPath id="clip1_4700_56"><rect width="7.2381" height="7.2381" fill="white" transform="translate(8.40479 9.54761)"/></clipPath></defs></svg>',
                text: 'Recomendado por 9 em cada 10 clientes'
            },
            {
                svg: '<svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="38" height="38" rx="7.03704" fill="#E7ECFF"/><g clip-path="url(#clip0_4700_97)"><path opacity="0.2" d="M14.625 26.75C16.0747 26.75 17.25 25.5747 17.25 24.125C17.25 22.6753 16.0747 21.5 14.625 21.5C13.1753 21.5 12 22.6753 12 24.125C12 25.5747 13.1753 26.75 14.625 26.75Z" fill="#0131FF"/><path d="M14.625 26.75C16.0747 26.75 17.25 25.5747 17.25 24.125C17.25 22.6753 16.0747 21.5 14.625 21.5C13.1753 21.5 12 22.6753 12 24.125C12 25.5747 13.1753 26.75 14.625 26.75Z" stroke="#0131FF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 13.25L15.75 17" stroke="#363455" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M15.75 13.25L12 17" stroke="#363455" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M24.75 22.25L28.5 26" stroke="#363455" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M28.5 22.25L24.75 26" stroke="#363455" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 14V10.25H24.75" stroke="#363455" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 10.25L22.5 11.75C26.25 15.5 23.25 20 20.25 20.75" stroke="#363455" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><rect x="15.119" y="28.3702" width="8.7619" height="1.90476" rx="0.952381" fill="#0131FF"/></g><defs><clipPath id="clip0_4700_97"><rect width="24" height="24" fill="white" transform="translate(7.5 6.5)"/></clipPath></defs></svg>',
                text: 'Estratégias para contemplação'
            },
            {
                svg: '<svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="38" height="38" rx="7.03704" fill="#E7ECFF"/><g clip-path="url(#clip0_4700_132)"><path opacity="0.2" d="M12 26H9C8.80109 26 8.61032 25.921 8.46967 25.7803C8.32902 25.6397 8.25 25.4489 8.25 25.25V21.5C8.25 21.3011 8.32902 21.1103 8.46967 20.9697C8.61032 20.829 8.80109 20.75 9 20.75H12V26Z" fill="#363455"/><path opacity="0.2" d="M26.625 11.75C26.2358 11.7502 25.8515 11.837 25.5 12.004C25.4745 11.441 25.2684 10.9012 24.9123 10.4644C24.5563 10.0275 24.069 9.7169 23.5227 9.57841C22.9764 9.43993 22.4001 9.48093 21.8789 9.69537C21.3577 9.90981 20.9194 10.2863 20.6287 10.7691C20.3381 11.252 20.2105 11.8156 20.265 12.3765C20.3194 12.9374 20.5529 13.466 20.931 13.8839C21.3091 14.3019 21.8116 14.587 22.3643 14.6972C22.917 14.8075 23.4905 14.7369 24 14.4959C24.0237 15.0093 24.1975 15.5044 24.5 15.9199C24.8024 16.3353 25.2202 16.6529 25.7014 16.8332C26.1827 17.0134 26.7063 17.0485 27.2072 16.9339C27.7082 16.8194 28.1646 16.5603 28.5197 16.1889C28.8748 15.8174 29.1131 15.3499 29.2049 14.8442C29.2968 14.3386 29.2382 13.8171 29.0365 13.3445C28.8347 12.8718 28.4987 12.4688 28.07 12.1853C27.6413 11.9019 27.1389 11.7505 26.625 11.75Z" fill="#0131FF"/><path d="M26.625 17C28.0747 17 29.25 15.8247 29.25 14.375C29.25 12.9253 28.0747 11.75 26.625 11.75C25.1753 11.75 24 12.9253 24 14.375C24 15.8247 25.1753 17 26.625 17Z" stroke="#0131FF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 26H9C8.80109 26 8.61032 25.921 8.46967 25.7803C8.32902 25.6397 8.25 25.4489 8.25 25.25V21.5C8.25 21.3011 8.32902 21.1103 8.46967 20.9697C8.61032 20.829 8.80109 20.75 9 20.75H12" stroke="#363455" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M18 21.5H21L27.2812 20.0553C27.5122 19.992 27.7546 19.9829 27.9897 20.0285C28.2247 20.0741 28.4461 20.1734 28.6365 20.3185C28.827 20.4636 28.9814 20.6507 29.0878 20.8652C29.1942 21.0797 29.2497 21.3159 29.25 21.5553C29.2501 21.8444 29.1697 22.1279 29.0176 22.3738C28.8656 22.6197 28.648 22.8184 28.3894 22.9475L24.75 24.5L18.75 26H12V20.75L14.3438 18.4063C14.5532 18.1975 14.8018 18.0321 15.0753 17.9195C15.3488 17.8069 15.6418 17.7493 15.9375 17.75H20.625C21.1223 17.75 21.5992 17.9476 21.9508 18.2992C22.3025 18.6508 22.5 19.1277 22.5 19.625C22.5 20.1223 22.3025 20.5992 21.9508 20.9508C21.5992 21.3025 21.1223 21.5 20.625 21.5H18Z" stroke="#363455" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M24 14.4959C23.4905 14.7369 22.917 14.8075 22.3643 14.6972C21.8116 14.587 21.3091 14.3019 20.931 13.8839C20.5529 13.466 20.3194 12.9374 20.265 12.3765C20.2105 11.8156 20.3381 11.252 20.6287 10.7691C20.9194 10.2863 21.3577 9.90981 21.8789 9.69537C22.4001 9.48093 22.9764 9.43993 23.5227 9.57841C24.069 9.7169 24.5563 10.0275 24.9123 10.4644C25.2684 10.9012 25.4745 11.441 25.5 12.004" stroke="#0131FF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><rect x="15.1191" y="28.4048" width="8.7619" height="1.90476" rx="0.952381" fill="#0131FF"/></g><defs><clipPath id="clip0_4700_132"><rect width="24" height="24" fill="white" transform="translate(7.5 6.5)"/></clipPath></defs></svg>',
                text: 'Benefícios exclusivos –MyCoins e MyCotas'
            }
        ],
        imageConfig: {
            title: 'Não sabe o que é consórcio?',
            subtitle: 'Vem entender:',
            slides: [
                {
                    image: 'https://web-image.useinsider.com/mycon/defaultImageLibrary/first-1763748100.png',
                    title: 'O que é?',
                    description: [
                        { description: 'O consórcio é uma forma de conquistar o que você tanto deseja, de uma maneira planejada, sem juros e sem entrada.', isBold: false },
                        { description: 'Não é empréstimo ou financiamento, é melhor!', isBold: true }
                    ]
                },
                {
                    image: 'https://web-image.useinsider.com/mycon/defaultImageLibrary/second-1763748104.png',
                    title: 'Escolha o valor da sua carta de crédito',
                    description: [
                        { description: 'Você escolhe o valor do crédito que precisa para comprar o que deseja – um carro, por exemplo.', isBold: false },
                        { description: 'Em seguida, entra em um grupo, com pessoas que tenham esse mesmo objetivo. Então, passa a pagar parcelas mensais durante o prazo escolhido no seu plano.', isBold: false }
                    ]
                },
                {
                    image: 'https://web-image.useinsider.com/mycon/defaultImageLibrary/third-1763748112.png',
                    title: 'Acompanhe as assembleias',
                    description: [
                        { description: 'Uma vez por mês é realizada o que chamamos de assembleia, onde são liberados os créditos para a aquisição do bem desejado.', isBold: false },
                        { description: 'Existem duas maneiras de ser contemplado, ou seja, receber o direito de utilizar a sua carta de crédito. A primeira é através de sorteio. A outra é através de lances.', isBold: false }
                    ]
                },
                {
                    image: 'https://web-image.useinsider.com/mycon/defaultImageLibrary/fourth-1763748115.png',
                    title: 'Use estratégias',
                    description: [
                        { description: 'Dar lances é uma ótima estratégia para aumentar as chances de contemplação. Você pode ofertar lances todos os meses, inclusive utilizando parte da sua carta de crédito', isBold: false },
                        { description: 'Eles são divididos em lance fixo (porcentagem predefinida) ou lance livre (valor à sua escolha).', isBold: false },
                        { description: 'Quem dá o lance vencedor é contemplado! ', isBold: false }
                    ]
                }, {
                    image: 'https://web-image.useinsider.com/mycon/defaultImageLibrary/fifth-1763748119.png',
                    title: 'Se prepare para a contemplação ',
                    description: [
                        { description: 'Quando sua cota é contemplada, seja por sorteio ou lance, é hora de conquistar seu sonho!', isBold: false },
                        { description: 'E sabe o que é melhor? Você terá poder de negociação à vista e pode até adquirir o bem com descontos! ', isBold: false }
                    ]
                }, {
                    image: 'https://web-image.useinsider.com/mycon/defaultImageLibrary/sixth-1763748128.png',
                    title: 'Ok, e por que consórcio vale a pena?',
                    description: [
                        { description: 'Porque você economiza! Ao contrário do financiamento, você compra seu bem sem pagar juros ou entrada, com parcelas acessíveis e planejamento inteligente. ', isBold: false },
                    ]
                },
            ],
            buttonText: 'Simular agora',
            buttonSvg: '<svg width="25" height="22" viewBox="0 0 25 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.77 0.659821L22.7828 10.6727M22.7828 10.6727L12.77 20.6855M22.7828 10.6727L0 10.6727" stroke="white" stroke-width="1.86625"></path></svg>',
            redirectionLink: 'https://simule.mycon.com.br/'
        }
    };

    self.init = () => {
        if (Insider.campaign.get(variationId ?? 0)?.hus ?
            Insider.storage.get('ucd-segment-data')?.[builderId] : variationId) {
            if (!Insider.campaign.isControlGroup(variationId)) {
                self.buildCampaign();
            }

            Insider.campaign.custom.show(variationId);
        }
    };

    self.buildCampaign = () => {
        Insider.fns.onElementLoaded(selectors.appendLocation, () => {
            setTimeout(() => {
                self.reset();
                self.buildCSS();
                self.buildHTML();
                self.setEvents();
            }, 500);
        }).listen();
    };

    self.reset = () => {
        const { customStyleSheet, wrapper, imageWrapper } = selectors;

        Insider.dom(`${ customStyleSheet }, ${ wrapper }, ${ imageWrapper }`).remove();
    };

    self.buildCSS = () => {
        const { wrapper, title, info, sliderWrapper, sliderContainer, slide,
            buttons, arrowDisabled, dots, dot, dotActive, imageWrapper, imageTitle, imageInfo,
            imageSliderWrapper, imageSliderContainer, imageSlide, imageButtons,
            image, cardContainer, cardTitle, cardInfo, bold,
            imageDots, imageDot, imageDotActive, imageRedirectionButton } = selectors;

        const customStyle = `
        ${ wrapper } {
            margin: 0;
            width: 100%;
            height: 300px;
            display: flex;
            flex-direction: column;
            align-items: center;
            background: #003BCE;
            overflow: hidden;
            gap: 20px;
            position: relative;
            justify-content: center;
        }
        ${ title } {
            font-size: 24px;
            color: #fff;
            font-weight: 700;
        }
        ${ info } {
            font-size: 16px;
            font-weight: 500;
            color: #fff;
        }
        ${ sliderContainer } {
            height: 100px;
            display: flex;
            flex-direction: row;
            gap: 16px;
            margin: 0 auto !important;
            transition: transform 0.4s ease;
        }
        ${ slide } {
            background: #fff;
            border-radius: 16px;
            height: 70px !important;
            display: flex;
            align-items: center;
            font-size: 16px;
            font-weight: 700;
            padding: 16px 8px;
            min-width: 300px;
            gap: 12px;
            line-height: 110%;
        }
        ${ slide } svg {
            flex-shrink: 0;
        }
        ${ sliderWrapper } {
            width: 75%;
            overflow: hidden;
            margin: 0 auto;
        }
        ${ buttons } {
            width: 80%;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        ${ dots } {
            display: flex;
            gap: 8px;
            align-items: center;
        }
        ${ dot } {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            border: none;
            cursor: default;
            pointer-events: none;
            transition: background 0.3s ease;
        }
        ${ dotActive } {
            background: rgba(255, 255, 255, 1);
        }
        ${ buttons } button {
            background: transparent;
            color: #fff;
            border: 1px solid #fff;
            border-radius: 20px;
            width: 27px;
            height: 27px;
            cursor: pointer;
            font-size: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            user-select: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
        }
        ${ buttons } button:hover {
            background: rgba(255, 255, 255, 0.1);
        }
        ${ arrowDisabled } {
            opacity: 0.3;
            cursor: not-allowed;
            pointer-events: none;
        }
        ${ imageWrapper } {
            margin: 0;
            width: 100%;
            height: 948px;
            display: flex;
            flex-direction: column;
            align-items: center;
            background: #fff;
            overflow: hidden;
            gap: 20px;
            position: relative;
            padding-top: 20px;
        }
        ${ imageTitle } {
            font-size: 24px;
            color: #363455;
            font-weight: 700;
        }
        ${ imageInfo } {
            font-size: 16px;
            font-weight: 500;
            color: #363455;
        }
        ${ imageSliderWrapper } {
            width: 75%;
            overflow: hidden;
            margin: 0 auto;
        }
        ${ imageSliderContainer } {
            display: flex;
            flex-direction: row;
            gap: 16px;
            margin: 0 auto !important;
            transition: transform 0.4s ease;
        }
        ${ imageSlide } {
            background: #fff;
            border: 1px solid;
            border-radius: 16px;
            display: flex;
            font-size: 18px;
            font-weight: 700;
            padding: 4px 4px;
            width: 347px;
            min-width: 347px;
            height: 556px !important;
            margin: 0 auto;
            flex-direction: column;
        }
        ${ imageButtons } {
            width: 80%;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        ${ imageDots } {
            display: flex;
            gap: 8px;
            align-items: center;
        }
        ${ imageDot } {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: rgba(54, 52, 85, 0.3);
            border: none;
            cursor: default;
            pointer-events: none;
            transition: background 0.3s ease;
        }
        ${ imageDotActive } {
            background: rgba(54, 52, 85, 1);
        }
        ${ imageButtons } button {
            background: transparent;
            color: #363455;
            border: 1px solid #363455;
            border-radius: 10px;
            background: transparent;
            border-radius: 20px;
            width: 27px;
            height: 27px;
            cursor: pointer;
            font-size: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            user-select: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
        }
        ${ imageButtons } button:hover {
            background: rgba(54, 52, 85, 0.1);
        }
        ${ image } {
            width: 100%;
            margin: 0 auto;
        }
        ${ image } img {
            width: 100%;
            height: auto;
            display: block;
            border-radius: 12px 12px 0 0;
        }
        ${ cardContainer } {
            display: flex;
            flex-direction: column;
            padding: 32px;
            gap: 10px;
        }
        ${ cardInfo } {
            font-size: 15px;
            font-weight: 400;
        }
        ${ cardTitle } {
            font-size: 20px;
            font-weight: 700;
        }
        ${ bold } {
            font-weight: 700;
        }
        ${ imageRedirectionButton } {
            background: #0131FF;
            color: #ffffff;
            width: 375px;
            height: 60px;
            padding: 0px 25px;
            border-radius: 15px;
            margin-top: 20px;
            font-size: 18px;
            font-weight: 700;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border: none;
            cursor: pointer;
            user-select: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
        }
        ${ imageRedirectionButton }:hover {
            background: #0128E0;
        }
        @media (max-width: 768px) {
            ${ imageTitle } {
                width: 361px;
            }
            ${ imageSliderWrapper } {
                width: 100%;
                margin-left: 5%;
            }
            ${ imageButtons } {
                width: 90%;
            }
            button${ imageRedirectionButton } {
                width: 90%;
                justify-content: space-between;
                padding: 0px 5%;
            }
            ${ title } {
                width: 385px;
                padding: 0px 11px;
                text-align: center;
            }
            ${ sliderWrapper } {
                width: 100%;
                margin-left: 5%;
            }
            ${ buttons } {
                width: 90%;
            }
        }
        @media (orientation: landscape) and (max-height: 500px) {
            ${ wrapper }, ${ imageWrapper } {
                display: none;
            }
        }`;

        Insider.dom('<style>').addClass(classes.customStyleSheet).html(customStyle).appendTo('head');
    };

    self.buildHTML = () => {
        const {
            wrapper, title, info, sliderWrapper, sliderContainer, slide, buttons,
            prevButton, nextButton, dots, dot, dotActive,
            imageWrapper, imageTitle, imageInfo, imageSliderWrapper,
            imageSliderContainer, imageSlide, image, cardContainer,
            cardTitle, cardInfo, bold, imageButtons,
            imagePrevButton, imageNextButton, imageDots, imageDot, imageDotActive,
            imageRedirectionButton
        } = classes;

        const {
            slides,
            title: configTitle,
            subtitle,
            imageConfig: {
                title: imageConfigTitle,
                subtitle: imageConfigSubtitle,
                slides: imageConfigSlides,
                buttonText,
                buttonSvg
            }
        } = config;

        const slidesHtml = slides.map((item) => `
            <div class="${ slide }">
                ${ item.svg }
                ${ item.text }
            </div>
        `).join('');

        const imageSlidesHtml = imageConfigSlides.map((item) => {
            const descriptionsHtml = item.description.map((descItem) =>
                `<div class="${ cardInfo }${ descItem.isBold ? ` ${ bold }` : '' }">${ descItem.description }</div>`)
                .join('');

            return `
            <div class="${ imageSlide }">
                <div class="${ image }">
                    <img src="${ item.image }" alt="${ item.title }" />
                </div>
                <div class="${ cardContainer }">
                    <div class="${ cardTitle }">${ item.title }</div>
                    ${ descriptionsHtml }
                </div>
            </div>`;
        }).join('');

        const html =
        `<div class="${ wrapper }">
            <div class="${ title }">${ configTitle }</div>
            <div class="${ info }">${ subtitle }</div>
            <div class="${ sliderWrapper }">
                <div class="${ sliderContainer }">
                    ${ slidesHtml }
                </div>
            </div>
            <div class="${ buttons }">
                <button class="${ prevButton } ${ classes.arrowDisabled }"> &lt; </button>
                <div class="${ dots }">
                    <div class="${ dot } ${ dotActive }" data-dot-index="0"></div>
                    <div class="${ dot }" data-dot-index="1"></div>
                    <div class="${ dot }" data-dot-index="2"></div>
                </div>
                <button class="${ nextButton }"> &gt; </button>
            </div>
        </div>
        <div class="${ imageWrapper }">
            <div class="${ imageTitle }">${ imageConfigTitle }</div>
            <div class="${ imageInfo }">${ imageConfigSubtitle }</div>
            <div class="${ imageSliderWrapper }">
                <div class="${ imageSliderContainer }">
                    ${ imageSlidesHtml }
                </div>
            </div>
            <div class="${ imageButtons }">
                <button class="${ imagePrevButton } ${ classes.arrowDisabled }"> &lt; </button>
                <div class="${ imageDots }">
                    <div class="${ imageDot } ${ imageDotActive }" data-dot-index="0"></div>
                    <div class="${ imageDot }" data-dot-index="1"></div>
                    <div class="${ imageDot }" data-dot-index="2"></div>
                </div>
                <button class="${ imageNextButton }"> &gt; </button>
            </div>
            <button class="${ imageRedirectionButton }">
                ${ buttonText }
                ${ buttonSvg }
            </button>
        </div>`;

        Insider.dom(selectors.appendLocation).after(html);
    };

    self.setEvents = () => {
        const { prevButton, nextButton, imagePrevButton, imageNextButton,
            imageRedirectionButton, wrapper, imageWrapper } = selectors;
        const { imagePrevButton: imagePrevButtonClass, imageNextButton: imageNextButtonClass } = classes;

        self.imageCurrentIndex = 0;
        self.currentIndex = 0;

        Insider.eventManager.once(`click.prev:${ variationId }`, `${ prevButton }, ${ imagePrevButton }`, (event) => {
            if (Insider.dom(event.currentTarget).hasClass(imagePrevButtonClass)) {
                if (self.imageCurrentIndex > 0) {
                    self.imageCurrentIndex--;
                    self.updateImageSlider('prev');
                }
            } else {
                if (self.currentIndex > 0) {
                    self.currentIndex--;
                    self.updateSlider('prev');
                }
            }
        });

        Insider.eventManager.once(`click.next:${ variationId }`, `${ nextButton }, ${ imageNextButton }`, (event) => {
            if (Insider.dom(event.currentTarget).hasClass(imageNextButtonClass)) {
                const maxIndex = config.imageConfig.slides.length - 1;

                if (self.imageCurrentIndex < maxIndex) {
                    self.imageCurrentIndex++;
                    self.updateImageSlider();
                }
            } else {
                const maxIndex = config.slides.length - 1;

                if (self.currentIndex < maxIndex) {
                    self.currentIndex++;
                    self.updateSlider();
                }
            }
        });

        Insider.eventManager.once(`click.redirection:${ variationId }`, imageRedirectionButton, () => {
            Insider.utils.opt.sendCustomGoal(builderId, 2, false);

            setTimeout(() => {
                window.location.href = config.imageConfig.redirectionLink;
            }, 200);
        });

        Insider.eventManager.once(`click.join:${ variationId }`, `${ wrapper }, ${ imageWrapper }`, () => {
            Insider.campaign.custom.storeJoinLog(variationId);
            Insider.campaign.custom.updateCampaignCookie({
                joined: true
            }, Insider.campaign.custom.addCampaignIdPrefix(variationId));
        });

        setTimeout(() => {
            self.updateSlider();
            self.updateImageSlider();
        }, 100);
    };

    self.updateSlider = (direction = '') => {
        const { sliderContainer, prevButton, nextButton, slide, dot } = selectors;

        self.updateSliderInternal({
            containerSelector: sliderContainer,
            prevButtonSelector: prevButton,
            nextButtonSelector: nextButton,
            slideSelector: slide,
            dotSelector: dot,
            currentIndex: self.currentIndex,
            slideLength: config.slides.length,
            translateStep: 316,
            dotActiveClass: classes.dotActive,
            dotDataAttribute: 'dot-index',
            direction
        });
    };

    self.updateImageSlider = (direction = '') => {
        const { imageSliderContainer, imagePrevButton, imageNextButton, imageSlide, imageDot } = selectors;

        self.updateSliderInternal({
            containerSelector: imageSliderContainer,
            prevButtonSelector: imagePrevButton,
            nextButtonSelector: imageNextButton,
            slideSelector: imageSlide,
            dotSelector: imageDot,
            currentIndex: self.imageCurrentIndex,
            slideLength: config.imageConfig.slides.length,
            translateStep: 363,
            dotActiveClass: classes.imageDotActive,
            dotDataAttribute: 'dot-index',
            direction
        });
    };

    self.updateSliderInternal = (sliderConfig) => {
        const {
            containerSelector,
            prevButtonSelector,
            nextButtonSelector,
            slideSelector,
            dotSelector,
            currentIndex,
            slideLength,
            translateStep,
            dotActiveClass,
            dotDataAttribute,
            direction
        } = sliderConfig;

        const { arrowDisabled } = classes;

        const $previousButton = Insider.dom(prevButtonSelector);
        const $nextButton = Insider.dom(nextButtonSelector);

        Insider.dom(containerSelector).css('transform', `translateX(${ currentIndex * -translateStep }px)`);

        if (currentIndex === 0) {
            $previousButton.addClass(arrowDisabled);
        } else {
            $previousButton.removeClass(arrowDisabled);
        }

        if (currentIndex === slideLength - 1) {
            $nextButton.addClass(arrowDisabled);
        } else {
            $nextButton.removeClass(arrowDisabled);
        }

        setTimeout(() => {
            const activeDotIndex = self.getActiveDotIndex({ slideSelector, translateStep, dotActiveClass, direction });
            const $dots = Insider.dom(dotSelector);

            $dots.each((index, element) => {
                const $dot = Insider.dom(element);
                const dotIndex = parseInt($dot.data(dotDataAttribute), 10);

                if (dotIndex === activeDotIndex) {
                    $dot.addClass(dotActiveClass);
                } else {
                    $dot.removeClass(dotActiveClass);
                }
            });

            if (activeDotIndex === 2) {
                $nextButton.addClass(arrowDisabled);
            } else if (currentIndex !== slideLength - 1) {
                $nextButton.removeClass(arrowDisabled);
            }
        }, 400);
    };

    self.getActiveDotIndex = ({ slideSelector, translateStep, dotActiveClass, direction }) => {
        const { innerWidth } = window;
        const slidersRightThreshold = innerWidth * 0.875;
        const firstSlideBoundingRect = Insider.dom(`${ slideSelector }:eq(0)`).getNode(0).getBoundingClientRect();
        const fourthSlideBoundingRect = Insider.dom(`${ slideSelector }:eq(3)`).getNode(0).getBoundingClientRect();
        const lastSlideBoundingRect = Insider.dom(`${ slideSelector }:last`).getNode(0).getBoundingClientRect();

        if (isMobile) {
            if (firstSlideBoundingRect.left > 0 &&
                    firstSlideBoundingRect.right <= innerWidth) {

                return 0;
            }

            if (lastSlideBoundingRect.left > 0 &&
                    lastSlideBoundingRect.right <= innerWidth) {

                return 2;
            }

            if (fourthSlideBoundingRect.left > 0 &&
                    fourthSlideBoundingRect.right <= innerWidth) {

                return 1;
            }

            switch (Number(Insider.dom(`.${ dotActiveClass }`).data('dot-index'))) {
                case 0:
                    return 0;
                case 1:
                    if (direction === 'prev') {
                        return 0;
                    }

                    return 1;
                case 2:
                    return 1;
            }

        }

        if (firstSlideBoundingRect.left > 0 &&
                firstSlideBoundingRect.left + translateStep < slidersRightThreshold) {

            return 0;
        }

        if (lastSlideBoundingRect.left + translateStep < slidersRightThreshold) {
            return 2;
        } else if (fourthSlideBoundingRect.left + translateStep < slidersRightThreshold) {
            return 1;
        }

        return 0;
    };

    return self.init();
})({});
/* OPT-212167 END */