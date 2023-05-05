(function () {
  // создаём и возвращаем заголовок приложения
  function createAppTitle(title) {
    let appTitle = document.createElement('h2');
    appTitle.textContent = title;
    return appTitle;
  }
  // создаём и возвращаем форму для создания дела
  function createTodoItemForm() {
    let form = document.createElement('form');
    let input = document.createElement('input');
    let buttonWrapper = document.createElement('div');
    let button = document.createElement('button');

    // добавляем классы
    form.classList.add('input-group', 'mb-3');
    input.classList.add('form-control');
    input.placeholder = 'Введите название нового дела';
    buttonWrapper.classList.add('input-group-append');
    button.classList.add('btn', 'btn-primary');
    button.textContent = 'Добавить дело';

    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    return {
      form,
      input,
      button,
    };

  }
  // создаём и возвращаем список элементов
  function createTodoList() {
    let list = document.createElement('ul');
    list.classList.add('list-group');
    return list;
  }
  // создаём массив, куда будем помещать объекты
  let arrayOfItems = [];
  // создаём заметку
  function createTodoItem(newItem) {
    let item = document.createElement('li');
    // кнопки помещаем в элемент, который красиво покажет их в одной группе
    let buttonGroup = document.createElement('div');
    let doneButton = document.createElement('button');
    let deleteButton = document.createElement('button');

    // устанавливаем стили для элемента списка, а также для размещения кнопок
    // в его правой части с помощью flex
    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success');
    doneButton.textContent = 'Готово';
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = 'Удалить';

    // Данная команда выводит текст в заметку name из объекта newItem
    item.textContent = newItem.name;

    // вкладываем кнопку в отдельный элемент, чтобы они объединились в один блок
    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    // приложению нужен доступ к самому элементу и кнопкам, чтобы обрабатывать события нажатия
    return {
      item,
      doneButton,
      deleteButton,
      newItem,
    };
  }

  // список на разных страницах
  function createTodoApp(container, title, listName) {
    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();

    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    // забираем данные из localStorage при загрузке страницы
    let getItemsFromLocalStorage = localStorage.getItem(listName);

    // если в локальном хранилище значение ключа не пустое и не null, то выводим массив с объектами
    if (getItemsFromLocalStorage !== '' && getItemsFromLocalStorage !== null) {
      arrayOfItems = JSON.parse(getItemsFromLocalStorage);
    }
    console.log(arrayOfItems);

    // перебираем массив с объектами и восстанавливаем их на фронте
    for (let msg of arrayOfItems) {
      console.log(msg);
      // создаём элементы списка
      let obtainedItemsFromArray = createTodoItem(msg);

      // если дело выполнено, при перезагрузке страницы, оно останется выделено зелёным цветом
      if (obtainedItemsFromArray.newItem.done === true) {
        obtainedItemsFromArray.item.classList.add('list-group-item-success');
      };

      // добавляем обработчики на кнопки
      obtainedItemsFromArray.doneButton.addEventListener('click', function () {
        // добавляем/удаляем класс элементу
        obtainedItemsFromArray.item.classList.toggle('list-group-item-success');
        // ищем объект в массиве объектов
        let findItemOnArrayForDone = arrayOfItems.find(item => item.id === obtainedItemsFromArray.newItem.id);

        // если у объекта значение свойства done = true, то меняет его на false и наоборот
        if (findItemOnArrayForDone.done === false) {
          findItemOnArrayForDone.done = true;
        } else {
          findItemOnArrayForDone.done = false;
        }

        // добавляю массив arrayOfItems в localStorage
        localStorage.setItem(listName, JSON.stringify(arrayOfItems));

        console.log(findItemOnArrayForDone);
      });

      obtainedItemsFromArray.deleteButton.addEventListener('click', function () {
        if (confirm('Вы уверены?')) {
          // если пользователь нажимает "ок" в модалке, то удаляется заметка с фронта
          obtainedItemsFromArray.item.remove();

          // находим нужный объект в массиве arrayOfItems
          let findItemOnArrayForDelete = arrayOfItems.find(item => item.id === obtainedItemsFromArray.newItem.id);
          console.log(findItemOnArrayForDelete);

          // находим у найденного объекта его индекс в массиве (индекс нужен для метода splice)
          let indexFindItemOnArrayForDelete = arrayOfItems.findIndex(index => index === findItemOnArrayForDelete);
          console.log(indexFindItemOnArrayForDelete);

          // удаляем объект из массива
          let deleteObjectFromArray = arrayOfItems.splice(indexFindItemOnArrayForDelete, 1);

          // добавляю массив arrayOfItems в localStorage
          localStorage.setItem(listName, JSON.stringify(arrayOfItems));

          console.log(arrayOfItems);
        }

      });

      // добавляем созданный элемент списка в сам список
      todoList.append(obtainedItemsFromArray.item);
    };

    // лочим кнопку создания дела по дефолту
    todoItemForm.button.disabled = true;

    // кнопка неактивна, если в инпуте пусто. Если же начать писать в инпуте, то кнопка становится активной
    todoItemForm.input.addEventListener('input', function () {
      if (todoItemForm.input.value) {
        todoItemForm.button.disabled = false;
      } else {
        todoItemForm.button.disabled = true;
      }
    });

    // Браузер создаёт событие submit на форме по нажатию на Enter или на кнопку создания дела
    todoItemForm.form.addEventListener('submit', function (e) {
      // эта строчка необходима, чтобы предотвратить стандартные действия браузера
      // в данном случае мы не хотим, чтобы страница перезагружалась при отправке формы
      e.preventDefault();

      // игнорируем создание элемента, если пользователь ничего не ввёл в поле
      if (!todoItemForm.input.value) {
        return;
      }

      // функция, которая генерирует рандомное значение между n и m включительно
      function generateId(n, m) {
        let randomId = Math.floor(Math.random() * (Math.max(n, m) - Math.min(n, m) + 1)) + Math.min(n, m);
        return randomId;
      };

      let randomIdTake = generateId(1, 10000);

      // вызываю функцию создания заметки с заданными параметрами
      let todoItem = createTodoItem({ id: randomIdTake, name: todoItemForm.input.value, done: false });

      // добавляем обработчики на кнопки
      todoItem.doneButton.addEventListener('click', function () {
        // добавляем/удаляем класс элементу
        todoItem.item.classList.toggle('list-group-item-success');
        // ищем объект в массиве объектов
        let findItemOnArrayForDone = arrayOfItems.find(item => item.id === todoItem.newItem.id);

        // если у объекта значение свойства done = true, то меняет его на false и наоборот
        if (findItemOnArrayForDone.done === false) {
          findItemOnArrayForDone.done = true;
        } else {
          findItemOnArrayForDone.done = false;
        }

        localStorage.setItem(listName, JSON.stringify(arrayOfItems));

        console.log(findItemOnArrayForDone);
      });

      todoItem.deleteButton.addEventListener('click', function () {
        if (confirm('Вы уверены?')) {
          // если пользователь нажимает "ок" в модалке, то удаляется заметка с фронта
          todoItem.item.remove();

          // находим нужный объект в массиве arrayOfItems
          let findItemOnArrayForDelete = arrayOfItems.find(item => item.id === todoItem.newItem.id);
          console.log(findItemOnArrayForDelete);

          // находим у найденного объекта его индекс в массиве (индекс нужен для метода splice)
          let indexFindItemOnArrayForDelete = arrayOfItems.findIndex(index => index === findItemOnArrayForDelete);
          console.log(indexFindItemOnArrayForDelete);

          // удаляем объект из массива
          let deleteObjectFromArray = arrayOfItems.splice(indexFindItemOnArrayForDelete, 1);

          // добавляю массив arrayOfItems в localStorage
          localStorage.setItem(listName, JSON.stringify(arrayOfItems));

          console.log(arrayOfItems);
        }

      });

      // создаём и добавляем в список новое дело с названием из поля для ввода
      todoList.append(todoItem.item);

      // добавляем в массив наш объект
      arrayOfItems.push(todoItem.newItem);

      // добавляю массив arrayOfItems в localStorage
      localStorage.setItem(listName, JSON.stringify(arrayOfItems));

      // обнуляем значение в поле, чтобы не пришлось стирать его вручную
      todoItemForm.input.value = '';

      // деактивируем кнопку "Добавить дело" после создания заметки
      todoItemForm.button.disabled = true;

      console.log(arrayOfItems);
    });

  }

  window.createTodoApp = createTodoApp;
})();
