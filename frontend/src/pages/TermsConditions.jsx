import PolicyContent from '../components/PolicyContent'
export default function TermsConditions() {
  return <PolicyContent title="Terms & Conditions" description="Participation terms, published once approved by the organiser." sections={[
    ['Event status', 'SANKALP Andhra 2026 is a proposed two-day technology summit. Dates, venue, speakers and programme are subject to confirmation.'],
    ['Registration and payment', 'Eligibility, fees, GST and invoices will be published before payments open.'],
    ['Programme and conduct', 'Covers programme changes, speaker substitutions, conduct, safety and venue access.'],
    ['Workshops and certificates', 'Attendance and certificate requirements to be confirmed. Recordings depend on speaker consent.'],
    ['Innovation Challenge', 'Summit registration is mandatory. Pitching requires eligibility verification and shortlisting; deadlines and formats will be announced.'],
    ['IP and media', 'Protect unpublished research before disclosure and get permission for third-party material. Photography and recording terms will be published.'],
    ['No guaranteed outcomes', 'Participation does not guarantee funding, investment, incubation or partnerships.'],
    ['Liability and law', 'Liability, governing law and cancellation terms await organiser approval.'],
  ]} />
}
