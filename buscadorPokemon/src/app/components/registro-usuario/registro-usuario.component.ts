import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

export interface Usuario {
    id : number;
    nombreCompleto : string;
    documento : { 
      tipo: string;
      numero: string
    };
    fechaNacimiento : string;
    correo : string;
    datosPersonales : boolean;  
    fechaRegistro: string;

}


@Component({
  imports: [FormsModule],
  selector: 'app-registro-usuario',
  standalone: true,
  styleUrl: './registro-usuario.component.css',
  templateUrl: './registro-usuario.component.html',
})
export class RegistroUsuarioComponent {
  private router = inject(Router);
  nombre = signal('');
  apellido = signal('');
  tipo_doc = signal('CC');
  dni = signal('');
  fecha_nacimiento = signal('');
  correo = signal('');
  datos_personales = signal(false);

    ultimoUsuario = signal<Usuario | null>(null);

    guardarUsuario() {
        if(!this.datos_personales()){
          console.error('Debes aceptar el tratamiento de datos personales');
          return;
        }

        const usuarioCreado = {
        id : Date.now(),
        nombreCompleto : `${this.nombre()} ${this.apellido()}`,
        documento : {
          tipo: this.tipo_doc(),
          numero: this.dni()
        },
        fechaNacimiento : this.fecha_nacimiento(),
        correo : this.correo(),
        datosPersonales : this.datos_personales(),  
        fechaRegistro: new Date().toLocaleDateString()
    }

    localStorage.setItem(usuarioCreado.id.toString(), JSON.stringify(usuarioCreado));

    const entrenadores = JSON.parse(localStorage.getItem('entrenadores_pokemon') || '[]');
    const entrenador = {
      id: usuarioCreado.id,
      nombreCompleto: usuarioCreado.nombreCompleto,
      correo: usuarioCreado.correo,
      fechaRegistro: usuarioCreado.fechaRegistro
    };
    localStorage.setItem(
      'entrenadores_pokemon',
      JSON.stringify([...entrenadores.filter((item: { id: number }) => item.id !== entrenador.id), entrenador])
    );
    localStorage.setItem('entrenador_activo', JSON.stringify(entrenador));

    this.ultimoUsuario.set(usuarioCreado);
    this.router.navigate(['/buscador']);

    }
}