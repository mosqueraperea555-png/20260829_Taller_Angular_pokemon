import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface PokemonTarjeta {

  id: number;
  name: string;
  image: string;
  type: string;
  baseExperience: number;
  esFavorito?: boolean;

}

@Injectable({
  providedIn: 'root'
})

export class PokemonStorageService {
  private http = inject(HttpClient);
  private readonly STORAGE_KEY = 'equipo_pokemon_registrado';
  
  misPokemons = signal<PokemonTarjeta[]>([]);
  


  constructor(){
    this.cargarDesdeStorage();

  }

  cargarDesdeStorage() {
    const clave = this.claveInventario();
    if (!clave) {
      this.misPokemons.set([]);
      return;
    }
    const Data = localStorage.getItem(clave);
    this.misPokemons.set(Data ? JSON.parse(Data) : []);
  }

  //-1. Obtener datos de la API

  buscarEnAPI(nombreOId: string){
    return this.http.get<any>(`https://pokeapi.co/api/v2/pokemon/${nombreOId}`)


  };

  //-2. Guardar/Crear nuevo Pokemon dentro del el maleto.

  guardarPokemon(nuevo: PokemonTarjeta){
    const clave = this.claveInventario();
    if (!clave) return false;
    const actualizados= [ ...this.misPokemons(), nuevo ];
    this.misPokemons.set(actualizados);
    localStorage.setItem(clave, JSON.stringify(actualizados));
    return true;


  };

  //.3 Actualizar Pokemon Favorito.

  actualizarFavorito(id: number){
      const clave = this.claveInventario();
      if (!clave) return;
      const actualizados = this.misPokemons().map(poke => {
        if (poke.id === id){
            return { ...poke, esFavorito: !poke.esFavorito }
        }
        return poke
      });
      this.misPokemons.set(actualizados);
      localStorage.setItem(clave, JSON.stringify(actualizados));
  };


  //.4 Eliminar Pokemon del malet

  eliminarPokemon(id: number){
      const clave = this.claveInventario();
      if (!clave) return;
      const filtrados = this.misPokemons().filter( poke => poke.id !== id );
      this.misPokemons.set(filtrados);
      localStorage.setItem(clave, JSON.stringify(filtrados));


  }

  private claveInventario(): string | null {
    const entrenador = localStorage.getItem('entrenador_activo');
    if (!entrenador) return null;
    const { id } = JSON.parse(entrenador) as { id: number };
    return `${this.STORAGE_KEY}_${id}`;
  }

  nombreEntrenadorActivo(): string | null {
    const entrenador = localStorage.getItem('entrenador_activo');
    return entrenador ? (JSON.parse(entrenador) as { nombreCompleto: string }).nombreCompleto : null;
  }


}