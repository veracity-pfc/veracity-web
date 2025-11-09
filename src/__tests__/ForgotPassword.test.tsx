import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { apiForgotPassword } from '@/api/client'
import ForgotPassword from '@/pages/ForgotPassword/ForgotPassword'

describe('ForgotPassword', () => {
  it('envia e-mail para recuperação', async () => {
    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    )

    await userEvent.type(screen.getByLabelText(/e-?mail/i), 'a@b.com')

    const submit =
      screen.queryByRole('button', { name: /enviar|recuperar|continuar/i }) ??
      screen.getAllByRole('button')[0]
    await userEvent.click(submit!)

    expect(apiForgotPassword).toHaveBeenCalled()
  })
})
