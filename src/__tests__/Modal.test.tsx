import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Modal from '@/components/Modal/Modal'

describe('Modal', () => {
  it('abre e fecha chamando onClose', async () => {
    const onClose = vi.fn()
    render(
      <Modal open title="Teste Modal" onClose={onClose}>
        <p>conteúdo</p>
      </Modal>
    )

    const closeBtn =
      screen.queryByRole('button', { name: /fechar/i }) ??
      screen.getAllByRole('button').find(b => b.textContent?.trim() === '×')
    await userEvent.click(closeBtn!)

    expect(onClose).toHaveBeenCalled()
  })
})
