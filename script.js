const aquarium = document.querySelector('.aquarium');
const addButton = document.getElementById('add');
const feedButton = document.getElementById('feed');
const aqua = document.querySelector('.container');
const fish = document.querySelector('.fish');

let fishCount = 0;
const fishes = [];

class Fish {
  constructor(src, alt, width, container) {
    this._element = document.createElement("img");
    this._id = ++fishCount;
    this._element.classList.add("fish");
    this._element.src = src;
    this._element.alt = alt;
    this._element.width = width;
    this._hungry = false;
    this._message = null;

    container.appendChild(this._element);
    fishes.push(this);

    this.swim();
    this.startHungerTimer();
  }

  // отримуємо(читаємо) ID для зовнішнбого вікористання
  get id() {
    return this._id;
  }

  //отримуємо (читаємо) сам елемент
  get element() {
    return this._element;
  }

  //дозволяє встановлювати значення появи елемента
  set position({ x, y }) {
    this._element.style.left = `${x}px`;
    this._element.style.top = `${y}px`;

    if (this._message) {
      const rect = this._element.getBoundingClientRect(); // отримуємо координати елемента
      this._message.style.left = `${
        x + this._element.width / 2 - this._message.offsetWidth / 2
      }px`;
      this._message.style.top = `${y - this._message.offsetHeight - 5}px`;
    }
  }

  //показує голод
  get hungry() {
    return this._hungry;
  }

  //повідомлення про голод
  set hungry(value) {
    this._hungry = value;

    if (value) {
      this.showHungryMessage();
    }
  }

  swim() {
    if (!this._element.parentElement) return; // перевіряємо чи є батьківський елемент

    const parent = this._element.parentElement; // отримуємо батьківський елемент
    const maxX = parent.clientWidth - this._element.width; // визначаємо максимальні координати
    const maxY = parent.clientHeight - this._element.height; // визначаємо максимальні координати

    const x = Math.random() * maxX; // генеруємо випадкові координати
    const y = Math.random() * maxY;

    //чи є рибка в акваріумі
    if (x < parseFloat(this._element.style.left || 0)) {
      this._element.style.transform = "scaleX(-1)";
    } else {
      this._element.style.transform = "scaleX(1)";
    }

    //рух рибки в залежності від напрямку
    if (x < parseFloat(this._element.style.left || 0)) {
      this._element.style.transform = "scaleX(-1)"; // повертає вліво
    } else {
      this._element.style.transform = "scaleX(1)"; // повертає вправо
    }

    this.position = { x, y }; //використовуємо сеттер для встановлення позиції

    const duration = Math.random() * 3000 + 2000; // випадкова тривалість анімації
    setTimeout(() => this.swim(), duration); // викликаємо метод swim через випадковий проміжок часу
  }

  //робимо метод для повідомлення про голод
  showHungryMessage() {
    if (this._message) return; // якщо повідомлення вже є, не створюємо нове

    const message = document.createElement("div");
    message.classList.add("fish-message");
    message.textContent = "I want to eat!";
    message.style.position = "absolute";

    this._element.parentElement.appendChild(message); // додаємо повідомлення в контейнер
    this._message = message;

    const updatePosition = () => {
      if (!this._message) return; // якщо повідомлення було видалено, припиняємо оновлення
      const rect = this._element.getBoundingClientRect();
      const parentRect = this._element.parentElement.getBoundingClientRect();

      // розраховуємо позицію повідомлення над рибкою
      this._message.style.left = `${
        rect.left -
        parentRect.left +
        this._element.width / 2 -
        message.offsetWidth / 2
      }px`;
      this._message.style.top = `${
        rect.top - parentRect.top - message.offsetHeight - 5
      }px`;
      requestAnimationFrame(updatePosition); //викликаємо оновлення на наступному кадрі
    };
    updatePosition();

    //запускаємо таймер смерті рибки
    this._deathTimer = setTimeout(() => {
      this._element.remove();
      if (this._message) this._message.remove();
      this._message = null;

      //видаляємо рибку з масиву
      const index = fishes.findIndex((f) => f._id === this._id);
      if (index !== -1) fishes.splice(index, 1);
    }, 30000); // 30 секунд до смерті

    setTimeout(() => {
      message.style.left = `${
        this._element.offsetLeft +
        this._element.width / 2 -
        message.offsetWidth / 2
      }px`;
      message.style.top = `${
        this._element.offsetTop - message.offsetHeight - 5
      }px`;
    }, 0);
  }

  // запускаємо таймер голоду
  startHungerTimer() {
    setTimeout(() => {
      this.hungry = true; // робимо рибку голодною
    }, 5000); 
  }

  //метод годування рибки
  feed() {
    if (this.hungry) {
      this.hungry = false; // знімаємо голод
      if (this._message) {
        this._message.remove(); // видаляємо повідомлення
        this._message = null;
      }
      if (this._deathTimer) {
        clearTimeout(this._deathTimer);
        this._deathTimer = null;
      }
      this.startHungerTimer(); // перезапускаємо таймер голоду
    }
  }
}



addButton.addEventListener("click", () => {
  const fish = new Fish("./images/small-fish.svg", "Fish", 150, aqua);
  fish.swim(); // одразу запускаємо позицію рибки
  fish.startHungerTimer(); // запускаємо таймер голоду
});

aqua.addEventListener("click", (event) => {
  const clickedFish = event.target.closest(".fish");
  if (!clickedFish) return;
  const hungryFish = fishes.find((f) => f.element === clickedFish);
  if (hungryFish) hungryFish.feed(); // годуємо рибку
});

feedButton.addEventListener("click", () => {
  fishes.forEach((fish) => fish.feed()); // годуємо всіх рибок
});