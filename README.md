[![Issue Stats](http://issuestats.com/github/JoseVte/tfg-recetarium-angularjs/badge/pr?style=flat)](http://issuestats.com/github/JoseVte/tfg-recetarium-angularjs)
[![Issue Stats](http://issuestats.com/github/JoseVte/tfg-recetarium-angularjs/badge/issue?style=flat)](http://issuestats.com/github/JoseVte/tfg-recetarium-angularjs)
[![Build Status](https://travis-ci.org/JoseVte/tfg-recetarium-angularjs.png)](https://travis-ci.org/JoseVte/tfg-recetarium-angularjs)

[Gulp ![npm version](https://badge.fury.io/js/gulp.svg)](https://badge.fury.io/js/gulp)
[Bower ![npm version](https://badge.fury.io/js/bower.svg)](https://badge.fury.io/js/bower)
[Http-Server ![npm version](https://badge.fury.io/js/http-server.svg)](https://badge.fury.io/js/http-server)

![logo](app/img/header-logo-light.png)

Front-end en AngularJS para el API Rest de [Recetarium](https://github.com/JoseVte/tfg-recetarium)

## Instalación

### Desarrollo

###### Descargar Node

- La aplicacion se ha desarrollado usando `npm`, [node package manager][npm].
- Para instalar todas las dependencias de Node basta con ejecutar:
```
npm install
```

###### Descargar Bower

- Para instalar todas las librerias de AngularJS se ha usado `bower`, [client-side code package manager][bower].
- El **script** `npm install` tiene un comando que instala todas las dependencias de **bower**, pero si necesitas instalarlas a mano ejecuta:
```
bower install
```

###### Crear los assets

- Para crear los assets se necesita otra herramienta de Node, `gulp`.
- Con solo ejecutar `gulp` se crean todos los assets necesarios, pero si se quiere minimizarlos se tiene que ejecutar `gulp --production`.

###### Ejecución de la APP

El proyecto tiene preconfigurado un servidor local de desarrollo. Es una herramienta de Node llamada  [http-server][http-server].
Puedes iniciar el **webserver** con `npm start` si lo instalas globalmente:
```
sudo npm install -g http-server
```
Una vez instalado, puedes iniciar tu propio **webserver** ejecutando:
```
http-server -a localhost -p 8000
```

## Changelog

#### [![0.8.3](/app/doc/rocket-blue.png) 0.8.3](https://github.com/JoseVte/tfg-recetarium-angularjs/releases/tag/0.8.3)

- Recargar el JWT cada 30 minutos si se ha marcado la opcion de 'Recordar'

###### [![0.8.2](/app/doc/release.png) 0.8.2](https://github.com/JoseVte/tfg-recetarium-angularjs/releases/tag/0.8.2)

- Menus desplegables
- Buscar usuarios y amigos

###### [![0.8.1](/app/doc/release.png) 0.8.1](https://github.com/JoseVte/tfg-recetarium-angularjs/releases/tag/0.8.1)

- Ver tus amigos en el perfil
- Ver los amigos de otros en su perfil
- Añadir y borrar amigos mediante botones

###### [![0.7.3](/app/doc/release.png) 0.7.3](https://github.com/JoseVte/tfg-recetarium-angularjs/releases/tag/0.7.3)

- Seccion de usuarios WIP

###### [![0.7.2](/app/doc/release.png) 0.7.2](https://github.com/JoseVte/tfg-recetarium-angularjs/releases/tag/0.7.2)

- Cambiados los 'ng-click' por 'ng-href' para poder utilizar el context menu del navegador

###### [![0.7.1](/app/doc/release.png) 0.7.1](https://github.com/JoseVte/tfg-recetarium-angularjs/releases/tag/0.7.1)

- Ver las recetas en el perfil

###### [![0.6.3](/app/doc/release.png) 0.6.3](https://github.com/JoseVte/tfg-recetarium-angularjs/releases/tag/0.6.3)

- Compartir recetas
- Cambiado estilo del modal de puntuación
- Gravatar para los iconos de los usuarios

###### [![0.6.2](/app/doc/release.png) 0.6.2](https://github.com/JoseVte/tfg-recetarium-angularjs/releases/tag/0.6.2)

- Busqueda por tags

###### [![0.6.1](/app/doc/release.png) 0.6.1](https://github.com/JoseVte/tfg-recetarium-angularjs/releases/tag/0.6.1)

- Añadidos los comentarios

###### [![0.6.0-hotfix](/app/doc/release.png) 0.6.0-hotfix](https://github.com/JoseVte/tfg-recetarium-angularjs/releases/tag/0.6.0-hotfix)

- Ahora el texto de busqueda se mantiene entre paginas
- La tecla enter activa la busqueda
- Fixeado error al guardar una receta sin imagen

###### [![0.5.2](/app/doc/release.png) 0.5.2](https://github.com/JoseVte/tfg-recetarium-angularjs/releases/tag/0.5.2)

- Scroll infinito en la busqueda
- Cambiada barra superior

###### [![0.5.1-hotfix](/app/doc/release.png) 0.5.1-hotfix](https://github.com/JoseVte/tfg-recetarium-angularjs/releases/tag/0.5.1-hotfix)

- Fixeado boton de borrar una imagen en el perfil

###### [![0.5.1](/app/doc/release.png) 0.5.1](https://github.com/JoseVte/tfg-recetarium-angularjs/releases/tag/0.5.1)

- Añadida galeria para elegir imagenes en la receta y el perfil de usuario

###### [![0.4.3](/app/doc/release.png) 0.4.3](https://github.com/JoseVte/tfg-recetarium-angularjs/releases/tag/0.4.3)

- Añadido boton para añadir a favoritos
- Añadida posibilidad de puntuar una receta del 0 al 5
- Añadido Vagrantfile para poder probar la app sin instalar nada en el equipo

###### [![0.4.2](/app/doc/release.png) 0.4.2](https://github.com/JoseVte/tfg-recetarium-angularjs/releases/tag/0.4.2)

- Nuevo dashboard
- Nueva barra de navegacion

###### [![0.4.1](/app/doc/release.png) 0.4.1](https://github.com/JoseVte/tfg-recetarium-angularjs/releases/tag/0.4.1)

- Añadidos eventos cuando se presiona la tecla intro

###### [![0.3.3](/app/doc/release.png) 0.3.3](https://github.com/JoseVte/tfg-recetarium-angularjs/releases/tag/0.3.3)

- Nuevos tests añadidos

###### [![0.3.2](/app/doc/release.png) 0.3.2](https://github.com/JoseVte/tfg-recetarium-angularjs/releases/tag/0.3.2)

- Sección perfil de usuario

###### [![0.3.1](/app/doc/release.png) 0.3.1](https://github.com/JoseVte/tfg-recetarium-angularjs/releases/tag/0.3.1)

- Generar receta desde un borrador
- Primer test para el controlador

###### [![0.3.0](/app/doc/release.png) 0.3.0](https://github.com/JoseVte/tfg-recetarium-angularjs/releases/tag/0.3.0)

- Visibilidad de las recetas

###### [![0.2.2](/app/doc/release.png) 0.2.2](https://github.com/JoseVte/tfg-recetarium-angularjs/releases/tag/0.2.2)

- Sección recuperar contraseña
- Validador de contraseña repetida en los formularios

###### [![0.2.1](/app/doc/release.png) 0.2.1](https://github.com/JoseVte/tfg-recetarium-angularjs/releases/tag/0.2.1)

- Buscar recetas
- Fixeado CSS
- Test añadidos
- Integración con Travis CI

###### [![0.2.0](/app/doc/release.png) 0.2.0](https://github.com/JoseVte/tfg-recetarium-angularjs/releases/tag/0.2.0)

- Editar receta
- Borrar receta

###### [![0.1.3](/app/doc/release.png) 0.1.3](https://github.com/JoseVte/tfg-recetarium-angularjs/releases/tag/0.1.3)

- Crear una receta
    - Editor WYSIWYG
    - Slug automático y checkeo de existencia
    - Añadir y quitar ingredientes
    - Añadir a una categoria existente
    - Añadir y quitar imágenes
    - Añadir y quitar tags (crear nuevas si no existen)
- Actualización de las librerias
- Fix algunos bugs

###### [![0.1.2-hotfix](/app/doc/release.png) 0.1.2-hotfix](https://github.com/JoseVte/tfg-recetarium-angularjs/releases/tag/0.1.2-hotfix)

- Arreglada la rua de Heroku para no mostrar nada: [recetarium-angular.herokuapp.com](https://recetarium-angular.herokuapp.com/)

###### [![0.1.2](/app/doc/release.png) 0.1.2](https://github.com/JoseVte/tfg-recetarium-angularjs/releases/tag/0.1.2)

- Vista en detalle de una receta responsive
- Chequeo de credenciales desde el servidor
- Pequeñas animaciones añadidas
- Todas las librerias minimizadas en un [archivo](/app/assets/js/lib/app.min.js)

###### [![0.1.1](/app/doc/release.png) 0.1.1](https://github.com/JoseVte/tfg-recetarium-angularjs/releases/tag/0.1.1)

- Lista de recetas responsive
- Arreglado header en moviles
- Color a las tabs del navegador mobile

###### [![0.1.0](/app/doc/release.png) 0.1.0](https://github.com/JoseVte/tfg-recetarium-angularjs/releases/tag/0.1.0)

- Añadida la página de Registro

###### [![0.0.1](/app/doc/release.png) 0.0.1](https://github.com/JoseVte/tfg-recetarium-angularjs/releases/tag/0.0.1)

- Añadida la base del proyecto en AngularJS
- Añadida la página de Home
- Añadido la página de Login
- Favicon

###### [![0.0.0](/app/doc/release.png) 0.0.0](https://github.com/JoseVte/tfg-recetarium-angularjs/releases/tag/0.0.0)

- App base

[bower]: http://bower.io
[npm]: https://www.npmjs.org/
[http-server]: https://github.com/nodeapps/http-server
