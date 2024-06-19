// utils/lancamentosMiddleware.js

import axios from 'axios';
import { setAuthHeader } from './authenticate';

const API_URL = 'http://localhost:8080/api/entries';

export const getLancamentosDiaAtraso = async () => {
  try {
    setAuthHeader(localStorage.getItem('token'));
    const response = await axios.get(API_URL);
    const hoje = new Date();
    const lancamentosDia = response.data.filter(
      (lancamento) => new Date(lancamento.due_date).toDateString() === hoje.toDateString()
    );
    const lancamentosAtraso = response.data.filter(
      (lancamento) => new Date(lancamento.due_date) < hoje && lancamento.status !== 'Paga'
    );
    return { lancamentosDia, lancamentosAtraso };
  } catch (error) {
    console.error('Erro ao buscar lançamentos do dia e em atraso:', error);
    return { lancamentosDia: [], lancamentosAtraso: [] };
  }
};
