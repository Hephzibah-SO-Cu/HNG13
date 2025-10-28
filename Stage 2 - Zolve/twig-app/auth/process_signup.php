<?php
// process_signup.php
session_start();

$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';
$usersFile = '../data/users.json';

// Basic validation
if (empty($email) || empty($password)) {
  $_SESSION['flash'] = ['icon'=>'error','title'=>'Sign up failed','text'=>'Please fill all fields.'];
  header('Location: signup.php');
  exit;
}

if (filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
  $_SESSION['flash'] = ['icon'=>'error','title'=>'Sign up failed','text'=>'Invalid email format.'];
  header('Location: signup.php');
  exit;
}

// load users
$users = json_decode(file_get_contents($usersFile), true) ?? [];

// duplicate check
foreach ($users as $u) {
  if (isset($u['email']) && $u['email'] === $email) {
    $_SESSION['flash'] = ['icon'=>'error','title'=>'Sign up failed','text'=>'Email already exists.'];
    header('Location: signup.php');
    exit;
  }
}

// append new user
$users[] = ['email' => $email, 'password' => $password];

// attempt to write
$result = file_put_contents($usersFile, json_encode($users, JSON_PRETTY_PRINT));
if ($result === false) {
  $_SESSION['flash'] = ['icon'=>'error','title'=>'Sign up failed','text'=>'Failed to save user. Check server permissions.'];
  header('Location: signup.php');
  exit;
}

// success
$_SESSION['ticketapp_session'] = base64_encode($email);
$_SESSION['flash'] = ['icon'=>'success','title'=>'Account created','text'=>'Welcome — you are logged in.'];
header('Location: ../dashboard.php');
exit;
