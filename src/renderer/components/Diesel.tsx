import React, { useEffect, useState } from 'react';
import { useLanguage } from '../languageContext'; // Import the hook

const Diesel = () => {
  const { t } = useLanguage(); // Initialize the hook
  
  const [logs, setLogs] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [formData, setFormData] = useState({ vehicleId: '', date: '', liters: '', costPerLiter: '', totalCost: '', station: '', odometer: '' });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const l = await window.electronAPI.getDieselLogs();
    const v = await window.electronAPI.getVehicles();
    setLogs(l);
    setVehicles(v);
  };

  // Auto calculate total cost
  const handleLitersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const liters = parseFloat(e.target.value) || 0;
    const cost = parseFloat(formData.costPerLiter) || 0;
    setFormData({ ...formData, liters: e.target.value, totalCost: (liters * cost).toString() });
  };

  const handleCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cost = parseFloat(e.target.value) || 0;
    const liters = parseFloat(formData.liters) || 0;
    setFormData({ ...formData, costPerLiter: e.target.value, totalCost: (liters * cost).toString() });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await window.electronAPI.addDieselLog({
      vehicleId: parseInt(formData.vehicleId),
      date: formData.date,
      liters: parseFloat(formData.liters),
      costPerLiter: parseFloat(formData.costPerLiter),
      totalCost: parseFloat(formData.totalCost),
      stationName: formData.station,
      odometer: parseFloat(formData.odometer)
    });
    setFormData({ vehicleId: '', date: '', liters: '', costPerLiter: '', totalCost: '', station: '', odometer: '' });
    loadData();
  };

  return (
    <div>
      <h1>{t('dieselManagement')}</h1>
      
      <div className="card no-print">
        <h3>{t('recordFuelFill')}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t('vehicle')}</label>
            <select value={formData.vehicleId} onChange={e => setFormData({...formData, vehicleId: e.target.value})} required>
              <option value="">{t('phSelectVehicle')}</option>
              {vehicles.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>{t('date')}</label>
            <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>{t('stationName')}</label>
            <input value={formData.station} onChange={e => setFormData({...formData, station: e.target.value})} placeholder={t('phStation')} />
          </div>
          <div className="form-group">
            <label>{t('odometer')}</label>
            <input type="number" value={formData.odometer} onChange={e => setFormData({...formData, odometer: e.target.value})} />
          </div>
          <div style={{display: 'flex', gap: '10px'}}>
            <div className="form-group" style={{flex:1}}>
              <label>{t('liters')}</label>
              <input type="number" value={formData.liters} onChange={handleLitersChange} required />
            </div>
            <div className="form-group" style={{flex:1}}>
              <label>{t('costPerLiter')}</label>
              <input type="number" step="0.01" value={formData.costPerLiter} onChange={handleCostChange} required />
            </div>
            <div className="form-group" style={{flex:1}}>
              <label>{t('totalCost')}</label>
              <input type="number" step="0.01" value={formData.totalCost} readOnly style={{background: '#eee'}} />
            </div>
          </div>
          <button type="submit" className="btn btn-primary">{t('save')}</button>
        </form>
      </div>

      <div className="card">
        <div style={{display:'flex', justifyContent:'space-between'}}>
          <h3>{t('fuelHistory')}</h3>
          <button className="btn btn-primary no-print" onClick={() => window.print()}>{t('print')}</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>{t('date')}</th>
              <th>{t('vehicle')}</th>
              <th>{t('liters')}</th>
              <th>{t('costPerLiter')}</th>
              <th>{t('totalCost')}</th>
              <th>{t('odometer')}</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(l => (
              <tr key={l.id}>
                <td>{l.date}</td>
                <td>{l.vehicle_name}</td>
                <td>{l.liters}</td>
                <td>${l.cost_per_liter}</td>
                <td>${l.total_cost}</td>
                <td>{l.odometer_reading}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Diesel;