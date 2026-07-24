import React, { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '../languageContext';

type VehicleFormData = {
  vehicleCode: string;
  name: string;
  borrowerName: string;
  loanNumber: string;
  bankName: string;
  plateNumber: string;
  model: string;
  scanDocument: string;
  inName: string;
  yardName: string;
  purchaseDate: string;
  entryDate: string;
  originalDocument: string;
  confirmBy: string;
  paymentStatus: string;
  mailed: string;
  remarks: string;
  status: string;
};

type VehicleRecord = VehicleFormData & {
  id: number;
  vehicle_code?: string;
  borrower_name?: string;
  loan_number?: string;
  bank_name?: string;
  plate_number?: string;
  scan_document?: string;
  in_name?: string;
  yard_name?: string;
  purchase_date?: string;
  entry_date?: string;
  original_document?: string;
  confirm_by?: string;
  payment_status?: string;
};

const initialFormData: VehicleFormData = {
  vehicleCode: '',
  name: '',
  borrowerName: '',
  loanNumber: '',
  bankName: '',
  plateNumber: '',
  model: '',
  scanDocument: 'pending',
  inName: '',
  yardName: '',
  purchaseDate: '',
  entryDate: '',
  originalDocument: 'pending',
  confirmBy: '',
  paymentStatus: 'pending',
  mailed: 'no',
  remarks: '',
  status: 'active'
};

type FieldConfig = {
  key: keyof VehicleFormData;
  label: string;
  placeholder?: string;
  type?: string;
  options?: Array<{ value: string; label: string }>;
  fullWidth?: boolean;
};

const fieldConfigs: FieldConfig[] = [
  { key: 'vehicleCode', label: 'vehicleCode', placeholder: 'phVehicleCode' },
  { key: 'name', label: 'vehicleName', placeholder: 'phVehicleName' },
  { key: 'borrowerName', label: 'borrowerName', placeholder: 'phBorrowerName' },
  { key: 'loanNumber', label: 'loanNumber', placeholder: 'phLoanNumber' },
  { key: 'bankName', label: 'bankName', placeholder: 'phBankName' },
  { key: 'plateNumber', label: 'plateNumber', placeholder: 'phPlate' },
  { key: 'model', label: 'model', placeholder: 'phModel' },
  { key: 'purchaseDate', label: 'purchaseDate', type: 'date' },
  { key: 'entryDate', label: 'entryDate', type: 'date' },
  { key: 'inName', label: 'inName', placeholder: 'phInName' },
  { key: 'yardName', label: 'yardName', placeholder: 'phYardName' },
  {
    key: 'scanDocument',
    label: 'scanDocument',
    options: [
      { value: 'pending', label: 'pending' },
      { value: 'received', label: 'received' }
    ]
  },
  {
    key: 'originalDocument',
    label: 'originalDocument',
    options: [
      { value: 'pending', label: 'pending' },
      { value: 'received', label: 'received' }
    ]
  },
  { key: 'confirmBy', label: 'confirmBy', placeholder: 'phConfirmBy' },
  {
    key: 'paymentStatus',
    label: 'paymentStatus',
    options: [
      { value: 'pending', label: 'pending' },
      { value: 'partial', label: 'partial' },
      { value: 'paid', label: 'paid' }
    ]
  },
  {
    key: 'mailed',
    label: 'mailed',
    options: [
      { value: 'no', label: 'no' },
      { value: 'yes', label: 'yes' }
    ]
  },
  {
    key: 'status',
    label: 'status',
    options: [
      { value: 'active', label: 'active' },
      { value: 'inactive', label: 'inactive' },
      { value: 'in stock', label: 'inStock' }
    ]
  },
  { key: 'remarks', label: 'remarks', placeholder: 'phRemarks', fullWidth: true }
];

const mapVehicleToFormData = (vehicle: Partial<VehicleRecord>): VehicleFormData => ({
  vehicleCode: vehicle.vehicleCode ?? vehicle.vehicle_code ?? '',
  name: vehicle.name ?? '',
  borrowerName: vehicle.borrowerName ?? vehicle.borrower_name ?? '',
  loanNumber: vehicle.loanNumber ?? vehicle.loan_number ?? '',
  bankName: vehicle.bankName ?? vehicle.bank_name ?? '',
  plateNumber: vehicle.plateNumber ?? vehicle.plate_number ?? '',
  model: vehicle.model ?? '',
  scanDocument: vehicle.scanDocument ?? vehicle.scan_document ?? 'pending',
  inName: vehicle.inName ?? vehicle.in_name ?? '',
  yardName: vehicle.yardName ?? vehicle.yard_name ?? '',
  purchaseDate: vehicle.purchaseDate ?? vehicle.purchase_date ?? '',
  entryDate: vehicle.entryDate ?? vehicle.entry_date ?? '',
  originalDocument: vehicle.originalDocument ?? vehicle.original_document ?? 'pending',
  confirmBy: vehicle.confirmBy ?? vehicle.confirm_by ?? '',
  paymentStatus: vehicle.paymentStatus ?? vehicle.payment_status ?? 'pending',
  mailed: vehicle.mailed ?? 'no',
  remarks: vehicle.remarks ?? '',
  status: vehicle.status ?? 'active'
});

const Vehicles = () => {
  const { t } = useLanguage();

  const [vehicles, setVehicles] = useState<VehicleRecord[]>([]);
  const [formData, setFormData] = useState<VehicleFormData>(initialFormData);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleRecord | null>(null);
  const [isEditingDetails, setIsEditingDetails] = useState(false);

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    const data = await window.electronAPI.getVehicles();
    setVehicles(data);
  };

  const openVehicleDetails = (vehicle: VehicleRecord) => {
    setSelectedVehicle(vehicle);
    setFormData(mapVehicleToFormData(vehicle));
    setIsEditingDetails(false);
  };

  const closeVehicleDetails = () => {
    setSelectedVehicle(null);
    setIsEditingDetails(false);
    setFormData(initialFormData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await window.electronAPI.addVehicle(formData);
    setFormData(initialFormData);
    loadVehicles();
  };

  const handleUpdateVehicle = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedVehicle) {
      return;
    }

    await window.electronAPI.updateVehicle({
      id: selectedVehicle.id,
      ...formData
    });

    await loadVehicles();
    closeVehicleDetails();
  };

  const vehicleSummary = useMemo(() => {
    if (!selectedVehicle) {
      return [];
    }

    return [
      { label: t('vehicleCode'), value: selectedVehicle.vehicle_code || '—' },
      { label: t('borrowerName'), value: selectedVehicle.borrower_name || '—' },
      { label: t('loanNumber'), value: selectedVehicle.loan_number || '—' },
      { label: t('bankName'), value: selectedVehicle.bank_name || '—' },
      { label: t('plateNumber'), value: selectedVehicle.plate_number || '—' },
      { label: t('model'), value: selectedVehicle.model || '—' },
      { label: t('purchaseDate'), value: selectedVehicle.purchase_date || '—' },
      { label: t('entryDate'), value: selectedVehicle.entry_date || '—' },
      { label: t('inName'), value: selectedVehicle.in_name || '—' },
      { label: t('yardName'), value: selectedVehicle.yard_name || '—' },
      { label: t('scanDocument'), value: selectedVehicle.scan_document || '—' },
      { label: t('originalDocument'), value: selectedVehicle.original_document || '—' },
      { label: t('confirmBy'), value: selectedVehicle.confirm_by || '—' },
      { label: t('paymentStatus'), value: selectedVehicle.payment_status || '—' },
      { label: t('mailed'), value: selectedVehicle.mailed || '—' },
      { label: t('remarks'), value: selectedVehicle.remarks || '—' },
      { label: t('status'), value: selectedVehicle.status || '—' }
    ];
  }, [selectedVehicle, t]);

  const renderField = (config: FieldConfig) => {
    const value = formData[config.key];

    if (config.options) {
      return (
        <div className={`form-group ${config.fullWidth ? 'form-group-full' : ''}`} key={config.key}>
          <label>{t(config.label)}</label>
          <select value={value} onChange={e => setFormData({ ...formData, [config.key]: e.target.value })}>
            {config.options.map(option => (
              <option key={option.value} value={option.value}>
                {t(option.label)}
              </option>
            ))}
          </select>
        </div>
      );
    }

    if (config.key === 'remarks') {
      return (
        <div className={`form-group ${config.fullWidth ? 'form-group-full' : ''}`} key={config.key}>
          <label>{t(config.label)}</label>
          <textarea
            value={value}
            onChange={e => setFormData({ ...formData, [config.key]: e.target.value })}
            placeholder={t(config.placeholder || '')}
            rows={3}
          />
        </div>
      );
    }

    return (
      <div className={`form-group ${config.fullWidth ? 'form-group-full' : ''}`} key={config.key}>
        <label>{t(config.label)}</label>
        <input
          type={config.type || 'text'}
          value={value}
          onChange={e => setFormData({ ...formData, [config.key]: e.target.value })}
          placeholder={config.placeholder ? t(config.placeholder) : undefined}
          required={config.key === 'name' || config.key === 'plateNumber'}
        />
      </div>
    );
  };

  return (
    <div>
      <h1>{t('vehicleEntryPlatform')}</h1>

      <div className="card">
        <h3>{t('addNewVehicle')}</h3>
        <form onSubmit={handleSubmit} className="no-print form-grid">
          {fieldConfigs.map(renderField)}
          <div className="form-group form-group-full">
            <button type="submit" className="btn btn-primary">{t('saveVehicle')}</button>
          </div>
        </form>
      </div>

      <div className="card">
        <div className="section-header">
          <h3>{t('fleetInventory')}</h3>
          <button className="btn btn-primary no-print" onClick={() => window.print()}>{t('print')}</button>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>{t('vehicleCode')}</th>
                <th>{t('name')}</th>
                <th>{t('borrowerName')}</th>
                <th>{t('plateNumber')}</th>
                <th>{t('model')}</th>
                <th>{t('bankName')}</th>
                <th>{t('entryDate')}</th>
                <th>{t('paymentStatus')}</th>
                <th>{t('status')}</th>
                <th>{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map(v => (
                <tr key={v.id}>
                  <td>{v.id}</td>
                  <td>{v.vehicle_code || '—'}</td>
                  <td>{v.name}</td>
                  <td>{v.borrower_name || '—'}</td>
                  <td>{v.plate_number}</td>
                  <td>{v.model || '—'}</td>
                  <td>{v.bank_name || '—'}</td>
                  <td>{v.entry_date || '—'}</td>
                  <td>{v.payment_status || '—'}</td>
                  <td><span className="status-pill">{v.status}</span></td>
                  <td>
                    <button className="btn btn-secondary btn-sm" onClick={() => openVehicleDetails(v)}>{t('viewDetails')}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedVehicle && (
        <div className="modal-backdrop" onClick={closeVehicleDetails}>
          <div className="vehicle-modal" onClick={e => e.stopPropagation()}>
            <div className="vehicle-modal__header">
              <div>
                <p className="vehicle-modal__eyebrow">{t('fullVehicleDetails')}</p>
                <h2>{selectedVehicle.name || selectedVehicle.vehicle_code || `#${selectedVehicle.id}`}</h2>
                <p>{t('detailsSummary')}</p>
              </div>
              <button className="icon-btn" onClick={closeVehicleDetails}>×</button>
            </div>

            {!isEditingDetails ? (
              <>
                <div className="vehicle-hero">
                  <div>
                    <span className="vehicle-chip">{selectedVehicle.vehicle_code || t('vehicleCode')}</span>
                    <h3>{selectedVehicle.plate_number}</h3>
                    <p>{selectedVehicle.model || t('model')}</p>
                  </div>
                  <div className="vehicle-hero__meta">
                    <span className="status-pill status-pill--soft">{selectedVehicle.payment_status || '—'}</span>
                    <span className="status-pill">{selectedVehicle.status || '—'}</span>
                  </div>
                </div>

                <div className="details-grid">
                  {vehicleSummary.map(item => (
                    <div className="detail-card" key={item.label}>
                      <span>{item.label}</span>
                      <strong>{item.value}</strong>
                    </div>
                  ))}
                </div>

                <div className="vehicle-modal__actions">
                  <button className="btn btn-primary" onClick={() => {
                    setFormData(mapVehicleToFormData(selectedVehicle));
                    setIsEditingDetails(true);
                  }}>
                    {t('editVehicle')}
                  </button>
                  <button className="btn btn-secondary" onClick={closeVehicleDetails}>{t('cancel')}</button>
                </div>
              </>
            ) : (
              <form onSubmit={handleUpdateVehicle} className="modal-form">
                <div className="modal-form__grid">
                  {fieldConfigs.map(renderField)}
                </div>
                <div className="vehicle-modal__actions">
                  <button type="submit" className="btn btn-primary">{t('saveVehicle')}</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setIsEditingDetails(false)}>{t('cancel')}</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Vehicles;