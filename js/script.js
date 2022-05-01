const leftBtn = document.querySelector('.slider-btn--left');
const rightBtn = document.querySelector('.slider-btn--right');
const slider1 = document.querySelector('.slider--1');
const slider2 = document.querySelector('.slider--2');
const slider3 = document.querySelector('.slider--3');

class Slider {
    constructor(parrentElement, leftBtn, rightBtn) {
        this.parrentElement = parrentElement;
        this.leftBtn = leftBtn;
        this.rightBtn = rightBtn;
        this.slides = parrentElement.querySelectorAll('.slide');
        this.currentSlide = 0;
        this.maxSlides = this.slides.length;
        this.initSlider();
    }

    calcOffset() {
        const parrentWidth = this.parrentElement.getBoundingClientRect().width;
        const columnGap = parseInt(getComputedStyle(this.slides[0])['columnGap']);
        
        return 100 * columnGap / parrentWidth;
    }

    goToSlide(toSlide) {
        this.slides.forEach(function(slide, index) {
            slide.style.transform = `translateX(${100 * (index - toSlide) + ((index - toSlide) * this.calcOffset())}%)`;
        }.bind(this));
    }

    nextSlide() {
        this.currentSlide ++;

        if (this.currentSlide === this.maxSlides) this.currentSlide = 0;

        this.goToSlide(this.currentSlide);
    }

    previousSlide() {
        this.currentSlide --;

        if (this.currentSlide < 0) this.currentSlide = this.maxSlides -1;

        this.goToSlide(this.currentSlide);
    }

    initSlider() {
        this.slides.forEach(function(slide) {
            slide.classList.add('no-transition');
        });

        this.goToSlide(this.currentSlide);

        setTimeout(function() {
            this.slides.forEach(function(slide) {
                slide.classList.remove('no-transition');
            });
        }.bind(this), 10);
    }
}

const SliderBig = new Slider(slider1, leftBtn, rightBtn);
const SliderMedium = new Slider(slider2, leftBtn, rightBtn);
const SliderSmall = new Slider(slider3, leftBtn, rightBtn);

leftBtn.addEventListener('click', function() {
    SliderBig.previousSlide();
    SliderMedium.previousSlide();
    SliderSmall.previousSlide();
});

rightBtn.addEventListener('click', function() {
    SliderBig.nextSlide();
    SliderMedium.nextSlide();
    SliderSmall.nextSlide();
});

function debounce(func) {
    let timer;
    
    return function(event) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(func, 15, event);
    };
}

// if (window.matchMedia("(orientation: landscape)").matches) {
//     document.querySelector('.heading-secondary').textContent = 'landscape';
// }

window.addEventListener('orientationchange', debounce(function() {
    SliderBig.initSlider();
    SliderMedium.initSlider();
    SliderSmall.initSlider();
}));

window.addEventListener('resize', debounce(function(e) {
    // Re-init the slider
    if (window.screen.width > 900) {
        return SliderBig.initSlider();
    }
    
    if (window.screen.width <= 900 && window.screen.width > 600 ) {
        return SliderMedium.initSlider();
    }
    
    if (window.screen.width <= 600 ) {
        return SliderSmall.initSlider();
    }
}));

const scrollContainer = document.querySelector('.scroll-container');
const scrollBtnLeft = document.querySelector('.scroll-btn--left');
const scrollBtnRight = document.querySelector('.scroll-btn--right');
const scrollCards = document.querySelectorAll('.scroll-card');

function scrollContainerX(scrollTo) {
    scrollContainer.scroll({
        top: 0,
        left: scrollTo,
        behavior: 'smooth'
    });
}

function calcPoints() {
    const gap = parseInt(getComputedStyle(scrollContainer)['columnGap']);
    const points = [];

    scrollCards.forEach(function(card, index) {
        const cardWidth = card.getBoundingClientRect().width;
        const point = (index + 1) * (cardWidth + gap);
        points.push(Math.round(point));
    });

    return points;
}

scrollBtnLeft.addEventListener('click', function() {
    const maxScroll = scrollContainer.scrollLeftMax;
    const currentScrollPosition = scrollContainer.scrollLeft;
    const points = calcPoints();

    if (currentScrollPosition === 0) {
        return scrollContainerX(maxScroll);
    }

    for (let i = points.length - 1; i >= 0; i--) {
        const point = points[i];

        if (point > maxScroll) continue;
        
        if (currentScrollPosition <= point && currentScrollPosition > points[i-1]) {
            return scrollContainerX(points[i-1]);
        }

        if (i === 0 && currentScrollPosition > 0) return scrollContainerX(0);
    }
});

scrollBtnRight.addEventListener('click', function() {
    const maxScroll = scrollContainer.scrollLeftMax;
    const currentScrollPosition = scrollContainer.scrollLeft;
    const points = calcPoints();
    
    if (currentScrollPosition === 0) {
        return scrollContainerX(points[0]);
    }

    if (currentScrollPosition >= maxScroll) {
        return scrollContainerX(0);
    }

    for (let i = 0; i < points.length; i++) {
        const point = points[i];
        
        if (currentScrollPosition === point) {
            return scrollContainerX(points[i+1]);
        }
        
        if (currentScrollPosition < point) {
            return scrollContainerX(points[i]);
        }
    }
});
