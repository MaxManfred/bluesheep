// creo mappa esito -> [banca, rischio]
var esito2BancaRischioMap = new Map();

// funzioni calcolatore

function calcoloEsito2BancaRischioMap(importoScommessa, valoreRimborso, percentualeRimborso, quotePuntate, quoteBancate, commissioni) {
	// calcolo termini noti
	var bm = percentualeRimborso * valoreRimborso;
	var a = 1;
	for (i = 0; i < quotePuntate.length; i++) {
		a *= quotePuntate[i];
	}
	var ax = a * importoScommessa;
	
	var terminiNoti = math.matrix([0, bm, -1 * bm, bm, 0, ax - bm]);
	
	// calcolo matrice
	var matrice = math.matrix([
		[0, 0, quoteBancate[1] - commissioni[1], 0, 0, commissioni[2] - 1], 
		[0, 0, 0, 0, 0, quoteBancate[2] - commissioni[2]],
		[quoteBancate[0] - commissioni[0], commissioni[1] - 1, 1 - quoteBancate[1], 0, commissioni[2] - 1, 1 - quoteBancate[2]],
		[0, 0, 0, 0, quoteBancate[2] - commissioni[2], 0],
		[0, quoteBancate[1] - commissioni[1], 0, commissioni[2] - 1, 1 - quoteBancate[2], 0],
		[0, 0, 0, quoteBancate[2] - commissioni[2], 0, 0]
	]);
	
	// inversione della matrice
	var matriceInversa = math.inv(matrice);
	
	// prodotto matrice, vettore per avere banche
	var banche = math.multiply(matriceInversa, terminiNoti).toArray();
	console.log(banche);
	
	// creo mappa esito -> [banca, rischio]
	esito2BancaRischioMap = new Map();

	esito2BancaRischioMap.set("NULL", [banche[0].toFixed(2), (banche[0] * (quoteBancate[0] - 1)).toFixed(2)]);
	esito2BancaRischioMap.set("V", [banche[1].toFixed(2), (banche[1] * (quoteBancate[1] - 1)).toFixed(2)]);
	esito2BancaRischioMap.set("P", [banche[2].toFixed(2), (banche[2] * (quoteBancate[1] - 1)).toFixed(2)]);
	esito2BancaRischioMap.set("VV", [banche[3].toFixed(2), (banche[3] * (quoteBancate[2] - 1)).toFixed(2)]);
	esito2BancaRischioMap.set("VP", [banche[4].toFixed(2), (banche[4] * (quoteBancate[2] - 1)).toFixed(2)]);
	esito2BancaRischioMap.set("PV", [banche[5].toFixed(2), (banche[5] * (quoteBancate[2] - 1)).toFixed(2)]);
	console.log(esito2BancaRischioMap);
}

function getBancaRischioByEsiti(esiti) {
	// esiti può essere NULL, "V", "P" "VV", "VP", "PV"
	console.log(esito2BancaRischioMap.get(esiti));

	return esito2BancaRischioMap.get(esiti);
}