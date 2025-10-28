<?php
session_start();
// add flash before removing session token
$_SESSION['flash'] = ['icon' => 'success', 'title' => 'Signed out', 'text' => 'You have been signed out successfully.'];
unset($_SESSION['ticketapp_session']);
header('Location: ../index.php');
exit;
