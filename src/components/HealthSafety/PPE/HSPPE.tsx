import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, Plus, FileDown, Pencil, AlertTriangle } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { PPEInspection } from '../../../types/database';
import { FormContainer, FormHeader, FormContent, FormFooter, StepIndicator, Select, TextInput, DateInput, TextArea, RadioGroup } from '../../../utils/form';

type Staff = { id: number; name: string };
type Worker = { id: string; full_name: string | null };
type Site = { id: string; name: string };

type HSPPEProps = {
  onBack: () => void;
};

type Item = {
  id: string;
  name: string;
  rating?: 'excellent' | 'good' | 'average' | 'poor' | 'replace' | 'na';
  dateOrdered?: string;
  notes?: string;
};

const newItem = (): Item => ({
  id: crypto.randomUUID(),
  name: '',
  rating: 'good',
  dateOrdered: '',
  notes: '',
});

export function HSPPE({ onBack }: HSPPEProps) {
  const [inspections, setInspections] = useState<PPEInspection[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<PPEInspection | null>(null);
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [{ data: insp, error: inspErr }, { data: stf, error: stfErr }, { data: wrk, error: wrkErr }, { data: sts, error: siteErr }] =
        await Promise.all([
          supabase.from('ppe_inspections').select('*').order('check_date', { ascending: false }),
          supabase.from('staff').select('id,name').order('name'),
          supabase.from('workers').select('id,full_name').order('full_name'),
          supabase.from('sites').select('id,name').order('name'),
        ]);
      if (inspErr || stfErr || wrkErr || siteErr) throw inspErr || stfErr || wrkErr || siteErr;
      setInspections(insp || []);
      setStaff(stf || []);
      setWorkers(wrk || []);
      setSites(sts || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load PPE inspections');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const resolvePerson = (insp: PPEInspection) => {
    if (insp.staff_id) {
      const s = staff.find(x => x.id === insp.staff_id);
      return s ? s.name : 'Staff';
    }
    if (insp.worker_id) {
      const w = workers.find(x => x.id === insp.worker_id);
      return w?.full_name || 'Worker';
    }
    return 'N/A';
  };

  const handleNew = () => {
    setEditing(null);
    setShowForm(true);
  };

  const handleEdit = (i: PPEInspection) => {
    setEditing(i);
    setShowForm(true);
  };

  const handleViewPDF = async (i: PPEInspection) => {
    try {
      setPdfError(null);
      setGeneratingId(i.id);
      // lazy import a small inline generator to avoid many files
      const { jsPDF } = await import('jspdf');
      const auto = await import('jspdf-autotable');
      void auto;
      const doc = new jsPDF();
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('PPE Inspection', 14, 18);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const details: Record<string, string> = {
        'Inspector': i.created_by_name || '',
        'Date': new Date(i.check_date).toLocaleDateString(),
        'Person': resolvePerson(i),
        'Status': i.status,
      };
      const y0 = 26;
      let y = y0;
      Object.entries(details).forEach(([k, v]) => {
        doc.text(`${k}: ${v || '-'}`, 14, y);
        y += 6;
      });

      const items: Item[] = (i.items as any[]) || [];
      if (items.length) {
        (doc as any).autoTable({
          startY: y + 2,
          head: [['Item', 'Condition', 'Date Ordered', 'Notes']],
          body: items.map(it => [it.name || '-', (it.rating || '-').toString(), it.dateOrdered || '-', it.notes || '-']),
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
          Back to Health & Safety
        </button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">PPE Inspections</h2>
        <button
          onClick={handleNew}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          New PPE Inspection
        </button>
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

      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
          </div>
        ) : inspections.length === 0 ? (
          <div className="flex items-center justify-center h-48">
            <p className="text-gray-500 dark:text-gray-400">No PPE inspections yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Person</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {inspections.map(i => (
                  <tr key={i.id} className="bg-white dark:bg-gray-800">
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{new Date(i.check_date).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{resolvePerson(i)}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded text-white ${i.status === 'pass' ? 'bg-green-600' : 'bg-red-600'}`}>{i.status}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(i)}
                          className="inline-flex items-center px-3 py-1.5 text-sm rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <Pencil className="h-4 w-4 mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleViewPDF(i)}
                          disabled={generatingId === i.id}
                          className="inline-flex items-center px-3 py-1.5 text-sm rounded-md text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-50"
                        >
                          <FileDown className="h-4 w-4 mr-1" />
                          {generatingId === i.id ? 'Generating...' : 'PDF'}
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

      {showForm &&
        createPortal(
          <PPEInspectionForm
            staff={staff}
            workers={workers}
            sites={sites}
            editing={editing}
            onClose={() => {
              setShowForm(false);
              setEditing(null);
            }}
            onSaved={() => {
              setShowForm(false);
              setEditing(null);
              fetchAll();
            }}
          />,
          document.body
        )}
    </div>
  );
}

type PPEInspectionFormProps = {
  staff: Staff[];
  workers: Worker[];
  sites: Site[];
  editing: PPEInspection | null;
  onClose: () => void;
  onSaved: () => void;
};

function PPEInspectionForm({ staff, workers, sites, editing, onClose, onSaved }: PPEInspectionFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [createdByName, setCreatedByName] = useState('');
  const [checkDate, setCheckDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [personType, setPersonType] = useState<'staff' | 'worker'>('staff');
  const [staffId, setStaffId] = useState<number | ''>('');
  const [workerId, setWorkerId] = useState<string | ''>('');
  const [siteId, setSiteId] = useState<string | ''>('');
  const [status, setStatus] = useState<'pass' | 'fail'>('pass');
  const DEFAULT_PPE_ITEMS: string[] = [
    'Hard Hat',
    'Ear Defenders',
    'Safety Glasses / Goggles',
    'Dust Mask',
    'High Vis Jacket/Vest',
    'Gloves - Rubber (COSHH)',
    'Gloves - Textile (Manual Handling)',
    'Gloves - Other',
    'Gauntlet - Rubber (COSHH)',
    'Safety Boots',
    'Body Harness (Work at Height)',
  ];
  const [items, setItems] = useState<Item[]>(
    DEFAULT_PPE_ITEMS.map(n => ({ id: crypto.randomUUID(), name: n, rating: 'good' }))
  );
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const prefill = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.user_metadata?.display_name) setCreatedByName(user.user_metadata.display_name);
    };
    prefill();
  }, []);

  useEffect(() => {
    if (!editing) return;
    setCreatedByName(editing.created_by_name || '');
    setCheckDate(editing.check_date);
    setPersonType(editing.staff_id ? 'staff' : 'worker');
    setStaffId(editing.staff_id || '');
    setWorkerId(editing.worker_id || '');
    setSiteId(editing.site_id || '');
    setStatus(editing.status);
    const restored = ((editing.items as any[]) || []).map(it => ({ id: crypto.randomUUID(), ...it }));
    setItems(restored.length ? restored : DEFAULT_PPE_ITEMS.map(n => ({ id: crypto.randomUUID(), name: n, rating: 'good' })));
    setNotes(editing.notes || '');
  }, [editing]);

  const stepLabels = ['Details', 'Items', 'Notes & Summary'];

  const validateStep = (step: number) => {
    setError(null);
    if (step === 1) {
      if (!createdByName || !checkDate) {
        setError('Please provide inspector and date.');
        return false;
      }
      if (personType === 'staff' && !staffId) {
        setError('Select a staff member.');
        return false;
      }
      if (personType === 'worker' && !workerId) {
        setError('Select a worker.');
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
        staff_id: personType === 'staff' ? staffId || null : null,
        worker_id: personType === 'worker' ? workerId || null : null,
        site_id: siteId || null,
        check_date: checkDate,
        status,
        items: items.map(({ id, ...rest }) => rest),
        notes: notes || null,
      };

      if (editing) {
        const { error } = await supabase.from('ppe_inspections').update(payload).eq('id', editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('ppe_inspections').insert([payload]);
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
      <FormHeader title={editing ? 'Edit PPE Inspection' : 'New PPE Inspection'} onClose={onClose} />
      <FormContent>
        <StepIndicator currentStep={currentStep} totalSteps={3} stepLabels={stepLabels} />

        {currentStep === 1 && (
          <div className="space-y-4">
            <TextInput label="Inspector" value={createdByName} onChange={setCreatedByName} required />
            <DateInput label="Inspection Date" value={checkDate} onChange={setCheckDate} required />
            <RadioGroup
              label="Person Type"
              value={personType}
              onChange={v => setPersonType(v as any)}
              options={[
                { label: 'Staff', value: 'staff' },
                { label: 'Worker', value: 'worker' },
              ]}
            />
            {personType === 'staff' ? (
              <Select
                label="Staff"
                value={staffId === '' ? '' : String(staffId)}
                onChange={v => setStaffId(v ? Number(v) : '')}
                options={[{ label: 'Select staff...', value: '' }, ...staff.map(s => ({ label: s.name, value: String(s.id) }))]}
                required
              />
            ) : (
              <Select
                label="Worker"
                value={(workerId as string) || ''}
                onChange={v => setWorkerId(v || '')}
                options={[{ label: 'Select worker...', value: '' }, ...workers.map(w => ({ label: w.full_name || 'Unnamed', value: w.id }))]}
                required
              />
            )}
            <Select
              label="Site (optional)"
              value={(siteId as string) || ''}
              onChange={v => setSiteId(v || '')}
              options={[{ label: 'No site', value: '' }, ...sites.map(s => ({ label: s.name, value: s.id }))]}
            />
            <RadioGroup
              label="Overall Status"
              value={status}
              onChange={v => setStatus(v as any)}
              options={[
                { label: 'Pass', value: 'pass' },
                { label: 'Fail', value: 'fail' },
              ]}
            />
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            {items.map((it) => (
              <div key={it.id} className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end border border-gray-200 dark:border-gray-700 rounded p-3">
                <div className="md:col-span-2">
                  <TextInput label="Item" value={it.name} onChange={(v) => handleItemChange(it.id, { name: v })} required />
                </div>
                <div className="md:col-span-2">
                  <Select
                    label="Condition"
                    value={it.rating || 'good'}
                    onChange={(v) => handleItemChange(it.id, { rating: (v as any) || 'good' })}
                    options={[
                      { label: 'Excellent', value: 'excellent' },
                      { label: 'Good', value: 'good' },
                      { label: 'Average', value: 'average' },
                      { label: 'Poor', value: 'poor' },
                      { label: 'Replace', value: 'replace' },
                      { label: 'N/A', value: 'na' },
                    ]}
                  />
                </div>
                <div className="md:col-span-1">
                  <DateInput label="Date Ordered (if required)" value={it.dateOrdered || ''} onChange={(v) => handleItemChange(it.id, { dateOrdered: v })} />
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
            <button
              onClick={addItem}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </button>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            <TextArea label="Notes" value={notes} onChange={setNotes} rows={4} />
            {error && (
              <div className="mt-2 p-3 text-sm rounded bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300">{error}</div>
            )}
          </div>
        )}

        {error && currentStep !== 3 && (
          <div className="mt-4 p-3 text-sm rounded bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300">{error}</div>
        )}
      </FormContent>

      <FormFooter
        onCancel={onClose}
        onPrevious={handlePrev}
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


