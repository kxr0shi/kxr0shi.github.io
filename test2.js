(function () {
    'use strict';

    if (typeof Lampa === 'undefined' || !Lampa.Maker) {
        console.log('⚠️ Требуется Lampa 3.0+');
        return;
    }

    console.log('✨ Плагин «Стильный интерфейс (широкие карточки)» запущен');

    /**
     * Вставляем CSS-правила для широких карточек
     */
    function injectWideStyle() {
        const style = document.createElement('style');
        style.id = 'wide-card-style';
        style.textContent = `
            /* --- Стиль широких карточек --- */
            .card--wide {
                width: 30vw !important;
                max-width: 500px !important;
                height: auto !important;
                transition: all 0.3s ease-in-out;
            }

            /* Опционально – адаптивность */
            @media (max-width: 1200px) {
                .card--wide {
                    width: 45vw !important;
                }
            }

            @media (max-width: 768px) {
                .card--wide {
                    width: 80vw !important;
                }
            }

            /* При фокусе слегка увеличиваем */
            .card--wide.focus {
                transform: scale(1.05);
                z-index: 5;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Патчим модуль Card, чтобы все карточки автоматически становились широкими
     */
    function enableWideCards() {
        try {
            const map = Lampa.Maker.map('Card');
            const originalStyle = map.Style;

            map.Style = Object.assign({}, originalStyle, {
                onCreateAndAppend: function (card) {
                    if (originalStyle && originalStyle.onCreateAndAppend)
                        originalStyle.onCreateAndAppend.call(this, card);

                    const elem = card.render ? card.render() : null;
                    if (elem) elem.addClass('card--wide');
                },
                onBuild: function (card) {
                    card.data = card.data || {};
                    card.data.params = card.data.params || {};
                    card.data.params.style = card.data.params.style || {};
                    card.data.params.style.name = 'wide';

                    if (originalStyle && originalStyle.onBuild)
                        originalStyle.onBuild.call(this, card);
                }
            });

            console.log('✅ Широкие карточки активированы');
        } catch (err) {
            console.error('Ошибка при активации wide-карточек:', err);
        }
    }

    // Подключаем всё, когда приложение готово
    Lampa.Listener.follow('app:ready', function () {
        injectWideStyle();
        enableWideCards();
    });
})();
