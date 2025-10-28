<?php
require_once 'vendor/autoload.php';
$loader = new \Twig\Loader\FilesystemLoader('templates');
$twig = new \Twig\Environment($loader);

session_start();
// expose session to Twig if needed
$twig->addGlobal('session', $_SESSION ?? []);

if (isset($_SESSION['ticketapp_session'])) {
  header('Location: dashboard.php');
  exit;
}

// grab flash (pass to template, then remove from session)
$flash = $_SESSION['flash'] ?? null;
if (isset($_SESSION['flash'])) unset($_SESSION['flash']);

echo $twig->render('landing.twig', ['flash' => $flash]);
