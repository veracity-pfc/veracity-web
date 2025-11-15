import { vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

vi.mock('@/api/client', () => ({
  apiSendContact: vi.fn(),
}))

import { apiSendContact } from '@/api/client'
import Contact from '@/pages/Contact/Contact'

describe('Contact', () => {
  it('envia mensagem e mostra confirmação', async () => {
    ;(apiSendContact as any).mockResolvedValue({ ok: true })

    render(<Contact />)

    await userEvent.type(screen.getByLabelText(/e-mail/i), 'a@b.com')
    await userEvent.selectOptions(screen.getByLabelText(/assunto/i), 'Dúvida')
    await userEvent.type(screen.getByLabelText(/mensagem/i), 'Olá!')
    await userEvent.click(screen.getByRole('button', { name: /enviar/i }))

    expect(apiSendContact).toHaveBeenCalled()
    expect(
      await screen.findByText(/Mensagem enviada com sucesso/i)
    ).toBeInTheDocument()
  })
})
