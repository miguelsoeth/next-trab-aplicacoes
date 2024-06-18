import withAuth from '@/hoc/withAuth';
import { setAuthHeader } from '@/utils/authenticate';
import axios from 'axios';
import { useState, useEffect } from 'react';
import styles from '@/styles/Lancamentos.module.css'; // Import the CSS module

const Lancamentos = () => {
  const [entries, setEntries] = useState([]);
  const [month, setMonth] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [accountsOptions, setAccountsOptions] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editEntry, setEditEntry] = useState({
    _id: '',
    type: '',
    categories: '',
    description: '',
    value: '',
    due_date: '',
    status: '',
    account: '',
    comments: '',
    payment_date: '',
  });

  useEffect(() => {
    setAuthHeader(localStorage.getItem('token'));
    fetchAccounts();
    axios.get('http://localhost:8080/api/entries')
      .then(response => {
        setEntries(response.data);
      })
      .catch(error => {
        console.error('Erro ao buscar lançamentos:', error);
      });
    
    if (editEntry.type) {
      fetchCategories(editEntry.type);
    }
  }, [editEntry.type]);

  const fetchCategories = async (type) => {
    try {
      const response = await axios.get('http://localhost:8080/api/categories');
      const filteredCategories = response.data.filter(category => category.type === type);
      setCategoryOptions(filteredCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchAccounts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/accounts');
      setAccountsOptions(response.data);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  const handleEdit = (entry) => {
    setEditMode(true);
    setEditEntry(entry);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditEntry({
      _id: '',
      type: '',
      categories: '',
      description: '',
      value: '',
      due_date: '',
      status: '',
      account: '',
      comments: '',
      payment_date: '',
    });
  };

  const handleValueChangeEdit = (event) => {
    let value = event.target.value.replace(/[^\d.]/g, '');

    const regex = /^\d*\.{0,1}\d{0,2}$/;
    if (!regex.test(value)) {
      value = editEntry.value;
    }

    setEditEntry({ ...editEntry, value: value });
  };

  const formatDateValue = (dateTimeString) => {    
    const parsedDate = new Date(dateTimeString);
    return parsedDate.toISOString().split('T')[0];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleSave = async () => {
    let confirmed = window.confirm("Deseja mesmo editar essa entrada?");

    if (!confirmed) {
      return;
    }

    const { _id, __v, ...dataToSend } = editEntry;
    const response = await axios.put(`http://localhost:8080/api/entries/${_id}`, dataToSend);
    const updatedEntries = entries.map(entry => {
      if (entry._id === editEntry._id) {
        return { ...editEntry };
      }
      return entry;
    });
    setEntries(updatedEntries);
    setEditMode(false);
    setEditEntry({
      _id: '',
      type: '',
      categories: '',
      description: '',
      value: '',
      due_date: '',
      status: '',
      account: '',
      comments: '',
      payment_date: '',
    });
  };

  const filteredEntries = entries.filter(entry => {
    if (!month && !typeFilter) return true;
    const monthMatches = month ? new Date(entry.due_date).toLocaleString('default', { month: 'long' }) === month : true;
    const typeMatches = typeFilter ? entry.type === typeFilter : true;
    return monthMatches && typeMatches;
  });

  const sortedEntries = filteredEntries.sort((a, b) => new Date(a.due_date) - new Date(b.due_date));

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Lançamentos Financeiros</h1>
      <div className={styles.filterContainer}>
        <div>
          <label htmlFor="month">Filtrar por mês: </label>
          <select id="month" value={month} onChange={e => setMonth(e.target.value)}>
            <option value="">Todos</option>
            <option value="janeiro">Janeiro</option>
            <option value="fevereiro">Fevereiro</option>
            <option value="março">Março</option>
            <option value="abril">Abril</option>
            <option value="maio">Maio</option>
            <option value="junho">Junho</option>
            <option value="julho">Julho</option>
            <option value="agosto">Agosto</option>
            <option value="setembro">Setembro</option>
            <option value="outubro">Outubro</option>
            <option value="novembro">Novembro</option>
            <option value="dezembro">Dezembro</option>
          </select>
        </div>
        <div>
          <label htmlFor="typeFilter">Filtrar por tipo: </label>
          <select id="typeFilter" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
            <option value="">Todos</option>
            <option value="Receita">Receita</option>
            <option value="Despesa">Despesa</option>
          </select>
        </div>
      </div>
      
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Categoria</th>
            <th>Descrição</th>
            <th>Valor</th>
            <th>Data de Vencimento</th>
            <th>Status</th>
            <th>Conta</th>
            <th>Comentários</th>
            <th>Data de Pagamento</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {sortedEntries.map(entry => (
            <tr key={entry._id}>
              {editMode && editEntry._id === entry._id ? (
                <td colSpan={10}>
                  <div className={styles.editGrid}>
                    <div className={styles.editGridRow}>
                      <div>
                        <label>Tipo</label>
                        <select
                          id="newentry_type"
                          value={editEntry.type}
                          onChange={(e) => setEditEntry({ ...editEntry, type: e.target.value, categories: '' })}
                        >
                          <option value="Receita">Receita</option>
                          <option value="Despesa">Despesa</option>
                        </select>
                      </div>
                      <div>
                        <label>Categoria</label>
                        <select
                          id="editedentry_categories"
                          value={editEntry.categories}
                          onChange={(e) => setEditEntry({ ...editEntry, categories: e.target.value })}
                        >
                          <option value="">Selecione a categoria</option>
                          {categoryOptions.map((category) => (
                            <option key={category._id} value={category.description}>
                              {category.description}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label>Descrição</label>
                        <input
                          type="text"
                          value={editEntry.description}
                          onChange={e => setEditEntry({ ...editEntry, description: e.target.value })}
                        />
                      </div>
                      
                    </div>
                    <div className={styles.editGridRow}>
                      <div>
                        <label>Valor</label>
                        <input
                          type="text"
                          value={`R$ ${editEntry.value}`}
                          onChange={handleValueChangeEdit}
                        />
                      </div>
                      <div>
                        <label>Data de Vencimento</label>
                        <input
                          type="date"
                          placeholder="Data de venc."
                          value={formatDateValue(editEntry.due_date)}
                          onChange={(e) => setEditEntry({ ...editEntry, due_date: e.target.value })}
                        />
                      </div>
                      <div>
                        <label>Status</label>
                        <select
                          value={editEntry.status}
                          onChange={(e) => setEditEntry({ ...editEntry, status: e.target.value })}
                        >
                          <option value="">Selecione o status</option>
                          <option value="Lancada">Lançada</option>
                          <option value="Confirmada">Confirmada</option>
                          <option value="Paga">Paga</option>
                          <option value="Cancelada">Cancelada</option>
                        </select>
                      </div>
                    </div>
                    <div className={styles.editGridRow}>
                      <div>
                        <label>Conta</label>
                        <select
                          value={editEntry.account}
                          onChange={(e) => setEditEntry({ ...editEntry, account: e.target.value })}
                        >
                          <option value="">Selecione a conta</option>
                          {accountsOptions.map((account) => (
                            <option key={account._id} value={account.description}>
                              {account.description}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label>Comentários</label>
                        <input
                          type="text"
                          value={editEntry.comments}
                          onChange={e => setEditEntry({ ...editEntry, comments: e.target.value })}
                        />
                      </div>
                      <div>
                        <label>Data de Pagamento</label>
                        <input
                          type="date"
                          placeholder="Data de pag."
                          value={formatDateValue(editEntry.payment_date)}
                          onChange={(e) => setEditEntry({ ...editEntry, payment_date: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className={styles.editActions}>
                      <button className={`${styles.button} ${styles.save}`} onClick={handleSave}>Salvar</button>
                      <button className={`${styles.button} ${styles.cancel}`} onClick={handleCancelEdit}>Cancelar</button>
                    </div>
                  </div>
                </td>
              ) : (
                <>
                  <td>{entry.type}</td>
                  <td>{entry.categories}</td>
                  <td>{entry.description}</td>
                  <td>{entry.value}</td>
                  <td>{formatDate(entry.due_date)}</td>
                  <td>{entry.status}</td>
                  <td>{entry.account}</td>
                  <td>{entry.comments}</td>
                  <td>{formatDate(entry.payment_date)}</td>
                  <td>
                    <button className={styles.button} onClick={() => handleEdit(entry)}>Editar</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default withAuth(Lancamentos);
