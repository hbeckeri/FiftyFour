<!DOCTYPE html>
<html>
<body>

<?php
$servername = "localhost";
$username = "myUser";
$password = "";
$dbname = "FiftyFour";

$playerUsername = $_POST["username"];
$highScore = $_POST["highScore"];
$score = $_POST["score"];
$uuid = $_POST["uuid"];


// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}


//adds new user if not made yet
$stmt = $conn->prepare("SELECT * FROM `Scores` WHERE `uuid`= ?");
$stmt->bind_param("s", $uuid);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows == 0) {
	$stmt = $conn->prepare("INSERT INTO `FiftyFour`.`Scores` (`uuid`, `username`, `high`, `timeOfLastPlayed`) VALUES (?, ?, ?, CURRENT_TIMESTAMP)");
	$stmt->bind_param("ssi",$uuid, $playerUsername, $highScore);
	$stmt->execute();
} 

//checks if new dailyHigh score
$stmt = $conn->prepare("SELECT `dailyHigh` FROM `Scores` WHERE `uuid`=?");
$stmt->bind_param("s", $uuid);
$stmt->execute();
$stmt->store_result();
$stmt->bind_result($result);
$stmt->fetch();
if ($result < $score) {
	$stmt2 = $conn->prepare("UPDATE `Scores` SET `timeOfDailyHigh`=CURRENT_TIMESTAMP, `dailyHigh`=? WHERE `uuid`=?");
	$stmt2->bind_param("is", $score, $uuid);	
	$stmt2->execute();
	$stmt2->close();
}
$stmt->free_result();

//checks if new weeklyHigh
$stmt = $conn->prepare("SELECT `weeklyHigh` FROM `Scores` WHERE `uuid`=?");
$stmt->bind_param("s", $uuid);
$stmt->execute();
$stmt->store_result();
$stmt->bind_result($result);
$stmt->fetch();
if ($result < $score) {
	$stmt2 = $conn->prepare("UPDATE `Scores` SET `timeOfWeeklyHigh`=CURRENT_TIMESTAMP, `weeklyHigh`=? WHERE `uuid`=?");
	$stmt2->bind_param("is", $score, $uuid);	
	$stmt2->execute();
	$stmt2->close();
}
$stmt->free_result();

//checks if new monthlyHigh
$stmt = $conn->prepare("SELECT `monthlyHigh` FROM `Scores` WHERE `uuid`=?");
$stmt->bind_param("s", $uuid);
$stmt->execute();
$stmt->store_result();
$stmt->bind_result($result);
$stmt->fetch();
if ($result < $score) {
	$stmt2 = $conn->prepare("UPDATE `Scores` SET `timeOfMonthlyHigh`=CURRENT_TIMESTAMP, `MonthlyHigh`=? WHERE `uuid`=?");
	$stmt2->bind_param("is", $score, $uuid);	
	$stmt2->execute();
	$stmt2->close();
}
$stmt->free_result();

//remove scores if too old
$stmt = $conn->prepare("UPDATE `Scores` SET `timeOfDailyHigh`=0, `dailyHigh`=0 WHERE TIMESTAMPDIFF(DAY, `timeOfDailyHigh`, NOW()) > 1;");
$stmt->execute();

$stmt = $conn->prepare("UPDATE `Scores` SET `timeOfWeeklyHigh`=0, `weeklyHigh`=0 WHERE TIMESTAMPDIFF(WEEK, `timeOfWeeklyHigh`, NOW()) > 1;");
$stmt->execute();

$stmt = $conn->prepare("UPDATE `Scores` SET `timeOfMonthlyHigh`=0, `monthlyHigh`=0 WHERE TIMESTAMPDIFF(MONTH, `timeOfMonthlyHigh`, NOW()) > 1;");
$stmt->execute();

//updates high, username, totalPlayed, and lastPlayed
$stmt = $conn->prepare("UPDATE `Scores` SET `username` = ?, `high`= ?, `totalPlayed` = `totalPlayed` + 1, `timeOfLastPlayed` = CURRENT_TIMESTAMP WHERE  `uuid` = ?");
$stmt->bind_param("sis", $playerUsername, $highScore, $uuid);
$stmt->execute();

echo "New records created successfully";

$stmt->close();
$conn->close();
?> 

</body>
</html>