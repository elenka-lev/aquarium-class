const aquarium = document.querySelector('.aquarium');
const addButton = document.getElementById('add');
const feedButton = document.getElementById('feed');
const aqua = document.querySelector('.container');

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
    container.appendChild(this._element);
    fishes.push(this);
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
  }

  swim() {
    const parent = this._element.parentElement; // отримуємо батьківський елемент
    const maxX = parent.clientWidth - this._element.width; // визначаємо максимальні координати 
    const maxY = parent.clientHeight - this._element.height; // визначаємо максимальні координати

    const x = Math.random() * maxX; // генеруємо випадкові координати
    const y = Math.random() * maxY;

    //рух рибки в залежності від напрямку
    if (x < parseFloat(this._element.style.left || 0)) {
      this._element.style.transform = 'scaleX(-1)'; // повертає вліво
    } else {
      this._element.style.transform = 'scaleX(1)';  // повертає вправо
    }

    this.position = { x, y }; //використовуємо сеттер для встановлення позиції

    const duration = Math.random() * 3000 + 2000; // випадкова тривалість анімації
    setTimeout(() => this.swim(), duration); // викликаємо метод swim через випадковий проміжок часу
  }
}

addButton.addEventListener("click", () => {
  const fish = new Fish("/images/small-fish.svg", "Fish", 150, aqua);
  fish.swim(); // одразу запускаємо позицію рибки
});
// addButton.addEventListener('click', () => {
//   const fish = document.createElement('img');
//   fish.classList.add('fish');
//   fish.src = '/images/small-fish.svg';
//   fish.alt = 'Fish';
//   fish.width = 150;
//   aqua.appendChild(fish);
// });