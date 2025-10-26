<?php
require_once 'vendor/autoload.php';
$loader = new \Twig\Loader\FilesystemLoader('templates');
$twig = new \Twig\Environment($loader);

session_start();
if (!isset($_SESSION['ticketapp_session'])) {
  header('Location: auth/login.php');
  exit;
}

$file = 'data/tickets.json';
$tickets = json_decode(file_get_contents($file), true) ?? [];
$editingTicket = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $title = trim($_POST['title']);
  $description = $_POST['description'];
  $status = $_POST['status'];
  $priority = $_POST['priority'];
  $errors = [];

  if (!$title) $errors['title'] = "Title is required";
  if (!in_array($status, ['open', 'in_progress', 'closed'])) $errors['status'] = "Invalid status";
  if (strlen($description) > 500) $errors['description'] = "Description too long (max 500 chars)";

  if (empty($errors)) {
    if (isset($_POST['edit_id'])) {
      foreach ($tickets as &$t) {
        if ($t['id'] == $_POST['edit_id']) {
          $t['title'] = $title;
          $t['description'] = $description;
          $t['status'] = $status;
          $t['priority'] = $priority;
          break;
        }
      }
      $msg = "Ticket updated!";
    } else {
      $tickets[] = [
        'id' => time(),
        'title' => $title,
        'description' => $description,
        'status' => $status,
        'priority' => $priority
      ];
      $msg = "Ticket created!";
    }
    file_put_contents($file, json_encode($tickets, JSON_PRETTY_PRINT));
    // For toasts, use JS alert for simplicity (or add SweetAlert if needed)
    echo "<script>alert('$msg');</script>";
  } else {
    echo "<script>alert('Please fix errors: " . implode(", ", $errors) . "');</script>";
  }
}

if (isset($_GET['edit'])) {
  $editingTicket = array_filter($tickets, fn($t) => $t['id'] == $_GET['edit'])[0] ?? null;
}

if (isset($_GET['delete'])) {
  $tickets = array_filter($tickets, fn($t) => $t['id'] != $_GET['delete']);
  file_put_contents($file, json_encode($tickets, JSON_PRETTY_PRINT));
  header('Location: tickets.php');
  exit;
}

echo $twig->render('tickets.twig', ['tickets' => $tickets, 'editingTicket' => $editingTicket, 'capitalize' => fn($str) => ucwords(str_replace('_', ' ', $str))]);