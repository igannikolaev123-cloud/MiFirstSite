<?php require_once __DIR__ . '/includes/header.php'; ?>

<section class="content-card">
    <h2>Добро пожаловать!</h2>
    <p>Это главная страница моего первого PHP-сайта.</p>
    <p>Счётчик посещений работает через файл <code>data/visits.txt</code>.</p>

    <h3>Что я уже умею:</h3>
    <ul class="feature-list">
        <li>Выводить текст через <code>echo</code></li>
        <li>Подключать файлы через <code>require_once</code></li>
        <li>Сохранять данные в файле</li>
        <li>Работать с датой через <code>date()</code></li>
    </ul>

    <a class="button" href="about.php">Перейти на страницу «О нас»</a>
</section>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
