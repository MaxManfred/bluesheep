var esiti = "";

function setupEventHandling() {
	hideButtons();

	// only numeric is allowed in each text input
	// update solutions
	$j("#scommessa, #rimborso, #perc_rimborso, #qp1, #qb1, #cm1, #qp2, #qb2, #cm2, #qp3, #qb3, #cm3").on("keypress keyup blur", function(event) {
		$j(this).val($j(this).val().replace(/[^0-9\.]/g,''));
		if ((event.which != 46 || $j(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
			event.preventDefault();
		}

		var scommessa = $j("#scommessa").val();
		var rimborso = $j("#rimborso").val();
		var perc_rimborso = $j("#perc_rimborso").val();

		var qp1 = $j("#qp1").val();
		var qb1 = $j("#qb1").val();
		var cm1 = $j("#cm1").val();

		var qp2 = $j("#qp2").val();
		var qb2 = $j("#qb2").val();
		var cm2 = $j("#cm2").val();

		var qp3 = $j("#qp3").val();
		var qb3 = $j("#qb3").val();
		var cm3 = $j("#cm3").val();

		if (
			scommessa != "" && rimborso != "" && perc_rimborso != "" && 
			qp1 != "" && qp2 != "" && qp3 != "" &&
			qb1 != "" && qb2 != "" && qb3 != "" &&
			cm1 != "" && cm2 != "" && cm3 != ""
		) {
			var importoScommessa = parseFloat(scommessa);
			var valoreRimborso = parseFloat(rimborso);
			var percentualeRimborso = parseFloat(perc_rimborso);
			
			var quotePuntate = [parseFloat(qp1), parseFloat(qp2), parseFloat(qp3)];
			var quoteBancate = [parseFloat(qb1), parseFloat(qb2), parseFloat(qb3)];
			var commissioni = [parseFloat(cm1), parseFloat(cm2), parseFloat(cm3)];

			calcoloEsito2BancaRischioMap(importoScommessa, valoreRimborso, percentualeRimborso, quotePuntate, quoteBancate, commissioni);

			// retrieve solutions and update GUI
			updateGUI();
		}
	});

	// retrieve solutions
	$j("#v1, #p1, #v2, #p2, #v3, #p3").on("click", function(event) {
		var id = event.currentTarget.id;
		var index = id.substring(id.length - 1, id.length);

		// lock
		$j("#v" + index).hide();
		$j("#p" + index).hide();
		$j("#l" + index).show();

		esiti += $j("#" + id).text();

		if (index < 3 && esiti != "PP") {
			index++;
			$j("#v" + index).show();
			$j("#p" + index).show();
		}

		// TODO: remove
		console.log(esiti);

		// retrieve solutions and update GUI
		updateGUI();
	});

	$j("#l1, #l2, #l3").on("click", function(event) {
		var id = event.currentTarget.id;
		var index = id.substring(id.length - 1, id.length);

		// unlock
		$j("#l" + index).hide();
		$j("#v" + index).show();
		$j("#p" + index).show();

		esiti = esiti.substring(0, esiti.length - 1);

		for (i = ++index; i < 4; i++) {
			$j("#v" + i).hide();
			$j("#p" + i).hide();
			$j("#l" + i).hide();
		}

		// TODO: remove
		console.log(esiti);

		// retrieve solutions and update GUI
		updateGUI();
	});
}

function updateGUI() {
	$j("#bn1, #rs1, #bn2, #rs2, #bn3, #rs3").val("");

	var solutions1 = getBancaRischioByEsiti("NULL");
	$j("#bn1").val(solutions1[0]);
	$j("#rs1").val(solutions1[1]);

	switch (esiti) {
		case "V":
			var solutions2 = getBancaRischioByEsiti("V");
			$j("#bn2").val(solutions2[0]);
			$j("#rs2").val(solutions2[1]);
			break;
		case "P":
			var solutions2 = getBancaRischioByEsiti("P");
			$j("#bn2").val(solutions2[0]);
			$j("#rs2").val(solutions2[1]);
			break;
		case "VV":
			var solutions2 = getBancaRischioByEsiti("V");
			$j("#bn2").val(solutions2[0]);
			$j("#rs2").val(solutions2[1]);

			var solutions3 = getBancaRischioByEsiti("VV");
			$j("#bn3").val(solutions3[0]);
			$j("#rs3").val(solutions3[1]);
			break;
		case "VP":
			var solutions2 = getBancaRischioByEsiti("V");
			$j("#bn2").val(solutions2[0]);
			$j("#rs2").val(solutions2[1]);

			var solutions3 = getBancaRischioByEsiti("VP");
			$j("#bn3").val(solutions3[0]);
			$j("#rs3").val(solutions3[1]);
			break;
		case "PV":
			var solutions2 = getBancaRischioByEsiti("P");
			$j("#bn2").val(solutions2[0]);
			$j("#rs2").val(solutions2[1]);

			var solutions3 = getBancaRischioByEsiti("PV");
			$j("#bn3").val(solutions3[0]);
			$j("#rs3").val(solutions3[1]);
			break;
		default:
			break;
	}
}

function hideButtons() {
	// hide buttons
	// $j("#v1").hide();
	// $j("#p1").hide();
	$j("#l1").hide();
	
	$j("#v2").hide();
	$j("#p2").hide();
	$j("#l2").hide();
	
	$j("#v3").hide();
	$j("#p3").hide();
	$j("#l3").hide();
}