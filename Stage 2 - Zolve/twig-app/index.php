<?php
require_once 'vendor/autoload.php';
$loader = new \Twig\Loader\FilesystemLoader('templates');
$twig = new \Twig\Environment($loader);

session_start();
// expose session to Twig
$twig->addGlobal('session', $_SESSION ?? []);

if (isset($_SESSION['ticketapp_session'])) {
  header('Location: dashboard.php');
  exit;
}

echo $twig->render('landing.twig');
