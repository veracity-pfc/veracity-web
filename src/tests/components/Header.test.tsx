import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Header from '@/components/Header/Header'

describe('Header', () => {
  it('exibe links principais e link de login quando deslogado', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    )

    const nav = screen.getByRole('navigation', { name: /principal/i })

    expect(within(nav).getByRole('link', { name: /perfil/i })).toBeInTheDocument()
    expect(within(nav).getByRole('link', { name: /histórico de análises/i })).toBeInTheDocument()
    expect(within(nav).getByRole('link', { name: /instruções/i })).toBeInTheDocument()
    expect(within(nav).getByRole('link', { name: /contato/i })).toBeInTheDocument()
    expect(within(nav).getByRole('link', { name: /sobre/i })).toBeInTheDocument()

    expect(within(nav).getByRole('link', { name: /entrar|login/i })).toBeInTheDocument()
  })
})
