# ShopMate

Aplicación móvil desarrollada con **Expo** y **React Native** para ofrecer una experiencia de compra personalizada en el sector retail. ShopMate recomienda productos con modelos de **inteligencia artificial** y expone la información mediante servicios en la nube, permitiendo escalar la solución y seguir las mejores prácticas de datos y modelado.

## Equipo

| Nombre | Matrícula |
| --- | --- |
| Rosa Vanessa Palacios Beltrán | A01824522 |
| Virly Itzel López Soto | A01656342 |
| Diego Aguilar Flores | A01651294 |
| Santiago Caballero Ortega | A01651992 |
| Cynthia Andrea Soriano González | A01650848 |
| Pedro Daniel Cabrera Sánchez | A01652191 |
| Katia Fuentes González | A01654060 |

## Contenido
- [Descripción del proyecto](#descripción-del-proyecto)
- [Metodología y documentación](#metodología-y-documentación)
- [Correcciones realizadas](#correcciones-realizadas)
- [Requerimientos y ejecución](#requerimientos-y-ejecución)
- [Estructura del repositorio](#estructura-del-repositorio)
- [Recursos adicionales](#recursos-adicionales)

## Descripción del proyecto
ShopMate centraliza el catálogo y las preferencias de los usuarios para sugerir productos relevantes. La solución integra:
- Ingesta y almacenamiento en la nube para información transaccional y de inventario.
- Modelos de recomendación con técnicas de deep learning y un benchmark clásico (regresión logística) para comparar desempeño.
- Panel móvil para navegar productos, gestionar el carrito y consultar recomendaciones.

## Metodología y documentación
- **Levantamiento de requerimientos:** entrevistas con el socio formador para priorizar funcionalidades clave y restricciones operativas.
- **Iteraciones rápidas:** ciclos cortos para integrar retroalimentación y validar hipótesis de negocio.
- **Comunicación:** reportes semanales y tableros compartidos para dar visibilidad del progreso.
- **Documentación:** bitácora técnica, decisiones de arquitectura, métricas de evaluación y protocolos de datos disponibles en el repositorio.

## Correcciones realizadas
Retroalimentación aplicada con base en las observaciones de los profesores de cada módulo:
- Clarificamos el flujo de autenticación y el manejo de sesiones en la documentación de arquitectura.
- Ajustamos la sección de métricas para explicar la justificación de cada indicador de desempeño del modelo.
- Reorganizamos el repositorio para separar código de frontend, servicios y scripts de datos, facilitando la navegación.
- Añadimos ejemplos de pruebas y criterios de aceptación para las historias de usuario principales.

## Requerimientos y ejecución
1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Ejecutar la app en modo desarrollo:
   ```bash
   npx expo start
   ```
3. Accede al menú de Expo para abrir el proyecto en un emulador Android, simulador iOS o con Expo Go.

## Estructura del repositorio
- `app/`, `components/`, `hooks/`: vistas y componentes de la aplicación móvil.
- `services/`, `stores/`: consumo de APIs y manejo de estado.
- `scripts/`, `modelos/`: utilidades y artefactos de datos/modelado.
- `backend/`: servicios auxiliares para orquestar datos y autenticación.

## Recursos adicionales
- [Documentación de Expo](https://docs.expo.dev/) para guías y mejores prácticas.
- [Tutorial introductorio de Expo](https://docs.expo.dev/tutorial/introduction/) para repasar el flujo básico.
