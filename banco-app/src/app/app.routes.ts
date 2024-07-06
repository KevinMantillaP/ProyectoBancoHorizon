import { Routes } from '@angular/router';
import { RegistrarUsuarioComponent } from './registrar-usuario/registrar-usuario.component';
import { HomeComponent } from './home/home.component';
import { VerificarCodigoComponent } from './validar-codigo/validar-codigo.component';
import { IngresarCredencialesComponent } from './ingresar-credenciales/ingresar-credenciales.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'registrar-usuario', component: RegistrarUsuarioComponent},
    { path: 'verificar-codigo', component: VerificarCodigoComponent },
    { path: 'ingresar-credenciales', component: IngresarCredencialesComponent},
    { path: 'login', component: LoginComponent}
];
