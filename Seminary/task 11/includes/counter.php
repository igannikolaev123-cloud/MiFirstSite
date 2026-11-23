<?php
// Путь к файлу счётчика. __DIR__ указывает на папку includes.
$counterFile = __DIR__ . '/../data/visits.txt';

// Получаем путь к папке data.
$dataDir = dirname($counterFile);

// 1. Если папки data нет, создаём её.
if (!is_dir($dataDir)) {
    mkdir($dataDir, 0777, true);
}

// 2. Если файла счётчика нет, создаём его и записываем 0.
if (!file_exists($counterFile)) {
    file_put_contents($counterFile, '0');
}

// 3. Читаем текущее значение и преобразуем его в целое число.
$visits = (int) file_get_contents($counterFile);

// 4. Увеличиваем счётчик на один.
$visits++;

// 5. Сохраняем новое значение в файл.
file_put_contents($counterFile, (string) $visits, LOCK_EX);
