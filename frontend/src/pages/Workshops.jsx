import { useState } from 'react'
import { WorkshopMotionIntro } from '../components/RequestedEffects'
import PageHeader from '../components/PageHeader'
import { WorkshopExplorer, LabTrack, ReadinessChecklist, WorkshopRhythm } from '../components/WorkshopExplorer'
import { FancyButton } from '../components/Motion'
import { WORKSHOPS, OPEN_SUMMIT_LABS, WORKSHOP_REQUIREMENTS, REGISTRATION_FEES } from '../data/sankalpData'
import { WORKSHOP_TIMELINE } from '../data/trackContext'

const titles = ['Build with AI','Quantum machine learning','Industrial digital twins','Biomedical data & precision medicine']
const workshopCards = WORKSHOPS.map((workshop, index) => ({ ...workshop, cardTitle: titles[index] }))

export default function Workshops() {
  const [tab,setTab]=useState('specialist')
  return <div><PageHeader badge="Hands-on learning" title="Build. Test. Discover." subtitle="Four specialist workshops. Three open summit labs." breadcrumb={[{label:'Workshops & Labs'}]} /><WorkshopMotionIntro /><div id="workshop-options" className="section-shell compact-page workshop-content"><div className="workshop-meta"><div><span className="tiny-label">DAY 02 · PROPOSED</span><strong>9:15 AM – 1:00 PM</strong></div><div><span className="tiny-label">WORKSHOP ADD-ON</span><strong>Student ₹350 · Faculty ₹500 · Industry ₹700</strong></div><FancyButton to="/registration" secondary>Fees & registration</FancyButton></div><p className="compact-note">Final eligibility and summit pass requirements to be confirmed.</p><div className="filter-pills workshop-switch" aria-label="Workshop sections">{[['specialist','4 Specialist Workshops'],['labs','3 Open Summit Labs'],['guidelines','Participant Checklist']].map(([key,label])=><button key={key} aria-pressed={tab===key} onClick={()=>setTab(key)}>{label}</button>)}</div>
  {tab==='specialist' && <WorkshopExplorer items={workshopCards} />}
  {tab==='labs' && <LabTrack items={OPEN_SUMMIT_LABS} />}
  {tab==='guidelines' && <ReadinessChecklist items={WORKSHOP_REQUIREMENTS} />}
  <section className="wx-section" aria-labelledby="wx-rhythm-title"><span className="eyebrow">ONE MORNING, START TO FINISH</span><h2 id="wx-rhythm-title">How a workshop runs</h2><WorkshopRhythm steps={WORKSHOP_TIMELINE} /></section>
  <section className="wx-section" aria-labelledby="wx-inc-title"><h2 id="wx-inc-title">What the add-on includes</h2><ul className="wx-inclusions">{REGISTRATION_FEES.workshopInclusions.map(inc=><li key={inc}>{inc}</li>)}</ul></section>
</div></div>
}
