// Alumni numbers, employer chart, and globe.
// Reads window.HCG_ALUMNI from alumni-data.js (load that first).
//  - Any element with data-alumni="total" (or employers, located, classYears, source,
//    otherEmployers) gets that number or text.
//  - <ul data-firm-bars data-limit="4"> gets a bar chart of employers with 2+ alumni.
//  - <div data-other-employers> gets an "Other" dropdown of employers with one alum each.
//  - <div data-categories> gets the breakdown by type of consulting, each type expandable.
//  - <div id="globe" class="globe"> plus an optional <ul data-places> gets the 3D globe
//    (also needs topojson-client and globe.gl loaded before this file).
// If HCG_ALUMNI.live has published Google Sheet links, the numbers are refreshed from the
// sheet every time the page loads; the numbers in alumni-data.js are shown until then.
(() => {
  const data = window.HCG_ALUMNI;
  if (!data) return;
  const here = document.currentScript ? new URL('.', document.currentScript.src).href : '';
  let onPlaces = () => {};

  // City name in the sheet -> metro area on the globe (first match wins). Add a line for a new city.
  const AREAS = [
    [/rochest/i, 'Rochester, NY', 43.16, -77.61],
    [/boston|cambridge, ma|somerville|natick|danvers|newton, ma|waltham|quincy, ma/i, 'Boston area', 42.36, -71.06],
    [/new york|brooklyn|queens|white plains|bayonne|manhattan|jersey city|hoboken|stamford|greenwich/i, 'New York area', 40.71, -74.01],
    [/washington|baltimore|arlington, v|alexandria, v|bethesda|mclean/i, 'Washington, DC area', 38.91, -77.04],
    [/chicago|evanston/i, 'Chicago', 41.88, -87.63], [/los angeles|santa monica/i, 'Los Angeles', 34.05, -118.24],
    [/san francisco|bay are|palo alto|oakland|san jose|menlo park/i, 'San Francisco Bay Area', 37.77, -122.42],
    [/philadelphia|wayne, p/i, 'Philadelphia area', 39.95, -75.17], [/dallas|fort worth/i, 'Dallas', 32.78, -96.80],
    [/houston/i, 'Houston', 29.76, -95.37], [/austin, t/i, 'Austin', 30.27, -97.74], [/minneapolis|st\.? paul/i, 'Minneapolis', 44.98, -93.27],
    [/seattle/i, 'Seattle', 47.61, -122.33], [/denver|boulder/i, 'Denver', 39.74, -104.99], [/atlanta/i, 'Atlanta', 33.75, -84.39],
    [/miami/i, 'Miami', 25.76, -80.19], [/charlotte/i, 'Charlotte', 35.23, -80.84], [/nashville/i, 'Nashville', 36.16, -86.78],
    [/cleveland/i, 'Cleveland', 41.50, -81.69], [/detroit/i, 'Detroit', 42.33, -83.05], [/pittsburgh/i, 'Pittsburgh', 40.44, -79.99],
    [/columbia, s/i, 'Columbia, SC', 34.00, -81.03], [/san diego/i, 'San Diego', 32.72, -117.16], [/portland, o/i, 'Portland', 45.52, -122.68],
    [/hartford/i, 'Hartford', 41.76, -72.67], [/new haven/i, 'New Haven', 41.31, -72.92], [/providence/i, 'Providence', 41.82, -71.41],
    [/albany/i, 'Albany', 42.65, -73.75], [/syracuse/i, 'Syracuse', 43.05, -76.15], [/clinton, n/i, 'Clinton, NY', 43.05, -75.38],
    [/toronto/i, 'Toronto', 43.65, -79.38], [/montr[eé]al/i, 'Montréal', 45.50, -73.57], [/london/i, 'London', 51.51, -0.13],
    [/paris/i, 'Paris', 48.86, 2.35], [/madrid/i, 'Madrid', 40.42, -3.70], [/milan/i, 'Milan', 45.46, 9.19], [/rome|italy/i, 'Rome', 41.90, 12.50],
    [/zurich|zürich/i, 'Zurich', 47.38, 8.54], [/munich|münchen/i, 'Munich', 48.14, 11.58], [/berlin/i, 'Berlin', 52.52, 13.40],
    [/amsterdam/i, 'Amsterdam', 52.37, 4.90], [/dublin/i, 'Dublin', 53.35, -6.26], [/hong kong/i, 'Hong Kong', 22.32, 114.17],
    [/singapore/i, 'Singapore', 1.35, 103.82], [/tokyo/i, 'Tokyo', 35.68, 139.69], [/shanghai/i, 'Shanghai', 31.23, 121.47],
    [/beijing/i, 'Beijing', 39.90, 116.41], [/seoul/i, 'Seoul', 37.57, 126.98], [/mumbai/i, 'Mumbai', 19.08, 72.88],
    [/dubai/i, 'Dubai', 25.20, 55.27], [/sydney/i, 'Sydney', -33.87, 151.21], [/nairobi/i, 'Nairobi', -1.29, 36.82],
    [/s[aã]o paulo/i, 'São Paulo', -23.55, -46.63], [/mexico city/i, 'Mexico City', 19.43, -99.13],
  ];
  const areaFor = (name) => AREAS.find(([re]) => re.test(name));

  // Totals, top employers, and the "Other" list all come from employerCounts.
  const derive = () => {
    const counts = [...data.employerCounts].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
    data.firms = counts.filter((f) => f.count >= 2);
    data.other = counts.filter((f) => f.count === 1).map((f) => f.name).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
    data.employers = counts.length;
    data.withEmployer = counts.reduce((sum, f) => sum + f.count, 0);
    data.located = (data.places || []).reduce((sum, p) => sum + p.count, 0);
    data.categoryCount = data.categories.length;
  };
  const esc = (t) => String(t).replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));

  const render = () => {
    derive();
    data.otherEmployers = data.other.length;
    document.querySelectorAll('[data-alumni]').forEach((el) => { if (data[el.dataset.alumni] !== undefined) el.textContent = data[el.dataset.alumni]; });
    document.querySelectorAll('[data-firm-bars]').forEach((ul) => {
      const firms = data.firms.slice(0, +(ul.dataset.limit || data.firms.length));
      const max = Math.max(...firms.map((f) => f.count));
      ul.innerHTML = firms.map((f) => `<li data-tip="${f.name}: ${f.count} HCG alumni" title="${f.name}: ${f.count} HCG alumni" tabindex="0"><span class="name">${f.name}</span><span class="track-bar"><span class="fill" style="width:${(f.count / max * 100).toFixed(2)}%;--w:${(f.count / max * 100).toFixed(2)}%"></span></span><span class="val" data-count="${f.count}">${f.count}</span></li>`).join('');
      // Bars marked "grow" fill in and count up the first time they scroll into view.
      if (ul.classList.contains('grow') && !ul.dataset.watched) {
        ul.dataset.watched = '1';
        const run = () => {
          ul.classList.add('in');
          if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
          ul.querySelectorAll('[data-count]').forEach((el) => {
            const end = +el.dataset.count; const t0 = performance.now();
            const tick = (t) => { const k = Math.min(1, (t - t0) / 1100); el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(tick); };
            requestAnimationFrame(tick);
          });
        };
        if ('IntersectionObserver' in window) {
          const io = new IntersectionObserver((entries) => { if (entries.some((e) => e.isIntersecting)) { io.disconnect(); run(); } }, { threshold: 0.35 });
          io.observe(ul);
        } else run();
      } else if (ul.dataset.watched) ul.classList.add('in');
    });
    document.querySelectorAll('[data-other-employers]').forEach((box) => {
      const wasOpen = box.querySelector('details')?.open;
      box.innerHTML = `<details class="other-employers"${wasOpen ? ' open' : ''}><summary>Other <span>${data.other.length} employers with one HCG alum each</span></summary><ul>${data.other.map((n) => `<li>${n}</li>`).join('')}</ul></details>`;
    });
    document.querySelectorAll('[data-categories]').forEach((box) => {
      const groups = data.categories.map((c) => ({ ...c, firms: [] }));
      const uncategorized = { id: 'uncategorized', name: 'Not yet categorized', blurb: 'New employers from the sheet. Add them to categoryOf in assets/alumni-data.js.', firms: [] };
      data.employerCounts.forEach((f) => (groups.find((g) => g.id === data.categoryOf[f.name]) || uncategorized).firms.push(f));
      if (uncategorized.firms.length) groups.push(uncategorized);
      groups.forEach((g) => { g.total = g.firms.reduce((sum, f) => sum + f.count, 0); g.firms.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name)); });
      const max = Math.max(...groups.map((g) => g.total));
      const open = new Set([...box.querySelectorAll('details[open]')].map((d) => d.dataset.id));
      box.innerHTML = groups.filter((g) => g.total).map((g) => `<details class="type-row" data-id="${g.id}"${open.has(g.id) ? ' open' : ''}>
        <summary><span class="type-name"><strong>${esc(g.name)}</strong><small>${esc(g.blurb)}</small></span><span class="type-bar" aria-hidden="true"><span style="width:${(g.total / max * 100).toFixed(2)}%"></span></span><span class="type-count">${g.total}<small>${Math.round(g.total / data.withEmployer * 100)}%</small></span></summary>
        <ul>${g.firms.map((f) => `<li><span>${esc(f.name)}</span><span>${f.count}</span></li>`).join('')}</ul>
      </details>`).join('');
    });
    onPlaces();
  };

  // ---- Live numbers from a published Google Sheet ---------------------------------
  const parseCsv = (text) => text.trim().split(/\r?\n/).map((line) => {
    const cells = []; let cur = ''; let quoted = false;
    for (let i = 0; i < line.length; i += 1) {
      const ch = line[i];
      if (quoted) { if (ch === '"' && line[i + 1] === '"') { cur += '"'; i += 1; } else if (ch === '"') quoted = false; else cur += ch; }
      else if (ch === '"') quoted = true; else if (ch === ',') { cells.push(cur.trim()); cur = ''; } else cur += ch;
    }
    cells.push(cur.trim());
    // Rows are "name, number". If a name contains an unquoted comma ("Boston, MA"), rejoin it.
    const blank = cells.slice(2).every((c) => c === '');
    if (cells.length > 2 && !blank && /^\d+$/.test(cells[cells.length - 1])) return [cells.slice(0, -1).join(', '), cells[cells.length - 1]];
    return cells.slice(0, 2);
  });
  const applyEmployers = (rows) => {
    const counts = new Map();
    rows.forEach(([raw, value]) => {
      const n = Number(value);
      if (!raw) return;
      if (/^total alumni$/i.test(raw) && n) data.total = n;
      else if (/^class years$/i.test(raw) && value) data.classYears = value;
      else if (n > 0) {
        const name = (data.displayName && data.displayName[raw]) || raw;
        counts.set(name, (counts.get(name) || 0) + n);
      }
    });
    if (counts.size) data.employerCounts = [...counts].map(([name, count]) => ({ name, count }));
  };
  const applyCities = (rows) => {
    const merged = new Map();
    rows.forEach(([name, value]) => {
      const n = Number(value);
      if (!name || !(n > 0)) return;
      const hit = areaFor(name);
      if (!hit) console.warn(`Alumni globe: no map position for "${name}". Add it to AREAS in assets/alumni.js.`);
      const [, city, lat, lng] = hit || [null, name, null, null];
      const prev = merged.get(city) || { city, lat, lng, count: 0 };
      prev.count += n;
      merged.set(city, prev);
    });
    if (merged.size) data.places = [...merged.values()].sort((a, b) => b.count - a.count || a.city.localeCompare(b.city));
  };
  const live = data.live || {};
  if (live.employersCsv || live.citiesCsv) {
    const get = (url) => (url ? fetch(url).then((r) => (r.ok ? r.text() : Promise.reject())).then(parseCsv) : Promise.reject());
    Promise.allSettled([get(live.employersCsv), get(live.citiesCsv)]).then(([emp, cit]) => {
      if (emp.status === 'fulfilled') applyEmployers(emp.value);
      if (cit.status === 'fulfilled') applyCities(cit.value);
      if (emp.status === 'fulfilled' || cit.status === 'fulfilled') { data.source = live.sourceLabel || data.source; render(); }
    });
  }

  // ---- Globe ------------------------------------------------------------------------
  const globeEl = document.getElementById('globe');
  const list = document.querySelector('[data-places]');
  const origin = { lat: 43.0526, lng: -75.4060 };
  const onMap = () => (data.places || []).filter((p) => p.lat !== null && p.lat !== undefined);
  const label = (p) => `${p.city}: ${p.count} ${p.count === 1 ? 'alum' : 'alumni'}`;
  let globe = null;
  let controls = null;
  // Cities with 3+ alumni are listed; cities with 1 or 2 go in an "Other" dropdown.
  const OTHER_BELOW = 3;
  const drawList = () => {
    if (!list) return;
    const row = (p) => {
      const i = data.places.indexOf(p);
      return `<li>${p.lat !== null && p.lat !== undefined ? `<button type="button" data-i="${i}">${p.city}</button>` : `<span>${p.city}</span>`}<span>${p.count}</span></li>`;
    };
    const many = (data.places || []).filter((p) => p.count >= OTHER_BELOW);
    const ones = (data.places || []).filter((p) => p.count < OTHER_BELOW);
    const wasOpen = list.querySelector('.places-other details')?.open;
    list.innerHTML = many.map(row).join('') + (ones.length
      ? `<li class="places-other"><details${wasOpen ? ' open' : ''}><summary>Other <span>${ones.length} ${ones.length === 1 ? 'city' : 'cities'} with 1–2 alumni</span></summary><ul>${ones.map(row).join('')}</ul></details></li>`
      : '');
  };
  const drawGlobe = () => {
    if (!globe) return;
    const places = onMap();
    globe.pointsData([...places, { ...origin, origin: true }])
      .arcsData(places.map((p) => ({ startLat: origin.lat, startLng: origin.lng, endLat: p.lat, endLng: p.lng })));
  };
  onPlaces = () => { drawList(); drawGlobe(); };

  render();
  if (!globeEl) return;

  list?.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b || !globe) return;
    const p = data.places[+b.dataset.i];
    controls.autoRotate = false;
    globe.pointOfView({ lat: p.lat, lng: p.lng, altitude: 1.3 }, 1200);
  });

  const start = async () => {
    if (!window.Globe || !window.topojson) throw new Error('globe library unavailable');
    const world = await fetch(`${here}data/countries-110m.json`).then((r) => r.json());
    const countries = window.topojson.feature(world, world.objects.countries).features;
    // The hexagon map library cannot process North Korea's detailed outline (it throws),
    // so that one country uses a simplified outline that looks the same at this dot size.
    const nk = countries.find((c) => c.id === '408');
    if (nk) nk.geometry = { type: 'Polygon', coordinates: [[[124.3, 40.0], [125.0, 40.6], [126.9, 41.8], [128.1, 42.0], [129.7, 42.4], [130.6, 42.4], [129.9, 41.0], [129.2, 40.7], [127.5, 39.6], [128.3, 38.6], [127.0, 38.3], [126.1, 37.7], [125.3, 37.7], [124.7, 38.1], [125.3, 38.6], [125.1, 39.6], [124.3, 40.0]]] };
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const size = () => { const w = globeEl.clientWidth; return [w, Math.min(w, 640)]; };
    const [w, h] = size();
    globe = window.Globe({ animateIn: !reduce })(globeEl)
      .width(w).height(h)
      .backgroundColor('rgba(0,0,0,0)')
      .showAtmosphere(true).atmosphereColor('#7f9fe0').atmosphereAltitude(0.16)
      .hexPolygonsData(countries).hexPolygonResolution(3).hexPolygonMargin(0.35)
      .hexPolygonColor(() => 'rgba(214, 223, 239, 0.55)')
      .pointLat('lat').pointLng('lng')
      .pointColor((d) => (d.origin ? '#ffffff' : '#c9ad6a'))
      .pointAltitude((d) => (d.origin ? 0.01 : 0.02 + Math.sqrt(d.count) * 0.04))
      .pointRadius((d) => (d.origin ? 0.5 : 0.35 + Math.sqrt(d.count) * 0.12))
      .pointLabel((d) => (d.origin ? 'Hamilton College, Clinton, NY' : label(d)))
      .arcColor(() => ['rgba(255,255,255,0.15)', '#c9ad6a'])
      .arcStroke(0.5)
      .arcDashLength(reduce ? 1 : 0.5).arcDashGap(reduce ? 0 : 0.25).arcDashAnimateTime(reduce ? 0 : 2600)
      .pointOfView({ lat: 38, lng: -60, altitude: 2.2 });
    globe.globeMaterial().color.set('#0b2a6f');
    controls = globe.controls();
    controls.enableZoom = false;
    controls.autoRotate = !reduce;
    controls.autoRotateSpeed = 0.35;
    drawGlobe();
    addEventListener('resize', () => { const [nw, nh] = size(); globe.width(nw).height(nh); });
    globeEl.querySelector('.globe-fallback')?.remove();
  };
  start().catch(() => {
    const fb = globeEl.querySelector('.globe-fallback');
    if (fb) fb.textContent = 'The 3D globe could not load in this browser. The list beside it shows the same cities.';
  });
})();
