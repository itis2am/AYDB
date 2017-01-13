<?php
switch($_POST['fxname']){
	case "getDatedFile":
		echo 'data/AYDB_people'.date('_d-m-Y_h_i_sa').'.csv';
		break;
	case "writeFile":
		$file = fopen($_POST['fileref'], "a");
		fwrite($file, $_POST['id'].','.$_POST['pre'].','.$_POST['px'].','.$_POST['py'].",endl\r\n");
		fclose($file);
		echo $_POST['fileref'];
		break;
	default:
		echo "no fx called";
}
?>