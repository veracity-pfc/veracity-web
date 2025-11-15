import { vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

vi.mock('@/api/client', () => ({
  apiAnalyzeImage: vi.fn(),
}))

import { apiAnalyzeImage } from '@/api/client'
import ImageForm from '@/components/ImageForm/ImageForm'

function file(name: string, type: string, size = 10) {
  const blob = new Blob([new ArrayBuffer(size)], { type })
  return new File([blob], name, { type })
}

describe('ImageForm', () => {
  it('valida tipo inválido', async () => {
    render(<ImageForm />)

    await userEvent.click(
      screen.getByRole('button', { name: /escolha um arquivo/i })
    )
    const inputEl = document.querySelector('input[type="file"]') as HTMLInputElement
    const f = file('doc.pdf', 'application/pdf')

    await userEvent.upload(inputEl, f)

    expect(screen.queryByRole('button', { name: /verificar/i })).toBeNull()

    await waitFor(() => {
      expect(apiAnalyzeImage).not.toHaveBeenCalled()
    })
  })

  it('envia imagem válida e mostra resultado', async () => {
    ;(apiAnalyzeImage as any).mockResolvedValue({
      label: 'suspicious',
      explanation: 'Possível manipulação',
      recommendations: ['Verifique metadados'],
    })

    render(<ImageForm />)

    await userEvent.click(
      screen.getByRole('button', { name: /escolha um arquivo/i })
    )
    const inputEl = document.querySelector('input[type="file"]') as HTMLInputElement
    const f = file('photo.png', 'image/png')
    await userEvent.upload(inputEl, f)
    await userEvent.click(screen.getByRole('button', { name: /verificar/i }))

    await waitFor(() => expect(apiAnalyzeImage).toHaveBeenCalled())
    expect(await screen.findByText(/Possível manipulação/i)).toBeInTheDocument()
  })
})
