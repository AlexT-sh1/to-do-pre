let items = [
  "Сделать проектную работу",
  "Полить цветы",
  "Пройти туториал по Реакту",
  "Сделать фронт для своего проекта",
  "Прогуляться по улице в солнечный день",
  "Помыть посуду",
];

const listElement = document.querySelector(".to-do__list");
const formElement = document.querySelector(".to-do__form");
const inputElement = document.querySelector(".to-do__input");

/*
 Загружает задачи из локального хранилища браузера.
 Если в localStorage есть сохраненные задачи, возвращает их.
 В противном случае возвращает стандартный массив items.
 @returns {Array} Массив строк с задачами
 */
function loadTasks() {
  const saved = localStorage.getItem('tasks');
  return saved ? JSON.parse(saved) : items;
}

/*
 Создает DOM-элемент задачи на основе шаблона.
 Добавляет обработчики событий для кнопок удаления, дублирования и редактирования.
 @param {string} item - Текст задачи
 @returns {HTMLElement} Готовый DOM-элемент задачи
 */
function createItem(item) {
  // Находим шаблон в HTML
  const template = document.getElementById("to-do__item-template");
  // Клонируем содержимое шаблона
  const clone = template.content.querySelector(".to-do__item").cloneNode(true);
  const textElement = clone.querySelector(".to-do__item-text");
  const deleteButton = clone.querySelector(".to-do__item-button_type_delete");
  const duplicateButton = clone.querySelector(".to-do__item-button_type_duplicate");
  const editButton = clone.querySelector(".to-do__item-button_type_edit");
  
  // Устанавливаем текст задачи
  textElement.textContent = item;	
  
  // Обработчик для кнопки удаления
  deleteButton.addEventListener('click', function () {
    clone.remove();
    let items = getTasksFromDOM();
    saveTasks(items);
  });
  
  // Обработчик для кнопки дублирования
  duplicateButton.addEventListener('click', function() {
    const itemName = textElement.textContent;
    const newItem = createItem(itemName);
    listElement.prepend(newItem);
    let items = getTasksFromDOM();
    saveTasks(items);
  }); 
  
  // Обработчик для кнопки редактирования
  editButton.addEventListener('click', function () {
    textElement.setAttribute('contenteditable', 'true');
    textElement.focus();
  });
  
  // Обработчик для завершения редактирования (потеря фокуса)
  textElement.addEventListener('blur', function() {
    if (textElement.getAttribute('contenteditable') === 'true') {
      textElement.setAttribute('contenteditable', 'false')
      const items = getTasksFromDOM();
      saveTasks(items);
    }
  });

  return clone;
}

/*
Собирает все задачи со страницы в массив.
Проходит по всем элементам с классом .to-do__item-text и извлекает их текстовое содержимое.
@returns {Array} Массив строк с текстами задач
 */
function getTasksFromDOM() {
  let itemsNamesElements = document.querySelectorAll('.to-do__item-text');
  const tasks = [];
  itemsNamesElements.forEach( function (item) {
    tasks.push(item.textContent);
  });
  return tasks;
}

/*
Сохраняет задачи в локальное хранилище браузера.
@param {Array} tasks - Массив задач для сохранения
 */
function saveTasks(tasks) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Загружаем задачи при запуске
items = loadTasks();

// Создаем DOM-элементы для каждой задачи
items.forEach((item) => {
  const itemElement = createItem(item);
  listElement.append(itemElement);
});

// Обработчик отправки формы для добавления новой задачи
formElement.addEventListener('submit', function (evt) {
  evt.preventDefault(); // Предотвращаем стандартную отправку формы
  const outputText = inputElement.value.trim(); // Получаем текст из поля ввода
  if(outputText){ 
    const itemElements = createItem(outputText); // Создаем элемент задачи
    listElement.prepend(itemElements); // Добавляем в начало списка
    items = getTasksFromDOM(); // Обновляем массив задач
    saveTasks(items); // Сохраняем в localStorage
    inputElement.value = ''; // Очищаем поле ввода
  }
});
