import { Component, ViewChild } from '@angular/core';
import { NavController, LoadingController } from '@ionic/angular';
import { MediaCapture, MediaFile, CaptureError, CaptureVideoOptions } from '@ionic-native/media-capture/ngx';
import { Media } from '@ionic-native/media/ngx';
import { File } from '@ionic-native/file/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { VideoEditor } from '@ionic-native/video-editor/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  mediaFiles = [];
  @ViewChild('myvideo') myVideo: any;
  showVideo = false;

  constructor(private loadingCtrl: LoadingController, private videoEditor: VideoEditor, private webview: WebView, public navCtrl: NavController, private mediaCapture: MediaCapture, private file: File, private media: Media) { }

  captureVideo() {
    let options: CaptureVideoOptions = {
      limit: 1,
      quality: 0
      // duration: 30
    }
    this.mediaCapture.captureVideo(options).then((res: MediaFile[]) => {
      let capturedFile = res[0];
      let fileName = capturedFile.name;
      console.log(capturedFile);
      this.loadingCtrl.create({ message: 'Compressing....' }).then(el => {
        el.present();
        this.videoEditor.transcodeVideo({
          fileUri: capturedFile.fullPath,
          outputFileName: 'SG-' + fileName.split('.')[0],
          outputFileType: this.videoEditor.OutputFileType.MPEG4,
          optimizeForNetworkUse: this.videoEditor.OptimizeForNetworkUse.YES,
          saveToLibrary: true,
          maintainAspectRatio: true,
          width: 640,
          height: 640,
          videoBitrate: 1000000, // 1 megabit
          audioChannels: 2,
          audioSampleRate: 44100,
          audioBitrate: 128000
        })
          .then((fileUri: string) => {
            console.log('video transcode success', fileUri);
            this.videoEditor.getVideoInfo({ fileUri: 'file://' + fileUri }).then(info => {
              // this.storeMediaFiles([{ path: fileUri, name: fileName, info: { ...info, originalSize: capturedFile.size } }]);
              this.mediaFiles = this.mediaFiles.concat([{ path: fileUri, name: fileName, info: { ...info, originalSize: capturedFile.size } }]);
              el.dismiss();
            }, err => {
              el.dismiss();
              console.log('info err:', err)
            });
          })
          .catch((error: any) => {
            el.dismiss();
            console.log('video transcode error', error)
          });
      });
    },
      (err: CaptureError) => console.error(err));
  }

  play(myFile) {
    let video = this.myVideo.nativeElement;
    video.src = this.webview.convertFileSrc(myFile.path);
    video.play();
  }
  
}
