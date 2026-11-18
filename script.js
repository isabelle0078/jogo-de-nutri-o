// ================= ÁUDIO SINTETIZADO =================
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }
  init() {
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    } catch (e) {
      this.enabled = false;
    }
  }
  play(freq, type = 'sine', dur = 0.12, vol = 0.12) {
    if (!this.enabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(vol, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + dur);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + dur);
    } catch (e) {}
  }
  add() { this.play(540, 'sine', 0.1); }
  remove() { this.play(300, 'triangle', 0.1); }
  success() {
    this.play(523.25, 'sine', 0.15);
    setTimeout(() => this.play(659.25, 'sine', 0.15), 90);
    setTimeout(() => this.play(783.99, 'sine', 0.25), 180);
  }
  fail() {
    this.play(180, 'sawtooth', 0.25, 0.16);
    setTimeout(() => this.play(130, 'sawtooth', 0.35, 0.16), 140);
  }
}

const sfx = new SoundEngine();

function toggleSound(btn) {
  sfx.enabled = !sfx.enabled;
  btn.textContent = sfx.enabled ? '🔊' : '🔇';
}

// ================= BANCO DE ALIMENTOS =================
const FOODS = [
  { id: 'chicken', emoji: '🍗', name: 'Frango Grelhado', cat: 'prot', kcal: 165, prot: 31, carb: 0,  fat: 4,  water: 0 },
  { id: 'eggs',    emoji: '🥚', name: '2 Ovos Cozidos',  cat: 'prot', kcal: 155, prot: 13, carb: 1,  fat: 11, water: 0 },
  { id: 'fish',    emoji: '🐟', name: 'Salmão Assado',   cat: 'prot', kcal: 208, prot: 20, carb: 0,  fat: 13, water: 0 },
  { id: 'beans',   emoji: '🫘', name: 'Feijão Carioca',  cat: 'prot', kcal: 110, prot: 7,  carb: 20, fat: 1,  water: 20 },
  { id: 'rice',    emoji: '🍚', name: 'Arroz Integral',  cat: 'carb', kcal: 130, prot: 3,  carb: 28, fat: 1,  water: 0 },
  { id: 'sweetp',  emoji: '🍠', name: 'Batata Doce',     cat: 'carb', kcal: 115, prot: 2,  carb: 27, fat: 0,  water: 10 },
  { id: 'banana',  emoji: '🍌', name: 'Banana Prata',    cat: 'carb', kcal: 90,  prot: 1,  carb: 23, fat: 0,  water: 15 },
  { id: 'oats',    emoji: '🥣', name: 'Aveia em Flocos', cat: 'carb', kcal: 140, prot: 5,  carb: 24, fat: 3,  water: 0 },
  { id: 'avocado', emoji: '🥑', name: 'Abacate (1/2)',   cat: 'fat',  kcal: 120, prot: 1,  carb: 6,  fat: 11, water: 10 },
  { id: 'nuts',    emoji: '🥜', name: 'Mix de Castanhas',cat: 'fat',  kcal: 170, prot: 5,  carb: 6,  fat: 15, water: 0 },
  { id: 'olive',   emoji: '🫒', name: 'Azeite + Salada', cat: 'fat',  kcal: 110, prot: 1,  carb: 5,  fat: 10, water: 40 },
  { id: 'water',   emoji: '💧', name: 'Água Mineral',    cat: 'drink',kcal: 0,   prot: 0,  carb: 0,  fat: 0,  water: 300 },
  { id: 'orange',  emoji: '🍊', name: 'Suco de Laranja', cat: 'drink',kcal: 110, prot: 2,  carb: 25, fat: 0,  water: 250 },
  { id: 'soda',    emoji: '🥤', name: 'Refrigerante',    cat: 'drink',kcal: 150, prot: 0,  carb: 39, fat: 0,  water: 50, junk: true },
  { id: 'burger',  emoji: '🍔', name: 'Fast-Food',       cat: 'fat',  kcal: 480, prot: 20, carb: 42, fat: 26, water: 0,  junk: true }
];

// ================= PACIENTES =================
const PATIENTS = [
  {
    avatar: '🏃‍♂️',
    tag: 'ATLETA DE ENDURANCE',
    name: 'Lucas, 26 anos',
    bio: '"Vou correr 15km amanhã cedo! Preciso de bastante carboidrato de qualidade, proteína magra e hidratação."',
    target: { kcal: 620, prot: 36, carb: 80, fat: 15, water: 350 }
  },
  {
    avatar: '👩‍💻',
    tag: 'FOCO & SACIEDADE',
    name: 'Mariana, 32 anos',
    bio: '"Trabalho sentada o dia todo e quero emagrecer com saúde sem sentir fome à tarde."',
    target: { kcal: 440, prot: 34, carb: 35, fat: 16, water: 300 }
  },
  {
    avatar: '🏋️',
    tag: 'HIPERTROFIA MUSCULAR',
    name: 'Rafael, 23 anos',
    bio: '"Acabei de sair de um treino pesado de pernas. Preciso bater minhas proteínas e repor o glicogênio!"',
    target: { kcal: 720, prot: 52, carb: 85, fat: 18, water: 350 }
  },
  {
    avatar: '👵',
    tag: 'SAÚDE ÓSSEA & IMUNIDADE',
    name: 'Dona Helena, 68 anos',
    bio: '"Estou me recuperando de uma anemia leve e preciso de uma refeição nutritiva, leve e rica em ferro."',
    target: { kcal: 480, prot: 28, carb: 55, fat: 14, water: 320 }
  }
];

// ================= ESTADO =================
const state = {
  score: 0,
  level: 1,
  lives: 3,
  timeLeft: 50,
  timerId: null,
  currentPatient: PATIENTS[0],
  plate: [],
  activeCategory: 'all'
};

// ================= DESPENSA =================
function renderPantry() {
  const pantryGrid = document.getElementById('pantry-grid');
  if (!pantryGrid) return;
  pantryGrid.innerHTML = '';

  const list = state.activeCategory === 'all'
    ? FOODS
    : FOODS.filter(f => f.cat === state.activeCategory);

  list.forEach(food => {
    const card = document.createElement('div');
    card.className = `food-card ${food.junk ? 'junk' : ''}`;
    card.draggable = true;
    card.innerHTML = `
      <span class="food-emoji">${food.emoji}</span>
      <div class="food-info">
        <strong>${food.name}</strong>
        <small>${food.kcal}kcal • P:${food.prot}g C:${food.carb}g G:${food.fat}g</small>
      </div>
    `;

    card.onclick = () => addToPlate(food);
    card.ondragstart = (e) => e.dataTransfer.setData('text/plain', food.id);
    pantryGrid.appendChild(card);
  });
}

function filterPantry(cat, btn) {
  document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  state.activeCategory = cat;
  renderPantry();
}

// ================= DRAG & DROP =================
const plateZone = document.getElementById('plate-zone');
if (plateZone) {
  plateZone.ondragover = (e) => {
    e.preventDefault();
    plateZone.classList.add('drag-over');
  };
  plateZone.ondragleave = () => plateZone.classList.remove('drag-over');
  plateZone.ondrop = (e) => {
    e.preventDefault();
    plateZone.classList.remove('drag-over');
    const foodId = e.dataTransfer.getData('text/plain');
    const food = FOODS.find(f => f.id === foodId);
    if (food) addToPlate(food);
  };
}

// ================= PRATO =================
function addToPlate(food) {
  if (state.plate.length >= 6) {
    alert('Limite máximo de 6 itens por prato!');
    return;
  }
  state.plate.push(food);
  sfx.add();
  updatePlateUI();
}

function removeFromPlate(index) {
  state.plate.splice(index, 1);
  sfx.remove();
  updatePlateUI();
}

function clearPlate() {
  state.plate = [];
  sfx.remove();
  updatePlateUI();
}

function detectSynergies() {
  const ids = state.plate.map(f => f.id);
  const synergies = [];

  if (ids.includes('beans') && ids.includes('orange')) {
    synergies.push({ text: '⚡ Sinergia Ferro + Vitamina C (Feijão + Laranja): +200 pts!', bonus: 200 });
  }
  if (ids.includes('rice') && ids.includes('beans')) {
    synergies.push({ text: '⚡ Proteína Completa (Arroz + Feijão): +150 pts!', bonus: 150 });
  }
  if (ids.includes('olive') && (ids.includes('chicken') || ids.includes('fish'))) {
    synergies.push({ text: '⚡ Absorção Lipossolúvel (Azeite + Proteína): +120 pts!', bonus: 120 });
  }
  return synergies;
}

function updatePlateUI() {
  const container = document.getElementById('plate-items');
  const placeholder = document.getElementById('plate-placeholder');
  container.innerHTML = '';

  placeholder.style.display = state.plate.length === 0 ? 'block' : 'none';

  state.plate.forEach((item, idx) => {
    const chip = document.createElement('div');
    chip.className = 'plate-chip';
    chip.innerHTML = `${item.emoji} ${item.name} <span>✕</span>`;
    chip.onclick = () => removeFromPlate(idx);
    container.appendChild(chip);
  });

  const totals = state.plate.reduce((acc, f) => {
    acc.kcal  += f.kcal;
    acc.prot  += f.prot;
    acc.carb  += f.carb;
    acc.fat   += f.fat;
    acc.water += f.water;
    return acc;
  }, { kcal: 0, prot: 0, carb: 0, fat: 0, water: 0 });

  const t = state.currentPatient.target;
  updateMeter('kcal',  totals.kcal,  t.kcal,  'kcal');
  updateMeter('prot',  totals.prot,  t.prot,  'g');
  updateMeter('carb',  totals.carb,  t.carb,  'g');
  updateMeter('fat',   totals.fat,   t.fat,   'g');
  updateMeter('water', totals.water, t.water, 'ml');

  const syns = detectSynergies();
  const synBox = document.getElementById('synergy-box');
  synBox.innerHTML = syns.length > 0
    ? syns.map(s => `<div>${s.text}</div>`).join('')
    : '💡 <strong>Dica Clínica:</strong> Combine Arroz + Feijão ou Feijão + Laranja para ganhar bônus!';
}

function updateMeter(key, current, target, unit) {
  document.getElementById(`lbl-${key}`).textContent = `${current} / ${target}${unit}`;
  const fill = document.getElementById(`fill-${key}`);
  const pct = (current / target) * 100;
  fill.style.width = `${Math.min(100, pct)}%`;
  fill.classList.toggle('over', pct > 120);
}

// ================= AVALIAÇÃO =================
function handleServe() {
  if (state.plate.length === 0) {
    alert('Coloque pelo menos um alimento no prato antes de entregar!');
    return;
  }
  clearInterval(state.timerId);

  const totals = state.plate.reduce((acc, f) => {
    acc.kcal  += f.kcal;
    acc.prot  += f.prot;
    acc.carb  += f.carb;
    acc.fat   += f.fat;
    acc.water += f.water;
    if (f.junk) acc.junkCount++;
    return acc;
  }, { kcal: 0, prot: 0, carb: 0, fat: 0, water: 0, junkCount: 0 });

  const t = state.currentPatient.target;
  const keys = ['kcal', 'prot', 'carb', 'fat', 'water'];
  let matched = 0;
  const report = [];

  keys.forEach(k => {
    const ratio = totals[k] / t[k];
    if (ratio >= 0.78 && ratio <= 1.22) {
      matched++;
      report.push(`✅ ${k.toUpperCase()}: No alvo (${totals[k]} / ${t[k]})`);
    } else if (ratio < 0.78) {
      report.push(`⚠️ ${k.toUpperCase()}: Abaixo da meta (${totals[k]} / ${t[k]})`);
    } else {
      report.push(`❌ ${k.toUpperCase()}: Excesso (${totals[k]} / ${t[k]})`);
    }
  });

  const synBonus = detectSynergies().reduce((s, item) => s + item.bonus, 0);
  const junkPenalty = totals.junkCount * 150;

  if (matched >= 4 && totals.junkCount === 0) {
    const roundPoints = matched * 120 + state.timeLeft * 5 + synBonus;
    state.score += roundPoints;
    sfx.success();
    document.getElementById('fb-emoji').textContent = '🌟';
    document.getElementById('fb-title').textContent = 'Prescrição Perfeita!';
    document.getElementById('fb-desc').textContent = `Você ganhou +${roundPoints} pontos!`;
  } else if (matched >= 3) {
    const roundPoints = Math.max(100, matched * 90 + synBonus - junkPenalty);
    state.score += roundPoints;
    sfx.success();
    document.getElementById('fb-emoji').textContent = '👍';
    document.getElementById('fb-title').textContent = 'Boa Refeição!';
    document.getElementById('fb-desc').textContent = `O paciente ficou satisfeito (+${roundPoints} pts).`;
  } else {
    state.lives--;
    sfx.fail();
    document.getElementById('fb-emoji').textContent = '⚠️';
    document.getElementById('fb-title').textContent = 'Desequilíbrio Nutricional';
    document.getElementById('fb-desc').textContent = 'A refeição ficou longe das metas (-1 ❤️ de reputação).';
  }

  if (totals.junkCount > 0) {
    report.push(`🍔 Penalidade por ultraprocessados: -${junkPenalty} pts`);
  }

  document.getElementById('fb-details').innerHTML = report.join('<br>');
  updateHUD();

  if (state.lives <= 0) {
    endGame('A reputação do consultório chegou a zero.');
  } else {
    document.getElementById('feedback-overlay').classList.remove('hidden');
  }
}

// ================= PACIENTES & TEMPO =================
function loadNextPatient() {
  const base = PATIENTS[(state.level - 1) % PATIENTS.length];
  const mult = 1 + Math.floor((state.level - 1) / PATIENTS.length) * 0.12;

  state.currentPatient = {
    ...base,
    target: {
      kcal:  Math.round(base.target.kcal * mult),
      prot:  Math.round(base.target.prot * mult),
      carb:  Math.round(base.target.carb * mult),
      fat:   Math.round(base.target.fat * mult),
      water: Math.round(base.target.water * mult)
    }
  };

  state.plate = [];
  state.timeLeft = Math.max(30, 52 - state.level * 2);

  document.getElementById('patient-avatar').textContent = state.currentPatient.avatar;
  document.getElementById('patient-tag').textContent = state.currentPatient.tag;
  document.getElementById('patient-name').textContent = state.currentPatient.name;
  document.getElementById('patient-bio').textContent = state.currentPatient.bio;

  updatePlateUI();
  updateHUD();
  startTimer();
}

function startTimer() {
  clearInterval(state.timerId);
  state.timerId = setInterval(() => {
    state.timeLeft--;
    document.getElementById('timer').textContent = `${state.timeLeft}s`;
    if (state.timeLeft <= 0) {
      clearInterval(state.timerId);
      state.lives--;
      sfx.fail();
      updateHUD();
      if (state.lives <= 0) {
        endGame('O tempo acabou e os pacientes ficaram esperando!');
      } else {
        state.level++;
        loadNextPatient();
      }
    }
  }, 1000);
}

function updateHUD() {
  document.getElementById('score').textContent = String(state.score).padStart(4, '0');
  document.getElementById('level').textContent = String(state.level).padStart(2, '0');
  document.getElementById('lives').textContent = '❤️'.repeat(Math.max(0, state.lives));
  document.getElementById('timer').textContent = `${state.timeLeft}s`;
}

function endGame(reason) {
  clearInterval(state.timerId);
  document.getElementById('go-reason').textContent = reason;
  document.getElementById('final-score').textContent = state.score;
  document.getElementById('final-patients').textContent = state.level - 1;
  document.getElementById('gameover-overlay').classList.remove('hidden');
}

// ================= FLUXO PRINCIPAL =================
function startNewGame() {
  sfx.init();
  document.getElementById('start-overlay').classList.add('hidden');
  document.getElementById('gameover-overlay').classList.add('hidden');
  document.getElementById('feedback-overlay').classList.add('hidden');
  state.score = 0;
  state.level = 1;
  state.lives = 3;
  renderPantry();
  loadNextPatient();
}

function nextPatient() {
  document.getElementById('feedback-overlay').classList.add('hidden');
  state.level++;
  loadNextPatient();
}

renderPantry();