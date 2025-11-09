import { vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

vi.mock('@/api/client', () => ({
  apiAnalyzeUrl: vi.fn(),
}))

import { apiAnalyzeUrl } from '@/api/client'
import UrlForm from '@/components/UrlForm/UrlForm'

describe('UrlForm', () => {
  it('envia a URL e renderiza AnalysisCard com resultado', async () => {
    ;(apiAnalyzeUrl as any).mockResolvedValue({
      label: 'safe',
      explanation: 'URL considerada segura',
      recommendations: ['Mantenha boas práticas'],
      url: 'https://nubank.com.br/'
    })

    render(<UrlForm mode="urls" />)

    const input = screen.getByLabelText(/URL para análise/i)
    await userEvent.type(input, 'https://nubank.com.br/')
    await userEvent.click(screen.getByRole('button', { name: /verificar/i }))

    await waitFor(() =>
      expect(screen.getByText(/Seguro|Possivelmente/i)).toBeInTheDocument()
    )
    expect(screen.getByText(/URL considerada segura/i)).toBeInTheDocument()
  })

  it('limpa o campo quando clica no X', async () => {
    render(<UrlForm mode="urls" />)
    const input = screen.getByLabelText(/URL para análise/i)
    await userEvent.type(input, 'http://teste.com')
    await userEvent.click(screen.getByRole('button', { name: /limpar/i }))
    expect(input).toHaveValue('')
  })
})
