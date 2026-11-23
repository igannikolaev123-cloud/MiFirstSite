<?php
// Указываем часовой пояс, чтобы дата и время на сайте отображались правильно.
date_default_timezone_set('Europe/Moscow');

// Подключаем счётчик. При каждом открытии страницы он увеличивается на 1.
require_once __DIR__ . '/counter.php';
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Мой PHP-сайт</title>
    <link rel="stylesheet" href="assets/style.css">
</head>
<body>
    <div class="site-wrapper">
        <header class="site-header">
            <div class="header-top">
                <div class="php-logo">PHP</div>
                <div>
                    <h1>Мой первый PHP-сайт</h1>
                    <p class="header-subtitle">Знакомство с PHP и файловой системой</p>
                </div>
            </div>

            <nav class="site-nav">
                <a href="index.php">Главная</a>
                <a href="about.php">О нас</a>
            </nav>

            <p class="counter">
                <span class="counter-icon">●</span>
                Страница открыта <strong><?php echo $visits; ?></strong>
                <?php
                // Склоняем слово «раз» в соответствии с числом.
                $lastDigit = $visits % 10;
                $lastTwoDigits = $visits % 100;

                if ($lastTwoDigits >= 11 && $lastTwoDigits <= 14) {
                    echo 'раз';
                } elseif ($lastDigit === 1) {
                    echo 'раз';
                } elseif ($lastDigit >= 2 && $lastDigit <= 4) {
                    echo 'раза';
                } else {
                    echo 'раз';
                }
                ?>
            </p>
        </header>

        <main class="main-content">
