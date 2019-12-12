<head>
    <title>Fossil Mashup</title>
</head>
<body style={background-color:#020202}>
	<?php 
    function anyset($values){
        $flag = false;
        foreach ($values as $val) {
            if(isset($val) and strlen($val) > 0) 
                $flag = true;
        }
        return $flag;
    }

    function areset($values, $names){
        $flag = true;
        foreach ($names as $id) {
            if(!isset($values[$id]) or strlen($values[$id]) <= 0) 
                $flag = false;
        }
        return $flag;
	}	

	$row[0] = array("OMASTAR", 3, "WATER", "SWIFT SWIM", "SHELL ARMOR", "WEAK ARMOR", 3, 2, 6, 5, 3, 1, 60);
	$row[1] = array("KABUTOPS", 4, "WATER", "SWIFT SWIM", "BATTLE ARMOR", "WEAK ARMOR", 1, 6, 5, 2, 3, 4, 115);
	$row[2] = array("AERODACTYL", 4, "FLYING", "ROCK HEAD", "PRESSURE", "UNNERVE", 4, 5, 1, 2, 3, 6, 105);
	$row[3] = array("CRADILY", 3, "GRASS", "SUCTION CUPS", NULL, "STORM DRAIN", 4, 2, 5, 2, 6, 1, 81);
	$row[4] = array("ARMALDO", 4, "BUG", "BATTLE ARMOR", NULL, "SWIFT SWIM", 3, 6, 5, 2, 4, 1, 125);
	$row[5] = array("RAMPARDOS", 5, "ROCK", "MOLD BREAKER", NULL, "SHEER FORCE", 5, 6, 3, 4, 1, 2, 165);
	$row[6] = array("BASTIODON", 6, "STEEL", "STURDY", NULL, "SOUNDPROOF", 4, 3, 6, 2, 5, 1, 52);
	$row[7] = array("CARRACOSTA", 5, "WATER", "SOLID ROCK", "STURDY", "SWIFT SWIM", 3, 6, 5, 4, 2, 1, 108);
	$row[8] = array("ARCHEOPS", 5, "FLYING", "DEFEATIST", NULL, "DEFEATIST", 3, 6, 1, 5, 1, 4, 140);
	$row[9] = array("TYRANTRUM", 4, "DRAGON", "STRONG JAW", NULL, "ROCK HEAD", 4, 6, 5, 2, 1, 3, 121);
	$row[10] = array("AURORUS", 4, "ICE", "REFRIGERATE", NULL, "SNOW WARNING", 6, 3, 2, 5, 4, 1, 77);
	?>

	<font face=Arial>
	<p><h2>Select the Fusees</h2></p>
    <form action="fossil_mashup.php" method="GET">
	<table>
		<tr>
			<td>Fusees:</td>
			<td><select name="fusee1">
			<option value=NULL> -- Head -- </option>
			<?php 
				foreach($row as $f){ echo "<option value='$f[0]'>$f[0]</option>"; }
			?></select>
			</td><td><select name="fusee2">
			<option value=NULL> -- Tail -- </option>
			<?php 
				foreach($row as $f){ echo "<option value='$f[0]'>$f[0]</option>"; }
			?></select></td>
		</tr>
		<tr>
			<td><select name="x">
			<option value=5> Stat Coefficient of 5</option>
			<option value=10> Stat Coefficient of 10 </option></td>
			<td><input type="submit" value="Generate" /></td>
			<td><input type="reset" value="Cancel" /></td>
		</tr>
	</table>
	</form>

	<?php 
	$head = array(0);
	$tail = array(0);
	if(anyset($_REQUEST)){
		if(isset($_REQUEST["Randomize"])){
			$h = rand(0, count($row) - 1);
			$t = rand(0, count($row) - 1);
			if($h == $t) $h = ($h + 1) % count($row);
			if($row[$h] != false) $head = $row[$h];
			if($row[$t] != false) $head = $row[$t];
		} else if(areset($_REQUEST, array('fusee1', 'fusee2', 'x'))) {
			foreach($row as $f){
				if($f[0] == $_REQUEST['fusee1']) $head = $f;
				if($f[0] == $_REQUEST['fusee2']) $tail = $f;
			}
		}
		$name = substr($tail[0], 0, $tail[1]) . substr($head[0], $head[1]); ?> 
		<table border=2><tr>
			<td><table border=1><tr><td width=60>
			<p>Name:</p>
			<p>Head:</p>
			<p>Tail:</p>
			<p>Type:</p>
			<p>Ability1:</p>
			<p>Ability2:</p>
			<p>HAbility:</p>
			</td><td width=100>
			<p><?php echo ucfirst(strtolower($name)) ?></p>
			<p><?php echo ucfirst(strtolower($head[0])) ?></p>
			<p><?php echo ucfirst(strtolower($tail[0])) ?></p>
			<p><?php 
				echo '<input type="image" src="https://play.pokemonshowdown.com/sprites/types/' . ucfirst(strtolower($head[2])) . '.png">';
				if(strcmp($head[2], $tail[2]) != 0) {
					echo '<input type="image" src="https://play.pokemonshowdown.com/sprites/types/' . ucfirst(strtolower($tail[2])) . '.png">';
				}
				$primary = $head[3];
				$hidden = ($tail[5] != $primary) ? ($tail[5]) : ($tail[3]);
				$secondary = ($head[3] == $head[5]) ? ('---') : (($tail[3] != $primary && $tail[3] != $hidden) ? ($tail[3]) : (($head[4] != NULL && $head[4] != $primary && $head[4] != $hidden) ? ($head[4]) : ('---')) );
			?>
			<p><?php echo $primary; ?></p>
			<p><?php echo $secondary; ?></p>
			<p><?php echo $hidden; ?></p>
			</td><td><?php 
				echo '<input type="image" src="https://play.pokemonshowdown.com/sprites/dex/' . strtolower($head[0]) . '.png">';
			?></td></tr><tr>
			<td><table border=1>
			<tr><td width=60>HP</td></tr>
			<tr><td width=60>ATK</td></tr>
			<tr><td width=60>DEF</td></tr>
			<tr><td width=60>SPA</td></tr>
			<tr><td width=60>SPD</td></tr>
			<tr><td width=60>SPE</td></tr>
			<tr><td width=60>BST</td></tr>
			</table></td>
			<td><table border=1>
			<?php
				$bst = 0; 
				$most = array(-1, 255);
				$x = $_REQUEST['x'];
				$y = (510 - 42 * $x) / 6;
				for($i = 0; $i < 6; $i++){
					$val[$i] = (($head[6 + $i] + $tail[6 + $i]) * $x + $y);
					$bst += $val[$i];
					if($val[$i] < $most[1]){
						$most[0] = $i; 
						$most[1] = $val[$i];
					}
				}
				if($bst == 510){
					$val[$most[0]] -= 5;
					$bst -= 5;
				} elseif($bst == 500){
					$val[$most[0]] += 5;
					$bst += 5;
				} 
				if($head[12] > $tail[12]){
					$tmp = $val[1];
					$val[1] = $val[2];
					$val[2] = $tmp;
					$tmp = $val[3];
					$val[3] = $val[4];
					$val[4] = $tmp;
				}
				foreach($val as $stat)
					echo '<tr><td width=120>' . $stat . '</td></tr>'; 
				echo '<tr><td width=110>' . $bst . '</td></tr>'; 
			?></table></td><td><?php 
				echo '<input type="image" src="https://play.pokemonshowdown.com/sprites/dex/' . strtolower($tail[0]) . '.png">';
			?></td>
			</tr></table></td>
		</tr></table>
	<?php } ?></font></p>
</body>