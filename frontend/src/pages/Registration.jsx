import { useState, useMemo } from 'react'
import PageHeader from '../components/PageHeader'
import { REGISTRATION_FEES, WORKSHOPS } from '../data/sankalpData'
import styles from './Registration.module.css'

export default function Registration() {
  const [selectedCategoryIdx, setSelectedCategoryIdx] = useState(0)
  const [delegateCount, setDelegateCount] = useState(1)
  const [includeWorkshop, setIncludeWorkshop] = useState(false)
  const [selectedWorkshopId, setSelectedWorkshopId] = useState('ws-1')
  const [includePitch, setIncludePitch] = useState(false)
  const [showCheckoutModal, setShowCheckoutModal] = useState(false)
  const [checkoutComplete, setCheckoutComplete] = useState(false)

  // Registration delegate form
  const [regForm, setRegForm] = useState({
    fullName: '',
    email: '',
    institution: '',
    idNumber: '',
    phone: '',
  })

  const currentCategory = REGISTRATION_FEES.summit[selectedCategoryIdx]
  const isStudent = currentCategory.category.includes('Students')

  // Live Dynamic Price Computation
  const calculation = useMemo(() => {
    const basePerDelegate = currentCategory.fee
    const totalDelegates = Math.max(1, parseInt(delegateCount) || 1)

    // 10% discount for student groups >= 10
    const hasGroupDiscount = isStudent && totalDelegates >= REGISTRATION_FEES.groupDiscount.minCount
    const discountFactor = hasGroupDiscount ? 0.9 : 1.0

    const discountedBasePerDelegate = basePerDelegate * discountFactor
    const totalSummitFee = discountedBasePerDelegate * totalDelegates

    // Workshop add-on fee
    let workshopAddon = 0
    if (includeWorkshop) {
      if (isStudent) workshopAddon = 350
      else if (currentCategory.category.includes('Faculty')) workshopAddon = 500
      else workshopAddon = 700
    }
    const totalWorkshopFee = workshopAddon * totalDelegates

    // Pitch fee
    let pitchFee = 0
    if (includePitch) {
      pitchFee = isStudent ? 200 : 500
    }

    const grandTotal = totalSummitFee + totalWorkshopFee + pitchFee
    const totalSavings = hasGroupDiscount
      ? (basePerDelegate * 0.1) * totalDelegates
      : 0

    return {
      basePerDelegate,
      totalDelegates,
      hasGroupDiscount,
      totalSummitFee,
      workshopAddon,
      totalWorkshopFee,
      pitchFee,
      grandTotal,
      totalSavings,
    }
  }, [currentCategory, delegateCount, isStudent, includeWorkshop, includePitch])

  const handleCheckoutSubmit = (e) => {
    e.preventDefault()
    setCheckoutComplete(true)
  }

  return (
    <div className={styles.page}>
      <PageHeader
        badge="Summit Delegate Passes"
        title="Registration &amp; Fee Structure"
        subtitle="Choose your delegate pass to access two days of cutting-edge keynotes, networking lunches, delegate kits, and technical workshops."
        breadcrumb={[{ label: 'Registration & Fees' }]}
      />

      <div className={styles.container}>
        {/* ── Governance Disclaimer Banner ── */}
        <div className={styles.warningBanner}>
          <span className={styles.warnIcon}>⚖️</span>
          <div className={styles.warnContent}>
            <strong>Proposed Pricing Notice:</strong>
            <p>{REGISTRATION_FEES.disclaimer}</p>
          </div>
        </div>

        {/* ── Category Tier Cards ── */}
        <section className={styles.tiersSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.secEye}>Category Passes</span>
            <h2 className={styles.secTitle}>Summit Registration Tiers</h2>
            <p className={styles.secDesc}>
              Select your delegate category to preview fees and configure optional workshop or pitch add-ons.
            </p>
          </div>

          <div className={styles.tiersGrid}>
            {REGISTRATION_FEES.summit.map((tier, idx) => (
              <div
                key={tier.category}
                className={`${styles.tierCard} ${
                  selectedCategoryIdx === idx ? styles.tierSelected : ''
                } ${tier.popular ? styles.tierPopular : ''}`}
                onClick={() => setSelectedCategoryIdx(idx)}
              >
                {tier.popular && <span className={styles.popularBadge}>Most Common</span>}
                <h3 className={styles.tierName}>{tier.category}</h3>
                <div className={styles.tierPrice}>
                  <span className={styles.priceVal}>{tier.feeDisplay}</span>
                  <span className={styles.priceSub}>/ delegate (proposed)</span>
                </div>
                <p className={styles.tierNote}>{tier.note}</p>
                <button
                  type="button"
                  className={selectedCategoryIdx === idx ? styles.btnTierActive : styles.btnTier}
                >
                  {selectedCategoryIdx === idx ? '✓ Selected' : 'Select Tier'}
                </button>
              </div>
            ))}
          </div>

          {/* Student Group Notice */}
          <div className={styles.groupNoticeCard}>
            <span className={styles.gnIcon}>🎓</span>
            <div>
              <strong>Student Institutional Cohort Discount:</strong>
              <p>{REGISTRATION_FEES.groupDiscount.rule}</p>
            </div>
          </div>
        </section>

        {/* ── Interactive Live Fee Calculator ── */}
        <section className={styles.calculatorSection}>
          <div className={styles.calcCard}>
            <div className={styles.calcHeader}>
              <span className={styles.secEye}>Interactive Estimate</span>
              <h2 className={styles.calcTitle}>Live Pass Configurator &amp; Quote</h2>
            </div>

            <div className={styles.calcBody}>
              {/* Left Settings */}
              <div className={styles.configCol}>
                <div className={styles.controlGroup}>
                  <label>Selected Tier:</label>
                  <div className={styles.selectedTierBadge}>
                    <strong>{currentCategory.category}</strong>
                    <span>(Base: {currentCategory.feeDisplay})</span>
                  </div>
                </div>

                <div className={styles.controlGroup}>
                  <label>Number of Delegates:</label>
                  <div className={styles.stepperRow}>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={delegateCount}
                      onChange={e => setDelegateCount(Math.max(1, parseInt(e.target.value) || 1))}
                      className={styles.stepperInput}
                    />
                    {isStudent && delegateCount >= 10 && (
                      <span className={styles.discountBadge}>🎉 10% Group Discount Active!</span>
                    )}
                  </div>
                </div>

                {/* Add-on 1: Specialist Workshop */}
                <div className={styles.addonItem}>
                  <div className={styles.addonLeft}>
                    <input
                      type="checkbox"
                      id="wsCheck"
                      checked={includeWorkshop}
                      onChange={e => setIncludeWorkshop(e.target.checked)}
                    />
                    <div>
                      <label htmlFor="wsCheck" className={styles.addonLabel}>
                        Add Specialist Masterclass Workshop
                      </label>
                      <p className={styles.addonSub}>
                        {isStudent ? '₹350' : currentCategory.category.includes('Faculty') ? '₹500' : '₹700'} / delegate
                      </p>
                    </div>
                  </div>

                  {includeWorkshop && (
                    <select
                      className={styles.wsSelect}
                      value={selectedWorkshopId}
                      onChange={e => setSelectedWorkshopId(e.target.value)}
                    >
                      {WORKSHOPS.map(w => (
                        <option key={w.id} value={w.id}>
                          {w.number}: {w.title}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Add-on 2: Innovation Challenge */}
                <div className={styles.addonItem}>
                  <div className={styles.addonLeft}>
                    <input
                      type="checkbox"
                      id="pitchCheck"
                      checked={includePitch}
                      onChange={e => setIncludePitch(e.target.checked)}
                    />
                    <div>
                      <label htmlFor="pitchCheck" className={styles.addonLabel}>
                        Add Innovation Challenge Pitch Slot
                      </label>
                      <p className={styles.addonSub}>
                        {isStudent ? '₹200 per idea' : '₹500 per idea'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Summary Invoice Preview */}
              <div className={styles.summaryCol}>
                <h3 className={styles.summaryTitle}>Proposed Estimated Total</h3>

                <div className={styles.summaryRows}>
                  <div className={styles.sumRow}>
                    <span>
                      {currentCategory.category} ({calculation.totalDelegates}x)
                    </span>
                    <span>₹{calculation.totalSummitFee.toLocaleString('en-IN')}</span>
                  </div>

                  {calculation.hasGroupDiscount && (
                    <div className={styles.sumRowDiscount}>
                      <span>10% Student Group Discount</span>
                      <span>-₹{calculation.totalSavings.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  {includeWorkshop && (
                    <div className={styles.sumRow}>
                      <span>Specialist Workshop Pass ({calculation.totalDelegates}x)</span>
                      <span>₹{calculation.totalWorkshopFee.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  {includePitch && (
                    <div className={styles.sumRow}>
                      <span>Innovation Challenge Entry (1 Idea)</span>
                      <span>₹{calculation.pitchFee.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className={styles.sumDivider} />

                  <div className={styles.grandTotalRow}>
                    <span>Estimated Total:</span>
                    <span className={styles.grandTotalVal}>
                      ₹{calculation.grandTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <span className={styles.taxNote}>* Indicative estimate; GST treatment subject to final confirmation.</span>
                </div>

                <button
                  type="button"
                  className={styles.btnCheckout}
                  onClick={() => {
                    setShowCheckoutModal(true)
                    setCheckoutComplete(false)
                  }}
                >
                  Proceed with Delegate Details →
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── Proposed Inclusions Side by Side ── */}
        <section className={styles.inclusionsSection}>
          <div className={styles.incCard}>
            <div className={styles.incHeader}>
              <span className={styles.incIcon}>🎒</span>
              <h3 className={styles.incTitle}>Proposed Summit Inclusions</h3>
            </div>
            <ul className={styles.incList}>
              {REGISTRATION_FEES.summitInclusions.map((item, idx) => (
                <li key={idx}>
                  <span className={styles.incBullet}>✔</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.incCard}>
            <div className={styles.incHeader}>
              <span className={styles.incIcon}>🛠️</span>
              <h3 className={styles.incTitle}>Proposed Workshop Inclusions</h3>
            </div>
            <ul className={styles.incList}>
              {REGISTRATION_FEES.workshopInclusions.map((item, idx) => (
                <li key={idx}>
                  <span className={styles.incBullet}>✔</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      {/* ── Pre-Registration Modal ── */}
      {showCheckoutModal && (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true">
          <div className={styles.modalCard}>
            <button
              className={styles.closeBtn}
              onClick={() => setShowCheckoutModal(false)}
              aria-label="Close modal"
            >
              ✕
            </button>

            {checkoutComplete ? (
              <div className={styles.successState}>
                <span className={styles.successIcon}>🎉</span>
                <h2>Pre-Registration Expressed!</h2>
                <p>
                  Thank you, <strong>{regForm.fullName}</strong>. Your provisional delegate pass for{' '}
                  <strong>{currentCategory.category}</strong> has been created with reference{' '}
                  <code>SKP-AP-{Math.floor(100000 + Math.random() * 900000)}</code>.
                </p>
                <div className={styles.quoteSummary}>
                  <p>Estimated Payable: <strong>₹{calculation.grandTotal.toLocaleString('en-IN')}</strong></p>
                  <p>Delegates: {calculation.totalDelegates} | Workshop: {includeWorkshop ? 'Included' : 'None'} | Challenge: {includePitch ? 'Included' : 'None'}</p>
                </div>
                <p className={styles.successSub}>
                  Official payment gateway links, GST invoices, and venue access barcodes will be dispatched to <strong>{regForm.email}</strong> once official registration goes live.
                </p>
                <button
                  className={styles.btnPrimary}
                  onClick={() => setShowCheckoutModal(false)}
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <h2 className={styles.modalTitle}>Delegate Registration Dossier</h2>
                <p className={styles.modalSub}>
                  Estimated Total: <strong>₹{calculation.grandTotal.toLocaleString('en-IN')}</strong> ({currentCategory.category}, {calculation.totalDelegates} Delegate{calculation.totalDelegates > 1 ? 's' : ''})
                </p>

                <form onSubmit={handleCheckoutSubmit} className={styles.modalForm}>
                  <div className={styles.formGroup}>
                    <label>Primary Delegate / Point of Contact Name *</label>
                    <input
                      type="text"
                      required
                      value={regForm.fullName}
                      onChange={e => setRegForm(p => ({ ...p, fullName: e.target.value }))}
                      placeholder="e.g. Mamidi Tejeshwar"
                    />
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Email Address *</label>
                      <input
                        type="email"
                        required
                        value={regForm.email}
                        onChange={e => setRegForm(p => ({ ...p, email: e.target.value }))}
                        placeholder="you@domain.com"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={regForm.phone}
                        onChange={e => setRegForm(p => ({ ...p, phone: e.target.value }))}
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Institution / University / Company *</label>
                      <input
                        type="text"
                        required
                        value={regForm.institution}
                        onChange={e => setRegForm(p => ({ ...p, institution: e.target.value }))}
                        placeholder="Organization name"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Institutional ID / Roll Number *</label>
                      <input
                        type="text"
                        required
                        value={regForm.idNumber}
                        onChange={e => setRegForm(p => ({ ...p, idNumber: e.target.value }))}
                        placeholder="Student ID / Employee Code"
                      />
                    </div>
                  </div>

                  <div className={styles.modalActions}>
                    <button
                      type="button"
                      className={styles.btnCancel}
                      onClick={() => setShowCheckoutModal(false)}
                    >
                      Back
                    </button>
                    <button type="submit" className={styles.btnPrimary}>
                      Confirm Pre-Registration
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
