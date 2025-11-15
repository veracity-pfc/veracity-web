import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { apiResetPassword } from '@/api/client'
import ResetPassword from '@/pages/ResetPassword'

describe('ResetPassword', () => {
  it('envia nova senha com token/código', async () => {
    render(
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>
    )

    const codeByLabel = screen.queryByLabelText(/código|token/i)
    const codeByPlaceholder = screen.queryByPlaceholderText(/código|token/i)
    const code = codeByLabel ?? codeByPlaceholder
    if (code) {
      await userEvent.type(code as HTMLElement, '123456')
    }

    await userEvent.type(screen.getByLabelText(/^senha$/i), 'Senha@123')
    const confirm = screen.getByLabelText(/confirme a senha/i)
    await userEvent.type(confirm, 'Senha@123')

    const submit =
      screen.queryByRole('button', { name: /trocar senha|redefinir|alterar/i }) ??
      screen.getAllByRole('button')[0]
    await userEvent.click(submit!)

    expect(apiResetPassword).toHaveBeenCalled()
  })
})
