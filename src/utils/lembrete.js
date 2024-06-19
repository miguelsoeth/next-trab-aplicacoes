// utils/lancamentosMiddleware.js

import axios from 'axios';
import { setAuthHeader } from './authenticate';

const API_URL = 'http://localhost:8080/api/entries';

const formatDateValue = (dateTimeString) => {    
  const parsedDate = new Date(dateTimeString);
  return parsedDate.toISOString().split('T')[0];
};

export const getLancamentosDiaAtraso = async () => {
  try {
    setAuthHeader(localStorage.getItem('token'));
    const response = await axios.get(API_URL);
    const hoje = new Date();
    const lancamentosDia = response.data.filter(
      (lancamento) => formatDateValue(lancamento.due_date) === formatDateValue(hoje)
    );
    const lancamentosAtraso = response.data.filter(
      (lancamento) => new Date(formatDateValue(lancamento.due_date)) < new Date(formatDateValue(hoje)) && lancamento.status !== 'Paga'
    );
    return { lancamentosDia, lancamentosAtraso };
  } catch (error) {
    console.error('Erro ao buscar lançamentos do dia e em atraso:', error);
    return { lancamentosDia: [], lancamentosAtraso: [] };
  }
};
