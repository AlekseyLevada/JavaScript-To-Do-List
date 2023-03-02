gsap.registerPlugin(ScrollTrigger)


gsap.from('header', {
    opacity: 0,
    yPercent: -100,
    duration: 1,  
})

gsap.from('.header-logo', {
    opacity: 0,
    yPercent: -100,
    delay: 1,
    duration: 1,
})

gsap.from('.settings', {
    opacity: 0,
    yPercent: -100,
    delay: 1,
    duration: 1,
})

gsap.from('h2', {
    yPercent: -40,
    scale: 0,
    opacity: 0,
    delay: 1.5,
    duration: 1.5,
})

gsap.from('.task', {
    delay: 2.5,
    stagger: .3,
    xPercent: -110,
})
