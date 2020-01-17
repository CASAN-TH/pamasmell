import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { AccountService } from './account.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {
posts : Array<any>;
  constructor(private loadingController: LoadingController,private accountService: AccountService) { }

  async ngOnInit() {
    const loading = await this.loadingController.create({
      message: 'Loading...'
    });
    await loading.present();
    this.accountService.onPostDataListChanged.subscribe((data: any) => {
      console.log(data);
      loading.dismiss();
      this.posts = data;
    });
  }

}
