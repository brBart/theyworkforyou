<?php

include_once '../includes/easyparliament/init.php';

$view = new MySociety\TheyWorkForYou\Homepage;
$data = $view->display();

MySociety\TheyWorkForYou\Renderer::output('index', $data);
