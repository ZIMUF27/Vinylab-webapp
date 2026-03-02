import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { TemplatesComponent } from './pages/templates/templates.component';
import { DesignEditorComponent } from './pages/design-editor/design-editor.component';
import { OrderConfirmComponent } from './pages/order-confirm/order-confirm.component';
import { PaymentPageComponent } from './pages/payment-page/payment-page.component';
import { MyOrdersComponent } from './pages/my-orders/my-orders.component';
import { BackofficeComponent } from './pages/backoffice/backoffice.component';
import { authGuard, roleGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'templates', component: TemplatesComponent },
    {
        path: 'design/:id',
        component: DesignEditorComponent,
        canActivate: [authGuard]
    },
    {
        path: 'order-confirm/:id',
        component: OrderConfirmComponent,
        canActivate: [authGuard]
    },
    {
        path: 'payment/:id',
        component: PaymentPageComponent,
        canActivate: [authGuard]
    },
    {
        path: 'my-orders',
        component: MyOrdersComponent,
        canActivate: [authGuard]
    },
    {
        path: 'backoffice',
        component: BackofficeComponent,
        canActivate: [authGuard, roleGuard(['admin', 'staff'])]
    }
];
