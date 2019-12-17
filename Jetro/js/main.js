$(document).ready(function () {
    $('.btn__menu').on('click', function(){
        $('.line').toggleClass('active')
        $('.header__list').slideToggle(300, function(){
            if( $(this).css('display') === "none"){
                $(this).removeAttr('style');
            }
        });
    })
    $('.slider__box').on('init', function(event, slick){
        var $items = slick.$dots.find('li');
        $items.addClass('thumb__item');
        $items.find('button').remove();
    });
    $('.slider__box').slick({
        infinite: true,
        arrows: true,
        prevArrow: '<div class="prev"></div>',
        nextArrow: '<div class="next"></div>',
        autoplay: true,
        autoplaySpeed: 5000,
        dots: true,
        dotsClass: 'thumb__items'
    });
});