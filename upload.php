<?php

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    if (!isset($_FILES['file']) || $_FILES['file']['error'] !== 0) {
        die("Error uploading file.");
    }

    $fileTmp = $_FILES['file']['tmp_name'];

    // Validate MIME type
    $mime = mime_content_type($fileTmp);
    if ($mime !== 'image/jpeg') {
        die("Only JPEG files are allowed.");
    }

    // Generate safe file name
    $fileName = uniqid() . '.jpg';
    $uploadPath = "uploads/" . $fileName;

    move_uploaded_file($fileTmp, $uploadPath);

    // Convert to PNG
    $image = imagecreatefromjpeg($uploadPath);

    if (!$image) {
        die("Failed to process image.");
    }

    $outputName = uniqid() . '.png';
    $outputPath = "outputs/" . $outputName;

    imagepng($image, $outputPath);
    imagedestroy($image);

    echo "<h2>Conversion successful!</h2>";
    echo "<a href='$outputPath' download>Download PNG</a>";
}
?>