import { Component, OnInit } from "@angular/core";
import { Chart } from "chart.js";
import { NotifyService } from "./notify.service";
import { LoadingController } from '@ionic/angular';

@Component({
  selector: "app-notify",
  templateUrl: "./notify.page.html",
  styleUrls: ["./notify.page.scss"]
})
export class NotifyPage implements OnInit {
  station: any;
  current:any;
  histories:any;
  lineChart: any = []; //ประกาศตัวแปรเก็บค่า
  direction : any = "rotate(0deg)";
  constructor(private loadingController: LoadingController, private notifyService: NotifyService) {}
  
  async ngOnInit() {
    const loading = await this.loadingController.create({
      message: 'Hellooo'
    });
    await loading.present();
    this.notifyService.ongetNotifyData.subscribe((data: any) => {
      console.log(data);
      loading.dismiss();
      if (data.aqi) {
        this.station = data;
      }
    });

    this.notifyService.onHomeDataListChanged.subscribe((homeDataList: any) => {
      
      if(homeDataList.current){
        this.current = homeDataList.current;
        this.direction = `rotate(${this.current.wind.direction}deg)`;
        console.log(this.current);
      }
      
    });
    this.notifyService.onHistoriesDataListChanged.subscribe((historyDataList: any) => {
      
      if(historyDataList){
        this.lineChart = new Chart("lineChart", {
      // สร้าง object และใช้ชื่อ id lineChart ในการอ้างอิงเพื่อนำมาเเสดงผล
      type: "bar", // ใช้ชนิดแผนภูมิแบบเส้นสามารถเปลี่ยนชิดได้
      data: historyDataList,
      options: {
        title: {
          // ข้อความที่อยู่ด้านบนของแผนภูมิ
          text: "School air pollution historical data",
          display: true
        }
      },
      scales: {
        // แสดง scales ของแผนภูมิเริมที่ 0
        yAxes: [
          {
            ticks: {
              beginAtZero: true
            }
          }
        ]
      }
    });
      }
      
    });

    
    
    
  }

  getData(){
    this.notifyService.getNotifyData();
  }
  doRefresh(event) {
    console.log("Begin async operation");
    this.getData();
    setTimeout(() => {
      console.log("Async operation has ended");
      event.target.complete();
    }, 2000);
  }
}
