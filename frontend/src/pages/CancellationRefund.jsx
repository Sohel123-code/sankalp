import PolicyContent from '../components/PolicyContent'
export default function CancellationRefund() {
  return <PolicyContent title="Cancellation & Refund Policy" description="Cancellation and refund rules are not yet established in the supplied summit materials." sections={[
    ['Approval status', 'No cancellation deadlines, refund percentages, transfer rules or no-show rules have been specified. These details will be published after organiser approval and before payments are collected.'],
    ['Summit, workshop and Challenge fees', 'The approved policy will explain the rules for delegate registration, specialist workshops and Innovation Challenge fees. No refund entitlement or non-refundable period is currently announced.'],
    ['Payment issues and invoices', 'Payment-failure handling, duplicate-payment requests, invoice procedures, refund processing and support contacts will be included in the final policy.'],
    ['Event changes', 'The organisers will publish the applicable process for postponement, cancellation, programme changes and delegate substitutions.'],
  ]} />
}
