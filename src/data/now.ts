// Edit this file to keep the Now page current. Move items to `recent` once they have happened.
export const upcoming = [
  {
    when: '26–28 Nov 2026', title: 'GIOfest XVIII', where: 'Glasgow Improvisers Orchestra festival, Glasgow',
    note: 'I’m performing across the whole festival and helping to organise it: three days of free events with Maggie Nicols, Rie Nakajima, Corey Mwamba, Rob Burke and Anna Kaluza.',
    href: 'https://www.glasgowimprovisersorchestra.com/giofest/xviii/',
    links: [
      { label: 'Full programme', url: 'https://www.glasgowimprovisersorchestra.com/giofest/xviii/programme/' },
      { label: 'Thu 26: Night 1, Glasgow School of Art', url: 'https://www.eventbrite.co.uk/e/glasgow-improvisers-orchestra-festival-xviii-night-1-tickets-2002526575895' },
      { label: 'Fri 27: Night 2, The Old Hairdresser’s', url: 'https://www.eventbrite.co.uk/e/glasgow-improvisers-orchestra-festival-xviii-night-2-tickets-2002565993795' },
      { label: 'Sat 28: Night 3, University of Glasgow Concert Hall', url: 'https://www.eventbrite.co.uk/e/glasgow-improvisers-orchestra-festival-xviii-night-3-tickets-2002567061990' },
    ],
  },
  {
    when: '1–4 Dec 2026', title: 'Improfest-Unicamp', where: 'Unicamp, Campinas',
    note: 'Four days with Improfest-Unicamp at the Universidade Estadual de Campinas, opening the Brazil strand of SYZYGY. The full programme and links are coming soon.',
    href: '/work/syzygy/',
  },
  {
    when: '12 Dec 2026', title: 'Improfest: Brutalust and Paulo Hartmann', where: 'Audio Rebel, Botafogo, Rio de Janeiro',
    note: 'The 19th Improfest, and its first edition in Rio. Brutalust (Colin Frank and me) play as a trio with Brazilian guitarist Paulo Hartmann on prepared guitar, reunited after playing together with the Glasgow Improvisers Orchestra. Saturday afternoon, R$35 in advance, R$45 on the door.',
    href: '/collaborations/brutalust/',
    links: [
      { label: 'Tickets and details', url: 'https://audiorebel.com.br/agenda/improfest-brutalust-e-paulo-hartmann-na-audio-rebel' },
    ],
  },
  {
    when: '15 Dec 2026', title: 'Improfest: Brutalust and Paulo Hartmann', where: 'Sesc 24 de Maio, São Paulo',
    note: 'Brutalust (Colin Frank and me) with Paulo Hartmann, as part of Improfest: free improvisation, experimental music and new sound technologies. Tuesday, 8pm, in the theatre. Tickets R$15–50, on sale online from 8 December at 5pm (Brazil time).',
    href: '/collaborations/brutalust/',
    links: [
      { label: 'Tickets and details', url: 'https://www.sescsp.org.br/programacao/brutalust/' },
    ],
  },
  { when: '28 Apr 2027', title: 'Noisebringers', where: 'Hošek Contemporary, Berlin', note: 'A Noisebringers evening on the boat in Berlin-Mitte.', href: '/collaborations/noisebringers/' },
  { when: '2027', title: 'Orpheus Institute Visiting Fellowship', where: 'Ghent', note: 'Futures in Artistic Research: developing the Posthuman Immigrant Toolkit.', href: '/research/' },
  { when: '2026–27', title: 'Climbing on Lyme', where: 'With Kate Steenhauer and NHS Grampian', note: 'Arts and health research on women’s experiences of chronic illness.', href: 'https://katesteenhauer.com/climbing-on-lyme/' },
];

export const recent = [
  { when: 'November 2026', title: 'SYZYGY at SOUND/IMAGE', where: 'University of Greenwich, London', note: 'A mixed-reality composition workshop by Brutalust Immersive Studios.', href: '/work/syzygy/' },
  { when: 'October 2026', title: 'BUZZ', where: 'Glasgow Improvisers Orchestra with Fred Frith', note: 'New album on scatterArchive, with me on piano.', href: '/work/buzz/' },
  { when: 'September 2026', title: 'Rivers and Other Mother Tongues', where: 'Gaudeamus Festival, Utrecht', note: 'A site-responsive iteration of ZEMI, in Resisting Waters.', href: '/work/rivers-and-other-mother-tongues/' },
  { when: '2026', title: 'Meet Music Code Festival', where: 'Switzerland', note: 'Feminist tech practices concert and workshop.' },
  { when: 'June 2026', title: 'Best Installation, NIME', where: 'London', note: 'Zemi, with Colin Frank.', href: '/awards/nime-2026-best-installation.pdf' },
  { when: 'June 2026', title: 'Intelligences from the Underground symposium', where: 'Royal Conservatoire of Scotland', note: 'Two days of talks, labs and performance.', href: 'https://undergroundintelligences.com' },
  { when: 'March 2026', title: 'Soundtracks', where: 'Soundplay Projects, Glasgow', note: 'Workshop with Colin Frank.' },
  { when: 'March 2026', title: 'Improv Matinee', where: 'The Glad Cafe, Glasgow', note: 'With Una MacGlone, Colin Frank and J. McEwan.' },
  { when: 'January 2026', title: 'Split Screen keynote', where: 'Civic House, Glasgow', note: 'On experimental instrument-building and AI.' },
  { when: '2026', title: 'Celebrating Monk', where: 'Scatter Archive', note: 'Live album with Pat Thomas and the Glasgow Improvisers Orchestra, including my Monk at the Border.', href: '/work/monk-at-the-border/' },
];

// Shown on the home page until the date passes, then they disappear by themselves.
export const homeNext = [
  { label: 'GIOfest XVIII, Glasgow, 26–28 Nov', href: '/now/', until: '2026-11-29' },
  { label: 'Improfest-Unicamp, Campinas, 1–4 Dec', href: '/work/syzygy/', until: '2026-12-05' },
  { label: 'Improfest: Brutalust and Paulo Hartmann, Rio de Janeiro, 12 Dec', href: '/collaborations/brutalust/', until: '2026-12-13' },
  { label: 'Improfest: Brutalust and Paulo Hartmann, São Paulo, 15 Dec', href: '/collaborations/brutalust/', until: '2026-12-16' },
];
