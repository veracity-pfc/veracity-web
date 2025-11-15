import { vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Filter from '@/components/Filter/Filter'

describe('Filter', () => {
  it('aplica filtros e chama callbacks', async () => {
    const onChangeDateFrom = vi.fn()
    const onChangeDateTo = vi.fn()
    const onChangeStatus = vi.fn()
    const onChangeType = vi.fn()
    const onApply = vi.fn()
    const onClear = vi.fn()
    const onClose = vi.fn()

    const { container } = render(
      <Filter
        open
        onClose={onClose}
        dateFrom=""
        dateTo=""
        status=""
        atype=""
        onChangeDateFrom={onChangeDateFrom}
        onChangeDateTo={onChangeDateTo}
        onChangeStatus={onChangeStatus}
        onChangeType={onChangeType}
        onApply={onApply}
        onClear={onClear}
      />
    )

    const dateInputs = container.querySelectorAll(
      'input[type="date"]'
    ) as NodeListOf<HTMLInputElement>

    expect(dateInputs.length).toBeGreaterThanOrEqual(2)

    const dateFromInput = dateInputs[0] as HTMLInputElement | undefined
    const dateToInput = dateInputs[1] as HTMLInputElement | undefined

    if (!dateFromInput || !dateToInput) {
      throw new Error('Inputs de data não encontrados')
    }

    await userEvent.type(dateFromInput, '2025-11-01')
    await userEvent.type(dateToInput, '2025-11-30')

    const selects = container.querySelectorAll(
      'select'
    ) as NodeListOf<HTMLSelectElement>

    expect(selects.length).toBeGreaterThanOrEqual(2)

    const statusSelect = selects[0] as HTMLSelectElement | undefined
    const typeSelect = selects[1] as HTMLSelectElement | undefined

    if (!statusSelect || !typeSelect) {
      throw new Error('Selects de status/tipo não encontrados')
    }

    await userEvent.selectOptions(statusSelect, 'safe')
    await userEvent.selectOptions(typeSelect, 'url')

    await userEvent.click(
      screen.getByRole('button', { name: /aplicar filtros/i })
    )

    expect(onChangeDateFrom).toHaveBeenCalled()
    expect(onChangeDateTo).toHaveBeenCalled()
    expect(onChangeStatus).toHaveBeenCalledWith('safe')
    expect(onChangeType).toHaveBeenCalledWith('url')
    expect(onApply).toHaveBeenCalled()
  })
})
