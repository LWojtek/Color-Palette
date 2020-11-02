// Global selections and variables

const colorDivs = document.querySelectorAll('.color');
const generateBtn = document.querySelector('.generate');
const sliders = document.querySelectorAll('input[type="range"]');
const currentHexes = document.querySelectorAll('.color h2');


let initialColors;

// e v e n t   l i s t e n e r s 

generateBtn.addEventListener('click', () => {
      randomColors();
});


sliders.forEach(slider => {
      slider.addEventListener('input', hslControls);

})

colorDivs.forEach((div, index) => {
      div.addEventListener('change', () => {
            updateTextUI(index)
      })
})

// Functions

// color generator
function generateHex() {
      const hexColor = chroma.random(); // chroma library - random color generator
      return hexColor;
}

// randomColors

function randomColors() {
      // initial colors
      initialColors = [];
      colorDivs.forEach((div, index) => {
            const hexText = div.children[0];
            const randomColor = generateHex();
            // add to array 
            initialColors.push(chroma(randomColor).hex());

            // add color to background
            div.style.backgroundColor = randomColor;
            hexText.innerText = randomColor;
            // check text contrast
            checkTextContrast(randomColor, hexText)




            //initial colorize sliders
            const color = chroma(randomColor);
            const sliders = div.querySelectorAll('input');
            const hue = sliders[0];
            const brightness = sliders[1];
            const saturation = sliders[2];

            colorizeSliders(color, hue, brightness, saturation);

            // check icon contrast

            const activeDiv = colorDivs[index];
            const icons = activeDiv.querySelectorAll('.controls button');

            for (icon of icons) {
                  checkTextContrast(color, icon);
            }
      })

      resetInputs();
}

function checkTextContrast(color, text) {
      const luminance = chroma(color).luminance();
      if (luminance > 0.5) {
            text.style.color = 'black';
      } else {
            text.style.color = 'white';
      }
}

function colorizeSliders(color, hue, brightness, saturation) {
      // scale saturation
      const noSat = color.set('hsl.s', 0);
      const fullSat = color.set('hsl.s', 1);
      const scaleSat = chroma.scale([noSat, color, fullSat]);

      // scale brightness 
      const midBright = color.set('hsl.l', 0.5);
      const scaleBrightness = chroma.scale(['black', midBright, 'white'])



      // update input colors
      saturation.style.backgroundImage = `linear-gradient(to right, ${scaleSat(0)}, ${scaleSat(1)})`;
      brightness.style.backgroundImage = `linear-gradient(to right, ${scaleBrightness(0)},${scaleBrightness(0.5)}, ${scaleBrightness(1)})`;

      hue.style.backgroundImage = `linear-gradient(to right, rgb(204, 75, 75), rgb(204, 204, 75), rgb(75,204,75), rgb(75, 204,204), rgb(75,75,204), rgb(204,75,75), rgb(204,75,75))`

}

function hslControls(e) {
      const index = e.target.getAttribute('data-bright') || e.target.getAttribute('data-sat') || e.target.getAttribute('data-hue');

      let sliders = e.target.parentElement.querySelectorAll('input[type="range"]')
      const hue = sliders[0];
      const brightness = sliders[1];
      const saturation = sliders[2]

      const bgColor = initialColors[index];
      console.log(bgColor);


      let color = chroma(bgColor)
            .set('hsl.s', saturation.value)
            .set('hsl.l', brightness.value)
            .set('hsl.h', hue.value)

      colorDivs[index].style.backgroundColor = color;


      // colorize inputs/sliders 

      colorizeSliders(color, hue, brightness, saturation)

}

function updateTextUI(index) {

      const activeDiv = colorDivs[index];
      const color = chroma(activeDiv.style.backgroundColor);
      const textHex = activeDiv.querySelector('h2');
      const icons = activeDiv.querySelectorAll('.controls button');

      textHex.innerText = color.hex();

      // check contrast 
      checkTextContrast(color, textHex);

      for (icon of icons) {
            checkTextContrast(color, icon);
      }

}

function resetInputs() {
      const sliders = document.querySelectorAll('.sliders input');

      sliders.forEach(slider => {
            if (slider.name === 'hue') {
                  const hueColor = initialColors[slider.getAttribute('data-hue')]
                  const hueValue = chroma(hueColor).hsl()[0]
                  slider.value = Math.floor(hueValue);
            }
            if (slider.name === 'brightness') {
                  const brightColor = initialColors[slider.getAttribute('data-bright')]
                  const brightValue = chroma(brightColor).hsl()[2]
                  slider.value = Math.floor(brightValue * 100) / 100;
            }
            if (slider.name === 'saturation') {
                  const satColor = initialColors[slider.getAttribute('data-sat')]
                  const satValue = chroma(satColor).hsl()[1]
                  slider.value = Math.floor(satValue * 100) / 100;
            }
      })
}

randomColors();