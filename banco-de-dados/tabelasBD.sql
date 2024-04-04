create database projeto;
use projeto;

create table usuario (
    idUsuario int primary key auto_increment,
    nome varchar(50) not null,
    email varchar(70) not null unique,
    cpf varchar(14) not null unique,
    telefone varchar(16) not null,
    senha varchar(40)
);

create table sensorTemperatura (
    idSensor int primary key auto_increment,
    fkTanque int,
    fkHorta int,
    temperaturaColetada int
);

create table sensorLuminosidade (
    idSensor int primary key auto_increment,
    fkHorta int not null,
    luminosidadeColetada int
);

create table tanque (
    idTanque int primary key auto_increment,
    qtdLitros int,
    qtdPeixes int,
    fkTemperaturaAgua int
);

create table horta (
	idHorta int primary key auto_increment,
	nomeVegetal varchar(40),
    qtdPes int,
	fkLuminosidade int	
);