export const site = {
  name: 'Maria Sappho',
  description: 'Maria Sappho: improviser, composer, instrument builder and researcher.',
  award: 'BBC Radiophonic Daphne Oram Award winner 2021',
  // Paste a free Web3Forms access key here to switch the contact form on.
  contactFormKey: '',
  orcid: 'https://orcid.org/0000-0003-3122-3357',
  scholar: 'https://scholar.google.com/citations?user=rCB7eaEAAAAJ',
  newsletter: 'https://eepurl.com/ipSd6k',
  gio: 'https://www.glasgowimprovisersorchestra.com',
  researchProfile: 'https://www.gla.ac.uk/schools/cca/staff/mariasappho/',
  email: 'Maria.Sappho@glasgow.ac.uk',
  role: 'Lecturer in Creative Sound Design and Composition (Music), University of Glasgow',
};

export const nav = [
  { label: 'Work', href: '/work/' },
  { label: 'Collaborations', href: '/collaborations/' },
  { label: 'Research', href: '/research/' },
  { label: 'Now', href: '/now/' },
  { label: 'About', href: '/about/' },
  { label: 'Search', href: '/search/' },
];

export const socials = [
  { label: 'Facebook', href: 'https://www.facebook.com/K33sia', icon: 'facebook' },
  { label: 'Bandcamp', href: 'https://mariasappho.bandcamp.com/releases', icon: 'bandcamp' },
  { label: 'Instagram', href: 'https://www.instagram.com/k33sia/', icon: 'instagram' },
  { label: 'SoundCloud', href: 'https://soundcloud.com/mariapianist', icon: 'soundcloud' },
  { label: 'YouTube', href: 'https://www.youtube.com/channel/UCgQAhRdUik5GfXaZVrNexGQ/', icon: 'youtube' },
  { label: 'Twitter', href: 'https://twitter.com/Maria_Sappho', icon: 'twitter' },
];

// The "what it is" tags used as the main filters on the Work page.
export const workTypes = {
  performance: 'Performance',
  recording: 'Recording',
  score: 'Score',
  instrument: 'Instrument',
  installation: 'Installation',
  film: 'Film',
  book: 'Book',
  'visual-art': 'Visual Art',
} as const;

// The "what it's about" tags, shared by Work and Research.
export const themes = {
  mushrooms: 'Mushrooms',
  ai: 'AI',
  improvisation: 'Improvisation',
  feminism: 'Feminism',
  telematic: 'Telematic',
  immersive: 'Immersive',
  instruments: 'Instrument Design',
} as const;

export const researchTypes = {
  article: 'Article',
  'video-article': 'Video Article',
  chapter: 'Book Chapter',
  book: 'Book',
  thesis: 'Thesis',
  conference: 'Conference Paper',
} as const;
