import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, Plus, FileDown, Pencil, AlertTriangle } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import type { SiteInspection } from '../../../types/database';
import { FormContainer, FormHeader, FormContent, FormFooter, StepIndicator, TextInput, DateInput, Select, TextArea, RadioGroup } from '../../../utils/form';

type Site = { id: string; name: string };
type Project = { id: string; name: string };

type Props = { onBack: () => void };
type Item = { id: string; name: string; status?: 'pass' | 'fail' | 'na'; notes?: string };
const newItem = (): Item => ({ id: crypto.randomUUID(), name: '', status: 'pass', notes: '' });

export function HSSiteInspections({ onBack }: Props) {
  const [sites, setSites] = useState<Site[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [rows, setRows] = useState<SiteInspection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState<null | { site: Site }>(null);
  const [editing, setEditing] = useState<SiteInspection | null>(null);
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [{ data: s, error: sErr }, { data: p, error: pErr }, { data: insp, error: iErr }] = await Promise.all([
        supabase.from('sites').select('id,name').order('name'),
        supabase.from('projects').select('id,name').order('name'),
        supabase.from('site_inspections').select('*').order('check_date', { ascending: false }),
      ]);
      if (sErr || pErr || iErr) throw sErr || pErr || iErr;
      setSites(s || []);
      setProjects(p || []);
      setRows(insp || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load site inspections');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void fetchAll(); }, []);

  const handleViewPDF = async (row: SiteInspection) => {
    try {
      setPdfError(null);
      setGeneratingId(row.id);
      const { jsPDF } = await import('jspdf');
      await import('jspdf-autotable');
      const doc = new jsPDF();
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('Site Inspection', 14, 18);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const site = sites.find(x => x.id === row.site_id);
      const details: Record<string, string> = {
        'Inspector': row.created_by_name || '',
        'Date': new Date(row.check_date).toLocaleDateString(),
        'Site': site?.name || '',
        'Status': row.status,
      };
      let y = 26;
      Object.entries(details).forEach(([k, v]) => { doc.text(`${k}: ${v || '-'}`, 14, y); y += 6; });
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
          Back to Health & Safety
        </button>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Site Inspections</h2>
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
      ) : sites.length === 0 ? (
        <div className="flex items-center justify-center h-48">
          <p className="text-gray-500 dark:text-gray-400">No sites</p>
        </div>
      ) : (
        <div className="space-y-6">
          {sites.map(s => {
            const sRows = rows.filter(r => r.site_id === s.id);
            return (
              <div key={s.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">{s.name}</div>
                  <button onClick={() => { setEditing(null); setShowForm({ site: s }); }} className="inline-flex items-center px-3 py-1.5 text-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                    <Plus className="h-4 w-4 mr-1" /> New Inspection
                  </button>
                </div>
                {sRows.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Date</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {sRows.map(r => (
                          <tr key={r.id}>
                            <td className="px-4 py-3 text-sm">{new Date(r.check_date).toLocaleDateString()}</td>
                            <td className="px-4 py-3 text-sm"><span className={`px-2 py-1 rounded text-white ${r.status === 'pass' ? 'bg-green-600' : 'bg-red-600'}`}>{r.status}</span></td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex justify-end gap-2">
                                <button onClick={() => { setEditing(r); setShowForm({ site: s }); }} className="inline-flex items-center px-3 py-1.5 text-sm rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
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
        <SiteInspectionForm
          site={showForm.site}
          projects={projects}
          editing={editing}
          onClose={() => { setShowForm(null); setEditing(null); }}
          onSaved={() => { setShowForm(null); setEditing(null); void fetchAll(); }}
        />,
        document.body
      )}
    </div>
  );
}

type FormProps = { site: Site; projects: Project[]; editing: SiteInspection | null; onClose: () => void; onSaved: () => void };

function SiteInspectionForm({ site, projects, editing, onClose, onSaved }: FormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [createdByName, setCreatedByName] = useState('');
  const [checkDate, setCheckDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [projectId, setProjectId] = useState<string | ''>('');
  const [status, setStatus] = useState<'pass' | 'fail'>('pass');
  const defaultNames: string[] = [
    // Hazard groups from HS047
    'Access & Egress (general site)',
    'Access & Egress (place of work)',
    'Tools and Equipment',
    'Personal Protective Equipment',
    'Housekeeping',
    'Dust Control',
    'Hazardous Substances',
    'Adjacent Work Activities',
    'Manual Handling Aids',
    'Toolbox Talk Delivered',
    'PAT Testing Up to Date',
    'Other Hazards (1)',
    'Other Hazards (2)',
    'Other Hazards (3)',
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
    setProjectId(editing.project_id || '');
    setStatus(editing.status);
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
        site_id: site.id,
        project_id: projectId || null,
        check_date: checkDate,
        status,
        items: items.map(({ id, ...rest }) => rest),
        notes: notes || null,
      };
      if (editing) {
        const { error } = await supabase.from('site_inspections').update(payload).eq('id', editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('site_inspections').insert([payload]);
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
      <FormHeader title={`Site Inspection — ${site.name}`} onClose={onClose} />
      <FormContent>
        <StepIndicator currentStep={currentStep} totalSteps={3} stepLabels={stepLabels} />

        {currentStep === 1 && (
          <div className="space-y-4">
            <TextInput label="Inspector" value={createdByName} onChange={setCreatedByName} required />
            <DateInput label="Inspection Date" value={checkDate} onChange={setCheckDate} required />
            <Select
              label="Project (optional)"
              value={projectId || ''}
              onChange={v => setProjectId(v || '')}
              options={[{ label: 'No project', value: '' }, ...projects.map(p => ({ label: p.name, value: p.id }))]}
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
            <button onClick={() => setItems(prev => [...prev, newItem()])} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
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


