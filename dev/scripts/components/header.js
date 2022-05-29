export function BurgerMenu(){
  let burgerOpen = document.querySelector('.burger-icon'),
  burgerClose = document.querySelector('.burger__close'),
  burger = document.querySelector('.burger'),
  tl = gsap.timeline({}),
  flag = false

  tl.fromTo(burger,{
    display:'none',
    opacity:0,
    y:-100
  },{
    display:'block',
    opacity:1,
    y:0,
    duration:0.4
  })
  .fromTo(burgerClose,{
    display:'none',
    opacity:0,
    y:-100
  },{
    display:'block',
    opacity:1,
    y:0,
    duration:0.4
  })
  .fromTo('.burger__menu',{
    display:'none',
    opacity:0,
    y:-100
  },{
    display:'grid',
    opacity:1,
    y:0,
    duration:0.4
  })
  .fromTo('.burger__navigation-button',{
    display:'none',
    opacity:0,
    y:100
  },{
    display:'block',
    opacity:1,
    y:0,
    duration:0.4
  })
  .reversed(true)

  burgerOpen.addEventListener('click', function(){
    document.body.classList.add('stop-resize')
    tl.play()
    flag = true
  })
  burgerClose.addEventListener('click', function(){
    document.body.classList.remove('stop-resize')
    tl.reverse()
    flag = false
  })

  window.addEventListener('resize', function(){
    document.body.classList.remove('stop-resize')
    if (document.body.offsetWidth >= 768 && flag){
      tl.reverse()
    }
  })
}
