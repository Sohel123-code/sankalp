import PolicyContent from '../components/PolicyContent'
export default function TermsConditions() {
  return <PolicyContent title="Terms & Conditions" description="Participation terms will be published once approved by the organising entity." sections={[
    ['Event identity and status', 'SANKALP Andhra 2026 is a proposed two-day Andhra Pradesh Technology Summit. Dates, venue, organising entity, speakers and final programme remain subject to confirmation.'],
    ['Registration and payment', 'Approved eligibility, fees, GST treatment, invoices and transaction terms will be published before payments are accepted. The relationship between specialist workshops and summit registration remains to be confirmed.'],
    ['Programme and participation', 'The final terms will address programme changes, speaker substitutions, event changes, conduct, safety, venue access and identification requirements.'],
    ['Workshops and certificates', 'Attendance, deliverable and certificate requirements will be confirmed. Proposed workshop recording access is subject to speaker consent and availability.'],
    ['Innovation Challenge', 'Summit registration is mandatory. Pitch participation is subject to eligibility verification, shortlisting and organiser-approved criteria. Deadlines, pitch duration, team size, submission formats and judging arrangements will be announced.'],
    ['Intellectual property and media', 'Protect unpublished research and proprietary information before public disclosure. Obtain permission before sharing confidential third-party material. Event-specific IP, photography, recording and publicity terms will be published.'],
    ['Commercial outcomes', 'Participation does not guarantee funding, investment, incubation, partnerships or commercialisation. Investors make independent decisions following their own assessment and due diligence.'],
    ['Final policy', 'Liability, applicable law, cancellation provisions and other final terms require review and approval by the organising entity.'],
  ]} />
}
