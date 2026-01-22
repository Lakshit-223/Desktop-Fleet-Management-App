import React, { useEffect, useState } from 'react';
import { useLanguage } from '../languageContext'; // Import hook

const SpareParts = () => {
  const { t } = useLanguage(); // Initialize hook to access translations
  
  const [parts, setParts] = useState<any[]>([]);
  const [formData, setFormData] = useState({ name: '', partNumber: '', quantity: '', costPrice: '', minStock: '' });

  useEffect(() => { loadParts(); }, []);

  const loadParts = async () => {
    const data = await window.electronAPI.getParts();
    setParts(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await window.electronAPI.addPart({
      name: formData.name,
      partNumber: formData.partNumber,
      quantity: parseInt(formData.quantity),
      costPrice: parseFloat(formData.costPrice),
      minStockLevel: parseInt(formData.minStock)
    });
    setFormData({ name: '', partNumber: '', quantity: '', costPrice: '', minStock: '' });
    loadParts();
  };

  return (
    <div>
      {/* Translate Main Header */}
      <h1>{t('partsManagement')}</h1>
      
      <div className="card no-print">
        {/* Translate Form Header */}
        <h3>{t('addNewPart')}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t('partName')}</label>
            <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>{t('partNumber')}</label>
            <input value={formData.partNumber} onChange={e => setFormData({...formData, partNumber: e.target.value})} />
          </div>
          <div style={{display:'flex', gap:'10px'}}>
            <div className="form-group" style={{flex:1}}>
              <label>{t('quantity')}</label>
              <input type="number" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} required />
            </div>
            <div className="form-group" style={{flex:1}}>
              <label>{t('costPrice')}</label>
              <input type="number" step="0.01" value={formData.costPrice} onChange={e => setFormData({...formData, costPrice: e.target.value})} />
            </div>
            <div className="form-group" style={{flex:1}}>
              <label>{t('minStock')}</label>
              <input type="number" value={formData.minStock} onChange={e => setFormData({...formData, minStock: e.target.value})} />
            </div>
          </div>
          {/* Translate Button */}
          <button type="submit" className="btn btn-primary">{t('save')}</button>
        </form>
      </div>

      <div className="card">
        <div style={{display:'flex', justifyContent:'space-between'}}>
          {/* Translate List Header */}
          <h3>{t('inventoryList')}</h3>
          {/* Translate Print Button */}
          <button className="btn btn-primary no-print" onClick={() => window.print()}>{t('print')}</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>{t('partName')}</th>
              <th>{t('partNumber')}</th>
              <th>{t('stock')}</th>
              <th>{t('costPrice')}</th>
              <th>{t('status')}</th>
            </tr>
          </thead>
          <tbody>
            {parts.map(p => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.part_number}</td>
                <td>{p.quantity}</td>
                <td>${p.cost_price}</td>
                <td>
                  {p.quantity <= p.min_stock_level ? 
                    <span style={{color:'red', fontWeight:'bold'}}>{t('lowStock')}</span> : 
                    <span style={{color:'green'}}>{t('inStock')}</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SpareParts;