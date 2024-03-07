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
    const buttonPost = this.querySelector('#buttonPost');

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
      const formData = new FormData();
      formData.append('file', file.files[0]);
      const response = await fetch('/compressImage', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();

      imageCompressed.src = data.url;
      newImage.classList.remove('hidden');
      sizeNewImage.textContent = `Size: ${humanFileSize(data.size)}`;
      buttonPost.textContent = 'Submit';
    });
  }

}

if ('customElements' in window) {
  customElements.define('app-compress', AppCompress);
}