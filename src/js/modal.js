'use strict';
export function modal() {
  // Modal

  const modalTrigger = document.querySelectorAll('[data-modal]');
  const modal = document.querySelector('.modal');

  function openModal() {
    modal.classList.add('show');
    modal.classList.remove('hide');
    // Либо вариант с toggle - но тогда назначить класс в верстке
    document.body.style.overflow = 'hidden';
    clearInterval(modalTimerId);
  }

  modalTrigger.forEach((btn) => {
    btn.addEventListener('click', openModal);
  });

  function closeModal() {
    modal.classList.add('hide');
    modal.classList.remove('show');
    // Либо вариант с toggle - но тогда назначить класс в верстке
    document.body.style.overflow = '';
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.getAttribute('data-close') === '') {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.code === 'Escape' && modal.classList.contains('show')) {
      closeModal();
    }
  });

  // Модальное окно при прокрутке вниз страницы

  const modalTimerId = setTimeout(openModal, 50000);

  function showModalByScroll() {
    if (
      window.pageYOffset + document.documentElement.clientHeight >=
      document.documentElement.scrollHeight - 1
    ) {
      openModal();
      window.removeEventListener('scroll', showModalByScroll);
    }
  }

  window.addEventListener('scroll', showModalByScroll);

  //Forms server
  const forms = document.querySelectorAll('form');

  const message = {
    loading: 'img/form/spinner.svg', //Спиннер загрузки
    success: 'Спасибо! Скоро мы с вами свяжемся',
    failure: 'Что-то пошло не так...',
  };

  forms.forEach((item) => {
    bindPostData(item);
  });

  //Общение с сервером
  /*
    async - говорит, что внутри функции будет какой-то асинхронный код
    awayt - ставим перед теми операциями, корторые необходимо дождаться
  */
  const postData = async (url, data) => {
    const res = await fetch(url, {
      headers: {
        'Content-type': 'application/json',
      },
      method: 'POST',
      body: data,
    });

    return await res.json(); //Обрабатываем как JSON формат
  };

  function bindPostData(form) {
    //submit срабатывает каждый раз, когда мы отправляем какую-то форму
    form.addEventListener('submit', (e) => {
      //Отменяем стандартное поведение браузера, по перезагрузке страницы
      e.preventDefault();

      let statusMessage = document.createElement('img');
      statusMessage.src = message.loading;
      statusMessage.style.cssText = `
        display: block;
        margin: 0 auto;
      `;
      //Добавляем спиннер на страницу
      form.insertAdjacentElement('afterend', statusMessage);

      // request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
      const formData = new FormData(form);

      //На основании данных value формирует объект при помощи перебора
      //Форматируем json данные в массив и обратно в объект
      const json = JSON.stringify(Object.fromEntries(formData.entries()));

      //Отправка данных на сервер
      postData('http://localhost:3000/requests', json)
        .then((data) => {
          console.log(data);
          showThanksModal(message.success);
          form.reset(); //Сбрасываем форму
          statusMessage.remove(); //Удаляем спинер
        })
        .catch(() => {
          showThanksModal(message.failure); //Если что-то пошло не так
        })
        .finally(() => {
          form.reset();
        });
    });
  }

  //Уведомление модального окна
  function showThanksModal(message) {
    const prevModalDialog = document.querySelector('.modal__dialog');

    //Скрываем модального окна
    prevModalDialog.classList.add('hide');

    //Открываем структуру модального окна
    openModal();

    //Формируем новую структуру
    const thanksModal = document.createElement('div');
    thanksModal.classList.add('modal__dialog');
    thanksModal.innerHTML = `
    <div class="modal__content">
        <div class="modal__close" data-close>×</div>
        <div class="modal__title">${message}</div>
    </div>
    `;

    //Получаем модальное окно
    document.querySelector('.modal').append(thanksModal);

    //Удаляем оповещение окно после использования
    setTimeout(() => {
      thanksModal.remove();

      //Открываем модальное окно
      prevModalDialog.classList.add('show');
      prevModalDialog.classList.remove('hide');
      closeModal();
    }, 4000);
  }

  fetch('http://localhost:3000/menu')
    .then((data) => data.json())
    .then((res) => console.log(res));
}
// module.exports = modal;

// modal();
