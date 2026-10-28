import { Course, Exam, Notice, SiteSettings } from '../types';

export const INITIAL_COURSES: Course[] = [
  {
    id: 'course-digital-marketing',
    title: 'Advanced Digital Marketing & Social Media Strategy',
    titleBn: 'অ্যাডভান্সড ডিজিটাল মার্কেটিং ও সোশ্যাল মিডিয়া স্ট্র্যাটেজি',
    subtitle: 'Meta Ads, Google Search Ads, On-page/Off-page SEO, and Global Client Acquisition',
    subtitleBn: 'মেটা অ্যাডস, গুগল সার্চ অ্যাডস, টেকনিক্যাল এসইও এবং আন্তর্জাতিক ক্লায়েন্ট পাওয়ার কৌশল',
    category: 'digital-marketing',
    categoryLabel: 'Digital Marketing',
    categoryLabelBn: 'ডিজিটাল মার্কেটিং',
    level: 'Beginner',
    instructor: 'Sajid Al-Mamun',
    instructorRole: 'Certified Google & Meta Marketing Strategist',
    durationWeeks: 12,
    totalHours: 48,
    feeBDT: 8500,
    discountBDT: 6500,
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
    badge: 'Best Seller / সর্বাধিক চাহিদাসম্পন্ন',
    rating: 4.9,
    enrolledCount: 142,
    batchNumber: 'Batch 28',
    nextBatchStart: '15th November 2025',
    description: 'Comprehensive digital marketing course designed for high-paying remote jobs and freelance contracts. You will master Meta Business Suite, Google Ads Manager, keyword research tools, sales funnels, and conversion optimization.',
    descriptionBn: 'আন্তর্জাতিক মার্কেটপ্লেস উপযোগী পূর্ণাঙ্গ ডিজিটাল মার্কেটিং কোর্স। মেটা বিজনেস স্যুট, গুগল অ্যাডস ক্যাম্পেইন, কি-ওয়ার্ড রিসার্চ এবং কনভার্সন ফানেল অপটিমাইজেশন শিখুন হাতে-কলমে।',
    features: [
      '24+ Live Interactive Classes with Recordings',
      'Live Meta Pixel and Google Tag Manager Setup',
      'Client Outreach & Monthly Retainer Proposal Templates',
      'Official Certificate & Lifetime Mentor Support'
    ],
    featuresBn: [
      '২৪+ লাইভ ইন্টারঅ্যাক্টিভ ক্লাস ও রেকর্ড ব্যাকআপ',
      'লাইভ মেটা পিক্সেল এবং গুগল ট্যাগ ম্যানেজার সেটআপ',
      'ক্লায়েন্ট আউটরিচ ও মান্থলি রিটেইনার প্রপোজাল টেমপ্লেট',
      'সরকারি স্ট্যান্ডার্ড ইনস্টিটিউট সার্টিফিকেট ও আজীবন মেন্টরশিপ'
    ],
    prerequisites: 'Basic English understanding and internet navigation habits.',
    prerequisitesBn: 'সাধারণ ইংরেজি বোঝা এবং নিয়মিত ইন্টারনেট ব্রাউজিং করার অভ্যাস।',
    modules: [
      {
        id: 'mod-dm-1',
        courseId: 'course-digital-marketing',
        title: 'Module 1: Search Engine Optimization (SEO) Masterclass',
        titleBn: 'মডিউল ১: সার্চ ইঞ্জিন অপটিমাইজেশন (SEO) মাস্টারক্লাস',
        order: 1,
        lessons: [
          {
            id: 'les-dm-1-1',
            moduleId: 'mod-dm-1',
            title: 'Keyword Research with Ahrefs, SEMrush & Google Keyword Planner',
            titleBn: 'Ahrefs, SEMrush এবং গুগল কি-ওয়ার্ড প্ল্যানার দিয়ে লাভজনক কি-ওয়ার্ড রিসার্চ',
            durationMinutes: 50,
            videoUrl: 'https://www.youtube.com/embed/DvwS7cV9GmQ',
            description: 'Finding low-competition, high search volume commercial intent keywords.',
            descriptionBn: 'কম কম্পিটিশন অথচ বেশি সার্চ হওয়া লাভজনক কি-ওয়ার্ড বের করার পরীক্ষিত টেকনিক।',
            studyMaterialUrl: 'https://ahrefs.com/blog/keyword-research/',
            isFreePreview: true
          },
          {
            id: 'les-dm-1-2',
            moduleId: 'mod-dm-1',
            title: 'On-Page SEO Optimization & Schema Markup Guidelines',
            titleBn: 'অন-পেইজ এসইও অপটিমাইজেশন ও স্কিমা মার্কআপ',
            durationMinutes: 55,
            videoUrl: 'https://www.youtube.com/embed/xsVTqzratPs',
            description: 'Meta titles, headings hierarchy, internal linking, and image alt text best practices.',
            descriptionBn: 'মেটা টাইটেল, এইচ-হেডিং, ইন্টারনাল লিংকিং এবং ইমেজ অপটিমাইজেশন।',
            studyMaterialUrl: 'https://moz.com/learn/seo/on-page-factors'
          }
        ]
      },
      {
        id: 'mod-dm-2',
        courseId: 'course-digital-marketing',
        title: 'Module 2: Meta Ads & Facebook Campaign Management',
        titleBn: 'মডিউল ২: মেটা অ্যাডস ও ফেসবুক বিজ্ঞাপন ক্যাম্পেইন পরিচালনা',
        order: 2,
        lessons: [
          {
            id: 'les-dm-2-1',
            moduleId: 'mod-dm-2',
            title: 'Meta Business Suite, Ad Account Structure & Budgeting',
            titleBn: 'মেটা বিজনেস স্যুট, অ্যাড একাউন্ট কাঠামো ও বাজেট নির্ধারণ',
            durationMinutes: 60,
            videoUrl: 'https://www.youtube.com/embed/Q0B_bL8c19k',
            description: 'Setting up Business Manager, pixel event tracking, and budget pacing for high ROI.',
            descriptionBn: 'বিজনেস ম্যানেজার সেটআপ, পিক্সেল ট্র্যাকিং এবং বাজেট অপটিমাইজেশন।',
            studyMaterialUrl: 'https://www.facebook.com/business/learn'
          }
        ]
      }
    ]
  },
  {
    id: 'course-graphic-design',
    title: 'Professional Graphic Design & Brand Identity Mastery',
    titleBn: 'প্রফেশনাল গ্রাফিক ডিজাইন ও ব্র্যান্ড আইডেন্টিটি',
    subtitle: 'Adobe Photoshop, Illustrator, Brand Styleguides, Banner Ads & Behance Portfolio',
    subtitleBn: 'অ্যাডোবি ফটোশপ, ইলাস্ট্রেটর, ব্যানার অ্যাডস, লোগো ডিজাইন ও পোর্টফোলিও তৈরি',
    category: 'graphic-design',
    categoryLabel: 'Graphic Design',
    categoryLabelBn: 'গ্রাফিক ডিজাইন',
    level: 'Beginner',
    instructor: 'Farzana Haque',
    instructorRole: 'Lead Visual Designer & 99designs Award Winner',
    durationWeeks: 14,
    totalHours: 56,
    feeBDT: 9000,
    discountBDT: 7000,
    thumbnail: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop&q=80',
    badge: 'Popular / ক্রিয়েটিভ ক্যারিয়ার',
    rating: 4.8,
    enrolledCount: 165,
    batchNumber: 'Batch 21',
    nextBatchStart: '20th November 2025',
    description: 'Transform creative intuition into a rewarding freelance career. Master vector illustration, layout composition, typography rules, branding stationery, and e-commerce product banner design.',
    descriptionBn: 'ডিজাইনের মৌলিক নীতিমালা, কালার থিওরি, টাইপোগ্রাফি থেকে শুরু করে কর্পোরেট ব্র্যান্ডিং এবং মার্কেটপ্লেসে ক্লায়েন্টদের জন্য হাই-কনভার্টিং ব্যানার ডিজাইন শিখুন।',
    features: [
      'Hands-on Adobe Illustrator & Photoshop Mastery',
      'Typography, Color Psychology & Visual Balance Principles',
      '5 Real Client Portfolio Projects (Behance & Dribbble)',
      '1-on-1 Portfolio Review and Fiverr Gig Creation'
    ],
    featuresBn: [
      'অ্যাডোবি ইলাস্ট্রেটর ও ফটোশপের প্র্যাক্টিক্যাল ব্যবহার',
      'টাইপোগ্রাফি, কালার সাইকোলজি ও ভিজ্যুয়াল ব্যালান্স নীতি',
      '৫টি আন্তর্জাতিক মানের পোর্টফোলিও প্রজেক্ট',
      '১-অন-১ পোর্টফোলিও রিভিউ এবং ফাইভার গিগ সেটআপ গাইড'
    ],
    prerequisites: 'A creative mindset and basic computer operating familiarity.',
    prerequisitesBn: 'ক্রিয়েটিভ চিন্তা করার আগ্রহ এবং কম্পিউটারের সাধারণ ব্যবহার।',
    modules: [
      {
        id: 'mod-gd-1',
        courseId: 'course-graphic-design',
        title: 'Module 1: Vector Graphics with Adobe Illustrator',
        titleBn: 'মডিউল ১: অ্যাডোবি ইলাস্ট্রেটরে ভেক্টর গ্রাফিক্স',
        order: 1,
        lessons: [
          {
            id: 'les-gd-1-1',
            moduleId: 'mod-gd-1',
            title: 'Pen Tool Precision, Vector Curves & Shape Builder Mastery',
            titleBn: 'পেন টুলের নিখুঁত ব্যবহার ও শেপ বিল্ডার টুল মাস্টারক্লাস',
            durationMinutes: 55,
            videoUrl: 'https://www.youtube.com/embed/IBouHF_47Ig',
            description: 'Mastering vector curvature, bezier handles, and building clean geometric logos.',
            descriptionBn: 'পেন টুল দিয়ে নিখুঁত শেপ তৈরি ও লোগোর ভেক্টর আর্ট আঁকা।',
            studyMaterialUrl: 'https://helpx.adobe.com/illustrator/tutorials.html',
            isFreePreview: true
          },
          {
            id: 'les-gd-1-2',
            moduleId: 'mod-gd-1',
            title: 'Corporate Brand Identity: Logo, Business Cards & Social Kit',
            titleBn: 'কর্পোরেট ব্র্যান্ড আইডেন্টিটি: লোগো ও সোশ্যাল মিডিয়া কিট',
            durationMinutes: 50,
            videoUrl: 'https://www.youtube.com/embed/5T30oR80854',
            description: 'Creating cohesive brand guidelines and export presets for print and digital media.',
            descriptionBn: 'প্রিন্ট ও ডিজিটাল মিডিয়ার জন্য পরিচ্ছন্ন ব্র্যান্ডিং ফাইল এক্সপোর্ট।',
            studyMaterialUrl: 'https://helpx.adobe.com/creative-cloud/design/basics.html'
          }
        ]
      }
    ]
  },
  {
    id: 'course-excel-analytics',
    title: 'Microsoft Excel & Data Analysis for Remote Jobs',
    titleBn: 'মাইক্রোসফট এক্সেল ও প্রফেশনাল ডেটা অ্যানালাইসিস',
    subtitle: 'VLOOKUP, XLOOKUP, Pivot Tables, Power Query, Financial Modeling & Dashboard Automation',
    subtitleBn: 'VLOOKUP, XLOOKUP, পিভট টেবিল, পাওয়ার কুয়েরি ও ড্যাশবোর্ড অটোমেশন',
    category: 'excel-analytics',
    categoryLabel: 'Microsoft Excel',
    categoryLabelBn: 'মাইক্রোসফট এক্সেল',
    level: 'Beginner',
    instructor: 'Mahmudul Hasan (Data Specialist)',
    instructorRole: 'Certified Microsoft Office Specialist (MOS)',
    durationWeeks: 8,
    totalHours: 32,
    feeBDT: 6000,
    discountBDT: 4500,
    thumbnail: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80',
    badge: 'Essential / ক্যারিয়ারে জরুরি',
    rating: 4.9,
    enrolledCount: 110,
    batchNumber: 'Batch 14',
    nextBatchStart: '25th November 2025',
    description: 'Learn practical Microsoft Excel from the basics to advanced business automation. Master formulas, conditional formatting, dynamic charts, data cleansing, and building corporate reporting dashboards.',
    descriptionBn: 'বেসিক থেকে অ্যাডভান্সড লেভেলের এক্সেল ফর্মুলা, পিভট টেবিল, ডেটা ক্লিনিং এবং আকর্ষণীয় এক্সিকিউটিভ ড্যাশবোর্ড তৈরি শিখে আন্তর্জাতিক কোম্পানিতে রিমোট চাকরি নিশ্চিত করুন।',
    features: [
      'Advanced Formulas (XLOOKUP, INDEX/MATCH, SUMIFS, LAMBDA)',
      'Interactive Pivot Tables & Dynamic Slicers',
      'Data Cleaning with Power Query Automation',
      'Upwork & Fiverr B2B Spreadsheet Consulting Guide'
    ],
    featuresBn: [
      'অ্যাডভান্সড ফর্মুলা (XLOOKUP, INDEX/MATCH, SUMIFS)',
      'ইন্টারঅ্যাক্টিভ পিভট টেবিল ও স্লাইসার অটোমেশন',
      'পাওয়ার কুয়েরি দিয়ে ডেটা ক্লিনিং ও অটোমেশন',
      'আপওয়ার্ক ও ফাইবারে স্প্রেডশিট কনসাল্টিং গাইড'
    ],
    prerequisites: 'Basic numerical ability and desire to master spreadsheets.',
    prerequisitesBn: 'হিসাব-নিকাশের সাধারণ আগ্রহ এবং স্প্রেডশিট শেখার আগ্রহ।',
    modules: [
      {
        id: 'mod-ex-1',
        courseId: 'course-excel-analytics',
        title: 'Module 1: Excel Foundations, Formulas & Lookup Functions',
        titleBn: 'মডিউল ১: এক্সেল ফান্ডামেন্টালস ও লুকআপ ফাংশন',
        order: 1,
        lessons: [
          {
            id: 'les-ex-1-1',
            moduleId: 'mod-ex-1',
            title: 'Mastering XLOOKUP, VLOOKUP, INDEX & MATCH with Real Datasets',
            titleBn: 'রিয়েল ডেটাসেট দিয়ে XLOOKUP ও VLOOKUP এর কার্যকর ব্যবহার',
            durationMinutes: 45,
            videoUrl: 'https://www.youtube.com/embed/1U6OO_1K5-g',
            description: 'Connecting multi-sheet data records with zero error tolerance.',
            descriptionBn: 'মাল্টিপল শিটের ডেটা রিলেশন ও নির্ভুল ক্যালকুলেশন কৌশল।',
            studyMaterialUrl: 'https://support.microsoft.com/en-us/excel',
            isFreePreview: true
          },
          {
            id: 'les-ex-1-2',
            moduleId: 'mod-ex-1',
            title: 'Dynamic Pivot Tables, Slicers & KPI Dashboards',
            titleBn: 'পিভট টেবিল, স্লাইসার এবং কেপিআই ড্যাশবোর্ড নির্মাণ',
            durationMinutes: 50,
            videoUrl: 'https://www.youtube.com/embed/m0wI61ahfLc',
            description: 'Aggregating large company sales data into interactive executive reports.',
            descriptionBn: 'বড় সেলস ডেটা থেকে নিমেষেই ইন্টারঅ্যাক্টিভ রিপোর্ট প্রস্তুত করা।',
            studyMaterialUrl: 'https://support.microsoft.com/en-us/office/create-a-pivottable-to-analyze-worksheet-data-a9a84538-bfe9-40a9-a8e9-f99134456576'
          }
        ]
      }
    ]
  },
  {
    id: 'course-email-marketing',
    title: 'Email Marketing & Cold B2B Outreach Mastery',
    titleBn: 'ইমেইল মার্কেটিং ও কোল্ড বি-টু-বি আউটরিচ',
    subtitle: 'Mailchimp, Klaviyo, Cold Email Deliverability, Apollo.io Lead Prospecting & Copywriting',
    subtitleBn: 'মেইলচিম্প, ক্লাভিও, কোল্ড ইমেইল ডেলিভারিবিলিটি ও সেলস কপিরাইটিং',
    category: 'email-marketing',
    categoryLabel: 'Email Marketing',
    categoryLabelBn: 'ইমেইল মার্কেটিং',
    level: 'Beginner',
    instructor: 'Kabir Hossain',
    instructorRole: 'Outreach & Lead Gen Strategist',
    durationWeeks: 8,
    totalHours: 32,
    feeBDT: 7000,
    discountBDT: 5000,
    thumbnail: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=800&auto=format&fit=crop&q=80',
    badge: 'High ROI / হাই কনভার্সন',
    rating: 4.8,
    enrolledCount: 95,
    batchNumber: 'Batch 11',
    nextBatchStart: '1st December 2025',
    description: 'Learn how to generate predictable sales for international e-commerce and SaaS brands using email automation. Master list segmentation, DKIM/SPF domain setup, Apollo lead prospecting, and high-converting cold email copywriting.',
    descriptionBn: 'আন্তর্জাতিক ই-কমার্স ও বিটুবি ব্যবসার জন্য পাওয়ারফুল ইমেইল ক্যাম্পেইন পরিচালনা শিখুন। মেইলচিম্প, ক্লাভিও অটোমেশন, স্প্যাম ফিল্টার এড়ানো এবং রেসপন্স বাড়ানোর সেলস কপিরাইটিং।',
    features: [
      'Email Automation & Flows (Welcome, Abandoned Cart, Post-Purchase)',
      'Cold Email Infrastructure (SPF, DKIM, DMARC, Domain Warmup)',
      'B2B Prospecting with Apollo.io and NeverBounce',
      'High-Converting Cold Outreach Email Templates'
    ],
    featuresBn: [
      'ইমেইল অটোমেশন ও ফ্লো সেটআপ (মেইলচিম্প ও ক্লাভিও)',
      'কোল্ড ইমেইল ইনফ্রাস্ট্রাকচার (SPF, DKIM, DMARC ডোমেইন ওয়ার্মআপ)',
      'Apollo.io দিয়ে ভেরিফাইড বিটুবি লিড সংগ্রহ',
      'হাই-কনভার্টিং কোল্ড আউটরিচ ইমেইল টেমপ্লেট'
    ],
    prerequisites: 'Basic written English and good attention to detail.',
    prerequisitesBn: 'সাধারণ লিখিত ইংরেজি বোঝার দক্ষতা ও আগ্রহ।',
    modules: [
      {
        id: 'mod-em-1',
        courseId: 'course-email-marketing',
        title: 'Module 1: Email Marketing Strategy & Automation Funnels',
        titleBn: 'মডিউল ১: ইমেইল মার্কেটিং স্ট্র্যাটেজি ও অটোমেশন ফানেল',
        order: 1,
        lessons: [
          {
            id: 'les-em-1-1',
            moduleId: 'mod-em-1',
            title: 'Klaviyo & Mailchimp Workflow Setup for E-Commerce',
            titleBn: 'ই-কমার্সের জন্য ক্লাভিও ও মেইলচিম্প ওয়ার্কফ্লো অটোমেশন',
            durationMinutes: 45,
            videoUrl: 'https://www.youtube.com/embed/5T8Z4UfH7vY',
            description: 'Designing high-converting automated customer journey sequences.',
            descriptionBn: 'কাস্টমারদের জন্য স্বয়ংক্রিয় ওয়েলকাম এবং পারচেজ ফলোআপ সিকোয়েন্স।',
            studyMaterialUrl: 'https://help.klaviyo.com/hc/en-us',
            isFreePreview: true
          },
          {
            id: 'les-em-1-2',
            moduleId: 'mod-em-1',
            title: 'Cold Email Deliverability: DNS Records & Warmup Tactics',
            titleBn: 'কোল্ড ইমেইল ডেলিভারিবিলিটি: ডিএনএস রেকর্ডস ও ওয়ার্মআপ টেকনিক',
            durationMinutes: 40,
            videoUrl: 'https://www.youtube.com/embed/s3g4zN8G4Gg',
            description: 'Ensuring your outreach emails consistently land in the primary inbox.',
            descriptionBn: 'ইনবক্সে ইমেইল পৌঁছানো নিশ্চিত করতে ডোমেইন ওয়ার্মআপ ও ডিএনএস কনফিগারেশন।',
            studyMaterialUrl: 'https://instantly.ai/blog/cold-email-deliverability'
          }
        ]
      }
    ]
  }
];

export const INITIAL_EXAMS: Exam[] = [
  {
    id: 'exam-dm-1',
    courseId: 'course-digital-marketing',
    title: 'Digital Marketing & SEO Mid-Term Evaluation',
    titleBn: 'ডিজিটাল মার্কেটিং ও এসইও মূল্যায়ন পরীক্ষা',
    description: 'Assess keyword research, on-page SEO, Meta advertising metrics, and sales funnels.',
    descriptionBn: 'কি-ওয়ার্ড রিসার্চ, অন-পেইজ এসইও ও মেটা বিজ্ঞাপনের ধারণার পরীক্ষা।',
    durationMinutes: 15,
    passPercentage: 70,
    totalMarks: 50,
    isActive: true,
    createdAt: '2025-01-10',
    questions: [
      {
        id: 'dm-q1',
        questionText: 'What does "CTR" stand for in digital marketing analytics?',
        questionTextBn: 'ডিজিটাল মার্কেটিং অ্যানালিটিক্সে "CTR" এর পূর্ণরূপ কী?',
        options: [
          { id: 'opt1', text: 'Click-Through Rate', textBn: 'Click-Through Rate' },
          { id: 'opt2', text: 'Cost-Target Ratio', textBn: 'Cost-Target Ratio' },
          { id: 'opt3', text: 'Conversion Time Rate', textBn: 'Conversion Time Rate' },
          { id: 'opt4', text: 'Content Traction Ratio', textBn: 'Content Traction Ratio' }
        ],
        correctOptionId: 'opt1',
        explanation: 'CTR is the ratio of users who click on a specific link to total ad impressions.'
      },
      {
        id: 'dm-q2',
        questionText: 'Which meta directive instructs search engine robots not to index a web page?',
        questionTextBn: 'সার্চ ইঞ্জিন রোবটকে কোনো ওয়েব পেইজ ইনডেক্স না করতে কোন মেটা ট্যাগ দেওয়া হয়?',
        options: [
          { id: 'opt1', text: '<meta name="robots" content="noindex">', textBn: '<meta name="robots" content="noindex">' },
          { id: 'opt2', text: '<meta name="robots" content="nofollow">', textBn: '<meta name="robots" content="nofollow">' },
          { id: 'opt3', text: '<meta name="hide" content="true">', textBn: '<meta name="hide" content="true">' },
          { id: 'opt4', text: '<meta name="crawl" content="false">', textBn: '<meta name="crawl" content="false">' }
        ],
        correctOptionId: 'opt1',
        explanation: 'The `noindex` tag tells search crawlers to exclude the page from search results.'
      },
      {
        id: 'dm-q3',
        questionText: 'Which Meta Pixel standard event tracks successful ecommerce checkouts?',
        questionTextBn: 'মেটা পিক্সেলে সফল কেনাকাটা ট্র্যাক করার আদর্শ ইভেন্ট কোনটি?',
        options: [
          { id: 'opt1', text: 'Purchase', textBn: 'Purchase' },
          { id: 'opt2', text: 'AddToCart', textBn: 'AddToCart' },
          { id: 'opt3', text: 'ViewContent', textBn: 'ViewContent' },
          { id: 'opt4', text: 'InitiateCheckout', textBn: 'InitiateCheckout' }
        ],
        correctOptionId: 'opt1',
        explanation: 'The `Purchase` standard event fires upon order confirmation with revenue value.'
      }
    ]
  },
  {
    id: 'exam-ex-1',
    courseId: 'course-excel-analytics',
    title: 'Microsoft Excel Functions & Data Modeling Quiz',
    titleBn: 'মাইক্রোসফট এক্সেল ফাংশন ও ডেটা মডেলিং কুইজ',
    description: 'Assessment covering XLOOKUP, Pivot Tables, and spreadsheet data analysis.',
    descriptionBn: 'XLOOKUP, পিভট টেবিল ও স্প্রেডশিট ডেটা বিশ্লেষণের ওপর মূল্যায়ন পরীক্ষা।',
    durationMinutes: 12,
    passPercentage: 70,
    totalMarks: 40,
    isActive: true,
    createdAt: '2025-01-15',
    questions: [
      {
        id: 'ex-q1',
        questionText: 'What is a key advantage of XLOOKUP over traditional VLOOKUP in Excel?',
        questionTextBn: 'এক্সেলে প্রথাগত VLOOKUP এর তুলনায় XLOOKUP এর অন্যতম প্রধান সুবিধা কী?',
        options: [
          { id: 'opt1', text: 'It can look up values to the left and defaults to exact match', textBn: 'এটি বাম দিকেও লুকআপ করতে পারে এবং ডিফল্টভাবে হুবহু মিল খোঁজে' },
          { id: 'opt2', text: 'It only works with numbers', textBn: 'এটি শুধু সংখ্যা নিয়ে কাজ করতে পারে' },
          { id: 'opt3', text: 'It requires columns to be sorted alphabetically', textBn: 'কলামগুলোকে ক্রমানুসারে সাজাতে হয়' },
          { id: 'opt4', text: 'It cannot handle errors', textBn: 'এটি এরর হ্যান্ডেল করতে পারে না' }
        ],
        correctOptionId: 'opt1',
        explanation: 'XLOOKUP can search in any direction and does not require sorting or column indices.'
      },
      {
        id: 'ex-q2',
        questionText: 'Which Excel feature is best suited for summarizing thousands of transaction rows into totals by category?',
        questionTextBn: 'হাজার হাজার ট্রানজেকশন ডেটাকে ক্যাটাগরি অনুযায়ী সংক্ষেপে উপস্থাপন করতে কোন টুলটি সেরা?',
        options: [
          { id: 'opt1', text: 'Pivot Table', textBn: 'Pivot Table (পিভট টেবিল)' },
          { id: 'opt2', text: 'Word Art', textBn: 'Word Art' },
          { id: 'opt3', text: 'Spell Check', textBn: 'Spell Check' },
          { id: 'opt4', text: 'Find & Replace', textBn: 'Find & Replace' }
        ],
        correctOptionId: 'opt1',
        explanation: 'Pivot Tables allow dynamic aggregation, grouping, and filtering of multi-row data.'
      }
    ]
  }
];

export const INITIAL_NOTICES: Notice[] = [
  {
    id: 'notice-1',
    title: 'Live Class Schedule: Digital Marketing Batch 28 & Graphic Design Batch 21',
    titleBn: 'লাইভ ক্লাস সময়সূচি: ডিজিটাল মার্কেটিং ও গ্রাফিক ডিজাইন ব্যাচ',
    content: 'All enrolled students must join Zoom classes on schedule. Have your course materials and tools ready.',
    contentBn: 'সকল ভর্তি হওয়া শিক্ষার্থী যথাসময়ে ক্লাসে উপস্থিত থাকবেন। ক্যামেরা ও অডিও চেক করে নির্ধারিত জুম লিংকে প্রবেশ করুন।',
    category: 'routine',
    date: '2025-02-01',
    isPinned: true,
    meetingLink: 'https://zoom.us/j/9876543210'
  },
  {
    id: 'notice-2',
    title: 'Upcoming Certification & MCQ Examination Guidelines',
    titleBn: 'সার্টিফিকেশন ও অনলাইন নৈর্ব্যক্তিক পরীক্ষা নির্দেশিকা',
    content: 'Students completing their modules can participate in online tests. Passing score generates unique verifiable certificates.',
    contentBn: 'কোর্সের মডিউল সম্পন্ন করার পর শিক্ষার্থীরা অনলাইন পরীক্ষায় অংশ নিতে পারবেন। পাস মার্ক অর্জন করলে ভেরিফাইড সনদ প্রদান করা হবে।',
    category: 'exam',
    date: '2025-02-05',
    isPinned: true
  }
];

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  id: 'general',
  heroBadgeBn: '🇧🇩 বাংলাদেশ কারিগরি ও ফ্রিল্যান্সিং প্রশিক্ষণ',
  heroBadgeEn: '🇧🇩 Bangladesh Professional & Freelancing Care',
  heroTitleBn: 'সফল ফ্রিল্যান্সিং ক্যারিয়ারের বিশ্বস্ত ঠিকানা',
  heroTitleEn: 'Trusted Academy for a High-Earning Freelance Career',
  heroSubtitleBn: 'প্র্যাক্টিক্যাল প্রজেক্ট-ভিত্তিক ট্রেনিং, লাইভ সাপোর্ট এবং আন্তর্জাতিক মার্কেটপ্লেসে (Fiverr, Upwork) প্রথম কাজ পাওয়ার সম্পূর্ণ গাইডলাইন।',
  heroSubtitleEn: 'Practical hands-on projects, 24/7 dedicated mentor guidance, and step-by-step coaching to win global contracts.',
  heroBannerUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&auto=format&fit=crop&q=80',
  statStudents: '১২,৫০০+ সফল শিক্ষার্থী',
  statSuccessRate: '৮৭% মার্কেটপ্লেস আর্নিং রেট',
  statBatches: '৪৮+ পরিচালিত ব্যাচ',
  statSupport: '২৪/৭ লাইভ মেন্টর সাপোর্ট',
  hotline: '+৮৮০ ১৭১২-৩৪৫৬৭৮',
  whatsapp: '+৮৮০ ১৭১২-৩৪৫৬৭৮',
  emailContact: 'info@alhera.edu.bd',
  instituteLocationBn: 'মিরপুর-১০, ঢাকা-১২১৬, বাংলাদেশ',
  instituteLocationEn: 'Mirpur-10, Dhaka-1216, Bangladesh',
  officeHoursBn: 'প্রতিদিন সকাল ৯:০০ টা - রাত ৯:০০ টা',
  officeHoursEn: 'Everyday 9:00 AM - 9:00 PM',
  facebookUrl: 'https://facebook.com/alherafreelancing',
  youtubeUrl: 'https://youtube.com/@alherafreelancing',
  admissionsNoticeBn: 'ভর্তি চলছে: নতুন ব্যাচ ২০২৫ (সীমিত আসন)',
  admissionsNoticeEn: 'Admissions Open: New Batch 2025 (Limited Seats)',
  updatedAt: new Date().toISOString()
};

