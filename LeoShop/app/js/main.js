$(function(){
    $('.slider').slick({
        infinite: true,
        arrows: true,
        nextArrow: '<i class="fa fa-angle-right right" aria-hidden="true"></i>',
        prevArrow: '<i class="fa fa-angle-left left" aria-hidden="true"></i>',
        dots: false,
        autoplay: true,
        autoplaySpeed: 5000,
    });
    $('.slide').slick({
        infinite: true,
        dots: true,
        arrows: false,
        autoplay: true,
        autoplaySpeed: 2000,
    });
});