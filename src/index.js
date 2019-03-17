ymaps.ready(init);


if (!localStorage.length < 7) {
    let obj = {
        'coords': [55.76, 37.64],
        'time': '12.10.2019 11:45',
        'author': 'Мария',
        'place': 'Название места',
        'feedback': 'Тестовый фидбек'
    };

    let serialObj = JSON.stringify(obj);
    let createdKey = localStorage.length + 1;

    localStorage.setItem(createdKey, serialObj);
}

function init() {
    var mapCenter = [55.76, 37.64],
        map = new ymaps.Map("map", {
            center: mapCenter,
            zoom: 10,
            controls: []
        });

    // шаблон в карусели
    var customItemContentLayout = ymaps.templateLayoutFactory.createClass(
        '{{properties.balloonContentHeader|raw}}' +
        '<div class="feedbacks">' + '<div class="feedback__list">' + '{{properties.balloonContentBody|raw}}' + '</div>' + '</div>',
    )

    var clusterer = new ymaps.Clusterer({
        clusterDisableClickZoom: true,
        clusterOpenBalloonOnClick: true,
        // Устанавливаем стандартный макет балуна кластера "Карусель".
        clusterBalloonContentLayout: 'cluster#balloonCarousel',
        // Устанавливаем собственный макет.
        clusterBalloonItemContentLayout: customItemContentLayout,
        // Устанавливаем режим открытия балуна. 
        // В данном примере балун никогда не будет открываться в режиме панели.
        clusterBalloonPanelMaxMapArea: 0,
        // Устанавливаем размеры макета контента балуна (в пикселях).
        clusterBalloonContentLayoutWidth: 200,
        clusterBalloonContentLayoutHeight: 130,
        // Устанавливаем максимальное количество элементов в нижней панели на одной странице
        clusterBalloonPagerSize: 5
    });

    var placemarks = [];
    let numberOfPlacemarks = localStorage.length ? localStorage.length : 0;
    for (var i = 0, l = numberOfPlacemarks; i < l; i++) {
        if (!localStorage.length) return;

        var placemark = new ymaps.Placemark(getPlacemarkPosition(i + 1), {
            // Устаналиваем данные, которые будут отображаться в балуне.
            balloonContentHeader: '<header class="header"><div class="header__inner-text">' + getAddress(i + 1) + '</div></header>',
            balloonContentBody: getContentBody(i + 1),
            balloonContentFooter: '<div class="newfeedback">' +
                '<div class="newfeedback__title">Ваш отзыв' +
                '</div>' +
                '<div class="newfeedback__row">' +
                '<input class="newfeedback__input newfeedback__input-name" placeholder="Ваше имя">' +
                '</div>' +
                '<div class="newfeedback__row">' +
                '<input class="newfeedback__input newfeedback__input-place" placeholder="Укажите место">' +
                '</div>' +
                '<div class="newfeedback__row">' +
                '<textarea class="newfeedback__textarea" placeholder="Поделитесь впечатлениями">' +
                '</textarea>' +
                '</div>' +
                '</div>' +
                '<div class="footer">' +
                '<button class="footer__button">Добавить</button>' +
                '</div>'
        });
        placemarks.push(placemark);
    }

    clusterer.add(placemarks);
    map.geoObjects.add(clusterer);


    function getPlacemarkPosition(index) {
        if (!localStorage.length) return;
        let itemFromLS = localStorage.getItem(index);
        let placemarksLS = JSON.parse(itemFromLS);

        if (placemarksLS && placemarksLS.coords) return placemarksLS.coords;
    }

    function getAddress(index, coordinates) {
        let coord;
        if (index) {
            let itemFromLS = localStorage.getItem(index);
            let placemarksLS = JSON.parse(itemFromLS);
            if (!placemarksLS) return;
            coord = placemarksLS.coords;
        } else if (coordinates) {
            coord = coordinates;
        }

        ymaps.geocode(coord).then(function (res) {
            const firstGeoObject = res.geoObjects.get(0);
            const address = firstGeoObject.getAddressLine();

            if (address.length) {
                return address.toString();
            }
        });
    }

    var placemarkBodies;
    function getContentBody(num) {
        let itemFromLS = localStorage.getItem(num);
        let placemarksLS = JSON.parse(itemFromLS);
        if (!placemarksLS) return;

        if (!placemarkBodies) {
            placemarkBodies = [
                ['<div class="feedback__item">' +
                    '<div class="feedback__item-head">' +
                    `<div class="feedback__author">${placemarksLS.author}` +
                    '</div>' +
                    `<div class="feedback__place">${placemarksLS.place}` +
                    '</div>' +
                    `<div class="feedback__time">${placemarksLS.time}` +
                    '</div>' +
                    '</div>' +
                    `<div class="feedback__comment">${placemarksLS.feedback}` +
                    '</div>' +
                    '</div>' +
                    '</div>'].join('<br/>'),
                ['<div class="feedback__item">' +
                    '<div class="feedback__item-head">' +
                    `<div class="feedback__author">${placemarksLS.author}` +
                    '</div>' +
                    `<div class="feedback__place">${placemarksLS.place}` +
                    '</div>' +
                    `<div class="feedback__time">${placemarksLS.time}` +
                    '</div>' +
                    '</div>' +
                    `<div class="feedback__comment">${placemarksLS.feedback}` +
                    '</div>' +
                    '</div>' +
                    '</div>'].join('<br/>')
            ];
        }

        if (placemarkBodies[num % placemarkBodies.length]) {
            return '<br>' + placemarkBodies[num % placemarkBodies.length];
        }
    }
    //if (clusterer.balloon && clusterer.getClusters()[0]) {
    //  clusterer.balloon.open();
    //}

    map.events.add('click', function (e) {
        if (!map.balloon.isOpen()) {
            const coords = e.get('coords');

            map.balloon.open(coords, {
                contentBody: '<header class="header"><div class="header__inner-text">' + getAddress(0, coords) + '</div></header>' +
                    '<div class="newfeedback">' +
                    '<div class="newfeedback__title">Ваш отзыв' +
                    '</div>' +
                    '<div class="newfeedback__row">' +
                    '<input class="newfeedback__input newfeedback__input-name" placeholder="Ваше имя">' +
                    '</div>' +
                    '<div class="newfeedback__row">' +
                    '<input class="newfeedback__input newfeedback__input-place" placeholder="Укажите место">' +
                    '</div>' +
                    '<div class="newfeedback__row">' +
                    '<textarea class="newfeedback__textarea" placeholder="Поделитесь впечатлениями">' +
                    '</textarea>' +
                    '</div>' +
                    '</div>' +
                    '<div class="footer">' +
                    '<button class="footer__button">Добавить</button>' +
                    '</div>'
            });
            ymaps.geocode(coords).then(function (res) {
                const firstGeoObject = res.geoObjects.get(0);
                if (firstGeoObject.getAddressLine().length) {
                    document.querySelector('.header__inner-text').innerText = firstGeoObject.getAddressLine();
                }
                const sendFeedbackBtn = document.querySelector('.footer__button');
                sendFeedbackBtn.addEventListener('click', function () {

                    let date = new Date();
                    var dd = date.getDate();
                    if (dd < 10) dd = '0' + dd;

                    var mm = date.getMonth() + 1;
                    if (mm < 10) mm = '0' + mm;

                    var yy = date.getFullYear() % 100;
                    if (yy < 10) yy = '0' + yy;

                    var hrs = date.getHours();
                    if (hrs < 10) hrs = '0' + hrs;

                    var mins = date.getMinutes();
                    if (mins < 10) mins = '0' + mins;

                    let formatedDate = `${dd}.${mm}.${yy} ${hrs}:${mins}`

                    let obj = {
                        'coords': coords,
                        'time': formatedDate,
                        'author': document.querySelector('.newfeedback__input-name').value.trim(),
                        'place': document.querySelector('.newfeedback__input-place').value.trim(),
                        'feedback': document.querySelector('.newfeedback__textarea').value.trim()
                    };

                    let serialObj = JSON.stringify(obj);
                    let createdKey = localStorage.length + 1;

                    localStorage.setItem(createdKey, serialObj);

                    map.balloon.close();
                });
            });
        }
        else {
            map.balloon.close();
        }
    });
};