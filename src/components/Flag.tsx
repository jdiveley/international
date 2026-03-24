import { countryCodes } from '../data/countryCodes'

interface FlagProps {
  country: string
  className?: string
}

export function Flag({ country, className = '' }: FlagProps) {
  const code = countryCodes[country]
  if (!code) return null
  return (
    <img
      src={`https://flagcdn.com/w40/${code}.png`}
      srcSet={`https://flagcdn.com/w80/${code}.png 2x`}
      width="24"
      height="18"
      alt={`${country} flag`}
      className={`inline-block object-cover rounded-sm align-middle shrink-0 ${className}`}
    />
  )
}
