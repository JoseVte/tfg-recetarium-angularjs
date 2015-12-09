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

#### Version 0.0

###### 0.0.1

- Añadida la base del proyecto en AngularJS
- Añadida la pagina de Home
- Añadido la pagina de Login

[bower]: http://bower.io
[npm]: https://www.npmjs.org/
[http-server]: https://github.com/nodeapps/http-server
