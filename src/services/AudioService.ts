import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

export class AudioService {
  private static soundObjects: Map<string, Audio.Sound> = new Map();

  static async playAudio(audioUrl: string): Promise<void> {
    try {
      // Check if it's a local file or URL
      const isLocalFile = !audioUrl.startsWith('http');
      const uri = isLocalFile 
        ? `${FileSystem.bundleDirectory}assets/audio/${audioUrl}`
        : audioUrl;

      // Check if sound is already loaded
      let sound = this.soundObjects.get(audioUrl);
      
      if (!sound) {
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri },
          { shouldPlay: false }
        );
        sound = newSound;
        this.soundObjects.set(audioUrl, sound);
      }

      // Stop if already playing
      const status = await sound.getStatusAsync();
      if (status.isLoaded && status.isPlaying) {
        await sound.stopAsync();
        await sound.setPositionAsync(0);
      }

      await sound.playAsync();
    } catch (error) {
      console.error('Error playing audio:', error);
      // Fallback: Don't throw error, just log it
    }
  }

  static async stopAudio(audioUrl: string): Promise<void> {
    try {
      const sound = this.soundObjects.get(audioUrl);
      if (sound) {
        await sound.stopAsync();
      }
    } catch (error) {
      console.error('Error stopping audio:', error);
    }
  }

  static async stopAllAudio(): Promise<void> {
    try {
      for (const sound of this.soundObjects.values()) {
        await sound.stopAsync();
      }
    } catch (error) {
      console.error('Error stopping all audio:', error);
    }
  }

  static async preloadAudio(audioUrls: string[]): Promise<void> {
    try {
      await Promise.all(
        audioUrls.map(async (audioUrl) => {
          if (!this.soundObjects.has(audioUrl)) {
            const isLocalFile = !audioUrl.startsWith('http');
            const uri = isLocalFile 
              ? `${FileSystem.bundleDirectory}assets/audio/${audioUrl}`
              : audioUrl;

            const { sound } = await Audio.Sound.createAsync(
              { uri },
              { shouldPlay: false }
            );
            this.soundObjects.set(audioUrl, sound);
          }
        })
      );
    } catch (error) {
      console.error('Error preloading audio:', error);
    }
  }

  static async unloadAudio(audioUrl: string): Promise<void> {
    try {
      const sound = this.soundObjects.get(audioUrl);
      if (sound) {
        await sound.unloadAsync();
        this.soundObjects.delete(audioUrl);
      }
    } catch (error) {
      console.error('Error unloading audio:', error);
    }
  }

  static async cleanup(): Promise<void> {
    try {
      for (const [url, sound] of this.soundObjects.entries()) {
        await sound.unloadAsync();
        this.soundObjects.delete(url);
      }
    } catch (error) {
      console.error('Error cleaning up audio:', error);
    }
  }

  static async recordAudio(): Promise<string | null> {
    try {
      // Request permissions
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        throw new Error('Audio recording permission not granted');
      }

      // Set audio mode for recording
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Create recording
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      
      await recording.startAsync();
      
      // Return recording object for manual stop
      return recording as any; // Simplified for demo
    } catch (error) {
      console.error('Error starting recording:', error);
      return null;
    }
  }

  static async stopRecording(recording: any): Promise<string | null> {
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      return uri;
    } catch (error) {
      console.error('Error stopping recording:', error);
      return null;
    }
  }
}
