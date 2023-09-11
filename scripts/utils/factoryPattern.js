// Super-classe Media
class Media {
  constructor(title, likes, photographerId, id, portrait) {
    this.title,
    this.likes,
    this.photographerId,
    this.id,
    this.portrait;
  }
}

// Sous-classe Image
class Image extends Media {
  constructor(title, likes, photographerId, id, portrait, imageUrl) {
    super(title, likes, photographerId, id);
    this.imageUrl = `../assets/photographers/${portrait}`;
  }
}
// Sous-classe Video
class Video extends Media {
  constructor(title, likes, photographerId, id, portrait, videoUrl) {
    super(title, likes, photographerId, id);
    this.videoUrl = `../assets/photographers/${portrait}`;
    this.controls = true;
  }
}

console.log(Media, Image, Video);
// Factory Pattern ! Creation media
class MediaFactory {
  static createMedia(data) {
    if (data.type === 'image') {
      return new Image(data.title, data.likes, data.photographerId, data.id, data.imageUrl);
    } if (data.type === 'video') {
      return new Video(data.title, data.likes, data.photographerId, data.id, data.videoUrl);
    }
    throw new Error('Type de média non reconnu');
  }
}
const imageData = {
  type: 'image', id: 1, title: 'Belle image', imageUrl: 'path/to/image.jpg',
};
const videoData = {
  type: 'video', id: 2, title: 'Vidéo impressionnante', videoUrl: 'path/to/video.mp4',
};

const imageInstance = MediaFactory.createMedia(imageData);
const videoInstance = MediaFactory.createMedia(videoData);
