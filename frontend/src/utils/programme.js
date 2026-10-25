export function groupProgramme(sessions, filter = 'all') {
  const chapters = [
    { id: 'morning', number: '01', title: 'Morning', sessions: [] },
    { id: 'afternoon', number: '02', title: 'Afternoon', sessions: [] },
    { id: 'evening', number: '03', title: 'Evening', sessions: [] },
  ]
  sessions.forEach((session, index) => {
    if (filter !== 'all' && session.type !== filter) return
    // First meridiem applies to the start, including mixed AM–PM ranges.
    const hour = Number(session.time.match(/^\d+/)?.[0])
    const period = session.time.match(/AM|PM/)?.[0]
    const hour24 = hour % 12 + (period === 'PM' ? 12 : 0)
    chapters[hour24 < 12 ? 0 : hour24 < 16 ? 1 : 2].sessions.push({ session, index })
  })
  return chapters.filter(chapter => chapter.sessions.length)
}
