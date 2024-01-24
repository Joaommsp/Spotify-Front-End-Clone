const libraryCreate = document.querySelector(".library-create");
libraryCreate.addEventListener("mouseenter", handleScrolLibrary);
libraryCreate.addEventListener("mouseleave", closeScrollLibrary);

function handleScrolLibrary() {
  let style = document.createElement("style");

  style.innerHTML = `
  .library-create::-webkit-scrollbar-thumb {
      background-color: #6d6d6d;
  }
  `;
  document.head.appendChild(style);

}
