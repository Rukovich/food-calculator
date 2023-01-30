import { closeModal, openModal } from "./modal";
import { postData } from "../services/services";

export function forms(formSelector, modalTimerId) {
  //Forms server
  const forms = document.querySelectorAll(formSelector);

  const message = {
    loading: "src/img/form/spinner.svg", //Спиннер загрузки
    success: "Спасибо! Скоро мы с вами свяжемся",
    failure: "Что-то пошло не так...",
  };

  forms.forEach((item) => {
    bindPostData(item);
  });

  function bindPostData(form) {
    //submit срабатывает каждый раз, когда мы отправляем какую-то форму
    form.addEventListener("submit", (e) => {
      //Отменяем стандартное поведение браузера, по перезагрузке страницы
      e.preventDefault();

      let statusMessage = document.createElement("img");
      statusMessage.src = message.loading;
      statusMessage.style.cssText = `
          display: block;
          margin: 0 auto;
        `;
      //Добавляем спиннер на страницу
      form.insertAdjacentElement("afterend", statusMessage);

      // request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
      const formData = new FormData(form);

      //На основании данных value формирует объект при помощи перебора
      //Форматируем json данные в массив и обратно в объект
      const json = JSON.stringify(Object.fromEntries(formData.entries()));

      //Отправка данных на сервер
      postData("http://localhost:3000/requests", json)
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
    const prevModalDialog = document.querySelector(".modal__dialog");

    //Скрываем модального окна
    prevModalDialog.classList.add("hide");

    //Открываем структуру модального окна
    openModal(".modal", modalTimerId);

    //Формируем новую структуру
    const thanksModal = document.createElement("div");
    thanksModal.classList.add("modal__dialog");
    thanksModal.innerHTML = `
      <div class="modal__content">
          <div class="modal__close" data-close>×</div>
          <div class="modal__title">${message}</div>
      </div>
      `;

    //Получаем модальное окно
    document.querySelector(".modal").append(thanksModal);

    //Удаляем оповещение окно после использования
    setTimeout(() => {
      thanksModal.remove();

      //Открываем модальное окно
      prevModalDialog.classList.add("show");
      prevModalDialog.classList.remove("hide");
      closeModal(".modal");
    }, 3000);
  }

  fetch("http://localhost:3000/menu")
    .then((data) => data.json())
    .then((res) => console.log(res));
}
