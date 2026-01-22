import React, { useEffect, useState } from 'react';
import { useLanguage } from '../languageContext'; // Import hook

const Transactions = () => {
  const { t } = useLanguage(); // Initialize hook to access translations
  
  const [transactions, setTransactions] = useState<any[]>([]);
  const [formData, setFormData] = useState({ date: '', type: 'expense', category: '', amount: '', mode: 'cash', description: '' });

  useEffect(() => { loadTransactions(); }, []);

  const loadTransactions = async () => {
    const data = await window.electronAPI.getTransactions();
    setTransactions(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await window.electronAPI.addTransaction({
      date: formData.date,
      type: formData.type,
      category: formData.category,
      amount: parseFloat(formData.amount),
      paymentMode: formData.mode,
      description: formData.description,
      referenceId: 'TXN-' + Date.now()
    });
    setFormData({ date: '', type: 'expense', category: '', amount: '', mode: 'cash', description: '' });
    loadTransactions();
  };

  // Mapping helpers because DB values (e.g., 'fuel') don't exactly match translation keys (e.g., 'fuelCat')
  const getCategoryKey = (val: string) => {
    switch(val) {
      case 'fuel': return 'fuelCat';
      case 'parts': return 'partsCat';
      case 'salary': return 'salary';
      case 'trip_income': return 'tripIncome';
      default: return val; // 'maintenance', 'other' match keys directly
    }
  };

  const getPaymentKey = (val: string) => {
    if (val === 'bank_transfer') return 'bankTransfer';
    return val; // 'cash', 'online' match keys directly
  };

  return (
    <div>
      {/* Translate Header */}
      <h1>{t('transactionManagement')}</h1>
      
      <div className="card no-print">
        {/* Translate Subheader */}
        <h3>{t('recordTransaction')}</h3>
        <form onSubmit={handleSubmit}>
          <div style={{display:'flex', gap:'10px'}}>
            <div className="form-group" style={{flex:1}}>
              <label>{t('type')}</label>
              <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                <option value="expense">{t('expense')}</option>
                <option value="income">{t('income')}</option>
              </select>
            </div>
            <div className="form-group" style={{flex:1}}>
              <label>{t('category')}</label>
              <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required>
                <option value="">{t('phSelectCategory')}</option>
                <option value="fuel">{t('fuelCat')}</option>
                <option value="maintenance">{t('maintenance')}</option>
                <option value="parts">{t('partsCat')}</option>
                <option value="salary">{t('salary')}</option>
                <option value="trip_income">{t('tripIncome')}</option>
                <option value="other">{t('other')}</option>
              </select>
            </div>
          </div>

          <div style={{display:'flex', gap:'10px'}}>
            <div className="form-group" style={{flex:1}}>
              <label>{t('date')}</label>
              <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required />
            </div>
            <div className="form-group" style={{flex:1}}>
              <label>{t('amount')}</label>
              <input type="number" step="0.01" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} required />
            </div>
          </div>

          <div className="form-group">
            <label>{t('paymentMode')}</label>
            <div style={{display:'flex', gap:'20px'}}>
              <label><input type="radio" name="mode" value="cash" checked={formData.mode === 'cash'} onChange={() => setFormData({...formData, mode: 'cash'})} /> {t('cash')}</label>
              <label><input type="radio" name="mode" value="online" checked={formData.mode === 'online'} onChange={() => setFormData({...formData, mode: 'online'})} /> {t('online')}</label>
              <label><input type="radio" name="mode" value="bank_transfer" checked={formData.mode === 'bank_transfer'} onChange={() => setFormData({...formData, mode: 'bank_transfer'})} /> {t('bankTransfer')}</label>
            </div>
          </div>

          <div className="form-group">
            <label>{t('description')}</label>
            <input value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder={t('phDesc')} />
          </div>

          {/* Translate Button */}
          <button type="submit" className="btn btn-primary">{t('save')}</button>
        </form>
      </div>

      <div className="card">
        <div style={{display:'flex', justifyContent:'space-between'}}>
          {/* Translate List Header */}
          <h3>{t('transactionLog')}</h3>
          <button className="btn btn-primary no-print" onClick={() => window.print()}>{t('print')}</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>{t('date')}</th>
              <th>{t('type')}</th>
              <th>{t('category')}</th>
              <th>{t('description')}</th>
              <th>{t('mode')}</th>
              <th>{t('amount')}</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(txn => (
              <tr key={txn.id}>
                <td>{txn.date}</td>
                <td>
                  <span style={{color: txn.type === 'income' ? 'green' : 'red', fontWeight:'bold', textTransform:'capitalize'}}>
                    {t(txn.type)}
                  </span>
                </td>
                <td style={{textTransform:'capitalize'}}>
                  {t(getCategoryKey(txn.category))}
                </td>
                <td>{txn.description}</td>
                <td style={{textTransform:'capitalize'}}>
                  {t(getPaymentKey(txn.payment_mode))}
                </td>
                <td>${txn.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Transactions;