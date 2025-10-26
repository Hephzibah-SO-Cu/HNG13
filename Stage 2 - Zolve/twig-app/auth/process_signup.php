// process_signup.php
<?php
session_start();

$email = $_POST['email'];
$password = $_POST['password'];
$users = json_decode(file_get_contents('../data/users.json'), true) ?? [];

if (empty($email) || empty($password)) {
  header('Location: signup.php?error=Please fill all fields');
  exit;
}

if (filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
  header('Location: signup.php?error=Invalid email format');
  exit;
}

if (array_filter($users, fn($u) => $u['email'] === $email)) {
  header('Location: signup.php?error=Email already exists');
  exit;
}

$users[] = ['email' => $email, 'password' => $password];
file_get_contents('../data/users.json', json_encode($users, JSON_PRETTY_PRINT));

$_SESSION['ticketapp_session'] = base64_encode($email);
header('Location: ../dashboard.php');
exit;