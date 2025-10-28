<?php
require_once '../vendor/autoload.php';
$loader = new \Twig\Loader\FilesystemLoader('../templates');
$twig = new \Twig\Environment($loader);

session_start();
// expose PHP session to Twig templates
$twig->addGlobal('session', $_SESSION ?? []);

if (isset($_SESSION['ticketapp_session'])) {
  header('Location: ../dashboard.php');
  exit;
}

// use flash instead of GET param
$flash = $_SESSION['flash'] ?? null;
if (isset($_SESSION['flash'])) unset($_SESSION['flash']);

echo $twig->render('auth/login.twig', ['error' => '', 'flash' => $flash]);
