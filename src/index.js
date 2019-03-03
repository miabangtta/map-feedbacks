ymaps.ready(init);

function init() {
    var map = new ymaps.Map("map", {
        center: [55.76, 37.64],
        zoom: 10,
        controls: []
    });

    //  хз что это
    // if (map) {
    //     ymaps.modules.require(['Placemark', 'Circle'], function (Placemark, Circle) {
    //         var placemark = new Placemark([55.37, 35.45]);
    //     });
    // }

    map.events.add('click', function (e) {
        if (!map.balloon.isOpen()) {
            var coords = e.get('coords');
            if (false) {
                // если клик произошел по существующей метке
            } else {
                console.log(coords);
                map.balloon.open(coords, {
                    // contentHeader: 'Событие!',
                    contentBody: '<header class="header"><div class="header__inner-text">Сюда выводится адрес</div></header>' +
                        '<div class="feedbacks">' +
                        '<div class="feedback__list">' +
                        '<div class="feedback__item">' +
                        '<div class="feedback__item-head">' +
                        '<div class="feedback__author">Sergey' +
                        '</div>' +
                        '<div class="feedback__place">Red coub' +
                        '</div>' +
                        '<div class="feedback__time">12-10-1995' +
                        '</div>' +
                        '</div>' +
                        '<div class="feedback__comment">Good place' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +

                        '<div class="newfeedback">' +
                        '<div class="newfeedback__title">Ваш отзыв' +
                        '</div>' +
                        '<div class="newfeedback__row">' +
                        '<input class="newfeedback__input" placeholder="Ваше имя">' +
                        '</div>' +
                        '<div class="newfeedback__row">' +
                        '<input class="newfeedback__input" placeholder="Укажите место">' +
                        '</div>' +
                        '<div class="newfeedback__row">' +
                        '<textarea class="newfeedback__textarea" placeholder="Поделитесь впечатлениями">' +
                        '</textarea>' +
                        '</div>' +
                        '</div>' +
                        '<div class="footer">' +
                        '<button class="footer__button">Добавить' +
                        '</button>' +
                        '</div>' +


                        '<p>Координаты щелчка: ' + [
                            coords[0].toPrecision(6),
                            coords[1].toPrecision(6)
                        ].join(', ') + '</p></div>',
                    // contentFooter: '<sup>Щелкните еще раз</sup>'
                });
            }
        }
        else {
            map.balloon.close();
        }
    });

};

const myMap = document.querySelector('#map');
myMap.addEventListener('click', console.log('click'));

// можно отдельно форму сделать где-то и подтягивать ее
// уже есть готовая каруселька
// сохранять отзывы в local storage
// плашка с помощью стандартного api 