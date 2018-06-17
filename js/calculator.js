// creo mappa esito -> [banca, rischio]
var esito2BBRQPMap = new Map();

// funzioni calcolatore

/*
dati gli input espressi come parametri, per ogni esito possibile (NULL, V, P, VV, VP, PV), calcola i valori di
	- banca
	- rischio
	- quota totale puntate (dipende solo dalle quote puntate)
	- profitto
produce una mappa che ad ogni evento associa la quaterna ordinata [banca, rischio, quota totale puntata, profitto]
*/
function calcoloEsito2BRQPMap(importoScommessa, valoreRimborso, percentualeRimborso, quotePuntate, quoteBancate, commissioni) {
	// calcolo termini noti
	var bm = percentualeRimborso * valoreRimborso;
	var a = 1;
	for (i = 0; i < quotePuntate.length; i++) {
		a *= quotePuntate[i];
	}
	var ax = a * importoScommessa;
	
	var terminiNoti = math.matrix([0, bm, -1 * bm, bm, 0, ax - bm]);
	
	var h1 = quoteBancate[0];
	var h2 = quoteBancate[1];
	var h3 = quoteBancate[2];

	var g1 = commissioni[0];
	var g2 = commissioni[1];
	var g3 = commissioni[2];

	// calcolo matrice
	var matrice = math.matrix([
		[0, 0, h2 - g2, 0, 0, g3 - 1], 
		[0, 0, 0, 0, 0, h3 - g3],
		[h1 - g1, g2 - 1, 1 - h2, 0, g3 - 1, 1 - h3],
		[0, 0, 0, 0, h3 - g3, 0],
		[0, h2 - g2, 0, g3 - 1, 1 - h3, 0],
		[0, 0, 0, h3 - g3, 0, 0]
	]);
	
	// inversione della matrice
	var matriceInversa = math.inv(matrice);
	
	// prodotto matrice, vettore per avere banche
	var banche = math.multiply(matriceInversa, terminiNoti).toArray();
	console.log(banche);
	
	var y1 = banche[0];
	var y2v = banche[1];
	var y2p = banche[2];
	var y3vv = banche[3];
	var y3vp = banche[4];
	var y3pv = banche[5];

	// creo mappa esito -> [banca, rischio, quota totale puntate, profitto]
	esito2BBRQPMap = new Map();

	esito2BBRQPMap.set(
		"NULL", 
		[ y1.toFixed(2), (y1 * (quoteBancate[0] - 1)).toFixed(2), a.toFixed(2), (importoScommessa * (a - 1) - y1 * (h1 - 1) - y2v * (h2 - 1) - y3vv * (h3 - 1)).toFixed(2) ]
	);
	esito2BBRQPMap.set(
		"V", 
		[ y2v.toFixed(2), (y2v * (quoteBancate[1] - 1)).toFixed(2), a.toFixed(2), (importoScommessa * (a - 1) - y1 * (h1 - 1) - y2v * (h2 - 1) - y3vv * (h3 - 1)).toFixed(2) ]
	);
	esito2BBRQPMap.set(
		"P", 
		[ y2p.toFixed(2), (y2p * (quoteBancate[1] - 1)).toFixed(2), a.toFixed(2), (- importoScommessa + (valoreRimborso * percentualeRimborso) - y2p * (h2 - 1) - y3pv * (h3 - 1) + (1 - g1) * y1).toFixed(2) ] 
	);
	esito2BBRQPMap.set(
		"VV", 
		[ y3vv.toFixed(2), (y3vv * (quoteBancate[2] - 1)).toFixed(2) , a.toFixed(2), (importoScommessa * (a - 1) - y1 * (h1 - 1) - y2v * (h2 - 1) - y3vv * (h3 - 1)).toFixed(2) ]
	);
	esito2BBRQPMap.set(
		"VP", 
		[ y3vp.toFixed(2), (y3vp * (quoteBancate[2] - 1)).toFixed(2), a.toFixed(2), (- importoScommessa + (valoreRimborso * percentualeRimborso) - y1 * (h1 - 1) - y3vp * (h3 - 1) + (1 - g2) * y2v).toFixed(2) ]
	);
	esito2BBRQPMap.set(
		"PV", 
		[ y3pv.toFixed(2), (y3pv * (quoteBancate[2] - 1)).toFixed(2), a.toFixed(2), (- importoScommessa + (valoreRimborso * percentualeRimborso) - y2p * (h2 - 1) - y3pv * (h3 - 1) + (1 - g1) * y1).toFixed(2) ]
	);

	console.log(esito2BBRQPMap);
}

function getBancaRischioByEsiti(esiti) {
	// esiti può essere NULL, "V", "P" "VV", "VP", "PV"
	console.log(esito2BBRQPMap.get(esiti));

	return esito2BBRQPMap.get(esiti);
}