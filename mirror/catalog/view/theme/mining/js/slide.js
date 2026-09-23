var d = new Date()
var time = d.getHours()
if ((time >= 20 && time < 24) || (time >= 0 && time < 9)) {
    document.getElementById('night-bot').innerHTML = ('' +
        ' <div class="item active">\n' +
        '                <a href="https://izzi.ru/h0JJeaL">\n' +
        '                    <img src="https://miningshop.ru/image/catalog/banner/banner-bot.webp" alt="Бот Whatsapp miningshop" style="width: 1140px;">\n' +
        '                </a>' +
        '</div>' +
        '      <div class="item" style="text-align:center">\n' +
        '                <a href="#" data-toggle="modal" data-target="#main-modal-form"\n' +
        '                   onclick="$(\'.form-banner\').val(\'Баннер#1 Отдадим бесплатно ASIC или ферму\');">\n' +
        '                    <img src="https://miningshop.ru/image/catalog/banner/banner-1.webp"\n' +
        '                         style="width: 1140px;">\n' +
        '                </a>\n' +
        '            </div>\n' +
        '\n' +
        '            <div class="item" style="text-align:center">\n' +
        '                <a href="#" data-toggle="modal" data-target="#main-modal-form"\n' +
        '                   onclick="$(\'.form-banner\').val(\'Баннер#2 Гарантируем доходность до 30% в месяц Bitmain S9\');">\n' +
        '                    <img src="https://miningshop.ru/image/catalog/banner/banner-2.webp"\n' +
        '                         style="width: 1140px;">\n' +
        '                </a>\n' +
        '            </div>\n' +
        '            <div class="item" style="text-align:center">\n' +
        '                <a href="#" data-toggle="modal" data-target="#main-modal-form"\n' +
        '                   onclick="$(\'.form-banner\').val(\'Баннер#4 Реализация оборудования\');">\n' +
        '                    <img src="https://miningshop.ru/image/catalog/banner/banner-3.webp"\n' +
        '                         style="width: 1140px;">\n' +
        '                </a>\n' +
        '            </div>\n' +
        '            <div class="item" style="text-align:center">\n' +
        '                <a href="#" data-toggle="modal" data-target="#main-modal-form"\n' +
        '                   onclick="$(\'.form-banner\').val(\'Меняем ферму на асики\');">\n' +
        '                    <img src="https://miningshop.ru/image/catalog/banner/banner-4.webp"\n' +
        '                         style="width: 1140px;">\n' +
        '                </a>\n' +
        '            </div>'
    )
} else {
    document.getElementById('night-bot').innerHTML = (
        '      <div class="item active" style="text-align:center">\n' +
        '                <a href="#" data-toggle="modal" data-target="#main-modal-form"\n' +
        '                   onclick="$(\'.form-banner\').val(\'Баннер#1 Отдадим бесплатно ASIC или ферму\');">\n' +
        '                    <img src="https://miningshop.ru/image/catalog/banner/banner-1.webp"\n' +
        '                         style="width: 1140px;">\n' +
        '                </a>\n' +
        '            </div>\n' +
        '\n' +
        '            <div class="item" style="text-align:center">\n' +
        '                <a href="#" data-toggle="modal" data-target="#main-modal-form"\n' +
        '                   onclick="$(\'.form-banner\').val(\'Баннер#2 Гарантируем доходность до 30% в месяц Bitmain S9\');">\n' +
        '                    <img src="https://miningshop.ru/image/catalog/banner/banner-2.webp"\n' +
        '                         style="width: 1140px;">\n' +
        '                </a>\n' +
        '            </div>\n' +
        '            <div class="item" style="text-align:center">\n' +
        '                <a href="#" data-toggle="modal" data-target="#main-modal-form"\n' +
        '                   onclick="$(\'.form-banner\').val(\'Баннер#4 Реализация оборудования\');">\n' +
        '                    <img src="https://miningshop.ru/image/catalog/banner/banner-3.webp"\n' +
        '                         style="width: 1140px;">\n' +
        '                </a>\n' +
        '            </div>\n' +
        '            <div class="item" style="text-align:center">\n' +
        '                <a href="#" data-toggle="modal" data-target="#main-modal-form"\n' +
        '                   onclick="$(\'.form-banner\').val(\'Меняем ферму на асики\');">\n' +
        '                    <img src="https://miningshop.ru/image/catalog/banner/banner-4.webp"\n' +
        '                         style="width: 1140px;">\n' +
        '                </a>\n' +
        '            </div>')

}