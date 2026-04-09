function convertImage() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select a file.");
        return;
    }

    if (file.type !== "image/jpeg") {
        alert("Only JPEG allowed.");
        return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {
        const img = new Image();

        img.onload = function () {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;

            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);

            // Convert to PNG
            const pngUrl = canvas.toDataURL("image/png");

            const link = document.getElementById("downloadLink");
            link.href = pngUrl;
            link.download = "converted.png";
            link.style.display = "inline";
            link.textContent = "Download PNG";
        };

        img.src = e.target.result;
    };

    reader.readAsDataURL(file);
}