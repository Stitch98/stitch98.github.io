<head>
    <title>Fossil Mashup</title>
</head>
<body>
	<?php 
	function sql_con_query(&$con, $db, $sql){
        $con = mysqli_connect('localhost','root','',$db); 
        if (mysqli_connect_errno()) 
            die ('Failed to connect to MySQL: ' . mysqli_connect_error());
        return mysqli_query($con, $sql);
    }
    
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

	$sql = "select * from Fossil_Part F";
	$res = sql_con_query($con, 'fossil_mashup', $sql);
	if($res != false and mysqli_num_rows($res) > 0)
		{ for($i = 0; $row[$i] = mysqli_fetch_row($res); $i++); }
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
			<td><input type="submit" value="Randomize" /></td>
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
			$sql1 = 'select * from Fossil_Part where Name ="' . $_REQUEST['fusee1'] . '"';
			$res = sql_con_query($con, 'fossil_mashup', $sql1);
			if($res != false) $head = mysqli_fetch_row($res);
			$sql2 = 'select * from Fossil_Part F where F.Name ="' . $_REQUEST['fusee2'] . '"';
			$res = sql_con_query($con, 'fossil_mashup', $sql2);
			if($res != false) $tail = mysqli_fetch_row($res);
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
				$secondary = ($head[3] == $head[5]) ? ('---') : (($tail[3] != NULL && $tail[3] != $hidden) ? ($tail[3]) : (($head[4] != NULL && $head[4] != $primary && $head[4] != $hidden) ? ($head[4]) : ('---')) );
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
				foreach($val as $stat)
					echo '<tr><td width=120>' . $stat . '</td></tr>'; 
				echo '<tr><td width=110>' . $bst . '</td></tr>'; 
			?></table></td><td><?php 
				echo '<input type="image" src="https://play.pokemonshowdown.com/sprites/dex/' . strtolower($tail[0]) . '.png">';
			?></td>
			</tr></table></td>
		</tr></table>
	<?php } ?></font>
</body>