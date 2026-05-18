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
En una región de fantasía, medieval y llena de magia se encuentra Lilith, una maga que lleva toda su vida viviendo en su pequeña aldea natal con sus abuelos. La vida allí es tranquila, llena de paz y seguridad. Pero Lilith ansía salir y explorar mundo. Tras una discusión con sus abuelos por su libertad, ellos entran en razón y le permiten que viva su vida a su manera. Así empieza su aventura y recorrido para convertirse en la mejor maga de la región. Durante su travesía, es asaltada por un ladrón que le roba un objeto muy valioso para ella y va tras él. Tras enfrentar un desafío que pone a prueba su fuerza e inteligencia consigue superarlo, recuperando su objeto y aprendiendo otro hechizo. Sin miedo, sigue avanzando y explorando, superando otras pruebas y adquiriendo mejoras y nuevas técnicas hasta que llega a la capital. En ese lugar descubrirá la liga mágica, un lugar donde los mejores magos se baten en duelo contra el campeón para ser el mejor de la región.
 ### 1.4 Características principales
- Explora las zonas y ciudades de la región mágica
- Colecciona grimorios para aprender nuevos hechizos y usarlos en combate contra enemigos.
- Resuelve puzzles para conseguir recompensas y superar las mazmorras.
- Estilo pixelart

<br>

## 2. Gameplay
### 2.1 Objetivo del juego
El objetivo del juego es ir aprendiendo hechizos de manera que al final seas el mejor hechicero de la región. Para conseguir los hechizos deberás pasar ciertas mazmorras que se encuentran en distintas zonas del mapa. Estas consisten en puzzles en los que el jugador interactúa con el entorno para resolverlo.

En cada zona habrá una mazmorra y un camino donde encontrar objetos y probar tus habilidades contra enemigos.

El juego termina al llegar a la última zona y vencer en la liga mágica o si se pierden todas las vidas, consultar sistema de vida
### 2.2 Core loops
   1. Ir a ruta siguiente
   2. Llegar a zona
   3. Buscar mazmorra
      <br> a. Resolver mazmorra
      <br> b. Conseguir hechizo nuevo

<br>

## 3. Mecánicas
### 3.1 Movimiento horizontal
El jugador se encarga de mover al personaje. Lilith se mueve a una velocidad constante de izquierda a derecha o viceversa. En el caso en el que llegue al límite de la pantalla tanto por la izquierda como por la derecha, se choca y deja de avanzar en esa dirección.
Parámetros:
- Velocidad horizontal: Velocidad (m/s) a la que se mueve el personaje.
### 3.2 Movimiento vertical
El jugador se encarga de mover al personaje. Lilith se mueve a una velocidad constante de arriba a abajo y viceversa. En el caso en el que llegue al límite de la pantalla tanto por arriba como por abajo, se choca y deja de avanzar en esa dirección.
Parámetros:
- Velocidad vertical: Velocidad (m/s) a la que se mueve el personaje.
### 3.2 Movimiento diagonal
El jugador se encarga de mover al personaje. Lilith se mueve a una velocidad constante en diagonal. En el caso en el que llegue al límite de la pantalla por cualquier lado se choca y deja de avanzar en esa dirección.
Parámetros:
- Velocidad diagonal: Velocidad (m/s) a la que se mueve el personaje.
### 3.3 Recolectar objetos
Lilith puede recoger los objetos, ya sea de los cofres (pulsando la tecla E) o de aquellos que se encuentre por el camino (pasando por encima de ellos).
### 3.4 Atacar / Usar hechizos
Para atacar a los enemigos o usar los hechizos de los que disponga se usará el botón izquierdo del ratón. Para apuntar hacia dónde lanzar el hechizo se usará el botón derecho del ratón.
### 3.5 Interactuar con NPCs
Lilith podrá hablar con los personajes que se encuentre por el camino acercándose a ellos y pulsando la tecla E. Aparecerá entonces un diálogo que el jugador podrá ir siguiendo y enterarse de la historia.
### 3.6 Empujar cosas
Para empujar los objetos que haya, por ejemplo las cajas de la mazmorra, bastará con ponerse en el lado opuesto del objeto hacia el que se quiera mover y desplazarse con los controles del movimiento vertical/horizontal. Se podrá utilizar tambien la tecla E para "arrastrar" el objeto.

<br>

## 4. Sistemas
### 4.1. Sistema de vida
El jugador tiene 3 corazones al iniciar el juego, a medida que avanza en la aventura puede encontrarse objetos que aumente los corazones totales del jugador en uno. Se perderá un cuarto, mitad o corazón entero cada vez que se reciba un ataque dependiendo del enemigo, si se pierde todos los corazones reaparecerá en la escena que ha muerto.
### 4.2. Sistema de estadísticas
Las armas tienen una serie de estadísticas que puede aumentar o disminuir el daño de ciertos hechizos.

<br>

## 5. Interfaz
### 5.1 Controles
- WASD Para movimiento multidireccional (en ejes cartesianos)
- E para interaccionar con NPC's, objetos y dialogos.
- 1,2,3... Para seleccionar el hechizo actual
- F para abrir el inventario


### 5.2 Cámara
Cámara top-down o cenital centrada en el protagonista.
### 5.3 HUD
El HUD contiene información sobre:
 - El numero de vidas del jugador
 - El numero de disparo del hechizo que el jugador está usando en el momento
 - Botón para cambiar a pantalla completa
 - Imagen del hechizo equipado

### 5.4 Menús
- Menú principal con la opción de iniciar el juego


<br>

## 6. Mundo del juego
### 6.1 Personajes
#### 6.1.1 Lilith
Lilith es la protagonista del juego y es la representación del jugador dentro del juego. Su comportamiento se describe en la sección de mecánicas. Las dimensiones de Lilith son de 17x26
#### 6.1.2 Enemigos
Dentro del juego hay varios tipos de enemigos que pueden matar al jugador.
##### 6.1.2.1 Oruga
Es el primer enemigo que encuentra el jugador. No se mueve pero si el jugador la toca, le quita un cuarto de vida. Estas orugas tienen 5 vidas y, cada vez que el jugador las ataca pierden 1 vida. El jugador podrá encontrarlas en varias zonas del juego.
##### 6.1.2.2 Rata
Es el segundo enemigo que aparece. Cuando el jugador entra en su campo de visión, empieza a perseguirle y, si le ataca, el jugador pierde un cuarto de vida. Las ratas tienen 5 vidas y, cada vez que el jugador las ataca pierden 1 vida. El jugador las podrá encontrar en varias zonas del juego.
##### 6.1.2.3 Jabalí
Es el boss final de la mazmorra. Se mueve aleatoriamente y, cuando ataca al jugador, este pierde 1 vida. Tiene un punto débil en la cabeza al que habrá que apuntar para poder hacerle daño. Este enemigo tiene 25 vidas y, cada vez que el jugador le da en el punto débil, pierde 1.
Cuando muere, aparece un cofre que contiene el hechizo de hielo que podrá utilizar en la zona del lago para llegar hasta el cofre de esa zona.
##### 6.1.2.4 Barril
Aparece en la cueva que hay en la entrada a la ciudad. Estos barriles se mueven en horizontal o vertical a velocidad constante y rebotando con las paredes. Si el jugador se choca con ellos, perderá tres cuartos de una vida. No podrá eliminarlos y, por tanto deberá tratar de esquivarlos.
##### 6.1.2.4 Avispas
Las avispas aparecen en la zona del laberinto de manera aleatoria en intervalos de tiempos aleatorios. El número máximo de avispas en la zona son 5. Persiguen al jugador en toda la zona, tienen 5 vidas y cada vez que el jugador las ataca pierden 1 vida.

### 6.2 Objetos
Dentro del juego hay varios objetos con los que el jugador puede interaccionar o usar.
   - Bayas curativas: son bayas que se guardarán en el inventario y, al usarlas, se recargará la vida del jugador en medio corazón. Si se utiliza con todas las vidas recargadas, no aumenta nada. Para recogerlas basta con pasar por encima.
   - Cofres: aparecen en varias zonas del juego y tendrán un objeto en su interior. Dependiendo de la zona en la que se encuentre el cofre, el jugador podrá obtener bayas curativas, 1 corazón extra o hechizos nuevos que podrá utilizar. Para interactuar con ellos, el jugador debe situarse delante del cofre y pulsar la tecla E.
   - Luminarias: aparecen en la cueva y ofrecen luz en la cueva ya que esta estará poco iluminada. Una vez que el jugador pasa por encima de ellas se ilumina la cueva por un tiempo de 10 segundos. Pasado ese tiempo, vuelve a estar oscuro.
   - Hechizos: sirven para hacer daño a los enemigos o interactuar con el entorno, como el hechizo del hielo que, además de ralentizar a los enemigos, puede usarse para formar un camino helado sobre el agua.

### 6.3 Zonas
El jugador recorrerá distintas zonas.
En las zonas de paso, deberá eliminar enemigos, recojer objetos o simplemente seguir el camino. 
Las mazmorras deberá resolverlas para poder obtener nuevos hechizos que ayudarán al jugador a conseguir otros objetos.
<br>

## 7. Estética
El juego es de estilo pixel-art de 16x16 pixeles. Está ambientado en un mundo fantástico tipo zelda.
<br>

## 8. Experiencia de juego
Para medir la experiencia del juego se realizó un play-test en el laboratorio con 8 compañeros de clase.
La versión del juego probada incluyó las siquientes zonas: 
	#####1. Pueblo (zona inicial) 
	#####2. Bosque donde aparecen las orugas por primera vez.
	#####3. Zona de las plataformas con las escaleras.
	#####4. Habitación inicial de la mazmorra donde se enseña la dinámica para resolver la mazmorra y abrir las puertas.
	#####5. Habitación grande de la mazmorra donde se encuentra a las ratas y debe mover las cajas debajo de las banderas.
	#####6. Habitación del cofre en la mazmorra donde consigues un corazón extra.
	#####7. Habitación del boss donde se enfrenta al jabalí y aparece un cofre con el hechizo del hielo cuando lo derrota.
	#####8. Zona del lago	
El proceso de prueba consistió en grabar la pantalla usando "OBS" y dejar que el jugador empezara a jugar. Hubo ocasiones en las que no sabían como disparar o cómo arrastrar las cajas y tuvimos que decirles los controles.
	
En este play-test el 100% de la gente resolvió la mazmorra.

Cambios realizados a partir de los comentarios realizados por los que jugaron:
- Ampliación de las entradas
- Simplificación de la mazmorra inicial. Ahora solo aparece la caja y la bandera que el jugador debe juntar para que se abra la puerta.
- Aumento de la dificultad en la mazmorra. Ahora aparecen tambien enemigos (ratas) a los que deberá enfrentarse para que sea más dinámico.
- Incorporación de una puerta en la habitación del boss de la mazmorra para que el jugador no tenga que volver a recorrer toda la mazmorra para poder salir. Ahora, cuando derrota al boss, se abre la puerta y el jugador puede salir a la zona donde está la entrada principal de la mazmorra.
- Escena de intro. Ahora la tecla para saltar la introducción es la tecla K en vez de la tecla de espacio.
- Simplificación de los mapas. Se han eliminado elementos como las setas que distraían al jugador o las flores en algunas zonas que sobrecargaban el mapa.
- Señalización de los objetos obtenidos en los cofres. Se ha añadido una animación para saber lo que el jugador ha obtenido del cofre.
- Incorporación del sprite para arrastrar cofres. Ahora el jugador sabe si está agarrando el cofre en la mazmorra.
- Modificación de la posición de algunos enemigos.
- Arreglo de los disparos. Ahora no atraviesan las paredes.
<br>

## 10. Herramientas de desarrollo
- Phaser: motor del videojuego
-Tiled: mapas
- GitHub: control de versiones
- Itch.io: assets
- Beepbox: composición de música
- jxfxr: efectos de sonidos
  
<br>

## 10. Referencias
	- The Legend of Zelda
	- Pokemon


