# RHWeb – Plataforma de Gestión de Recursos Humanos

RHWeb es una aplicación web desarrollada con Node.js, Express y MongoDB para gestionar empleados, asistencia, horarios y nómina dentro de una empresa. Está diseñada con un enfoque visual moderno, uso de roles diferenciados y herramientas prácticas para administradores, supervisores y empleados.

## Tabla de Contenidos
- [Características](#características)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Instalación](#instalación)
- [Estructura de Roles](#estructura-de-roles)


## Características

- Registro e inicio de sesión de usuarios con roles (`admin`, `supervisor`, `employee`)
- Dashboard personalizado para cada rol
- Gestión de empleados: crear, editar, eliminar
- Asignación y edición de horarios
- Registro y visualización de asistencia
- Módulo de nómina con salario base, bonos y deducciones
- Visualización de gráficas con Chart.js (asistencia y pagos)
- Interfaz responsiva y moderna con Bootstrap 5 y animaciones


## Tecnologías Utilizadas

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- bcryptjs (para contraseñas)
- express-session & connect-flash

### Frontend
- Handlebars (`.hbs`) como motor de vistas
- Bootstrap 5
- Bootstrap Icons
- Animate.css
- Chart.js

### Hosting
- [Render](https://render.com/) (para frontend y backend)


## Instalación

1. Clona el repositorio:

```bash
git clone https://github.com/tuusuario/rhweb.git
cd rhweb
```
2.	Instala las dependencias:
```bash
npm install
```
3.	Crea un archivo .env para configurar tus credenciales de MongoDB.
```bash
MONGODB_URI=mongodb+srv://<usuario>:<contraseña>@cluster.mongodb.net/rhweb
PORT=3000
NODE_ENV=development
```
4.	Ejecuta la aplicación:
```bash
npm run dev
```


## Estructura de Roles

### Administrador
- Puede crear, editar y eliminar usuarios
- Gestiona información de nómina y horarios
- Visualiza dashboards con métricas globales
### Supervisor
- Visualiza empleados y agendas
- Registra asistencia del personal
- Consulta métricas de desempeño semanal
### Empleado
- Consulta su horario
- Visualiza su historial de asistencia
- Consulta su información de nómina
