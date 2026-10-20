const STORAGE_KEY = 'shortwave.receiver.v1';
const $ = (id) => document.getElementById(id);

const STATIONS = [
  {
    frequency: 620,
    name: 'Voice of the Coast',
    location: 'Portland, Maine',
    power: '50 kW',
    language: 'English',
    genre: 'Coastal news & music',
    programmes: [
      { from: 0, to: 6, title: 'The Owl Shift', host: 'Mara Bell' },
      { from: 6, to: 12, title: 'Tide Tables', host: 'Owen Price' },
      { from: 12, to: 18, title: 'Harbour Lights', host: 'June Alder' },
      { from: 18, to: 24, title: 'The Long Shore', host: 'Mara Bell' }
    ]
  },
  {
    frequency: 740,
    name: 'The Night Ferry',
    location: 'Halifax, Nova Scotia',
    power: '25 kW',
    language: 'English / French',
    genre: 'Late-night talk',
    programmes: [
      { from: 0, to: 5, title: 'Crossing No. 3', host: 'Émile Roux' },
      { from: 5, to: 11, title: 'Morning Landing', host: 'Ada Fraser' },
      { from: 11, to: 19, title: 'The Middle Watch', host: 'Nell Cormier' },
      { from: 19, to: 24, title: 'Last Boat Home', host: 'Émile Roux' }
    ]
  },
  {
    frequency: 860,
    name: 'Radio Solstice',
    location: 'Reykjavík, Iceland',
    power: '10 kW',
    language: 'Icelandic / English',
    genre: 'Ambient & field notes',
    programmes: [
      { from: 0, to: 6, title: 'Low Light', host: 'Sigrún Hólm' },
      { from: 6, to: 12, title: 'Weather Diary', host: 'Arni Dahl' },
      { from: 12, to: 18, title: 'Open Window', host: 'Sigrún Hólm' },
      { from: 18, to: 24, title: 'Northern Static', host: 'Arni Dahl' }
    ]
  },
  {
    frequency: 980,
    name: 'Voz del Sur',
    location: 'Valparaíso, Chile',
    power: '40 kW',
    language: 'Spanish',
    genre: 'Boleros & bulletin',
    programmes: [
      { from: 0, to: 7, title: 'La Madrugada', host: 'Cecilia Vega' },
      { from: 7, to: 13, title: 'Puerto Abierto', host: 'Tomás Rivas' },
      { from: 13, to: 19, title: 'Marea Alta', host: 'Cecilia Vega' },
      { from: 19, to: 24, title: 'Noche de Bolero', host: 'Tomás Rivas' }
    ]
  },
  {
    frequency: 1120,
    name: 'Kestrel Radio',
    location: 'Winnipeg, Manitoba',
    power: '20 kW',
    language: 'English',
    genre: 'Prairie weather & farm news',
    programmes: [
      { from: 0, to: 5, title: 'Night Field', host: 'Ruth Emberly' },
      { from: 5, to: 12, title: 'The Grain Report', host: 'Cal Mercer' },
      { from: 12, to: 18, title: 'Wide Open', host: 'Ruth Emberly' },
      { from: 18, to: 24, title: 'Dust & Distance', host: 'Cal Mercer' }
    ]
  },
  {
    frequency: 1240,
    name: 'Radio Hearth',
    location: 'Cork, Ireland',
    power: '5 kW',
    language: 'English / Irish',
    genre: 'Folk & storytelling',
    programmes: [
      { from: 0, to: 6, title: 'The Quiet Kitchen', host: 'Niamh Byrne' },
      { from: 6, to: 12, title: 'Peat & Pine', host: 'Declan Ór' },
      { from: 12, to: 18, title: 'Afternoon Visitors', host: 'Niamh Byrne' },
      { from: 18, to: 24, title: 'The Fireside', host: 'Declan Ór' }
    ]
  },
  {
    frequency: 1380,
    name: 'Trans-Pacific Service',
    location: 'Honolulu, Hawaiʻi',
    power: '100 kW',
    language: 'English',
    genre: 'Shipping forecast & jazz',
    programmes: [
      { from: 0, to: 6, title: 'Blue Water', host: 'Lani Kea' },
      { from: 6, to: 12, title: 'Shipping Bulletin', host: 'Marcus Hale' },
      { from: 12, to: 18, title: 'Trade Winds', host: 'Lani Kea' },
      { from: 18, to: 24, title: 'After Hours Aloha', host: 'Marcus Hale' }
    ]
  },
  {
    frequency: 1560,
    name: 'The Long Wave',
    location: 'Tromsø, Norway',
    power: '8 kW',
    language: 'Norwegian / English',
    genre: 'Polar observations',
    programmes: [
      { from: 0, to: 7, title: 'Polar Night', host: 'Inger Vik' },
      { from: 7, to: 13, title: 'Ice Report', host: 'Sven Aas' },
      { from: 13, to: 19, title: 'White Room', host: 'Inger Vik' },
      { from: 19, to: 24, title: 'Aurora Watch', host: 'Sven Aas' }
    ]
  }
];

const state = {
  frequency: 620,
  volume: 34,
  powered: false,
  presets: [620, 860, 1120, 1380, 1560],
  log: [],
  storeMode: false
};

let audio = null;

function loadState() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!stored) return;
    if (Number.isFinite(stored.frequency)) state.frequency = Math.min(1600, Math.max(530, stored.frequency));
    if (Number.isFinite(stored.volume)) state.volume = Math.min(100, Math.max(0, stored.volume));
    if (Array.isArray(stored.presets) && stored.presets.length === 5) {
      state.presets = stored.presets.map((value) => Math.min(1600, Math.max(530, Number(value) || 620)));
    }
    if (Array.isArray(stored.log)) state.log = stored.log.slice(0, 12);
  } catch (error) {}
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      frequency: state.frequency,
      volume: state.volume,
      presets: state.presets,
      log: state.log
    }));
  } catch (error) {}
}

function nearestStation(frequency) {
  let station = null;
  let distance = Infinity;
  STATIONS.forEach((entry) => {
    const gap = Math.abs(entry.frequency - frequency);
    if (gap < distance) {
      distance = gap;
      station = entry;
    }
  });
  return { station, distance };
}

function signalInfo(frequency) {
  const { station, distance } = nearestStation(frequency);
  let signal = 4;
  let reception = 'Static · no carrier';
  let locked = false;
  if (distance <= 16) {
    locked = true;
    signal = Math.round(100 - distance * 3.2);
    reception = distance <= 3 ? 'Clear · full quieting' : distance <= 9 ? 'Good · slight fade' : 'Faint · adjacent channel';
  } else if (distance <= 45) {
    signal = Math.round(16 - distance * 0.16);
    reception = 'Bleed · tuning between stations';
  }
  return { station: locked ? station : null, nearest: station, distance, signal: Math.max(2, signal), reception, locked };
}

function showToast(message) {
  const toast = $('toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 2200);
}

function tuneTo(frequency) {
  state.frequency = Math.min(1600, Math.max(530, Math.round(frequency)));
  const input = $('tune');
  if (input.value !== String(state.frequency)) input.value = String(state.frequency);
  renderTuning();
  updateAudio();
  saveState();
}

function signalBars(signal) {
  const container = $('signal-bars');
  if (!container.children.length) {
    for (let index = 0; index < 12; index += 1) {
      container.appendChild(document.createElement('i'));
    }
  }
  const active = Math.round((signal / 100) * 12);
  Array.from(container.children).forEach((bar, index) => {
    bar.classList.toggle('on', index < active);
  });
}

function renderBandMarks() {
  const container = $('band-marks');
  container.innerHTML = '';
  for (let frequency = 530; frequency <= 1600; frequency += 10) {
    const mark = document.createElement('i');
    mark.className = `band-mark${frequency % 100 === 0 ? ' major' : ''}`;
    mark.style.left = `${((frequency - 530) / 1070) * 100}%`;
    if (frequency % 200 === 0 || frequency === 530 || frequency === 1600) {
      const label = document.createElement('span');
      label.textContent = String(frequency);
      mark.appendChild(label);
    }
    container.appendChild(mark);
  }
}

function renderTuning() {
  const info = signalInfo(state.frequency);
  const station = info.station;
  const needle = ((state.frequency - 530) / 1070) * 100;
  $('needle').style.left = `${needle}%`;
  $('frequency').textContent = String(state.frequency);
  $('station-name').textContent = station ? station.name : 'No carrier';
  $('station-meta').textContent = station
    ? `${station.location} · ${station.power} · ${station.language}`
    : `Nearest carrier ${info.nearest.frequency} kHz · keep tuning`;
  $('signal-label').textContent = `${info.signal}%`;
  $('reception-label').textContent = info.reception;
  signalBars(info.signal);
  $('stereo-lamp').classList.toggle('on', state.powered && info.locked);
  $('power-label').textContent = state.powered ? (station ? 'Receiving' : 'Listening') : 'Standby';
  $('power').setAttribute('aria-pressed', String(state.powered));
  $('band-label').textContent = info.locked ? 'Station locked' : 'Broadcast band';
  renderStationList(station);
  renderSchedule(station);
}

function renderStationList(activeStation) {
  const list = $('station-list');
  list.innerHTML = '';
  STATIONS.forEach((station) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `station-item${activeStation && activeStation.frequency === station.frequency ? ' active' : ''}`;
    button.innerHTML = `
      <b>${station.frequency}</b>
      <span class="station-copy"><strong>${station.name}</strong><small>${station.location}</small></span>
    `;
    button.addEventListener('click', () => {
      tuneTo(station.frequency);
      if (!state.powered) showToast('Power on to listen');
    });
    list.appendChild(button);
  });
  $('guide-count').textContent = `${STATIONS.length} stations`;
}

function renderSchedule(station) {
  const schedule = $('schedule');
  const title = $('schedule-station');
  const frequency = $('schedule-frequency');
  schedule.innerHTML = '';
  if (!station) {
    title.textContent = 'Off the dial';
    frequency.textContent = `${state.frequency} kHz`;
    schedule.innerHTML = '<p class="empty-log">Tune closer to a station to read its evening schedule.</p>';
    return;
  }
  title.textContent = station.name;
  frequency.textContent = `${station.frequency} kHz`;
  const hour = new Date().getHours();
  station.programmes.forEach((programme) => {
    const row = document.createElement('div');
    const active = hour >= programme.from && hour < programme.to;
    row.className = `schedule-row${active ? ' active' : ''}`;
    row.innerHTML = `
      <time>${String(programme.from).padStart(2, '0')}:00</time>
      <div><strong>${programme.title}</strong><small>with ${programme.host}${active ? ' · on air now' : ''}</small></div>
    `;
    schedule.appendChild(row);
  });
}

function renderPresets() {
  const container = $('presets');
  container.innerHTML = '';
  state.presets.forEach((frequency, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'preset';
    button.innerHTML = `<strong>${index + 1}</strong><span>${frequency}</span>`;
    button.setAttribute('aria-label', `Preset ${index + 1}, ${frequency} kilohertz`);
    button.addEventListener('click', () => {
      if (state.storeMode) {
        state.presets[index] = state.frequency;
        state.storeMode = false;
        $('store').classList.remove('active');
        saveState();
        renderPresets();
        showToast(`Preset ${index + 1} set to ${state.frequency}`);
      } else {
        tuneTo(frequency);
      }
    });
    container.appendChild(button);
  });
}

function renderLog() {
  const list = $('reception-log');
  list.innerHTML = '';
  if (!state.log.length) {
    list.innerHTML = '<li class="empty-log">Nothing logged yet. Find a carrier and write it down.</li>';
    return;
  }
  state.log.slice(0, 6).forEach((entry) => {
    const item = document.createElement('li');
    item.innerHTML = `<div><strong>${entry.name}</strong><span>${entry.frequency} kHz · ${entry.signal}%</span></div><span>${entry.time}</span>`;
    list.appendChild(item);
  });
}

function logReception() {
  const info = signalInfo(state.frequency);
  if (!info.station) {
    showToast('No station to log');
    return;
  }
  state.log.unshift({
    name: info.station.name,
    frequency: info.station.frequency,
    signal: info.signal,
    time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  });
  state.log = state.log.slice(0, 12);
  saveState();
  renderLog();
  showToast('Reception logged');
}

function ensureAudio() {
  if (audio) return audio;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;
  const context = new AudioContextClass();
  const master = context.createGain();
  master.gain.value = 0;
  master.connect(context.destination);

  const buffer = context.createBuffer(1, context.sampleRate * 2, context.sampleRate);
  const data = buffer.getChannelData(0);
  for (let index = 0; index < data.length; index += 1) data[index] = Math.random() * 2 - 1;

  const noise = context.createBufferSource();
  noise.buffer = buffer;
  noise.loop = true;
  const filter = context.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 1200;
  filter.Q.value = 0.65;
  const noiseGain = context.createGain();
  noiseGain.gain.value = 0;
  noise.connect(filter);
  filter.connect(noiseGain);
  noiseGain.connect(master);

  const oscillator = context.createOscillator();
  oscillator.type = 'sine';
  oscillator.frequency.value = 220;
  const toneGain = context.createGain();
  toneGain.gain.value = 0;
  oscillator.connect(toneGain);
  toneGain.connect(master);

  noise.start();
  oscillator.start();
  audio = { context, master, noiseGain, toneGain, oscillator, filter };
  return audio;
}

function updateAudio() {
  if (!audio) return;
  const info = signalInfo(state.frequency);
  const now = audio.context.currentTime;
  const heard = info.signal / 100;
  const targetMaster = state.powered ? Math.pow(state.volume / 100, 1.3) * 0.55 : 0;
  audio.master.gain.setTargetAtTime(targetMaster, now, 0.08);
  audio.noiseGain.gain.setTargetAtTime(state.powered ? 0.018 + (1 - heard) * 0.12 : 0, now, 0.1);
  audio.toneGain.gain.setTargetAtTime(state.powered && info.locked ? 0.005 + heard * 0.008 : 0, now, 0.15);
  audio.oscillator.frequency.setTargetAtTime(170 + heard * 150, now, 0.1);
  audio.filter.frequency.setTargetAtTime(700 + ((state.frequency - 530) / 1070) * 2300, now, 0.12);
  if (state.powered) audio.context.resume().catch(() => {});
}

function togglePower() {
  state.powered = !state.powered;
  if (state.powered) ensureAudio();
  updateAudio();
  renderTuning();
  showToast(state.powered ? 'Receiver on' : 'Receiver off');
}

function scan() {
  const sorted = STATIONS.map((station) => station.frequency).sort((a, b) => a - b);
  const next = sorted.find((frequency) => frequency > state.frequency + 8) || sorted[0];
  tuneTo(next);
  showToast(`Scanner found ${next} kHz`);
}

function bindEvents() {
  $('tune').addEventListener('input', (event) => {
    tuneTo(Number(event.target.value));
  });

  $('volume').addEventListener('input', (event) => {
    state.volume = Number(event.target.value);
    $('volume-label').textContent = String(state.volume).padStart(2, '0');
    if (state.powered) ensureAudio();
    updateAudio();
    saveState();
  });

  $('power').addEventListener('click', togglePower);
  $('scan').addEventListener('click', scan);
  $('log-button').addEventListener('click', logReception);
  $('clear-log').addEventListener('click', () => {
    state.log = [];
    saveState();
    renderLog();
    showToast('Reception book cleared');
  });

  $('store').addEventListener('click', () => {
    state.storeMode = !state.storeMode;
    $('store').classList.toggle('active', state.storeMode);
    showToast(state.storeMode ? 'Choose a preset to store' : 'Preset storing cancelled');
  });

  document.addEventListener('keydown', (event) => {
    if (event.target.matches('input, textarea')) return;
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      tuneTo(state.frequency - 5);
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      tuneTo(state.frequency + 5);
    }
  });

  window.addEventListener('pagehide', () => {
    if (audio) audio.context.suspend().catch(() => {});
  });
}

function startClock() {
  const update = () => {
    $('clock').textContent = new Date().toLocaleTimeString('en-GB', { hour12: false });
  };
  update();
  setInterval(update, 1000);
}

loadState();
bindEvents();
renderBandMarks();
renderPresets();
renderLog();
$('volume').value = String(state.volume);
$('volume-label').textContent = String(state.volume).padStart(2, '0');
$('tune').value = String(state.frequency);
renderTuning();
startClock();
