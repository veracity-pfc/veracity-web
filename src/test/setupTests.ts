import '@testing-library/jest-dom'

vi.mock('@/api/client', () => {
  return {
    apiFetch: vi.fn(async () => ({ ok: true, json: async () => ({}) })),
    apiLogin: vi.fn(async () => ({ token: 'fake-token' })),
    apiRegister: vi.fn(async () => ({ ok: true })),
    apiForgotPassword: vi.fn(async () => ({ ok: true })),
    apiResetPassword: vi.fn(async () => ({ ok: true })),
    getToken: vi.fn(() => null),
    setToken: vi.fn(() => {}),
    clearToken: vi.fn(() => {}),
    getRole: vi.fn(() => null),
  }
})

beforeAll(() => {
  const style = document.createElement('style')
  style.textContent = ':root{--stroke:#000}'
  document.head.appendChild(style)
})

const originalSetProperty = CSSStyleDeclaration.prototype.setProperty
CSSStyleDeclaration.prototype.setProperty = function (name: string, value: any) {
  if (name === 'border' && typeof value === 'string' && value.includes('var(')) {
    return
  }
  return originalSetProperty.call(this, name, value)
}
