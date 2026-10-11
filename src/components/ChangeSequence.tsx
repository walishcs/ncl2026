import type { ReactNode } from 'react';
export type ChangeStep = { title: string; form: ReactNode; description: ReactNode };
export function ChangeSequence({ steps, reveal = true }: { steps: ChangeStep[]; reveal?: boolean }) {
  return <ol className="change-sequence">{steps.map((step, index) => <li key={index} className={reveal && index > 0 ? 'fragment fade-in' : ''} data-fragment-index={index > 0 ? index - 1 : undefined}>
    <div className="step-number">{String(index + 1).padStart(2, '0')}</div><h3>{step.title}</h3><div className="step-form">{step.form}</div><p>{step.description}</p>
  </li>)}</ol>;
}
