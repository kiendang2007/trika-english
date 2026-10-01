const BUILD_TIME = __BUILD_TIME__

// dd/mm/yyyy hh:mm in Vietnam time.
function formatBuildTime(iso) {
  try {
    const parts = Object.fromEntries(
      new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Ho_Chi_Minh',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23',
      })
        .formatToParts(new Date(iso))
        .map((p) => [p.type, p.value])
    )
    return `${parts.day}/${parts.month}/${parts.year} ${parts.hour}:${parts.minute}`
  } catch {
    return iso
  }
}

// The one footer, rendered by the app shell under every screen.
export default function Footer() {
  return <footer className="home-footer">Trika English · Bản build lúc {formatBuildTime(BUILD_TIME)}</footer>
}
