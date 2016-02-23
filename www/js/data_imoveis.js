imovelService = (function() {

	var findById = function(id) {
		var deferred = m.deferred();
		var imovel = null;
		var l = imoveis.length;
		for (var i = 0; i < l; i++) {
			if (imoveis[i].id == id) {
				imovel = imoveis[i];
				break;
			}
		}
		deferred.resolve(imovel);
		return deferred.promise;
	},

	findByName = function (searchKey) {
		var deferred = m.deferred();
		var results = imoveis.filter(function (element) {
			var fullName = element.bairro + " ";
			return fullName.toLowerCase().indexOf(searchKey.toLowerCase()) > -1;
		});

		deferred.resolve(results);
		return deferred.promise;
	},

	findByManager = function (id) {
		var deferred = m.deferred();
		var results = imoveis.filter(function (element) {
			return managerId === element.id;
		});
		deferred.resolve(results);
		return deferred.promise;
	},


	onDeviceReady = function() {
		var db = window.sqlitePlugin.openDatabase("imobzi.db", "1.0", "test", 20000)

	  db.transaction(function(tx) {
	    tx.executeSql('CREATE TABLE IF NOT EXISTS imovels '+
			'(id integer primary key, cep varchar(10), endereco varchar(200),'+
			' numero varchar(10), bairro varchar(200), cidade varchar(200),'+
			' estado varchar(200) )');

			tx.executeSql(
		    "select * from imovels ORDER BY bairro;", [], function(tx, res) {
		      for (var i=0; i<res.rows.length; i++) {
						imoveis.push( res.rows.item(i) );
		      }
		    },
		    function(tx, res) {
	      	alert('error: ' + res.message);
	    	}
			);


		})
	}

	imoveis = [];
	// imoveis = [
 // 		{"id": 1, "bairro": "Bairro", "endereco": "Endereço", "numero": 0, "cep": "06900-000", "estado": "SP"},
 // 		{"id": 2, "bairro": "Bairro", "endereco": "Endereço", "numero": 0, "cep": "06900-000", "estado": "SP"},
 // 		{"id": 3, "bairro": "Bairro", "endereco": "Endereço", "numero": 0, "cep": "06900-000", "estado": "SP"},
 // 		{"id": 4, "bairro": "Bairro", "endereco": "Endereço", "numero": 0, "cep": "06900-000", "estado": "SP"},
 // 		{"id": 5, "bairro": "Bairro", "endereco": "Endereço", "numero": 0, "cep": "06900-000", "estado": "SP"}
	// ];

	document.addEventListener("deviceready", onDeviceReady, false)

	return {
		findById: findById,
		findByName: findByName,
		findByManager: findByManager
	}
}());
