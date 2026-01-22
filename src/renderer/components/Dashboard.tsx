import React, { useEffect, useState } from 'react';
import { useLanguage } from '../languageContext'; // Import the hook

const Dashboard = () => {
  const { t } = useLanguage(); // Use the hook to get 't' function
  
  const [stats, setStats] = useState({
    totalVehicles: 0,
    todayTrips: 0,
    monthlyFuelCost: 0,
    balance: 0
  });

  // Simple logic to calculate totals
  useEffect(() => {
    const fetchStats = async () => {
      const vehicles = await window.electronAPI.getVehicles();
      const transactions = await window.electronAPI.getTransactions();
      const trips = await window.electronAPI.getTrips();
      
      // Calculate Balance (Income - Expense)
      let totalIncome = 0;
      let totalExpense = 0;
      transactions.forEach((txn: any) => {
        if(txn.type === 'income') totalIncome += txn.amount;
        else totalExpense += txn.amount;
      });

      setStats({
        totalVehicles: vehicles.length,
        todayTrips: trips.length, 
        monthlyFuelCost: totalExpense, 
        balance: totalIncome - totalExpense
      });
    };
    fetchStats();
  }, []);

  return (
    <div>
      {/* Use t('key') for translation */}
      <h1>{t('dashboard')}</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>{t('totalVehicles')}</h3>
          <div className="stat-value">{stats.totalVehicles}</div>
        </div>
        
        <div className="stat-card">
          <h3>{t('totalTrips')}</h3>
          <div className="stat-value">{stats.todayTrips}</div>
        </div>
        
        <div className="stat-card" style={{borderColor: '#e74c3c'}}>
          <h3>{t('totalExpenses')}</h3>
          <div className="stat-value">${stats.monthlyFuelCost.toFixed(2)}</div>
        </div>
        
        <div className="stat-card" style={{borderColor: '#27ae60'}}>
          <h3>{t('cashBalance')}</h3>
          <div className="stat-value">${stats.balance.toFixed(2)}</div>
        </div>
      </div>
      
      <div className="card">
        <h3>{t('quickActions')}</h3>
        <p>{t('useSidebar')}</p>
      </div>
    </div>
  );
};

export default Dashboard;