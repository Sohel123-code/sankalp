import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { JSDOM } from 'jsdom'
import { createServer } from 'vite'

const dom = new JSDOM('<!doctype html><html><body><main id="host"></main></body></html>', {url:'http://localhost/',pretendToBeVisual:true})
for (const key of ['window','document','HTMLElement','Element','Node','SVGElement','Event','MutationObserver']) globalThis[key]=dom.window[key]
globalThis.getComputedStyle=dom.window.getComputedStyle.bind(dom.window)
Object.defineProperty(globalThis,'navigator',{value:dom.window.navigator,configurable:true})
globalThis.requestAnimationFrame=dom.window.requestAnimationFrame.bind(dom.window)
globalThis.cancelAnimationFrame=dom.window.cancelAnimationFrame.bind(dom.window)
globalThis.ResizeObserver=class{observe(){} disconnect(){}}
window.scrollTo=()=>{}
let width=1280, height=900, reduced=false
window.matchMedia=query=>({matches:query==='all'||query.split(' and ').every(part=>{
  if(part.includes('prefers-reduced-motion'))return part.includes('no-preference')?!reduced:reduced
  if(part.includes('min-width'))return width>=Number(part.match(/\d+/)[0])
  if(part.includes('max-width'))return width<=Number(part.match(/\d+/)[0])
  if(part.includes('min-height'))return height>=Number(part.match(/\d+/)[0])
  return true
}),media:query,addListener(){},removeListener(){},addEventListener(){},removeEventListener(){}})
globalThis.matchMedia=window.matchMedia
const server=await createServer({server:{middlewareMode:true,hmr:false,open:false},appType:'custom',optimizeDeps:{noDiscovery:true,entries:[]}})
const {mountReferenceMotion,mountSummitStory}=await server.ssrLoadModule('/src/utils/referenceMotion.js')
const { gsap } = await import('gsap')
let ScrollTrigger
const host=document.getElementById('host')
const wait=()=>new Promise(resolve=>setTimeout(resolve,100))
const fixture=()=>{
  host.innerHTML='<section class="summit-hero"><h1>Protected hero</h1></section><section data-summit-scene><div data-reveal-heading><h2>Explore our programme</h2></div><article data-reveal-card>First card</article><article data-reveal-card>Second card</article><div data-reveal-card><form><input aria-label="Name"></form></div></section>'
  host.querySelectorAll('[data-reveal-card],[data-reveal-heading]').forEach(el=>{el.getBoundingClientRect=()=>({top:950,left:0,bottom:1150,right:600,width:600,height:200})})
}
const storyFixture=()=>{
  host.innerHTML='<section class="summit-story"><div class="summit-story-stage"><div class="summit-story-opening">Introduction</div><div class="summit-story-facts"><div class="summit-story-summary">Summit overview</div><div class="summit-story-panels">'+Array.from({length:4},(_,i)=>`<div class="summit-story-panel">Fact ${i}</div>`).join('')+'</div></div></div></section>'
  return host.firstElementChild
}
try {
  fixture()
  const hero=host.querySelector('.summit-hero').outerHTML
  const release=mountReferenceMotion(host)
  ScrollTrigger=gsap.core.globals().ScrollTrigger
  await wait()
  const cards=host.querySelectorAll('article')
  const cardTrigger=ScrollTrigger.getAll().find(t=>t.trigger===cards[0])
  assert(cardTrigger?.animation,`A real ScrollTrigger controls the card: triggers=${ScrollTrigger.getAll().length}; card=${cards[0].outerHTML}`)
  cardTrigger.animation.progress(0)
  assert.equal(Number(cards[0].style.opacity),0,'Card starts in darkness')
  cardTrigger.animation.progress(1)
  assert.equal(Number(cards[0].style.opacity),1,'Card becomes fully readable')
  cardTrigger.animation.progress(.35)
  assert(Number(cards[0].style.opacity)>0&&Number(cards[0].style.opacity)<1,'Reverse scroll restores an intermediate frame')
  assert.equal(host.querySelector('.summit-hero').outerHTML,hero,'Body motion never touches the protected hero')
  assert(!host.querySelector('form').parentElement.hasAttribute('data-reference-animated'),'Forms are not hidden')
  const nextCard=document.createElement('article')
  nextCard.dataset.revealCard='';nextCard.textContent='Dynamically loaded workshop'
  host.querySelector('[data-summit-scene]').append(nextCard)
  await wait(); await wait()
  assert.equal(ScrollTrigger.getAll().filter(t=>t.trigger===nextCard).length,1,`New tab content gets exactly one animation owner: ${nextCard.outerHTML}; triggers=${ScrollTrigger.getAll().length}`)
  assert.equal(ScrollTrigger.getAll().filter(t=>t.trigger===cards[0]).length,1,'Existing cards do not accumulate duplicate timelines')
  release()
  assert.equal(ScrollTrigger.getAll().length,0,'All section triggers are released')
  assert(!cards[0].style.opacity&&!cards[0].style.transform,'Cleanup restores content visibility')

  host.innerHTML='<div class="summit-home-content"><section class="summit-section" data-summit-scene><div class="summit-section-heading"><h2>Participation</h2></div><div class="summit-section-body"><div class="summit-participation-grid"><a href="/showcase">Research showcase</a><a href="/partners">Partnerships</a></div></div></section></div><footer>Protected footer</footer>'
  const chapter=host.querySelector('.summit-section'),footer=host.querySelector('footer').outerHTML
  chapter.getBoundingClientRect=()=>({top:950,left:0,bottom:1550,right:900,width:900,height:600})
  const releaseChapters=mountReferenceMotion(host)
  await wait()
  const chapterTimeline=ScrollTrigger.getAll().find(trigger=>trigger.trigger===chapter && trigger.animation)?.animation
  assert(chapterTimeline,'Remaining homepage sections receive a complete scene timeline')
  chapterTimeline.progress(0)
  assert.equal(Number(chapter.style.opacity),0)
  chapterTimeline.progress(.5)
  assert(Number(chapter.style.opacity)>0,'Chapter fades in progressively')
  chapterTimeline.progress(1)
  assert.equal(Number(chapter.style.opacity),1,'Completed chapter reveals must never leave their content transparent')
  chapterTimeline.progress(0)
  assert.equal(Number(chapter.style.opacity),0,'Reverse scrolling can rewind the entrance')
  chapterTimeline.progress(1)
  assert.equal(Number(chapter.style.opacity),1,'Scrolling back restores the chapter')
  assert.equal(host.querySelector('footer').outerHTML,footer,'Footer has no animation ownership')
  releaseChapters()
  assert.equal(ScrollTrigger.getAll().length,0)

  const story=storyFixture()
  const releaseStory=mountSummitStory(story)
  await wait()
  assert(story.classList.contains('story-pinned'))
  const sequence=ScrollTrigger.getAll().find(t=>t.pin===story.querySelector('.summit-story-stage'))
  assert(sequence?.animation,'Desktop story has a pinned GSAP sequence')
  const panels=story.querySelectorAll('.summit-story-panel')
  sequence.animation.time(1.8)
  assert.equal(Number(panels[0].style.opacity),1,'First statistic appears after montage')
  sequence.animation.time(3.1)
  assert.equal(Number(panels[0].style.opacity),0)
  assert.equal(Number(panels[1].style.opacity),1,'Next statistic replaces the first')
  sequence.animation.time(5.6)
  assert.equal(Number(panels[3].style.opacity),1,'All four facts are reachable')
  sequence.animation.progress(1)
  assert.equal(Number(story.querySelector('.summit-story-facts').style.opacity),1,'The final story frame stays visible as its pin releases')
  sequence.animation.time(1.8)
  assert.equal(Number(panels[0].style.opacity),1,'Story reverses with scroll')
  releaseStory()
  assert(!story.classList.contains('story-pinned')&&!host.querySelector('.pin-spacer'),'Cleanup removes pinning and spacer')
  assert(!panels[0].style.opacity,'Facts return to readable flow after cleanup')

  // Integration regression: the lazy story pin mounts AFTER the downstream
  // triggers. Model its real spacer contribution and drive actual scroll updates,
  // rather than only seeking isolated animations by hand.
  let scrollPosition=0
  Object.defineProperty(window,'pageYOffset',{configurable:true,get:()=>scrollPosition})
  window.scrollTo=(_x,y)=>{scrollPosition=typeof _x==='object'?_x.top||0:y||0}
  const lateStory=storyFixture()
  const content=document.createElement('div');content.className='summit-home-content'
  lateStory.replaceWith(content);content.append(lateStory)
  const viewport=window.innerHeight
  const padding=()=>parseFloat(lateStory.querySelector('.pin-spacer')?.style.paddingBottom)||0
  const rect=(top,size)=>({top:top-scrollPosition,left:0,bottom:top-scrollPosition+size,right:1200,width:1200,height:size})
  lateStory.getBoundingClientRect=()=>rect(1000,viewport+padding())
  const stage=lateStory.querySelector('.summit-story-stage')
  stage.getBoundingClientRect=()=>rect(1000,viewport)
  Object.defineProperties(stage,{offsetHeight:{get:()=>viewport},offsetWidth:{get:()=>1200}})
  const downstream=Array.from({length:6},(_,index)=>{
    const section=document.createElement('section')
    section.className='summit-section';section.dataset.summitScene=''
    section.innerHTML='<div class="summit-section-heading"><h2>Homepage chapter</h2></div><div class="summit-section-body"><div class="frontier-preview">Readable content</div></div>'
    const y=()=>1000+viewport+padding()+index*1000
    section.getBoundingClientRect=()=>rect(y(),1000)
    section.querySelector('.summit-section-heading').getBoundingClientRect=()=>rect(y()+100,120)
    section.querySelector('.frontier-preview').getBoundingClientRect=()=>rect(y()+300,400)
    content.append(section)
    return {section,y}
  })
  const releaseDownstream=mountReferenceMotion(host)
  const releaseLateStory=mountSummitStory(lateStory)
  ScrollTrigger.refresh();await wait()
  assert(padding()>viewport*3,'The upstream story contributes its full scroll distance')
  for(const {section,y} of downstream){
    const reveal=ScrollTrigger.getAll().find(trigger=>trigger.trigger===section && trigger.animation)
    assert(Math.abs(reveal.start-(y()-viewport*.94))<3,'Each chapter is measured after the upstream pin spacer')
    window.scrollTo(0,y()+250)
    window.dispatchEvent(new Event('scroll'));await wait();ScrollTrigger.update()
    for(const trigger of ScrollTrigger.getAll()) trigger.getTween?.()?.progress(1)
    assert.equal(Number(section.style.opacity),1,'Every reached homepage chapter remains visible after the story')
    assert.equal(Number(section.querySelector('.frontier-preview').style.opacity),1,'Its content panels are visible too')
  }
  releaseDownstream();releaseLateStory()
  assert.equal(ScrollTrigger.getAll().length,0,'Combined story and chapter owners clean up together')
  assert(!host.querySelector('.pin-spacer'),'No blank pin spacer survives navigation')
  scrollPosition=0;window.scrollTo=()=>{}
  const nextStory=storyFixture()
  width=390
  const releaseMobile=mountSummitStory(nextStory)
  assert(!nextStory.classList.contains('story-pinned')&&!ScrollTrigger.getAll().some(t=>t.pin),'Mobile never pins the introduction')
  assert.equal(ScrollTrigger.getAll().length,4,'Mobile facts reveal individually in normal document flow')
  releaseMobile()
  width=1280; height=500
  const releaseShort=mountSummitStory(nextStory)
  assert(!nextStory.classList.contains('story-pinned'),'Short landscape viewports keep the entire story readable')
  releaseShort();height=900
  reduced=true; width=1280
  fixture()
  const releaseReduced=mountReferenceMotion(host)
  const reducedStory=storyFixture(),releaseReducedStory=mountSummitStory(reducedStory)
  assert.equal(ScrollTrigger.getAll().length,0,'Reduced motion creates no section or story timelines')
  releaseReduced();releaseReducedStory()
  const css=await readFile(new URL('../src/styles/summit-redesign.css',import.meta.url),'utf8')
  assert(css.includes('[data-reference-animated]:focus-within'),'Keyboard focus reveals hidden content')
  console.log('PASS: reveal/reverse frames, delayed story pin, actual scroll through all six downstream chapters, hero/form isolation, pin cleanup, mobile and reduced-motion fallbacks')
}finally{
  ScrollTrigger.getAll().forEach(t=>t.kill())
  await Promise.race([server.close(),new Promise(resolve=>setTimeout(resolve,2000))])
  dom.window.close()
}
process.exit(0)
