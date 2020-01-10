import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-notify',
  templateUrl: './notify.page.html',
  styleUrls: ['./notify.page.scss'],
})
export class NotifyPage implements OnInit {
  lineChart: any = []; //ประกาศตัวแปรเก็บค่า
  constructor() { }

  ngOnInit() {
    this.lineChart = new Chart('lineChart', { // สร้าง object และใช้ชื่อ id lineChart ในการอ้างอิงเพื่อนำมาเเสดงผล
      type: 'bar', // ใช้ชนิดแผนภูมิแบบเส้นสามารถเปลี่ยนชิดได้
      data: { // ข้อมูลภายในแผนภูมิแบบเส้น
        labels: ["6 ", "7 ", "8 ", "9 ", "10 ", "11 ", "12 ", "13 ", "14 ", "15 ", "16 ", "17 "], // ชื่อของข้อมูลในแนวแกน x
        datasets: [{ // กำหนดค่าข้อมูลภายในแผนภูมิแบบเส้น
          label: 'PM2.5',
          data: [14, 15.5, 20, 32, 28, 25, 25, 21, 19, 13, 11, 19],
          fill: false,
          lineTension: 0.2,
          borderColor: "green", // สีของเส้น
          borderWidth: 1
        }]
      },
      options: {
        title: { // ข้อความที่อยู่ด้านบนของแผนภูมิ
          text: "School air pollution historical data",
          display: true
        }
      },
      scales: { // แสดง scales ของแผนภูมิเริมที่ 0
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    })
  }

}
