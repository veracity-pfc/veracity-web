import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Tabs from '@/components/Tabs/Tabs'

describe('Tabs', () => {
  it('troca para a aba de Imagem ao clicar (controlado)', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const labels = { urls: 'URL', images: 'Imagem' }

    const { rerender } = render(
      <Tabs active="urls" onChange={onChange} labels={labels} />
    )

    const imgTab =
      screen.queryByRole('tab', { name: /imagem/i }) ??
      screen.getByRole('tab', { name: /imagem/i })

    await user.click(imgTab!)
    expect(onChange).toHaveBeenCalled() 

    rerender(<Tabs active="images" onChange={onChange} labels={labels} />)

    const imgTabAfter =
      screen.queryByRole('tab', { name: /imagem/i }) ??
      screen.getByRole('tab', { name: /imagem/i })
    expect(imgTabAfter).toHaveAttribute('aria-selected', 'true')
  })
})
