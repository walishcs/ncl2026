import type { ReactNode } from 'react';

export type FormPart = { text: string; emphasis?: boolean };
export function LinguisticForm({ children, parts, ipa = false, className = '' }: {
  children?: ReactNode; parts?: FormPart[]; ipa?: boolean; className?: string;
}) {
  return <span className={`linguistic-form ${className}`} data-ipa={ipa || undefined}>
    {parts ? parts.map((part, index) => part.emphasis ? <mark key={index}>{part.text}</mark> : <span key={index}>{part.text}</span>) : children}
  </span>;
}
