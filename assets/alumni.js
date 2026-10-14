// Alumni numbers, firm chart, and globe, shared by both versions of the site.
// Reads window.HCG_ALUMNI from alumni-data.js (load that first).
//  - Any element with data-alumni="total" (or employers, located,
//    classYears, source, otherEmployers) gets that number or text.
//  - <div data-other-employers> gets an "Other" dropdown of employers with one alum each.
//  - <ul data-firm-bars data-limit="4"> gets a bar chart of the top employers.
//  - <div id="globe" class="globe"> plus an optional <ul data-places> gets the 3D globe
//    (also needs topojson-client and globe.gl loaded before this file).
(() => {
  const data = window.HCG_ALUMNI;
  if (!data) return;
  data.otherEmployers = data.other.length;
  document.querySelectorAll('[data-alumni]').forEach((el) => { el.textContent = data[el.dataset.alumni]; });
  document.querySelectorAll('[data-firm-bars]').forEach((ul) => {
    const firms = data.firms.slice(0, +(ul.dataset.limit || data.firms.length));
    const max = Math.max(...firms.map((f) => f.count));
    ul.innerHTML = firms.map((f) => `<li data-tip="${f.name}: ${f.count} HCG alumni" title="${f.name}: ${f.count} HCG alumni" tabindex="0"><span class="name">${f.name}</span><span class="track-bar"><span class="fill" style="width:${(f.count / max * 100).toFixed(2)}%"></span></span><span class="val">${f.count}</span></li>`).join('');
  });

  document.querySelectorAll('[data-other-employers]').forEach((box) => {
    box.innerHTML = `<details class="other-employers"><summary>Other <span>${data.other.length} employers with one HCG alum each</span></summary><ul>${data.other.map((n) => `<li>${n}</li>`).join('')}</ul></details>`;
  });

  const globeEl = document.getElementById('globe');
  if (!globeEl) return;
  const here = document.currentScript ? new URL('.', document.currentScript.src).href : '';
  const places = data.places || [];
  const origin = { lat: 43.0526, lng: -75.4060 };
  const label = (p) => `${p.city}: ${p.count} ${p.count === 1 ? 'alum' : 'alumni'}`;
  const list = document.querySelector('[data-places]');
  if (list) list.innerHTML = places.map((p, i) => `<li><button type="button" data-i="${i}">${p.city}</button><span>${p.count}</span></li>`).join('');

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
    const globe = window.Globe({ animateIn: !reduce })(globeEl)
      .width(w).height(h)
      .backgroundColor('rgba(0,0,0,0)')
      .showAtmosphere(true).atmosphereColor('#7f9fe0').atmosphereAltitude(0.16)
      .hexPolygonsData(countries).hexPolygonResolution(3).hexPolygonMargin(0.35)
      .hexPolygonColor(() => 'rgba(214, 223, 239, 0.55)')
      .pointsData([...places, { ...origin, origin: true }])
      .pointLat('lat').pointLng('lng')
      .pointColor((d) => (d.origin ? '#ffffff' : '#c9ad6a'))
      .pointAltitude((d) => (d.origin ? 0.01 : 0.02 + Math.sqrt(d.count) * 0.04))
      .pointRadius((d) => (d.origin ? 0.5 : 0.35 + Math.sqrt(d.count) * 0.12))
      .pointLabel((d) => (d.origin ? 'Hamilton College, Clinton, NY' : label(d)))
      .arcsData(places.map((p) => ({ startLat: origin.lat, startLng: origin.lng, endLat: p.lat, endLng: p.lng })))
      .arcColor(() => ['rgba(255,255,255,0.15)', '#c9ad6a'])
      .arcStroke(0.5)
      .arcDashLength(reduce ? 1 : 0.5).arcDashGap(reduce ? 0 : 0.25).arcDashAnimateTime(reduce ? 0 : 2600)
      .pointOfView({ lat: 38, lng: -60, altitude: 2.2 });
    globe.globeMaterial().color.set('#0b2a6f');
    const controls = globe.controls();
    controls.enableZoom = false;
    controls.autoRotate = !reduce;
    controls.autoRotateSpeed = 0.35;
    addEventListener('resize', () => { const [nw, nh] = size(); globe.width(nw).height(nh); });
    list?.addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      const p = places[+b.dataset.i];
      controls.autoRotate = false;
      globe.pointOfView({ lat: p.lat, lng: p.lng, altitude: 1.3 }, 1200);
    });
    globeEl.querySelector('.globe-fallback')?.remove();
  };
  start().catch(() => {
    const fb = globeEl.querySelector('.globe-fallback');
    if (fb) fb.textContent = 'The 3D globe could not load in this browser. The list beside it shows the same cities.';
  });
})();
