import { amazonSearchUrl } from '../utils/amazon'

export function AmazonLink({ query, label }: { query: string; label: string }) {
  return (
    <a
      href={amazonSearchUrl(query)}
      target="_blank"
      rel="nofollow sponsored noopener"
      className="shrink-0 text-xs text-amber-600 hover:text-amber-800 hover:underline whitespace-nowrap"
      aria-label={`Shop for ${label} on Amazon`}
      title={`Shop for ${label} on Amazon`}
    >
      🛒 Shop
    </a>
  )
}
