import React from 'react';
import { Certificate } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { Award, CheckCircle, Printer, Share2, X, ExternalLink, ShieldCheck } from 'lucide-react';

interface CertificateViewProps {
  certificate: Certificate;
  onClose: () => void;
}

export const CertificateView: React.FC<CertificateViewProps> = ({ certificate, onClose }) => {
  const { language, t } = useLanguage();

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(certificate.verificationUrl);
    alert(language === 'bn' ? 'সার্টিফিকেট যাচাইকরণ লিংক কপি করা হয়েছে!' : 'Verification link copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="relative bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-300 overflow-hidden my-auto animate-in fade-in zoom-in-95">
        
        {/* Modal Toolbar - Hidden during print */}
        <div className="no-print bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span className="text-sm font-bold">
              {language === 'bn' ? 'অফিসিয়াল কোর্স কমপ্লিশন সার্টিফিকেট' : 'Official Certificate of Completion'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition text-slate-200"
              title="Copy verification link"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{language === 'bn' ? 'লিংক শেয়ার' : 'Share Link'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-xs font-bold rounded-lg flex items-center gap-1.5 transition text-white shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>{t('printCertificate')}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE CERTIFICATE CANVAS */}
        <div className="certificate-print-container p-6 sm:p-12 bg-[#fffdf9] text-slate-800 relative select-none">
          {/* Ornate Double Border */}
          <div className="border-4 border-double border-amber-700/60 p-6 sm:p-10 rounded-xl relative bg-radial from-amber-50/40 via-white to-amber-50/20 shadow-xs">
            
            {/* Corner Ornaments */}
            <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-amber-600"></div>
            <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-amber-600"></div>
            <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-amber-600"></div>
            <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-amber-600"></div>

            {/* Header / Brand */}
            <div className="text-center space-y-2 mb-6">
              <div className="inline-flex items-center justify-center gap-2 mb-1">
                <div className="w-10 h-10 rounded-full bg-blue-900 text-amber-300 flex items-center justify-center font-black text-xl border-2 border-amber-400">
                  AH
                </div>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-blue-950 tracking-wide font-serif uppercase">
                Al Hera Freelancing Care
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-amber-800 tracking-wider">
                আল হেরা ফ্রিল্যান্সিং কেয়ার • ঢাকা, বাংলাদেশ
              </p>
              <div className="flex items-center justify-center gap-3 pt-1">
                <span className="h-px w-16 bg-amber-600"></span>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Certificate of Achievement
                </span>
                <span className="h-px w-16 bg-amber-600"></span>
              </div>
            </div>

            {/* Certificate Body */}
            <div className="text-center space-y-4 my-8">
              <p className="text-xs sm:text-sm text-slate-600 italic">
                This is to officially certify that
              </p>

              <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 py-1 font-serif text-blue-900 border-b border-amber-200/80 inline-block px-8">
                {certificate.studentName}
              </h2>

              <p className="text-xs sm:text-sm text-slate-700 max-w-xl mx-auto leading-relaxed">
                has successfully fulfilled all requirements, practical project evaluations, and final assessments for the professional course:
              </p>

              <div className="py-2">
                <p className="text-lg sm:text-2xl font-extrabold text-slate-900 font-serif">
                  {certificate.courseName}
                </p>
                <p className="text-xs sm:text-sm text-blue-800 font-medium mt-0.5">
                  {certificate.courseNameBn}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-700 pt-2">
                <span className="bg-amber-100 text-amber-900 px-3 py-1 rounded-full border border-amber-300">
                  Grade: <strong className="font-extrabold">{certificate.grade}</strong> ({certificate.scorePercentage}%)
                </span>
                <span className="bg-slate-100 text-slate-800 px-3 py-1 rounded-full border border-slate-300">
                  Issue Date: {certificate.issueDate}
                </span>
              </div>
            </div>

            {/* Footer Signatures & QR Seal */}
            <div className="grid grid-cols-3 items-end pt-8 sm:pt-12 border-t border-amber-300/40 text-center text-xs">
              {/* Instructor */}
              <div className="space-y-1">
                <div className="font-serif italic text-sm text-blue-900 font-bold border-b border-slate-400 pb-1 max-w-[140px] mx-auto">
                  {certificate.instructorName}
                </div>
                <p className="font-bold text-slate-700">Course Lead & Mentor</p>
                <p className="text-[10px] text-slate-500">Al Hera Care</p>
              </div>

              {/* Rosette Official Seal */}
              <div className="flex flex-col items-center justify-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-600 p-1 shadow-md flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-white flex flex-col items-center justify-center text-center p-1 border border-amber-500">
                    <ShieldCheck className="w-6 h-6 text-amber-600" />
                    <span className="text-[8px] font-black uppercase text-amber-900 leading-none mt-0.5">
                      Verified
                    </span>
                    <span className="text-[7px] text-slate-500 font-mono">SEAL</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-slate-600 mt-2 font-bold tracking-wider">
                  {certificate.certificateNumber}
                </span>
              </div>

              {/* Director */}
              <div className="space-y-1">
                <div className="font-serif italic text-sm text-blue-900 font-bold border-b border-slate-400 pb-1 max-w-[140px] mx-auto">
                  {certificate.directorName}
                </div>
                <p className="font-bold text-slate-700">Institute Director</p>
                <p className="text-[10px] text-slate-500">Al Hera Freelancing Care</p>
              </div>
            </div>

            {/* Watermark notice */}
            <div className="mt-6 text-center text-[10px] text-slate-400 font-mono">
              Verification URL: {certificate.verificationUrl}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
