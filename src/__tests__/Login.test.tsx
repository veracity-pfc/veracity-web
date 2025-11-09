import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { apiLogin } from '@/api/client'
import Login from '@/pages/Login'

describe('Login', () => {
  it('realiza login com email e senha', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    )

    await userEvent.type(screen.getByLabelText(/e-?mail/i), 'user@ex.com')
    await userEvent.type(screen.getByLabelText(/^senha$/i), 'Senha@123')

    const submit =
      screen.queryByRole('button', { name: /login|entrar|acessar/i }) ??
      screen.getAllByRole('button')[0]
    await userEvent.click(submit!)

    expect(apiLogin).toHaveBeenCalled()
  })
})
