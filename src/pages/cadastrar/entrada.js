import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { setAuthHeader } from '@/utils/authenticate';
import styles from '@/styles/Crud.module.css';
import withAuth from '@/hoc/withAuth';
import { Margin } from '@mui/icons-material';

const EntriesPage = () => {
  const [entries, setEntries] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [accountsOptions, setAccountsOptions] = useState([]);
  const [newEntry, setNewEntry] = useState({
    type: '',
    categories: '',
    description: '',
    value: '',
    due_date: '',
    payment_date: '',
    account: '',
    status: '',
    comments: ''
  });  
  const [editedEntry, setEditedEntry] = useState({
    type: '',
    categories: '',
    description: '',
    value: '',
    due_date: '',
    payment_date: '',
    account: '',
    status: '',
    comments: ''
  });

  useEffect(() => {
    setAuthHeader(localStorage.getItem('token'));
    fetchEntries();
    fetchAccounts();
    if (newEntry.type) {
      fetchCategories(newEntry.type);
    }
    if (editedEntry.type) {
      fetchCategories(editedEntry.type)
    }
  }, [newEntry.type, editedEntry.type]);

  const fetchEntries = async () => {
    try {        
      const response = await axios.get('http://localhost:8080/api/entries');
      setEntries(response.data);
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  };

  const fetchCategories = async (type) => {
    try {
      const response = await axios.get('http://localhost:8080/api/categories');
      const filteredCategories = response.data.filter(category => category.type === type);
      setCategoryOptions(filteredCategories); // Assuming response.data is an array of categories
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchAccounts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/accounts');
      setAccountsOptions(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSetEditMode = async (entry) => {
    setEditedEntry(entry);
    setEditMode(entry._id);
    const event = new CustomEvent('onchange', { detail: editedEntry.type });
    window.dispatchEvent(event);
  };

  const handleCreateEntry = async () => {
    if (!newEntry.type || !newEntry.categories || !newEntry.description || !newEntry.value || 
      !newEntry.due_date || !newEntry.payment_date || !newEntry.account || !newEntry.status || 
      !newEntry.comments) {
      alert('Preencha todos os campos para criar uma entrada!');
      return;
    }

    try {
      await axios.post('http://localhost:8080/api/entries', newEntry);
      fetchEntries();
      setNewEntry({
        type: '',
        categories: '',
        description: '',
        value: '',
        due_date: '',
        payment_date: '',
        account: '',
        status: '',
        comments: ''
      });
    } catch (error) {
      console.error('Error creating entry:', error);
    }
  };

  const handleDeleteEntry = async (entryId) => {
    let confirmed = window.confirm("Deseja mesmo deletar essa entrada?");

    if (!confirmed) {
      return;
    }

    try {
      await axios.delete(`http://localhost:8080/api/entries/${entryId}`);
      setEntries(entries.filter(entry => entry._id !== entryId));
    } catch (error) {
      console.error(`Error deleting entry ${entryId}:`, error);
    }
  };

  const handleEditEntry = async () => {
    let confirmed = window.confirm("Deseja mesmo editar essa entrada?");

    if (!confirmed) {
      return;
    }

    if (!editedEntry.type || !editedEntry.categories || !editedEntry.description || !editedEntry.value || 
      !editedEntry.due_date || !editedEntry.payment_date || !editedEntry.account || !editedEntry.status || 
      !editedEntry.comments) {
      alert('Preencha todos os campos para editar uma entrada!');
      return;
    }
    
    try {
      const { _id, __v, ...dataToSend } = editedEntry;
      const response = await axios.put(`http://localhost:8080/api/entries/${_id}`, dataToSend);
      fetchEntries();
      cancelEdit();
    } catch (error) {
      console.error(`Error updating entry ${editedEntry._id}:`, error);
    }
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

  const cancelEdit = () => {
    setEditMode(null);
    setEditedEntry({
      type: '',
      categories: '',
      description: '',
      value: '',
      due_date: '',
      payment_date: '',
      account: '',
      status: '',
      comments: ''
    });
  };

  const handleValueChange = (event) => {
    let value = event.target.value.replace(/[^\d.]/g, '');

    const regex = /^\d*\.{0,1}\d{0,2}$/;
    if (!regex.test(value)) {
      value = newEntry.value;
    }

    setNewEntry({ ...newEntry, value: value })
  };

  const handleValueChangeEdit = (event) => {
    let value = event.target.value.replace(/[^\d.]/g, '');

    const regex = /^\d*\.{0,1}\d{0,2}$/;
    if (!regex.test(value)) {
      value = editedEntry.value;
    }

    setEditedEntry({ ...editedEntry, value: value })
  };

  return (
    <div className={styles.container_entries}>
      <h1 className={styles.title}>Entradas</h1>
  
      {/* Formulário para criar um novo usuário */}
      <form className={styles.item_grid_container} onSubmit={(e) => { e.preventDefault(); handleCreateEntry(); }}>
        <div className={styles.item_container}>
          <label htmlFor="newentry_type" className={styles.label}>Tipo:</label>
          <select
            id="newentry_type"
            value={newEntry.type}
            onChange={(e) => setNewEntry({ ...newEntry, type: e.target.value, categories: '' })}
            className={`${styles.input} ${styles.select}`}
          >
            <option value="">Selecione o tipo</option>
            <option value="Receita">Receita</option>
            <option value="Despesa">Despesa</option>
          </select>
        </div>

        <div className={styles.item_container}>
          <label htmlFor="newentry_categories" className={styles.label}>Categoria:</label>
          <select
            id="newentry_categories"
            value={newEntry.categories}
            onChange={(e) => setNewEntry({ ...newEntry, categories: e.target.value })}
            className={`${styles.input} ${styles.select}`}
            disabled={!newEntry.type}
          >
            <option value="">Selecione a categoria</option>
            {categoryOptions.map((category) => (
              <option key={category._id} value={category.description}>
                {category.description}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.item_container}>
          <label htmlFor="newentry_description" className={styles.label}>Descrição:</label>
          <input
            type="text"
            id="newentry_description"
            placeholder="Descrição"
            value={newEntry.description}
            onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
            className={styles.input}
          />
        </div>

        <div className={styles.item_container}>
          <label htmlFor="newentry_value" className={styles.label}>Valor:</label>
          <input
            type="text"
            id="newentry_value"
            value={`R$ ${newEntry.value}`}
            onChange={handleValueChange}
            className={styles.input}
          />
        </div>

        <div className={styles.item_container}>
          <label htmlFor="newentry_due_date" className={styles.label}>Data de venc.:</label>
          <input
            type="date"
            id="newentry_due_date"
            placeholder="Data de venc."
            value={newEntry.due_date}
            onChange={(e) => setNewEntry({ ...newEntry, due_date: e.target.value })}
            className={`${styles.input} ${styles.date_input}`}
          />
        </div>

        <div className={styles.item_container}>
          <label htmlFor="newentry_payment_date" className={styles.label}>Data de pag.:</label>
          <input
            type="date"
            id="newentry_payment_date"
            placeholder="Data de pag."
            value={newEntry.payment_date}
            onChange={(e) => setNewEntry({ ...newEntry, payment_date: e.target.value })}
            className={`${styles.input} ${styles.date_input}`}
          />
        </div>

        <div className={styles.item_container}>
          <label htmlFor="newentry_account" className={styles.label}>Conta:</label>
          <select
            id="newentry_account"
            value={newEntry.account}
            onChange={(e) => setNewEntry({ ...newEntry, account: e.target.value })}
            className={`${styles.input} ${styles.select}`}
          >
            <option value="">Selecione a conta</option>
            {accountsOptions.map((account) => (
              <option key={account._id} value={account.description}>
                {account.description}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.item_container}>
          <label htmlFor="newentry_status" className={styles.label}>Status:</label>
          <select
            id="newentry_status"
            value={newEntry.status}
            onChange={(e) => setNewEntry({ ...newEntry, status: e.target.value })}
            className={`${styles.input} ${styles.select}`}
          >
            <option value="">Selecione o status</option>
            <option value="Lancada">Lançada</option>
            <option value="Confirmada">Confirmada</option>
            <option value="Paga">Paga</option>
            <option value="Cancelada">Cancelada</option>
          </select>
        </div>

        <div className={styles.item_container}>
          <label htmlFor="newentry_comments" className={styles.label}>Comentários:</label>
          <input
            type="text"
            id="newentry_comments"
            placeholder="Comentários"
            value={newEntry.comments}
            onChange={(e) => setNewEntry({ ...newEntry, comments: e.target.value })}
            className={`${styles.input} ${styles.text_input}`}
          />
        </div>
        <button type="submit" className={`${styles.button} ${styles.full_width}`}>Criar entrada</button>
      </form>
  
      {/* Lista de usuários */}
      <ul className={styles.list}>
        {entries.map(entry => (
          <li key={entry._id} className={styles.item}>
            {editMode === entry._id ? (
              <>
              <div className={styles.item_grid_container}>
                <div className={styles.item_container}>
                  <label htmlFor="editedentry_type" className={styles.label}>Tipo:</label>
                  <select
                    id="editedentry_type"
                    value={editedEntry.type}                  
                    onChange={(e) => setEditedEntry({ ...editedEntry, type: e.target.value, categories: '' })}
                    className={`${styles.input} ${styles.select}`}
                  >
                    <option value="">Selecione o tipo</option>
                    <option value="Receita">Receita</option>
                    <option value="Despesa">Despesa</option>
                  </select>
                </div>

                <div className={styles.item_container}>
                  <label htmlFor="editedentry_categories" className={styles.label}>Categoria:</label>
                  <select
                    id="editedentry_categories"
                    value={editedEntry.categories}
                    onChange={(e) => setEditedEntry({ ...editedEntry, categories: e.target.value })}
                    className={`${styles.input} ${styles.select}`}
                  >
                    <option value="">Selecione a categoria</option>
                    {categoryOptions.map((category) => (
                      <option key={category._id} value={category.description}>
                        {category.description}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.item_container}>
                  <label htmlFor="editedentry_description" className={styles.label}>Descrição:</label>
                  <input
                    type="text"
                    id="editedentry_description"
                    placeholder="Descrição"
                    value={editedEntry.description}
                    onChange={(e) => setEditedEntry({ ...editedEntry, description: e.target.value })}
                    className={styles.input}
                  />
                </div>

                <div className={styles.item_container}>
                  <label htmlFor="editedentry_value" className={styles.label}>Valor:</label>
                  <input
                    type="text"
                    id="editedentry_value"
                    value={`R$ ${editedEntry.value}`}
                    onChange={handleValueChangeEdit}
                    className={styles.input}
                  />
                </div>

                <div className={styles.item_container}>
                  <label htmlFor="editedentry_due_date" className={styles.label}>Data de venc.:</label>
                  <input
                    type="date"
                    id="editedentry_due_date"
                    placeholder="Data de venc."
                    value={formatDateValue(editedEntry.due_date)}
                    onChange={(e) => setEditedEntry({ ...editedEntry, due_date: e.target.value })}
                    className={`${styles.input} ${styles.date_input}`}
                  />
                </div>

                <div className={styles.item_container}>
                  <label htmlFor="editedentry_payment_date" className={styles.label}>Data de pag.:</label>
                  <input
                    type="date"
                    id="editedentry_payment_date"
                    placeholder="Data de pag."
                    value={formatDateValue(editedEntry.payment_date)}
                    onChange={(e) => setEditedEntry({ ...editedEntry, payment_date: e.target.value })}
                    className={`${styles.input} ${styles.date_input}`}
                  />
                </div>

                <div className={styles.item_container}>
                  <label htmlFor="editedentry_account" className={styles.label}>Conta:</label>
                  <select
                    id="editedentry_account"
                    value={editedEntry.account}
                    onChange={(e) => setEditedEntry({ ...editedEntry, account: e.target.value })}
                    className={`${styles.input} ${styles.select}`}
                  >
                    <option value="">Selecione a conta</option>
                    {accountsOptions.map((account) => (
                      <option key={account._id} value={account.description}>
                        {account.description}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.item_container}>
                  <label htmlFor="editedentry_status" className={styles.label}>Status:</label>
                  <select
                    id="editedentry_status"
                    value={editedEntry.status}
                    onChange={(e) => setEditedEntry({ ...editedEntry, status: e.target.value })}
                    className={`${styles.input} ${styles.select}`}
                  >
                    <option value="">Selecione o status</option>
                    <option value="Lancada">Lançada</option>
                    <option value="Confirmada">Confirmada</option>
                    <option value="Paga">Paga</option>
                    <option value="Cancelada">Cancelada</option>
                  </select>
                </div>

                <div className={styles.item_container}>
                  <label htmlFor="editedentry_comments" className={styles.label}>Comentários:</label>
                  <input
                    type="text"
                    id="editedentry_comments"
                    placeholder="Comentários"
                    value={editedEntry.comments}
                    onChange={(e) => setEditedEntry({ ...editedEntry, comments: e.target.value })}
                    className={`${styles.input} ${styles.text_input}`}
                  />
                </div>
              </div>
                
                <button onClick={() => handleEditEntry()} className={styles.button}>Salvar</button>
                <button onClick={() => cancelEdit()} className={styles.button}>Cancelar</button>
              </>
            ) : (
              <>
                <div className={styles.item_grid_container}>
                  <div className={styles.item_container}><span>Tipo</span>{entry.type}</div>
                  <div className={styles.item_container}><span>Categorias</span>{entry.categories}</div>
                  <div className={styles.item_container}><span>Descrição</span>{entry.description}</div>
                  <div className={styles.item_container}><span>Valor</span>{`R$ ${entry.value}`}</div>
                  <div className={styles.item_container}><span>Data de venc.</span>{formatDate(entry.due_date)}</div>
                  <div className={styles.item_container}><span>Data de Pag.</span>{formatDate(entry.payment_date)}</div>
                  <div className={styles.item_container}><span>Conta</span>{entry.account}</div>
                  <div className={styles.item_container}><span>Status</span>{entry.status}</div>
                  <div className={styles.item_container}><span>Comentários</span>{entry.comments}</div>
                </div>
                <div className={styles.manage_buttons}>
                  <button onClick={() => handleSetEditMode(entry)} className={styles.button}>Editar</button>
                  <button onClick={() => handleDeleteEntry(entry._id)} className={`${styles.button} ${styles.deleteButton}`}>Deletar</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default withAuth(EntriesPage);
