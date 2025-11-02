(function () {
    'use strict';

    if (typeof Lampa === 'undefined' || !Lampa.Maker) {
        console.log('⚠️ Требуется Lampa 3.0+');
        return;
    }

    console.log('✨ Плагин «Стильный интерфейс (реальные wide-карточки)» запущен');

    /**
     * Патчим сетевой слой, чтобы подменить стиль карточек на wide
     */
    function interceptAPI() {
        const originalGet = Lampa.Api.get;

        Lampa.Api.get = function (url, params, onSuccess, onError, options) {
            const wrappedSuccess = function (json) {
                try {
                    if (json && Array.isArray(json.results)) {
                        json.results.forEach(item => {
                            item.params = item.params || {};
                            item.params.style = item.params.style || {};
                            item.params.style.name = 'wide';
                        });
                    }

                    // Можно также задавать стиль ряду
                    json.params = json.params || {};
                    json.params.items = json.params.items || {};
                    json.params.items.view = 3; // как в исходниках

                } catch (e) {
                    console.error('Ошибка применения wide-стиля к результатам:', e);
                }

                onSuccess && onSuccess(json);
            };

            return originalGet.call(this, url, params, wrappedSuccess, onError, options);
        };

        console.log('✅ Все карточки из API теперь создаются как wide');
    }

    Lampa.Listener.follow('app:ready', interceptAPI);
})();
