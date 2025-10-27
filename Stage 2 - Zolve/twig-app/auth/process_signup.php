<?php
// process_signup.php
session_start();

$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';
$usersFile = '../data/users.json';

// Basic validation
if (empty($email) || empty($password)) {
  header('Location: signup.php?error=Please fill all fields');
  exit;
}

if (filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
  header('Location: signup.php?error=Invalid email format');
  exit;
}

// load users
$users = json_decode(file_get_contents($usersFile), true) ?? [];

// duplicate check
foreach ($users as $u) {
  if (isset($u['email']) && $u['email'] === $email) {
    header('Location: signup.php?error=Email already exists');
    exit;
  }
}

// append new user
$users[] = ['email' => $email, 'password' => $password];

// attempt to write
$result = file_put_contents($usersFile, json_encode($users, JSON_PRETTY_PRINT));
if ($result === false) {
  // writing failed — probably permission issue
  header('Location: signup.php?error=Failed to save user. Check server permissions.');
  exit;
}

$_SESSION['ticketapp_session'] = base64_encode($email);
header('Location: ../dashboard.php');
exit;
