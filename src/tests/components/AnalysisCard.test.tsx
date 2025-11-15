import { render, screen } from '@testing-library/react'
import AnalysisCard from '@/components/AnalysisCard/AnalysisCard'

describe('AnalysisCard', () => {
  it('renderiza explicação e recomendações', () => {
    render(
      <AnalysisCard data={{
        label: 'safe',
        explanation: 'Tudo ok',
        recommendations: ['Mantenha o antivírus atualizado', 'Evite links desconhecidos']
      }}/>
    )
    expect(screen.getByText(/Tudo ok/)).toBeInTheDocument()
    expect(screen.getByText(/antivírus/i)).toBeInTheDocument()
    expect(screen.getByText(/links desconhecidos/i)).toBeInTheDocument()
  })
})
