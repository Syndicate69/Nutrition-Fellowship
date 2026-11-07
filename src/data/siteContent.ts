export interface NavItem {
  label: string;
  href: string;
  sectionId: string;
}

export interface HighlightItem {
  id: number;
  image: string;
  topic: string;
  description: string;
  link: string;
  fullText?: string;
  isSpeech?: boolean;
}

export interface InitiativeItem {
  title: string;
  img: string;
  link: string;
}

export interface DocumentLink {
  title: string;
  path: string;
  pdfUrl: string;
  hasLocalPdf: boolean;
  comingSoonHeading: string;
  comingSoonStatus: string;
}

export interface DocumentCategory {
  category: string;
  links: DocumentLink[];
}

export interface RecentEventItem {
  id: number;
  date: string;
  img: string;
  review: string;
}

export interface UpcomingEventItem {
  name: string;
  date: string;
  description: string;
}

export interface AnnouncementItem {
  title: string;
  date: string;
  details: string;
}

export interface TestimonialItem {
  id: number;
  name: string;
  role: string;
  photo: string;
  description: string;
}

export interface TeamMemberItem {
  id: number;
  name: string;
  role: string;
  photo: string;
  description: string;
  group?: 'Guidance Group' | 'Core Group';
}

export const SITE_BRAND = {
  title: 'Nutrition Fellowship',
  logoPrimary: '/Nutrition_logo333.png',
  logoPrimaryAlt: 'Nutrition Logo',
  logoFooter: '/Nutrition_logo33.png',
  logoFooterAlt: 'Company Logo',
  email: 'nutfellowship@gmail.com',
  emailComposeUrl: 'https://mail.google.com/mail/?view=cm&fs=1&to=nutfellowship@gmail.com',
  social: {
    facebook: 'https://www.facebook.com/nutfellowship/',
    instagram: 'https://www.instagram.com/nutfellowship/?hl=en',
    linkedin: 'https://www.linkedin.com/in/nutfellowship/',
    twitter: 'https://x.com/nutfellowship',
  },
};

export const NAV_ITEMS: NavItem[] = [
  { label: 'HOME', href: '#home', sectionId: 'home' },
  { label: 'KEY HIGHLIGHTS', href: '#aboutus', sectionId: 'aboutus' },
  { label: 'PROJECTS AND INITIATIVES', href: '#initiatives', sectionId: 'initiatives' },
  { label: 'RESOURCES', href: '#documents', sectionId: 'documents' },
  { label: 'EVENTS AND UPDATES', href: '#events', sectionId: 'events' },
  { label: 'TESTIMONIALS', href: '#testimonials', sectionId: 'testimonials' },
  { label: 'OUR TEAM', href: '#team', sectionId: 'team' },
  { label: 'CONTACT US', href: '#thoughts', sectionId: 'thoughts' },
];

export const HERO_SLIDER_IMAGES = [
  {
    src: '/ImageSlider/5generations.jpeg',
    alt: 'Slide 1',
    caption: 'Five Generations of Nutrition in one frame',
  },
  {
    src: '/ImageSlider/Cover-collage.png',
    alt: 'Slide 2',
    caption: 'Students leading the Fellowship · A mosaic of cherished interactions',
  },
];

export const ABOUT_US_CONTENT = {
  tabs: {
    value: 'Value Proposition',
    vision: 'Our Vision',
  },
  valueProposition: {
    heading: 'Our Value Proposition',
    paragraphs: [
      'We unite three generations of stakeholders from Nepal and around the world—combining experience, innovation, and passion to accelerate the fight against undernutrition in Nepal.',
      'Through this fellowship, we foster meaningful connections, convene diverse perspectives, and promote transformative collaboration.',
    ],
  },
  ourVision: {
    leftQuote:
      '"No Nepali is deprived of right to be free from undernutrition and suffer from ills effect of overnutrition"',
    mainQuote:
      '"Bound by purpose, United for Nutrition: A fellowship to Nourish Generations"',
    pillars: ['Celebrate', 'Convene', 'Coach', 'Collaborate', 'Connect'],
  },
};

export const KEY_HIGHLIGHTS: HighlightItem[] = [
  {
    id: 1,
    image: '/KeyHighlights/NutritionDashboard.png',
    topic: 'Nutrition Dashboard',
    description: 'The Nutrition Dashboard of Nepal',
    link: 'https://nutrition-dashboard-vision.vercel.app/',
  },
  {
    id: 2,
    image: '/KeyHighlights/NFNbanner.jpeg',
    topic: 'Jan 17 Documents',
    description: 'The documents from the 2nd Nutrition Fellowship meeting',
    link: 'https://drive.google.com/drive/folders/11yDaiLP9wzxMpP1vY4zqsY3uewHR__oO?usp=drive_link',
  },
  {
    id: 3,
    image: '/KeyHighlights/Dr. RP Bichha.jpg',
    topic: 'Dr. RP Bichha Speech',
    description: 'The speech given by Dr. RP Bichha at the 2nd Nutrition Fellowship meeting',
    link: 'https://youtu.be/YxI-8DVWIQQ?si=tb7y2lsEyLm8_31v',
    isSpeech: true,
    fullText:
      'Keynote address delivered by Dr. RP Bichha at the 2nd Nutrition Fellowship for Nepal meeting.\n\nIn this address, Dr. RP Bichha emphasized the critical role of national multi-sectoral nutrition policies, strengthening community health systems, and uniting experienced public health leaders with emerging youth fellows to eliminate undernutrition across all provinces of Nepal.\n\n(You can edit or paste the complete verbatim transcript of this speech anytime from the Admin Panel -> Keynote Speeches section.)',
  },
  {
    id: 4,
    image: '/KeyHighlights/Miriam Krantz.jpg',
    topic: 'Miriam Krantz Speech',
    description: 'The speech given by Miriam Krantz at the 2nd Nutrition Fellowship meeting',
    link: 'https://youtu.be/YxI-8DVWIQQ?si=tb7y2lsEyLm8_31v',
    isSpeech: true,
    fullText:
      'Keynote reflection delivered by Miriam Krantz at the 2nd Nutrition Fellowship for Nepal meeting.\n\nMiriam Krantz shared her decades of foundational experience working with Nepali families and communities, highlighting how practical, locally rooted nutrition education and intergenerational mentorship continue to transform maternal and child health in Nepal.\n\n(You can edit or paste the complete verbatim transcript of this speech anytime from the Admin Panel -> Keynote Speeches section.)',
  },
  {
    id: 5,
    image: '/KeyHighlights/Dr. Ramesh K Adhikari.jpg',
    topic: 'Dr. RK Adhikari Speech',
    description: 'The speech given by Dr. Ramesh K Adhikari at the 2nd Nutrition Fellowship meeting',
    link: 'https://youtu.be/YxI-8DVWIQQ?si=tb7y2lsEyLm8_31v',
    isSpeech: true,
    fullText:
      'Keynote address delivered by Dr. Ramesh K Adhikari at the 2nd Nutrition Fellowship for Nepal meeting.\n\nDr. Ramesh K Adhikari reflected on the evolution of nutrition research, clinical training, and academic mentorship in Nepal, calling on third-generation fellows and students to lead evidence-based advocacy and collaborative action.\n\n(You can edit or paste the complete verbatim transcript of this speech anytime from the Admin Panel -> Keynote Speeches section.)',
  },
];

export const INITIATIVES: InitiativeItem[] = [
  {
    title: 'GEN-N INITIATIVES',
    img: '/Initiatives/Gen-N.png',
    link: 'https://drive.google.com/drive/folders/1_PZuUUcI1jwHlIVtsgN01VcXAdH8B8PO?usp=drive_link',
  },
  {
    title: 'ADVOCACY AND CAMPAIGNS',
    img: '/Initiatives/Advocacy.png',
    link: 'https://example.com/advocacy',
  },
  {
    title: 'TECHNOLOGY IN NUTRITION',
    img: '/Initiatives/TechInNut.png',
    link: 'https://example.com/technology',
  },
];

export const DOCUMENTS_REPOSITORY: DocumentCategory[] = [
  {
    category: 'Reports',
    links: [
      {
        title: 'Newsletter',
        path: '/profile',
        pdfUrl: '/document_pdfs/Nutrition Fellowship Brief.pdf',
        hasLocalPdf: true,
        comingSoonHeading: 'Nutrition Profile',
        comingSoonStatus: 'Coming soon.....',
      },
      {
        title: 'Nutrition Profiles',
        path: '/profile',
        pdfUrl: '/document_pdfs/Stunting profile.pdf',
        hasLocalPdf: true,
        comingSoonHeading: 'Nutrition Profile',
        comingSoonStatus: 'Coming soon.....',
      },
    ],
  },
  {
    category: 'Policies and Plans',
    links: [
      {
        title: 'Nutrition Policy 2025',
        path: '/policy2025',
        pdfUrl: '/pdfs/nutrition-policy-2025.pdf',
        hasLocalPdf: false,
        comingSoonHeading: 'Policy 2025 description',
        comingSoonStatus: 'Coming soon.....',
      },
    ],
  },
  {
    category: 'Blogs',
    links: [
      {
        title: 'Nutrition Fellowship for Nepal : 2nd Meet',
        path: '/nfn2ndmeetblog',
        pdfUrl: '/pdfs/nfn-2nd-meet.pdf',
        hasLocalPdf: false,
        comingSoonHeading: 'Nutrition Fellowship for Nepal : 2nd meet blog',
        comingSoonStatus: 'Coming soon.....',
      },
      {
        title: 'Internship at Nutrition Rehabilitation Center',
        path: '/nrcinternblog',
        pdfUrl: '/pdfs/nrc-intern.pdf',
        hasLocalPdf: false,
        comingSoonHeading: 'Nutrition Rehabilitation Center: Internship blog',
        comingSoonStatus: 'Coming soon.....',
      },
    ],
  },
  {
    category: 'Researches',
    links: [
      {
        title: 'AI in Nutrition',
        path: '/aiinnutrition',
        pdfUrl: '/pdfs/ai-nutrition.pdf',
        hasLocalPdf: false,
        comingSoonHeading: 'Research on AI in nutrition',
        comingSoonStatus: 'Coming soon.....',
      },
    ],
  },
];

export const RECENT_EVENTS: RecentEventItem[] = [
  {
    id: 1,
    date: '08/01/2024',
    img: '/Recentevents/1st meet.jpg',
    review: 'Nutrition Fellowship for Nepal: First Meet',
  },
  {
    id: 2,
    date: '12/26/2024',
    img: '/Recentevents/2nd meet.jpg',
    review: 'Strategic Planning for Fellowship Meet',
  },
  {
    id: 3,
    date: '01/02/2025',
    img: '/Recentevents/Pk data camp.jpg',
    review: 'Nutrition Data Camp : at Padma Kanya College',
  },
  {
    id: 4,
    date: '01/05/2025',
    img: '/Recentevents/CAFODAT data camp.jpg',
    review: 'Nutrition Data Camp : at CAFODAT College',
  },
  {
    id: 5,
    date: '01/17/2025',
    img: '/Recentevents/Meet_and_Greet_12.jpg',
    review: '2nd Nutrition Fellowship for Nepal Meet',
  },
  {
    id: 6,
    date: '01/20/2025',
    img: '/Recentevents/DC-mmihs1.jpg',
    review: 'Nutrition Data Camp : at MMIHS',
  },
  {
    id: 7,
    date: '02/19/2025',
    img: '/Recentevents/canvabatch1.jpg',
    review: 'Canva Workshop among different colleges: Batch 1',
  },
];

export const UPCOMING_EVENTS: UpcomingEventItem[] = [
  {
    name: 'Nutrition Data Camps',
    date: '2025-monthly',
    description:
      'Nutrition data camps will be conducted every month among the students and professionals.',
  },
  {
    name: 'Orientation for students',
    date: '2025-monthly',
    description:
      'Orientation programs on various technical skills will be conducted among the students.',
  },
];

export const ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    title: 'Nutrition Fellowship for Nepal: Second Meet',
    date: '01/17/2025',
    details:
      'We are excited for the gathering of hearts and minds dedicated to transforming nutrition in Nepal!',
  },
];

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 1,
    name: 'Full Name Placeholder',
    role: 'Senior Nutrition Specialist · First Generation',
    photo: '',
    description:
      'Add testimonial or reflection here—share how the Nutrition Fellowship connects generations of practitioners, researchers, and students to advance nutrition outcomes in Nepal.',
  },
  {
    id: 2,
    name: 'Full Name Placeholder',
    role: 'Public Health Researcher · Second Generation',
    photo: '',
    description:
      'Add testimonial or reflection here—highlight collaborative initiatives, policy dialogues, and mentorship experiences fostered through the fellowship.',
  },
  {
    id: 3,
    name: 'Full Name Placeholder',
    role: 'Nutrition Student Fellow · Third Generation',
    photo: '',
    description:
      'Add testimonial or reflection here—describe the impact of Nutrition Data Camps, workshops, and intergenerational learning opportunities.',
  },
];

export const TEAM_MEMBERS: TeamMemberItem[] = [
  {
    id: 1,
    name: 'Senior Professional Name',
    role: 'Senior Nutrition & Public Health Advisor',
    photo: '',
    group: 'Guidance Group',
    description:
      'Short biography and description placeholder for a senior professional in the Guidance Group providing strategic direction and mentorship to the Nutrition Fellowship.',
  },
  {
    id: 2,
    name: 'Senior Professional Name',
    role: 'Senior Policy & Research Mentor',
    photo: '',
    group: 'Guidance Group',
    description:
      'Short biography and description placeholder for a senior professional in the Guidance Group guiding multi-generational collaboration and nutrition policy dialogue.',
  },
  {
    id: 3,
    name: 'Senior Professional Name',
    role: 'Senior Clinical & Community Nutritionist',
    photo: '',
    group: 'Guidance Group',
    description:
      'Short biography and description placeholder for a senior professional in the Guidance Group supporting fellowship initiatives and capacity building across Nepal.',
  },
  {
    id: 4,
    name: 'Team Member Name',
    role: 'Program Coordinator',
    photo: '',
    group: 'Core Group',
    description:
      'Leads overall program coordination, fellowship convenings, and multi-stakeholder partnerships within the Core Working Group.',
  },
  {
    id: 5,
    name: 'Team Member Name',
    role: 'Program Officer',
    photo: '',
    group: 'Core Group',
    description:
      'Manages day-to-day fellowship operations, Nutrition Data Camps, student engagement, and field implementation within the Core Working Group.',
  },
  {
    id: 6,
    name: 'Team Member Name',
    role: 'Advocacy Coordinator',
    photo: '',
    group: 'Core Group',
    description:
      'Drives nutrition policy advocacy, communications, and youth-led campaigns across colleges and communities within the Core Working Group.',
  },
];

export const THOUGHTS_CONTENT = {
  heading: 'PLACE YOUR THOUGHTS',
  subheading: 'We would love to hear feedback and questions from you.',
  web3FormsAccessKey: '6649cfe5-e72b-4818-aa36-de58ef34225d',
};

export const FOOTER_CONTENT = {
  description:
    'Nutrition Fellowship for Nepal aims to unite three generations of stakeholders from Nepal and around the world.',
  usefulLinksHeading: 'Useful Links',
  usefulLinks: [
    {
      label: 'Nutrition Dashboard',
      href: 'https://nutrition-dashboard-vision.vercel.app/',
    },
    {
      label: 'Nepal Nutrition and Food Security Portal',
      href: 'http://www.nnfsp.gov.np/',
    },
  ],
  getInTouchHeading: 'Get in Touch',
  queriesPrefix: 'If you have any queries, feel free to email us at:-',
  copyrightPrefix: 'Copyright © 2024 All Rights Reserved',
  copyrightOrg: 'NutritionFellowshipForNepal',
};
