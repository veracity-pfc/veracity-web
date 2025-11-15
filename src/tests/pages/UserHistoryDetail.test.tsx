import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { apiFetch } from '@/api/client'
import UserHistoryDetail from '@/pages/UserHistoryDetail/UserHistoryDetail'

describe('UserHistoryDetail', () => {
  it('busca detalhes da análise pelo id na rota', async () => {
    render(
      <MemoryRouter initialEntries={['/user/history/abc123']}>
        <Routes>
          <Route path="/user/history/:id" element={<UserHistoryDetail />} />
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(apiFetch).toHaveBeenCalled()
    })
  })
})
