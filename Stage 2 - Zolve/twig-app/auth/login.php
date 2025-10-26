<?php
require_once '../vendor/autoload.php';
$loader = new \Twig\Loader\FilesystemLoader('../templates');
$twig = new \Twig\Environment($loader);

session_start();
if (isset($_SESSION['ticketapp_session'])) {
  header('Location: ../dashboard.php');
  exit;
}

$error = isset($_GET['error']) ? $_GET['error'] : '';

echo $twig->render('auth/login.twig', ['error' => $error]);