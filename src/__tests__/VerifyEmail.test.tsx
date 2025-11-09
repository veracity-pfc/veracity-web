import { vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'

vi.mock('@/api/client', () => ({
  apiVerifyEmail: vi.fn(),
  apiResendCode: vi.fn(),
}))

import { apiVerifyEmail } from '@/api/client'
import VerifyEmail from '@/pages/VerifyEmail/VerifyEmail'

describe('VerifyEmail', () => {
  it('aceita 6 dígitos e chama a API', async () => {
    ;(apiVerifyEmail as any).mockResolvedValue({ ok: true })

    render(
      <MemoryRouter initialEntries={['/verify-email?email=a%40b.com']}>
        <VerifyEmail />
      </MemoryRouter>
    )

    const inputs = (await screen.findAllByRole('textbox')) as HTMLInputElement[]
    expect(inputs).toHaveLength(6)

    for (let i = 0; i < 6; i++) {
      await userEvent.type(inputs[i]!, String((i + 1) % 10))
    }

    await userEvent.click(screen.getByRole('button', { name: /confirmar/i }))
    expect(apiVerifyEmail).toHaveBeenCalledWith('a@b.com', '123456')
  })
})
