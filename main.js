import './style.css';

import { tabs } from './src/js/modules/tabs';
import { cards } from './src/js/modules/cards.js';
import { modal } from './src/js/modules/modal.js';
import { slider } from './src/js/modules/slider.js';
import { timer } from './src/js/modules/timer.js';
import { calc } from './src/js/modules/calc.js';
import { forms } from './src/js/modules/forms.js';
import { openModal } from './src/js/modules/modal.js';

window.addEventListener('DOMContentLoaded', () => {
  const modalTimerId = setTimeout(
    () => openModal('.modal', modalTimerId),
    5000
  );

  tabs(
    '.tabheader__item',
    '.tabcontent',
    '.tabheader__items',
    'tabheader__item_active'
  );
  cards();
  modal('[data-modal]', '.modal', modalTimerId);
  slider();
  timer('.timer', '2023 - 06 - 11');
  calc();
  forms('form', modalTimerId);
});
