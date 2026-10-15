// HCG alumni summary, built from the HCG Alumni sheet (October 2026).
// Anonymous on purpose: only totals, firm counts, and city counts. Never add names,
// titles, emails, or LinkedIn links here. To update, recount from the sheet and edit the numbers.
window.HCG_ALUMNI = {
  // Live updates: paste the two "Publish to web" CSV links from the public counts sheet
  // (see README, "Live alumni numbers"). Leave empty to use the numbers below.
  live: {
    employersCsv: '',
    citiesCsv: '',
    sourceLabel: 'HCG alumni list, updated automatically',
  },
  source: 'HCG alumni list, October 2026',
  total: 113,            // alumni on the list
  withEmployer: 109,     // alumni with an employer listed
  employers: 46,         // different employers
  classYears: '1982–2027',
  // Employers with 2 or more HCG alumni (shown as bars).
  firms: [
    { name: 'L.E.K. Consulting', count: 13 },
    { name: 'McKinsey & Company', count: 11 },
    { name: 'Bain & Company', count: 10 },
    { name: 'Boston Consulting Group', count: 10 },
    { name: 'Semler Brossy', count: 9 },
    { name: 'Deloitte', count: 6 },
    { name: 'Analysis Group', count: 5 },
    { name: 'NERA Economic Consulting', count: 3 },
    { name: 'AON', count: 2 },
    { name: 'Lord Abbett', count: 2 },
    { name: 'PwC', count: 2 },
    { name: 'The Brattle Group', count: 2 },
  ],
  // Employers with exactly 1 HCG alum (shown in the "Other" dropdown). Employer names only.
  other: [
    '8am', 'Accenture', 'Activate Consulting', 'Alexander Group', 'ALKU', 'Alpine Rewards', 'APCO',
    "Berry's Brook Consulting LLC", 'Blue Matter', 'Charles River Associates', 'Clarkston',
    'Compass Lexecon', 'Cornerstone Research', 'Econic Partners', 'Empower', 'EY-Parthenon',
    'FTI Consulting', 'Google', 'Kinetic Systems', 'Oliver Wyman', 'Point B',
    'Public Consulting Group', 'Putnam', 'SciVida', 'SDG Group USA', 'SecurEvent Solutions', 'Segal',
    'Simon Vision Consulting', 'Stax', 'Stout', 'Third Bridge Group Limited', 'Veeva Systems',
    'WAP Sustainability Consulting', 'Wood Mackenzie',
  ],
  noEmployer: 4,         // alumni with no employer listed
  located: 42,           // alumni with a city listed (shown on the globe)
  // City counts only. Natick is counted in the Boston area.
  places: [
    { city: 'Boston area', lat: 42.36, lng: -71.06, count: 17 },
    { city: 'New York', lat: 40.71, lng: -74.01, count: 10 },
    { city: 'Chicago', lat: 41.88, lng: -87.63, count: 2 },
    { city: 'Dallas', lat: 32.78, lng: -96.80, count: 2 },
    { city: 'Los Angeles', lat: 34.05, lng: -118.24, count: 2 },
    { city: 'Minneapolis', lat: 44.98, lng: -93.27, count: 2 },
    { city: 'Washington, DC', lat: 38.91, lng: -77.04, count: 2 },
    { city: 'Hong Kong', lat: 22.32, lng: 114.17, count: 1 },
    { city: 'Italy', lat: 41.90, lng: 12.50, count: 1 },
    { city: 'London', lat: 51.51, lng: -0.13, count: 1 },
    { city: 'Philadelphia', lat: 39.95, lng: -75.17, count: 1 },
    { city: 'Seattle', lat: 47.61, lng: -122.33, count: 1 },
  ],
};
