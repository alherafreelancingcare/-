import React, { useState, useEffect } from 'react';
import { Notice } from '../types';
import { StorageService } from '../services/storage';
import { useLanguage } from '../context/LanguageContext';
import { Calendar, Video, Bell, Clock, ExternalLink } from 'lucide-react';

export const NoticesPage: React.FC = () => {
  const { language, t } = useLanguage();
  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    StorageService.getNotices().then(setNotices);
  }, []);

  const routines = [
    {
      course: language === 'bn' ? 'ডিজিটাল মার্কেটিং ও এসইও (ব্যাচ ২৮)' : 'Digital Marketing & SEO (Batch 28)',
      days: language === 'bn' ? 'রবিবার, মঙ্গলবার, বৃহস্পতিবার' : 'Sunday, Tuesday, Thursday',
      time: '08:30 PM - 10:30 PM BST',
      mentor: 'Sajid Al-Mamun',
      platform: 'Zoom Live Interactive',
      link: 'https://zoom.us/j/9876543210'
    },
    {
      course: language === 'bn' ? 'প্রফেশনাল গ্রাফিক ডিজাইন (ব্যাচ ২১)' : 'Professional Graphic Design (Batch 21)',
      days: language === 'bn' ? 'শনিবার, সোমবার, বুধবার' : 'Saturday, Monday, Wednesday',
      time: '07:00 PM - 09:00 PM BST',
      mentor: 'Farzana Haque',
      platform: 'Google Meet',
      link: 'https://meet.google.com/abc-defg-hij'
    },
    {
      course: language === 'bn' ? 'মাইক্রোসফট এক্সেল ও ডেটা অ্যানালাইসিস (ব্যাচ ১৪)' : 'Microsoft Excel & Data Analysis (Batch 14)',
      days: language === 'bn' ? 'শুক্রবার ও শনিবার' : 'Friday & Saturday',
      time: '04:00 PM - 06:30 PM BST',
      mentor: 'Mahmudul Hasan',
      platform: 'Zoom Live Interactive',
      link: 'https://zoom.us/j/1122334455'
    },
    {
      course: language === 'bn' ? 'ইমেইল মার্কেটিং ও কোল্ড আউটরিচ (ব্যাচ ১১)' : 'Email Marketing & Cold Outreach (Batch 11)',
      days: language === 'bn' ? 'সোমবার ও বৃহস্পতিবার' : 'Monday & Thursday',
      time: '09:00 PM - 11:00 PM BST',
      mentor: 'Kabir Hossain',
      platform: 'Google Meet',
      link: 'https://meet.google.com/xyz-uvwx-rst'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex p-3 rounded-2xl bg-blue-50 text-blue-600 mb-1">
          <Calendar className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {t('navNotices')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          {language === 'bn'
            ? 'লাইভ ক্লাস সময়সূচি, জুম লিংক ও আল হেরা ফ্রিল্যান্সিং কেয়ার ইনস্টিটিউটের সর্বশেষ নোটিশ'
            : 'Live batch schedules, meeting credentials, and official institute announcements.'}
        </p>
      </div>

      {/* Routine Grid */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-600" />
          <span>{language === 'bn' ? 'বর্তমান লাইভ ক্লাস রুটিন (BST সময়সূচি)' : 'Live Class Routine (BST Schedule)'}</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {routines.map((r, idx) => (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-sm text-slate-900">{r.course}</h3>
                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded">
                  {r.platform}
                </span>
              </div>

              <div className="space-y-1 text-xs text-slate-600">
                <p><strong>Days:</strong> {r.days}</p>
                <p><strong>Time:</strong> <span className="font-mono text-blue-700 font-bold">{r.time}</span></p>
                <p><strong>Mentor:</strong> {r.mentor}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Class link active 15m before</span>
                <a
                  href={r.link}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Join Classroom</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Official Circulars / Notices */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 pb-4 border-b border-slate-100">
          <Bell className="w-5 h-5 text-amber-500" />
          <span>{language === 'bn' ? 'ইনস্টিটিউট অফিসিয়াল নোটিশ বোর্ড' : 'Official Circulars & Circular Board'}</span>
        </h2>

        <div className="divide-y divide-slate-100">
          {notices.map(notice => (
            <div key={notice.id} className="py-4 space-y-2">
              <div className="flex items-center gap-2">
                {notice.isPinned && (
                  <span className="px-2 py-0.5 bg-rose-100 text-rose-700 font-bold text-[10px] rounded-full uppercase">
                    PINNED
                  </span>
                )}
                <span className="text-xs font-mono text-slate-400">{notice.date}</span>
                <span className="text-xs font-bold uppercase text-blue-700 bg-blue-50 px-2 py-0.2 rounded">
                  {notice.category}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900">
                {language === 'bn' ? notice.titleBn : notice.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {language === 'bn' ? notice.contentBn : notice.content}
              </p>

              {notice.meetingLink && (
                <div className="pt-1">
                  <a
                    href={notice.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800"
                  >
                    <Video className="w-4 h-4" />
                    <span>Click here to access session credentials</span>
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
