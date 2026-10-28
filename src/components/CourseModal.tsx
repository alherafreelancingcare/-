import React, { useState } from 'react';
import { Course, CourseModule, Lesson } from '../types';
import { useLanguage } from '../context/LanguageContext';
import {
  X, Clock, Award, CheckCircle2, PlayCircle, BookOpen,
  DollarSign, Users, ChevronDown, ChevronUp, ArrowRight, ExternalLink
} from 'lucide-react';

interface CourseModalProps {
  course: Course | null;
  onClose: () => void;
  onEnroll: (courseId: string) => void;
  isEnrolled?: boolean;
}

export const CourseModal: React.FC<CourseModalProps> = ({
  course,
  onClose,
  onEnroll,
  isEnrolled = false
}) => {
  const { language, t } = useLanguage();
  const [activePreviewLesson, setActivePreviewLesson] = useState<Lesson | null>(null);
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    'mod-1': true,
    'mod-dm-1': true,
    'mod-gd-1': true,
    'mod-va-1': true,
  });

  if (!course) return null;

  const toggleModule = (modId: string) => {
    setExpandedModules(prev => ({
      ...prev,
      [modId]: !prev[modId]
    }));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
              {course.batchNumber}
            </span>
            <span className="text-xs font-semibold text-slate-500">
              {language === 'bn' ? course.categoryLabelBn : course.categoryLabel}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Hero details */}
          <div className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
              {language === 'bn' ? course.titleBn : course.title}
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              {language === 'bn' ? course.subtitleBn : course.subtitle}
            </p>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-500 block">{t('duration')}</span>
                <span className="text-sm font-bold text-slate-800">
                  {course.durationWeeks} {t('weeks')} ({course.totalHours} {t('hours')})
                </span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-500 block">{t('courseFee')}</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-base font-extrabold text-blue-700">
                    ৳{course.discountBDT ? course.discountBDT.toLocaleString() : course.feeBDT.toLocaleString()}
                  </span>
                  {course.discountBDT && (
                    <span className="text-xs text-slate-400 line-through">
                      ৳{course.feeBDT.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-500 block">{t('instructor')}</span>
                <span className="text-xs font-bold text-slate-800 truncate block">
                  {course.instructor}
                </span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-500 block">{t('nextBatch')}</span>
                <span className="text-xs font-bold text-emerald-700">
                  {course.nextBatchStart}
                </span>
              </div>
            </div>
          </div>

          {/* Video Preview if selected */}
          {activePreviewLesson && (
            <div className="space-y-2 p-4 bg-slate-900 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-blue-400 flex items-center gap-1.5">
                  <PlayCircle className="w-4 h-4" />
                  <span>{language === 'bn' ? 'ফ্রি ট্রায়াল লেকচার' : 'Free Preview Lecture'}: {language === 'bn' ? activePreviewLesson.titleBn : activePreviewLesson.title}</span>
                </span>
                <button
                  onClick={() => setActivePreviewLesson(null)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  {t('close')}
                </button>
              </div>
              <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
                <iframe
                  src={activePreviewLesson.videoUrl}
                  title={activePreviewLesson.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              {language === 'bn' ? 'কোর্স বিবরণী' : 'Course Overview'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {language === 'bn' ? course.descriptionBn : course.description}
            </p>
          </div>

          {/* Key Features */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              {language === 'bn' ? 'কোর্সের বিশেষ সুবিধাসমূহ' : 'Key Features'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(language === 'bn' ? course.featuresBn : course.features).map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Curriculum / Modules list */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between">
              <span>{language === 'bn' ? 'কোর্স কারিকুলাম ও মডিউল' : 'Curriculum Modules'}</span>
              <span className="text-xs font-normal text-slate-500">
                {course.modules?.length || 0} {language === 'bn' ? 'টি মডিউল' : 'Modules'}
              </span>
            </h3>

            <div className="space-y-2.5">
              {course.modules?.map((mod) => {
                const isOpen = expandedModules[mod.id] ?? false;
                return (
                  <div key={mod.id} className="border border-slate-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => toggleModule(mod.id)}
                      className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-left transition"
                    >
                      <span className="font-semibold text-xs sm:text-sm text-slate-800">
                        {language === 'bn' ? mod.titleBn : mod.title}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-500">
                          {mod.lessons.length} {language === 'bn' ? 'টি লেকচার' : 'Lectures'}
                        </span>
                        {isOpen ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="p-3 bg-white divide-y divide-slate-100">
                        {mod.lessons.map(les => (
                          <div key={les.id} className="py-2.5 flex items-center justify-between text-xs sm:text-sm">
                            <div className="flex items-center gap-2">
                              <BookOpen className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                              <span className="text-slate-800">
                                {language === 'bn' ? les.titleBn : les.title}
                              </span>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="text-slate-400 text-xs flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {les.durationMinutes} {language === 'bn' ? 'মি.' : 'min'}
                              </span>

                              {les.isFreePreview && (
                                <button
                                  onClick={() => setActivePreviewLesson(les)}
                                  className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-0.5 rounded cursor-pointer"
                                >
                                  {language === 'bn' ? 'ফ্রি প্রিভিউ' : 'Free Preview'}
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Prerequisites */}
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs">
            <span className="font-bold">{language === 'bn' ? 'প্রয়োজনীয় যোগ্যতা: ' : 'Prerequisites: '}</span>
            <span>{language === 'bn' ? course.prerequisitesBn : course.prerequisites}</span>
          </div>
        </div>

        {/* Modal Footer CTA */}
        <div className="sticky bottom-0 bg-white/95 backdrop-blur-md px-6 py-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs text-slate-500 block">{t('courseFee')}</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-extrabold text-blue-700">
                ৳{course.discountBDT ? course.discountBDT.toLocaleString() : course.feeBDT.toLocaleString()}
              </span>
              <span className="text-xs text-slate-500 font-normal">
                ({language === 'bn' ? 'এককালীন বা কিস্তিতে পরিশোধযোগ্য' : 'Installment Available'})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              {t('close')}
            </button>

            {isEnrolled ? (
              <span className="px-5 py-2.5 bg-emerald-100 text-emerald-800 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>{language === 'bn' ? 'আপনি এই কোর্সে ভর্তি আছেন' : 'Enrolled'}</span>
              </span>
            ) : (
              <button
                onClick={() => onEnroll(course.id)}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 flex items-center gap-2 transition"
              >
                <span>{t('enrollNow')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
