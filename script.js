(function(){
"use strict";

/* ============================= CARD SVG ART ============================= */
const CARD_COLORS = { red:'#e0342f', yellow:'#f5c518', green:'#2fa84f', blue:'#1f6fd6', wild:'#171717' };
function polar(cx,cy,r,deg){ const rad=(deg-90)*Math.PI/180; return { x:cx+r*Math.cos(rad), y:cy+r*Math.sin(rad) }; }
function pieSlice(cx,cy,r,a1,a2){
  const p1=polar(cx,cy,r,a1), p2=polar(cx,cy,r,a2);
  const large = (a2-a1) > 180 ? 1 : 0;
  return 'M'+cx+','+cy+' L'+p1.x.toFixed(1)+','+p1.y.toFixed(1)+' A'+r+','+r+' 0 '+large+',1 '+p2.x.toFixed(1)+','+p2.y.toFixed(1)+' Z';
}
function pinwheelSVG(cx,cy,r){
  return '<circle cx="'+cx+'" cy="'+cy+'" r="'+(r+3)+'" fill="#fff"/>' +
    '<path d="'+pieSlice(cx,cy,r,0,90)+'" fill="'+CARD_COLORS.red+'"/>' +
    '<path d="'+pieSlice(cx,cy,r,90,180)+'" fill="'+CARD_COLORS.blue+'"/>' +
    '<path d="'+pieSlice(cx,cy,r,180,270)+'" fill="'+CARD_COLORS.yellow+'"/>' +
    '<path d="'+pieSlice(cx,cy,r,270,360)+'" fill="'+CARD_COLORS.green+'"/>' +
    '<circle cx="'+cx+'" cy="'+cy+'" r="'+(r*0.24).toFixed(1)+'" fill="#fff"/>';
}
/* Triangular arrow-head. dirDeg points the tip, using the same 0=up/90=right convention as polar(). */
function arrowHeadPath(px, py, dirDeg, size){
  const rad = dirDeg*Math.PI/180;
  const dx = Math.sin(rad), dy = -Math.cos(rad);
  const perpx = -dy, perpy = dx;
  const tipX = px + dx*size, tipY = py + dy*size;
  const baseX = px - dx*size*0.2, baseY = py - dy*size*0.2;
  const b1x = baseX + perpx*size*0.62, b1y = baseY + perpy*size*0.62;
  const b2x = baseX - perpx*size*0.62, b2y = baseY - perpy*size*0.62;
  return 'M'+tipX.toFixed(1)+','+tipY.toFixed(1)+' L'+b1x.toFixed(1)+','+b1y.toFixed(1)+' L'+b2x.toFixed(1)+','+b2y.toFixed(1)+' Z';
}
/* One curved arrow along a circular arc (clockwise from startDeg to endDeg), arrow-head at the end. */
function arcArrow(cx, cy, r, startDeg, endDeg, col, sw, headSize){
  const p1 = polar(cx,cy,r,startDeg), p2 = polar(cx,cy,r,endDeg);
  const large = (endDeg-startDeg) > 180 ? 1 : 0;
  const arcPath = 'M'+p1.x.toFixed(1)+','+p1.y.toFixed(1)+' A'+r+','+r+' 0 '+large+',1 '+p2.x.toFixed(1)+','+p2.y.toFixed(1);
  const head = arrowHeadPath(p2.x, p2.y, endDeg+90, headSize);
  return '<path d="'+arcPath+'" fill="none" stroke="'+col+'" stroke-width="'+sw+'" stroke-linecap="round"/><path d="'+head+'" fill="'+col+'"/>';
}
/* Reverse symbol: two opposing curved arrows forming a broken ring — the real UNO "flip direction" mark. */
function reverseIconSVG(cx, cy, r, col, sw, headSize){
  return arcArrow(cx,cy,r,18,158,col,sw,headSize) + arcArrow(cx,cy,r,198,338,col,sw,headSize);
}
/* Skip symbol: prohibition ring with a diagonal bar. */
function skipIconSVG(cx, cy, r, col, sw){
  const a = polar(cx,cy,r*0.74,315), b = polar(cx,cy,r*0.74,135);
  return '<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="none" stroke="'+col+'" stroke-width="'+sw+'"/>' +
    '<line x1="'+a.x.toFixed(1)+'" y1="'+a.y.toFixed(1)+'" x2="'+b.x.toFixed(1)+'" y2="'+b.y.toFixed(1)+'" stroke="'+col+'" stroke-width="'+sw+'" stroke-linecap="round"/>';
}
function cardCenterSymbol(card){
  const col = CARD_COLORS[card.color] || '#000';
  if (card.value >= '0' && card.value <= '9') {
    return '<text x="60" y="111" font-size="76" font-weight="700" text-anchor="middle" fill="'+col+'" font-family="Inter,sans-serif">'+card.value+'</text>';
  }
  if (card.value === 'skip') return skipIconSVG(60, 86, 32, col, 11);
  if (card.value === 'reverse') return reverseIconSVG(60, 86, 31, col, 11, 16);
  if (card.value === 'draw2') {
    return '<text x="60" y="106" font-size="52" font-weight="800" text-anchor="middle" fill="'+col+'" font-family="Inter,sans-serif">+2</text>';
  }
  if (card.value === 'wild') return pinwheelSVG(60, 86, 32);
  if (card.value === 'wild4') {
    return pinwheelSVG(60, 72, 23) +
      '<text x="60" y="140" font-size="30" font-weight="800" text-anchor="middle" fill="#fff" stroke="#000" stroke-width="0.7" font-family="Inter,sans-serif">+4</text>';
  }
  return '';
}
function miniCornerIcon(card){
  const col = CARD_COLORS[card.color] || '#000';
  if (card.value >= '0' && card.value <= '9') return '<text x="0" y="6" font-size="18" font-weight="700" text-anchor="middle" fill="#fff" stroke="#00000055" stroke-width="0.6" font-family="Inter,sans-serif">'+card.value+'</text>';
  if (card.value === 'skip') return skipIconSVG(0, -2, 10, '#fff', 3.4);
  if (card.value === 'reverse') return reverseIconSVG(0, -2, 10, '#fff', 3.4, 6);
  if (card.value === 'draw2') return '<text x="0" y="4" font-size="15" font-weight="800" text-anchor="middle" fill="#fff" font-family="Inter,sans-serif">+2</text>';
  if (card.value === 'wild4') return '<text x="0" y="4" font-size="13" font-weight="800" text-anchor="middle" fill="#fff" font-family="Inter,sans-serif">+4</text>';
  return '';
}
function cornerLabel(card){
  const icon = miniCornerIcon(card);
  if (!icon) return '';
  return '<g transform="translate(15,22)">'+icon+'</g>' +
         '<g transform="translate(105,148) rotate(180)">'+icon+'</g>';
}
function cardBackInner(){
  return '<rect x="2" y="2" width="116" height="166" rx="12" fill="#171f1a" stroke="#3a4a3c" stroke-width="2"/>' +
    '<rect x="14" y="14" width="92" height="142" rx="8" fill="none" stroke="#c9a15a" stroke-width="2" opacity="0.5"/>' +
    '<circle cx="60" cy="86" r="26" fill="none" stroke="#c9a15a" stroke-width="2" opacity="0.75"/>' +
    '<circle cx="49" cy="75" r="7" fill="'+CARD_COLORS.red+'"/>' +
    '<circle cx="71" cy="75" r="7" fill="'+CARD_COLORS.blue+'"/>' +
    '<circle cx="49" cy="97" r="7" fill="'+CARD_COLORS.yellow+'"/>' +
    '<circle cx="71" cy="97" r="7" fill="'+CARD_COLORS.green+'"/>';
}
function cardSVG(card, faceDown){
  let inner;
  if (faceDown || !card) {
    inner = cardBackInner();
  } else {
    const c = CARD_COLORS[card.color];
    inner = '<rect x="1.5" y="1.5" width="117" height="167" rx="13" fill="'+c+'" stroke="#000" stroke-width="3"/>' +
      '<rect x="6" y="6" width="108" height="158" rx="10" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="1.5"/>' +
      '<ellipse cx="60" cy="87" rx="50" ry="70" fill="#fff" transform="rotate(-20 60 87)"/>' +
      cardCenterSymbol(card) + cornerLabel(card);
  }
  return '<svg viewBox="0 0 120 170">'+inner+'</svg>';
}
function directionIconSVG(direction){
  const flip = direction === -1 ? 'scale(-1,1)' : '';
  return '<svg class="direction-icon" viewBox="0 0 44 44" style="transform:'+flip+'">' +
    '<circle cx="22" cy="22" r="20" fill="#1c2721" stroke="#37453b" stroke-width="2"/>' +
    reverseIconSVG(22,23,13,'#d7c26a',4.4,7) +
    '</svg>';
}

/* ============================= CARTOON AVATAR ART (Kahoot-style little characters) ============================= */
const AVATAR_PALETTE = ['#ff6b6b','#4ecdc4','#f6c445','#8f7cf0','#ff9f43','#2fbf7e','#54a0ff','#ff6bb0'];
const AVATAR_BOT_COLOR = '#5c7360';
function avatarFace(eyeY, mouthPath){
  return '<circle cx="15" cy="'+eyeY+'" r="4.1" fill="#fff"/><circle cx="25" cy="'+eyeY+'" r="4.1" fill="#fff"/>' +
    '<circle cx="16" cy="'+(eyeY+0.6)+'" r="2" fill="#20180a"/><circle cx="24" cy="'+(eyeY+0.6)+'" r="2" fill="#20180a"/>' +
    (mouthPath||'');
}
function avatarSVG(seatIndex, isBot, size){
  size = size || 34;
  if (isBot) {
    const body = '<rect x="3" y="18" width="4" height="10" rx="2" fill="'+AVATAR_BOT_COLOR+'"/>' +
      '<rect x="33" y="18" width="4" height="10" rx="2" fill="'+AVATAR_BOT_COLOR+'"/>' +
      '<line x1="20" y1="10" x2="20" y2="4" stroke="'+AVATAR_BOT_COLOR+'" stroke-width="2.5" stroke-linecap="round"/>' +
      '<circle cx="20" cy="4" r="2.6" fill="'+AVATAR_BOT_COLOR+'"/>' +
      '<rect x="7" y="10" width="26" height="24" rx="7" fill="'+AVATAR_BOT_COLOR+'"/>';
    const face = avatarFace(21, '<path d="M14,28 Q20,32 26,28" stroke="#0e130f" stroke-width="1.7" fill="none" stroke-linecap="round"/>');
    return '<svg viewBox="0 0 40 40" width="'+size+'" height="'+size+'">'+body+face+'</svg>';
  }
  const variant = ((seatIndex%8)+8)%8;
  const color = AVATAR_PALETTE[variant];
  let body, eyeY;
  switch(variant){
    case 0:
      body = '<path d="M20,5 L23.5,12 L16.5,12 Z" fill="'+color+'"/><circle cx="20" cy="23" r="14" fill="'+color+'"/>';
      eyeY = 21; break;
    case 1:
      body = '<path d="M9,9 L17,16 L9,20 Z" fill="'+color+'"/><path d="M31,9 L23,16 L31,20 Z" fill="'+color+'"/><circle cx="20" cy="24" r="13" fill="'+color+'"/>';
      eyeY = 22; break;
    case 2:
      body = '<line x1="9" y1="8" x2="13" y2="14" stroke="'+color+'" stroke-width="3" stroke-linecap="round"/><line x1="31" y1="8" x2="27" y2="14" stroke="'+color+'" stroke-width="3" stroke-linecap="round"/><ellipse cx="20" cy="21" rx="12" ry="15" fill="'+color+'"/>';
      eyeY = 19; break;
    case 3:
      body = '<path d="M20,4 L24,15 L36,15 L26,23 L30,35 L20,27 L10,35 L14,23 L4,15 L16,15 Z" fill="'+color+'"/>';
      eyeY = 19; break;
    case 4:
      body = '<circle cx="11" cy="25" r="8.5" fill="'+color+'"/><circle cx="20" cy="18" r="10.5" fill="'+color+'"/><circle cx="29" cy="25" r="8.5" fill="'+color+'"/><rect x="8" y="23" width="24" height="11" rx="5.5" fill="'+color+'"/>';
      eyeY = 20; break;
    case 5:
      body = '<rect x="9" y="9" width="22" height="22" rx="4" fill="'+color+'" transform="rotate(45 20 20)"/>';
      eyeY = 20; break;
    case 6:
      body = '<path d="M8,34 V18 a12,12 0 0,1 24,0 V34 l-4,-4 -4,4 -4,-4 -4,4 -4,-4 Z" fill="'+color+'"/>';
      eyeY = 17; break;
    default:
      body = '<circle cx="9" cy="14" r="3.4" fill="'+color+'"/><circle cx="31" cy="14" r="3.4" fill="'+color+'"/><circle cx="20" cy="23" r="13" fill="'+color+'"/>';
      eyeY = 21; break;
  }
  const face = avatarFace(eyeY, '<path d="M15,'+(eyeY+8)+' Q20,'+(eyeY+12)+' 25,'+(eyeY+8)+'" stroke="#20180a" stroke-width="1.6" fill="none" stroke-linecap="round"/>');
  return '<svg viewBox="0 0 40 40" width="'+size+'" height="'+size+'">'+body+face+'</svg>';
}

/* ============================= UNO ENGINE (validated) ============================= */
const COLORS = ['red', 'yellow', 'green', 'blue'];
const ACTIONS = ['skip', 'reverse', 'draw2'];
function buildDeck() {
  const deck = []; let id = 0;
  for (const c of COLORS) {
    deck.push({ id: id++, color: c, value: '0' });
    for (let n = 1; n <= 9; n++) { deck.push({ id: id++, color: c, value: String(n) }); deck.push({ id: id++, color: c, value: String(n) }); }
    for (const a of ACTIONS) { deck.push({ id: id++, color: c, value: a }); deck.push({ id: id++, color: c, value: a }); }
  }
  for (let i = 0; i < 4; i++) deck.push({ id: id++, color: 'wild', value: 'wild' });
  for (let i = 0; i < 4; i++) deck.push({ id: id++, color: 'wild', value: 'wild4' });
  return deck;
}
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t=a[i]; a[i]=a[j]; a[j]=t; }
  return a;
}
function canPlay(card, topCard, currentColor, drawStackAmount) {
  if (drawStackAmount) return card.value === 'draw2';
  if (card.color === 'wild') return true;
  if (card.color === currentColor) return true;
  if (card.value === topCard.value) return true;
  return false;
}
function mostCommonColor(hand) {
  const counts = { red: 0, yellow: 0, green: 0, blue: 0 };
  for (const c of hand) if (counts[c.color] !== undefined) counts[c.color]++;
  let best = 'red', bestN = -1;
  for (const c of COLORS) if (counts[c] > bestN) { bestN = counts[c]; best = c; }
  return best;
}
function cardScoreValue(card) {
  if (card.value === 'wild' || card.value === 'wild4') return 50;
  if (card.value === 'skip' || card.value === 'reverse' || card.value === 'draw2') return 20;
  return parseInt(card.value, 10) || 0;
}
class UnoGame {
  constructor(numPlayers, names) {
    this.numPlayers = numPlayers;
    this.names = names || Array.from({ length: numPlayers }, (_, i) => 'P' + i);
    this.scores = Array(numPlayers).fill(0);
    this.startRound();
  }
  startRound() {
    let deck = shuffle(buildDeck());
    const hands = [];
    for (let p = 0; p < this.numPlayers; p++) hands.push(deck.splice(0, 7));
    let discard = [];
    while (true) {
      const first = deck.shift();
      if (first.value === 'wild4') { deck.push(first); deck = shuffle(deck); continue; }
      discard.push(first);
      break;
    }
    const top = discard[discard.length - 1];
    this.deck = deck; this.discard = discard; this.hands = hands;
    this.currentColor = top.color === 'wild' ? mostCommonColor(hands[0]) : top.color;
    this.direction = 1; this.currentPlayerIdx = 0;
    this.unoCalled = Array(this.numPlayers).fill(true);
    this.roundOver = false; this.winnerIdx = null; this.turnCount = 0; this.drawStack = null;
    if (top.value === 'skip' || top.value === 'reverse' || top.value === 'draw2') this.applyStartCardEffect(top);
  }
  applyStartCardEffect(top) {
    if (top.value === 'reverse') {
      this.direction *= -1;
      if (this.numPlayers === 2) this.currentPlayerIdx = this.nextIndex(this.currentPlayerIdx, this.direction, 1);
    } else if (top.value === 'skip') {
      this.currentPlayerIdx = this.nextIndex(this.currentPlayerIdx, this.direction, 1);
    } else if (top.value === 'draw2') {
      this.drawStack = { amount: 2 };
    }
  }
  nextIndex(fromIdx, dir, steps) { const n = this.numPlayers; return ((fromIdx + dir * steps) % n + n) % n; }
  reshuffleIfNeeded(need) {
    while (this.deck.length < need) {
      if (this.discard.length <= 1) break;
      const top = this.discard.pop();
      const rest = this.discard;
      this.discard = [top];
      this.deck = this.deck.concat(shuffle(rest));
    }
  }
  drawCards(playerIdx, n) {
    const drawn = [];
    for (let i = 0; i < n; i++) {
      this.reshuffleIfNeeded(1);
      if (this.deck.length === 0) break;
      drawn.push(this.deck.shift());
    }
    this.hands[playerIdx].push(...drawn);
    if (this.hands[playerIdx].length > 1) this.unoCalled[playerIdx] = true;
    return drawn;
  }
  topCard() { return this.discard[this.discard.length - 1]; }
  stackAmount() { return this.drawStack ? this.drawStack.amount : 0; }
  playableCards(playerIdx) {
    const top = this.topCard();
    return this.hands[playerIdx].filter(c => canPlay(c, top, this.currentColor, this.stackAmount()));
  }
  playCard(playerIdx, cardId, chosenColor) {
    const hand = this.hands[playerIdx];
    const idx = hand.findIndex(c => c.id === cardId);
    if (idx === -1) throw new Error('card not in hand');
    const card = hand[idx];
    const top = this.topCard();
    if (!canPlay(card, top, this.currentColor, this.stackAmount())) throw new Error('illegal move');
    hand.splice(idx, 1);
    this.discard.push(card);
    this.currentColor = card.color === 'wild' ? (chosenColor || mostCommonColor(hand)) : card.color;
    if (hand.length === 0) {
      this.drawStack = null;
      this.roundOver = true; this.winnerIdx = playerIdx; this.applyScoring(playerIdx);
      return { effect: 'win' };
    }
    if (hand.length === 1) this.unoCalled[playerIdx] = false;
    let skipCount = 1, effect = 'normal';
    if (card.value === 'draw2') {
      this.drawStack = { amount: (this.drawStack ? this.drawStack.amount : 0) + 2 };
      effect = 'stack';
    } else if (card.value === 'reverse') {
      this.direction *= -1;
      if (this.numPlayers === 2) skipCount = 2;
      effect = 'reverse';
    } else if (card.value === 'skip') { skipCount = 2; effect = 'skip'; }
    else if (card.value === 'wild4') {
      const targetIdx = this.nextIndex(playerIdx, this.direction, 1);
      this.drawCards(targetIdx, 4); skipCount = 2; effect = 'wild4';
    } else if (card.value === 'wild') { effect = 'wild'; }
    this.currentPlayerIdx = this.nextIndex(playerIdx, this.direction, skipCount);
    this.turnCount++;
    return { effect, stackAmount: this.stackAmount() };
  }
  /* Player facing an active +2 stack chooses not to (or cannot) stack another +2: draw the accumulated pile and lose the turn. */
  resolveDrawStack(playerIdx) {
    if (!this.drawStack) throw new Error('no pending stack');
    const amount = this.drawStack.amount;
    this.drawStack = null;
    this.drawCards(playerIdx, amount);
    this.currentPlayerIdx = this.nextIndex(playerIdx, this.direction, 1);
    this.turnCount++;
    return { effect: 'stackResolved', amount };
  }
  playCombo(playerIdx, cardIds) {
    if (this.drawStack) throw new Error('cannot combo during a draw stack');
    if (!cardIds || cardIds.length === 0) throw new Error('empty combo');
    const hand = this.hands[playerIdx];
    const cards = cardIds.map(id => hand.find(c => c.id === id));
    if (cards.some(c => !c)) throw new Error('card not in hand');
    const value = cards[0].value;
    if (!(value >= '0' && value <= '9')) throw new Error('combo only for number cards');
    if (cards.some(c => c.value !== value)) throw new Error('combo cards must share the same value');
    const top = this.topCard();
    const anyLegal = cards.some(c => canPlay(c, top, this.currentColor));
    if (!anyLegal) throw new Error('illegal combo');
    for (const id of cardIds) { const idx = hand.findIndex(c => c.id === id); hand.splice(idx, 1); }
    for (const c of cards) this.discard.push(c);
    this.currentColor = cards[cards.length - 1].color;
    if (hand.length === 0) {
      this.roundOver = true; this.winnerIdx = playerIdx; this.applyScoring(playerIdx);
      return { effect: 'win', count: cards.length };
    }
    if (hand.length === 1) this.unoCalled[playerIdx] = false;
    this.currentPlayerIdx = this.nextIndex(playerIdx, this.direction, 1);
    this.turnCount++;
    return { effect: 'combo', count: cards.length };
  }
  applyScoring(winnerIdx) {
    let total = 0;
    for (let p = 0; p < this.numPlayers; p++) { if (p === winnerIdx) continue; for (const c of this.hands[p]) total += cardScoreValue(c); }
    this.scores[winnerIdx] += total;
  }
  drawForTurn(playerIdx) {
    this.reshuffleIfNeeded(1);
    if (this.deck.length === 0) return null;
    const card = this.deck.shift();
    this.hands[playerIdx].push(card);
    if (this.hands[playerIdx].length > 1) this.unoCalled[playerIdx] = true;
    return card;
  }
  passTurn(playerIdx) { this.currentPlayerIdx = this.nextIndex(playerIdx, this.direction, 1); }
}

/* ============================= BOT AI (validated) ============================= */
function chooseBotMove(game, playerIdx) {
  const hand = game.hands[playerIdx];
  const playable = game.playableCards(playerIdx);
  if (playable.length === 0) return null;
  const nonWild = playable.filter(c => c.color !== 'wild');
  let pool = nonWild.length > 0 ? nonWild : playable;
  if (pool !== nonWild) { const plain = pool.filter(c => c.value === 'wild'); if (plain.length) pool = plain; }
  const actions = pool.filter(c => c.value === 'skip' || c.value === 'reverse' || c.value === 'draw2' || c.value === 'wild4');
  const candidates = actions.length > 0 ? actions : pool;
  candidates.sort((a, b) => {
    const ca = a.color === 'wild' ? 0 : hand.filter(x => x.color === a.color).length;
    const cb = b.color === 'wild' ? 0 : hand.filter(x => x.color === b.color).length;
    return cb - ca;
  });
  const chosen = candidates[0];
  let chosenColor = null;
  if (chosen.color === 'wild') { const remaining = hand.filter(c => c.id !== chosen.id); chosenColor = mostCommonColor(remaining); }
  return { card: chosen, chosenColor };
}

/* ============================= NET / STATE-MACHINE (validated) ============================= */
function createApp(env) {
  const app = {};
  app.mode = 'offline'; app.onlineRole = null; app.seats = []; app.localGame = null;
  app.gameStarted = false; app.myGuestIdx = null; app.hostConn = null; app.lastReceivedState = null;
  app.botTimer = null; app.pendingDrawFor = null;

  function describeEvent(actorName, card, effect, stackAmount) {
    if (effect === 'win') return actorName + ' menang ronde ini!';
    if (effect === 'skip') return actorName + ' memainkan Skip!';
    if (effect === 'reverse') return actorName + ' membalik arah!';
    if (effect === 'stack') return actorName + ' menumpuk +2! Total sekarang +' + stackAmount + '.';
    if (effect === 'wild4') return actorName + ' memainkan Wild +4!';
    if (effect === 'wild') return actorName + ' memainkan Wild.';
    return actorName + ' bermain ' + card.color + ' ' + card.value + '.';
  }
  function describeComboEvent(actorName, res) {
    if (res.effect === 'win') return actorName + ' menang ronde ini dengan kombo ' + res.count + ' kartu!';
    return actorName + ' memainkan kombo ' + res.count + ' kartu sekaligus!';
  }
  function describeStackResolve(actorName, amount) {
    return actorName + ' mengambil ' + amount + ' kartu tumpukan +2 dan lewat.';
  }

  function offlineViewState() {
    const g = app.localGame; const viewerIdx = g.currentPlayerIdx;
    return {
      seats: app.seats.map((s, i) => ({ name: s.name, type: s.type, connected: true, count: g.hands[i].length })),
      yourIdx: viewerIdx, yourHand: g.hands[viewerIdx], discardTop: g.topCard(), discardCount: g.discard.length,
      deckCount: g.deck.length, currentColor: g.currentColor, currentPlayerIdx: g.currentPlayerIdx, direction: g.direction,
      unoCalled: g.unoCalled.slice(), scores: g.scores.slice(), roundOver: g.roundOver, winnerIdx: g.winnerIdx,
      pendingDrawFor: app.pendingDrawFor, drawStack: g.stackAmount(),
    };
  }
  function hostViewStateFor(viewerIdx) {
    const g = app.localGame;
    return {
      seats: app.seats.map((s, i) => ({ name: s.name, type: s.type, connected: s.type !== 'human' || i === 0 || (s.conn && s.conn.open), count: g.hands[i].length })),
      yourIdx: viewerIdx, yourHand: g.hands[viewerIdx], discardTop: g.topCard(), discardCount: g.discard.length,
      deckCount: g.deck.length, currentColor: g.currentColor, currentPlayerIdx: g.currentPlayerIdx, direction: g.direction,
      unoCalled: g.unoCalled.slice(), scores: g.scores.slice(), roundOver: g.roundOver, winnerIdx: g.winnerIdx,
      pendingDrawFor: app.pendingDrawFor, drawStack: g.stackAmount(),
    };
  }
  app.getViewState = function () {
    if (app.mode === 'online' && app.onlineRole === 'guest') return app.lastReceivedState;
    if (app.mode === 'online' && app.onlineRole === 'host') return hostViewStateFor(0);
    if (app.localGame) return offlineViewState();
    return null;
  };
  function renderAll(eventText) { env.onRender(app.getViewState(), eventText); }
  app.renderAll = renderAll;

  function broadcastLobby() {
    const roster = app.seats.map(s => ({ name: s.name, type: s.type }));
    for (let i = 1; i < app.seats.length; i++) {
      const s = app.seats[i];
      if (s.type === 'human' && s.conn && s.conn.open) env.sendToConn(s.conn, { msgType: 'lobby', seats: roster });
    }
    env.onLobby && env.onLobby(roster);
  }
  app.broadcastLobby = broadcastLobby;

  function broadcastAndRender(eventText) {
    if (app.mode === 'online' && app.onlineRole === 'host') {
      for (let i = 1; i < app.seats.length; i++) {
        const s = app.seats[i];
        if (s.type === 'human' && s.conn && s.conn.open) {
          const payload = hostViewStateFor(i); payload.event = eventText || '';
          env.sendToConn(s.conn, { msgType: 'state', payload });
        }
      }
    }
    renderAll(eventText);
    maybeRunBotTurn();
  }
  app.broadcastAndRender = broadcastAndRender;

  function localPlay(actorIdx, cardId, chosenColor) {
    app.pendingDrawFor = null;
    const res = app.localGame.playCard(actorIdx, cardId, chosenColor);
    const card = app.localGame.discard[app.localGame.discard.length - 1];
    broadcastAndRender(describeEvent(app.seats[actorIdx].name, card, res.effect, res.stackAmount));
  }
  app.localPlay = localPlay;

  function localPlayCombo(actorIdx, cardIds) {
    app.pendingDrawFor = null;
    let res;
    try { res = app.localGame.playCombo(actorIdx, cardIds); }
    catch (e) { renderAll('Kombo tidak valid — kartu itu tidak bisa dimainkan bersama.'); return; }
    broadcastAndRender(describeComboEvent(app.seats[actorIdx].name, res));
  }
  app.localPlayCombo = localPlayCombo;

  function localDraw(actorIdx) {
    const g = app.localGame;
    const drawn = g.drawForTurn(actorIdx);
    if (!drawn) { app.pendingDrawFor = null; g.passTurn(actorIdx); broadcastAndRender(app.seats[actorIdx].name + ' lewat (dek kosong).'); return; }
    const top = g.topCard();
    const canPlayDrawn = drawn.color === 'wild' || drawn.color === g.currentColor || drawn.value === top.value;
    if (canPlayDrawn) { app.pendingDrawFor = actorIdx; broadcastAndRender(app.seats[actorIdx].name + ' mengambil kartu — bisa dimainkan!'); }
    else { app.pendingDrawFor = null; g.passTurn(actorIdx); broadcastAndRender(app.seats[actorIdx].name + ' mengambil kartu dan lewat.'); }
  }
  app.localDraw = localDraw;

  function localResolveStack(actorIdx) {
    app.pendingDrawFor = null;
    const g = app.localGame;
    const res = g.resolveDrawStack(actorIdx);
    broadcastAndRender(describeStackResolve(app.seats[actorIdx].name, res.amount));
  }
  app.localResolveStack = localResolveStack;

  function localPass(actorIdx) { app.pendingDrawFor = null; app.localGame.passTurn(actorIdx); broadcastAndRender(app.seats[actorIdx].name + ' lewat.'); }
  app.localPass = localPass;
  function localCallUno(actorIdx) { app.localGame.unoCalled[actorIdx] = true; broadcastAndRender(app.seats[actorIdx].name + ' teriak UNO!'); }
  app.localCallUno = localCallUno;

  function maybeRunBotTurn() {
    if (app.mode === 'online' && app.onlineRole === 'guest') return;
    const g = app.localGame;
    if (!g || g.roundOver) return;
    const idx = g.currentPlayerIdx;
    const seat = app.seats[idx];
    if (!seat || seat.type !== 'bot') return;
    app.botTimer = env.scheduleTimeout(() => {
      if (g.roundOver) return;
      if (g.stackAmount() > 0) {
        const stackCard = g.hands[idx].find(c => c.value === 'draw2');
        if (stackCard) {
          const res = g.playCard(idx, stackCard.id, null);
          broadcastAndRender(describeEvent(app.seats[idx].name, app.localGame.discard[app.localGame.discard.length - 1], res.effect, res.stackAmount));
        } else {
          const res = g.resolveDrawStack(idx);
          broadcastAndRender(describeStackResolve(app.seats[idx].name, res.amount));
        }
        return;
      }
      const move = chooseBotMove(g, idx);
      if (move) {
        const res = g.playCard(idx, move.card.id, move.chosenColor);
        broadcastAndRender(describeEvent(app.seats[idx].name, app.localGame.discard[app.localGame.discard.length - 1], res.effect, res.stackAmount));
      } else {
        const drawn = g.drawForTurn(idx);
        if (drawn) {
          const top = g.topCard();
          const canPlayDrawn = drawn.color === 'wild' || drawn.color === g.currentColor || drawn.value === top.value;
          if (canPlayDrawn) {
            const chosenColor = drawn.color === 'wild' ? mostCommonColor(g.hands[idx].filter(c => c.id !== drawn.id)) : null;
            const res = g.playCard(idx, drawn.id, chosenColor);
            broadcastAndRender(describeEvent(app.seats[idx].name, app.localGame.discard[app.localGame.discard.length - 1], res.effect, res.stackAmount));
          } else { g.passTurn(idx); broadcastAndRender(app.seats[idx].name + ' mengambil kartu dan lewat.'); }
        } else { g.passTurn(idx); broadcastAndRender(app.seats[idx].name + ' lewat (dek kosong).'); }
      }
    }, env.botDelay ? env.botDelay() : 750);
  }
  app.maybeRunBotTurn = maybeRunBotTurn;

  app.requestPlay = function (cardId, chosenColor) {
    if (app.mode === 'online' && app.onlineRole === 'guest') { env.sendToConn(app.hostConn, { msgType: 'action', action: 'play', cardId, chosenColor }); return; }
    const actorIdx = (app.mode === 'online' && app.onlineRole === 'host') ? 0 : app.localGame.currentPlayerIdx;
    localPlay(actorIdx, cardId, chosenColor);
  };
  app.requestPlayCombo = function (cardIds) {
    if (app.mode === 'online' && app.onlineRole === 'guest') { env.sendToConn(app.hostConn, { msgType: 'action', action: 'playCombo', cardIds }); return; }
    const actorIdx = (app.mode === 'online' && app.onlineRole === 'host') ? 0 : app.localGame.currentPlayerIdx;
    localPlayCombo(actorIdx, cardIds);
  };
  app.requestDraw = function () {
    if (app.mode === 'online' && app.onlineRole === 'guest') { env.sendToConn(app.hostConn, { msgType: 'action', action: 'draw' }); return; }
    const actorIdx = (app.mode === 'online' && app.onlineRole === 'host') ? 0 : app.localGame.currentPlayerIdx;
    localDraw(actorIdx);
  };
  app.requestResolveStack = function () {
    if (app.mode === 'online' && app.onlineRole === 'guest') { env.sendToConn(app.hostConn, { msgType: 'action', action: 'resolveStack' }); return; }
    const actorIdx = (app.mode === 'online' && app.onlineRole === 'host') ? 0 : app.localGame.currentPlayerIdx;
    localResolveStack(actorIdx);
  };
  app.requestPass = function () {
    if (app.mode === 'online' && app.onlineRole === 'guest') { env.sendToConn(app.hostConn, { msgType: 'action', action: 'pass' }); return; }
    const actorIdx = (app.mode === 'online' && app.onlineRole === 'host') ? 0 : app.localGame.currentPlayerIdx;
    localPass(actorIdx);
  };
  app.requestCallUno = function () {
    if (app.mode === 'online' && app.onlineRole === 'guest') { env.sendToConn(app.hostConn, { msgType: 'action', action: 'callUno' }); return; }
    const actorIdx = (app.mode === 'online' && app.onlineRole === 'host') ? 0 : app.getViewState().yourIdx;
    localCallUno(actorIdx);
  };

  app.hostAcceptConnection = function (conn) {
    const openIdx = app.seats.findIndex(s => s.type === 'open');
    if (openIdx === -1) { env.sendToConn(conn, { msgType: 'room_full' }); try { conn.close(); } catch (e) {} return; }
    app.seats[openIdx] = { type: 'human', name: 'Pemain' + (openIdx + 1), conn: conn };
    conn.__seatIdx = openIdx;
    broadcastLobby();
  };
  app.hostHandleMessage = function (conn, msg) {
    const seatIdx = conn.__seatIdx;
    if (seatIdx == null || !app.seats[seatIdx]) return;
    if (msg.msgType === 'join_request') { app.seats[seatIdx].name = msg.name || app.seats[seatIdx].name; broadcastLobby(); }
    else if (msg.msgType === 'action') {
      if (!app.gameStarted || !app.localGame || app.localGame.roundOver) return;
      if (app.localGame.currentPlayerIdx !== seatIdx) return;
      if (msg.action === 'play') localPlay(seatIdx, msg.cardId, msg.chosenColor);
      else if (msg.action === 'playCombo') localPlayCombo(seatIdx, msg.cardIds);
      else if (msg.action === 'draw') localDraw(seatIdx);
      else if (msg.action === 'resolveStack') localResolveStack(seatIdx);
      else if (msg.action === 'pass') localPass(seatIdx);
      else if (msg.action === 'callUno') localCallUno(seatIdx);
    }
  };
  app.hostHandleDisconnect = function (conn) {
    const seatIdx = conn.__seatIdx;
    if (seatIdx == null || !app.seats[seatIdx] || app.seats[seatIdx].type !== 'human') return;
    if (!app.gameStarted) { app.seats[seatIdx] = { type: 'open', name: '', conn: null }; broadcastLobby(); }
    else {
      const name = app.seats[seatIdx].name;
      app.seats[seatIdx] = { type: 'bot', name: name, conn: null };
      broadcastAndRender(name + ' terputus, digantikan bot.');
    }
  };
  app.hostStartGame = function () {
    app.seats.forEach((s, i) => { if (s.type === 'open') { s.type = 'bot'; s.name = 'Bot ' + (i + 1); } });
    app.localGame = new UnoGame(app.seats.length, app.seats.map(s => s.name));
    app.gameStarted = true;
    for (let i = 1; i < app.seats.length; i++) {
      const s = app.seats[i];
      if (s.type === 'human' && s.conn && s.conn.open) env.sendToConn(s.conn, { msgType: 'game_start', payload: hostViewStateFor(i) });
    }
    renderAll('Permainan dimulai!');
    maybeRunBotTurn();
  };
  app.hostNextRound = function () {
    app.pendingDrawFor = null;
    app.localGame.startRound();
    if (app.mode === 'online' && app.onlineRole === 'host') {
      for (let i = 1; i < app.seats.length; i++) {
        const s = app.seats[i];
        if (s.type === 'human' && s.conn && s.conn.open) env.sendToConn(s.conn, { msgType: 'game_start', payload: hostViewStateFor(i) });
      }
    }
    renderAll('Ronde baru dimulai!');
    maybeRunBotTurn();
  };

  app.guestHandleMessage = function (msg) {
    if (msg.msgType === 'lobby') { env.onLobby && env.onLobby(msg.seats); }
    else if (msg.msgType === 'game_start') {
      app.gameStarted = true; app.lastReceivedState = msg.payload; app.myGuestIdx = msg.payload.yourIdx;
      renderAll('Permainan dimulai!');
    } else if (msg.msgType === 'state') { app.lastReceivedState = msg.payload; renderAll(msg.payload.event); }
    else if (msg.msgType === 'room_full') { env.onRoomFull && env.onRoomFull(); }
  };

  return app;
}

/* ============================= UI ============================= */
const eventLines = [];
let scoreVisible = false;
let lastTurnPlayerIdx = null;
let handoffActive = false;
let pendingHandoffView = null;
let turnToastTimer = null;
let comboMode = false;
let comboSelectedIds = [];

/* ============================= CARD-PLAY FLIGHT ANIMATION ============================= */
let lastMeta = null;                 // { discardTopId, discardCount, currentPlayerIdx, yourIdx, roundOver }
let lastHandRectsById = {};          // cardId -> DOMRect, captured after each hand render (fallback only)
let lastSeatRectsByIdx = {};         // seatIdx -> DOMRect, captured after each opponents render
let lastPileTargetRect = null;       // discard pile position, captured after each pile render
let pendingSelfSourceRect = null;    // exact rect of the hand-card element at the moment it was clicked (reflects hover/lift state)
let pendingSelfCardId = null;

function flyCard(card, sourceRect, targetRect){
  if (!sourceRect || !targetRect || !card) return;
  const el = document.createElement('div');
  el.className = 'flying-card';
  el.innerHTML = cardSVG(card, false);
  el.style.left = sourceRect.left + 'px';
  el.style.top = sourceRect.top + 'px';
  el.style.width = sourceRect.width + 'px';
  el.style.height = sourceRect.height + 'px';
  document.body.appendChild(el);
  const dx = (targetRect.left + targetRect.width/2) - (sourceRect.left + sourceRect.width/2);
  const dy = (targetRect.top + targetRect.height/2) - (sourceRect.top + sourceRect.height/2);
  const scale = Math.max(0.35, Math.min(1.6, targetRect.width / sourceRect.width));
  const rot = (Math.random()*28 - 14).toFixed(1);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      el.style.transform = 'translate('+dx.toFixed(1)+'px,'+dy.toFixed(1)+'px) rotate('+rot+'deg) scale('+scale.toFixed(3)+')';
      el.style.opacity = '0.92';
    });
  });
  let done = false;
  const cleanup = () => { if (done) return; done = true; el.remove(); };
  el.addEventListener('transitionend', cleanup, { once:true });
  setTimeout(cleanup, 550);
}

/* Compares the outgoing view to the previously rendered one and, if a card was just played,
   flings a copy of it from its source (your hand, or the acting opponent's seat) to the discard pile. */
function maybeAnimateCardPlay(view){
  if (!lastMeta || lastMeta.roundOver || view.roundOver) return;
  if (!view.discardTop || lastMeta.discardTopId == null) return;
  if (view.discardTop.id === lastMeta.discardTopId) return;
  if (view.discardCount < lastMeta.discardCount) return; // reshuffle / new round, not a play
  const actorIdx = lastMeta.currentPlayerIdx;
  let sourceRect = null;
  if (actorIdx === lastMeta.yourIdx) {
    if (pendingSelfCardId === view.discardTop.id && pendingSelfSourceRect) sourceRect = pendingSelfSourceRect;
    else sourceRect = lastHandRectsById[view.discardTop.id] || null;
  } else {
    sourceRect = lastSeatRectsByIdx[actorIdx] || null;
  }
  pendingSelfSourceRect = null; pendingSelfCardId = null;
  if (sourceRect && lastPileTargetRect) flyCard(view.discardTop, sourceRect, lastPileTargetRect);
}
function hasComboOpportunity(hand, topCard, currentColor){
  const groups = {};
  for (const c of hand) {
    if (c.value >= '0' && c.value <= '9') { (groups[c.value] = groups[c.value] || []).push(c); }
  }
  return Object.keys(groups).some(v => {
    const group = groups[v];
    if (group.length < 2) return false;
    return group.some(c => canPlay(c, topCard, currentColor));
  });
}

function isMyTurnNow(view){ return view.yourIdx === view.currentPlayerIdx; }

/* ---- Turn label: who's actually up (bot / named local player / you) ---- */
function turnLabel(view){
  const idx = view.currentPlayerIdx;
  const seat = view.seats[idx];
  if (!seat) return '?';
  const botTag = seat.type === 'bot' ? ' (Bot)' : '';
  if (app.mode === 'offline') {
    const humanSeatCount = view.seats.filter(s => s.type === 'human').length;
    if (seat.type === 'human' && humanSeatCount === 1) return 'Giliranmu';
    return 'Giliran ' + seat.name + botTag;
  }
  if (idx === view.yourIdx) return 'Giliranmu' + botTag;
  return 'Giliran ' + seat.name + botTag;
}

/* ---- Toast notification whenever the active turn changes ---- */
function showTurnToast(text, idx, isBot){
  const el = document.getElementById('turnToast');
  const avatar = (idx == null) ? '' : avatarSVG(idx, !!isBot, 22);
  el.innerHTML = avatar ? ('<span class="tt-row">'+avatar+'<span>'+escapeText(text)+'</span></span>') : escapeText(text);
  el.classList.add('show');
  clearTimeout(turnToastTimer);
  turnToastTimer = setTimeout(() => el.classList.remove('show'), 1800);
}

/* ---- Pass-and-play overlay for local hotseat turns (offline, 2+ human seats) ---- */
function showPassOverlay(name, idx){
  document.getElementById('passOverlayTitle').textContent = 'Giliran ' + name;
  const avatarWrap = document.getElementById('passOverlayAvatar');
  avatarWrap.innerHTML = (idx == null) ? '' : avatarSVG(idx, false, 72);
  document.getElementById('passOverlay').classList.add('show');
}

function handleTurnChange(view, eventText){
  if (view.roundOver) return { gate:false };
  if (eventText === 'Permainan dimulai!' || eventText === 'Ronde baru dimulai!') lastTurnPlayerIdx = null;
  const idx = view.currentPlayerIdx;
  if (idx === lastTurnPlayerIdx) return { gate:false };
  lastTurnPlayerIdx = idx;
  const seat = view.seats[idx];
  if (!seat) return { gate:false };

  if (app.mode === 'offline') {
    const humanSeatCount = view.seats.filter(s => s.type === 'human').length;
    if (seat.type === 'human' && humanSeatCount > 1) return { gate:true, name: seat.name, idx: idx };
    showTurnToast(seat.type === 'bot' ? ('Giliran ' + seat.name) : 'Giliranmu!', idx, seat.type === 'bot');
    return { gate:false };
  }

  const label = seat.type === 'bot' ? ('Giliran ' + seat.name) : (idx === view.yourIdx ? 'Giliranmu!' : 'Giliran ' + seat.name);
  showTurnToast(label, idx, seat.type === 'bot');
  return { gate:false };
}

function renderOpponents(view){
  const row = document.getElementById('opponentsRow');
  let html = '';
  for (let i = 0; i < view.seats.length; i++) {
    if (i === view.yourIdx) continue;
    const s = view.seats[i];
    const active = i === view.currentPlayerIdx;
    const isDisc = s.connected === false;
    const cls = 'opp-chip' + (active ? ' active-turn' : '') + (s.type === 'bot' ? ' type-bot' : '') + (isDisc ? ' disconnected' : '');
    const countLine = isDisc
      ? '<span class="spinner sm"></span><span>menyambung ulang...</span>'
      : s.count+' kartu'+(s.type==='bot'?' · Bot':'');
    html += '<div class="'+cls+'" data-seat="'+i+'"><div class="opp-avatar">'+avatarSVG(i, s.type==='bot', 34)+'</div><div class="opp-info"><div class="opp-name">'+escapeText(s.name)+'</div><div class="opp-count">'+countLine+'</div></div></div>';
  }
  row.innerHTML = html;
  lastSeatRectsByIdx = {};
  row.querySelectorAll('.opp-chip').forEach(el => {
    lastSeatRectsByIdx[Number(el.getAttribute('data-seat'))] = el.querySelector('.opp-avatar').getBoundingClientRect();
  });
}
function escapeText(s){ return String(s==null?'':s).replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c])); }

function renderPiles(view){
  const wrap = document.getElementById('pileArea');
  const ringColor = CARD_COLORS[view.currentColor] || '#c9a15a';
  wrap.innerHTML =
    '<div class="pile-stack">' + cardSVG(null, true) + '<div class="pile-count-badge">'+view.deckCount+'</div></div>' +
    '<div>'+directionIconSVG(view.direction)+'</div>' +
    '<div class="pile-stack" id="discardPile"><div class="color-ring" style="border-color:'+ringColor+'"></div>' + cardSVG(view.discardTop, false) + '</div>';
  lastPileTargetRect = document.getElementById('discardPile').getBoundingClientRect();
}

function renderHand(view){
  const wrap = document.getElementById('handWrap');
  const canAct = isMyTurnNow(view) && !view.roundOver;
  const pending = canAct && view.pendingDrawFor === view.yourIdx;

  if (comboMode && canAct && !pending) {
    const firstCard = comboSelectedIds.length ? view.yourHand.find(c => c.id === comboSelectedIds[0]) : null;
    const selectedValue = firstCard ? firstCard.value : null;
    wrap.innerHTML = view.yourHand.map(c => {
      const isNumeric = c.value >= '0' && c.value <= '9';
      const isSelected = comboSelectedIds.includes(c.id);
      const canSelect = isNumeric && (selectedValue === null || c.value === selectedValue);
      const cls = 'hand-card ' + (isSelected ? 'combo-selected' : (canSelect ? 'playable' : 'notplayable'));
      const badge = isSelected ? '<div class="combo-badge">'+(comboSelectedIds.indexOf(c.id)+1)+'</div>' : '';
      return '<div class="'+cls+'" data-card="'+c.id+'">'+cardSVG(c,false)+badge+'</div>';
    }).join('');
    [...wrap.children].forEach(el => {
      el.addEventListener('click', () => {
        const id = Number(el.getAttribute('data-card'));
        const card = view.yourHand.find(c => c.id === id);
        if (!card) return;
        const sel = comboSelectedIds.indexOf(id);
        if (sel !== -1) { comboSelectedIds.splice(sel, 1); renderTable(view, ''); return; }
        const isNumeric = card.value >= '0' && card.value <= '9';
        if (!isNumeric) return;
        if (comboSelectedIds.length) {
          const fc = view.yourHand.find(c => c.id === comboSelectedIds[0]);
          if (card.value !== fc.value) return;
        }
        comboSelectedIds.push(id);
        renderTable(view, '');
      });
    });
    captureHandRects(wrap);
    return;
  }

  wrap.innerHTML = view.yourHand.map(c => {
    const playable = canAct && canPlay(c, view.discardTop, view.currentColor, view.drawStack);
    return '<div class="hand-card '+(playable?'playable':'notplayable')+'" data-card="'+c.id+'">'+cardSVG(c,false)+'</div>';
  }).join('');
  [...wrap.children].forEach(el => {
    el.addEventListener('click', () => {
      if (!el.classList.contains('playable')) return;
      const id = Number(el.getAttribute('data-card'));
      const card = view.yourHand.find(c => c.id === id);
      if (!card) return;
      pendingSelfSourceRect = el.getBoundingClientRect();
      pendingSelfCardId = id;
      if (card.color === 'wild') openColorPicker(id);
      else app.requestPlay(id);
    });
  });
  captureHandRects(wrap);
}
function captureHandRects(wrap){
  lastHandRectsById = {};
  [...wrap.children].forEach(el => {
    lastHandRectsById[Number(el.getAttribute('data-card'))] = el.getBoundingClientRect();
  });
}

function renderActions(view){
  const canAct = isMyTurnNow(view) && !view.roundOver;
  const pending = canAct && view.pendingDrawFor === view.yourIdx;
  const stacked = canAct && view.drawStack > 0;
  if (!canAct) { comboMode = false; comboSelectedIds = []; }

  const btnDraw = document.getElementById('btnDraw');
  const btnPass = document.getElementById('btnPass');
  const btnCombo = document.getElementById('btnCombo');
  const btnComboPlay = document.getElementById('btnComboPlay');
  const btnComboCancel = document.getElementById('btnComboCancel');

  const showComboToggle = canAct && !pending && !stacked && !comboMode && hasComboOpportunity(view.yourHand, view.discardTop, view.currentColor);
  btnDraw.style.display = (canAct && !pending && !comboMode) ? '' : 'none';
  btnDraw.textContent = stacked ? ('Ambil ' + view.drawStack + ' Kartu') : 'Ambil Kartu';
  btnDraw.dataset.mode = stacked ? 'stack' : 'draw';
  btnPass.style.display = (pending && !stacked && !comboMode) ? '' : 'none';
  btnCombo.style.display = showComboToggle ? '' : 'none';
  btnComboPlay.style.display = comboMode ? '' : 'none';
  btnComboCancel.style.display = comboMode ? '' : 'none';

  if (comboMode) {
    const legal = comboSelectedIds.some(id => {
      const c = view.yourHand.find(x => x.id === id);
      return c && canPlay(c, view.discardTop, view.currentColor, view.drawStack);
    });
    btnComboPlay.disabled = !legal;
    btnComboPlay.textContent = 'Mainkan Kombo' + (comboSelectedIds.length ? ' ('+comboSelectedIds.length+')' : '');
  }

  const unoBtn = document.getElementById('btnCallUno');
  const showUno = view.yourHand.length === 1 && !view.unoCalled[view.yourIdx] && !view.roundOver;
  unoBtn.classList.toggle('show', showUno);
}

function renderStatus(view, eventText){
  const el = document.getElementById('statusBar');
  let text, cls = '';
  if (view.roundOver) {
    const winnerName = view.seats[view.winnerIdx] ? view.seats[view.winnerIdx].name : '?';
    text = 'Ronde selesai — ' + winnerName + ' menang!'; cls = 'over';
  } else {
    text = turnLabel(view);
    if (view.pendingDrawFor === view.currentPlayerIdx) text += ' — mainkan atau lewat';
    if (view.drawStack > 0) { text += ' — kena tumpuk +' + view.drawStack + '! Mainkan +2 atau ambil kartu'; cls = 'check'; }
  }
  const dot = CARD_COLORS[view.currentColor] || '#c9a15a';
  el.innerHTML = '<span class="status-dot" style="background:'+dot+'"></span><span>'+text+'</span>';
  el.className = 'status-bar' + (cls?' '+cls:'');
}

function renderScore(view){
  const card = document.getElementById('scoreCard');
  if (!view || !scoreVisible) { card.style.display='none'; return; }
  card.style.display = '';
  document.getElementById('scoreList').innerHTML = view.seats.map((s,i) =>
    '<div class="srow"><span class="sname">'+avatarSVG(i, s.type==='bot', 20)+escapeText(s.name)+'</span><span>'+(view.scores?view.scores[i]:0)+'</span></div>'
  ).join('');
}

function pushEvent(text){
  if (!text) return;
  eventLines.push(text);
  if (eventLines.length > 60) eventLines.shift();
  const card = document.getElementById('logCard');
  card.style.display = '';
  const el = document.getElementById('eventLog');
  el.innerHTML = eventLines.map(t => '<div>'+escapeText(t)+'</div>').join('');
  el.scrollTop = el.scrollHeight;
}

function openColorPicker(cardId){
  const overlay = document.getElementById('colorOverlay');
  const wrap = document.getElementById('colorChoices');
  wrap.innerHTML = '';
  ['red','yellow','green','blue'].forEach(col => {
    const btn = document.createElement('button');
    btn.className = 'color-swatch';
    btn.style.background = CARD_COLORS[col];
    btn.addEventListener('click', () => { overlay.classList.remove('show'); app.requestPlay(cardId, col); });
    wrap.appendChild(btn);
  });
  overlay.classList.add('show');
}

function showRoundOverIfNeeded(view){
  const overlay = document.getElementById('roundOverOverlay');
  if (!view || !view.roundOver) { overlay.classList.remove('show'); return; }
  const winnerName = view.seats[view.winnerIdx] ? view.seats[view.winnerIdx].name : '?';
  document.getElementById('roundOverText').textContent = winnerName + ' menang ronde ini!';
  document.getElementById('roundScoreList').innerHTML = view.seats.map((s,i) =>
    '<div class="srow" style="display:flex;justify-content:space-between;padding:3px 0;"><span>'+escapeText(s.name)+'</span><span>'+(view.scores?view.scores[i]:0)+'</span></div>'
  ).join('');
  const canControlNext = !(app.mode === 'online' && app.onlineRole === 'guest');
  document.getElementById('btnNextRound').style.display = canControlNext ? '' : 'none';
  overlay.classList.add('show');
}

function renderTable(view, eventText){
  if (!view) return;
  maybeAnimateCardPlay(view);
  if (handoffActive) {
    pendingHandoffView = view;
  } else {
    const res = handleTurnChange(view, eventText);
    if (res.gate) {
      handoffActive = true;
      pendingHandoffView = view;
      showPassOverlay(res.name, res.idx);
    }
  }
  renderOpponents(view);
  renderPiles(view);
  if (handoffActive) {
    document.getElementById('handWrap').innerHTML = '';
    document.getElementById('btnDraw').style.display = 'none';
    document.getElementById('btnPass').style.display = 'none';
    document.getElementById('btnCombo').style.display = 'none';
    document.getElementById('btnComboPlay').style.display = 'none';
    document.getElementById('btnComboCancel').style.display = 'none';
    document.getElementById('btnCallUno').classList.remove('show');
  } else {
    renderHand(view);
    renderActions(view);
  }
  renderStatus(view, eventText);
  renderScore(view);
  pushEvent(eventText);
  showRoundOverIfNeeded(view);
  lastMeta = {
    discardTopId: view.discardTop ? view.discardTop.id : null,
    discardCount: view.discardCount,
    currentPlayerIdx: view.currentPlayerIdx,
    yourIdx: view.yourIdx,
    roundOver: view.roundOver,
  };
}

document.getElementById('btnPassReady').addEventListener('click', () => {
  document.getElementById('passOverlay').classList.remove('show');
  handoffActive = false;
  if (pendingHandoffView) { const v = pendingHandoffView; pendingHandoffView = null; renderTable(v, ''); }
});

/* ============================= ENV WIRING ============================= */
const env = {
  sendToConn(conn, msg){ try { conn.send(msg); } catch(e){} },
  scheduleTimeout(fn, ms){ return setTimeout(fn, ms); },
  botDelay(){ return 700 + Math.random()*500; },
  onRender(view, eventText){
    if (view) {
      document.getElementById('setupCard').style.display = 'none'; showGamePanels(true);
      document.getElementById('btnExitGame').textContent = app.mode === 'online' ? 'Keluar Room' : 'Kembali ke Menu';
      renderTable(view, eventText);
    }
  },
  onLobby(seats){ renderRoster(seats); },
  onRoomFull(){ showOnlineError('Room sudah penuh.'); },
};
const app = createApp(env);

function showGamePanels(show){
  document.querySelectorAll('.table-col > *').forEach(el => { el.style.display = show ? '' : 'none'; });
}
showGamePanels(false);

/* ============================= OFFLINE SETUP UI ============================= */
function renderOfflineSeatList(count){
  const wrap = document.getElementById('offlineSeatList');
  let html = '';
  for (let i = 0; i < count; i++) {
    if (i === 0) {
      html += '<div class="seat-row"><span class="seat-idx">'+(i+1)+'</span><input class="field-input" id="seatName0" value="Anda" maxlength="14"><span style="font-size:11px;color:var(--text-muted);width:52px;text-align:right;">Anda</span></div>';
    } else {
      html += '<div class="seat-row"><span class="seat-idx">'+(i+1)+'</span>' +
        '<input class="field-input" id="seatName'+i+'" value="'+(i===1?'Bot':'Pemain'+(i+1))+'" maxlength="14">' +
        '<div class="seat-toggle" data-seat="'+i+'">' +
        '<button data-t="bot" class="'+(i===1?'active':'')+'">Bot</button>' +
        '<button data-t="human" class="'+(i===1?'':'active')+'">Lokal</button>' +
        '</div></div>';
    }
  }
  wrap.innerHTML = html;
  wrap.querySelectorAll('.seat-toggle').forEach(tg => {
    tg.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      [...tg.children].forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}
renderOfflineSeatList(4);

document.getElementById('countSeg').addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  [...document.getElementById('countSeg').children].forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderOfflineSeatList(Number(btn.getAttribute('data-val')));
});

document.getElementById('btnStartOffline').addEventListener('click', () => {
  const count = Number(document.querySelector('#countSeg button.active').getAttribute('data-val'));
  const seats = [];
  for (let i = 0; i < count; i++) {
    const name = document.getElementById('seatName'+i).value.trim() || ('Pemain'+(i+1));
    if (i === 0) { seats.push({ type:'human', name, conn:null }); continue; }
    const tgActive = document.querySelector('.seat-toggle[data-seat="'+i+'"] button.active');
    const t = tgActive ? tgActive.getAttribute('data-t') : 'bot';
    seats.push({ type: t === 'bot' ? 'bot' : 'human', name, conn:null });
  }
  app.mode = 'offline'; app.onlineRole = null;
  app.seats = seats;
  app.localGame = new UnoGame(seats.length, seats.map(s=>s.name));
  app.gameStarted = true;
  scoreVisible = true;
  eventLines.length = 0;
  app.renderAll('Permainan dimulai!');
  app.maybeRunBotTurn();
});

/* ============================= MODE / ONLINE SETUP UI ============================= */
document.getElementById('modeSeg').addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  [...document.getElementById('modeSeg').children].forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const val = btn.getAttribute('data-val');
  document.getElementById('offlineSetup').style.display = (val==='offline') ? '' : 'none';
  document.getElementById('onlineSetup').style.display = (val==='online') ? '' : 'none';
});
document.getElementById('hostCountSeg').addEventListener('click', (e) => {
  const btn = e.target.closest('button'); if (!btn) return;
  [...document.getElementById('hostCountSeg').children].forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
});

const ROOM_PREFIX = 'studiouno-';
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
function genRoomCode(len){ len=len||5; let s=''; for(let i=0;i<len;i++) s+=CODE_CHARS[Math.floor(Math.random()*CODE_CHARS.length)]; return s; }
function randomDefaultName(){ return 'Pemain'+Math.floor(10+Math.random()*90); }
function peerAvailable(){ return typeof Peer !== 'undefined'; }
const NO_INTERNET_MSG = 'Main online butuh koneksi internet.';

let peer=null, myPeerId=null, currentRoomCode='-----', myName='', createAttempts=0, joinSettled=false, joinTimeoutId=null;

function showOnlineError(msg){ document.getElementById('onlineError').textContent = msg||''; }
function setOnlineBusy(b){
  document.getElementById('btnCreateRoom').disabled=b; document.getElementById('btnJoinRoom').disabled=b;
  document.getElementById('onlineBusyLine').classList.toggle('show', b);
}
function showConnBanner(text){
  document.getElementById('connBannerText').textContent = text;
  document.getElementById('connBanner').classList.add('show');
}
function hideConnBanner(){ document.getElementById('connBanner').classList.remove('show'); }

function renderRoster(seats){
  const wrap = document.getElementById('rosterList');
  const isHost = app.onlineRole === 'host';
  wrap.innerHTML = seats.map((s,i) => {
    const dotCls = s.type==='human' ? 'on' : (s.type==='bot' ? 'off' : 'off');
    const label = i===0 ? (s.name||'Host')+' (Host)' : (s.type==='human' ? s.name : (s.type==='bot' ? s.name+' (Bot)' : 'Menunggu pemain...'));
    let toggle = '';
    if (isHost && i>0 && s.type!=='human') {
      toggle = '<button class="tiny-toggle" data-seat="'+i+'">'+(s.type==='bot'?'Jadikan Terbuka':'Jadikan Bot')+'</button>';
    }
    const avatar = s.type === 'open' ? '' : '<span class="roster-avatar">'+avatarSVG(i, s.type==='bot', 24)+'</span>';
    return '<div class="roster-row"><span class="dot '+dotCls+'"></span>'+avatar+'<span class="rname">'+escapeText(label)+'</span>'+toggle+'</div>';
  }).join('');
  if (isHost) {
    wrap.querySelectorAll('.tiny-toggle').forEach(b => {
      b.addEventListener('click', () => {
        const idx = Number(b.getAttribute('data-seat'));
        if (!app.seats[idx] || app.seats[idx].type === 'human') return;
        app.seats[idx].type = app.seats[idx].type === 'bot' ? 'open' : 'bot';
        app.broadcastLobby();
      });
    });
  }
}

document.getElementById('btnCreateRoom').addEventListener('click', () => {
  if (!peerAvailable()) { showOnlineError(NO_INTERNET_MSG); return; }
  myName = (document.getElementById('playerNameInput').value||'').trim() || randomDefaultName();
  const count = Number(document.querySelector('#hostCountSeg button.active').getAttribute('data-val'));
  app.mode = 'online'; app.onlineRole = 'host';
  app.seats = [{ type:'human', name:myName, conn:null }];
  for (let i=1;i<count;i++) app.seats.push({ type:'open', name:'', conn:null });
  createAttempts = 0;
  showOnlineError(''); setOnlineBusy(true);
  document.getElementById('onlineEntry').style.display='none';
  document.getElementById('onlineLobby').style.display='';
  document.getElementById('roomCodeDisplay').textContent='-----';
  document.getElementById('roomCodeWait').style.display='flex';
  document.getElementById('btnCopyCode').style.display='none';
  document.getElementById('hostStartWrap').style.display='';
  document.getElementById('guestWaitMsg').style.display='none';
  renderRoster(app.seats);
  tryCreateRoom();
});

function tryCreateRoom(){
  const code = genRoomCode();
  peer = new Peer(ROOM_PREFIX + code);
  peer.on('open', () => {
    currentRoomCode = code; document.getElementById('roomCodeDisplay').textContent = code; setOnlineBusy(false);
    document.getElementById('roomCodeWait').style.display='none';
    document.getElementById('btnCopyCode').style.display='';
    hideConnBanner();
  });
  peer.on('disconnected', () => {
    if (app.mode !== 'online' || app.onlineRole !== 'host') return;
    showConnBanner('Koneksi tidak stabil, menyambung ulang...');
    try { peer.reconnect(); } catch(e){}
  });
  peer.on('connection', (conn) => {
    app.hostAcceptConnection(conn);
    conn.on('data', (msg) => app.hostHandleMessage(conn, msg));
    conn.on('close', () => app.hostHandleDisconnect(conn));
  });
  peer.on('error', (err) => {
    if (err && err.type==='unavailable-id' && createAttempts<5){ createAttempts++; peer.destroy(); tryCreateRoom(); }
    else { showOnlineError('Gagal membuat room. Coba lagi.'); setOnlineBusy(false); }
  });
}

document.getElementById('btnJoinRoom').addEventListener('click', () => {
  if (!peerAvailable()) { showOnlineError(NO_INTERNET_MSG); return; }
  const code = (document.getElementById('joinCodeInput').value||'').trim().toUpperCase();
  if (code.length < 4) { showOnlineError('Masukkan kode room yang valid.'); return; }
  myName = (document.getElementById('playerNameInput').value||'').trim() || randomDefaultName();
  app.mode = 'online'; app.onlineRole = 'guest';
  currentRoomCode = code;
  showOnlineError(''); setOnlineBusy(true); joinSettled=false; guestReconnectAttempts=0;

  peer = new Peer();
  wireGuestPeerDisconnect(peer);
  peer.on('open', () => {
    const conn = peer.connect(ROOM_PREFIX + code, { reliable:true });
    app.hostConn = conn;
    conn.on('open', () => {
      if (joinSettled) { guestReconnectAttempts = 0; hideConnBanner(); conn.send({ msgType:'join_request', name: myName }); return; }
      joinSettled = true; clearTimeout(joinTimeoutId);
      setOnlineBusy(false);
      document.getElementById('onlineEntry').style.display='none';
      document.getElementById('onlineLobby').style.display='';
      document.getElementById('roomCodeDisplay').textContent = code;
      document.getElementById('hostStartWrap').style.display='none';
      document.getElementById('guestWaitMsg').style.display='flex';
      conn.send({ msgType:'join_request', name: myName });
    });
    conn.on('data', (msg) => app.guestHandleMessage(msg));
    conn.on('close', () => { if (joinSettled) guestAttemptReconnect(); else failJoin('Room tidak ditemukan.'); });
    conn.on('error', () => { if (joinSettled) guestAttemptReconnect(); else failJoin('Room tidak ditemukan.'); });
    joinTimeoutId = setTimeout(() => { if (!joinSettled) failJoin('Room tidak ditemukan.'); }, 8000);
  });
  peer.on('error', (err) => {
    if (joinSettled) { guestAttemptReconnect(); return; }
    if (err && err.type==='peer-unavailable') failJoin('Room tidak ditemukan.');
    else failJoin('Gagal terhubung. Coba lagi.');
  });
});
function wireGuestPeerDisconnect(p){
  p.on('disconnected', () => {
    if (app.mode !== 'online' || app.onlineRole !== 'guest') return;
    showConnBanner('Koneksi tidak stabil, menyambung ulang...');
    try { p.reconnect(); } catch(e){}
  });
}
let guestReconnectAttempts = 0;
const GUEST_MAX_RECONNECT = 5;
function guestAttemptReconnect(){
  if (app.mode !== 'online' || app.onlineRole !== 'guest') return;
  if (guestReconnectAttempts >= GUEST_MAX_RECONNECT) {
    hideConnBanner();
    showOnlineError('Host terputus, room berakhir.');
    backToMenu();
    return;
  }
  guestReconnectAttempts++;
  showConnBanner('Koneksi terputus, menyambung ulang... (' + guestReconnectAttempts + '/' + GUEST_MAX_RECONNECT + ')');
  const delay = Math.min(1000 * guestReconnectAttempts, 4000);
  setTimeout(() => {
    if (app.mode !== 'online' || app.onlineRole !== 'guest') return;
    try { if (peer) peer.destroy(); } catch(e){}
    peer = new Peer();
    wireGuestPeerDisconnect(peer);
    peer.on('open', () => {
      const conn = peer.connect(ROOM_PREFIX + currentRoomCode, { reliable:true });
      app.hostConn = conn;
      conn.on('open', () => { guestReconnectAttempts = 0; hideConnBanner(); conn.send({ msgType:'join_request', name: myName }); });
      conn.on('data', (msg) => app.guestHandleMessage(msg));
      conn.on('close', () => guestAttemptReconnect());
      conn.on('error', () => guestAttemptReconnect());
    });
    peer.on('error', () => guestAttemptReconnect());
  }, delay);
}
function failJoin(msg){ if (joinSettled) return; joinSettled=true; clearTimeout(joinTimeoutId); setOnlineBusy(false); showOnlineError(msg); teardownPeer(); }
function teardownPeer(){ if (app.hostConn) { try{app.hostConn.close();}catch(e){} app.hostConn=null; } if (peer) { try{peer.destroy();}catch(e){} peer=null; } }

document.getElementById('btnStartOnline').addEventListener('click', () => {
  if (app.onlineRole !== 'host') return;
  scoreVisible = true; eventLines.length = 0;
  app.hostStartGame();
});

document.getElementById('btnLeaveRoom').addEventListener('click', () => { backToMenu(); });
function backToMenu(){
  teardownPeer();
  if (app.botTimer) { clearTimeout(app.botTimer); app.botTimer = null; }
  app.mode='offline'; app.onlineRole=null; app.seats=[]; app.localGame=null; app.gameStarted=false;
  handoffActive = false; pendingHandoffView = null; lastTurnPlayerIdx = null;
  guestReconnectAttempts = 0; hideConnBanner();
  document.getElementById('passOverlay').classList.remove('show');
  document.getElementById('turnToast').classList.remove('show');
  document.getElementById('onlineLobby').style.display='none';
  document.getElementById('onlineEntry').style.display='';
  document.getElementById('setupCard').style.display='';
  showGamePanels(false);
  document.getElementById('scoreCard').style.display='none';
  document.getElementById('logCard').style.display='none';
  document.getElementById('roundOverOverlay').classList.remove('show');
}

document.getElementById('btnExitGame').addEventListener('click', () => {
  const msg = app.mode === 'online'
    ? 'Yakin ingin keluar dari room ini? Kamu akan berhenti dari permainan ini.'
    : 'Yakin ingin keluar dan kembali ke menu utama?';
  if (!window.confirm(msg)) return;
  backToMenu();
});

/* ============================= IN-GAME ACTION BUTTONS ============================= */
document.getElementById('btnDraw').addEventListener('click', (e) => {
  if (e.currentTarget.dataset.mode === 'stack') app.requestResolveStack();
  else app.requestDraw();
});
document.getElementById('btnPass').addEventListener('click', () => app.requestPass());
document.getElementById('btnCombo').addEventListener('click', () => {
  comboMode = true; comboSelectedIds = [];
  renderTable(app.getViewState(), '');
});
document.getElementById('btnComboCancel').addEventListener('click', () => {
  comboMode = false; comboSelectedIds = [];
  renderTable(app.getViewState(), '');
});
document.getElementById('btnComboPlay').addEventListener('click', () => {
  if (comboSelectedIds.length === 0) return;
  const ids = comboSelectedIds.slice();
  comboMode = false; comboSelectedIds = [];
  app.requestPlayCombo(ids);
});
document.getElementById('btnCallUno').addEventListener('click', () => { app.requestCallUno(); document.getElementById('btnCallUno').classList.remove('show'); });
document.getElementById('btnNextRound').addEventListener('click', () => {
  if (app.mode === 'online' && app.onlineRole === 'guest') return;
  app.hostNextRound();
});
document.getElementById('btnBackToMenu').addEventListener('click', () => { backToMenu(); });
document.getElementById('btnCopyCode').addEventListener('click', () => {
  const btn = document.getElementById('btnCopyCode');
  const done = () => { const old = btn.textContent; btn.textContent='Tersalin!'; setTimeout(()=>{btn.textContent=old;},1400); };
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(currentRoomCode).then(done).catch(done);
  else done();
});
document.getElementById('joinCodeInput').addEventListener('input', (e) => { e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g,''); });

})();
