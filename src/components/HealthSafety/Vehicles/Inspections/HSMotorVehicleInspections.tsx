import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, Plus, FileDown, Pencil, AlertTriangle } from 'lucide-react';
import { supabase } from '../../../../lib/supabase';
import type { MotorVehicleInspection } from '../../../../types/database';
import { FormContainer, FormHeader, FormContent, FormFooter, StepIndicator, TextInput, DateInput, Select, TextArea, RadioGroup, NumberInput } from '../../../../utils/form';

type Vehicle = { id: string; registration: string; make: string; model: string };

type Props = { onBack: () => void };
type Item = { id: string; name: string; status?: 'pass' | 'fail' | 'na'; notes?: string };
const newItem = (): Item => ({ id: crypto.randomUUID(), name: '', status: 'pass', notes: '' });

export function HSMotorVehicleInspections({ onBack }: Props) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [rows, setRows] = useState<MotorVehicleInspection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState<null | { vehicle: Vehicle }>(null);
  const [editing, setEditing] = useState<MotorVehicleInspection | null>(null);
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [{ data: v, error: vErr }, { data: insp, error: iErr }] = await Promise.all([
        supabase.from('vehicles').select('id,registration,make,model').order('registration'),
        supabase.from('motor_vehicle_inspections').select('*').order('check_date', { ascending: false }),
      ]);
      if (vErr || iErr) throw vErr || iErr;
      setVehicles(v || []);
      setRows(insp || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load inspections');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void fetchAll(); }, []);

  const handleViewPDF = async (row: MotorVehicleInspection) => {
    try {
      setPdfError(null);
      setGeneratingId(row.id);
      const { jsPDF } = await import('jspdf');
      await import('jspdf-autotable');
      const doc = new jsPDF();
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('Motor Vehicle Inspection', 14, 18);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const v = vehicles.find(x => x.id === row.vehicle_id);
      const details: Record<string, string> = {
        'Inspector': row.created_by_name || '',
        'Date': new Date(row.check_date).toLocaleDateString(),
        'Vehicle': v ? `${v.registration} (${v.make} ${v.model})` : '',
        'Odometer': row.odometer != null ? String(row.odometer) : '',
        'Status': row.status,
      };
      let y = 26;
      Object.entries(details).forEach(([k, v]) => {
        doc.text(`${k}: ${v || '-'}`, 14, y);
        y += 6;
      });
      const items: Item[] = (row.items as any[]) || [];
      if (items.length) {
        (doc as any).autoTable({
          startY: y + 2,
          head: [['Item', 'Status', 'Notes']],
          body: items.map(it => [it.name || '-', (it.status || '-').toUpperCase(), it.notes || '-']),
          styles: { fontSize: 9 },
          headStyles: { fillColor: [55, 65, 81] },
        });
      }
      const dataUrl = doc.output('datauristring');
      const win = window.open('', '_blank');
      if (!win) throw new Error('Popup blocked');
      win.document.write(`<iframe src="${dataUrl}" style="border:0;width:100%;height:100%"></iframe>`);
    } catch (e) {
      setPdfError(e instanceof Error ? e.message : 'Failed to generate PDF');
    } finally {
      setGeneratingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-white mb-6">
        <button onClick={onBack} className="flex items-center text-gray-600 hover:text-gray-900 dark:text-white dark:hover:text-gray-200">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Vehicles
        </button>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Motor Vehicle Inspections</h2>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-4 rounded-md">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}
      {pdfError && (
        <div className="mb-4 flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-4 rounded-md">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <p>{pdfError}</p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
        </div>
      ) : vehicles.length === 0 ? (
        <div className="flex items-center justify-center h-48">
          <p className="text-gray-500 dark:text-gray-400">No vehicles</p>
        </div>
      ) : (
        <div className="space-y-6">
          {vehicles.map(v => {
            const vRows = rows.filter(r => r.vehicle_id === v.id);
            return (
              <div key={v.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">{v.registration} — {v.make} {v.model}</div>
                  <button onClick={() => { setEditing(null); setShowForm({ vehicle: v }); }} className="inline-flex items-center px-3 py-1.5 text-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                    <Plus className="h-4 w-4 mr-1" /> New Inspection
                  </button>
                </div>
                {vRows.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Date</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Odometer</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {vRows.map(r => (
                          <tr key={r.id}>
                            <td className="px-4 py-3 text-sm">{new Date(r.check_date).toLocaleDateString()}</td>
                            <td className="px-4 py-3 text-sm">{r.odometer ?? '-'}</td>
                            <td className="px-4 py-3 text-sm">
                              <span className={`px-2 py-1 rounded text-white ${r.status === 'pass' ? 'bg-green-600' : 'bg-red-600'}`}>{r.status}</span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex justify-end gap-2">
                                <button onClick={() => { setEditing(r); setShowForm({ vehicle: v }); }} className="inline-flex items-center px-3 py-1.5 text-sm rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
                                  <Pencil className="h-4 w-4 mr-1" /> Edit
                                </button>
                                <button onClick={() => void handleViewPDF(r)} disabled={generatingId === r.id} className="inline-flex items-center px-3 py-1.5 text-sm rounded-md text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-50">
                                  <FileDown className="h-4 w-4 mr-1" /> {generatingId === r.id ? 'Generating...' : 'PDF'}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {showForm && createPortal(
        <MotorVehicleInspectionForm
          vehicle={showForm.vehicle}
          editing={editing}
          onClose={() => { setShowForm(null); setEditing(null); }}
          onSaved={() => { setShowForm(null); setEditing(null); void fetchAll(); }}
        />,
        document.body
      )}
    </div>
  );
}

type FormProps = { vehicle: Vehicle; editing: MotorVehicleInspection | null; onClose: () => void; onSaved: () => void };

function MotorVehicleInspectionForm({ vehicle, editing, onClose, onSaved }: FormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [createdByName, setCreatedByName] = useState('');
  const [checkDate, setCheckDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<'pass' | 'fail'>('pass');
  const [odometer, setOdometer] = useState<number | ''>('');
  const defaultNames: string[] = [
    // External
    'Bodywork',
    'Windscreen/Wipers',
    'Front Lights',
    'Rear Lights',
    'Tyre Wear & Pressures',
    'Spare Wheel & Jack',
    // Internal
    'Seat Belts',
    'Door Mirrors',
    'Rear View Mirror',
    'Seat Adjustment',
    'First Aid Kit (if fitted)',
    'Extinguisher (if fitted)',
    // Fluids
    'Oil Level',
    'Coolant Level',
    'Washer Fluid Level',
    'Power Steering Fluid',
    'Brake Fluid',
    'Clutch Fluid',
    // Function checks
    'All Lights',
    'Horn',
    'Wipers & Washers',
    'Steering',
    'Brakes',
    'Fuel Level',
  ];
  const [items, setItems] = useState<Item[]>(defaultNames.map(n => ({ id: crypto.randomUUID(), name: n, status: 'pass', notes: '' })));
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.user_metadata?.display_name) setCreatedByName(user.user_metadata.display_name);
    };
    void init();
  }, []);

  useEffect(() => {
    if (!editing) return;
    setCreatedByName(editing.created_by_name || '');
    setCheckDate(editing.check_date);
    setStatus(editing.status);
    setOdometer(editing.odometer ?? '');
    const restored = ((editing.items as any[]) || []).map(x => ({ id: crypto.randomUUID(), ...x }));
    setItems(restored.length ? restored : defaultNames.map(n => ({ id: crypto.randomUUID(), name: n, status: 'pass', notes: '' })));
    setNotes(editing.notes || '');
  }, [editing]);

  const stepLabels = ['Details', 'Items', 'Notes & Submit'];

  const validateStep = (step: number) => {
    setError(null);
    if (step === 1) {
      if (!createdByName || !checkDate) {
        setError('Please provide inspector and date.');
        return false;
      }
    }
    if (step === 2) {
      if (!items.length || items.some(i => !i.name)) {
        setError('Add at least one item with a name.');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 3) setCurrentStep(s => s + 1);
      else void handleSubmit();
    }
  };

  const handleItemChange = (id: string, patch: Partial<Item>) => {
    setItems(prev => prev.map(it => (it.id === id ? { ...it, ...patch } : it)));
  };
  const addItem = () => setItems(prev => [...prev, newItem()]);
  const removeItem = (id: string) => setItems(prev => prev.filter(it => it.id !== id));

  const handleSubmit = async () => {
    if (!validateStep(2)) return;
    setLoading(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      const payload: any = {
        user_id: user.id,
        created_by_name: createdByName || null,
        vehicle_id: vehicle.id,
        check_date: checkDate,
        status,
        odometer: odometer === '' ? null : Number(odometer),
        items: items.map(({ id, ...rest }) => rest),
        notes: notes || null,
      };
      if (editing) {
        const { error } = await supabase.from('motor_vehicle_inspections').update(payload).eq('id', editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('motor_vehicle_inspections').insert([payload]);
        if (error) throw error;
      }
      onSaved();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save inspection');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer isOpen={true} maxWidth="3xl">
      <FormHeader title={`Motor Vehicle Inspection — ${vehicle.registration}`} onClose={onClose} />
      <FormContent>
        <StepIndicator currentStep={currentStep} totalSteps={3} stepLabels={stepLabels} />

        {currentStep === 1 && (
          <div className="space-y-4">
            <TextInput label="Inspector" value={createdByName} onChange={setCreatedByName} required />
            <DateInput label="Inspection Date" value={checkDate} onChange={setCheckDate} required />
            <NumberInput label="Odometer" value={odometer === '' ? '' : String(odometer)} onChange={(v) => setOdometer(v ? Number(v) : '')} />
            <RadioGroup
              label="Overall Status"
              value={status}
              onChange={v => setStatus(v as any)}
              options={[{ label: 'Pass', value: 'pass' }, { label: 'Fail', value: 'fail' }]}
            />
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            {items.map((it) => (
              <div key={it.id} className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end border border-gray-200 dark:border-gray-700 rounded p-3">
                <div className="md:col-span-3">
                  <TextInput label="Item" value={it.name} onChange={(v) => handleItemChange(it.id, { name: v })} required />
                </div>
                <div className="md:col-span-2">
                  <Select
                    label="Status"
                    value={it.status || 'pass'}
                    onChange={(v) => handleItemChange(it.id, { status: (v as any) || 'pass' })}
                    options={[{ label: 'Pass', value: 'pass' }, { label: 'Fail', value: 'fail' }, { label: 'N/A', value: 'na' }]}
                  />
                </div>
                <div className="md:col-span-1">
                  <button
                    onClick={() => removeItem(it.id)}
                    className="w-full text-sm px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    Remove
                  </button>
                </div>
                <div className="md:col-span-6">
                  <TextArea label="Notes" value={it.notes || ''} onChange={(v) => handleItemChange(it.id, { notes: v })} rows={2} />
                </div>
              </div>
            ))}
            <button onClick={addItem} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
              <Plus className="h-4 w-4 mr-2" /> Add Item
            </button>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            <TextArea label="Notes" value={notes} onChange={setNotes} rows={4} />
            {error && <div className="mt-2 p-3 text-sm rounded bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300">{error}</div>}
          </div>
        )}

        {error && currentStep !== 3 && <div className="mt-4 p-3 text-sm rounded bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300">{error}</div>}
      </FormContent>
      <FormFooter
        onCancel={onClose}
        onPrevious={() => setCurrentStep(s => Math.max(1, s - 1))}
        onNext={() => {
          if (validateStep(currentStep)) setCurrentStep(s => Math.min(3, s + 1));
        }}
        onSubmit={() => void handleSubmit()}
        showPrevious={true}
        isFirstStep={currentStep === 1}
        isLastStep={currentStep === 3}
        nextButtonText="Next"
        submitButtonText={editing ? 'Save Changes' : 'Submit Inspection'}
        cancelButtonText="Cancel"
        previousButtonText="Previous"
        disabled={false}
        loading={loading}
      />
    </FormContainer>
  );
}


