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

$file = 'data/tickets.json';
$tickets = json_decode(file_get_contents($file), true) ?? [];
$editingTicket = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $title = trim($_POST['title'] ?? '');
  $description = $_POST['description'] ?? '';
  $status = $_POST['status'] ?? '';
  $priority = $_POST['priority'] ?? '';
  $errors = [];

  if (!$title) $errors['title'] = "Title is required";
  if (!in_array($status, ['open', 'in_progress', 'closed'])) $errors['status'] = "Invalid status";
  if (strlen($description) > 500) $errors['description'] = "Description too long (max 500 chars)";

  if (empty($errors)) {
    if (isset($_POST['edit_id']) && $_POST['edit_id'] !== '') {
      // update existing ticket
      foreach ($tickets as &$t) {
        if ($t['id'] == $_POST['edit_id']) {
          $t['title'] = $title;
          $t['description'] = $description;
          $t['status'] = $status;
          $t['priority'] = $priority;
          break;
        }
      }
      // save and flash
      if (file_put_contents($file, json_encode($tickets, JSON_PRETTY_PRINT)) === false) {
        $_SESSION['flash'] = ['icon' => 'error', 'title' => 'Save failed', 'text' => 'Could not save updated ticket. Check file permissions.'];
      } else {
        $_SESSION['flash'] = ['icon' => 'success', 'title' => 'Ticket updated', 'text' => 'Ticket updated successfully.'];
      }
      header('Location: tickets.php');
      exit;
    } else {
      // create new ticket
      $new = [
        'id' => time(),
        'title' => $title,
        'description' => $description,
        'status' => $status,
        'priority' => $priority
      ];
      $tickets[] = $new;
      if (file_put_contents($file, json_encode($tickets, JSON_PRETTY_PRINT)) === false) {
        $_SESSION['flash'] = ['icon' => 'error', 'title' => 'Save failed', 'text' => 'Could not save new ticket. Check file permissions.'];
      } else {
        $_SESSION['flash'] = ['icon' => 'success', 'title' => 'Ticket created', 'text' => 'Ticket created successfully.'];
      }
      header('Location: tickets.php');
      exit;
    }
  } else {
    // validation errors -> flash and redirect back to editing (if edit_id present) or tickets page
    $errText = implode(", ", $errors);
    $_SESSION['flash'] = ['icon' => 'error', 'title' => 'Fix errors', 'text' => $errText];

    if (isset($_POST['edit_id']) && $_POST['edit_id'] !== '') {
      $editId = urlencode($_POST['edit_id']);
      header("Location: tickets.php?edit={$editId}");
    } else {
      header('Location: tickets.php');
    }
    exit;
  }
}

// handle edit pre-fill
if (isset($_GET['edit'])) {
  $editingTicket = array_values(array_filter($tickets, fn($t) => $t['id'] == $_GET['edit']))[0] ?? null;
}

// handle delete
if (isset($_GET['delete'])) {
  $tickets = array_values(array_filter($tickets, fn($t) => $t['id'] != $_GET['delete']));
  file_put_contents($file, json_encode($tickets, JSON_PRETTY_PRINT));
  // flash delete success and redirect to avoid resubmission
  $_SESSION['flash'] = ['icon' => 'success', 'title' => 'Deleted', 'text' => 'Ticket deleted successfully.'];
  header('Location: tickets.php');
  exit;
}

// grab flash (if any) and clear it for the next request
$flash = $_SESSION['flash'] ?? null;
if (isset($_SESSION['flash'])) unset($_SESSION['flash']);

echo $twig->render('tickets.twig', ['tickets' => $tickets, 'editingTicket' => $editingTicket, 'flash' => $flash]);
