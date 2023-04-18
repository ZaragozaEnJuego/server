# Node-template

## Iniciar la base de datos
Para desarrollo utilizar una base de datos local se debe ejecutar el comando:
```bash
sudo mongod
```
Tras eso la api ya puede interactuar con la base de datos y funcionar correctamente. En caso de querer usar herramientas como MongoCompass se debe exponer el puerto `localhost:27017` mediante vscode en la pestaña de puertos.

## Eslint
En este proyecto se ha añadido eslint para comprobar el estilo y encontrar posibles errores.
Para eecutar el linter de froma manual usar
```bash
yarn lint
```
Tambien se puede añadir la [extension de ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) al VScode para verlos en el editor
