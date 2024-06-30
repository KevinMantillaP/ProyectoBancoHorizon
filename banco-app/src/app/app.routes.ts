import { Routes } from '@angular/router';
import { RegistrarUsuarioComponent } from './registrar-usuario/registrar-usuario.component';

export const routes: Routes = [
    //{ path: '', redirectTo: '/registrar-usuario', pathMatch: 'full' },
    { path: 'registrar-usuario', component: RegistrarUsuarioComponent }
    //{path: 'registrar', component:RegistrarUsuarioComponent}
];
