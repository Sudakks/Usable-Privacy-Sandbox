document.addEventListener("DOMContentLoaded", function () {
    var backButton = document.querySelector(".backButton");
    backButton.addEventListener("click", function () {
        //window.location.href = "../popup.html";
        backModal.style.display = "block";
    });

    var saveModal = document.getElementById("saveModal");
    var saveBtn = document.querySelector(".saveButton");
    var close = document.querySelectorAll(".close");
    var discardBtn = document.querySelector(".discardButton");
    var discardModal = document.getElementById("discardModal");

    saveBtn.addEventListener("click", function () {
        saveModal.style.display = "block";
    });
    discardBtn.addEventListener("click", function () {
        discardModal.style.display = "block";
    });
    close.forEach((btn) => {
        btn.addEventListener("click", () => {
            if (discardModal.contains(btn)) {
                discardModal.style.display = "none";
            }
            else if (saveModal.contains(btn)) {
                saveModal.style.display = "none";
            }
            else if (backModal.contains(btn)) {
                backModal.style.display = "none";
            }
            else {
                console.error('Couldn\'t find close button');
            }
        });
    });
});

$(document).ready(function () {
    function showPopupMessage(message) {
        $('#popupMessage').text(message).fadeIn();

        setTimeout(function () {
            $('#popupMessage').fadeOut();
            $('#saveModal').fadeOut();
        }, 1000); // Message shows for 1.5 seconds
    }

    function showPopupMessageAndBack(message) {
        $('#popupMessage').text(message).fadeIn();

        setTimeout(function () {
            $('#popupMessage').fadeOut();
            $('#backModal').fadeOut();

            // ��popupMessageչʾ��0s������תpopup.html
            setTimeout(function () {
                window.location.href = "../popup.html";
            }, 0);

        }, 1000);  // ��ʾ #popupMessage ��1sʱ��
    }


    function onlyExit() {
        $('#discardModal').fadeOut();
    }

    $('#saveUpdate').click(function () {
        showPopupMessage('Save & Update Successful!');
    });

    $('#saveNoUpdate').click(function () {
        showPopupMessage('Only Saved Changes!');
    });

    $('#Cancel').click(function () {
        onlyExit();
    });

    $('#Confirm').click(function () {
        onlyExit();
    });

    /* process checkbox */
    var confirmBack = document.getElementById("confirmBack");
    confirmBack.addEventListener("click", () => {
        var operation = null;
        var obj = document.getElementsByName("backOption")
        for (var i = 0; i < obj.length; i++) { //����Radio 
            if (obj[i].checked) {
                operation = obj[i].value;
                break;
            }
        }

        if (operation === "save-only") {
            showPopupMessageAndBack('Only Saved Changes!');
        }
        else if (operation === "save-update") {
            showPopupMessageAndBack('Save & Update Successful!');
        }
        else if (operation === "discard") {
            window.location.href = "../popup.html";
        }
    });
});
