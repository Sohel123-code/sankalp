import PolicyContent from '../components/PolicyContent'
export default function PrivacyPolicy() {
  return <PolicyContent title="Privacy Policy" description="The approved privacy policy will explain how participant information is collected, used and protected." sections={[
    ['Information collected', 'The final policy will identify the personal, institutional, registration, payment and submission information collected, and explain the purpose of each category.'],
    ['Use of information', 'The policy will explain how information is used for registration, workshop participation, innovation submissions, enquiries and event communications.'],
    ['Service providers and sharing', 'Payment providers, event service providers and any other recipients of participant information will be disclosed, together with the purpose of sharing.'],
    ['Retention and security', 'Approved retention periods and security practices will be published by the organising entity.'],
    ['Rights, consent and contact', 'The final policy will explain participant rights, how to request assistance and how consent can be withdrawn where applicable. Verified contact details are pending.'],
    ['Cookies, analytics and media', 'Any cookies or analytics will be explained with the applicable consent choices. Event photography and recording notices will be published if those activities are planned.'],
  ]} />
}
