import PolicyContent from '../components/PolicyContent'
export default function PrivacyPolicy() {
  return <PolicyContent title="Privacy Policy" description="How participant information is collected, used and protected." sections={[
    ['Information collected', 'Personal, institutional, registration, payment and submission details, each with its purpose.'],
    ['Use of information', 'Registration, workshops, innovation submissions, enquiries and event communications.'],
    ['Sharing', 'Payment and event service providers only, with the purpose disclosed.'],
    ['Retention and security', 'Retention periods and security practices will be published by the organiser.'],
    ['Your rights', 'Access, assistance and consent withdrawal. Verified contact details are pending.'],
    ['Cookies and media', 'Cookies, analytics and any event photography or recording will be disclosed with consent choices.'],
  ]} />
}
