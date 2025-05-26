# Pokedesk

Una aplicación para explorar información sobre Pokémon construida con Vue.js.

## Descripción

Pokedesk es una aplicación web que te permite explorar información detallada sobre Pokémon. Puedes buscar Pokémon por nombre, ver detalles como tipos, habilidades, estadísticas y más. Además, podrás escuchar sonidos de los Pokémon para una experiencia más envolvente.

## Estructura implementada

- `pokemon.service.ts` maneja toda la lógica de comunicación con la API y caché
- `pokemon.store.ts` gestiona el estado de la aplicación
- Implementación de caché local (localStorage) con expiración
- Manejo de errores y estados de carga
- Estrategias para evitar llamadas redundantes a la API
- Servicio independiente facilita cambios en la API
- Store centralizado permite compartir estado entre componentes
- Métodos bien documentados para mantenimiento
- Carga progresiva de datos
- Persistencia de favoritos
- Manejo de errores silencioso para el usuario final

## Características

- Listado de Pokémon
- Búsqueda de Pokémon
- Visualización de detalles
- Interfaz responsive

## Tecnologías

- Vue 3
- TypeScript
- Pinia (para gestión de estado)
- Vite (para construcción)

## Instalación

1. Clona el repositorio

2. Instala las dependencias:

```bash
npm install
```

3. Inicia la aplicación:

```sh
npm run dev
```

## Estructura del proyecto

```bash
src/
├── components/ # Componentes reutilizables
│ ├── BackgroundPoke.vue
│ ├── BottonBarPoke.vue
│ ├── BtnPoke.vue
│ ├── DynamicBackground.vue
│ ├── EmptyPoke.vue
│ ├── ListItemPoke.vue
│ ├── ListPoke.vue
│ ├── ModalPoke.vue
│ ├── PokemonDetailsList.vue
│ ├── PokemonImage.vue
│ ├── SearchPoke.vue
│ └── icons/
├── services/ # Lógica de servicios
│ ├── **tests**/
│ ├── pokemon.service.ts # Maneja toda la lógica de comunicación con la API y caché
│ └── ui.service.ts # Maneja toda la lógica para la interfaz de usuario
├── stores/ # Gestión de estado
│ ├── **tests**/
│ └── pokemon.store.ts # Gestión de estado de la aplicación
├── types/ # Tipos TypeScript
│ └── index.ts
└── views/ # Vistas principales
├── IndexView.vue
└── WelcomeView.vue
```

## Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.

## Agradecimientos

Este proyecto utiliza las siguientes APIs:

- [PokéAPI](https://pokeapi.co/) - Para obtener información detallada sobre Pokémon
- Pokedex API - Sonidos Pokémon [Repositorio](https://github.com/RodXorDevX/pokedex-api-sounds) [API](https://pokedex-api-sounds.onrender.com) - Para los sonidos de Pokémon

## Créditos

Este proyecto fue desarrollado con ❤️ por Giovany Buelvas para todos!

## Un especial agradecimiento a:

- Los creadores y mantenedores de estas APIs por su excelente trabajo
- La comunidad de Pokémon por su apoyo continuo
- Los contribuidores de código abierto que hacen posible proyectos como este
