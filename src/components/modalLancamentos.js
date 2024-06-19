import { useEffect, useState } from 'react';
import { getLancamentosDiaAtraso } from '@/utils/lembrete';
import styles from '@/styles/Modal.module.css'; // Import CSS module

const ModalLancamentos = ({ isOpen, onClose }) => {
  const [lancamentosDia, setLancamentosDia] = useState([]);
  const [lancamentosAtraso, setLancamentosAtraso] = useState([]);

  useEffect(() => {
    if (isOpen) {
      const fetchLancamentos = async () => {
        const { lancamentosDia, lancamentosAtraso } = await getLancamentosDiaAtraso();
        setLancamentosDia(lancamentosDia);
        setLancamentosAtraso(lancamentosAtraso);
      };

      fetchLancamentos();
    }
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div className={styles.modal}>
          <div className={styles['modal-content']}>
            <span className={styles.close} onClick={onClose}>&times;</span>
            <h1>Lançamentos do Dia e em Atraso</h1>
            <h2>Lançamentos do Dia</h2>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Descrição</th>
                  <th>Tipo</th>
                  <th>Valor</th>
                  <th>Data de Vencimento</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {lancamentosDia.map(lancamento => (
                  <tr key={lancamento._id}>
                    <td>{lancamento.description}</td>
                    <td>{lancamento.type}</td>
                    <td>{lancamento.value}</td>
                    <td>{new Date(lancamento.due_date).toLocaleDateString()}</td>
                    <td>{lancamento.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h2>Lançamentos em Atraso</h2>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Descrição</th>
                  <th>Tipo</th>
                  <th>Valor</th>
                  <th>Data de Vencimento</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {lancamentosAtraso.map(lancamento => (
                  <tr key={lancamento._id}>
                    <td>{lancamento.description}</td>
                    <td>{lancamento.type}</td>
                    <td>{lancamento.value}</td>
                    <td>{new Date(lancamento.due_date).toLocaleDateString()}</td>
                    <td>{lancamento.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export default ModalLancamentos;
