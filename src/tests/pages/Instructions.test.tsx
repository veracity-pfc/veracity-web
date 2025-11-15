import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Instructions from '@/pages/Instructions/Instructions'

describe('Instructions', () => {
  it('alterna etapas ao clicar nos botões', async () => {
    render(
      <MemoryRouter>
        <Instructions />
      </MemoryRouter>
    )

    const urlSection = screen
      .getByRole('heading', { name: /análise de urls/i })
      .closest('section')!

    const scoped = within(urlSection)

    expect(scoped.getByText(/insira a url/i)).toBeInTheDocument()

    await userEvent.click(
      scoped.getByRole('button', { name: /etapa 2: verificações/i })
    )

    expect(scoped.getByText(/verificações/i)).toBeInTheDocument()
  })
})
