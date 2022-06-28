
const ImageLoaderWorker = new Worker("/script/imageLoaderWorker.js"); 
const imgElements = document.querySelectorAll('img[data-src]');

imgElements.forEach(imageElement => { 
    const imageURL = imageElement.getAttribute('data-src'); 
    ImageLoaderWorker.postMessage(imageURL); 
}); 
 

ImageLoaderWorker.addEventListener('message', event => { 
    const imageData = event.data; 
    const imageElement = document.querySelectorAll('img[data-src=\'' + imageData.imageURL + '\']'); 
    const objectURL = URL.createObjectURL(imageData.blob); 
    imageElement[0].setAttribute('src', objectURL); 
    imageElement[0].removeAttribute('data-src'); 
});

