import * as tf from '@tensorflow/tfjs';

function imageUploaded(event) {
    const target = event.target;
    const file = target.files[0];

    if (!file) return;

    firstClass.innerHTML = "";
    secondClass.innerHTML = "";
    loadingGif.style.display = "block";
    imageContainer.src = "";

    const imageUrl = window.webkitURL.createObjectURL(file);
    imageContainer.src = imageUrl;

    let reader = new FileReader();

    reader.onload = readerEvent => {
        let img = document.createElement('img');
        img.src = readerEvent.target.result;
        img.width = 224;
        img.height = 224;
        img.onload = () => normalizeImage(img);
    };

    reader.readAsDataURL(file);
}

function normalizeImage(img) {
            let tensor = tf.fromPixels(img)
            .resizeNearestNeighbor([224,224])
            .toFloat()
            .expandDims();

        let predictions = model.predict(tensor).data();
        console.log(predictions);

    // firstClass.innerHTML = `문제있음: ${ad_percentage}`;
    // secondClass.innerHTML = `문제없음: ${cn_percentage}`;
    // loadingGif.style.display = "none";
        return ;
}



function ready() {
    firstClass = document.querySelector("#firstClass");
    secondClass = document.querySelector("#secondClass");
    imageContainer = document.querySelector("#imageContainer");
    loadingGif = document.querySelector("#loadingGif");

    activationCanvas = document.querySelector("#activation_canvas");

    const inputFile = document.querySelector("#image");
    inputFile.addEventListener('change', imageUploaded);

    const example_button = document.querySelector("#example_button");
    example_button.addEventListener('click', runExample);
}

function runExample() {
    loadingGif.style.display = "block";
    const url = "./assets/img.jpg";;
    let img = new Image(224, 224);
    img.src = url;

    imageContainer.src = url;

    img.onload = () => makePrediction(img);
}

document.addEventListener("DOMContentLoaded", ready);

let model;
let firstClass;
let secondClass;
let imageContainer;
let loadingGif;
let activationCanvas;

(async function() {
    model = await tf.loadLayersModel('/assets/model/model.json');
})();