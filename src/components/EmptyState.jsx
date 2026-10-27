export default function EmptyState({ title, body }) {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-white/40 px-6 py-12 text-center">
      <h3 className="font-display text-lg font-bold text-ink">{title}</h3>
      {body ? <p className="mt-2 text-sm text-ink/65">{body}</p> : null}
    </div>
  )
}
