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
  // set session token
  $_SESSION['ticketapp_session'] = base64_encode($found['email']);
  // set flash message for the next page render
  $_SESSION['flash'] = [
    'icon' => 'success',
    'title' => 'Logged in',
    'text' => 'Welcome back!'
  ];
  header('Location: ../dashboard.php');
  exit;
} else {
  $_SESSION['flash'] = [
    'icon' => 'error',
    'title' => 'Login failed',
    'text' => 'Invalid email or password.'
  ];
  // redirect back to login (relative path)
  header('Location: login.php');
  exit;
}
