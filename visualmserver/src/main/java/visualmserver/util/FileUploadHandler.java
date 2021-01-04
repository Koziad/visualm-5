package visualmserver.util;

import visualmserver.exceptions.InvalidDataException;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.util.*;

public class FileUploadHandler {
    private static String PARENT_DIR = new File(System.getProperty("user.dir")).toString();
    public static List<String> WHITELIST = Arrays.asList("jpg", "jpeg", "png");

    /**
     * Creates a file from a Base64 String and writes it to the given path on the server
     *
     * @param data         - Base64 String for the file that needs to be created
     * @param path         - Path where the file needs to be saved
     * @param absolutePath - Absolute path of the file for reference
     * @return Absolute path where the file is stored
     * @throws IOException
     */
    public static String upload(String data, String path, String absolutePath) throws IOException {

        String[] dataParts = data.split(",");
        // data={type}/{extension};base64. First split the ;base64 part and then split the everything after the / to get the file extension
        String fileExtension = dataParts[0].split(";")[0].split("/")[1];

        // Check for valid data types
        if (!WHITELIST.contains(fileExtension)) {
            throw new InvalidDataException("File is not of type jpg or png");
        }

        byte[] imgBytes = Base64.getDecoder().decode(dataParts[1]);

        File dir = new File(String.format("%s%s", PARENT_DIR, path));
        String fileName = String.format("%s.%s", UUID.randomUUID().toString(), fileExtension);

        // Create directories if not created yet
        if (!dir.exists()) {
            dir.mkdirs();
        }

        try (FileOutputStream fos = new FileOutputStream(String.format("%s/%s", dir, fileName))) {
            fos.write(imgBytes);
            fos.flush();
        }

        // return absolute path instead of relative path
        return String.format("%s%s", absolutePath, fileName);
    }

    public static String upload(String data, String path) throws IOException {
        String[] dataParts = data.split(",");
        // data={type}/{extension};base64. First split the ;base64 part and then split the everything after the / to get the file extension
        String fileExtension = dataParts[0].split(";")[0].split("/")[1];

        // Check for valid data types
        if (!WHITELIST.contains(fileExtension)) {
            throw new InvalidDataException("File is not of type jpg or png");
        }

        byte[] imgBytes = Base64.getDecoder().decode(dataParts[1]);
        File dir = new File(String.format("%s%s", PARENT_DIR, path));

        String fileName = String.format("%s.%s", UUID.randomUUID().toString(), fileExtension);

        // Create directories if not created yet
        if (!dir.exists()) {
            dir.mkdirs();
        }

        System.out.printf("%s/%s\n%s\n", dir, fileName, PARENT_DIR);

        try (FileOutputStream fos = new FileOutputStream(String.format("%s/%s", dir, fileName))) {
            fos.write(imgBytes);
            fos.flush();
        }

        // return absolute path instead of relative path
        return String.format("%s%s", path, fileName);
    }

    public static String getFileBase64(String path) throws IOException {
        File requestedFile = new File(String.format("%s%s", PARENT_DIR, path));

        if (requestedFile.exists()) {
            byte[] encoded = Files.readAllBytes(requestedFile.toPath());

            return Base64.getEncoder().encodeToString(encoded);
        }

        return null;
    }

}
