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

    render(
      <Filter
        open
        onClose={() => {}}
        dateFrom=""
        dateTo=""
        status=""
        atype=""
        onChangeDateFrom={onChangeDateFrom}
        onChangeDateTo={onChangeDateTo}
        onChangeStatus={onChangeStatus}
        onChangeType={onChangeType}
        onApply={onApply}
      />
    )

    const dateInputs = screen.getAllByPlaceholderText('dd/mm/aaaa') as HTMLInputElement[]
    expect(dateInputs.length).toBeGreaterThanOrEqual(2)

    await userEvent.type(dateInputs[0]!, '2025-11-01')
    await userEvent.type(dateInputs[1]!, '2025-11-30')

    const selects = screen.getAllByRole('combobox') as HTMLSelectElement[]
    expect(selects.length).toBeGreaterThanOrEqual(2)

    await userEvent.selectOptions(selects[0]!, 'safe')
    await userEvent.selectOptions(selects[1]!, 'url')

    await userEvent.click(screen.getByRole('button', { name: /aplicar filtros/i }))

    expect(onChangeDateFrom).toHaveBeenCalled()
    expect(onChangeDateTo).toHaveBeenCalled()
    expect(onChangeStatus).toHaveBeenCalledWith('safe')
    expect(onChangeType).toHaveBeenCalledWith('url')
    expect(onApply).toHaveBeenCalled()
  })
})
