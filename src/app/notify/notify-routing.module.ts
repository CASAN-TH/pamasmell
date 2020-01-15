import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { NotifyPage } from "./notify.page";
import { NotifyService } from "./notify.service";

const routes: Routes = [
  {
    path: "",
    component: NotifyPage,
    resolve: [NotifyService]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotifyPageRoutingModule {}
