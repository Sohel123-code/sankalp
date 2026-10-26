import { isPhone } from './calmScroll'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const reduceQuery = '(prefers-reduced-motion: reduce)'
const cardSelector = '.research-card, .workshop-visual-card, .summit-participation-grid > a, .summit-audience-grid > details, [data-reveal-card]'

export function mountReferenceMotion(host) {
  gsap.registerPlugin(ScrollTrigger)
  const media = gsap.matchMedia()
  media.add({ desktop: '(min-width: 900px)', mobile: '(max-width: 899px)', reduced: reduceQuery }, context => {
    if (context.conditions.reduced || isPhone()) return
    const desktop = context.conditions.desktop
    const scenes = new Map()
    const addScene = scene => {
      if (scenes.has(scene) || scene.closest('.summit-hero, .page-intro, [role="dialog"]')) return
      const heading = [...scene.querySelectorAll('.summit-section-heading, [data-reveal-heading]')].find(el=>el.closest('[data-summit-scene]')===scene)
      const body = scene.querySelector('.summit-section-body')
      // A section containing an active form stays completely visible. Decorative
      // headings and separate cards can still animate around it.
      const targets = [...scene.querySelectorAll(cardSelector)].filter(el=>el.closest('[data-summit-scene]')===scene && !el.closest('form') && !el.querySelector('form') && !el.closest('[data-effect-owned]'))
      const words = heading ? [...heading.querySelectorAll('[data-reveal-word]')] : []
      const homeChapter = scene.matches('.summit-home-content .summit-section')
      const animated = [homeChapter ? scene : null, heading, body, ...targets, ...words].filter(Boolean)
      const local = gsap.context(() => {
        if (homeChapter) {
          const panels = [...scene.querySelectorAll('.frontier-tabs, .frontier-preview, .day-selector, .summit-preview-session, .summit-workshop-list > div, .summit-workshop-feature > .summit-section-body > div:last-child, .summit-audience-grid > details, .summit-participation-grid > a, .summit-closing > .summit-section-body > *')]
          // Reveal in normal document flow, then stay readable. A terminal
          // opacity:0 on the whole chapter can hide every descendant if an
          // upstream pin changes its measured scroll range after lazy mounting.
          gsap.fromTo(scene, { opacity: 0 }, { opacity: 1, ease: 'power1.out', scrollTrigger: { trigger: scene, start: 'top 94%', end: 'top 62%', scrub: .3, invalidateOnRefresh: true } })
          if (heading) gsap.fromTo(heading, { y: desktop ? 64 : 22 }, { y: 0, ease: 'power2.out', scrollTrigger: { trigger: heading, start: 'top 96%', end: 'top 38%', scrub: .3 } })
          if (words.length) gsap.fromTo(words, { yPercent: 110 }, { yPercent: 0, stagger: .045, ease: 'power2.out', scrollTrigger: { trigger: heading, start: 'top 92%', end: 'top 45%', scrub: .3 } })
          panels.forEach((panel, index) => {
            gsap.fromTo(panel, { opacity: 0, y: desktop ? 72 : 26, scale: desktop ? .96 : 1 }, { opacity: 1, y: 0, scale: 1, ease: 'power2.out', scrollTrigger: { trigger: panel, start: `top ${96 - index % 3 * 2}%`, end: 'top 54%', scrub: .3, invalidateOnRefresh: true } })
            panel.setAttribute('data-reference-animated', '')
          })
          animated.push(...panels)
          return
        }
        if (heading) gsap.fromTo(heading, {opacity:0,y:desktop?38:18}, {opacity:1,y:0,ease:'none',scrollTrigger:{trigger:heading,start:'top 95%',end:'top 64%',scrub:.3,invalidateOnRefresh:true}})
        if (words.length) gsap.fromTo(words,{yPercent:110},{yPercent:0,stagger:.035,ease:'power2.out',scrollTrigger:{trigger:heading,start:'top 94%',end:'top 62%',scrub:.3,invalidateOnRefresh:true}})
        if (body && !body.querySelector('form') && !targets.length) gsap.fromTo(body,{opacity:0,y:desktop?54:24,scale:desktop?.975:1},{opacity:1,y:0,scale:1,ease:'none',scrollTrigger:{trigger:body,start:'top 98%',end:'top 63%',scrub:.3,invalidateOnRefresh:true}})
        targets.forEach((card,index)=>{
          gsap.fromTo(card,{opacity:0,y:desktop?64:24},{opacity:1,y:0,ease:'power1.out',scrollTrigger:{trigger:card,start:`top ${96-Math.min(index%3,2)*3}%`,end:`top ${63-Math.min(index%3,2)*3}%`,scrub:.3,invalidateOnRefresh:true}})
        })
      }, scene)
      // Keyboard users must not encounter invisible controls. GSAP remains the
      // owner of transforms; CSS only ensures focus overrides decorative styles.
      animated.forEach(el=>el.setAttribute('data-reference-animated',''))
      scenes.set(scene,{local,animated})
    }
    const scan = () => {
      for (const [scene, record] of scenes) if (!host.contains(scene)) {record.local.revert(); scenes.delete(scene)}
      host.querySelectorAll('[data-summit-scene]').forEach(addScene)
    }
    scan()
    // Tab changes replace scene content; rebuild only that scene, not the page.
    let frame = 0, disposed = false
    const observer = new MutationObserver(records=>{
      // GSAP can temporarily move nodes while measuring their transforms.
      // Do not interpret those measurement mutations as React tab changes.
      observer.disconnect()
      for (const record of records) {
        const scene = record.target.closest?.('[data-summit-scene]')
        if (scene && scenes.has(scene)) {
          const entry=scenes.get(scene); entry.local.revert(); entry.animated.forEach(el=>el.removeAttribute('data-reference-animated')); scenes.delete(scene)
        }
      }
      cancelAnimationFrame(frame); frame=requestAnimationFrame(()=>{
        frame=0
        if(disposed)return
        scan(); ScrollTrigger.refresh()
        observer.observe(host,{childList:true,subtree:true})
      })
    })
    observer.observe(host,{childList:true,subtree:true})
    let refreshFrame=0
    const refresh=()=>{
      if(disposed||frame)return
      cancelAnimationFrame(refreshFrame)
      refreshFrame=requestAnimationFrame(()=>{
        if(disposed||frame)return
        observer.disconnect();ScrollTrigger.refresh();observer.observe(host,{childList:true,subtree:true})
      })
    }
    const resize=new ResizeObserver(refresh);resize.observe(host)
    host.addEventListener('toggle',refresh,true)
    document.fonts?.ready.then(()=>{if(host.isConnected) refresh()})
    return ()=>{
      disposed=true;observer.disconnect();resize.disconnect();cancelAnimationFrame(frame);cancelAnimationFrame(refreshFrame);host.removeEventListener('toggle',refresh,true)
      for(const {local,animated} of scenes.values()){local.revert();animated.forEach(el=>el.removeAttribute('data-reference-animated'))}
    }
  },host)
  return ()=>media.revert()
}

export function mountSummitStory(host) {
  gsap.registerPlugin(ScrollTrigger)
  const media=gsap.matchMedia()
  media.add('(min-width: 900px) and (min-height: 680px) and (prefers-reduced-motion: no-preference)',()=>{
    if(isPhone())return // touch tablets keep the stacked layout: no pinned stage
    const stage=host.querySelector('.summit-story-stage'), opening=host.querySelector('.summit-story-opening')
    const facts=host.querySelector('.summit-story-facts'), panels=[...host.querySelectorAll('.summit-story-panel')]
    const summary=host.querySelector('.summit-story-summary')
    host.classList.add('story-pinned')
    // This lazy-mounted pin must be measured before all downstream chapters,
    // regardless of which React effect/import finishes first.
    const timeline=gsap.timeline({scrollTrigger:{trigger:host,start:'top top',end:()=>`+=${window.innerHeight*3.2}`,pin:stage,scrub:.3,anticipatePin:1,invalidateOnRefresh:true,refreshPriority:10}})
    gsap.set(facts,{opacity:0});gsap.set(panels,{opacity:0,y:28})
    timeline.to(opening,{scale:.78,opacity:0,y:-45,duration:1,ease:'power2.inOut'},.2)
      .to(facts,{opacity:1,duration:.5},1)
      .fromTo(summary,{opacity:.6,y:20},{opacity:1,y:0,duration:1,ease:'none'},1)
    panels.forEach((panel,index)=>{
      const start=1.2+index*1.25
      timeline.to(panel,{opacity:1,y:0,duration:.35},start)
      if(index<panels.length-1) timeline.to(panel,{opacity:0,y:-24,duration:.3},start+1)
    })
    // Keep the last statistic visible while the pin releases. Fading the entire
    // stage out here otherwise leaves an empty viewport before Tracks arrives.
    timeline.to(facts,{opacity:1,duration:1.35},5.3)
    return ()=>host.classList.remove('story-pinned')
  },host)
  media.add('(min-width: 701px) and (max-width: 899px) and (prefers-reduced-motion: no-preference)',()=>{
    if(isPhone())return
    host.querySelectorAll('.summit-story-panel').forEach(panel=>{
      gsap.fromTo(panel,{opacity:0,y:24},{opacity:1,y:0,ease:'none',scrollTrigger:{trigger:panel,start:'top 95%',end:'top 65%',scrub:.3,invalidateOnRefresh:true}})
    })
  },host)
  return ()=>media.revert()
}
