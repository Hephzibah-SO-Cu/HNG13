<?php
session_start();

$users = json_decode(file_get_contents('../data/users.json'), true) ?? [];
$user = array_filter($users, fn($u) => $u['email'] === $_POST['email'] && $u['password'] === $_POST['password']);

if ($user) {
  $_SESSION['ticketapp_session'] = base64_encode($_POST['email']);
  header('Location: ../dashboard.php');
} else {
  header('Location: login.php?error=Invalid email or password');
}
exit;