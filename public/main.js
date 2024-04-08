// import TypeShuffle from './shuffle.js';

async function apiReq(array) {
  try {
    // add prompt to messages
    const message = { pixelArray: array };

    // get response from server api
    const response = await fetch("/writeHaiku", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    // check for error
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // add response to messages
    const responseText = await response.text();

    // return response
    return responseText;
  } catch (error) {
    console.error("Error:", error);
    return `Error: ${error.message}`;
  }
}

const contentContainer = document.getElementById('content');
const intro = document.getElementById('intro');
const fileButton = document.getElementById('custom-file-upload');
const fileUploader = document.getElementById('file-upload');
fileUploader.addEventListener('change', handleImageUpload);
const redrawnCanvas = document.getElementById('outputCanvas');
const redrawnCtx = redrawnCanvas.getContext('2d');
const haikuContainer = document.getElementById('haiku');

function drawImageFromPixelArray(array) {
  let pixelIndex = 0;

  for (let y = 0; y < redrawnCanvas.height; y+=100) {
    for (let x = 0; x < redrawnCanvas.width; x+=100) {
      const [r, g, b] = array[pixelIndex % array.length];
      redrawnCtx .fillStyle = `rgb(${r}, ${g}, ${b})`;
      redrawnCtx .fillRect(x, y, 100, 100);
      pixelIndex++;
    }
  }
}

function calculateHue(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  let hue;

  if (max === min) {
    hue = 0; 
  } else if (max === r) {
    hue = ((g - b) / (max - min)) % 6;
  } else if (max === g) {
    hue = (2 + (b - r) / (max - min)) % 6;
  } else {
    hue = (4 + (r - g) / (max - min)) % 6;
  }

  return hue * 60; 
}

function handleImageUpload(event) {
  console.log('hi');
  intro.style.display = 'none';
  fileButton.style.display = 'none';
  
  const file = event.target.files[0];
  if (!file) {
      return;
  }

  const imageCanvas = document.getElementById('imageCanvas');
  const ctx = imageCanvas.getContext('2d');
  
  const img = new Image();
  img.onload = function () {
    // 2. Set canvas dimensions to match the image
    imageCanvas.width = img.width;
    imageCanvas.height = img.height;
    // const aspectRatio = img.width / img.height;
    const rectSize = 40;
    redrawnCanvas.width = img.width ; // Adjust width as needed
    redrawnCanvas.height = img.height;
    // 3. Draw the image onto the canvas
    ctx.drawImage(img, 0, 0, img.width, img.height);

    // 4. Get pixel data
    const pixelData = ctx.getImageData(0, 0, img.width, img.height).data;
    
    const pixelArray = [];


    for (let y = 0; y < 20; y++) {
      for (let x = 0; x < 20; x++) {
        const px = x * rectSize;
        const py = y * rectSize;
        const i = (py * imageCanvas.width + px) * 4;
        const c = [
          pixelData[i], 
          pixelData[i + 1], 
          pixelData[i + 2], 
        ];
        pixelArray.push(c);
      }
    }

    pixelArray.sort((a, b) => {
      const [r1, g1, b1] = a;
      const [r2, g2, b2] = b;

      const hue1 = calculateHue(r1, g1, b1);
      const hue2 = calculateHue(r2, g2, b2);

      return hue1 - hue2;
    });

    console.log(pixelArray)
    drawImageFromPixelArray(pixelArray);
    
    ///////////////////////////////
    apiReq(pixelArray).then((response) => {
      console.log(response);

      // generateHaikuHTML(result);
      redrawnCanvas.classList.remove('hidden');
      redrawnCanvas.classList.add('reveal');
      contentContainer.style.width = '30%';
    });
  };

  
  img.src = URL.createObjectURL(file);
};


// function generateHaikuHTML(haiku) {

//   haikuContainer.innerHTML='';
//   haiku.forEach(element => {
//     const haikuLine = document.createElement('p');
//     haikuLine.innerText = element
//     haikuLine.classList.add('haikuLine');
//     haikuContainer.append(haikuLine);
//   });
    
//   const ts = new TypeShuffle(haikuContainer);
//   ts.trigger('fx1');
// } 