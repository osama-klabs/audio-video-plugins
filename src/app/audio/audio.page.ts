import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { File } from '@ionic-native/file/ngx';
import { Media, MediaObject } from '@ionic-native/media/ngx';

@Component({
  selector: 'app-audio',
  templateUrl: './audio.page.html',
  styleUrls: ['./audio.page.scss'],
})
export class AudioPage implements OnInit {

  audioFile: MediaObject;
  headerTitle: string = "Record";
  //defined media type to 0 -> means audio
  // media = {
  //   name: "",
  //   type: 0,
  //   uid: "",
  //   shared: false,
  //   uploaded: false,
  //   tags: [""],
  //   file: {}
  // };
  private isRecording: boolean = false;
  private isPlaying: boolean = false;
  private isPaused: boolean = false;

  constructor(private loadingCtrl: LoadingController, private file: File, private media: Media) { }

  ngOnInit() {
  }

  captureAudio() {
    this.file.createFile(this.file.tempDirectory, 'SG-audio.m4a', true).then(() => {
      this.audioFile = this.media.create(this.file.tempDirectory.replace(/^file:\/\//, '') + 'SG-audio.m4a');
      this.audioFile.startRecord();
      this.isRecording = true;
    });
  }

  stopRecord() {
    this.isRecording = false;
    if (this.audioFile) {
      this.audioFile.stop();
      this.audioFile.release();
    }
  }

  play() {
    if (!this.isRecording && this.audioFile) {
      this.isPlaying = true;
      this.audioFile.play();
    } else {
      console.log("Cannot play while recording");
    }
  }

  pause() {
    if (!this.isRecording && !this.isPaused) {
      this.isPaused = true;
      this.isPlaying = false;
      this.audioFile.pause();
    } else if (this.isPaused) {
      this.isPaused = false;
      this.audioFile.play();
    }
  }

  stop() {
    if (!this.isRecording && this.isPlaying) {
      this.isPlaying = false;
      this.audioFile.stop();
    }
  }

  recording() {
    return this.isRecording;
  }

  playing() {
    return this.isPlaying;
  }

  paused() {
    return this.isPaused;
  }

}
