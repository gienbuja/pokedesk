export interface TypeDetail {
  name: string
  url: string
}
export interface Type {
  slot: number
  type: TypeDetail
}
export interface Sprites {
  front_default: string
  other: {
    'official-artwork': {
      front_default: string
      front_shiny: string
    }
  }
}

export interface Cries {
  latest: string
  legacy: string
}

export interface Pokemon {
  name: string
  url: string
  id: number
  weight: number
  height: number
  types: Type[]
  sprites: Sprites
  cries: Cries
}
