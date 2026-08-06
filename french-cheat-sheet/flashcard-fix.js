(() => {
  const card = document.getElementById('largeFlashcard');
  if (!card) return;

  const resetBeforeSwap = () => {
    card.classList.add('is-switching');
    card.classList.remove('is-revealed');
    card.setAttribute('aria-pressed', 'false');

    const side = document.getElementById('largeFlashcardSide');
    const reveal = document.getElementById('largeFlashcardReveal');
    if (side) side.textContent = 'English prompt';
    if (reveal) reveal.textContent = 'Reveal answer';

    requestAnimationFrame(() => {
      requestAnimationFrame(() => card.classList.remove('is-switching'));
    });
  };

  [
    'largeFlashcardPrev',
    'largeFlashcardNext',
    'largeFlashcardPreviousBottom',
    'largeFlashcardNextBottom',
    'largeFlashcardShuffle'
  ].forEach((id) => {
    const control = document.getElementById(id);
    if (control) control.addEventListener('click', resetBeforeSwap, true);
  });

  const filter = document.getElementById('largeFlashcardFilter');
  if (filter) filter.addEventListener('change', resetBeforeSwap, true);

  card.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') resetBeforeSwap();
  }, true);
})();
