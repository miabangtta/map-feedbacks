ymaps.ready(init);

function init() {
    let mapCenter = [55.76, 37.64],
        map = new ymaps.Map("map", {
            center: mapCenter,
            zoom: 10,
            controls: []
        });

    window.clusterer = new ymaps.Clusterer({
        clusterDisableClickZoom: true,
        clusterOpenBalloonOnClick: true,
        clusterBalloonContentLayout: 'cluster#balloonCarousel',
        clusterBalloonPanelMaxMapArea: 0,
        clusterBalloonContentLayoutWidth: 200,
        clusterBalloonContentLayoutHeight: 130,
        clusterBalloonPagerSize: 5
    });

    map.geoObjects.add(clusterer);

    function createBalloon(coords) {

        console.log(map.balloon.isOpen())

        ymaps.geocode(coords).then(function (res) {
            console.log(coords);

            const points = res.geoObjects.get(0).properties.get('text');

            var templateBalloon = ymaps.templateLayoutFactory.createClass(
                '<div class="balloon__wrapper">' +
                '<header class="header"><div class="header__inner-text">' + points + '</div></header>' +

                '<div class="newfeedback">' +
                '<div class="newfeedback__title">Ваш отзыв' +
                '</div>' +
                '<div class="body"></div>' +
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
                '</div>' +
                '</div>', {
                    build: function () {
                        templateBalloon.superclass.build.call(this);
                        var that = this;

                        let numberOfPlacemarks = localStorage.length ? localStorage.length : 0;
                        if (numberOfPlacemarks) {
                            for (let i = 1; i <= numberOfPlacemarks; i++) {
                                let item = localStorage[i];
                                item = JSON.parse(item)
                                if (JSON.stringify(item.key) === JSON.stringify(coords)) {
                                    const body = document.querySelector('.body');
                                    const div = document.createElement('div');
                                    div.innerHTML = item.itemFill;
                                    body.appendChild(div);
                                }
                            }
                        }
                        document.querySelector('.footer__button').addEventListener('click', function (e) {
                            e.preventDefault();

                            let date = new Date();
                            let dd = date.getDate();
                            if (dd < 10) dd = '0' + dd;

                            let mm = date.getMonth() + 1;
                            if (mm < 10) mm = '0' + mm;

                            let yy = date.getFullYear() % 100;
                            if (yy < 10) yy = '0' + yy;

                            let hrs = date.getHours();
                            if (hrs < 10) hrs = '0' + hrs;

                            let mins = date.getMinutes();
                            if (mins < 10) mins = '0' + mins;

                            let formatedDate = `${dd}.${mm}.${yy} ${hrs}:${mins}`

                            const time = formatedDate,
                                name = document.querySelector('.newfeedback__input-name').value.trim(),
                                point = document.querySelector('.newfeedback__input-place').value.trim(),
                                message = document.querySelector('.newfeedback__textarea').value.trim();

                            const body = document.querySelector('.body');
                            const div = document.createElement('div');
                            div.innerHTML = `<div class="feedback__item"><span class="feedback__author">${name}</span> <span class="feedback__place">${point}</span><span class="feedback__time">${time}</span><div class="feedback__comment">${message}</div></div>`;
                            body.appendChild(div);
                            that.onContent(name, point, message, time);

                            let serialObj = JSON.stringify(Object.assign({}, { 'key': coords }, { 'itemFill': div.innerHTML }));
                            let createdKey = localStorage.length + 1;
                            localStorage.setItem(createdKey, serialObj);
                        })
                    },

                    clear: function () {
                        templateBalloon.superclass.clear.call(this);
                    },

                    onContent: function (name, point, message, time) {
                        var Placemark = new ymaps.Placemark(coords, {
                            balloonContentHeader: `<b>${point}</b>`,
                            balloonContentBody: `<div class="feedback__item"><a class="linkCoords" href="javascript:void(0);" data-coords="${coords}">${points}</a> <p>${message}</p></div>`,
                            balloonContentFooter: `${time}`,
                        }, {
                                balloonContentBodyLayout: templateBalloon,
                                balloonPanelMaxMapArea: 0,
                                hasBalloon: false
                            });

                        window.clusterer.add(Placemark);
                    }
                }
            );

            window.balloon = new ymaps.Balloon(map, {
                contentLayout: templateBalloon
            });

            balloon.options.setParent(map.options);
            balloon.open(coords);
        });
    };

    // open cluster carousel
    clusterer.events.add('click', function (e) {
        const geoObjects = e.get('target');
        if (!geoObjects.getGeoObjects) {
            createBalloon(geoObjects.geometry._coordinates);
        }
    });

    // open simple balloon
    map.events.add('click', function (e) {
        const coords = e.get('coords');
        createBalloon(coords);
    });

    // open balloon from carousel
    document.addEventListener('click', function (e) {
        if (e.target.className === 'linkCoords') {
            const arrCoord = e.target.dataset.coords.split(',');
            const addr = [Number(arrCoord[0]), Number(arrCoord[1])];

            createBalloon(addr);
        }
    })
};