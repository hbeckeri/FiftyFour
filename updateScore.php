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
$gamesPlayed = $_POST["gamesPlayed"];
$averageScore = $_POST["averageScore"];

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
	$stmt = $conn->prepare("INSERT INTO `FiftyFour`.`Scores` (`uuid`, `username`, `high`, `timeOfLastPlayed`, `totalPlayed`, `AverageScore`) VALUES (?, ?, ?, CURRENT_TIMESTAMP, ?, ?)");
	$stmt->bind_param("ssiid",$uuid, $playerUsername, $highScore, $gamesPlayed, $averageScore);
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

//updates high, username, totalPlayed, lastPlayed and AverageScore
$stmt = $conn->prepare("UPDATE `Scores` SET `username` = ?, `high`= ?, `totalPlayed` = ?, `timeOfLastPlayed` = CURRENT_TIMESTAMP, `AverageScore` = ? WHERE  `uuid` = ?");
$stmt->bind_param("siids", $playerUsername, $highScore, $gamesPlayed, $averageScore, $uuid);
$stmt->execute();

echo "New records created successfully";

$stmt->close();
$conn->close();
?> 

</body>
</html>