class AppCompress extends HTMLElement {
  constructor() {
    super();

    this.originalWidth = undefined;
    this.originalHeight = undefined;

    this.innerHTML = /*html*/`<div class="flex flex-col items-center justify-center p-12">
      <div class="mx-auto w-full">
        <h1 class="text-3xl font-bold text-[#6A64F1] text-center mb-8">Compress Image</h1>
        <form action="/createElement" method="POST" id="formApi">
          <div class="flex flex-col items-center justify-center">
            <input
              type="file"
              id="file"
              name="file"
            />
            <img id="hidenImage" class="hidden" />
            <div>
            <span id="qualityValue">Calidad: 50</span>
            <input type="range" step="1" value="50" min="1" max="100" id="quality">
            <span class="ml-5">Format: </span>
            <select id="formatExt" class="mt-3">
            <option value="webp">WebP</option>
            <option value="jpeg">JPEG</option>
            <option value="png">PNG</option>
            </select>
            </div>
            <span id="sizeValue">Size: 100</span>
            <input type="range" step="1" value="100" min="1" max="100" id="size">
            <p class="text-[#6A64F1] text-center mt-3" id="sizeOldImage"></p>
            <img id="image" class="hidden" />
            <div>
            </div>
            <button
              class="hover:shadow-form rounded-md bg-[#6A64F1] py-3 px-8 text-center text-base font-semibold text-white mt-3"
              id="buttonPost"
            >
              Submit
            </button>
          </div>
        </form>

        <div class="mt-8 hidden flex flex-col items-center justify-center" id="newImage">
          <h1 class="text-3xl font-bold text-[#6A64F1] text-center mb-8"> Image Compressed</h1>
          <p class="text-[#6A64F1] text-center mt-3" id="sizeNewImage"></p>
          <img id="imageCompressed" />
        </div>
      </div>
    </div>`;
  }

  connectedCallback() {
    const file = this.querySelector('#file');

    this.querySelector('#quality').addEventListener('input', (e) => {
      const qualityValue = this.querySelector('#qualityValue');
      qualityValue.textContent = `Calidad: ${e.target.value}`;
    });

    this.querySelector('#size').addEventListener('input', (e) => {
      const sizeValue = this.querySelector('#sizeValue');
      sizeValue.textContent = `Size: ${e.target.value}`;
      const image = document.getElementById('image');
      const hidenImage = this.querySelector('#hidenImage');

      image.width = hidenImage.width * (e.target.value / 100);
      image.height = hidenImage.height * (e.target.value / 100);
    });

    const humanFileSize = (bytes, dp = 1) => {
      const thresh = 1024;
      const units = ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

      if (Math.abs(bytes) < thresh) {
        return bytes + ' B';
      }

      let u = -1;
      const r = 10 ** dp;
      do {
        bytes /= thresh;
        ++u;
      } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);

      return bytes.toFixed(dp) + ' ' + units[u];
    }

    file.addEventListener('change', (e) => {
      const fileTarget = e.target.files[0];
      const reader = new FileReader();
      const sizeOldImage = this.querySelector('#sizeOldImage');
      const image = this.querySelector('#image');
      const hidenImage = this.querySelector('#hidenImage');

      reader.onload = function (e) {
        image.src = e.target.result;
        hidenImage.src = e.target.result;

        image.classList.remove('hidden');
        sizeOldImage.textContent = `Size: ${humanFileSize(fileTarget.size)}`;
      };
      reader.readAsDataURL(fileTarget);
    });

    this.querySelector('#formApi').addEventListener('submit', async (e) => {
      e.preventDefault();
      const buttonPost = this.querySelector('#buttonPost');
      buttonPost.textContent = 'Loading...';

      const ext = this.querySelector('#formatExt');
      const fileForm = e.target.file.files[0];
      const blob = await this.compressImage(fileForm, quality.value, ext.value);

      this.querySelector('#imageCompressed').src = URL.createObjectURL(blob);
      this.querySelector('#newImage').classList.remove('hidden');
      const diffPercentage = (((fileForm.size - blob.size) / fileForm.size) * 100).toFixed(2);
      const message = diffPercentage > 0 ? `Reduced ${diffPercentage}%` : `Increased ${Math.abs(diffPercentage)}%`;

      this.querySelector('#sizeNewImage').textContent = `Size: ${humanFileSize(blob.size)} (${message})`;
      buttonPost.textContent = 'Submit';

    });
  }

  compressImage(imageAsFile, quality, ext = "webp") {
    return new Promise((resolve, reject) => {
      const $canvas = document.createElement("canvas");
      const imagen = new Image();
      const imageResize = document.getElementById('image');
      this.querySelector('#size')
      imagen.onload = () => {
        $canvas.width = imageResize.width;
        $canvas.height = imageResize.height;
        $canvas.getContext("2d").drawImage(imagen, 0, 0, imageResize.width, imageResize.height);
        $canvas.toBlob(
          (blob) => {
            if (blob === null) {
              return reject(blob);
            } else {
              resolve(blob);
            }
          },
          `image/${ext}`,
          quality / 100
        );
      };
      imagen.src = URL.createObjectURL(imageAsFile);
    });
  };

}

if ('customElements' in window) {
  customElements.define('app-compress', AppCompress);
}