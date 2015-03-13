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