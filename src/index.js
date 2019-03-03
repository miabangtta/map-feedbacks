ymaps.ready(init);

function init() {
    var map = new ymaps.Map("map", {
        center: [55.76, 37.64],
        zoom: 10,
        controls: []
    });

    map.events.add('click', function (e) {
        if (!map.balloon.isOpen()) {
            var coords = e.get('coords');
            if (false) {
                // если клик произошел по существующей метке
            } else {
                console.log(coords);
                map.balloon.open(coords, {
                    contentBody: '<header class="header"><div class="header__inner-text"></div></header>' +
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
                        '</div>',
                });
                ymaps.geocode(coords).then(function (res) {
                    const firstGeoObject = res.geoObjects.get(0);
                    if (firstGeoObject.getAddressLine().length) {
                        document.querySelector('.header__inner-text').innerText = firstGeoObject.getAddressLine();
                    }
                });
            }
        }
        else {
            map.balloon.close();
        }
    });

};

const sendFeedbackBtn = document.querySelector('.footer__button');
sendFeedbackBtn.addEventListener('click', function () {

    console.log('click')
    myGeoObject = new ymaps.GeoObject({
        // Описание геометрии.
        geometry: {
            type: "Point",
            coordinates: [55.8, 37.8]
        },
        // Свойства.
        properties: {
            // Контент метки.
            iconContent: 'Я тащусь',
            hintContent: 'Ну давай уже тащи'
        }
    }, {
            // Опции.
            // Иконка метки будет растягиваться под размер ее содержимого.
            preset: 'islands#blackStretchyIcon',
            // Метку можно перемещать.
            draggable: true
        })
});

// можно отдельно форму сделать где-то и подтягивать ее
// уже есть готовая каруселька
// сохранять отзывы в local storage
// плашка с помощью стандартного api 