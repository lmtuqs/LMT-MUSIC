const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const btnMenu = $('.icon-menu');
const btnCloseMenu = $('.icon-close-menu');
const menuUser = $('.menu-user');

const overplay = $('.overplay')

btnMenu.onclick = function () {
    overplay.classList.add('active');
    menuUser.classList.add('active');
    menuUser.classList.remove('closed');

}

btnCloseMenu.onclick = function () {
    overplay.classList.remove('active');
    menuUser.classList.remove('active');
    menuUser.classList.add('closed');
}
