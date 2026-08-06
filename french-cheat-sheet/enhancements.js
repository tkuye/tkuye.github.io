(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const verbDefinitions = {
    'être': 'to be',
    'avoir': 'to have',
    'aller': 'to go',
    'venir': 'to come',
    'pouvoir': 'can / to be able to',
    'vouloir': 'to want',
    'devoir': 'must / to have to',
    'faire': 'to do / to make'
  };

  function addVerbDefinitions() {
    const table = $('#verbTable');
    if (!table) return;

    const headers = $$('thead th', table);
    headers.slice(1).forEach((header) => {
      const french = header.textContent.trim();
      const english = verbDefinitions[french];
      if (!english) return;

      header.innerHTML = `
        <span class="verb-heading">
          <span class="verb-heading-fr">${french}</span>
          <span class="verb-heading-en">${english}</span>
        </span>`;
      header.title = `${french} — ${english}`;
    });

    const section = table.closest('section');
    const tableWrap = table.closest('.table-wrap');
    if (!section || !tableWrap || $('.verb-definition-strip', section)) return;

    const strip = document.createElement('div');
    strip.className = 'verb-definition-strip';
    strip.setAttribute('aria-label', 'English meanings of the essential French verbs');
    strip.innerHTML = Object.entries(verbDefinitions)
      .map(([fr, en]) => `<div class="verb-definition"><strong>${fr}</strong><span>${en}</span></div>`)
      .join('');
    tableWrap.before(strip);
  }

  const tenseLabel = (value) => {
    const tenses = value.split(/\s+/).filter(Boolean);
    if (tenses.includes('passe') && tenses.includes('imparfait')) return 'Both past tenses';
    if (tenses.includes('passe')) return 'Passé composé';
    if (tenses.includes('imparfait')) return 'Imparfait';
    if (tenses.includes('present')) return 'Présent';
    return 'General conversation';
  };

  const tenseClass = (value) => {
    if (value.includes('passe') && !value.includes('imparfait')) return 'passe';
    if (value.includes('imparfait') && !value.includes('passe')) return 'imparfait';
    return '';
  };

  function collectExampleCards() {
    return $$('.card[data-tense]')
      .map((card, sourceIndex) => ({
        sourceIndex,
        tense: card.dataset.tense || 'both',
        english: $('.en', card)?.textContent.trim() || '',
        french: $('.fr', card)?.textContent.trim() || '',
        note: $('.note', card)?.textContent.trim() || ''
      }))
      .filter((card) => card.english && card.french);
  }

  function addLargeFlashcards() {
    const quizSection = $('#quiz');
    if (!quizSection || $('#all-flashcards')) return;

    const allCards = collectExampleCards();
    if (!allCards.length) return;

    const section = document.createElement('section');
    section.id = 'all-flashcards';
    section.className = 'large-flashcards-section';
    section.innerHTML = `
      <div class="section-head">
        <div>
          <span class="kicker">Every example, restored</span>
          <h2>Large example flashcards</h2>
        </div>
        <p>Study every conversational example on this page as a full-size card. Read the English, say the French aloud, then reveal the answer.</p>
      </div>

      <div class="large-flashcard-toolbar">
        <label class="large-flashcard-filter">
          <span>Deck</span>
          <select id="largeFlashcardFilter" aria-label="Filter large flashcards by tense">
            <option value="all">All examples</option>
            <option value="present">Present</option>
            <option value="past">All past</option>
            <option value="passe">Passé composé</option>
            <option value="imparfait">Imparfait</option>
            <option value="general">General conversation</option>
          </select>
        </label>
        <div class="large-flashcard-meta">
          <span id="largeFlashcardCounter" aria-live="polite"></span>
          <button class="btn" id="largeFlashcardShuffle" type="button">Shuffle deck</button>
        </div>
      </div>

      <div class="large-flashcard-stage">
        <button class="large-flashcard-arrow" id="largeFlashcardPrev" type="button" aria-label="Previous flashcard">‹</button>
        <button class="large-flashcard" id="largeFlashcard" type="button" aria-label="Reveal the French answer" aria-pressed="false">
          <span class="large-flashcard-glow" aria-hidden="true"></span>
          <span class="large-flashcard-topline">
            <span class="tense-badge" id="largeFlashcardTense"></span>
            <span class="large-flashcard-side" id="largeFlashcardSide">English prompt</span>
          </span>
          <span class="large-flashcard-front">
            <span class="large-flashcard-instruction">How would you say this in French?</span>
            <span class="large-flashcard-english" id="largeFlashcardEnglish"></span>
            <span class="large-flashcard-hint">Click the card or press Space to reveal</span>
          </span>
          <span class="large-flashcard-back">
            <span class="large-flashcard-instruction">French answer</span>
            <span class="large-flashcard-french" id="largeFlashcardFrench"></span>
            <span class="large-flashcard-note" id="largeFlashcardNote"></span>
            <span class="large-flashcard-hint">Click again to hide the answer</span>
          </span>
        </button>
        <button class="large-flashcard-arrow" id="largeFlashcardNext" type="button" aria-label="Next flashcard">›</button>
      </div>

      <div class="large-flashcard-controls">
        <button class="btn primary" id="largeFlashcardReveal" type="button">Reveal answer</button>
        <button class="btn" id="largeFlashcardListen" type="button">▶ Hear French</button>
        <button class="btn" id="largeFlashcardPreviousBottom" type="button">Previous</button>
        <button class="btn" id="largeFlashcardNextBottom" type="button">Next example</button>
      </div>
      <p class="large-flashcard-keyboard">Keyboard: Space reveals · ← and → move between cards.</p>`;

    quizSection.before(section);

    const nav = $('.nav');
    if (nav) {
      const quizLink = $('a[href="#quiz"]', nav);
      const link = document.createElement('a');
      link.href = '#all-flashcards';
      link.textContent = 'Large flashcards';
      if (quizLink) nav.insertBefore(link, quizLink);
      else nav.append(link);
    }

    const toolbar = $('.toolbar');
    const practiceButton = $('#quizOpen');
    if (toolbar && !$('#largeFlashcardOpen')) {
      const openButton = document.createElement('button');
      openButton.className = 'btn';
      openButton.id = 'largeFlashcardOpen';
      openButton.type = 'button';
      openButton.textContent = 'Large flashcards';
      openButton.addEventListener('click', () => section.scrollIntoView({ behavior: 'smooth' }));
      if (practiceButton) toolbar.insertBefore(openButton, practiceButton);
      else toolbar.append(openButton);
    }

    let deck = [...allCards];
    let index = 0;
    let revealed = false;

    const cardButton = $('#largeFlashcard');
    const filter = $('#largeFlashcardFilter');
    const english = $('#largeFlashcardEnglish');
    const french = $('#largeFlashcardFrench');
    const note = $('#largeFlashcardNote');
    const badge = $('#largeFlashcardTense');
    const counter = $('#largeFlashcardCounter');
    const side = $('#largeFlashcardSide');
    const revealButton = $('#largeFlashcardReveal');

    function setRevealed(next) {
      revealed = next;
      cardButton.classList.toggle('is-revealed', revealed);
      cardButton.setAttribute('aria-pressed', String(revealed));
      cardButton.setAttribute('aria-label', revealed ? 'Hide the French answer' : 'Reveal the French answer');
      side.textContent = revealed ? 'French answer' : 'English prompt';
      revealButton.textContent = revealed ? 'Hide answer' : 'Reveal answer';
    }

    function render() {
      if (!deck.length) {
        english.textContent = 'No examples match this filter.';
        french.textContent = '';
        note.textContent = '';
        counter.textContent = '0 examples';
        badge.textContent = 'Empty deck';
        setRevealed(false);
        return;
      }

      index = (index + deck.length) % deck.length;
      const current = deck[index];
      english.textContent = current.english;
      french.textContent = current.french;
      note.textContent = current.note;
      badge.textContent = tenseLabel(current.tense);
      badge.className = `tense-badge ${tenseClass(current.tense)}`.trim();
      counter.textContent = `${index + 1} of ${deck.length} examples`;
      setRevealed(false);
    }

    function next(step = 1) {
      if (!deck.length) return;
      index = (index + step + deck.length) % deck.length;
      render();
    }

    function applyFilter() {
      const value = filter.value;
      deck = allCards.filter((card) => {
        const tenses = card.tense.split(/\s+/);
        if (value === 'all') return true;
        if (value === 'past') return tenses.includes('passe') || tenses.includes('imparfait');
        if (value === 'general') return tenses.includes('both');
        return tenses.includes(value);
      });
      index = 0;
      render();
    }

    cardButton.addEventListener('click', () => setRevealed(!revealed));
    revealButton.addEventListener('click', () => setRevealed(!revealed));
    $('#largeFlashcardPrev').addEventListener('click', () => next(-1));
    $('#largeFlashcardPreviousBottom').addEventListener('click', () => next(-1));
    $('#largeFlashcardNext').addEventListener('click', () => next(1));
    $('#largeFlashcardNextBottom').addEventListener('click', () => next(1));
    $('#largeFlashcardListen').addEventListener('click', () => {
      if (!deck.length) return;
      const text = deck[index].french;
      if (typeof window.speechSynthesis === 'undefined') return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.replace(/\([^)]*\)/g, '').trim());
      utterance.lang = 'fr-FR';
      utterance.rate = 0.88;
      window.speechSynthesis.speak(utterance);
    });
    $('#largeFlashcardShuffle').addEventListener('click', () => {
      for (let i = deck.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
      }
      index = 0;
      render();
    });
    filter.addEventListener('change', applyFilter);

    cardButton.addEventListener('keydown', (event) => {
      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault();
        setRevealed(!revealed);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        next(1);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        next(-1);
      }
    });

    render();
  }

  addVerbDefinitions();
  addLargeFlashcards();
})();
