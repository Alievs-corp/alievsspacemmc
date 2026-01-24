import { useState, useEffect } from 'react';
import { api, type Inquiry } from '@/lib/api';
import { useI18n } from '@/contexts/I18nContext';

export function AdminInquiries() {
  const { t } = useI18n();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadInquiries();
  }, []);

  const loadInquiries = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.admin.getInquiries();
      setInquiries(data);
    } catch (error) {
      console.error('Failed to load inquiries:', error);
      setError('Inquiries-ləri yükləmək mümkün olmadı. API endpoint-i yoxdur.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-[#808087]">Loading inquiries...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">{t('admin.inquiries')} {t('admin.management')}</h1>
          <p className="mt-2 text-[#808087]">
            View and manage all contact form submissions from your website.
          </p>
        </div>
        
        <div className="bg-[#13132F] rounded-lg border border-[#546691] p-6">
          <div className="text-center py-8">
            <div className="text-red-400 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">API Connection Error</h3>
            <p className="text-[#808087] mb-4">{error}</p>
            <p className="text-sm text-[#808087]">
              Backend API-də /api/v1/inquiries endpoint-i mövcud deyil. 
              Lütfən backend developer ilə əlaqə saxlayın.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white">{t('admin.inquiries')} {t('admin.management')}</h1>
          <p className="mt-2 text-[#808087]">
            View and manage all contact form submissions from your website.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-[#808087]">
            Total: {inquiries.length} inquiries
          </span>
          <button
            onClick={loadInquiries}
            className="px-4 py-2 bg-[#133FA6] text-white text-sm font-medium rounded-lg hover:bg-[#0f2f78] transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="bg-[#13132F] rounded-lg border border-[#546691] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#546691]">
            <thead className="bg-[#1A1A2E]/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Name / Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Contact Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Project Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Message
                </th>
              </tr>
            </thead>
            <tbody className="bg-[#13132F] divide-y divide-[#546691]">
              {inquiries.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-[#808087]">
                    <div className="flex flex-col items-center justify-center">
                      <svg className="w-12 h-12 text-[#808087] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-[#808087]">{t('admin.inquiries')} {t('admin.loading')}</p>
                      <p className="text-sm text-[#808087] mt-1">{t('admin.manageDescription')}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                inquiries.map((inquiry, index) => (
                  <tr key={inquiry.email || `inquiry-${index}`} className="hover:bg-[#546691]/30">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{inquiry.name}</div>
                      <div className="text-sm text-[#808087]">{inquiry.company || 'No company specified'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm space-y-1">
                        {inquiry.email && (
                          <div className="text-white flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            {inquiry.email}
                          </div>
                        )}
                        {inquiry.phone && (
                          <div className="text-[#808087] flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            {inquiry.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm space-y-1">
                        {inquiry.interest && (
                          <div className="text-white">
                            <span className="font-medium">Interest:</span> {inquiry.interest}
                          </div>
                        )}
                        {inquiry.topic && (
                          <div className="text-[#808087]">
                            <span className="font-medium">Topic:</span> {inquiry.topic}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-[#808087]">
                        {inquiry.message ? (
                          <div className="truncate max-w-xs" title={inquiry.message}>
                            {inquiry.message.length > 100 ? `${inquiry.message.substring(0, 100)}...` : inquiry.message}
                          </div>
                        ) : (
                          <span className="text-[#808087]">No message</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {inquiries.length > 0 && (
        <div className="flex items-center justify-between text-sm text-[#808087]">
          <div>
            Showing {inquiries.length} of {inquiries.length} inquiries
          </div>
        </div>
      )}
    </div>
  );
}