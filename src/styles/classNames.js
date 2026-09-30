/**
 * Shared Tailwind class strings.
 * Long utility lists are kept here (split across lines) so the JSX stays readable.
 */

const DISABLED = 'disabled:cursor-not-allowed disabled:bg-blue-300'

// Form fields
export const inputField = [
  'mt-2 w-full rounded-lg border border-slate-300 px-3 py-3 text-slate-900',
  'outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100',
].join(' ')

export const inputFieldTall = [
  'mt-2 w-full rounded-lg border border-slate-300 px-3 py-3 leading-7',
  'outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100',
].join(' ')

export const answerField = [
  'w-full resize-none rounded-lg border border-slate-300 px-3 py-3 leading-6',
  'outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100',
  'disabled:bg-slate-100',
].join(' ')

export const selectField = [
  'mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-3',
  'outline-none focus:border-blue-600',
].join(' ')

// Buttons
export const authButton = [
  'mt-7 w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition',
  'hover:bg-blue-700',
  DISABLED,
].join(' ')

export const primaryButton = [
  'rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition',
  'hover:bg-blue-700',
].join(' ')

export const primaryButtonDisabled = `${primaryButton} ${DISABLED}`

export const outlineButton = [
  'rounded-lg border border-slate-300 px-6 py-3 font-semibold text-slate-700',
  'transition hover:bg-white',
].join(' ')

export const smallPrimaryButton = [
  'rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition',
  'hover:bg-blue-700',
].join(' ')

export const smallPrimaryButtonDisabled = `${smallPrimaryButton} ${DISABLED}`

export const smallOutlineButton = [
  'rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700',
  'transition hover:bg-slate-50',
].join(' ')

// Misc
export const spinnerClass = [
  'mx-auto h-10 w-10 animate-spin rounded-full border-4',
  'border-slate-200 border-t-blue-600',
].join(' ')
