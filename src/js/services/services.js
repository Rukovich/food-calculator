//Общение с сервером
/*
  async - говорит, что внутри функции будет какой-то асинхронный код
  awayt - ставим перед теми операциями, корторые необходимо дождаться
*/
const postData = async (url, data) => {
  const res = await fetch(url, {
    headers: {
      "Content-type": "application/json",
    },
    method: "POST",
    body: data,
  });

  return await res.json(); //Обрабатываем как JSON формат
};

//Делаем запросы к карточкам
const getResource = async (url) => {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Could not fetch ${url}, status ${res.status}`); //Создаем объект ошибки
  }

  //Обрабатываем как JSON формат
  return await res.json();
};

export { postData };
export { getResource };
