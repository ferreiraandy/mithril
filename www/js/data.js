employeeService = (function() {

	var findById = function(id) {
		var deferred = m.deferred();
		var employee = null;
		var l = employees.length;
		for (var i = 0; i < l; i++) {
			if (employees[i].id == id) {
				employee = employees[i];
				break;
			}
		}
		deferred.resolve(employee);
		return deferred.promise;
	},

	findByName = function (searchKey) {
		var deferred = m.deferred();
		var results = employees.filter(function (element) {
			var fullName = element.nome + " ";
			// return fullName.toLowerCase().indexOf(searchKey.toLowerCase()) > -1;
			return fullName.toLowerCase().indexOf(searchKey.toLowerCase()) > -1;
		});

		deferred.resolve(results);
		return deferred.promise;
	},

	findByManager = function (id) {
		var deferred = m.deferred();
		var results = employees.filter(function (element) {
			return managerId === element.id;
		});
		deferred.resolve(results);
		return deferred.promise;
	},

	employees = m.prop([]);
	m.request({method: "GET", url: "http://teste.imobzi.com/contatos"}).then( function(a) { employees = a } );

	return {
		findById: findById,
		findByName: findByName,
		findByManager: findByManager
	}
}());
