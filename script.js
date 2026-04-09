let droppedFiles = [];

// Drag & Drop logic
const dropZone = document.getElementById("dropZone");

dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.classList.add("dragover");
});

dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("dragover");
});

dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.classList.remove("dragover");

    droppedFiles = Array.from(e.dataTransfer.files);
    document.getElementById("fileInput").files = e.dataTransfer.files;
});

// Main conversion
function convertImages() {
    const inputFiles = document.getElementById("fileInput").files;
    const files = droppedFiles.length ? droppedFiles : Array.from(inputFiles);

    const fromFormat = document.getElementById("fromFormat").value;
    const toFormat = document.getElementById("toFormat").value;

    const resultsDiv = document.getElementById("results");
    const progressBar = document.getElementById("progressBar");
    const status = document.getElementById("status");

    resultsDiv.innerHTML = "";
    progressBar.style.width = "0%";

    if (!files.length) {
        alert("Select or drop files.");
        return;
    }

    let completed = 0;

    files.forEach((file, index) => {

        if (file.type !== fromFormat) {
            const msg = document.createElement("p");
            msg.textContent = `Skipped ${file.name}`;
            resultsDiv.appendChild(msg);
            updateProgress(++completed, files.length);
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

                const convertedUrl = canvas.toDataURL(toFormat);

                const link = document.createElement("a");
                const ext = toFormat.split("/")[1];

                link.href = convertedUrl;
                link.download = `converted_${index}.${ext}`;
                link.textContent = `Download ${file.name}`;

                resultsDiv.appendChild(link);

                updateProgress(++completed, files.length);
            };

            img.src = e.target.result;
        };

        reader.readAsDataURL(file);
    });

    function updateProgress(done, total) {
        const percent = Math.round((done / total) * 100);
        progressBar.style.width = percent + "%";
        status.textContent = `Processing: ${percent}%`;
    }
}