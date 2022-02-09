package com.nicholasadamou.upload.service.util;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileOutputStream;
import java.util.Objects;

@Component
public class Utilities {
	public boolean isFileUploadCompleted(String contentRange) {
		String[] rangeAndSize = contentRange.split("/");
		String[] rangeParts = rangeAndSize[0].split("-");

		int maxFileSize = Integer.parseInt(rangeAndSize[1]);
		int currentFileSize = Integer.parseInt(rangeParts[1]);

		return currentFileSize == maxFileSize;
	}

	public String getFileNameWithoutExtension(String fileName) {
		String[] fileNameParts = Objects.requireNonNull(fileName).split("\\.");

		return fileNameParts[0];
	}

	public void appendDataToFile(MultipartFile file, String filePath) {
		try {
			byte[] data = file.getBytes();

			FileOutputStream fileOutputStream = new FileOutputStream(filePath, true);

			fileOutputStream.write(data);
			fileOutputStream.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
