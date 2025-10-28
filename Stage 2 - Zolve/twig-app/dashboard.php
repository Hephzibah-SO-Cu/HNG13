<?php
require_once 'vendor/autoload.php';
$loader = new \Twig\Loader\FilesystemLoader('templates');
$twig = new \Twig\Environment($loader);

session_start();
// expose session to Twig
$twig->addGlobal('session', $_SESSION ?? []);

if (!isset($_SESSION['ticketapp_session'])) {
  header('Location: auth/login.php');
  exit;
}

$flash = $_SESSION['flash'] ?? null;
if (isset($_SESSION['flash'])) unset($_SESSION['flash']);

$userEmail = isset($_SESSION['ticketapp_session']) ? base64_decode($_SESSION['ticketapp_session']) : null;

$all = json_decode(file_get_contents('data/tickets.json'), true) ?? [];
// filter to user's tickets only
$tickets = array_values(array_filter($all, fn($t) => isset($t['owner']) && $t['owner'] === $userEmail));

$stats = [
  'total' => count($tickets),
  'open' => count(array_filter($tickets, fn($t) => $t['status'] === 'open')),
  'in_progress' => count(array_filter($tickets, fn($t) => $t['status'] === 'in_progress')),
  'closed' => count(array_filter($tickets, fn($t) => $t['status'] === 'closed'))
];

echo $twig->render('dashboard.twig', ['stats' => $stats, 'flash' => $flash]);
