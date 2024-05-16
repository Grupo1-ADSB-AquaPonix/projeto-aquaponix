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

create table tanque(
idTanque int,
fkEmpresa int,
constraint pkTanqueEmpresa primary key (idTanque, fkEmpresa),
qtdLitros int not null,
qtdPeixes int not null,
constraint fkTanqueEmpresa foreign key (fkEmpresa)
	references empresa (idEmpresa)
);

create table horta(
idHorta int,
fkTanque int,
fkEmpresa int,
constraint pkHortaTanque primary key (idHorta, fkTanque, fkEmpresa),
nomeVegetal varchar(40) not null,
qtdPlantada int not null,
constraint fkHortaTanque foreign key (fkTanque)
	references tanque(idTanque),
constraint fkHortaEmpresa foreign key (fkEmpresa)
	references empresa(idEmpresa)
);

create table sensor(
idSensor int primary key auto_increment not null,
nome varchar(4) not null,
constraint chkNomeSensor check (nome in('LM35', 'LDR')),
tipo varchar(12) not null,
constraint chkTipoSensor check (tipo in('Temperatura', 'Luminosidade')),
fkTanque int,
constraint fkTanqueSensor foreign key (fkTanque)
	references tanque (idTanque),
fkHorta int,
constraint fkHortaSensor foreign key (fkHorta)
	references horta(idHorta)
);

create table dados(
idDado int,
fkSensor int, 
constraint pkDadosSensor primary key (idDado, fkSensor),
temperatura float,
luminosidade int,
dtColeta datetime,
constraint fkDadosSensor foreign key (fkSensor)
	references sensor (idSensor)
);

insert into endereco values
(default, '18079-630', '155', 'Proximo ao mercado extra'),
(default, '29844-895', '812', 'Ao lado da concessionária'),
(default, '54897-544', '411', 'Em frente do Burguer King');

insert into empresa values
(default, 'AquaCulture Connections', '27.480.347/0001-35', '11-955419758', '11-955419758', 'ronaldo123', 1),
(default, 'Sustainable AquaGrow', '66.835.460/0001-48', '11-925621262', '11-955419758', 'betinho125', 2),
(default, 'AquaVida Solutions', '85.740.687/0001-54', '11-974875223', '11-955419758', 'marcasso78', 3);

insert into funcionario values
(1, 1, 'Pedro Rocha', 'pedroRocha@gmail.com', '12312312300', '11 90001-1234', '12345678'),
(2, 1, 'Gustavo Barreto', 'GustavoBarreto@gmail.com', '99999999999', '11 91234-4321', '987654321'),
(1, 2, 'Paula Fernandes', 'contato.Paula@gmail.com', '32132132199', '11 90909-8799', '147258369'),
(1, 3, 'Ronaldo', 'ronaldo.fenomeno@gmail.com', '22222288800', '11 97878-9874', '1010101010');

insert into tanque values 
(1, 1, 1000, 35),
(2, 1, 1000, 30),
(1, 2, 1500, 45),
(2, 2, 1500, 45),
(1, 3, 1500, 45);

insert into horta values
(1, 1, 1, 'Alface', 20),
(1, 2, 1, 'Couve', 25),
(1, 1, 2, 'Coentro', 20),
(1, 2, 2, 'Coentro', 20),
(1, 1, 3, 'Coentro', 20);

insert into sensor(nome, tipo, fkTanque) values
('LM35', 'Temperatura', 1),
('LM35', 'Temperatura', 2),
('LM35', 'Temperatura', 3);
            
insert into sensor(nome, tipo, fkTanque, fkHorta) values
('LDR', 'Luminosidade', 1, 1),
('LDR', 'Luminosidade', 2, 1),
('LDR', 'Luminosidade', 3, 1);
          
insert into dados values 
(1, 1, 16.5, 47, '2024-04-19 20:00:00'),
(1, 2, 18.5, 62, '2024-04-19 20:00:00'),
(1, 3, 19.5, 59, '2024-04-19 20:00:00'),
(2, 1, 17.5, 53, '2024-04-19 21:00:00'),
(2, 2, 18, 54, '2024-04-19 21:00:00'),
(2, 3, 18.5, 50, '2024-04-19 21:00:00'),
(3, 1, 15.5, 47, '2024-04-19 22:00:00'),
(3, 2, 16, 43, '2024-04-19 22:00:00'),
(3, 3, 15.5, 49, '2024-04-19 22:00:00');

select * from empresa;
select * from tanque;
select * from horta;
select * from sensor;
select * from funcionario;
select * from dados;