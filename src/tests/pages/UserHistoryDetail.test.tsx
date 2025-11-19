import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { apiFetch } from '@/api/client'
import HistoryDetail from '@/pages/HistoryDetail/HistoryDetail'

describe('HistoryDetail', () => {
  it('busca detalhes da análise pelo id na rota', async () => {
    render(
      <MemoryRouter initialEntries={['/user/history/abc123']}>
        <Routes>
          <Route path="/user/history/:id" element={<HistoryDetail />} />
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(apiFetch).toHaveBeenCalled()
    })
  })
})
