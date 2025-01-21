const fs = require("fs");
const path = require("path");

// Mapping extensions to folder names.
const fileCategories = {
    Images: [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tiff"],//file with these extensions categorized as images. 
    Documents: [".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".txt", ".csv"],
    Videos: [".mp4", ".mkv", ".avi", ".mov", ".flv"],
    Audio: [".mp3", ".wav", ".aac", ".flac"],
    Others: [] // Anything that doesn't match goes here.
};

// Create folders for each category if they don't exist.
const createFolders = (basePath) => {
    Object.keys(fileCategories).forEach((category) => {//Object.keys(array) - return arrays of all keys inside object.
        const folderPath = path.join(basePath, category);//creates the path for the folder according to their catagory.
        if (!fs.existsSync(folderPath)) {//If the folder does not exist , then created here.
            fs.mkdirSync(folderPath);
        }
    });    
};

// Get the category for a file based on its extension
const getCategory = (fileName) => {
    const ext = path.extname(fileName).toLowerCase();//extracts the extension from the given fileName.
    for (const [category, extensions] of Object.entries(fileCategories)) {//do this for all category of fileCategories
        if (extensions.includes(ext)) {//if ext fall in the array of extensions
            return category;//then return the category accordingly
        }
    }
    return "Others";
};

// Move a file to its category folder
const moveFile = (filePath, categoryFolder, summary) => {
    const fileName = path.basename(filePath);
    const destPath = path.join(categoryFolder, fileName);

    fs.renameSync(filePath, destPath);
    summary.push(`Moved: ${fileName} -> ${categoryFolder}`);
};

// Main function to organize files
const organizeFiles = (directoryPath) => {
    const summary = [];
    if (!fs.existsSync(directoryPath)) {
        console.log("DIRECTORY_DOES_NOT_EXIST");
        return;
    }

    // Create folders
    createFolders(directoryPath);

    // Read directory contents
    const items = fs.readdirSync(directoryPath);

    items.forEach((item) => {
        const fullPath = path.join(directoryPath, item);

        // Skip directories
        if (fs.statSync(fullPath).isDirectory()) {
            return;
        }

        const category = getCategory(item);
        const categoryFolder = path.join(directoryPath, category);

        moveFile(fullPath, categoryFolder, summary);
    });

    // Log operations to summary.txt
    const summaryPath = path.join(directoryPath, "summary.txt");
    fs.writeFileSync(summaryPath, summary.join("\n"), "utf8");
    console.log("File organization complete. Summary written to summary.txt.");
};

// User Input: Directory Path
const inputDirectory = process.argv[2];

if (!inputDirectory) {
    console.log("Usage: node fileOrganizer.js <directoryPath>");
} else {
    organizeFiles(inputDirectory);
}
