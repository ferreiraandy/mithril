var Header = {
	view: function(ctrl, args) {
		return m('header.barra-titulo.bar.bar-nav', [
			m('a', {
				config: m.route,
				class: 'icon icon-left-nav pull-left' + (args.back ? '' : ' hidden')
			}),
			m('h1.title', args.text),
			m('span.icon.icon-refresh.icone-atualizar', {onclick: function(){ location.reload() }})
		])
	}
};

var Footer = {
	view: function(ctrl, args){
		return m("nav.bar.bar-tab.menu-rodape", [
			m("a.tab-item", {config: m.route, href: "/"}, [
			  m("span.icon.icon-bars")
			]),
			m("a.tab-item", {config: m.route, href: "/contatos"}, [
				m("span.icon.icon-person")
			]),
			m("a.tab-item", {config: m.route, href: "/novo"}, [
				m("span.icon.icon-person"),
				m("span.icon.icon-plus.person-plus")
			]),
			m("a.tab-item", {config: m.route, href: "/imoveis"}, [
				m("span.icon.icon-home")
			]),
			m("a.tab-item", {config: m.route, href: "/novo-imovel"}, [
				m("span.icon.icon-home"),
				m("span.icon.icon-plus.home-plus")
			])
		])
	}
}

var SearchBar = {
	controller: function(args) {
		var ctrl = this;
		ctrl.searchKey = m.prop('');
		ctrl.searchHandler = function(event) {
			ctrl.searchKey(event.target.value);
			args.searchHandler(event.target.value);
		};
	},
	view: function(ctrl) {
		return m('.bar.bar-standard.bar-header-secondary.pesquisa', [
			m('input[type=search]', {
				value: ctrl.searchKey(),
				placeholder: "Pesquisar",
				oninput: ctrl.searchHandler
			})
		])
	}
};

var Home = {
	view: function(){
		return m("div", [
			m.component(Header, {
				text: 'Mithril',
				back: false
			}),
			m(".container.home", [
				m("div.menu-bloco", [
					m('a', {config: m.route, href: '/contatos'}, [
						m("span.icon.icon-person"), m("span", "Contatos"),
						m("span.icon.icon-right-nav")
					])
				]),
				m("div.menu-bloco", [
					m('a', {config: m.route, href: '/imoveis'}, [
						m("span.icon.icon-home"), m("span", "Imóveis"),
						m("span.icon.icon-right-nav")
					])
				])
			]),
			m.component(Footer)
		])
	}
}

var EmployeeListItem = {
	view: function(ctrl, args) {
		return m('li#cod-'+ args.employee.id +'.table-view-cell.media', [
			m('a', {
				config: m.route,
				href: '/employees/' + args.employee.id
			}, [
				m('img.media-object.small.pull-left', {
					src: 'pics/person.jpg'
				}),

				m('span', args.employee.nome),
				m('p', args.employee.email)
			]),

			m('div.remover-usuario', { onclick: function(){

				m.request({ url: 'http://teste.imobzi.com/contatos/'+ args.employee.id,
				  method: 'POST', serialize: function(){
				  var data = new FormData();
				  data.append( 'id', args.employee.id );
				  data.append( '_method', 'delete' );
				  return data;
				} }).then( function(a){
					if(a == "Ok"){
						document.getElementById('cod-'+ args.employee.id).style.display = 'none';
					}else{
						alert(a);
					}

				} )
			} }, "Remover")
		])
	}
};

var EmployeeList = {
	view: function(ctrl, args) {
		var items = args.employees.map(function(employee) {
			return m.component(EmployeeListItem, {
				key: employee.id,
				employee: employee
			})
		})
		return m('ul.table-view', items);
	}
}

var contactPage = {
	view: function(ctrl, args) {
		return m('div', [
			m.component(Header, {
				text: 'Contatos',
				back: false
			}),
			m.component(SearchBar, {
				searchKey: args.searchKey,
				searchHandler: args.searchHandler
			}),
			m('div.content', [
				m.component(EmployeeList, {
					employees: args.employees
				})
			]),
			m.component(Footer)
		])
	}
}

var EmployeePage = {
	controller: function(args) {
		var ctrl = this;
		ctrl.employee = m.prop({});
		m.request({method: "GET",
		url: "http://teste.imobzi.com/contatos/"+m.route.param('Id')+".json"}).then(
			function(a) {
			 ctrl.employee(a);
		} )
	},
	view: function(ctrl, args) {
		return m('div', [
			m.component(Header, {
				text: 'Detalhes',
				back: false
			}),
			m('.card', [
				m('ul.table-view', [
					m('li.table-view-cell.media', [
						m('img.media-object.big.pull-left', {
							src: 'pics/person.jpg'
						}),
						m('h1', [
							m('span', ctrl.employee().nome)
						]),
						m('p', ctrl.employee().email)
					]),
					m('li.table-view-cell.media', [
						m('a.push-right', {
							href: 'tel:' + ctrl.employee().telefone
						}, [
							m('span.media-object.pull-left.icon.icon-call'),
							m('.media-body', 'Telefone', [
								m('p', ctrl.employee().telefone)
							])
						])
					]),
					m('li.table-view-cell.media', [
						m('a.push-right', {
							href: 'cel:' + ctrl.employee().celular
						}, [
							m('span.media-object.pull-left.icon.icon-sms'),
							m('.media-body', 'Celular', [
								m('p', ctrl.employee().celular)
							])
						])
					]),
					m('li.table-view-cell.media', [
						m('a.push-right', {
							href: 'mailto:' + ctrl.employee().email
						}, [
							m('span.media-object.pull-left.icon.icon-email'),
							m('.media-body', 'Email', [
								m('p', ctrl.employee().email)
							])
						])
					]),

					m('a.btn.btn-link.botao-padrao2',{config: m.route,href:'/contatos'}, [
						m('span.icon.icon-left-nav'),
						"Retornar"
					]),
					m('a.btn.btn-primary.botao-padrao', {
						config: m.route, href: '/editar/'+ ctrl.employee().id	}, "Editar",
						[m('span.icon.icon-gear')]
					),
					m('button.btn.btn-negative.botao-padrao', { onclick: function(){
						var id = ctrl.employee().id;
						m.request({ url:'http://teste.imobzi.com/contatos/'+ id,
						  method: 'POST', serialize: function(){
						  var data = new FormData();
						  data.append( 'id', id );
						  data.append( '_method', 'delete' );
						  return data;
						} }).then( function(a){
							m.route("/contatos")
						})
					} },"Excluir", [
						m('span.icon.icon-close')
					])

				])
			]),
			m.component(Footer)
		])
	}
};

var Contato = function(data) {
  data = data || {}
  this.id = m.prop(data.id || "")
  this.nome = m.prop(data.nome || "")
  this.email = m.prop(data.email || "")
  this.telefone = m.prop(data.telefone || "")
  this.celular = m.prop(data.celular || "")
}

Contato.save = function(data) {
	var nome = JSON.parse(JSON.stringify(data["nome"]));
	var email = JSON.parse(JSON.stringify(data["email"]));
	var telefone = JSON.parse(JSON.stringify(data["telefone"]));
	var celular = JSON.parse(JSON.stringify(data["celular"]));
	var erro_nome = document.getElementById("erro-nome");
	var erro_email = document.getElementById("erro-email");
	var erro_tel = document.getElementById("erro-telefone");

	if(nome.length <= 3){ erro_nome.style.display = 'block' }else{
		erro_nome.style.display = 'none' }
	if(email.length <= 3){ erro_email.style.display = 'block' }else{
		erro_email.style.display = 'none' }
	if(telefone.length <= 7){ erro_tel.style.display = 'block' }else{
		erro_tel.style.display = 'none' }

	if( (nome.length > 3)&&(email.length > 3)&&(telefone.length > 7) ){
		return m.request({
			method: "POST",
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			url: "http://teste.imobzi.com/contatos",
			serialize: function(){
				var dados = new FormData();
				dados.append('contato[nome]', nome);
				dados.append('contato[email]', email);
				dados.append('contato[telefone]', telefone);
				dados.append('contato[celular]', celular);
				return dados
			}
		}).then( function(a){
			mensagens = document.getElementById('mensagens');
			mensagens.style.display = 'block';
			if(a == "Criado com sucesso"){
				mensagens.className = 'sucesso';
				mensagens.innerHTML = 'Contato cadastrado com sucesso';
				setTimeout(function(){ location.reload() }, 500)
			}else{
				mensagens.className = '';
				mensagens.innerHTML = 'Desculpe, alguma coisa deu errado, '+
				'verifique os campos e/ ou tente novamente mais tarde';
			}
		})
	}else{
		mensagens.style.display = 'none';
	}
}

var AddContact = {
	controller: function(args) {
		this.contato = m.prop( new Contato() )
		this.save = function(contato) {
			Contato.save(contato)
		}
	},
	view: function(ctrl, args) {
		var contato = ctrl.contato()
		return m('div', [
			m.component(Header, { text: 'Novo contato', back: false	}),
			m('div.content', [
				m('form#contato', {action: "#", method: "post"}, [
					m("#mensagens", ""),

					m("#erro-nome.campo-com-erro", "Nome inválido"),
					m("input", {id: "nome", placeholder: "Nome",
						oninput: m.withAttr("value", contato.nome), value: contato.nome()}),
					m("#erro-email.campo-com-erro", "Email inválido"),
					m("input", {id: "email", placeholder: "Email",
						oninput: m.withAttr("value", contato.email), value: contato.email()}),
					m("#erro-telefone.campo-com-erro", "Telefone obrigatório"),
					m("input", {id: "telefone", placeholder: "Telefone",
						oninput: m.withAttr("value", contato.telefone),
						value: contato.telefone()
					}),
					m("input", {id: "celular", placeholder: "Celular",
						oninput: m.withAttr("value", contato.celular), value: contato.celular()
					}),
					m('a.btn.btn-positive.btn-block.botao-submit', {
						onclick: ctrl.save.bind(this, contato)	}, "Salvar")
				])
			]),
			m.component(Footer)
		])
	}
};

var EditContact = {
	controller: function(args) {
		var ctrl = this;
		ctrl.employee = m.prop({});
		m.request({method: "GET",
		url: "http://teste.imobzi.com/contatos/"+m.route.param('Id')+".json"}).then(
			function(a) { ctrl.employee(a) } )
	},
	view: function(ctrl, args){
		return m('div', [
			m.component(Header, {
				text: 'Editar contato', back: true
			}),
			m('div.content', [
				m('form#contato', {action: "#", method: "post"}, [
					m("#mensagens", ""),
					m("#erro-nome.campo-com-erro", "Nome inválido"),
					m("input", {id: "nome", value: ctrl.employee().nome,
							placeholder: "Nome", name: 'contato[nome]'}),
					m("#erro-email.campo-com-erro", "Email inválido"),
					m("input", {id: "email", value: ctrl.employee().email,
							placeholder: "Email", name: 'contato[email]'}),
					m("#erro-telefone.campo-com-erro", "Telefone obrigatório"),
					m("input", {id: "telefone", value: ctrl.employee().telefone,
							placeholder: "Telefone", name: 'contato[Telefone]'}),
					m("input", {id: "celular", value: ctrl.employee().celular,
							placeholder: "Celular", name: 'contato[celular]'}),
					m('a.btn.btn-positive.btn-block.botao-submit', { onclick: function(){

						var nome = document.getElementById("nome").value;
						var email = document.getElementById("email").value;
						var telefone = document.getElementById("telefone").value;
						var celular = document.getElementById("celular").value;
						var erro_nome = document.getElementById("erro-nome");
						var erro_email = document.getElementById("erro-email");
						var erro_tel = document.getElementById("erro-telefone");

						if(nome.length <= 3){ erro_nome.style.display = 'block' }else{
							erro_nome.style.display = 'none' }
						if(email.length <= 3){ erro_email.style.display = 'block' }else{
							erro_email.style.display = 'none' }
						if(telefone.length <= 7){ erro_tel.style.display = 'block' }else{
							erro_tel.style.display = 'none' }

						if( (nome.length > 3)&&(email.length > 3)&&(telefone.length > 7) ){
							m.request({url:"http://teste.imobzi.com/contatos/"+ctrl.employee().id,
								method: 'POST', serialize: function(){
								var data = new FormData();
								data.append('contato[nome]',nome);
								data.append('contato[email]', email);
								data.append('contato[telefone]', telefone);
								data.append('contato[celular]', celular);
								data.append('_method', 'PUT');
								return data;
							} }).then( function(a){
								mensagens = document.getElementById('mensagens');
								mensagens.style.display = 'block';
								if(a == "OK"){
									mensagens.className += 'sucesso';
									mensagens.innerHTML = 'Contato editado com sucesso';
									m.route("/employees/"+ ctrl.employee().id)
								}else{
									mensagens.innerHTML = 'Desculpe, alguma coisa deu errado, '+
									'verifique os campos e/ ou tente novamente mais tarde';
								}
							})
						}
					} }, "Salvar")
				])
			]),
			m.component(Footer)
		])
	}
};


var ImovelListItem = {
	view: function(ctrl, args) {
		return m('li#cod-'+ args.imovel.id +'.table-view-cell.media', [
			m('a', {
				config: m.route,
				href: '/imovel/' + args.imovel.id
			}, [
				m('img.media-object.small.pull-left', {
					src: 'pics/imovel.png'
				}),

				m('span', args.imovel.bairro),
				m('p', args.imovel.endereco)
			]),

			m('div.remover-usuario', {onclick: function(){

				var db = window.sqlitePlugin.openDatabase("imobzi.db","1.0","test",20000)
				db.transaction(function(tx) {
					tx.executeSql(
						"delete from imovels where id = "+args.imovel.id, [], function(i) {
							document.getElementById('cod-'+args.imovel.id).style.display = 'none';
						}, function(tx, res) {
							alert('Ocorreu um erro, tente novamente.');
						}
					);
				})

			}}, "Remover")
		])
	}
};

var ImovelList = {
	view: function(ctrl, args) {
		var items = args.imoveis.map(function(imovel) {
			return m.component(ImovelListItem, {
				key: imovel.id,
				imovel: imovel
			})
		})
		return m('ul.table-view', items);
	}
}

var Imoveis = {
	controller: function(){
		m.redraw.strategy("all");
	},
	view: function(ctrl, args) {
		return m('div', [
			m.component(Header, {
				text: 'Imoveis',
				back: false
			}),
			m.component(SearchBar, {
				searchKey: args.searchKey,
				searchHandler: args.searchHandler
			}),
			m('div.content', [
				m.component(ImovelList, {
					imoveis: args.imoveis
				})
			]),
			m.component(Footer)
		])
	}
}

var NewImovel = function(data) {
  data = data || {}
  this.id = m.prop(data.id || "")
	this.cep = m.prop(data.cep || "")
  this.endereco = m.prop(data.endereco || "")
  this.numero = m.prop(data.numero || "")
  this.bairro = m.prop(data.bairro || "")
  this.cidade = m.prop(data.cidade || "")
  this.estado = m.prop(data.estado || "")
}

var AddImovel = {
	controller: function(args) {
		this.imovel = m.prop( new NewImovel() )
	},
	view: function(ctrl, args) {
		var imovel = ctrl.imovel()
		return m('div', [
			m.component(Header, { text: 'Novo imóvel', back: false	}),
			m('div.content', [
				m('form#imovel', {action: "#", method: "post"}, [
					m("#mensagens", ""),

					m("#erro-cep.campo-com-erro", "Cep inválido"),
					m("input", {id: "cep", placeholder: "Cep",
						oninput: m.withAttr("value", imovel.cep), value: imovel.cep()}),
					m("#erro-endereco.campo-com-erro", "Endereço inválido"),
					m("input", {id: "endereco", placeholder: "Endereço",
						oninput:m.withAttr("value",imovel.endereco),value:imovel.endereco()}),
					m("input", {id: "numero", placeholder: "Número",
						oninput: m.withAttr("value", imovel.numero), value: imovel.numero()}),
					m("#erro-bairro.campo-com-erro", "Bairro inválido"),
					m("input", {id: "bairro", placeholder: "Bairro",
						oninput: m.withAttr("value", imovel.bairro), value: imovel.bairro()}),
					m("input", {id: "cidade", placeholder: "Cidade",
						oninput: m.withAttr("value", imovel.cidade), value: imovel.cidade()}),
					m("input", {id: "estado", placeholder: "Estado",
						oninput: m.withAttr("value", imovel.estado), value: imovel.estado()}),

					m('a.btn.btn-positive.btn-block.botao-submit',{ onclick: function(){
						var erro_cep = document.getElementById("erro-cep");
						var erro_endereco = document.getElementById("erro-endereco");
						var erro_bairro = document.getElementById("erro-bairro");

						var cep = document.getElementById('cep').value;
						var endereco = document.getElementById('endereco').value;
						var numero = document.getElementById('numero').value;
						var bairro = document.getElementById('bairro').value;
						var cidade = document.getElementById('cidade').value;
						var estado = document.getElementById('estado').value;

						if(window.sqlitePlugin == undefined){
							alert("Desculpe nos, mas este tipo de interação só esta permitido no android")
						}

						if(cep.length <= 8){ erro_cep.style.display = 'block' }else{
							erro_cep.style.display = 'none' }
						if(endereco.length <= 5){ erro_endereco.style.display = 'block' }else{
							erro_endereco.style.display = 'none' }
						if(bairro.length <= 5){ erro_bairro.style.display = 'block' }else{
							erro_bairro.style.display = 'none' }

						if((cep.length > 8)&&(endereco.length > 5)&&(bairro.length > 5)){
							var db = window.sqlitePlugin.openDatabase("imobzi.db","1.0","test",20000)
							db.transaction(function(tx) {
								mensagens = document.getElementById('mensagens');
								mensagens.style.display = 'block';

								tx.executeSql("INSERT INTO imovels (cep,endereco,numero,bairro,cidade,estado) VALUES (?,?,?,?,?,?)",
						    	[cep,endereco,numero,bairro,cidade,estado], function(tx, res) {
										mensagens.className = 'sucesso';
										mensagens.innerHTML = 'Contato cadastrado com sucesso';
										setTimeout(function(){ location.reload() }, 500)
									}, function(tx, res) {
										mensagens.className = '';
										mensagens.innerHTML = 'Desculpe, alguma coisa deu errado, '+
										'verifique os campos e/ ou tente novamente mais tarde';
									}
								);
							})
						}

					}}, "Salvar")
				])
			]),
			m.component(Footer)
		])
	}
}

var ImovelPage = {
	controller: function(args) {
		m.redraw.strategy("all");

		var ctrl = this;
		ctrl.imovel = m.prop({});

		if((imoveis)&&(imoveis.length > 0)){
			for (var i=0; i < imoveis.length; i++) {
				if(parseInt(imoveis[i]['id']) == parseInt(m.route.param('Id'))){
					ctrl.imovel(imoveis[i]);
				}
			}
		}else{
			var db = window.sqlitePlugin.openDatabase("imobzi.db","1.0","test",20000);
			db.transaction(function(tx) {
				tx.executeSql("SELECT * FROM imovels WHERE id = "+m.route.param("Id")+";",[],function(p,res){
					ctrl.imovel(res.rows.item(0));
				},
				function(p, res) {	alert('error: ' + res.message);	});
			})
		}
	},
	view: function(ctrl, args) {
		return m('div', [
			m.component(Header, {text: 'Imóvel Detalhes', back: false}),

			m('.card', [
				m('ul.table-view', [

					m('li.table-view-cell.media', [
						m('img.media-object.big.pull-left', {
							src: 'pics/imovel.png'
						}),
						m('h1', [m('span', ctrl.imovel().bairro)]),
						m('p', ctrl.imovel().endereco)
					]),

					m('li.table-view-cell.media', [
						m('span.media-object.pull-left.icon.icon-call'),
						m('.media-body', 'Numero', [m('p', ctrl.imovel().numero)])
					]),

					m('li.table-view-cell.media', [
						m('span.media-object.pull-left.icon.icon-call'),
						m('.media-body', 'Cep', [m('p', ctrl.imovel().cep)])
					]),

					m('li.table-view-cell.media', [
						m('span.media-object.pull-left.icon.icon-call'),
						m('.media-body', 'Cidade', [m('p', ctrl.imovel().cidade)])
					]),
					m('li.table-view-cell.media', [
						m('span.media-object.pull-left.icon.icon-call'),
						m('.media-body', 'Estado', [m('p', ctrl.imovel().estado)])
					]),

					m('a.btn.btn-link.botao-padrao2',{config: m.route, href:'/imoveis'}, [
						m('span.icon.icon-left-nav'),	"Retornar"]
					),

					m('a.btn.btn-primary.botao-padrao', {
						config: m.route, href: '/editar_imovel/'+ ctrl.imovel().id
					}, "Editar", [m('span.icon.icon-gear')]),

					m('button.btn.btn-negative.botao-padrao', { onclick: function(){
						var db = window.sqlitePlugin.openDatabase("imobzi.db","1.0","test",20000)
						db.transaction(function(tx) {
							tx.executeSql(
								"delete from imovels where id = "+ctrl.imovel().id, [], function(i) {
									route("/imoveis");
								}, function(tx, res) {
									alert('Ocorreu um erro, tente novamente.');
								}
							);
						})

					} },"Excluir", [
						m('span.icon.icon-close')
					])

				])
			]),
			m.component(Footer)
		])
	}
}

var ImovelEditar = {
	controller: function(args) {
		var ctrl = this;
		ctrl.imovel = m.prop({});

		if((imoveis)&&(imoveis.length > 0)){
			for (var i=0; i < imoveis.length; i++) {
				if(parseInt(imoveis[i]['id']) == parseInt(m.route.param('Id'))){
					ctrl.imovel(imoveis[i]);
				}
			}
		}else{
			var db = window.sqlitePlugin.openDatabase("imobzi.db","1.0","test",20000);
			db.transaction(function(tx) {
				tx.executeSql("SELECT * FROM imovels WHERE id = "+m.route.param("Id")+";",[],function(p,res){
					ctrl.imovel(res.rows.item(0));
				},
				function(p, res) {	alert('error: ' + res.message);	});
			})
		}
	},
	view: function(ctrl, args) {
		return m('div', [
			m.component(Header, { text: 'Editar imóvel', back: false	}),
			m('div.content', [
				m('form#imovel', {action: "#", method: "post"}, [
					m("#mensagens", ""),

					m("#erro-cep.campo-com-erro", "Cep inválido"),
					m("input", {id: "cep", placeholder: "Cep", value: ctrl.imovel().cep}),
					m("#erro-endereco.campo-com-erro", "Endereço inválido"),
					m("input", {id: "endereco", placeholder: "Endereço", value: ctrl.imovel().endereco}),
					m("input", {id: "numero", placeholder: "Número", value: ctrl.imovel().numero}),
					m("#erro-bairro.campo-com-erro", "Bairro inválido"),
					m("input", {id: "bairro", placeholder: "Bairro", value: ctrl.imovel().bairro}),
					m("input", {id: "cidade", placeholder: "Cidade", value: ctrl.imovel().cidade}),
					m("input", {id: "estado", placeholder: "Estado", value: ctrl.imovel().estado}),

					m('a.btn.btn-positive.btn-block.botao-submit',{ onclick: function(){
						var erro_cep = document.getElementById("erro-cep");
						var erro_endereco = document.getElementById("erro-endereco");
						var erro_bairro = document.getElementById("erro-bairro");

						var cep = document.getElementById('cep').value;
						var endereco = document.getElementById('endereco').value;
						var numero = document.getElementById('numero').value;
						var bairro = document.getElementById('bairro').value;
						var cidade = document.getElementById('cidade').value;
						var estado = document.getElementById('estado').value;

						if(window.sqlitePlugin == undefined){
							alert("Desculpe nos, mas este tipo de interação só esta permitido no android")
						}

						if(cep.length <= 8){ erro_cep.style.display = 'block' }else{
							erro_cep.style.display = 'none' }
						if(endereco.length <= 5){ erro_endereco.style.display = 'block' }else{
							erro_endereco.style.display = 'none' }
						if(bairro.length <= 5){ erro_bairro.style.display = 'block' }else{
							erro_bairro.style.display = 'none' }

						if((cep.length > 8)&&(endereco.length > 5)&&(bairro.length > 5)){
							var db = window.sqlitePlugin.openDatabase("imobzi.db","1.0","test",20000)
							db.transaction(function(tx) {
								mensagens = document.getElementById('mensagens');
								mensagens.style.display = 'block';

								tx.executeSql("UPDATE imovels set cep = '"+ cep +"',"+
									"endereco = '"+endereco+"', numero = '"+numero+"',"+
									"bairro = '"+bairro+"',cidade = '"+cidade+"',"+
									"estado = '"+estado+"' WHERE id = "+ctrl.imovel().id+";",
									[], function(tx, res) {
										mensagens.className = 'sucesso';
										mensagens.innerHTML = 'Imóvel atualizado com sucesso';
										m.route("/imovel/"+ctrl.imovel().id)
									}, function(tx, res) {
										mensagens.className = '';
										mensagens.innerHTML = 'Desculpe, alguma coisa deu errado, '+
										'verifique os campos e/ ou tente novamente mais tarde';
									}
								);
							})
						}

					}}, "Salvar")
				])
			]),
			m.component(Footer)
		])
	}

}

var App = {
	controller: function(args) {
		var ctrl = this;
		ctrl.searchKey = m.prop('');
		ctrl.employees = m.prop([]);
		ctrl.page = m.prop(null);
		ctrl.searchHandler = function(searchKey) {
			employeeService.findByName(searchKey).then(function(employees) {
				ctrl.employees(employees);
				ctrl.searchKey(searchKey);
				ctrl.page(m.component(contactPage, {
					key: 'list',
					searchHandler: ctrl.searchHandler,
					searchKey: ctrl.searchKey(),
					employees: ctrl.employees()
				}))
			})
		}
	},
	view: function(ctrl, args) {
		if (!ctrl.page()) {
			ctrl.searchHandler(' ')
		};
		return ctrl.page()
	}
};

var ImovelApp = {
	controller: function(args) {
		var ctrl = this;
		ctrl.searchKey = m.prop('');
		ctrl.imoveis = m.prop([]);
		ctrl.page = m.prop(null);
		ctrl.searchHandler = function(searchKey) {
			imovelService.findByName(searchKey).then(function(imoveis) {
				ctrl.imoveis(imoveis);
				ctrl.searchKey(searchKey);
				ctrl.page(m.component(Imoveis, {
					key: 'list',
					searchHandler: ctrl.searchHandler,
					searchKey: ctrl.searchKey(),
					imoveis: ctrl.imoveis()
				}))
			})
		}
	},
	view: function(ctrl, args) {
		if (!ctrl.page()) {
			ctrl.searchHandler(' ')
		};
		return ctrl.page()
	}
};

m.route(document.body, '/', {
	'/': Home,
	'/contatos': m.component(App, { service: employeeService }),
	'/employees/:Id': m.component(EmployeePage, { service: employeeService }),
	'/novo': m.component(AddContact, { service: employeeService	}),
	'/editar/:Id': m.component(EditContact, {	service: employeeService }),
	'/imoveis': m.component(ImovelApp, { service: imovelService }),
	'/novo-imovel': m.component(AddImovel, { service: imovelService }),
	'/imovel/:Id': m.component(ImovelPage, { service: imovelService }),
	'/editar_imovel/:Id': m.component(ImovelEditar, { service: imovelService })
})
