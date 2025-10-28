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

// derive current user email from the base64 session token
$userEmail = isset($_SESSION['ticketapp_session']) ? base64_decode($_SESSION['ticketapp_session']) : null;

$file = 'data/tickets.json';
$allTickets = json_decode(file_get_contents($file), true) ?? [];
$editingTicket = null;

// only show tickets owned by this user (tickets without owner are hidden)
$tickets = array_values(array_filter($allTickets, fn($t) => isset($t['owner']) && $t['owner'] === $userEmail));

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
      // update existing ticket: ensure owner match
      $editId = $_POST['edit_id'];
      $updated = false;
      foreach ($allTickets as &$t) {
        if ($t['id'] == $editId) {
          if (!isset($t['owner']) || $t['owner'] !== $userEmail) {
            $_SESSION['flash'] = ['icon' => 'error', 'title' => 'Unauthorized', 'text' => 'You cannot edit this ticket.'];
            header('Location: tickets.php');
            exit;
          }
          $t['title'] = $title;
          $t['description'] = $description;
          $t['status'] = $status;
          $t['priority'] = $priority;
          $updated = true;
          break;
        }
      }
      if ($updated) {
        if (file_put_contents($file, json_encode($allTickets, JSON_PRETTY_PRINT)) === false) {
          $_SESSION['flash'] = ['icon' => 'error', 'title' => 'Save failed', 'text' => 'Could not save updated ticket. Check file permissions.'];
        } else {
          $_SESSION['flash'] = ['icon' => 'success', 'title' => 'Ticket updated', 'text' => 'Ticket updated successfully.'];
        }
      } else {
        $_SESSION['flash'] = ['icon' => 'error', 'title' => 'Not found', 'text' => 'Ticket not found.'];
      }
      header('Location: tickets.php');
      exit;
    } else {
      // create new ticket with owner
      $new = [
        'id' => time(),
        'title' => $title,
        'description' => $description,
        'status' => $status,
        'priority' => $priority,
        'owner' => $userEmail
      ];
      $allTickets[] = $new;
      if (file_put_contents($file, json_encode($allTickets, JSON_PRETTY_PRINT)) === false) {
        $_SESSION['flash'] = ['icon' => 'error', 'title' => 'Save failed', 'text' => 'Could not save new ticket. Check file permissions.'];
      } else {
        $_SESSION['flash'] = ['icon' => 'success', 'title' => 'Ticket created', 'text' => 'Ticket created successfully.'];
      }
      header('Location: tickets.php');
      exit;
    }
  } else {
    // validation errors -> show flash
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

// handle edit pre-fill: ensure ticket belongs to user
if (isset($_GET['edit'])) {
  $candidate = array_values(array_filter($allTickets, fn($t) => $t['id'] == $_GET['edit']))[0] ?? null;
  if ($candidate && isset($candidate['owner']) && $candidate['owner'] === $userEmail) {
    $editingTicket = $candidate;
  } else {
    // not allowed to edit others' tickets
    $_SESSION['flash'] = ['icon' => 'error', 'title' => 'Unauthorized', 'text' => 'Cannot edit that ticket.'];
    header('Location: tickets.php');
    exit;
  }
}

// handle delete: ensure owner match
if (isset($_GET['delete'])) {
  $delId = $_GET['delete'];
  $found = array_values(array_filter($allTickets, fn($t) => $t['id'] == $delId))[0] ?? null;
  if ($found && isset($found['owner']) && $found['owner'] === $userEmail) {
    $allTickets = array_values(array_filter($allTickets, fn($t) => $t['id'] != $delId));
    file_put_contents($file, json_encode($allTickets, JSON_PRETTY_PRINT));
    $_SESSION['flash'] = ['icon' => 'success', 'title' => 'Deleted', 'text' => 'Ticket deleted successfully.'];
    header('Location: tickets.php');
    exit;
  } else {
    $_SESSION['flash'] = ['icon' => 'error', 'title' => 'Unauthorized', 'text' => 'Cannot delete that ticket.'];
    header('Location: tickets.php');
    exit;
  }
}

// recompute visible tickets for rendering (fresh after edits)
$tickets = array_values(array_filter($allTickets, fn($t) => isset($t['owner']) && $t['owner'] === $userEmail));

// grab flash (if any) and clear
$flash = $_SESSION['flash'] ?? null;
if (isset($_SESSION['flash'])) unset($_SESSION['flash']);

echo $twig->render('tickets.twig', ['tickets' => $tickets, 'editingTicket' => $editingTicket, 'flash' => $flash]);
