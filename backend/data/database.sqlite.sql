BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "equipo" (
	"id"	INTEGER,
	"nombre"	TEXT,
	"logo"	TEXT,
	PRIMARY KEY("id")
);
CREATE TABLE IF NOT EXISTS "cuartos" (
	"id"	INTEGER,
	"partido1"	INTEGER,
	"partido2"	INTEGER,
	"partido3"	INTEGER,
	"partido4"	INTEGER,
	FOREIGN KEY("partido4") REFERENCES "partido"("id"),
	FOREIGN KEY("partido3") REFERENCES "partido"("id"),
	FOREIGN KEY("partido1") REFERENCES "partido"("id"),
	FOREIGN KEY("partido2") REFERENCES "partido"("id"),
	PRIMARY KEY("id")
);
CREATE TABLE IF NOT EXISTS "semifinales" (
	"id"	INTEGER,
	"partido1"	INTEGER,
	"partido2"	INTEGER,
	FOREIGN KEY("partido1") REFERENCES "partido"("id"),
	FOREIGN KEY("partido2") REFERENCES "partido"("id"),
	PRIMARY KEY("id")
);
CREATE TABLE IF NOT EXISTS "finales" (
	"id"	INTEGER,
	"partido1"	INTEGER,
	FOREIGN KEY("partido1") REFERENCES "partido"("id"),
	PRIMARY KEY("id")
);
CREATE TABLE IF NOT EXISTS "usuarios" (
	"id"	INTEGER,
	"nombre"	TEXT NOT NULL,
	"correo"	TEXT NOT NULL UNIQUE,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "torneo" (
	"id"	INTEGER,
	"cuartosId"	INTEGER,
	"semifinalesId"	INTEGER,
	"finalesId"	INTEGER,
	"isCurrent"	INTEGER,
	FOREIGN KEY("semifinalesId") REFERENCES "semifinales"("id"),
	FOREIGN KEY("cuartosId") REFERENCES "cuartos"("id"),
	FOREIGN KEY("finalesId") REFERENCES "finales"("id"),
	PRIMARY KEY("id")
);
CREATE TABLE IF NOT EXISTS "partido" (
	"id"	INTEGER,
	"resultado90L"	INTEGER DEFAULT 0,
	"resultado90V"	INTEGER DEFAULT 0,
	"resultado120L"	INTEGER DEFAULT 0,
	"resultado120V"	INTEGER DEFAULT 0,
	"resultadoPL"	INTEGER DEFAULT 0,
	"resultadoPV"	INTEGER DEFAULT 0,
	"teamL"	INTEGER,
	"teamV"	INTEGER,
	"isDone"	INTEGER DEFAULT 0,
	FOREIGN KEY("teamL") REFERENCES "equipo"("id"),
	FOREIGN KEY("teamV") REFERENCES "equipo"("id"),
	PRIMARY KEY("id")
);
CREATE TABLE IF NOT EXISTS "titulo" (
	"id"	INTEGER,
	"equipo"	INTEGER,
	PRIMARY KEY("id"),
	FOREIGN KEY("equipo") REFERENCES "equipo"("id")
);
INSERT INTO "equipo" ("id","nombre","logo") VALUES (1,'River Plate','./assets/images/river plate.png');
INSERT INTO "equipo" ("id","nombre","logo") VALUES (2,'Boca Jrs','./assets/images/boca juniors.png');
INSERT INTO "equipo" ("id","nombre","logo") VALUES (3,'Independiente','./assets/images/independiente.png');
INSERT INTO "equipo" ("id","nombre","logo") VALUES (4,'Racing Club','./assets/images/racing.png');
INSERT INTO "equipo" ("id","nombre","logo") VALUES (5,'San Lorenzo','./assets/images/san lorenzo.png');
INSERT INTO "equipo" ("id","nombre","logo") VALUES (6,'Barcelona FC','./assets/images/barcelona.png');
INSERT INTO "equipo" ("id","nombre","logo") VALUES (7,'Real Madrid','./assets/images/real madrid.png');
INSERT INTO "equipo" ("id","nombre","logo") VALUES (8,'Chelsea FC','./assets/images/chelsea.png');
INSERT INTO "equipo" ("id","nombre","logo") VALUES (9,'Manchester City','./assets/images/manchester city.png');
INSERT INTO "equipo" ("id","nombre","logo") VALUES (10,'Manchester United','./assets/images/manchester united.png');
INSERT INTO "equipo" ("id","nombre","logo") VALUES (11,'Paris Saint Germain','./assets/images/psg.png');
INSERT INTO "equipo" ("id","nombre","logo") VALUES (12,'Bayern Munich','./assets/images/bayern.png');
INSERT INTO "equipo" ("id","nombre","logo") VALUES (13,'Juventus','./assets/images/juventus.png');
INSERT INTO "equipo" ("id","nombre","logo") VALUES (14,'Inter de Milan','./assets/images/inter.png');
INSERT INTO "equipo" ("id","nombre","logo") VALUES (15,'Milan AC','./assets/images/milan.png');
INSERT INTO "cuartos" ("id","partido1","partido2","partido3","partido4") VALUES (1,1,2,3,4);
INSERT INTO "cuartos" ("id","partido1","partido2","partido3","partido4") VALUES (2,8,9,10,11);
INSERT INTO "cuartos" ("id","partido1","partido2","partido3","partido4") VALUES (3,15,16,17,18);
INSERT INTO "cuartos" ("id","partido1","partido2","partido3","partido4") VALUES (4,22,23,24,25);
INSERT INTO "cuartos" ("id","partido1","partido2","partido3","partido4") VALUES (5,29,30,31,32);
INSERT INTO "cuartos" ("id","partido1","partido2","partido3","partido4") VALUES (6,36,37,38,39);
INSERT INTO "cuartos" ("id","partido1","partido2","partido3","partido4") VALUES (7,43,44,45,46);
INSERT INTO "cuartos" ("id","partido1","partido2","partido3","partido4") VALUES (8,50,51,52,53);
INSERT INTO "cuartos" ("id","partido1","partido2","partido3","partido4") VALUES (9,57,58,59,60);
INSERT INTO "semifinales" ("id","partido1","partido2") VALUES (1,5,6);
INSERT INTO "semifinales" ("id","partido1","partido2") VALUES (2,12,13);
INSERT INTO "semifinales" ("id","partido1","partido2") VALUES (3,19,20);
INSERT INTO "semifinales" ("id","partido1","partido2") VALUES (4,26,27);
INSERT INTO "semifinales" ("id","partido1","partido2") VALUES (5,33,34);
INSERT INTO "semifinales" ("id","partido1","partido2") VALUES (6,40,41);
INSERT INTO "semifinales" ("id","partido1","partido2") VALUES (7,47,48);
INSERT INTO "semifinales" ("id","partido1","partido2") VALUES (8,54,55);
INSERT INTO "semifinales" ("id","partido1","partido2") VALUES (9,61,62);
INSERT INTO "finales" ("id","partido1") VALUES (1,7);
INSERT INTO "finales" ("id","partido1") VALUES (2,14);
INSERT INTO "finales" ("id","partido1") VALUES (3,21);
INSERT INTO "finales" ("id","partido1") VALUES (4,28);
INSERT INTO "finales" ("id","partido1") VALUES (5,35);
INSERT INTO "finales" ("id","partido1") VALUES (6,42);
INSERT INTO "finales" ("id","partido1") VALUES (7,49);
INSERT INTO "finales" ("id","partido1") VALUES (8,56);
INSERT INTO "finales" ("id","partido1") VALUES (9,63);
INSERT INTO "torneo" ("id","cuartosId","semifinalesId","finalesId","isCurrent") VALUES (1,1,1,1,0);
INSERT INTO "torneo" ("id","cuartosId","semifinalesId","finalesId","isCurrent") VALUES (2,2,2,2,0);
INSERT INTO "torneo" ("id","cuartosId","semifinalesId","finalesId","isCurrent") VALUES (3,3,3,3,0);
INSERT INTO "torneo" ("id","cuartosId","semifinalesId","finalesId","isCurrent") VALUES (4,4,4,4,0);
INSERT INTO "torneo" ("id","cuartosId","semifinalesId","finalesId","isCurrent") VALUES (5,5,5,5,0);
INSERT INTO "torneo" ("id","cuartosId","semifinalesId","finalesId","isCurrent") VALUES (6,6,6,6,0);
INSERT INTO "torneo" ("id","cuartosId","semifinalesId","finalesId","isCurrent") VALUES (7,7,7,7,0);
INSERT INTO "torneo" ("id","cuartosId","semifinalesId","finalesId","isCurrent") VALUES (8,8,8,8,0);
INSERT INTO "torneo" ("id","cuartosId","semifinalesId","finalesId","isCurrent") VALUES (9,9,9,9,1);
INSERT INTO "partido" ("id","resultado90L","resultado90V","resultado120L","resultado120V","resultadoPL","resultadoPV","teamL","teamV","isDone") VALUES (1,2,2,0,1,0,0,2,5,1);
INSERT INTO "partido" ("id","resultado90L","resultado90V","resultado120L","resultado120V","resultadoPL","resultadoPV","teamL","teamV","isDone") VALUES (2,3,0,0,0,0,0,13,6,1);
INSERT INTO "partido" ("id","resultado90L","resultado90V","resultado120L","resultado120V","resultadoPL","resultadoPV","teamL","teamV","isDone") VALUES (3,0,0,0,0,5,4,9,10,1);
INSERT INTO "partido" ("id","resultado90L","resultado90V","resultado120L","resultado120V","resultadoPL","resultadoPV","teamL","teamV","isDone") VALUES (4,1,0,0,0,0,0,1,14,1);
INSERT INTO "partido" ("id","resultado90L","resultado90V","resultado120L","resultado120V","resultadoPL","resultadoPV","teamL","teamV","isDone") VALUES (5,2,1,0,0,0,0,5,13,1);
INSERT INTO "partido" ("id","resultado90L","resultado90V","resultado120L","resultado120V","resultadoPL","resultadoPV","teamL","teamV","isDone") VALUES (6,0,5,0,0,0,0,9,1,1);
INSERT INTO "partido" ("id","resultado90L","resultado90V","resultado120L","resultado120V","resultadoPL","resultadoPV","teamL","teamV","isDone") VALUES (7,0,0,0,1,0,0,5,1,1);
INSERT INTO "partido" ("id","resultado90L","resultado90V","resultado120L","resultado120V","resultadoPL","resultadoPV","teamL","teamV","isDone") VALUES (8,1,0,0,0,0,0,15,9,1);
INSERT INTO "partido" ("id","resultado90L","resultado90V","resultado120L","resultado120V","resultadoPL","resultadoPV","teamL","teamV","isDone") VALUES (9,1,2,0,0,0,0,11,10,1);
INSERT INTO "partido" ("id","resultado90L","resultado90V","resultado120L","resultado120V","resultadoPL","resultadoPV","teamL","teamV","isDone") VALUES (10,1,4,0,0,0,0,12,8,1);
INSERT INTO "partido" ("id","resultado90L","resultado90V","resultado120L","resultado120V","resultadoPL","resultadoPV","teamL","teamV","isDone") VALUES (11,2,0,0,0,0,0,7,14,1);
INSERT INTO "partido" ("id","resultado90L","resultado90V","resultado120L","resultado120V","resultadoPL","resultadoPV","teamL","teamV","isDone") VALUES (12,0,0,0,0,4,2,15,10,1);
INSERT INTO "partido" ("id","resultado90L","resultado90V","resultado120L","resultado120V","resultadoPL","resultadoPV","teamL","teamV","isDone") VALUES (13,0,2,0,0,0,0,8,7,1);
INSERT INTO "partido" ("id","resultado90L","resultado90V","resultado120L","resultado120V","resultadoPL","resultadoPV","teamL","teamV","isDone") VALUES (14,0,2,0,0,0,0,15,7,1);
INSERT INTO "partido" ("id","resultado90L","resultado90V","resultado120L","resultado120V","resultadoPL","resultadoPV","teamL","teamV","isDone") VALUES (15,2,0,0,0,0,0,14,4,1);
INSERT INTO "partido" ("id","resultado90L","resultado90V","resultado120L","resultado120V","resultadoPL","resultadoPV","teamL","teamV","isDone") VALUES (16,1,0,0,0,0,0,6,2,1);
INSERT INTO "partido" ("id","resultado90L","resultado90V","resultado120L","resultado120V","resultadoPL","resultadoPV","teamL","teamV","isDone") VALUES (17,30,0,0,0,0,0,1,3,1);
INSERT INTO "partido" ("id","resultado90L","resultado90V","resultado120L","resultado120V","resultadoPL","resultadoPV","teamL","teamV","isDone") VALUES (18,4,0,0,0,0,0,5,10,1);
INSERT INTO "partido" ("id","resultado90L","resultado90V","resultado120L","resultado120V","resultadoPL","resultadoPV","teamL","teamV","isDone") VALUES (19,2,0,0,0,0,0,14,6,1);
INSERT INTO "partido" ("id","resultado90L","resultado90V","resultado120L","resultado120V","resultadoPL","resultadoPV","teamL","teamV","isDone") VALUES (20,2,0,0,0,0,0,1,5,1);
INSERT INTO "partido" ("id","resultado90L","resultado90V","resultado120L","resultado120V","resultadoPL","resultadoPV","teamL","teamV","isDone") VALUES (21,0,3,0,0,0,0,14,1,1);
INSERT INTO "partido" ("id","resultado90L","resultado90V","resultado120L","resultado120V","resultadoPL","resultadoPV","teamL","teamV","isDone") VALUES (22,0,1,0,0,0,0,14,3,1);
INSERT INTO "partido" ("id","resultado90L","resultado90V","resultado120L","resultado120V","resultadoPL","resultadoPV","teamL","teamV","isDone") VALUES (23,0,3,0,0,0,0,9,10,1);
INSERT INTO "partido" ("id","resultado90L","resultado90V","resultado120L","resultado120V","resultadoPL","resultadoPV","teamL","teamV","isDone") VALUES (24,0,0,0,0,0,2,15,13,1);
INSERT INTO "partido" ("id","resultado90L","resultado90V","resultado120L","resultado120V","resultadoPL","resultadoPV","teamL","teamV","isDone") VALUES (25,0,0,0,0,0,2,11,12,1);
INSERT INTO "partido" ("id","resultado90L","resultado90V","resultado120L","resultado120V","resultadoPL","resultadoPV","teamL","teamV","isDone") VALUES (26,1,0,0,0,0,0,3,10,1);
INSERT INTO "partido" ("id","resultado90L","resultado90V","resultado120L","resultado120V","resultadoPL","resultadoPV","teamL","teamV","isDone") VALUES (27,0,2,0,0,0,0,13,12,1);
INSERT INTO "partido" ("id","resultado90L","resultado90V","resultado120L","resultado120V","resultadoPL","resultadoPV","teamL","teamV","isDone") VALUES (28,1,0,0,0,0,0,3,12,1);
INSERT INTO "partido" ("id","resultado90L","resultado90V","resultado120L","resultado120V","resultadoPL","resultadoPV","teamL","teamV","isDone") VALUES (29,0,1,0,0,0,0,2,1,1);
INSERT INTO "partido" ("id","resultado90L","resultado90V","resultado120L","resultado120V","resultadoPL","resultadoPV","teamL","teamV","isDone") VALUES (30,2,0,0,0,0,0,14,13,1);
INSERT INTO "partido" ("id","resultado90L","resultado90V","resultado120L","resultado120V","resultadoPL","resultadoPV","teamL","teamV","isDone") VALUES (31,0,2,0,0,0,0,9,6,1);
INSERT INTO "partido" ("id","resultado90L","resultado90V","resultado120L","resultado120V","resultadoPL","resultadoPV","teamL","teamV","isDone") VALUES (32,3,0,0,0,0,0,5,10,1);
INSERT INTO "partido" ("id","resultado90L","resultado90V","resultado120L","resultado120V","resultadoPL","resultadoPV","teamL","teamV","isDone") VALUES (33,1,0,0,0,0,0,1,14,1);
INSERT INTO "partido" ("id","resultado90L","resultado90V","resultado120L","resultado120V","resultadoPL","resultadoPV","teamL","teamV","isDone") VALUES (34,0,2,0,0,0,0,6,5,1);
INSERT INTO "partido" ("id","resultado90L","resultado90V","resultado120L","resultado120V","resultadoPL","resultadoPV","teamL","teamV","isDone") VALUES (35,3,0,0,0,0,0,1,5,1);
INSERT INTO "partido" ("id","resultado90L","resultado90V","resultado120L","resultado120V","resultadoPL","resultadoPV","teamL","teamV","isDone") VALUES (36,0,3,0,0,0,0,12,15,1);
INSERT INTO "partido" ("id","resultado90L","resultado90V","resultado120L","resultado120V","resultadoPL","resultadoPV","teamL","teamV","isDone") VALUES (37,0,2,0,0,0,0,8,7,1);
INSERT INTO "partido" ("id","resultado90L","resultado90V","resultado120L","resultado120V","resultadoPL","resultadoPV","teamL","teamV","isDone") VALUES (38,2,0,0,0,0,0,3,2,1);
INSERT INTO "partido" ("id","resultado90L","resultado90V","resultado120L","resultado120V","resultadoPL","resultadoPV","teamL","teamV","isDone") VALUES (39,0,1,0,0,0,0,11,4,1);
INSERT INTO "partido" ("id","resultado90L","resultado90V","resultado120L","resultado120V","resultadoPL","resultadoPV","teamL","teamV","isDone") VALUES (40,2,0,0,0,0,0,15,7,1);
INSERT INTO "partido" ("id","resultado90L","resultado90V","resultado120L","resultado120V","resultadoPL","resultadoPV","teamL","teamV","isDone") VALUES (41,1,0,0,0,0,0,3,4,1);
INSERT INTO "partido" ("id","resultado90L","resultado90V","resultado120L","resultado120V","resultadoPL","resultadoPV","teamL","teamV","isDone") VALUES (42,2,0,0,0,0,0,15,3,1);
INSERT INTO "partido" ("id","resultado90L","resultado90V","resultado120L","resultado120V","resultadoPL","resultadoPV","teamL","teamV","isDone") VALUES (43,2,2,0,0,3,2,3,7,1);
INSERT INTO "partido" ("id","resultado90L","resultado90V","resultado120L","resultado120V","resultadoPL","resultadoPV","teamL","teamV","isDone") VALUES (44,4,3,0,0,0,0,14,1,1);
INSERT INTO "partido" ("id","resultado90L","resultado90V","resultado120L","resultado120V","resultadoPL","resultadoPV","teamL","teamV","isDone") VALUES (45,2,3,0,0,0,0,6,10,1);
INSERT INTO "partido" ("id","resultado90L","resultado90V","resultado120L","resultado120V","resultadoPL","resultadoPV","teamL","teamV","isDone") VALUES (46,2,0,0,0,0,0,15,11,1);
INSERT INTO "partido" ("id","resultado90L","resultado90V","resultado120L","resultado120V","resultadoPL","resultadoPV","teamL","teamV","isDone") VALUES (47,0,1,0,0,0,0,3,14,1);
INSERT INTO "partido" ("id","resultado90L","resultado90V","resultado120L","resultado120V","resultadoPL","resultadoPV","teamL","teamV","isDone") VALUES (48,1,2,0,0,0,0,10,15,1);
INSERT INTO "partido" ("id","resultado90L","resultado90V","resultado120L","resultado120V","resultadoPL","resultadoPV","teamL","teamV","isDone") VALUES (49,1,2,0,0,0,0,14,15,1);
INSERT INTO "partido" ("id","resultado90L","resultado90V","resultado120L","resultado120V","resultadoPL","resultadoPV","teamL","teamV","isDone") VALUES (50,1,0,0,0,0,0,9,10,1);
INSERT INTO "partido" ("id","resultado90L","resultado90V","resultado120L","resultado120V","resultadoPL","resultadoPV","teamL","teamV","isDone") VALUES (51,0,2,0,0,0,0,5,14,1);
INSERT INTO "partido" ("id","resultado90L","resultado90V","resultado120L","resultado120V","resultadoPL","resultadoPV","teamL","teamV","isDone") VALUES (52,2,2,2,0,0,0,2,13,1);
INSERT INTO "partido" ("id","resultado90L","resultado90V","resultado120L","resultado120V","resultadoPL","resultadoPV","teamL","teamV","isDone") VALUES (53,0,3,0,0,0,0,6,1,1);
INSERT INTO "partido" ("id","resultado90L","resultado90V","resultado120L","resultado120V","resultadoPL","resultadoPV","teamL","teamV","isDone") VALUES (54,2,0,0,0,0,0,9,14,1);
INSERT INTO "partido" ("id","resultado90L","resultado90V","resultado120L","resultado120V","resultadoPL","resultadoPV","teamL","teamV","isDone") VALUES (55,1,2,0,0,0,0,2,1,1);
INSERT INTO "partido" ("id","resultado90L","resultado90V","resultado120L","resultado120V","resultadoPL","resultadoPV","teamL","teamV","isDone") VALUES (56,0,3,0,0,0,0,9,1,1);
INSERT INTO "partido" ("id","resultado90L","resultado90V","resultado120L","resultado120V","resultadoPL","resultadoPV","teamL","teamV","isDone") VALUES (57,0,0,0,0,0,0,15,12,0);
INSERT INTO "partido" ("id","resultado90L","resultado90V","resultado120L","resultado120V","resultadoPL","resultadoPV","teamL","teamV","isDone") VALUES (58,0,0,0,0,0,0,8,6,0);
INSERT INTO "partido" ("id","resultado90L","resultado90V","resultado120L","resultado120V","resultadoPL","resultadoPV","teamL","teamV","isDone") VALUES (59,0,0,0,0,0,0,11,10,0);
INSERT INTO "partido" ("id","resultado90L","resultado90V","resultado120L","resultado120V","resultadoPL","resultadoPV","teamL","teamV","isDone") VALUES (60,0,0,0,0,0,0,7,14,0);
INSERT INTO "partido" ("id","resultado90L","resultado90V","resultado120L","resultado120V","resultadoPL","resultadoPV","teamL","teamV","isDone") VALUES (61,0,0,0,0,0,0,NULL,NULL,0);
INSERT INTO "partido" ("id","resultado90L","resultado90V","resultado120L","resultado120V","resultadoPL","resultadoPV","teamL","teamV","isDone") VALUES (62,0,0,0,0,0,0,NULL,NULL,0);
INSERT INTO "partido" ("id","resultado90L","resultado90V","resultado120L","resultado120V","resultadoPL","resultadoPV","teamL","teamV","isDone") VALUES (63,0,0,0,0,0,0,NULL,NULL,0);
INSERT INTO "titulo" ("id","equipo") VALUES (1,1);
INSERT INTO "titulo" ("id","equipo") VALUES (2,7);
INSERT INTO "titulo" ("id","equipo") VALUES (3,1);
INSERT INTO "titulo" ("id","equipo") VALUES (4,1);
INSERT INTO "titulo" ("id","equipo") VALUES (5,3);
INSERT INTO "titulo" ("id","equipo") VALUES (6,1);
INSERT INTO "titulo" ("id","equipo") VALUES (7,15);
INSERT INTO "titulo" ("id","equipo") VALUES (8,15);
INSERT INTO "titulo" ("id","equipo") VALUES (9,1);
COMMIT;
