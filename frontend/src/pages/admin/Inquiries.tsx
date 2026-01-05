import { useState, useEffect } from 'react';
import { api, type Inquiry } from '@/lib/api';
import { Button } from '@/components/ui/Button';

export function AdminInquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiryId, setSelectedInquiryId] = useState('');
  const [status, setStatus] = useState('New');
  const [error, setError] = useState('');

  useEffect(() => {
    loadInquiries();
  }, []);

  const loadInquiries = async () => {
    try {
      setLoading(true);
      const data = await api.admin.getInquiries();
      setInquiries(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(inquiries, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'inquiries.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = async () => {
    if (!confirm('Are you sure you want to clear all inquiries? This cannot be undone.')) return;
    try {
      await api.admin.deleteAllInquiries();
      await loadInquiries();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear inquiries');
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedInquiryId) {
      setError('Please select an inquiry first');
      return;
    }
    try {
      await api.admin.updateInquiryStatus(selectedInquiryId, status);
      await loadInquiries();
      setSelectedInquiryId('');
      setStatus('New');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update inquiry status');
    }
  };

  if (loading) {
    return <div className="text-[var(--color-muted-foreground)]">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Inquiries</h1>
          <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
            Requests submitted from the Contact page.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            Export JSON
          </Button>
          <Button variant="outline" onClick={handleClear}>
            Clear inquiries
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-[var(--color-destructive)]/10 p-3 text-sm text-[var(--color-destructive)]">
          {error}
        </div>
      )}

      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] overflow-hidden">
        {inquiries.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-[var(--color-muted-foreground)]">
            No inquiries yet. Submit one from the public Contact page.
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-[var(--color-muted)]/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Contact</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Interest</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Topic</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium">ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {inquiries.map((inquiry) => (
                <tr
                  key={inquiry.id}
                  className="hover:bg-[var(--color-accent)]/50 cursor-pointer"
                  onClick={() => setSelectedInquiryId(inquiry.id)}
                >
                  <td className="px-4 py-3 text-sm">
                    {new Date(inquiry.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium">{inquiry.name}</td>
                  <td className="px-4 py-3 text-sm">
                    {inquiry.email && <div>{inquiry.email}</div>}
                    {inquiry.phone && <div>{inquiry.phone}</div>}
                  </td>
                  <td className="px-4 py-3 text-sm">{inquiry.interest || '-'}</td>
                  <td className="px-4 py-3 text-sm">{inquiry.topic || '-'}</td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        inquiry.status === 'New'
                          ? 'bg-blue-100 text-blue-800'
                          : inquiry.status === 'In Progress'
                          ? 'bg-yellow-100 text-yellow-800'
                          : inquiry.status === 'Contacted'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {inquiry.status || 'New'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-mono text-xs">{inquiry.id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {inquiries.length > 0 && (
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-6">
          <h2 className="text-xl font-semibold mb-4">Update status</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-1">Inquiry ID</label>
              <input
                type="text"
                value={selectedInquiryId}
                onChange={(e) => setSelectedInquiryId(e.target.value)}
                placeholder="Select from table..."
                className="w-full rounded-md border border-[var(--color-input)] bg-[var(--color-background)] px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-md border border-[var(--color-input)] bg-[var(--color-background)] px-3 py-2 text-sm"
              >
                <option value="New">New</option>
                <option value="In Progress">In Progress</option>
                <option value="Contacted">Contacted</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>
          <div className="mt-4">
            <Button onClick={handleUpdateStatus}>Update</Button>
          </div>
        </div>
      )}
    </div>
  );
}

