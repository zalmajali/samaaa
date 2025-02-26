import { Component } from '@angular/core';
import {AlertController, Platform,NavController,MenuController,ModalController,ToastController} from '@ionic/angular';
import {Storage} from "@ionic/storage-angular";
import { register } from 'swiper/element/bundle';
import { Device } from '@capacitor/device';
import { TranslateService } from '@ngx-translate/core';
import { PushNotifications, Token } from '@capacitor/push-notifications';
import {PushinfoComponent} from "./pages/pushinfo/pushinfo.component";
import {UsersService} from "./service/users.service";
register();
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  //menu lable
  public dir: any;
  public floatD: any;
  //system label
  public checkLanguage: any=0;
  public language: any;
  //login label
  public token:any;
  public userId:any;
  constructor(private usersService: UsersService,private modalController: ModalController,private translate: TranslateService,private platform : Platform,private storage: Storage) {
    this.information();
    //this.setupNotifications();
  }
  async information(){
    await this.storage.create();
    await this.getDeviceLanguage();
  }
  // async setupNotifications() {
  //   console.log("🔄 Starting Notification Setup...");
  
  //   const checkPermissions = async () => {
  //     let status = await PushNotifications.checkPermissions();
  //     console.log("🛑 Current Permissions:", status);
  //     alert("Permissions: " + JSON.stringify(status));
  
  //     if (status.receive !== 'granted') {
  //       const requestStatus = await PushNotifications.requestPermissions();
  //       console.log("✅ Requested Permissions:", requestStatus);
  //       alert("Requested Permissions: " + JSON.stringify(requestStatus));
  
  //       if (requestStatus.receive !== 'granted') {
  //         throw new Error("❌ User denied permissions!");
  //       }
  //     }
  //   };
  //   const addListeners = async () => {
  //     console.log("🎧 Adding Listeners...");
  
  //     // 🔥 استلام توكن التسجيل (Android = FCM، iOS = APNs)
  //     PushNotifications.addListener('registration', token => {
  //       console.log("✅ Registration Token:", token.value);
  //       alert("Token Received: " + token.value);
  //     });
  
  //     PushNotifications.addListener('registrationError', err => {
  //       console.error("❌ Registration Error:", err);
  //       alert("Error: " + JSON.stringify(err));
  //     });
  
  //     PushNotifications.addListener('pushNotificationReceived', notification => {
  //       console.log("📩 Push Notification Received:", notification);
  //       alert("Notification Received: " + JSON.stringify(notification));
  //     });
  
  //     PushNotifications.addListener('pushNotificationActionPerformed', notification => {
  //       console.log("🛠 Notification Action Performed:", notification);
  //       alert("Notification Clicked: " + JSON.stringify(notification));
  //     });
  //   };
  
  //   const registerNotifications = async () => {
  //     console.log("📲 Registering Notifications...");
  //     await PushNotifications.register();
  //   };
  
  //   const getDeliveredNotifications = async () => {
  //     console.log("📨 Getting Delivered Notifications...");
  //     const notificationList = await PushNotifications.getDeliveredNotifications();
  //     console.log("📬 Delivered Notifications:", notificationList);
  //   };
  
  //   try {
  //     await checkPermissions();
  //     await addListeners();
  //     await registerNotifications();
  //     await getDeliveredNotifications();
  //   } catch (error) {
  //     console.error("🚨 Error in setupNotifications:", error);
  //     alert("Setup Error: " + JSON.stringify(error));
  //   }
  // }
  
  async goToPush(title:any,body:any){
    let model = await this.modalController.create({
      component:PushinfoComponent,
      componentProps:{title:title,body:body},
      animated:true,
      cssClass:"modalFilterSortCss"
    });
    model.onDidDismiss().then((data):any=>{
    });
    await model.present();
  }
  async initialiseTranslation(){
    this.translate.get('dir').subscribe((res: string) => {
      this.dir = res;
    });
    this.translate.get('floatD').subscribe((res: string) => {
      this.floatD = res;
    });
  }
  async getDeviceLanguage() {
    await this.storage.get('checkLanguage').then(async checkLanguage=>{
      this.checkLanguage = checkLanguage
    });
    if(this.checkLanguage!=undefined && this.checkLanguage!=null && this.checkLanguage!=""){
      this.translate.setDefaultLang(this.checkLanguage);
      this.language = this.checkLanguage;
      this.translate.use(this.language);
      await this.initialiseTranslation();
    }else{
      const info = await Device.getLanguageCode();
      this.translate.setDefaultLang(info.value); // اللغة الافتراضية
       this.translate.use(info.value);
      this.language = info.value;
      await this.initialiseTranslation();
    }
  }
}
