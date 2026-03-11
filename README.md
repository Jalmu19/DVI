# GDD Enchantments

#### Equipo de desarrollo:
- Cecilia Martínez Rodado
- Abel Fáfula Domínguez
- Almudena García Navas
- Irene Rodríguez San Martín

<br>

## 1. Resumen
 ### 1.1 Descripción
Enchantments es un juego en el que el jugador será una maga aspirante a ser la mejor de su región. Para ello deberá aventurarse y superar los desafíos de las mazmorras que se encuentran repartidas en distintos lugares.  
 ### 1.2 Género
Acción-Aventura
 ### 1.3 Setting
 Lilith es una maga que tras descubrir un pasado mágico que tu familia te ha estado ocultando todo este tiempo decide salir para explorar más territorio a parte del bosque en el que vive. En el camino, una rata mágica le roba el mapa y tras recuperarlo decide ir a la [ciudad] . Allí descubrirá la liga mágica, un lugar donde los mejores magos y brujas se baten en duelo para ser la mejor de la región y alcanzar la gloria eterna, es entonces cuando descubre que ese era su destino todo este tiempo. Explorando las diversas zonas de la región,  Lilith aprenderá los hechizos más poderosos para poder hacer frente a la liga y cumplir así con su objetivo.
 ### 1.4 Características principales
- Explora las zonas y ciudades de la región mágica
- Colecciona grimorios para aprender nuevos hechizos y usarlos en combate contra enemigos.
- Resuelve puzzles para conseguir recompensas y superar las mazmorras.
- Estilo pixelart

<br>

## 2. Gameplay
### 2.1 Objetivo del juego
El objetivo del juego es ir aprendiendo hechizos de manera que al final seas el mejor hechicero del mundo. Para conseguir los hechizos deberás pasar ciertas mazmorras que se encuentran en distintas zonas del mapa. Estas consisten en puzzles en los que el jugador interactúa con el entorno para resolverlo.

En cada zona habrá una mazmorra y un camino donde encontrar objetos y probar tus habilidades contra enemigos.

El juego termina al llegar a la última zona y vencer en la liga mágica o si se pierden todas las vidas, consultar sistema de vida
### 2.2 Core loops
   1. Ir a ruta siguiente
   2. Llegar a zona
   3. Buscar mazmorra
      a. Resolver mazmorra
      b. Conseguir hechizo nuevo

<br>

## 3. Mecánicas
### 3.1 Movimiento horizontal
El jugador se encarga de mover al personaje. Lilith se mueve a una velocidad constante de izquierda a derecha o viceversa. En el caso en el que llegue al límite de la pantalla tanto por la izquierda como por la derecha, se choca y deja de avanzar en esa dirección.
Parámetros:
- Velocidad horizontal: Velocidad (m/s) a la que se mueve el personaje.
### 3.2 Movimiento vertical
El jugador se encarga de mover al personaje. Lilith se mueve a una velocidad constante de arriba a abajo y viceversa. En el caso en el que llegue al límite de la pantalla tanto por arriba como por abajo, se choca y deja de avanzar en esa dirección.
### 3.3 Recolectar objetos
Lilith puede recoger los objetos, ya sea de los cofres o de aquellos que se encuentre por el camino simplemente pasando por encima de ellos.
### 3.4 Atacar / Usar hechizos
Para atacar a los enemigos o usar los hechizos de los que disponga se usará el botón izquierdo del ratón. Para apuntar hacia dónde lanzar el hechizo se usará el botón derecho del ratón.
### 3.5 Interactuar con NPCs
Lilith podrá hablar con los personajes que se encuentre por el camino acercándose a ellos. Aparecerá un diálogo que el jugador podrá ir siguiendo y enterarse de la historia.
### 3.6 Empujar cosas
Para empujar los objetos que haya bastará con ponerse en el lado opuesto del objeto hacia el que se quiera mover y desplazarse con los controles del movimiento vertical/horizontal. Si el objeto cae en una esquina se reseteará la posición del objeto a la posición original.

<br>

## 4. Sistemas
### 4.1. Sistema de vida
El jugador tiene 3 corazones al iniciar el juego, a medida que avanza en la aventura puede encontrarse objetos que, al agrupar 2 de estos, aumente los corazones totales del jugador en uno. Se perderá un cuarto, mitad o corazón entero cada vez que se reciba un ataque dependiendo del enemigo, si se pierde todos los corazones en una mazmorra se reiniciará el juego desde fuera de ésta o en la zona más cercana si mueres en un camino.
### 4.2. Sistema de estadísticas
El jugador tendrá una serie de estadísticas que puede aumentar o disminuir dependiendo de los objetos que lleve equipados y de los hechizos que use.

<br>

## 5. Interfaz
### 5.1 Controles
- WASD Para movimiento multidireccional (en ejes cartesianos)
- Mantener click derecho del ratón -> Apuntar
- Click izquierdo del ratón -> lanzar hechizos
- Tabulador para abrir el menú de hechizos


### 5.2 Cámara
Cámara top-down o cenital centrada en el protagonista.
### 5.3 HUD
### 5.4 Menús

<br>

## 6. Mundo del juego
### 6.1 Personajes
#### 6.1.1 Lilith
Lilith es la protagonista del juego y es la representación del jugador dentro del juego. Su comportamiento se describe en la sección de mecánicas. Las dimensiones de Lilith son de 17x26
#### 6.1.2 Enemigos
Dentro del juego hay varios tipos de enemigos que pueden matar al jugador.
### 6.2 Objetos

### 6.3 Niveles


<br>

## 7. Estética y contenido

<br>

## 8. Experiencia de juego

<br>

## 9. Referencias
	- The Legend of Zelda
	- Pokemon


