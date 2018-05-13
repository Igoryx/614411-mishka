(function(){
  var buttons = document.querySelectorAll("[data-modal-button]");
  var activeModalClass = "modal-opened";
  var modal = document.querySelector("[data-modal]");
  var showModal = function(){
    document.body.classList.add(activeModalClass);
  };

  var hideModal = function(){
    document.body.classList.remove(activeModalClass);
  };

  document.body.addEventListener("click", hideModal);

  document.addEventListener("keydown", function(event){
    if (event.keyCode === 27 && document.body.classList.contains(activeModalClass)){
      hideModal();
    };
  })

  modal.addEventListener("click", function(event){
    event.stopPropagation();
  })

  Array.prototype.slice.call(buttons).forEach(function(button){
    button.addEventListener("click", function(event){
      event.preventDefault();
      event.stopPropagation();
      showModal();
    });
  });

})();
