import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { apiRegister } from '@/api/client'
import Register from '@/pages/Register/Register'

describe('Register', () => {
  it('envia dados de cadastro', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    )

    const nameInput =
      screen.queryByLabelText(/nome/i) ?? screen.getByPlaceholderText(/nome/i)
    await user.type(nameInput as HTMLElement, 'Manu')

    await user.type(screen.getByLabelText(/e-?mail/i), 'user@ex.com')
    await user.type(screen.getByLabelText(/^senha$/i), 'Senha@123')

    const confirm = screen.getByLabelText(/confirme a senha/i)
    await user.type(confirm, 'Senha@123')

    const terms = screen.queryByRole('checkbox', {
      name: /termos|política|aceito/i,
    })
    if (terms) await user.click(terms)

    const submit =
      screen.queryByRole('button', { name: /cadastrar|criar conta|registrar/i }) ??
      screen.getByRole('button', { name: /cadastre-se/i })
    await waitFor(() => expect(submit).not.toBeDisabled())

    await user.click(submit!)

    expect(apiRegister).toHaveBeenCalled()
  })
})
