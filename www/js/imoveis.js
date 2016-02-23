document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
  var db = window.sqlitePlugin.openDatabase("imobzi.db", "1.0", "test", 20000);

  db.transaction(function(tx) {

    tx.executeSql('CREATE TABLE IF NOT EXISTS imovels (id integer primary key, cep varchar(10), endereco varchar(200), numero varchar(10), bairro varchar(200), cidade varchar(200), estado varchar(200) )');
    // db.executeSql("pragma table_info (imovels);", [], function(res) {
    //   alert("PRAGMA res: " + JSON.stringify(res));
    // });

    // Linhas de inserir e selecionar um imóvel
    // tx.executeSql("INSERT INTO imovels (cep,endereco,numero,bairro,cidade,estado) VALUES (?,?,?,?,?,?)",
    // ['06900-000','Ricardo','134','jd sp','embu','sp'], function(tx, res) {
    //   alert("insertId: " + res.insertId);
    //   alert("rowsAffected: " + res.rowsAffected);
    //
    //   db.transaction(function(tx) {
    //     tx.executeSql("select count(id) as cnt from imovels;", [], function(tx, res) {
    //       alert("res.rows.length: " + res.rows.length + " -- should be 1");
    //       alert("res.rows.item(0).cnt: " + res.rows.item(0).cnt + " -- should be 1");
    //     });
    //   });
    // }, function(e) { alert("ERROR: " + e.message); });
  });
}

function todosImoveis(){
  db.transaction(function(tx) {
    tx.executeSql("select cep, endereco, numero, bairro from imovels;", [], function(tx, res) {
      alert("Resultado: " + res );
    }, function(e) { alert("ERROR: " + e.message); });
  });
}

function selectImovel(id){
  db.transaction(function(tx) {
    tx.executeSql("select * from imovels where id = "+ id +";", [], function(tx, res) {
      alert("Resultado: " + res );
    }, function(e) { alert("ERROR: " + e.message); });
  });
}
