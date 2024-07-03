import { Routes } from '@angular/router';
import { RegistrarUsuarioComponent } from './registrar-usuario/registrar-usuario.component';
import { HomeComponent } from './home/home.component';
import { VerificarCodigoComponent } from './validar-codigo/validar-codigo.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'registrar-usuario', component: RegistrarUsuarioComponent},
    { path: 'verificar-codigo', component: VerificarCodigoComponent }
];
