export const onClientEntry = (_, pluginOptions) => {
  // Inject styles.
  const styles = `
    .modal {
      opacity: 0;
      position: fixed;
      z-index: -1;
      top: 0;
      left: 0;
      padding: 2vh 0;
      width: 100%;
      height: 100%;
      overflow: auto;
      background-color: rgb(0,0,0);
      background-color: rgba(0,0,0,0.9);
      transform: scale(1.1);
      transition: transform 200ms, opacity 300ms, z-index 400ms;
      pointer-events: none;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
    }

    .modal.show {
      transform: scale(1);
      opacity: 1;
      z-index: 350;
      pointer-events: auto;
    }

    .modal.show:hover {
      cursor: zoom-out;
    }

    .gatsby-resp-image-wrapper:hover {
      cursor: zoom-in;
    }

    .modal__content picture {
      width: auto;
      height: 83vh;
      position: relative !important;
    }

    .modal__content img {
      object-fit: contain;
      object-position: center center;
      box-shadow: none !important;
    }

    .modal__content {
      margin: auto;
      display: grid;
      width: 90%;
    }

    #modal-caption {
      font-family: 'base-mono-wide', 'Andale Mono', 'AndaleMono', 'Lucida Console', 'Lucida Sans Typewriter', 'Bitstream Vera Sans Mono', monospace;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 90%;
      height: 13vh;
      max-width: 700px;
      text-align: center;
      color: #ccc;
    }

    .modal__close {
      position: absolute;
      top: 15px;
      right: 35px;
      color: #f1f1f1;
      font-size: 40px;
      font-weight: bold;
      transition: 0.3s;
    }

    .modal__close:hover,
    .modal__close:focus {
      color: #bbb;
      text-decoration: none;
      cursor: pointer;
    }

    /* 100% Image Width on Smaller Screens */
    @media only screen and (max-width: 700px){
      .modal__content {
        width: 100%;
      }
    }
  `;

  const node = document.createElement(`div`);
  node.id = `modal`;
  node.classList = `modal`;
  node.innerHTML = `
  <div class="modal__content" id="modal-picture"></div>
  <div id="modal-caption"></div>`;
  document.body.append(node);
  const styleEl = document.createElement(`style`);
  styleEl.id = `zoom-style`;
  styleEl.innerHTML = styles;
  document.head.appendChild(styleEl);
};

export const onRouteUpdate = (_, pluginOptions) => {
  runZoom();
};

function runZoom() {
  var modal = document.getElementById("modal");
  var modalImg = document.getElementById("modal-picture");
  var captionText = document.getElementById("modal-caption");
  var isModalVisible = false;
  let children = [...document.querySelectorAll(".gatsby-resp-image-wrapper")];
  if (children.length == 0) {
    let spans = document.getElementsByTagName("span");
    for (let i = 0; i < spans.length; ++i) {
      if (spans[i].className == "gatsby-resp-image-wrapper") {
        children.push(spans[i]);
      }
    }
    if (children.length == 0) {
      console.log(document.getElementsByTagName("span"));
      console.log(document);
      console.log(children);
      console.log("No pictures found on this page");
      return;
    }
  }
  children.map((element) => {
    element.onclick = function (e) {
      let picture = this.getElementsByTagName("picture")[0];
      let imgElement = this.getElementsByTagName("img")[0];
      modalImg.innerHTML = picture.outerHTML;
      captionText.innerHTML = imgElement.alt ? imgElement.alt : "";
      isModalVisible = true;
      modal.classList.add("show");
      e.stopPropagation();
    };
  });

  window.onclick = function (e) {
    if (isModalVisible) {
      hideModal();
    }
  };

  window.onscroll = function () {
    if (isModalVisible) {
      hideModal();
    }
  };

  function hideModal() {
    modal.classList.remove("show");
    isModalVisible = false;
  }
}
