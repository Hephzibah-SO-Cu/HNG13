<?php
session_start();

$users = json_decode(file_get_contents('../data/users.json'), true) ?? [];
$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';

$found = null;
foreach ($users as $u) {
  if (isset($u['email'], $u['password']) && $u['email'] === $email && $u['password'] === $password) {
    $found = $u;
    break;
  }
}

if ($found) {
  // Store a session token (you can replace with a better token if desired)
  $_SESSION['ticketapp_session'] = base64_encode($found['email']);
  header('Location: ../dashboard.php');
  exit;
} else {
  // redirect back to login page in auth folder with an error
  header('Location: login.php?error=Invalid email or password');
  exit;
}
