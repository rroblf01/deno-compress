class AppCompress extends HTMLElement {
  constructor() {
    super();

    this.innerHTML = /*html*/`<div class="flex flex-col items-center justify-center p-12">
      <div class="mx-auto w-full max-w-[550px]">
        <h1 class="text-3xl font-bold text-[#6A64F1] text-center mb-8">Compress Image</h1>
        <form action="/createElement" method="POST" id="formApi">
          <div class="flex flex-col items-center justify-center">
            <input
              type="file"
              id="file"
              name="file"
            />
            <img id="image" class="hidden" />
            <p class="text-[#6A64F1] text-center mt-3" id="sizeOldImage"></p>
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
            <button
              class="hover:shadow-form rounded-md bg-[#6A64F1] py-3 px-8 text-center text-base font-semibold text-white mt-3"
              id="buttonPost"
            >
              Submit
            </button>
          </div>
        </form>

        <div class="mt-8 hidden" id="newImage">
          <h1 class="text-3xl font-bold text-[#6A64F1] text-center mb-8"> Image Compressed</h1>
          <p class="text-[#6A64F1] text-center mt-3" id="sizeNewImage"></p>
          <img id="imageCompressed" />
        </div>
      </div>
    </div>`;
  }

  connectedCallback() {
    const formApi = this.querySelector('#formApi');
    const file = this.querySelector('#file');
    const image = this.querySelector('#image');
    const imageCompressed = this.querySelector('#imageCompressed');
    const newImage = this.querySelector('#newImage');
    const sizeOldImage = this.querySelector('#sizeOldImage');
    const sizeNewImage = this.querySelector('#sizeNewImage');
    const quality = this.querySelector('#quality');
    const qualityValue = this.querySelector('#qualityValue');
    const buttonPost = this.querySelector('#buttonPost');

    quality.addEventListener('input', (e) => {
      qualityValue.textContent = `Calidad: ${e.target.value}`;
    });

    const humanFileSize = (bytes, dp = 1) => {
      const thresh = 1024;

      if (Math.abs(bytes) < thresh) {
        return bytes + ' B';
      }

      const units = ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
      let u = -1;
      const r = 10 ** dp;

      do {
        bytes /= thresh;
        ++u;
      } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);


      return bytes.toFixed(dp) + ' ' + units[u];
    }

    file.addEventListener('change', (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = function (e) {
        image.src = e.target.result;
        image.classList.remove('hidden');
        sizeOldImage.textContent = `Size: ${humanFileSize(file.size)}`;
      };
      reader.readAsDataURL(file);
    });

    formApi.addEventListener('submit', async (e) => {
      e.preventDefault();
      buttonPost.textContent = 'Loading...';
      const ext = this.querySelector('#formatExt');
      const blob = await this.compressImage(file.files[0], quality.value, ext.value);

      imageCompressed.src = URL.createObjectURL(blob);
      newImage.classList.remove('hidden');
      console.log(blob);
      const diffPercentage = (((file.files[0].size - blob.size) / file.files[0].size) * 100).toFixed(2);
      const message = diffPercentage > 0 ? `Reduced ${diffPercentage}%` : `Increased ${Math.abs(diffPercentage)}%`;
      sizeNewImage.textContent = `Size: ${humanFileSize(blob.size)} (${message})`;
      buttonPost.textContent = 'Submit';

    });
  }

  compressImage(imageAsFile, quality, ext = "webp") {
    return new Promise((resolve, reject) => {
      const $canvas = document.createElement("canvas");
      const imagen = new Image();
      imagen.onload = () => {
        $canvas.width = imagen.width;
        $canvas.height = imagen.height;
        $canvas.getContext("2d").drawImage(imagen, 0, 0);
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