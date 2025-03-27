let img;
let canvas;
let pane;

// Основные настройки
let config = {
  scale: 6.0,
  brightness: 1.0,
  contrast: 1.5,
  saturation: 1.0,
  ditherType: 'halftone'
};

function setup() {
  console.log("Setup начат");
  
  // Создаем простой канвас
  canvas = createCanvas(600, 600);
  const canvasContainer = document.getElementById('canvas-container');
  if (canvasContainer) {
    canvas.parent(canvasContainer);
    console.log("Canvas добавлен в контейнер");
  } else {
    console.error("Canvas контейнер не найден");
  }
  
  // Создаем тестовое изображение
  img = createImage(width, height);
  img.loadPixels();
  for (let i = 0; i < img.width; i++) {
    for (let j = 0; j < img.height; j++) {
      img.set(i, j, color(
        random(255), 
        random(255), 
        random(255)
      ));
    }
  }
  img.updatePixels();
  console.log("Тестовое изображение создано");
  
  // Настройка Tweakpane
  try {
    setupTweakpane();
    console.log("Tweakpane инициализирован");
  } catch (e) {
    console.error("Ошибка инициализации Tweakpane:", e);
  }
  
  // Скрыть сообщение о загрузке
  hideLoadingMessage();
  
  // Применяем дизеринг
  applyDither();
  console.log("Setup завершен");
}

function draw() {
  // Пустая функция draw, так как нам не нужна постоянная перерисовка
}

function setupTweakpane() {
  // Проверяем, доступен ли Tweakpane
  if (typeof Tweakpane === 'undefined') {
    console.error('Tweakpane не загружен!');
    return;
  }
  
  // Находим контейнер для панели управления
  const controlsContainer = document.getElementById('controls-container');
  if (!controlsContainer) {
    console.error('Контейнер для Tweakpane не найден!');
    return;
  }
  
  // Создаем экземпляр панели
  pane = new Tweakpane.Pane({
    container: controlsContainer
  });
  
  // Добавляем заголовок
  const mainFolder = pane.addFolder({
    title: 'DITHR Tool',
    expanded: true
  });
  
  // Кнопка загрузки изображения
  mainFolder.addButton({
    title: 'Загрузить изображение'
  }).on('click', () => {
    uploadMedia();
  });
  
  // Настройки дизеринга
  const ditherFolder = pane.addFolder({
    title: 'Дизеринг',
    expanded: true
  });
  
  ditherFolder.addInput(config, 'ditherType', {
    options: {
      'Halftone': 'halftone',
      'Ordered': 'ordered',
      'Floyd-Steinberg': 'floyd'
    }
  }).on('change', () => {
    applyDither();
  });
  
  ditherFolder.addInput(config, 'scale', {
    min: 1,
    max: 20,
    step: 0.1
  }).on('change', () => {
    applyDither();
  });
  
  // Настройки изображения
  const imageFolder = pane.addFolder({
    title: 'Изображение',
    expanded: true
  });
  
  imageFolder.addInput(config, 'brightness', {
    min: 0,
    max: 2,
    step: 0.05
  }).on('change', () => {
    applyDither();
  });
  
  imageFolder.addInput(config, 'contrast', {
    min: 0,
    max: 3,
    step: 0.05
  }).on('change', () => {
    applyDither();
  });
  
  imageFolder.addInput(config, 'saturation', {
    min: 0,
    max: 2,
    step: 0.05
  }).on('change', () => {
    applyDither();
  });
  
  // Экспорт
  const exportFolder = pane.addFolder({
    title: 'Экспорт',
    expanded: true
  });
  
  exportFolder.addButton({
    title: 'Сохранить как PNG'
  }).on('click', () => {
    saveCanvas('dithr_export', 'png');
  });
}

function applyDither() {
  console.log("Применяем дизеринг:", config.ditherType);
  
  if (!img) {
    console.error("Изображение не определено");
    return;
  }
  
  // Очищаем канвас
  background(255);
  
  // Применяем дизеринг в зависимости от выбранного метода
  switch (config.ditherType) {
    case 'halftone':
      applyHalftone();
      break;
    case 'ordered':
      applyOrdered();
      break;
    case 'floyd':
      applyFloydSteinberg();
      break;
    default:
      applyHalftone();
  }
}

function applyHalftone() {
  console.log("Применяем Halftone дизеринг");
  
  // Размер точки зависит от уровня масштабирования
  let dotSize = config.scale;
  let spacing = dotSize * 2;
  
  // Создаем CMYK галфтон эффект
  for (let y = 0; y < height; y += spacing) {
    for (let x = 0; x < width; x += spacing) {
      // Получаем цвет пикселя изображения
      let c = img.get(x, y);
      
      // Преобразуем RGB в CMYK (упрощенно)
      let r = red(c) / 255 * config.brightness;
      let g = green(c) / 255 * config.brightness;
      let b = blue(c) / 255 * config.brightness;
      
      r = (r - 0.5) * config.contrast + 0.5;
      g = (g - 0.5) * config.contrast + 0.5;
      b = (b - 0.5) * config.contrast + 0.5;
      
      r = constrain(r, 0, 1);
      g = constrain(g, 0, 1);
      b = constrain(b, 0, 1);
      
      let k = 1 - Math.max(r, g, b);
      let c_val = (1 - r - k) / (1 - k) || 0;
      let m_val = (1 - g - k) / (1 - k) || 0;
      let y_val = (1 - b - k) / (1 - k) || 0;
      
      // Рисуем CMYK круги
      noStroke();
      
      // Cyan
      fill(0, 255, 255, c_val * 255 * config.saturation);
      ellipse(x - dotSize/4, y - dotSize/4, dotSize * c_val, dotSize * c_val);
      
      // Magenta
      fill(255, 0, 255, m_val * 255 * config.saturation);
      ellipse(x + dotSize/4, y - dotSize/4, dotSize * m_val, dotSize * m_val);
      
      // Yellow
      fill(255, 255, 0, y_val * 255 * config.saturation);
      ellipse(x - dotSize/4, y + dotSize/4, dotSize * y_val, dotSize * y_val);
      
      // Black
      fill(0, 0, 0, k * 255);
      ellipse(x + dotSize/4, y + dotSize/4, dotSize * k, dotSize * k);
    }
  }
}

function applyOrdered() {
  console.log("Применяем Ordered дизеринг");
  
  // Матрица Байера 4x4
  let bayerMatrix = [
    [0, 8, 2, 10],
    [12, 4, 14, 6],
    [3, 11, 1, 9],
    [15, 7, 13, 5]
  ];
  
  let cellSize = config.scale * 2;
  
  for (let y = 0; y < height; y += cellSize) {
    for (let x = 0; x < width; x += cellSize) {
      let c = img.get(x, y);
      let r = red(c) * config.brightness;
      let g = green(c) * config.brightness;
      let b = blue(c) * config.brightness;
      
      r = (r - 128) * config.contrast + 128;
      g = (g - 128) * config.contrast + 128;
      b = (b - 128) * config.contrast + 128;
      
      r = constrain(r, 0, 255);
      g = constrain(g, 0, 255);
      b = constrain(b, 0, 255);
      
      for (let cy = 0; cy < 4; cy++) {
        for (let cx = 0; cx < 4; cx++) {
          let threshold = (bayerMatrix[cy][cx] / 16) * 255;
          
          let drawR = r > threshold ? 255 : 0;
          let drawG = g > threshold ? 255 : 0;
          let drawB = b > threshold ? 255 : 0;
          
          noStroke();
          fill(drawR, drawG, drawB);
          rect(x + cx * (cellSize/4), y + cy * (cellSize/4), cellSize/4, cellSize/4);
        }
      }
    }
  }
}

function applyFloydSteinberg() {
  console.log("Применяем Floyd-Steinberg дизеринг");
  
  // Упрощенная реализация
  let tempImg = createImage(width, height);
  tempImg.copy(img, 0, 0, img.width, img.height, 0, 0, width, height);
  tempImg.loadPixels();
  
  // Применяем яркость и контраст
  for (let i = 0; i < tempImg.pixels.length; i += 4) {
    for (let j = 0; j < 3; j++) {
      let value = tempImg.pixels[i + j];
      value = value * config.brightness;
      value = (value - 128) * config.contrast + 128;
      tempImg.pixels[i + j] = constrain(value, 0, 255);
    }
  }
  
  // Floyd-Steinberg
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let idx = (x + y * width) * 4;
      
      for (let c = 0; c < 3; c++) {
        let oldVal = tempImg.pixels[idx + c];
        let newVal = oldVal < 128 ? 0 : 255;
        tempImg.pixels[idx + c] = newVal;
        
        let err = oldVal - newVal;
        
        // Распространение ошибки
        if (x + 1 < width) {
          tempImg.pixels[idx + 4 + c] += err * 7/16;
        }
        
        if (y + 1 < height) {
          if (x > 0) {
            tempImg.pixels[idx + (width * 4) - 4 + c] += err * 3/16;
          }
          tempImg.pixels[idx + (width * 4) + c] += err * 5/16;
          if (x + 1 < width) {
            tempImg.pixels[idx + (width * 4) + 4 + c] += err * 1/16;
          }
        }
      }
    }
  }
  
  tempImg.updatePixels();
  image(tempImg, 0, 0);
}

function uploadMedia() {
  console.log("Вызвана функция загрузки изображения");
  
  // Создаем скрытый input для загрузки файла
  let fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.style.display = 'none';
  
  fileInput.onchange = function(e) {
    let file = e.target.files[0];
    if (file) {
      console.log("Файл выбран:", file.name);
      
      // Чтение файла и преобразование в изображение
      let reader = new FileReader();
      reader.onload = function(event) {
        console.log("Файл прочитан");
        loadImage(event.target.result, 
          function(loadedImg) {
            console.log("Изображение загружено");
            img = loadedImg;
            applyDither();
          },
          function(err) {
            console.error("Ошибка загрузки изображения:", err);
          }
        );
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Запускаем диалог выбора файла
  document.body.appendChild(fileInput);
  fileInput.click();
  document.body.removeChild(fileInput);
}

function hideLoadingMessage() {
  const loadingMessage = document.getElementById('loading-message');
  if (loadingMessage) {
    loadingMessage.style.display = 'none';
    console.log("Скрыто сообщение о загрузке");
  }
} 