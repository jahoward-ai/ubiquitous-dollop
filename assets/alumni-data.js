// HCG alumni summary, built from the HCG Alumni sheet (October 2026).
// Anonymous on purpose: only totals, employer counts, and city counts. Never add names,
// titles, emails, or LinkedIn links here.
window.HCG_ALUMNI = {
  // Live updates: paste the two "Publish to web" CSV links from the public counts sheet
  // (see README, "Live alumni numbers"). Leave empty to use the numbers below.
  live: {
    employersCsv: '',
    citiesCsv: '',
    sourceLabel: 'HCG alumni list, updated automatically',
  },
  source: 'HCG alumni list, October 2026',
  total: 117,            // alumni on the list
  classYears: '1982–2027',

  // Types of consulting, in the order they appear on the Alumni page.
  categories: [
    { id: 'strategy', name: 'Generalist strategy consulting', blurb: 'Management consulting firms that advise leadership on strategy across industries.' },
    { id: 'professional', name: 'Big Four & management consulting', blurb: 'Large professional-services firms: strategy, operations, technology, and transformation.' },
    { id: 'economic', name: 'Economic, litigation & financial advisory', blurb: 'Economists and analysts supporting antitrust, litigation, valuation, and disputes.' },
    { id: 'people', name: 'Compensation, HR & benefits consulting', blurb: 'Executive pay, rewards, benefits, and workforce advice.' },
    { id: 'specialist', name: 'Industry & specialist consulting', blurb: 'Firms focused on one industry or function: life sciences, energy, public sector, data, sales.' },
    { id: 'other-consulting', name: 'Other consulting', blurb: 'Smaller and student consulting groups.' },
    { id: 'adjacent', name: 'Consulting-adjacent', blurb: 'Investing, research, technology, and public service: roles consultants often move into.' },
  ],

  // Which type each employer belongs to. A new employer in the sheet that is not listed here
  // shows under "Not yet categorized" until a line is added.
  categoryOf: {
    'McKinsey & Company': 'strategy', 'Bain & Company': 'strategy', 'Boston Consulting Group': 'strategy',
    'L.E.K. Consulting': 'strategy', 'Oliver Wyman': 'strategy', 'EY-Parthenon': 'strategy', 'Stax': 'strategy',
    'Deloitte': 'professional', 'PwC': 'professional', 'Accenture': 'professional', 'Point B': 'professional',
    'Analysis Group': 'economic', 'NERA Economic Consulting': 'economic', 'The Brattle Group': 'economic',
    'Compass Lexecon': 'economic', 'Charles River Associates': 'economic', 'Cornerstone Research': 'economic',
    'Econic Partners': 'economic', 'FTI Consulting': 'economic', 'Stout': 'economic',
    'Semler Brossy': 'people', 'AON': 'people', 'Alpine Rewards': 'people', 'Segal': 'people',
    'Blue Matter': 'specialist', 'SciVida': 'specialist', 'Clarkston': 'specialist', 'Wood Mackenzie': 'specialist',
    'WAP Sustainability Consulting': 'specialist', 'Public Consulting Group': 'specialist', 'APCO': 'specialist',
    'Activate Consulting': 'specialist', 'SDG Group USA': 'specialist', 'Alexander Group': 'specialist',
    'Simon Vision Consulting': 'other-consulting', "Berry's Brook Consulting LLC": 'other-consulting', 'Kinetic Systems': 'other-consulting',
    'Third Bridge Group Limited': 'adjacent', 'Bain Capital': 'adjacent', 'Lord Abbett': 'adjacent', 'Putnam': 'adjacent',
    'Empower': 'adjacent', 'Google': 'adjacent', 'Veeva Systems': 'adjacent', 'ALKU': 'adjacent', '8am': 'adjacent',
    'SecurEvent Solutions': 'adjacent', 'Government office': 'adjacent',
  },
  // Sheet names that should be shown differently (for example, cut-off names).
  displayName: {
    'Office of the Senior Advisor for Tr': 'Government office',
  },

  // Every employer and how many HCG alumni work there.
  employerCounts: [
    { name: 'L.E.K. Consulting', count: 13 }, { name: 'Bain & Company', count: 11 }, { name: 'McKinsey & Company', count: 11 },
    { name: 'Boston Consulting Group', count: 10 }, { name: 'Semler Brossy', count: 9 }, { name: 'Deloitte', count: 6 },
    { name: 'Analysis Group', count: 5 }, { name: 'NERA Economic Consulting', count: 3 }, { name: 'AON', count: 2 },
    { name: 'FTI Consulting', count: 2 }, { name: 'Lord Abbett', count: 2 }, { name: 'PwC', count: 2 },
    { name: 'The Brattle Group', count: 2 }, { name: '8am', count: 1 }, { name: 'Accenture', count: 1 },
    { name: 'Activate Consulting', count: 1 }, { name: 'Alexander Group', count: 1 }, { name: 'ALKU', count: 1 },
    { name: 'Alpine Rewards', count: 1 }, { name: 'APCO', count: 1 }, { name: 'Bain Capital', count: 1 },
    { name: "Berry's Brook Consulting LLC", count: 1 }, { name: 'Blue Matter', count: 1 }, { name: 'Charles River Associates', count: 1 },
    { name: 'Clarkston', count: 1 }, { name: 'Compass Lexecon', count: 1 }, { name: 'Cornerstone Research', count: 1 },
    { name: 'Econic Partners', count: 1 }, { name: 'Empower', count: 1 }, { name: 'EY-Parthenon', count: 1 },
    { name: 'Google', count: 1 }, { name: 'Government office', count: 1 }, { name: 'Kinetic Systems', count: 1 },
    { name: 'Oliver Wyman', count: 1 }, { name: 'Point B', count: 1 }, { name: 'Public Consulting Group', count: 1 },
    { name: 'Putnam', count: 1 }, { name: 'SciVida', count: 1 }, { name: 'SDG Group USA', count: 1 },
    { name: 'SecurEvent Solutions', count: 1 }, { name: 'Segal', count: 1 }, { name: 'Simon Vision Consulting', count: 1 },
    { name: 'Stax', count: 1 }, { name: 'Stout', count: 1 }, { name: 'Third Bridge Group Limited', count: 1 },
    { name: 'Veeva Systems', count: 1 }, { name: 'WAP Sustainability Consulting', count: 1 }, { name: 'Wood Mackenzie', count: 1 },
  ],

  // City counts only, grouped into metro areas (e.g. Cambridge and Natick count as the Boston area).
  places: [
    { city: 'New York area', lat: 40.71, lng: -74.01, count: 36 },
    { city: 'Boston area', lat: 42.36, lng: -71.06, count: 35 },
    { city: 'Washington, DC area', lat: 38.91, lng: -77.04, count: 10 },
    { city: 'Chicago', lat: 41.88, lng: -87.63, count: 8 },
    { city: 'Dallas', lat: 32.78, lng: -96.80, count: 3 },
    { city: 'Los Angeles', lat: 34.05, lng: -118.24, count: 3 },
    { city: 'Philadelphia area', lat: 39.95, lng: -75.17, count: 3 },
    { city: 'Houston', lat: 29.76, lng: -95.37, count: 2 },
    { city: 'Minneapolis', lat: 44.98, lng: -93.27, count: 2 },
    { city: 'San Francisco Bay Area', lat: 37.77, lng: -122.42, count: 2 },
    { city: 'Cleveland', lat: 41.50, lng: -81.69, count: 1 },
    { city: 'Columbia, SC', lat: 34.00, lng: -81.03, count: 1 },
    { city: 'Hong Kong', lat: 22.32, lng: 114.17, count: 1 },
    { city: 'London', lat: 51.51, lng: -0.13, count: 1 },
    { city: 'Nairobi', lat: -1.29, lng: 36.82, count: 1 },
    { city: 'Rochester, NY', lat: 43.16, lng: -77.61, count: 1 },
    { city: 'Rome', lat: 41.90, lng: 12.50, count: 1 },
    { city: 'Seattle', lat: 47.61, lng: -122.33, count: 1 },
  ],
};
