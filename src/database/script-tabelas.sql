-- Arquivo de apoio, caso você queira criar tabelas como as aqui criadas para a API funcionar.
-- Você precisa executar os comandos no banco de dados para criar as tabelas,
-- ter este arquivo aqui não significa que a tabela em seu BD estará como abaixo!

/*
comandos para mysql server
*/
create database projeto;
use projeto;

create table endereco(
idEndereco int primary key auto_increment not null,
cep char(9) not null,
numero int not null,
complemento varchar(45) not null
);

create table empresa(
idEmpresa int primary key auto_increment not null,
razaoSocial varchar(45) not null,
cnpj char(18) unique not null,
telefoneCelular varchar(20),
telefoneFixo varchar(20),
senha varchar(30) not null,
fkEndereco int,
constraint fkEmpresaEndereco foreign key (fkEndereco)
	references endereco (idEndereco)
);

create table funcionario(
idFuncionario int,
fkEmpresa int,
constraint pkFuncionarioEmpresa primary key (idFuncionario, fkEmpresa),
nome varchar(45) not null,
email varchar(45) not null,
cpf char(11) unique not null,
telefoneCelular varchar(20),
senha varchar(30),
constraint fkFuncionarioEmpresa foreign key (fkEmpresa)
	references empresa (idEmpresa)
);

create table tipo_especie(
	idTipoEspecie int primary key auto_increment,
    tipo varchar(30),
    constraint chkTipoEspecie check (tipo in ('Peixe', 'Planta'))
);

create table local(
	idLocal int,
    constraint primary key(idLocal, fkEmpresa),
    tipo varchar(30) not null,
    constraint chkTipo check (tipo in ('Horta', 'Tanque')),
    qtdEspecie int not null,
    especie varchar(50) not null,
    ocupacaoMax int not null,
    fkTipoEspecie int not null,
    fkEmpresa int not null,
    constraint fkLocalEmpresa foreign key (fkEmpresa)
		references empresa (idEmpresa),
    constraint fkTipoLocal foreign key (fkTipoEspecie) 
		references tipo_especie (idTipoEspecie)
);

create table sensor(
	idSensor int,
    nome varchar(50),
    constraint chkNomeSensor check(nome in ('LDR', 'LM35')),
    tipo varchar(50),
    fkLocal int,
    fkEmpresa int,
    constraint primary key(idSensor, fkLocal, fkEmpresa)
);

create table dadosCapturados(
	idDado int,
	valor decimal(5,2),
    dtColeta datetime default current_timestamp,
    fkSensor int,
    fkLocal int,
    fkEmpresa int,
    constraint pkDadosSensores primary key (idDado, fkSensor, fkLocal, fkEmpresa)
);

insert into endereco values
(default, '18079-630', '155', 'Proximo ao mercado extra'),
(default, '29844-895', '812', 'Ao lado da concessionária');

insert into empresa values
(default, 'AquaCulture Connections', '27.480.347/0001-35', '11-955419758', '11-955419758', 'ronaldo123', 1),
(default, 'Sustainable AquaGrow', '66.835.460/0001-48', '11-925621262', '11-955419758', 'betinho125', 2);

insert into funcionario values
(1, 1, 'Pedro Rocha', 'pedroRocha@gmail.com', '12312312300', '11 90001-1234', '12345678'),
(2, 1, 'Gustavo Barreto', 'GustavoBarreto@gmail.com', '99999999999', '11 91234-4321', '987654321'),
(1, 2, 'Paula Fernandes', 'contato.Paula@gmail.com', '32132132199', '11 90909-8799', '147258369'),
(2, 2, 'Ronaldo', 'ronaldo.fenomeno@gmail.com', '22222288800', '11 97878-9874', '1010101010');

insert into tipo_especie values
	(null, 'Planta'),
    (null, 'Peixe');

insert into local values
	(1, 'Tanque', 25, 'Tilápia', '30', 2, 1),
	(2, 'Horta', 25, 'Alface', '30', 1, 1);
    
insert into sensor values
	(1, 'LM35', 'Temperatura', 1, 1),
	(2, 'LDR', 'Luminosidade', 2, 1);

insert into dadosCapturados values 
	(1, 27, '14:00:00', 1, 1, 1),
	(2, 25.5, '15:00:00', 1, 1, 1),
	(3, 26, '16:00:00', 1, 1, 1),
	(4, 24, '17:00:00', 1, 1, 1),
	(1, 280, '14:00:00', 2, 2, 1),
	(2, 300, '15:00:00', 2, 2, 1),
	(3, 310, '16:00:00', 2, 2, 1),
	(4, 320, '17:00:00', 2, 2, 1);

select * from empresa;
select * from sensor;
select * from funcionario;
select * from tipo_especie;
select * from endereco;
select * from dadosCapturados;
select * from local;

-- Select para ver quais funcionários trabalham em quais empresas
  
select empresa.idEmpresa as IDEmpresa, 
	empresa.razaoSocial as Empresa,
	empresa.cnpj as CNPJ,
    funcionario.idFuncionario as IDFuncionario,
    funcionario.nome as Funcionario,
    funcionario.email as 'Email Funcionario',
    funcionario.telefoneCelular as 'Telefone Funcionário'
    from empresa join funcionario
    on empresa.idEmpresa = funcionario.fkEmpresa;