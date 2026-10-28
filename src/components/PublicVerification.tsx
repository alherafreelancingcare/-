import React, { useState, useEffect } from 'react';
import { Certificate } from '../types';
import { StorageService } from '../services/storage';
import { useLanguage } from '../context/LanguageContext';
import { CertificateView } from './CertificateView';
import { CheckCircle2, ShieldAlert, Search, Award, Printer, ArrowRight, ShieldCheck } from 'lucide-react';

interface PublicVerificationProps {
  initialCertId?: string;
}

export const PublicVerification: React.FC<PublicVerificationProps> = ({ initialCertId = '' }) => {
  const { language, t } = useLanguage();
  const [certIdInput, setCertIdInput] = useState(initialCertId || 'AHFC-2025-WD-8492');
  const [searchedCert, setSearchedCert] = useState<Certificate | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [viewingCertificate, setViewingCertificate] = useState<Certificate | null>(null);

  useEffect(() => {
    // If URL has ?id=..., auto-search
    const params = new URLSearchParams(window.location.search);
    const idFromUrl = params.get('id');
    if (idFromUrl) {
      setCertIdInput(idFromUrl);
      StorageService.getCertificateByNumber(idFromUrl).then(found => {
        setSearchedCert(found || null);
        setHasSearched(true);
      });
    }
  }, []);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!certIdInput.trim()) return;
    const found = await StorageService.getCertificateByNumber(certIdInput.trim());
    setSearchedCert(found || null);
    setHasSearched(true);
  };

  const sampleIds = ['AHFC-2025-DM-4102', 'AHFC-2025-GD-8492'];

  return (
    <div className="min-h-[80vh] py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex p-3 rounded-2xl bg-blue-50 text-blue-600 mb-1 border border-blue-100">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {t('publicVerificationHeading')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
          {t('publicVerificationSub')}
        </p>
      </div>

      {/* Search Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 mb-8">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={certIdInput}
              onChange={(e) => setCertIdInput(e.target.value)}
              placeholder="e.g. AHFC-2025-WD-8492"
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 text-sm font-mono uppercase focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 tracking-wider"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{t('verifyBtn')}</span>
          </button>
        </form>

        {/* Quick sample chips */}
        <div className="mt-3 flex items-center gap-2 flex-wrap text-xs text-slate-500">
          <span>{language === 'bn' ? 'নমুনা আইডি ক্লিক করে দেখুন:' : 'Try sample IDs:'}</span>
          {sampleIds.map(id => (
            <button
              key={id}
              type="button"
              onClick={async () => {
                setCertIdInput(id);
                const found = await StorageService.getCertificateByNumber(id);
                setSearchedCert(found || null);
                setHasSearched(true);
              }}
              className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-blue-700 font-mono text-[11px] font-semibold cursor-pointer border border-slate-200"
            >
              {id}
            </button>
          ))}
        </div>
      </div>

      {/* Results Section */}
      {hasSearched && (
        <div>
          {searchedCert ? (
            <div className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-emerald-500/30 shadow-lg shadow-emerald-500/5 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                      {t('certVerifiedBadge')}
                    </span>
                    <h2 className="text-lg font-bold text-slate-900 mt-1 font-mono">
                      {searchedCert.certificateNumber}
                    </h2>
                  </div>
                </div>

                <button
                  onClick={() => setViewingCertificate(searchedCert)}
                  className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition self-start sm:self-auto border border-blue-200"
                >
                  <Award className="w-4 h-4" />
                  <span>{t('viewCertificate')}</span>
                </button>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-xs text-slate-500 block mb-0.5">{t('certifiedStudent')}</span>
                  <span className="text-base font-bold text-slate-900">{searchedCert.studentName}</span>
                  <span className="text-xs text-slate-400 block">{searchedCert.studentEmail}</span>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-xs text-slate-500 block mb-0.5">{t('certifiedCourse')}</span>
                  <span className="text-sm font-bold text-slate-900 block">{searchedCert.courseName}</span>
                  <span className="text-xs text-blue-700 font-medium">{searchedCert.courseNameBn}</span>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-xs text-slate-500 block mb-0.5">{t('issueDate')}</span>
                  <span className="text-sm font-bold text-slate-900">{searchedCert.issueDate}</span>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-xs text-slate-500 block mb-0.5">{t('grade')} / Score</span>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded font-extrabold text-sm">
                      {searchedCert.grade}
                    </span>
                    <span className="text-xs text-slate-600 font-bold">
                      ({searchedCert.scorePercentage}%)
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50/60 rounded-xl border border-blue-100 flex items-center justify-between text-xs text-slate-600">
                <span>
                  {language === 'bn' 
                    ? 'প্রদানকারী কর্তৃপক্ষ: আল হেরা ফ্রিল্যান্সিং কেয়ার, ঢাকা, বাংলাদেশ' 
                    : 'Issuing Authority: Al Hera Freelancing Care, Dhaka, Bangladesh'}
                </span>
                <span className="font-semibold text-blue-700">
                  Director: {searchedCert.directorName}
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 border border-rose-200 text-center space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                {language === 'bn' ? 'সার্টিফিকেট পাওয়া যায়নি' : 'Certificate Not Found'}
              </h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                {t('certNotFound')}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Modal for viewing certificate */}
      {viewingCertificate && (
        <CertificateView
          certificate={viewingCertificate}
          onClose={() => setViewingCertificate(null)}
        />
      )}
    </div>
  );
};
