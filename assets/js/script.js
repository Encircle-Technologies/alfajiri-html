$(document).ready(function () {

    // new WOW().init();

    //////////////////////////////////////
    ///////// Safari Height  /////////
    ////////////////////////////////////
    var appHeight = () => {
        var doc = document.documentElement
        doc.style.setProperty('--app-height', `${window.innerHeight}px`)
    }
    window.addEventListener('resize', appHeight)
    appHeight()

    /////////////////////////
    ///////// Tabs /////////
    ///////////////////////
    if ($('.tabs').length) {
        $('ul.tabs li').click(function () {
            var $this = $(this);
            var $theTab = $(this).attr('id');
            if ($this.hasClass('active')) {
                // do nothing
            } else {
                $this.closest('.tabs_wrapper').find('ul.tabs li, .tabs_container .tab_content').removeClass('active');
                $('.tabs_wrapper .slide-arrow').removeClass('!flex');
                $('.tabs_wrapper .slide-arrow').addClass('!hidden');
                $('.tabs_container .tab_content[data-tab="' + $theTab + '"], ul.tabs li[id="' + $theTab + '"]').addClass('active');
                $('.tabs_wrapper .slide-arrow[data-arrow="' + $theTab + '"]').removeClass('!hidden');
                $('.tabs_wrapper .slide-arrow[data-arrow="' + $theTab + '"]').addClass('!flex');

                // fadeinup animation
                const boxes = gsap.utils.toArray('.animated-boxes .tabs_container .tab_content[data-tab="' + $theTab + '"] .animated-item');
                boxes.forEach((box, i) => {
                    const anim = gsap.fromTo(box, { autoAlpha: 0, y: 50 }, { duration: 1, autoAlpha: 1, y: 0 });
                    ScrollTrigger.create({
                        trigger: box,
                        animation: anim,
                        toggleActions: 'play none none none',
                        once: true,
                    });
                });
            }
        });
    }

    /////////////////////////
    ///////// Menu /////////
    ///////////////////////
    // $('.menu-logo').hide()
    function menuOpen() {
        $('html').addClass('overflow-hidden');
        $('body').addClass('menu-open');
        $('.hamburger').addClass('active');
        $('.navbar-nav').addClass('menuhide');
    }
    function menuClose() {
        $('html').removeClass('overflow-hidden');
        $('body').removeClass('menu-open');
        $('.hamburger').removeClass('active');
        $('.navbar-nav').removeClass('menuhide');
    }
    let t1 = gsap.timeline({
        paused: true,
        onStart: menuOpen,
        onReverseComplete: menuClose,
    });
    t1.to(".nav-container", {
        duration: 0.8,
        transform: "translateX(0px)",
        // clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        // right: 0,
        ease: "Power3.InOut",
    });
    t1.from(".main-nav__col ", {
        stagger: 0.05,
        opacity: 0,
        y: 20,
        ease: "Power3.InOut",
    }, "-=0");
    t1.reverse();

    $('.menu-open-test').on('click', function () {
        t1.reversed(!t1.reversed());
    });

    //////////////////////////////////////////
    ///////// Image Parallax Animation /////////
    ////////////////////////////////////////

    // $(function () {
    //     // 	init scrollmagic
    //     var controller = new ScrollMagic.Controller();

    //     // 	loop through slides
    //     $(".parallax-main").each(function () {
    //         var bg = $(this).find(".parallax-inner");
    //         // Add tweenmax for backgroundParallax
    //         var parallax = TweenMax.from(bg, 1, {
    //             y: '-50%',
    //             ease: Power0.easeNone
    //         });
    //         // Create scrollmagic scene
    //         var parallaxScene = new ScrollMagic.Scene({
    //             triggerElement: this, // <-- Use this to select current element
    //             triggerHook: 5,
    //             duration: '150%',
    //         })
    //             .setTween(parallax)
    //             .addTo(controller);

    //     });

    // });

    ////////////////////////////////////////////
    ///////// FadeInUp Gsap Animation /////////
    //////////////////////////////////////////
    if ($('.animated-boxes').length) {
        const boxes = gsap.utils.toArray('.animated-boxes .animated-item');
        boxes.forEach((box, i) => {
            const anim = gsap.fromTo(box, { autoAlpha: 0, y: 80 }, { duration: 1, autoAlpha: 1, y: 0 });
            ScrollTrigger.create({
                trigger: box,
                animation: anim,
                toggleActions: 'play none none none',
                once: true,
            });
        });
    }

    /////////////////////////
    ///////// According /////////
    ///////////////////////
    $('.accordion .panel-heading').click(function () {
        $(this).siblings('.panel-collapse').slideToggle();
        $(this).find('i').toggleClass('fa-plus fa-minus');
    })

    /////////////////////////
    ///////// Single Slider /////////
    ///////////////////////

    if ($('.alfajiri-slider').length) {
        var alfajiriSlider = {
            // Slider Settings
            settings: {
                currentSlide: 1,
                totalSlides: 0,
                animating: false,
                autoPlay: true,
                autoPlaySpeed: 5, // Increase to stay on slides for longer
                transitionSpeed: 2, // Changes transition speed
                autoPlayInterval: false,
                ease: 'expo',
                timeline: gsap.timeline({}),
                imageScale: '',
                controls: {
                    next: document.querySelector('.alfajiri__next'),
                    prev: document.querySelector('.alfajiri__prev'),
                    nav: document.querySelectorAll('.alfajiri__navpoint'),
                }
            },

            // Initiate Slider
            init: function () {
                this.settings.totalSlides = document.querySelectorAll('.alfajiri__slide').length;
                this.settings.controls.prev.addEventListener('click', () => { this.stopAutoPlay(); this.changeSlide('prev'); });
                this.settings.controls.next.addEventListener('click', () => { this.stopAutoPlay(); this.changeSlide('next'); });
                this.settings.controls.nav.forEach((el, key) => {
                    el.addEventListener('click', () => { this.stopAutoPlay(); this.jumpToSlide(key + 1); });
                });

                this.settings.imageScale = gsap.to('.slide--active .slide__image img', 15, { scale: 1.1, ease: "sine.inOut", yoyo: true, yoyoEase: true, repeat: -1 });

                if (this.settings.autoPlay) {
                    this.autoPlay();
                }
            },

            // Change Slide
            changeSlide: function (dir) {
                // console.log(this.settings.animating);
                if (this.settings.animating) return;
                let animateFrom = this.settings.currentSlide;
                if (dir === 'next') {
                    if (this.settings.currentSlide >= this.settings.totalSlides) {
                        this.settings.currentSlide = 1;
                    } else {
                        this.settings.currentSlide++;
                    }
                } else {
                    if (this.settings.currentSlide <= 1) {
                        this.settings.currentSlide = this.settings.totalSlides;
                    } else {
                        this.settings.currentSlide--;
                    }
                }
                this.slideAnimation(animateFrom, this.settings.currentSlide, dir);
            },

            // Slide Navigation
            jumpToSlide: function (slide) {
                if (this.settings.animating || slide === this.settings.currentSlide) return;
                let animateFrom = this.settings.currentSlide;
                this.settings.currentSlide = slide;
                if (slide > animateFrom) {
                    dir = 'next';
                } else {
                    dir = 'prev';
                }

                this.slideAnimation(animateFrom, this.settings.currentSlide, dir);
            },

            // Autoplaying
            autoPlay: function () {
                this.settings.autoPlay = true;

                let el = this.settings.controls.nav[this.settings.currentSlide - 1].children[0].children[0];
                this.settings.timeline.fromTo(el, this.settings.autoPlaySpeed - this.settings.transitionSpeed, {
                    x: '-100%'
                }, {
                    x: 0,
                    ease: 'none',
                    delay: 0.3,
                    onComplete: () => {
                        this.changeSlide('next');
                    },
                });
            },

            stopAutoPlay: function () {
                if (this.settings.autoPlay) {
                    this.settings.timeline.progress(100);
                }
                this.settings.autoPlay = false;
            },

            // Update Nav
            updateNav: function (from, to) {
                gsap.to(this.settings.controls.nav[from - 1].children[0], this.settings.transitionSpeed, {
                    width: '0',
                    ease: this.settings.ease + '.inOut',
                });
                gsap.to(this.settings.controls.nav[from - 1].children[1], this.settings.transitionSpeed, {
                    ease: this.settings.ease + '.inOut',
                });
                gsap.to(this.settings.controls.nav[to - 1].children[0], this.settings.transitionSpeed, {
                    width: '100%',
                    ease: this.settings.ease + '.inOut',
                });
                gsap.to(this.settings.controls.nav[to - 1].children[1], this.settings.transitionSpeed, {
                    ease: this.settings.ease + '.inOut',
                });
                gsap.to(this.settings.controls.nav[from - 1].children[0].children[0], this.settings.transitionSpeed, {
                    x: '100%',
                    ease: this.settings.ease + '.inOut'
                });
            },

            // Slide Animation
            slideAnimation: function (from, to, dir) {
                this.settings.animating = true;

                // console.log(this.settings.animating);

                this.updateNav(from, to);

                from = '.alfajiri__slide[data-slide="' + from + '"]';
                to = '.alfajiri__slide[data-slide="' + to + '"]';

                this.settings.timeline.clear();
                this.settings.timeline.play(0);

                this.settings.timeline.set(to, { display: 'block', })
                    .to(from + ' .slide__content *', (this.settings.transitionSpeed / 100) * 40, {
                        y: -20,
                        opacity: 0,
                        ease: this.settings.ease + '.in',
                        stagger: 0.1,
                    }, 'slideAnimation')
                    .fromTo(to + ' .slide__content *', (this.settings.transitionSpeed / 100) * 40, {
                        y: 20,
                        opacity: 0,
                    }, {
                        y: 0,
                        opacity: 1,
                        ease: 'Power3.out',
                        stagger: 0.1,
                    }, '>0.5')
                    .fromTo(from + ' .slide__image', this.settings.transitionSpeed, {
                        display: 'block',
                        x: '0%',
                    }, {
                        x: dir === 'next' ? '-100%' : '100%',
                        ease: this.settings.ease + '.inOut',
                    }, 'slideAnimation')
                    .fromTo(from + ' .slide__image img', this.settings.transitionSpeed, {
                        transformOrigin: 'center',
                        x: '0%',
                    }, {
                        x: dir === 'next' ? '50%' : '-50%',
                        ease: this.settings.ease + '.inOut',
                    }, 'slideAnimation')
                    .fromTo(to + ' .slide__image img', this.settings.transitionSpeed, {
                        transformOrigin: 'center',
                        x: dir === 'next' ? '-50%' : '50%',
                    }, {
                        x: '0%',
                        ease: this.settings.ease + '.inOut',
                    }, 'slideAnimation')
                    .fromTo(to + ' .slide__image', this.settings.transitionSpeed, {
                        display: 'block',
                        transformOrigin: 'right center',
                        x: dir === 'next' ? '100%' : '-100%',
                    }, {
                        x: '0%',
                        ease: this.settings.ease + '.inOut',
                        onComplete: () => {
                            this.settings.animating = false;
                            gsap.set(from, { display: 'none' });
                            this.settings.imageScale.kill();
                            gsap.set(from + ' .slide__image', { scale: 1 });
                            this.settings.imageScale = gsap.to(to + ' .slide__image img', 15, { scale: 1.1, ease: "sine.inOut", yoyo: true, yoyoEase: true, repeat: -1 });
                        }
                    }, 'slideAnimation');

                if (this.settings.autoPlay) {
                    let el = this.settings.controls.nav[this.settings.currentSlide - 1].children[0].children[0];
                    this.settings.timeline.fromTo(el, this.settings.autoPlaySpeed - this.settings.transitionSpeed, {
                        x: '-100%'
                    }, {
                        x: 0,
                        ease: 'none',
                        onComplete: () => {
                            this.changeSlide('next');
                        }
                    }, '>');
                }
            },
        };
        // Slider INIT
        alfajiriSlider.init();
    }

    /////////////////////////
    ///////// Smooth Scroll /////////
    ///////////////////////

    $(document).on('click', '.stay-indicator a[href^="#"]', function (event) {
        event.preventDefault();

        $('html, body').animate({
            scrollTop: $($.attr(this, 'href')).offset().top
        }, 1500);
    });
    $(function () {
        $(this).impulse();
    });
    // ataredo.com/morphology/lucidscroll - documentation

    (function ($, nib) {

        $.fn.impulse = function (options) {

            var set = $.extend({}, $.fn.impulse.default, options), gate = $(nib),
                vessel = this, object = $(set.target), area = {}, edge = [],
                fad = {}, entity, brink = [], outset = [], quit = [], morph,
                way, speed, destined = [], pour = 'requestAnimationFrame',
                use = $.extend({ novel: pour in nib, turned: 0 }, set);

            elementAnalysis();

            vessel.each(function (hit) {

                use = $.extend({}, use);

                $(this).data('impulse', use).on('wheel.excite', function (act, info) {

                    if (!use.keen && !act.mien) return;

                    if (act.mien) {
                        fad = $.extend({}, use, info);
                        use.annul = fad.delay == true;
                        var loom = act.mien;
                        fad.fluid = false;
                    }
                    else {
                        if (use.annul) return;
                        fad = use;
                        loom = act.originalEvent.deltaY;
                    }

                    loom = loom / Math.abs(loom);

                    if (use.crux) {
                        entity = $(this);
                        brink[0] = edge[hit];
                    }
                    else {
                        entity = object;
                        brink = edge;
                    }

                    $.each({ range: 'orbit', tempo: 'pace' }, function (slot, mate) {
                        if (typeof fad[slot] === 'function') fad[mate] = fad[slot]();
                        else fad[mate] = fad[slot];
                    });

                    if (loom != use.zeal || act.mien) use.turned = 1;
                    else use.turned = Math.min(use.curb, use.turned + 1);

                    if (!fad.delay && fad.fluid && use.turned == 1) morph = 'curve';
                    else morph = fad.effect;

                    way = loom * fad.orbit * Math.pow(use.leap, use.turned - 1);
                    speed = fad.pace * Math.pow(use.sloth, use.turned - 1) || 1;
                    use.zeal = loom;

                    entity.each(function (part) {
                        outset[part] = $(this).scrollTop();
                        destined[part] = outset[part] + way;
                        quit[part] = onFringe(this, part, outset[part]);
                    });

                    use.waive = ceaseOperation();

                    if (!way) speed = 1;
                    if (use.novel) {
                        if (use.motion) {
                            cancelAnimationFrame(use.motion);
                            use.initial = use.present;
                        }
                        else use.initial = Date.now();
                        use.motion = nib[pour](streamCore);
                    }
                    else inciteSource();
                });

                this.addEventListener('wheel', function (tick) {

                    if (!use.keen) return;
                    if (use.annul) return denyRise(tick);
                    else if (fad.delay == true && !use.waive) use.annul = true;
                    if (!(use.waive && use.occur)) denyRise(tick);

                }, hasQuiet() ? { passive: false } : false);
            });

            $.easing['curve'] = $.easing['easeInOutSine'];

            gate.resize(function () {
                clearTimeout(use.bound);
                use.bound = setTimeout(detectOverflow, 100);
            });

            return this;

            function streamCore() {
                use.present = Date.now();
                var advance = Math.min(use.present - use.initial, speed) / speed,
                    increase = $.easing[morph](advance);
                entity.each(function (key) {
                    if (!quit[key]) {
                        $(this).scrollTop(outset[key] + increase * way);
                        checkLimits(this, key, advance);
                    }
                });
                if (advance < 1 && !use.waive) use.motion = nib[pour](streamCore);
                else hindStage();
            }

            function inciteSource() {
                entity.each(function (beat) {
                    if (!quit[beat]) {
                        $(this).stop().animate({ scrollTop: destined[beat] }, {
                            duration: speed,
                            easing: morph,
                            progress: function (current, sequence) {
                                checkLimits(this, beat, sequence);
                            },
                            complete: hindStage
                        });
                    }
                });
            }

            function checkLimits(essence, rank, factor) {
                if (100 * factor >= fad.reset) use.turned = 0;
                if (onFringe(essence, rank)) {
                    quit[rank] = true;
                    if (!use.novel) $(essence).stop(true, true);
                    use.waive = ceaseOperation();
                }
            }

            function onFringe(matter, cue, genesis) {
                var put = Math.round(genesis || $(matter).scrollTop()),
                    above = destined[cue] < 0 && !put,
                    below = destined[cue] > brink[cue] && put == brink[cue] && fad.orbit > 0;
                return above || below;
            }

            function ceaseOperation() {
                return quit.every(function (flag) { return flag });
            }

            function hindStage() {
                use.turned = use.annul = use.motion = 0;
            }

            function denyRise(jab) {
                jab.preventDefault();
                jab.stopPropagation();
            }

            function elementAnalysis() {
                var item = $();
                if (!object.length) {
                    use.crux = true;
                    object = vessel;
                }
                object.each(function () {
                    if ($.zenith(this)) {
                        if (!use.main) {
                            if (use.novel) use.main = nib;
                            else use.main = baseTag();
                            item = item.add(use.main);
                        }
                    }
                    else item = item.add(this);
                });
                use.target = object = item;
                object.each(function (zest) {
                    if ($.zenith(this)) area[zest] = 'hub';
                    else area[zest] = 'sub';
                });
                if (use.crux && use.main) vessel = object;
                detectOverflow();
            }

            function baseTag() {
                var origin = gate.scrollTop();
                gate.scrollTop(1);
                if ($('html').scrollTop()) var root = 'html';
                else if ($('body').scrollTop()) root = 'body';
                else root = 'html, body';
                gate.scrollTop(origin);
                return root;
            }

            function detectOverflow() {
                object.each(function (peg) {
                    if (area[peg] == 'hub') var teem = $(document).height() - gate.height();
                    else teem = this.scrollHeight - $(this).height();
                    edge[peg] = Math.round(teem);
                });
            }

            function hasQuiet() {
                var cold = false,
                    hike = function () { };
                try {
                    var aid = Object.defineProperty({}, 'passive', {
                        get: function () { cold = true }
                    });
                    nib.addEventListener('test', hike, aid);
                    nib.removeEventListener('test', hike, aid);
                } catch (e) { }
                return cold;
            }
        };

        $.zenith = function (sample) {

            var peak = [nib, document, 'HTML', 'BODY'], facet;
            if (sample) return peak.indexOf(sample) > -1 || peak.indexOf(sample.tagName) > -1;
            $.each(peak, function (spot, detail) {
                facet = $(detail).data('impulse');
                if (facet) return false;
            });
            return facet;
        };

        $.fn.impulse.default = {

            target: '',
            range: 135,
            leap: 1.35,
            tempo: 500,
            sloth: 1.1,
            curb: 5,
            reset: 85,
            effect: 'easeOutSine',
            keen: true,
            delay: false,
            occur: true,
            fluid: true
        };

        $.fn.demit = function () {

            return this.each(function () {
                if ($.zenith(this)) var habit = $.zenith();
                else habit = $(this).data('impulse');
                if (habit) {
                    if (habit.novel) cancelAnimationFrame(habit.motion);
                    else habit.target.stop();
                    habit.turned = habit.annul = habit.motion = 0;
                }
            });
        };

        $.fn.amend = function (gist) {

            return this.each(function () {
                if ($.zenith(this)) var quirk = $.zenith();
                else quirk = $(this).data('impulse');
                if (quirk) {
                    $.each(gist, function (sign, rate) {
                        if (sign in quirk) quirk[sign] = rate;
                    });
                }
            });
        };

        $.fn.evoke = function (unit) {

            var lot = $.Event('wheel.excite', { mien: true }), bulk;
            return this.each(function () {
                if ($.zenith(this)) {
                    if (!bulk) {
                        bulk = $.zenith();
                        if (bulk) $(bulk.main).trigger(lot, unit);
                    }
                }
                else $(this).trigger(lot, unit);
            });
        };
    }(jQuery, window));

    (function ($) { var b = {}; $.each(['Quad', 'Cubic', 'Quart', 'Quint', 'Expo'], function (i, n) { b[n] = function (p) { return Math.pow(p, i + 2) } }); $.extend(b, { Sine: function (p) { return 1 - Math.cos(p * Math.PI / 2) }, Circ: function (p) { return 1 - Math.sqrt(1 - p * p) }, Elastic: function (p) { return p === 0 || p === 1 ? p : -Math.pow(2, 8 * (p - 1)) * Math.sin(((p - 1) * 80 - 7.5) * Math.PI / 15) }, Back: function (p) { return p * p * (3 * p - 2) }, Bounce: function (p) { var f, h = 4; while (p < ((f = Math.pow(2, --h)) - 1) / 11) { } return (1 / Math.pow(4, 3 - h) - 7.5625 * Math.pow((f * 3 - 2) / 22 - p, 2)) } }); $.each(b, function (n, e) { $.easing['easeIn' + n] = e; $.easing['easeOut' + n] = function (p) { return 1 - e(1 - p) }; $.easing['easeInOut' + n] = function (p) { return p < 0.5 ? e(p * 2) / 2 : 1 - e(p * -2 + 2) / 2 } }) })(jQuery);

    /////////////////////////
    ///////// Boxes FadeInUp /////////
    ///////////////////////


    // if (window.innerWidth < 767) {
    //     // Add content
    //     const boxes = gsap.utils.toArray('.fadeinup');
    //     boxes.forEach((box, i) => {
    //         const anim = gsap.fromTo(box, { autoAlpha: 0, y: 40 }, { duration: 1, autoAlpha: 1, y: 0 });
    //         ScrollTrigger.create({
    //             trigger: box,
    //             animation: anim,
    //             toggleActions: 'play none none none',
    //             once: true,
    //         });
    //     });
    // } else {
    //     const boxes = gsap.utils.toArray('.fadeinup');
    //     boxes.forEach((box, i) => {
    //         const anim = gsap.fromTo(box, { autoAlpha: 0, y: 80 }, { duration: 2, autoAlpha: 2, y: 0 });
    //         ScrollTrigger.create({
    //             trigger: box,
    //             animation: anim,
    //             toggleActions: 'play none none none',
    //             once: true,
    //         });
    //     });
    // }

    $(document).ready(function () {
        $('.stay-indicator a').bind('click', function (e) {
            e.preventDefault(); // prevent hard jump, the default behavior
            var target = $(this).attr("href"); // Set the target as variable
            // perform animated scrolling by getting top-position of target-element and set it as scroll target
            $('html, body').stop().animate({
                scrollTop: $(target).offset().top + 50
            }, 600);
            return false;
        });
    });

    $(window).scroll(function () {
        var scrollDistance = $(window).scrollTop();
        $('.stay-item').each(function (i) {
            if ($(this).position().top < scrollDistance) {
                $('.stay-indicator li.active').removeClass('active');
                $('.stay-indicator li').eq(i).addClass('active');
            }
        });
    }).scroll();

    // $('.stay-indicator a').click(function () {
    //     $(this).parents('ul').children('li').removeClass('active');
    //     $(this).parent('li').addClass('active')
    // })

    /////////////////////////
    ///////// Zigzag Slider /////////
    ///////////////////////
    var Swipes = new Swiper('.zigzag-slider-container,.single-slider', {
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        }
    });

    /////////////////////////
    ///////// Awards Slider /////////
    ///////////////////////
    new Swiper('.awards-container', {
        loop: false,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        slidesPerView: 7,
        paginationClickable: true,
        spaceBetween: 20,
        breakpoints: {
            1025: {
                slidesPerView: 7,
                spaceBetween: 0
            },
            480: {
                slidesPerView: 4,
                spaceBetween: 0
            },
            1: {
                slidesPerView: 1,
                spaceBetween: 0
            }
        }
    });

    /////////////////////////
    ///////// Activities Slider /////////
    ///////////////////////
    var mySwiper = new Swiper('.activities-slider-container', {
        loop: true,
        speed: 1000,
        slidesPerView: 3.5,
        centeredSlides: true,
        centeredSlidesBounds: true,
        preloadImages: false,
        lazy: false,
        spaceBetween: 30,
        navigation: {
            nextEl: '.slide-arrow-1 .swiper-button-next',
            prevEl: '.slide-arrow-1 .swiper-button-prev',
        },
        breakpoints: {
            1025: {
                slidesPerView: 3.5,
            },
            766: {
                slidesPerView: 2,
                spaceBetween: 20
            },
            1: {
                slidesPerView: 1.3,
                spaceBetween: 20
            }
        }
    })

    var mySwiper1 = new Swiper('.activities-slider-container-1', {
        loop: true,
        speed: 1000,
        slidesPerView: 3.5,
        centeredSlides: true,
        centeredSlidesBounds: true,
        preloadImages: false,
        lazy: false,
        spaceBetween: 30,
        navigation: {
            nextEl: '.slide-arrow-2 .swiper-button-next',
            prevEl: '.slide-arrow-2 .swiper-button-prev',
        },
        breakpoints: {
            1025: {
                slidesPerView: 3.5,
            },
            766: {
                slidesPerView: 2,
                spaceBetween: 20
            },
            1: {
                slidesPerView: 1.3,
                spaceBetween: 20
            }
        }
    })

    var _li, _sections;

    $(function () {
        _li = $(".stay-indicator").find("li");
        _sections = $("body").find("div");
        $(window).on('scroll', liBgs);
    });


    function liBgs() {
        for (var i = 0; i < _li.length; i++) {
            var _litop = _li.eq(i).offset().top;
            for (var j = 0; j < _sections.length; j++) {
                var $s = _sections.eq(j),
                    _sectop = $s.offset().top,
                    _secbottom = $s.offset().top + $s.height() - 20;
                if (_litop > _sectop && _litop > _secbottom) {
                    console.log($s);
                    /*if($s.hasAttribute('data-menu-color')) {
                        var color = $s.attr('data-menu-color');
                        _li.eq(i).find('a').css('color', color);
                    } else {
                        _li.eq(i).find('a').css('color', '#000000');
                    }*/
                    //var _color = rgb2hex($s.css('background-color'));
                    //_li.eq(i).find('a').css('color', (_color == "#ffffff") ? "#000000" : "#ffffff");
                }
            }

        }
    }

    function rgb2hex(rgb) {
        rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        function hex(x) {
            return ("0" + parseInt(x).toString(16)).slice(-2);
        }
        return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
    }

}) //// Doctype end

