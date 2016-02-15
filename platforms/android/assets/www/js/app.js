var Header = {
	view: function(ctrl, args) {
		return m('header.bar.bar-nav', [
			m('a', {
				config: m.route,
				class: 'icon icon-left-nav pull-left' + (args.back ? '' : ' hidden')
			}),
			m('h1.title', args.text)

		])
	}
};

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
		return m('.bar.bar-standard.bar-header-secondary', [
			m('input[type=search]', {
				value: ctrl.searchKey(),
				oninput: ctrl.searchHandler //oninput fires at each single character change in the field
					// onchange fires when the field is blurred etc. see https://developer.mozilla.org/en-US/docs/Web/Events/change
			})
		])
	}
};

var EmployeeListItem = {
	view: function(ctrl, args) {
		return m('li.table-view-cell.media', [
			m('a', {
				config: m.route,
				href: '/employees/' + args.employee.id
			}, [
				m('img.media-object.small.pull-left', {
					src: 'pics/undefined.jpg'
				}),

				m('span', args.employee.nome),
				m('p', args.employee.email)
			]),

			m('span.icon.icon-trash.remover-usuario', { onclick: function(){

				m.request({ url: 'http://10.0.0.111/contatos/'+ args.employee.id,
				  method: 'POST', serialize: function(){
				  var data = new FormData();
				  data.append( 'id', args.employee.id );
				  data.append( '_method', 'delete' );
				  return data;
				} }).then( function(a){
					// Se ok reload
					window.reload(); } )

			} })

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

var HomePage = {
	view: function(ctrl, args) {
		return m('div', [
			m("#incluir-contato", "+"),
			m.component(Header, {
				text: 'Funcionários',
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
			])
		])
	}
}

var EmployeePage = {
	controller: function(args) {
		var ctrl = this;
		ctrl.employee = m.prop({});
		m.request({method: "GET", url: "http://10.0.0.111/contatos/"+m.route.param('Id')+".json"}).then( function(a) { ctrl.employee(a)  } )
	},
	view: function(ctrl, args) {
		return m('div', [
			m.component(Header, {
				text: 'Detalhes',
				back: true
			}),
			m('.card', [
				m('ul.table-view', [
					m('li.table-view-cell.media', [
						m('img.media-object.big.pull-left', {
							src: 'pics/undefined.jpg'
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
							m('.media-body', 'Call Office', [
								m('p', ctrl.employee().telefone)
							])
						])
					]),
					m('li.table-view-cell.media', [
						m('a.push-right', {
							href: 'sms:' + ctrl.employee().celular
						}, [
							m('span.media-object.pull-left.icon.icon-sms'),
							m('.media-body', 'SMS', [
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
					])
				])
			])
		])
	}
};

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
				ctrl.page(m.component(HomePage, {
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

m.route(document.body, '/', {
	'/': m.component(App, {
		service: employeeService
	}),
	'/employees/:Id': m.component(EmployeePage, {
		service: employeeService
	})
})
