import PolicyContent from '../components/PolicyContent'
export default function CancellationRefund() {
  return <PolicyContent title="Cancellation & Refund Policy" description="Cancellation and refund rules, published before payments open." sections={[
    ['Status', 'No deadlines, refund percentages, transfer or no-show rules are set yet. They will be published before any payment is collected.'],
    ['Fees covered', 'Delegate registration, specialist workshops and Innovation Challenge fees. No refund entitlement is announced yet.'],
    ['Payment issues', 'Failed or duplicate payments, invoices, refund processing and support contacts.'],
    ['Event changes', 'Postponement, cancellation, programme changes and delegate substitutions.'],
  ]} />
}
