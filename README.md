# Proyecto de Victor Arias - FAW

Este proyecto incluye un servidor backend en Node.js y un proyecto frontend en Angular. En este documento incluyo instrucciones para ejecutar ambos proyectos simultáneamente.

## Requisitos Previos

Tener instalados los siguientes software:

- [Node.js](https://nodejs.org/) (incluye `npm`)
- [Angular CLI](https://angular.io/cli)

## Ejecución del Proyecto

Primero: Es necesario correr el comando npm install en ambos proyectos, esto para asegurar que todos los archivos necesarios estén en el proyecto.

Segundo: El proyecto utiliza una base de datos POSTGRESql, escogí esta base debido a las múltiples opciones que esta ofrece para poder crear y manipular objetos, el fin de usar esta base de datos es que no se tenga que correr a mano scripts de creaciones de tablas, sin embargo si es necesario que se tenga instaldo POSTGRESql en el equipo y que durante la instalación se utilize la contraseña root, luego únicamente faltaría crear la base de datos taskmaster y el resto lo hace el proyecto.

En caso ya exista la instalación de POSTGRESql se pueden modificar los datos de conexión en el archivo db.js en el proyecto "backend".

Para levantar ambos proyectos se realiza de la siguiente manera.

BACKEND: npm run dev

FRONTEND: ng serve  ( si diese algún error de seguridad se puede correr el siguiente comando para permitir la ejecución de scripts temporalmente: "Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
")

Esto sería todo :D

Victor Eduardo Arias Martínez
Carnét: 15001915