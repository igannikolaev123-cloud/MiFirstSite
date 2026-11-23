<?php require_once __DIR__ . '/includes/header.php'; ?>

<section class="content-card">
    <h2>О нас</h2>
    <p>Мы учимся делать сайты на PHP.</p>
    <p>Это вторая страница, но шапка и подвал у неё те же — они подключаются из общих файлов.</p>

    <h3>Преимущества такого подхода:</h3>
    <ol class="feature-list">
        <li>Шапка и подвал находятся в одном месте: меняешь один файл — обновляется весь сайт.</li>
        <li>Не нужно копировать одинаковый код на каждую страницу.</li>
        <li>Легко добавить новую страницу — достаточно подключить header и footer.</li>
    </ol>

    <a class="button button-secondary" href="index.php">Вернуться на главную</a>
</section>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
