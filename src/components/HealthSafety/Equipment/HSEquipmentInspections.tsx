import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, Plus, FileDown, Pencil, AlertTriangle } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import type { CraneOperatorInspection, GuardingInspection, ForkliftDailyInspection } from '../../../types/database';
import { FormContainer, FormHeader, FormContent, FormFooter, StepIndicator, TextInput, DateInput, Select, TextArea, RadioGroup } from '../../../utils/form';

type Equipment = { id: string; name: string; serial_number: string };
type Site = { id: string; name: string };

type Props = { onBack: () => void };

type Item = { id: string; name: string; status?: 'pass' | 'fail' | 'na'; notes?: string };
const newItem = (): Item => ({ id: crypto.randomUUID(), name: '', status: 'pass', notes: '' });

export function HSEquipmentInspections({ onBack }: Props) {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [crane, setCrane] = useState<CraneOperatorInspection[]>([]);
  const [guarding, setGuarding] = useState<GuardingInspection[]>([]);
  const [forklift, setForklift] = useState<ForkliftDailyInspection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState<null | { type: 'crane' | 'guarding' | 'forklift'; equipment: Equipment }>(null);
  const [editing, setEditing] = useState<any | null>(null);
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [{ data: eq, error: eqErr }, { data: st, error: stErr }, { data: cr, error: crErr }, { data: gd, error: gdErr }, { data: fl, error: flErr }] =
        await Promise.all([
          supabase.from('equipment').select('id,name,serial_number').order('name'),
          supabase.from('sites').select('id,name').order('name'),
          supabase.from('crane_operator_inspections').select('*').order('check_date', { ascending: false }),
          supabase.from('guarding_inspections').select('*').order('check_date', { ascending: false }),
          supabase.from('forklift_daily_inspections').select('*').order('check_date', { ascending: false }),
        ]);
      if (eqErr || stErr || crErr || gdErr || flErr) throw eqErr || stErr || crErr || gdErr || flErr;
      setEquipment(eq || []);
      setSites(st || []);
      setCrane(cr || []);
      setGuarding(gd || []);
      setForklift(fl || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load equipment inspections');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void fetchAll(); }, []);

  const renderTable = (records: any[], columns: { key: string; label: string; render?: (row: any) => React.ReactNode }[], onEdit: (row: any) => void, onPDF: (row: any) => void) => {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {columns.map(c => (
                <th key={c.key} className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">{c.label}</th>
              ))}
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {records.map(r => (
              <tr key={r.id}>
                {columns.map(c => (
                  <td key={c.key} className="px-4 py-3 text-sm">{c.render ? c.render(r) : (r as any)[c.key]}</td>
                ))}
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => onEdit(r)} className="inline-flex items-center px-3 py-1.5 text-sm rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <Pencil className="h-4 w-4 mr-1" /> Edit
                    </button>
                    <button onClick={() => onPDF(r)} disabled={generatingId === r.id} className="inline-flex items-center px-3 py-1.5 text-sm rounded-md text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-50">
                      <FileDown className="h-4 w-4 mr-1" /> {generatingId === r.id ? 'Generating...' : 'PDF'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const handleViewPDF = async (title: string, row: any) => {
    try {
      setPdfError(null);
      setGeneratingId(row.id);
      const { jsPDF } = await import('jspdf');
      await import('jspdf-autotable');
      const doc = new jsPDF();
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text(title, 14, 18);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const eq = equipment.find(e => e.id === row.equipment_id);
      const details: Record<string, string> = {
        'Inspector': row.created_by_name || '',
        'Date': new Date(row.check_date).toLocaleDateString(),
        'Equipment': eq ? `${eq.name} (${eq.serial_number})` : '',
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
          Back to Equipment
        </button>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Equipment Inspections</h2>

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
      ) : equipment.length === 0 ? (
        <div className="flex items-center justify-center h-48">
          <p className="text-gray-500 dark:text-gray-400">
            No equipment found. Go back to Equipment and add equipment to start inspections.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {equipment.map(eq => {
            const craneRows = crane.filter(r => r.equipment_id === eq.id);
            const guardingRows = guarding.filter(r => r.equipment_id === eq.id);
            const forkliftRows = forklift.filter(r => r.equipment_id === eq.id);
            return (
              <div key={eq.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">{eq.name} - {eq.serial_number}</div>
                  <div className="flex gap-2">
                    <button onClick={() => { setEditing(null); setShowForm({ type: 'crane', equipment: eq }); }} className="inline-flex items-center px-3 py-1.5 text-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                      <Plus className="h-4 w-4 mr-1" /> New Crane
                    </button>
                    <button onClick={() => { setEditing(null); setShowForm({ type: 'guarding', equipment: eq }); }} className="inline-flex items-center px-3 py-1.5 text-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                      <Plus className="h-4 w-4 mr-1" /> New Guarding
                    </button>
                    <button onClick={() => { setEditing(null); setShowForm({ type: 'forklift', equipment: eq }); }} className="inline-flex items-center px-3 py-1.5 text-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                      <Plus className="h-4 w-4 mr-1" /> New Forklift
                    </button>
                  </div>
                </div>

                {/* Crane */}
                {craneRows.length > 0 && (
                  <div className="mt-3">
                    <div className="text-sm font-medium mb-2">Crane Operator Inspections</div>
                    {renderTable(
                      craneRows,
                      [
                        { key: 'check_date', label: 'Date', render: r => new Date(r.check_date).toLocaleDateString() },
                        { key: 'status', label: 'Status' },
                      ],
                      (row) => { setEditing({ type: 'crane', row }); setShowForm({ type: 'crane', equipment: eq }); },
                      (row) => void handleViewPDF('Crane Operator Inspection', row)
                    )}
                  </div>
                )}

                {/* Guarding */}
                {guardingRows.length > 0 && (
                  <div className="mt-4">
                    <div className="text-sm font-medium mb-2">Guarding (Emergency Stop) Inspections</div>
                    {renderTable(
                      guardingRows,
                      [
                        { key: 'check_date', label: 'Date', render: r => new Date(r.check_date).toLocaleDateString() },
                        { key: 'status', label: 'Status' },
                      ],
                      (row) => { setEditing({ type: 'guarding', row }); setShowForm({ type: 'guarding', equipment: eq }); },
                      (row) => void handleViewPDF('Guarding Inspection', row)
                    )}
                  </div>
                )}

                {/* Forklift */}
                {forkliftRows.length > 0 && (
                  <div className="mt-4">
                    <div className="text-sm font-medium mb-2">Forklift Daily Inspections</div>
                    {renderTable(
                      forkliftRows,
                      [
                        { key: 'check_date', label: 'Date', render: r => new Date(r.check_date).toLocaleDateString() },
                        { key: 'status', label: 'Status' },
                      ],
                      (row) => { setEditing({ type: 'forklift', row }); setShowForm({ type: 'forklift', equipment: eq }); },
                      (row) => void handleViewPDF('Forklift Daily Inspection', row)
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {showForm && createPortal(
        <GenericEquipmentInspectionForm
          type={showForm.type}
          equipment={showForm.equipment}
          sites={sites}
          editing={editing}
          onClose={() => { setShowForm(null); setEditing(null); }}
          onSaved={() => { setShowForm(null); setEditing(null); void fetchAll(); }}
        />,
        document.body
      )}
    </div>
  );
}

type GenericFormProps = {
  type: 'crane' | 'guarding' | 'forklift';
  equipment: Equipment;
  sites: Site[];
  editing: null | { type: 'crane' | 'guarding' | 'forklift'; row: any };
  onClose: () => void;
  onSaved: () => void;
};

function GenericEquipmentInspectionForm({ type, equipment, sites, editing, onClose, onSaved }: GenericFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [createdByName, setCreatedByName] = useState('');
  const [checkDate, setCheckDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [siteId, setSiteId] = useState<string | ''>('');
  const [status, setStatus] = useState<'pass' | 'fail'>('pass');
  const getDefaultItems = (): string[] => {
    if (type === 'crane') {
      return [
        'Check inspection tag',
        'Locate main crane disconnect switch',
        'Check condition of pendant/pendants',
        'Check wire ropes and chains for wear/defects',
        'Check hooks',
        'Check upper limit switch',
        'Check braking system',
        'Check trolley and bridge travel (stops in place and travel path is free from obstructions)',
        'Check hoist gearing system (any unusual noises)',
        'Check rails during operation',
        'Check lubrication',
        'Inspect all tackle to be used',
      ];
    }
    if (type === 'forklift') {
      return [
        // Daily checks
        'Fuel',
        'Oil',
        'Water',
        'Hydraulic Oil',
        'Motive Battery Condition',
        'Engine - Serviceable',
        'Tyre Condition / Pressure',
        'Steering Gear',
        'Gauges and Instruments',
        'Parking Brake',
        'Service Brake',
        'Steering',
        'Lights',
        'Mirrors',
        'Horn / Audible warning device',
        // Weekly checks
        'Hydraulics System',
        'FOP / ROP structure',
        'Load backrest extension',
        'Chain Lube / Mast Condition',
        'Bolts and nuts - retighten',
        'Greasing points',
        'Overall condition (Is it safe to use?)',
      ];
    }
    // Guarding/E-stops generic
    return [
      'Emergency stop buttons functional',
      'Safety guards in place',
      'Interlocks operating correctly',
      'Warning labels visible',
      'No damage to guards or fixings',
    ];
  };
  const [items, setItems] = useState<Item[]>(() =>
    getDefaultItems().map(n => ({ id: crypto.randomUUID(), name: n, status: 'pass', notes: '' }))
  );

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.user_metadata?.display_name) setCreatedByName(user.user_metadata.display_name);
    };
    void init();
  }, []);

  useEffect(() => {
    if (!editing) return;
    const r = editing.row;
    setCreatedByName(r.created_by_name || '');
    setCheckDate(r.check_date);
    setSiteId(r.site_id || '');
    setStatus(r.status);
    const restored = ((r.items as any[]) || []).map((x) => ({ id: crypto.randomUUID(), ...x }));
    setItems(restored.length ? restored : getDefaultItems().map(n => ({ id: crypto.randomUUID(), name: n, status: 'pass', notes: '' })));
  }, [editing]);

  const title = useMemo(() => {
    if (type === 'crane') return 'Crane Operator Inspection';
    if (type === 'guarding') return 'Guarding (Emergency Stop) Inspection';
    return 'Forklift Daily Inspection';
  }, [type]);

  const tableName = useMemo(() => {
    if (type === 'crane') return 'crane_operator_inspections';
    if (type === 'guarding') return 'guarding_inspections';
    return 'forklift_daily_inspections';
  }, [type]);

  const stepLabels = ['Details', 'Items', 'Notes & Submit'];
  const [notes, setNotes] = useState('');

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
  const handlePrev = () => setCurrentStep(s => Math.max(1, s - 1));

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
        equipment_id: equipment.id,
        site_id: siteId || null,
        check_date: checkDate,
        status,
        items: items.map(({ id, ...rest }) => rest),
        notes: notes || null,
      };
      if (editing) {
        const { error } = await supabase.from(tableName).update(payload).eq('id', editing.row.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from(tableName).insert([payload]);
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
      <FormHeader title={`${title} — ${equipment.name}`} onClose={onClose} />
      <FormContent>
        <StepIndicator currentStep={currentStep} totalSteps={3} stepLabels={stepLabels} />

        {currentStep === 1 && (
          <div className="space-y-4">
            <TextInput label="Inspector" value={createdByName} onChange={setCreatedByName} required />
            <DateInput label="Inspection Date" value={checkDate} onChange={setCheckDate} required />
            <Select
              label="Site (optional)"
              value={siteId || ''}
              onChange={v => setSiteId(v || '')}
              options={[{ label: 'No site', value: '' }, ...sites.map(s => ({ label: s.name, value: s.id }))]}
            />
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
        onNext={handleNext}
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


