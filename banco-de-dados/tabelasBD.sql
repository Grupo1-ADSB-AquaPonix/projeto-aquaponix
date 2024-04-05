create database projeto;
use projeto;

create table usuario (
    idUsuario int primary key auto_increment,
    nome varchar(50) not null,
    email varchar(70) not null unique,
    cpf varchar(14) not null unique,
    telefone varchar(16) not null,
    senha varchar(40) not null
);

create table sensorTemperatura (
    idSensorTemperatura int primary key auto_increment,
    fkTanque int not null,
    temperaturaColetada varchar(10), -- perguntar qual seria o tipo ideal
    dtColeta datetime default current_timestamp
);

create table sensorLuminosidade (
    idSensorLuminosidade int primary key auto_increment,
    fkHorta int not null,
    luminosidadeColetada varchar(10), -- perguntar qual seria o tipo ideal
    dtColeta datetime default current_timestamp
);

create table tanque (
    idTanque int primary key auto_increment,
    qtdLitros int,
    qtdPeixes int
);

create table horta (
	idHorta int primary key auto_increment,
	nomeVegetal varchar(40),
    qtdPlantada int
);

insert into usuario values
(default, 'Ronaldo', 'ronaldo.fenomeno@gmail.com', '774.874.574-15', '11-955419758', 'ronaldo123'),
(default, 'Adalberto', 'adalberto.beto@gmail.com', '125.351.241-16', '11-925621262', 'betinho125'),
(default, 'Marcos', 'marcao777@gmail.com', '541.635.825-12', '11-974875223', 'marcasso78');

insert into sensorTemperatura values
(default, 1, '26.3', default),
(default, 2, '22.4', '2024-04-05 12:28:00');

insert into sensorLuminosidade values 
(default, 1, '320', default),
(default, 2, '460', '2024-04-05 12:25:00'),
(default, 3, '690', '2024-04-05 13:25:00');

insert into tanque values
(default, 1000, 25), 
(default, 1000, 27);

insert into horta values
(default, 'Alface', 10),
(default, 'Couve', 10),
(default, 'Quiabo', 10);

select * from usuario;
select * from horta;
select * from tanque;
select * from sensorTemperatura;
select * from sensorLuminosidade;
