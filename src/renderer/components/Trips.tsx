import React, { useEffect, useState } from 'react';
import { useLanguage } from '../languageContext'; // Import hook

const Trips = () => {
  const { t } = useLanguage(); // Initialize hook to access translations
  
  const [trips, setTrips] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [formData, setFormData] = useState({ vehicleId: '', date: '', origin: '', destination: '', purpose: '', distance: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const t = await window.electronAPI.getTrips();
    const v = await window.electronAPI.getVehicles();
    setTrips(t);
    setVehicles(v);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await window.electronAPI.addTrip({
      vehicleId: parseInt(formData.vehicleId),
      date: formData.date,
      origin: formData.origin,
      destination: formData.destination,
      purpose: formData.purpose,
      distance: parseFloat(formData.distance)
    });
    setFormData({ vehicleId: '', date: '', origin: '', destination: '', purpose: '', distance: '' });
    loadData();
  };

  return (
    <div>
      {/* Translate Header */}
      <h1>{t('tripManagement')}</h1>
      
      <div className="card no-print">
        {/* Translate Subheader */}
        <h3>{t('logNewTrip')}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t('vehicle')}</label>
            <select value={formData.vehicleId} onChange={e => setFormData({...formData, vehicleId: e.target.value})} required>
              <option value="">{t('phSelectVehicle')}</option>
              {vehicles.map(v => <option key={v.id} value={v.id}>{v.name} ({v.plate_number})</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>{t('date')}</label>
            <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>{t('origin')}</label>
            <input value={formData.origin} onChange={e => setFormData({...formData, origin: e.target.value})} placeholder={t('phOrigin')} required />
          </div>
          <div className="form-group">
            <label>{t('destination')}</label>
            <input value={formData.destination} onChange={e => setFormData({...formData, destination: e.target.value})} placeholder={t('phDestination')} required />
          </div>
          <div className="form-group">
            <label>{t('purpose')}</label>
            <input value={formData.purpose} onChange={e => setFormData({...formData, purpose: e.target.value})} placeholder={t('phPurpose')} />
          </div>
          <div className="form-group">
            <label>{t('distance')}</label>
            <input type="number" value={formData.distance} onChange={e => setFormData({...formData, distance: e.target.value})} />
          </div>
          {/* Translate Button */}
          <button type="submit" className="btn btn-primary">{t('save')}</button>
        </form>
      </div>

      <div className="card">
        <div style={{display:'flex', justifyContent:'space-between'}}>
          {/* Translate Header */}
          <h3>{t('tripHistory')}</h3>
          {/* Translate Print Button */}
          <button className="btn btn-primary no-print" onClick={() => window.print()}>{t('print')}</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>{t('date')}</th>
              <th>{t('vehicle')}</th>
              <th>{t('route')}</th>
              <th>{t('distance')}</th>
              <th>{t('purpose')}</th>
            </tr>
          </thead>
          <tbody>
            {trips.map(trip => (
              <tr key={trip.id}>
                <td>{trip.date}</td>
                <td>{trip.vehicle_name} <br/> <small>{trip.plate_number}</small></td>
                <td>{trip.origin} &rarr; {trip.destination}</td>
                <td>{trip.distance_km}</td>
                <td>{trip.purpose}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Trips;