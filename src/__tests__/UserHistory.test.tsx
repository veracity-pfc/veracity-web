import { vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

vi.mock('@/api/client', () => ({
  apiFetch: vi.fn(),
}))

import { apiFetch } from '@/api/client'
import UserHistory from '@/pages/UserHistory/UserHistory'

describe('UserHistory', () => {
  it('lista cards do histórico', async () => {
    ;(apiFetch as any).mockResolvedValue({
      items: [
        { id: '1', created_at: new Date().toISOString(), analysis_type: 'url',   source: 'https://a.com', label: 'safe' },
        { id: '2', created_at: new Date().toISOString(), analysis_type: 'image', source: 'image.png',     label: 'suspicious' },
      ],
      total_pages: 1,
    })

    render(
      <MemoryRouter>
        <UserHistory />
      </MemoryRouter>
    )

    await waitFor(() => expect(apiFetch).toHaveBeenCalled())
    expect(screen.getByText(/https:\/\/a\.com/)).toBeInTheDocument()
    expect(screen.getByText(/image\.png/)).toBeInTheDocument()
  })
})
