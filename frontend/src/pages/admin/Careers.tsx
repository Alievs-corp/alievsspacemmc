import { useState, useEffect } from 'react';
import { api, type Career, type Employee, type Locale } from '@/lib/api';
import { useI18n } from '@/contexts/I18nContext';
import { Button } from '@/components/ui/Button';
import { LocaleTabs } from '@/components/admin/LocaleTabs';
import { cn } from '@/lib/utils';
import { CheckCircle2 } from 'lucide-react';

export function AdminCareers() {
  const { locale, supportedLocales, t } = useI18n();
  const [careers, setCareers] = useState<Career[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCareerId, setEditingCareerId] = useState<string | null>(null);
  const [editingEmployeeId, setEditingEmployeeId] = useState<string | null>(null);
  const [careerFormData, setCareerFormData] = useState<Record<Locale, Partial<Career>>>({
    en: { title: '', type: '', location: '', desc: '', requirements: [], status: 'Open' },
    az: { title: '', type: '', location: '', desc: '', requirements: [], status: 'Open' },
    ru: { title: '', type: '', location: '', desc: '', requirements: [], status: 'Open' },
  });
  const [employeeFormData, setEmployeeFormData] = useState<Record<Locale, Partial<Employee>>>({
    en: { name: '', role: '', experience: '', photo: '', bio: '' },
    az: { name: '', role: '', experience: '', photo: '', bio: '' },
    ru: { name: '', role: '', experience: '', photo: '', bio: '' },
  });
  const [requirementsText, setRequirementsText] = useState<Record<Locale, string>>({
    en: '',
    az: '',
    ru: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [careerLoc, setCareerLoc] = useState<Locale>('en');
  const [employeeLoc, setEmployeeLoc] = useState<Locale>('en');
  const [careerSaved, setCareerSaved] = useState(false);
  const [employeeSaved, setEmployeeSaved] = useState(false);

  useEffect(() => {
    loadData();
  }, [locale]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [careersData, employeesData] = await Promise.all([
        api.getCareers(locale),
        api.getEmployees(locale),
      ]);
      setCareers(careersData);
      setEmployees(employeesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('admin.failedToLoad'));
    } finally {
      setLoading(false);
    }
  };

  const handleEditCareer = (career: Career) => {
    setEditingCareerId(career.id);
    const loadAllLocales = async () => {
      const locales: Locale[] = ['en', 'az', 'ru'];
      const data: Record<Locale, Partial<Career>> = {
        en: {},
        az: {},
        ru: {},
      };
      const reqs: Record<Locale, string> = { en: '', az: '', ru: '' };

      for (const loc of locales) {
        try {
          const c = await api.getCareer(career.id, loc);
          if (c) {
            data[loc] = c;
            reqs[loc] = (c.requirements || []).join(', ');
          }
        } catch {
          data[loc] = { title: '', type: '', location: '', desc: '', requirements: [], status: 'Open' };
        }
      }

      setCareerFormData(data);
      setRequirementsText(reqs);
    };
    loadAllLocales();
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployeeId(employee.id);
    const loadAllLocales = async () => {
      const locales: Locale[] = ['en', 'az', 'ru'];
      const data: Record<Locale, Partial<Employee>> = {
        en: {},
        az: {},
        ru: {},
      };

      for (const loc of locales) {
        try {
          const e = await api.getEmployee(employee.id, loc);
          if (e) {
            data[loc] = e;
          }
        } catch {
          data[loc] = { name: '', role: '', experience: '', photo: '', bio: '' };
        }
      }

      setEmployeeFormData(data);
    };
    loadAllLocales();
  };

  const handleNewCareer = () => {
    setEditingCareerId(null);
    setCareerFormData({
      en: { title: '', type: '', location: '', desc: '', requirements: [], status: 'Open' },
      az: { title: '', type: '', location: '', desc: '', requirements: [], status: 'Open' },
      ru: { title: '', type: '', location: '', desc: '', requirements: [], status: 'Open' },
    });
    setRequirementsText({ en: '', az: '', ru: '' });
  };

  const handleNewEmployee = () => {
    setEditingEmployeeId(null);
    setEmployeeFormData({
      en: { name: '', role: '', experience: '', photo: '', bio: '' },
      az: { name: '', role: '', experience: '', photo: '', bio: '' },
      ru: { name: '', role: '', experience: '', photo: '', bio: '' },
    });
  };

  const handleDeleteCareer = async (id: string) => {
    if (!confirm(t('admin.confirmDelete'))) return;
    try {
      await api.admin.deleteCareer(id);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete career');
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    if (!confirm(t('admin.confirmDelete'))) return;
    try {
      await api.admin.deleteEmployee(id);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('admin.failedToDelete'));
    }
  };

  const handleSubmitCareer = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      for (const loc of supportedLocales.map((l) => l.code as Locale)) {
        const requirements = requirementsText[loc]
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);

        const payload: Partial<Career> = {
          ...careerFormData[loc],
          requirements,
        };

        if (editingCareerId) {
          await api.admin.updateCareer(editingCareerId, loc, payload);
        } else {
          await api.admin.createCareer(loc, payload);
        }
      }

      await loadData();
      handleNewCareer();
      setCareerSaved(true);
      setTimeout(() => setCareerSaved(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save career');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      for (const loc of supportedLocales.map((l) => l.code as Locale)) {
        const payload: Partial<Employee> = employeeFormData[loc];

        if (editingEmployeeId) {
          await api.admin.updateEmployee(editingEmployeeId, loc, payload);
        } else {
          await api.admin.createEmployee(loc, payload);
        }
      }

      await loadData();
      handleNewEmployee();
      setEmployeeSaved(true);
      setTimeout(() => setEmployeeSaved(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('admin.failedToSave'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-text-subtle">{t('admin.loading')}</div>;
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="rounded-md bg-red-900/20 border border-red-800 p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-text">{t('admin.careers')}</h1>
            <p className="mt-2 text-sm text-text-subtle">
              {t('admin.manageDescription')}
            </p>
          </div>
          <Button onClick={handleNewCareer}>{t('admin.newVacancy')}</Button>
        </div>

        <div className="rounded-lg border border-surface-3 bg-surface overflow-hidden">
          <table className="w-full">
            <thead className="bg-surface-2/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-white">{t('admin.status')}</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-white">{t('admin.title')}</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-white">{t('admin.location')}</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-white">{t('admin.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-3">
              {careers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-sm text-text-subtle">
                    {t('admin.noCareersYet')}
                  </td>
                </tr>
              ) : (
                careers.map((career) => (
                  <tr key={career.id} className="hover:bg-surface-3/30">
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          career.status === 'Open'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {career.status === 'Open' ? t('admin.open') : t('admin.closed')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">{career.title}</td>
                    <td className="px-4 py-3 text-sm">{career.location}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEditCareer(career)}>
                          {t('admin.edit')}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteCareer(career.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          {t('admin.delete')}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="rounded-lg border border-surface-3 bg-surface p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-lg font-semibold text-text">
              {editingCareerId ? t('admin.editVacancy') : t('admin.createVacancy')}
            </h2>
            <LocaleTabs locales={supportedLocales} active={careerLoc} onChange={(c) => setCareerLoc(c as Locale)} />
          </div>
          <form onSubmit={handleSubmitCareer} className="space-y-6">
            {supportedLocales.map((loc) => {
              const locCode = loc.code as Locale;
              return (
                <div key={locCode} className={cn('space-y-4', locCode !== careerLoc && 'hidden')}>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-white">{t('admin.title')}</label>
                      <input
                        type="text"
                        value={careerFormData[locCode].title || ''}
                        onChange={(e) =>
                          setCareerFormData({
                            ...careerFormData,
                            [locCode]: { ...careerFormData[locCode], title: e.target.value },
                          })
                        }
                        placeholder="Front-End Developer"
                        className="w-full rounded-md border border-surface-3 bg-surface text-white placeholder-text-subtle focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-white">{t('admin.type')}</label>
                      <input
                        type="text"
                        value={careerFormData[locCode].type || ''}
                        onChange={(e) =>
                          setCareerFormData({
                            ...careerFormData,
                            [locCode]: { ...careerFormData[locCode], type: e.target.value },
                          })
                        }
                        placeholder="Full-time"
                        className="w-full rounded-md border border-surface-3 bg-surface text-white placeholder-text-subtle focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-white">Location</label>
                      <input
                        type="text"
                        value={careerFormData[locCode].location || ''}
                        onChange={(e) =>
                          setCareerFormData({
                            ...careerFormData,
                            [locCode]: { ...careerFormData[locCode], location: e.target.value },
                          })
                        }
                        placeholder="Baku / Hybrid"
                        className="w-full rounded-md border border-surface-3 bg-surface text-white placeholder-text-subtle focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-white">{t('admin.status')}</label>
                      <select
                        value={careerFormData[locCode].status || 'Open'}
                        onChange={(e) =>
                          setCareerFormData({
                            ...careerFormData,
                            [locCode]: { ...careerFormData[locCode], status: e.target.value },
                          })
                        }
                        className="w-full rounded-md border border-surface-3 bg-surface text-white placeholder-text-subtle focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary px-3 py-2 text-sm"
                      >
                        <option value="Open">{t('admin.open')}</option>
                        <option value="Closed">{t('admin.closed')}</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1 text-white">{t('admin.description')}</label>
                      <textarea
                        value={careerFormData[locCode].desc || ''}
                        onChange={(e) =>
                          setCareerFormData({
                            ...careerFormData,
                            [locCode]: { ...careerFormData[locCode], desc: e.target.value },
                          })
                        }
                        placeholder="Short role description"
                        rows={3}
                        className="w-full rounded-md border border-surface-3 bg-surface text-white placeholder-text-subtle focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary px-3 py-2 text-sm"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1 text-white">
                        {t('admin.requirements')} ({t('admin.tagsPlaceholder')})
                      </label>
                      <input
                        type="text"
                        value={requirementsText[locCode]}
                        onChange={(e) =>
                          setRequirementsText({ ...requirementsText, [locCode]: e.target.value })
                        }
                        placeholder="HTML/CSS/JS, UI sense"
                        className="w-full rounded-md border border-surface-3 bg-surface text-white placeholder-text-subtle focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary px-3 py-2 text-sm"
                      />
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="flex items-center gap-3">
              <Button type="submit" disabled={saving}>
                {saving ? t('admin.saving') : t('admin.save')}
              </Button>
              <Button type="button" variant="outline" onClick={handleNewCareer}>
                {t('admin.cancel')}
              </Button>
              {careerSaved && (
                <span className="inline-flex items-center gap-1.5 text-sm text-success">
                  <CheckCircle2 className="h-4 w-4" /> {t('admin.saved', 'Saved')}
                </span>
              )}
            </div>
          </form>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-text">{t('admin.team')}</h1>
            <p className="mt-2 text-sm text-text-subtle">
              {t('admin.teamDescription')}
            </p>
          </div>
          <Button onClick={handleNewEmployee}>{t('admin.newMember')}</Button>
        </div>

        <div className="rounded-lg border border-surface-3 bg-surface overflow-hidden">
          <table className="w-full">
            <thead className="bg-surface-2/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-white">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-white">Role</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-white">Experience</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-white">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-3">
              {employees.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-sm text-text-subtle">
                    {t('admin.noEmployeesYet')}
                  </td>
                </tr>
              ) : (
                employees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-surface-3/30">
                    <td className="px-4 py-3 text-sm font-medium">{employee.name}</td>
                    <td className="px-4 py-3 text-sm">{employee.role}</td>
                    <td className="px-4 py-3 text-sm">{employee.experience}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEditEmployee(employee)}>
                          {t('admin.edit')}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteEmployee(employee.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          {t('admin.delete')}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="rounded-lg border border-surface-3 bg-surface p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-lg font-semibold text-text">
              {editingEmployeeId ? t('admin.editMember') : t('admin.createMember')}
            </h2>
            <LocaleTabs locales={supportedLocales} active={employeeLoc} onChange={(c) => setEmployeeLoc(c as Locale)} />
          </div>
          <form onSubmit={handleSubmitEmployee} className="space-y-6">
            {supportedLocales.map((loc) => {
              const locCode = loc.code as Locale;
              return (
                <div key={locCode} className={cn('space-y-4', locCode !== employeeLoc && 'hidden')}>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-white">Full name</label>
                      <input
                        type="text"
                        value={employeeFormData[locCode].name || ''}
                        onChange={(e) =>
                          setEmployeeFormData({
                            ...employeeFormData,
                            [locCode]: { ...employeeFormData[locCode], name: e.target.value },
                          })
                        }
                        placeholder="Samira Aliyeva"
                        className="w-full rounded-md border border-surface-3 bg-surface text-white placeholder-text-subtle focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-white">{t('admin.role')}</label>
                      <input
                        type="text"
                        value={employeeFormData[locCode].role || ''}
                        onChange={(e) =>
                          setEmployeeFormData({
                            ...employeeFormData,
                            [locCode]: { ...employeeFormData[locCode], role: e.target.value },
                          })
                        }
                        placeholder="Project Manager"
                        className="w-full rounded-md border border-surface-3 bg-surface text-white placeholder-text-subtle focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-white">Experience (years)</label>
                      <input
                        type="text"
                        value={employeeFormData[locCode].experience || ''}
                        onChange={(e) =>
                          setEmployeeFormData({
                            ...employeeFormData,
                            [locCode]: { ...employeeFormData[locCode], experience: e.target.value },
                          })
                        }
                        placeholder="5+ years"
                        className="w-full rounded-md border border-surface-3 bg-surface text-white placeholder-text-subtle focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-white">{t('admin.photoUrl')}</label>
                      <input
                        type="url"
                        value={employeeFormData[locCode].photo || ''}
                        onChange={(e) =>
                          setEmployeeFormData({
                            ...employeeFormData,
                            [locCode]: { ...employeeFormData[locCode], photo: e.target.value },
                          })
                        }
                        placeholder="https://..."
                        className="w-full rounded-md border border-surface-3 bg-surface text-white placeholder-text-subtle focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary px-3 py-2 text-sm"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1 text-white">Bio</label>
                      <textarea
                        value={employeeFormData[locCode].bio || ''}
                        onChange={(e) =>
                          setEmployeeFormData({
                            ...employeeFormData,
                            [locCode]: { ...employeeFormData[locCode], bio: e.target.value },
                          })
                        }
                        placeholder="Short bio"
                        rows={3}
                        className="w-full rounded-md border border-surface-3 bg-surface text-white placeholder-text-subtle focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary px-3 py-2 text-sm"
                      />
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="flex items-center gap-3">
              <Button type="submit" disabled={saving}>
                {saving ? t('admin.saving') : t('admin.save')}
              </Button>
              <Button type="button" variant="outline" onClick={handleNewEmployee}>
                {t('admin.cancel')}
              </Button>
              {employeeSaved && (
                <span className="inline-flex items-center gap-1.5 text-sm text-success">
                  <CheckCircle2 className="h-4 w-4" /> {t('admin.saved', 'Saved')}
                </span>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

