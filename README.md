[![Issue Stats](http://issuestats.com/github/JoseVte/tfg-recetarium-angularjs/badge/pr?style=flat)](http://issuestats.com/github/JoseVte/tfg-recetarium-angularjs)
[![Issue Stats](http://issuestats.com/github/JoseVte/tfg-recetarium-angularjs/badge/issue?style=flat)](http://issuestats.com/github/JoseVte/tfg-recetarium-angularjs)

[![npm version](https://badge.fury.io/js/gulp.svg)](https://badge.fury.io/js/gulp)
[![npm version](https://badge.fury.io/js/bower.svg)](https://badge.fury.io/js/bower)
[![npm version](https://badge.fury.io/js/http-server.svg)](https://badge.fury.io/js/http-server)

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

#### [![0.0.1](/doc/rocket-blue.png) 0.0.1](https://github.com/JoseVte/tfg-recetarium-angularjs/releases/tag/0.0.1)

- Añadida la base del proyecto en AngularJS
- Añadida la página de Home
- Añadido la página de Login
- Favicon

###### [![0.0.0](/doc/release.png) 0.0.0](https://github.com/JoseVte/tfg-recetarium-angularjs/releases/tag/0.0.0)

- App base

[bower]: http://bower.io
[npm]: https://www.npmjs.org/
[http-server]: https://github.com/nodeapps/http-server
