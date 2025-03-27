# Dither Tool

Интерактивный инструмент для создания эффекта дизеринга на изображениях.

## Возможности

- Загрузка изображений
- Различные алгоритмы дизеринга:
  - Ordered (Bayer)
  - Floyd-Steinberg
  - Atkinson
  - Burkes
  - Sierra Lite
  - JJN (Jarvis, Judice, and Ninke)
  - Chessboard
  - Voronoi
  - Maze
  - Pixel Sorting
- Настройка параметров:
  - Размер точек
  - Цветной/черно-белый режим
  - Инверсия цветов
  - Яркость
  - Контраст
- Экспорт в PNG

## Как использовать

1. Откройте [Dither Tool](https://ваш-username.github.io/dither/tweakpane-dither.html)
2. Нажмите "Загрузить изображение" для выбора файла
3. Настройте параметры дизеринга в панели справа
4. Нажмите "Сохранить PNG" для сохранения результата

## Локальный запуск

1. Клонируйте репозиторий:
```bash
git clone https://github.com/ваш-username/dither.git
cd dither
```

2. Запустите локальный сервер:
```bash
python -m http.server 8000
```

3. Откройте браузер и перейдите по адресу:
```
http://localhost:8000/tweakpane-dither.html
```

## Лицензия

MIT 
