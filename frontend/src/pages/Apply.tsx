import { useLocation } from 'react-router-dom';
import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import Container from '../components/ui/Container';

const Apply = () => {
  const location = useLocation();
  const [position, setPosition] = useState('');
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    profileUrl: string;
    message: string;
    resume: File | null;
  }>({
    name: '',
    email: '',
    profileUrl: '',
    message: '',
    resume: null,
  });
  type PositionKey = 'frontend-developer' | 'backend-developer' | 'ui-ux-designer';
  
  const positionTitles: Record<PositionKey, string> = {
    'frontend-developer': 'Frontend Developer',
    'backend-developer': 'Backend Developer', 
    'ui-ux-designer': 'UX/UI Designer'
  };

  const fullPositionTitles: Record<PositionKey, string> = {
    'frontend-developer': 'Frontend Developer',
    'backend-developer': 'Backend Developer',
    'ui-ux-designer': 'UX/UI Designer'
  };

  // URL'den position parametresini al
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const positionFromURL = queryParams.get('position') as PositionKey | null;
    
    if (positionFromURL && positionFromURL in positionTitles) {
      setPosition(positionFromURL);
      
      setFormData(prev => ({
        ...prev,
        position: positionTitles[positionFromURL]
      }));
    }
  }, [location.search]);

  // Position'a göre başlık belirle
  const getPositionTitle = () => {
    if (position && position in fullPositionTitles) {
      return fullPositionTitles[position as PositionKey];
    }
    return 'Position';
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Form submission logic
    console.log('Application submitted:', { ...formData, position });
  };

  return (
    <div className="mt-[60px] flex flex-col justify-center items-center">
      <Container className="w-full">
        <div className="max-w-[800px] mx-auto">
          {/* Başlık - Position'a göre değişecek */}
          <div className="mb-10 text-center">
            <h2 className="font-inter text-[26px] md:text-[38px] font-bold text-white mb-4">
              Apply for {getPositionTitle()}
            </h2>
            <p className="font-inter text-[13px] md:text-[18px] text-[#C5C5C5]">
              We review every application manually. No automated filters.
            </p>
          </div>

          {/* Custom application form per request */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              {/* Row: Full Name | Upload CV */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="font-inter text-white text-[13px] mb-2 block">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Your full name"
                    className="w-full bg-[#0F0F23] border border-[#808087] rounded-[10px] px-4 py-3 font-inter text-white placeholder:text-[#C5C5C5]/50 focus:outline-none focus:border-[#133FA6] transition-colors duration-300"
                  />
                </div>
                <div>
                  <label className="font-inter text-white text-[13px] mb-2 block">
                    Upload CV *
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      name="resume"
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setFormData(prev => ({
                          ...prev,
                          resume: e.target.files?.[0] ?? null,
                        }))
                      }
                      required
                      accept=".pdf,.doc,.docx"
                      aria-label="Upload CV"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="w-full bg-[#0F0F23] border border-[#808087] rounded-[10px] px-4 py-3 font-inter text-white focus:outline-none transition-colors duration-300">
                      {formData.resume ? (
                        <span className="text-white/90">Selected: {formData.resume.name}</span>
                      ) : (
                        <span className="text-[#C5C5C5]/60">Upload here</span>
                      )}
                    </div>
                  </div>
                  <p className="font-inter text-[#C5C5C5] text-[13px] mt-2">
                    Upload CV (PDF, max 10MB)
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="font-inter text-white text-[13px] mb-2 block">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="your.email@example.com"
                    className="w-full bg-[#0F0F23] border border-[#808087] rounded-[10px] px-4 py-3 font-inter text-white placeholder:text-[#C5C5C5]/50 focus:outline-none focus:border-[#133FA6] transition-colors duration-300"
                  />
                </div>
                <div>
                  <label className="font-inter text-white text-[13px] mb-2 block">
                    Portfolio / GitHub / LinkedIn
                  </label>
                  <input
                    type="url"
                    name="profileUrl"
                    value={formData.profileUrl}
                    onChange={handleInputChange}
                    placeholder="https:// ..."
                    className="w-full bg-[#0F0F23] border border-[#808087] rounded-[10px] px-4 py-3 font-inter text-white placeholder:text-[#C5C5C5]/50 focus:outline-none focus:border-[#133FA6] transition-colors duration-300"
                  />
                </div>
              </div>

              {/* Short Message */}
              <div>
                <label className="font-inter text-white text-[13px] mb-2 block">
                  Short Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Brief note about your experience or motivation"
                  className="w-full bg-[#0F0F23] border border-[#808087] rounded-[10px] px-4 py-3 font-inter text-white placeholder:text-[#C5C5C5]/50 focus:outline-none focus:border-[#133FA6] transition-colors duration-300"
                />
              </div>
            </div>

            {/* Submit Button & Note */}
            <div className="flex flex-col items-end gap-2 pt-4 border-t border-white/20">
              <button
                type="submit"
                className="border-b border-white bg-[#133FA6] hover:bg-[#1a4cc0] text-white font-inter font-semibold py-3 px-8 rounded-[6.45px] transition-colors duration-300 cursor-pointer text-[16px] whitespace-nowrap"
              >
                Submit Application
              </button>
              <p className="font-inter text-[#C5C5C5] text-[14px] text-right">
                We'll review your application and contact you within 3-5 business days.
              </p>
            </div>
          </form>
        </div>
      </Container>
    </div>
  );
}

export default Apply;