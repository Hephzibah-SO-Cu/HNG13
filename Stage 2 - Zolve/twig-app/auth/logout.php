<?php
session_start();
unset($_SESSION['ticketapp_session']);
header('Location: ../index.php');
exit;