-- Concedir permisos de lectura i escriptura a l'usuari 'server' per a totes les bases de dades
GRANT SELECT, INSERT, UPDATE ON *.* TO 'server'@'%';

-- Actualitzar els privilegis per assegurar-se que tenen efecte immediatament
FLUSH PRIVILEGES;

