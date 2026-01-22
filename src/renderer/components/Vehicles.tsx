import React, { useEffect, useState } from 'react';
import { useLanguage } from '../languageContext'; // 1. Import the hook

const Vehicles = () => {
  const { t } = useLanguage(); // 2. Initialize the hook to access translations
  
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [formData, setFormData] = useState({ name: '', plateNumber: '', model: '', purchaseDate: '' });

  useEffect(() => { loadVehicles(); }, []);

  const loadVehicles = async () => {
    const data = await window.electronAPI.getVehicles();
    setVehicles(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await window.electronAPI.addVehicle(formData);
    setFormData({ name: '', plateNumber: '', model: '', purchaseDate: '' });
    loadVehicles();
  };

  return (
    <div>
      {/* 3. Translate Header */}
      <h1>{t('vehicleManagement')}</h1>
      
      <div className="card">
        {/* 4. Translate Subheader */}
        <h3>{t('addNewVehicle')}</h3>
        <form onSubmit={handleSubmit} className="no-print">
          <div className="form-group">
            {/* 5. Translate Label + Add Placeholder */}
            <label>{t('vehicleName')}</label>
            <input 
              placeholder={t('phVehicleName')} 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
              required 
            />
          </div>
          <div className="form-group">
            <label>{t('plateNumber')}</label>
            <input 
              placeholder={t('phPlate')} 
              value={formData.plateNumber} 
              onChange={e => setFormData({...formData, plateNumber: e.target.value})} 
              required 
            />
          </div>
          <div className="form-group">
            <label>{t('model')}</label>
            <input 
              placeholder={t('phModel')} 
              value={formData.model} 
              onChange={e => setFormData({...formData, model: e.target.value})} 
            />
          </div>
          <div className="form-group">
            <label>{t('purchaseDate')}</label>
            <input type="date" value={formData.purchaseDate} onChange={e => setFormData({...formData, purchaseDate: e.target.value})} />
          </div>
          {/* 6. Translate Button Text */}
          <button type="submit" className="btn btn-primary">{t('add')} {t('vehicle')}</button>
        </form>
      </div>

      <div className="card">
        <div style={{display:'flex', justifyContent:'space-between'}}>
          {/* 7. Translate Header */}
          <h3>{t('fleetInventory')}</h3>
          {/* 8. Translate Print Button */}
          <button className="btn btn-primary no-print" onClick={() => window.print()}>{t('print')}</button>
        </div>
        <table>
          <thead>
            <tr>
              {/* "ID" is not in your translations object, so we leave it hardcoded */}
              <th>ID</th>
              <th>{t('name')}</th>
              <th>{t('plateNumber')}</th>
              <th>{t('model')}</th>
              <th>{t('purchaseDate')}</th>
              <th>{t('status')}</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map(v => (
              <tr key={v.id}>
                <td>{v.id}</td>
                <td>{v.name}</td>
                <td>{v.plate_number}</td>
                <td>{v.model}</td>
                <td>{v.purchase_date}</td>
                <td><span style={{color:'green', fontWeight:'bold'}}>{v.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Vehicles;