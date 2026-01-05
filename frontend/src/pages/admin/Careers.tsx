import { useState, useEffect } from 'react';
import { api, type Career, type Employee, type Locale } from '@/lib/api';
import { useI18n } from '@/contexts/I18nContext';
import { Button } from '@/components/ui/Button';

export function AdminCareers() {
  const { locale, supportedLocales } = useI18n();
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
      setError(err instanceof Error ? err.message : 'Failed to load data');
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
    if (!confirm('Are you sure you want to delete this career?')) return;
    try {
      await api.admin.deleteCareer(id);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete career');
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    if (!confirm('Are you sure you want to delete this employee?')) return;
    try {
      await api.admin.deleteEmployee(id);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete employee');
    }
  };

  const handleSubmitCareer = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const payload: Record<Locale, Partial<Career>> = {};
      for (const loc of supportedLocales.map((l) => l.code as Locale)) {
        const requirements = requirementsText[loc]
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
        payload[loc] = {
          ...careerFormData[loc],
          requirements,
        };
      }

      if (editingCareerId) {
        await api.admin.updateCareer(editingCareerId, payload);
      } else {
        await api.admin.createCareer(payload);
      }

      await loadData();
      handleNewCareer();
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
      const payload: Record<Locale, Partial<Employee>> = {};
      for (const loc of supportedLocales.map((l) => l.code as Locale)) {
        payload[loc] = employeeFormData[loc];
      }

      if (editingEmployeeId) {
        await api.admin.updateEmployee(editingEmployeeId, payload);
      } else {
        await api.admin.createEmployee(payload);
      }

      await loadData();
      handleNewEmployee();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save employee');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-[var(--color-muted-foreground)]">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="rounded-md bg-[var(--color-destructive)]/10 p-3 text-sm text-[var(--color-destructive)]">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Careers</h1>
            <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
              Manage vacancies displayed on the Careers page.
            </p>
          </div>
          <Button onClick={handleNewCareer}>New vacancy</Button>
        </div>

        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] overflow-hidden">
          <table className="w-full">
            <thead className="bg-[var(--color-muted)]/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Title</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Location</th>
                <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {careers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-sm text-[var(--color-muted-foreground)]">
                    No careers yet. Click "New vacancy" to create one.
                  </td>
                </tr>
              ) : (
                careers.map((career) => (
                  <tr key={career.id} className="hover:bg-[var(--color-accent)]/50">
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          career.status === 'Open'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {career.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">{career.title}</td>
                    <td className="px-4 py-3 text-sm">{career.location}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEditCareer(career)}>
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteCareer(career.id)}
                          className="text-[var(--color-destructive)]"
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingCareerId ? 'Edit vacancy' : 'Create vacancy'}
          </h2>
          <form onSubmit={handleSubmitCareer} className="space-y-6">
            {supportedLocales.map((loc) => {
              const locCode = loc.code as Locale;
              return (
                <div key={locCode} className="space-y-4 p-4 border border-[var(--color-border)] rounded-lg">
                  <h3 className="font-medium">{loc.label}</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium mb-1">Title</label>
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
                        className="w-full rounded-md border border-[var(--color-input)] bg-[var(--color-background)] px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Type</label>
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
                        className="w-full rounded-md border border-[var(--color-input)] bg-[var(--color-background)] px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Location</label>
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
                        className="w-full rounded-md border border-[var(--color-input)] bg-[var(--color-background)] px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Status</label>
                      <select
                        value={careerFormData[locCode].status || 'Open'}
                        onChange={(e) =>
                          setCareerFormData({
                            ...careerFormData,
                            [locCode]: { ...careerFormData[locCode], status: e.target.value },
                          })
                        }
                        className="w-full rounded-md border border-[var(--color-input)] bg-[var(--color-background)] px-3 py-2 text-sm"
                      >
                        <option value="Open">Open</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1">Description</label>
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
                        className="w-full rounded-md border border-[var(--color-input)] bg-[var(--color-background)] px-3 py-2 text-sm"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1">
                        Requirements (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={requirementsText[locCode]}
                        onChange={(e) =>
                          setRequirementsText({ ...requirementsText, [locCode]: e.target.value })
                        }
                        placeholder="HTML/CSS/JS, UI sense"
                        className="w-full rounded-md border border-[var(--color-input)] bg-[var(--color-background)] px-3 py-2 text-sm"
                      />
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="flex gap-3">
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving...' : 'Save'}
              </Button>
              <Button type="button" variant="outline" onClick={handleNewCareer}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Team</h1>
            <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
              Add team members with photo, role, and experience.
            </p>
          </div>
          <Button onClick={handleNewEmployee}>New member</Button>
        </div>

        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] overflow-hidden">
          <table className="w-full">
            <thead className="bg-[var(--color-muted)]/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Role</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Experience</th>
                <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {employees.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-sm text-[var(--color-muted-foreground)]">
                    No employees yet. Click "New member" to create one.
                  </td>
                </tr>
              ) : (
                employees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-[var(--color-accent)]/50">
                    <td className="px-4 py-3 text-sm font-medium">{employee.name}</td>
                    <td className="px-4 py-3 text-sm">{employee.role}</td>
                    <td className="px-4 py-3 text-sm">{employee.experience}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEditEmployee(employee)}>
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteEmployee(employee.id)}
                          className="text-[var(--color-destructive)]"
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingEmployeeId ? 'Edit member' : 'Create member'}
          </h2>
          <form onSubmit={handleSubmitEmployee} className="space-y-6">
            {supportedLocales.map((loc) => {
              const locCode = loc.code as Locale;
              return (
                <div key={locCode} className="space-y-4 p-4 border border-[var(--color-border)] rounded-lg">
                  <h3 className="font-medium">{loc.label}</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium mb-1">Full name</label>
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
                        className="w-full rounded-md border border-[var(--color-input)] bg-[var(--color-background)] px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Role</label>
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
                        className="w-full rounded-md border border-[var(--color-input)] bg-[var(--color-background)] px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Experience (years)</label>
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
                        className="w-full rounded-md border border-[var(--color-input)] bg-[var(--color-background)] px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Photo URL</label>
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
                        className="w-full rounded-md border border-[var(--color-input)] bg-[var(--color-background)] px-3 py-2 text-sm"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1">Bio</label>
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
                        className="w-full rounded-md border border-[var(--color-input)] bg-[var(--color-background)] px-3 py-2 text-sm"
                      />
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="flex gap-3">
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving...' : 'Save'}
              </Button>
              <Button type="button" variant="outline" onClick={handleNewEmployee}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

