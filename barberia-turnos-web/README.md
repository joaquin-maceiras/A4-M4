# Sistema Web de Gestión de Turnos - Barbería Local (Burzaco)

Proyecto desarrollado para la materia **Taller de Proyectos II** (Tecnicatura Universitaria en Tecnologías de la Información con Orientación en Desarrollo Web - Universidad Argentina John F. Kennedy).

## Datos del Autor
* **Alumno:** Joaquín Lisandro Maceiras Cami
* **DNI:** 46.441.292
* **Email:** lichandro133546@gmail.com

## Descripción del Proyecto
Plataforma web diseñada bajo enfoque *Mobile First* para reemplazar la gestión manual de turnos en una barbería de barrio por un sistema digital centralizado. Permite a los clientes reservar horarios disponibles sin solapamientos y ofrece al administrador (barbero) una vista ordenada de su agenda diaria con opciones para completar o cancelar turnos.

## Estructura del Repositorio
* `/public`: Archivos del frontend (`index.html`, `styles.css`, `app.js`) con interfaz adaptable y validaciones en cliente.
* `/database`: Script relacional (`schema.sql`) con la definición de tablas (`Usuarios`, `Servicios`, `Turnos`) y datos iniciales.
* `/src`: Lógica de servidor y control de disponibilidad (`turnosController.js`).

## Cómo ejecutar localmente
1. Clonar o descargar el repositorio.
2. Abrir `public/index.html` en cualquier navegador web moderno (o levantar con Live Server en VS Code).
3. El sistema utiliza `localStorage` para simular la persistencia de turnos en tiempo real durante la demo frontend, replicando la estructura definida en `database/schema.sql`.
