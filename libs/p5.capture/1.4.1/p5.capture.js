/**
 * p5.capture
 * Модуль для захвата видео и изображений из p5.js
 * Версия: 1.4.1
 */

(function() {
    'use strict';

    class Capture {
        constructor() {
            this.options = {
                format: 'png',
                quality: 1,
                framerate: 30,
                width: 0,
                height: 0,
                duration: 5
            };
            
            this.recording = false;
            this.frames = [];
            this.startTime = 0;
            this.canvas = null;
        }
        
        start(options = {}) {
            this.canvas = p5.instance._renderer.canvas;
            this.options = { ...this.options, ...options };
            this.recording = true;
            this.frames = [];
            this.startTime = performance.now();
            
            console.log('Started recording...');
        }
        
        stop() {
            this.recording = false;
            console.log('Recording stopped.');
            return this.frames;
        }
        
        update() {
            if (this.recording) {
                const currentTime = performance.now();
                if ((currentTime - this.startTime) / 1000 > this.options.duration) {
                    this.stop();
                    return;
                }
                
                const frame = this.canvas.toDataURL(`image/${this.options.format}`, this.options.quality);
                this.frames.push(frame);
            }
        }
        
        saveFrames(filename = 'capture', extension = 'png') {
            for (let i = 0; i < this.frames.length; i++) {
                const link = document.createElement('a');
                link.download = `${filename}_${i}.${extension}`;
                link.href = this.frames[i];
                link.click();
            }
        }
        
        snapshot(filename = 'screenshot') {
            const frame = this.canvas.toDataURL(`image/${this.options.format}`, this.options.quality);
            const link = document.createElement('a');
            link.download = `${filename}.${this.options.format}`;
            link.href = frame;
            link.click();
        }
    }
    
    p5.prototype.Capture = Capture;
})(); 